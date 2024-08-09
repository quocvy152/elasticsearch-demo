const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const DOCKER_ELASTICSEARCH_HOST = 'http://127.0.0.1:9200';

const app = express();
app.use(express.json());

// Kết nối đến Elasticsearch
const client = new Client({
  node: DOCKER_ELASTICSEARCH_HOST,
  auth: {
    username: 'elastic',
    password: '123456'
  }
});

// Route để tạo một index và thêm dữ liệu vào đó
app.post('/add', async (req, res) => {
  const { index, body } = req.body;

  try {
    const result = await client.index({
      index,
      body,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để tìm kiếm dữ liệu trong index
app.get('/search', async (req, res) => {
  const { index, query } = req.query;

  try {
    const result = await client.search({
      index,
      body: {
        "query": {
          "bool": {
            "should": [
              {
                "multi_match": {
                  "query": query,
                  "fields": ["title", "content"],
                  "type": "best_fields"
                }
              },
              {
                "prefix": {
                  "title": query
                }
              },
              {
                "prefix": {
                  "content": query
                }
              }
            ]
          }
        }
      }
    });
    res.status(200).json(result.hits.hits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
