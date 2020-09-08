const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.send(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  repositories.push({
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  });

  return res.send(repositories[0]);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { url, title, techs } = req.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  console.log(repositories);

  if (req.body.likes) {
    return res.status(400).send({ likes: repositories[repoIndex].likes });
  }

  repositories[repoIndex] = {
    id, 
    url,
    title,
    techs,
    likes: repositories[repoIndex].likes,
  }

  return res.send(repositories[repoIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  repositories[repoIndex].likes++;

  return res.send(repositories[repoIndex]);
});

module.exports = app;