const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Queue = require("bull");
const app = express();

const search = require("./scrapper/search");

const port = process.env.PORT || "3000";
// урл редиски приходит из переменных окружения
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Создадим очередь через соединенение с редиской
let workQueue = new Queue("work", REDIS_URL);

workQueue.process(search);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/search", async (req, res) => {
  const dataValue = req.body.post;
  if (!Boolean(dataValue)) {
    res.status(400).send({ error: "no data!" }).end();
    return;
  }
  let searcher = await workQueue.add({ dataValue });
  res.send({ searcherData: { id: searcher.id } });
});

app.get("/api/search/:id", async (req, res) => {
  let workId = req.params.id;
  let job = await workQueue.getJob(workId);

  if (job === null) {
    res.status(404).end();
  } else {
    let state = await job.getState();
    let progress = job._progress;
    let data = job.data;
    res.json({ workId, state, progress, data });
  }
});

// ждем событий, когда воркер закончит работу
workQueue.on("global:completed", (jobId, result) => {
  console.log(`Job ${jobId} completed with result ${result}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
