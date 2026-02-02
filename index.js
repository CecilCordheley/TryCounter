#!/usr/bin/env node

const path = require('path');
const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

console.log("SERVER CJS DÉMARRÉ");
console.log("Chemin courant :", __dirname);
console.log("Fichier courant :", __filename);

// servir tous les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, "public")));

// route pour /interface
app.get('/interface', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'interface', 'index.html'));
});

// serveur principal
app.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}/interface`;
  console.log(`Express → ${url}`);

  // délai pour s'assurer que le serveur écoute avant d'ouvrir le navigateur
  setTimeout(() => {
    if (process.platform === "win32") {
      exec(`start "" "${url}"`);
    } else if (process.platform === "darwin") {
      exec(`open "${url}"`);
    } else {
      exec(`xdg-open "${url}"`);
    }
  }, 1200);
});

// API pour mettre à jour les données
app.post("/api/update", express.json(), (req, res) => {
  const dataPath = path.join(__dirname, "public", "param.json");
  req.body.base = Number(req.body.base);
  fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2), 'utf-8');
  res.json({ status: "ok" });
});

// API pour récupérer les données
app.get("/api/data", (req, res) => {
  const dataPath = path.join(__dirname, "public", "param.json");
  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(data);
  } else {
    res.json({ label: "", base: "" });
  }
});

// garde la console ouverte si une erreur survient
process.on('uncaughtException', (err) => {
  console.error("Erreur non attrapée :", err);
  console.log("Appuyez sur une touche pour quitter...");
  process.stdin.resume();
});
