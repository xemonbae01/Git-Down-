const axios = require("axios");
const JSZip = require("jszip");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

async function downloadFolder(repo, folderPath, options = {}) {
  const cacheKey = `${repo}-${folderPath}-${options.types || ""}-${options.minSize || ""}-${options.maxSize || ""}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const zip = new JSZip();
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${folderPath}`;
  const response = await axios.get(apiUrl);
  const files = response.data;

  for (const file of files) {
    if (file.type === "file") {
      const ext = file.name.split(".").pop();
      if (options.types && !options.types.includes(ext)) continue;

      const fileResp = await axios.get(file.download_url, { responseType: "arraybuffer" });
      const size = fileResp.data.byteLength;

      if ((options.maxSize && size > options.maxSize) || (options.minSize && size < options.minSize)) continue;

      zip.file(file.name, fileResp.data);
    }
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  cache.set(cacheKey, buffer); 
  return buffer;
}

module.exports = { downloadFolder };
                                                          
