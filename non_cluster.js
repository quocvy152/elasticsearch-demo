const express = require('express');

const app = express();

let jobReceivce = [];

function doWork(work) {
  console.log(work);
  jobReceivce.push(work);
}

app.get('/', async (req, res) => {
  console.time('TEST CLUSTER JOB!');

  for (let i = 0; i < 500000; i++) {
    console.log(i);
    jobReceivce.push(i);
  }

  console.timeEnd('TEST CLUSTER JOB!');

  res.status(200).json({
    message: 'Hello World!'
  });
});

app.get('/view', async (req, res) => {
  res.status(200).json({
    message: 'View rendered!'
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port ${8000}`);
});