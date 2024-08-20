const cluster = require('cluster');
const express = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const numCPUs = require('os').cpus().length;
const app = express();

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

} else {
  app.listen(8000, () => {
    console.log(`Server is running on port ${8000}`);
  });

  // Route sử dụng Worker Threads
  app.get('/', async (req, res) => {
    console.time('TEST CLUSTER JOB!');

    // Tạo Worker Thread để xử lý công việc nặng
    const worker = new Worker(__filename, {
      workerData: { iterations: 1000000 }
    });

    worker.on('message', (jobReceivce) => {
      console.timeEnd('TEST CLUSTER JOB!');
      res.status(200).json({
        message: 'Hello World!',
        jobReceivce: jobReceivce.length
      });
    });

    worker.on('error', err => {
      res.status(500).json({
        error: 'Worker error: ' + err.message
      });
    });

    worker.on('exit', code => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  });

  app.get('/view', async (req, res) => {
    res.status(200).json({
      message: 'View rendered!'
    });
  });

  console.log(`Worker ${process.pid} started`);
}

// Phần này sẽ được thực thi trong Worker Thread
if (!isMainThread) {
  const { iterations } = workerData;
  let jobReceivce = [];

  for (let i = 0; i < iterations; i++) {
    console.log(i);
    jobReceivce.push(i);
  }

  // Gửi kết quả về tiến trình con
  parentPort.postMessage(jobReceivce);
}
