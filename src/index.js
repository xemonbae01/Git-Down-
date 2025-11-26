const express = require("express");
const githubRouter = require("./routes/github");

const app = express();
app.use(express.json());

app.use("/api/github", githubRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 GigaGit backend running on port ${PORT}`);
});
