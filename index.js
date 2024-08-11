const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const DOCKER_ELASTICSEARCH_HOST = 'http://127.0.0.1:9200';
const PORT = process.env.PORT || 3000;
const { USER_COLL } = require('./mongodb');

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');

const client = new Client({
  node: DOCKER_ELASTICSEARCH_HOST,
  auth: {
    username: 'elastic',
    password: '123456'
  }
});

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

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello World!'
  });
});

app.post('/users', async (req, res) => {
  try {
    const randomUsername = Math.ceil(Math.random() * 10);
    const randomAge = Math.ceil(Math.random() * 10);

    const infoUser = await USER_COLL.create({
      username: `user_${randomUsername}`,
      age: randomAge
    })

    res.status(200).json({
      message: 'Create user success!',
      data: infoUser
    });
  } catch (error) {
    res.status(404).json({
      message: 'Create user failure!',
      data: null
    });
  }
});

app.get('/users', async (req, res) => {
  try {
    const listUser = await USER_COLL.find({});

    res.render('pages/index', {
      listUser
    })
  } catch (error) {
    res.status(404).json({
      error: true,
      data: null
    });
  }
});

app.get('/remove-users', async (req, res) => {
  try {
    const { userID } = req.query;

    const resultRemove = await USER_COLL.findByIdAndDelete(userID);
    if (!resultRemove) {
      res.status(404).json({
        error: true,
        message: 'Error occurred!'
      })
    } else {
      res.status(200).json({
        error: false,
        data: resultRemove
      })
    }
  } catch (error) {
    res.status(404).json({
      error: true,
      data: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
