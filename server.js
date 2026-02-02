import path from "path";
import express from "express";
import fs  from 'fs';
const app = express();
const PORT = 3000;
app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`Express → http://localhost:${PORT}/interface`);
});
app.post('/api/update', express.json(), (req, res) => {
  const dataPath = path.join(process.cwd(), "public", "param.json");
  let b=req.body.base;
  req.body.base=b*1;
  fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2), 'utf-8');
  res.json({ status: 'ok' });
});
app.get("/api/data", (req, res) => {
  const dataPath = path.join(process.cwd(), "public", "param.json");

  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    res.json(data);
  } else {
    res.json({ label: "", base: "" });
  }
});
