import { useState } from "react";
import axios from "axios";

function App() {
  const [repo, setRepo] = useState("");
  const [path, setPath] = useState("");
  const [types, setTypes] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!repo || !path) {
      alert("Repo and folder path are required!");
      return;
    }

    setLoading(true);

    try {
      const params = {
        repo,
        path,
      };

      if (types) params.types = types;
      if (minSize) params.minSize = minSize;
      if (maxSize) params.maxSize = maxSize;

      const response = await axios.get(
        "https://tetroxide-redwan-production.up.railway.app/api/github/download",
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${repo.replace("/", "_")}_${path}.zip`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed. Check the console for errors.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🚀 GigaGit Downloader</h1>
      <div>
        <label>Repo (e.g. TheSpeedX/TBomb): </label>
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
      </div>
      <div>
        <label>Folder Path (e.g. utils): </label>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
      </div>
      <div>
        <label>File Types (optional, comma separated): </label>
        <input
          type="text"
          value={types}
          onChange={(e) => setTypes(e.target.value)}
        />
      </div>
      <div>
        <label>Min Size (bytes, optional): </label>
        <input
          type="number"
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
        />
      </div>
      <div>
        <label>Max Size (bytes, optional): </label>
        <input
          type="number"
          value={maxSize}
          onChange={(e) => setMaxSize(e.target.value)}
        />
      </div>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Downloading..." : "Download Folder"}
      </button>
    </div>
  );
}

export default App;
          
