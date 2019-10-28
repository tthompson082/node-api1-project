// implement your API here
const express = require('express');
const server = express();

server.use(express.json());

const db = require('./data/db');

server.post('/api/users', (req, res) => {
  const info = req.body;
  if (!info.name || !info.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user' });
  } else {
    db.insert(info)
      .then(user => {
        console.log(user);
        res.status(201).json(user);
      })
      .catch(err =>
        res.status(500).json({
          error: 'There was an error while saving the user to the database'
        })
      );
  }
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => res.json(users))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' })
    );
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user == undefined) {
        res.status(404).json({ message: 'There is no user with that id' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: 'The user information could not be retrieved' })
    );
});

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user => {
      if (user === 0) {
        res.status(404).json({ message: 'There is no user with that id' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err =>
      res.status(500).json({ message: 'The user could not be removed' })
    );
});

server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const info = req.body;
  console.log(info);
  if (!info.name || !info.bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user' });
  } else {
    db.update(id, info)
      .then(user => {
        if (user == 0) {
          res.status(404).json({
            message: 'The user with the specified ID does not exist.'
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: 'The user information ciould not be modified' })
      );
  }
});

const port = 8000;
server.listen(port, () => console.log('\n=== API on port 8000===\n'));
