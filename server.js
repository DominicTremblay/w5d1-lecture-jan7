require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const secret = process.env.secret;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const users = {
  '1': {
    username: 'bob_squarepants',
    email: 'bob@squarepants.com',
    password: 'test',
  },
};

const getToken = (req, res, next) => {
  // Extract the token from the request headers
  // classic
  // const authHeaders = req.headers['authorization'];

  // es6
  const { authorization: authHeaders } = req.headers;

  // const token = authHeaders.split(' ')[1];

  // es6
  const [, token] = authHeaders.split(' ');

  console.log('Token in middleware:', token);

  req.token = token;

  next();
};

const authenticateUser = (email, password) => {
  // retrieve the user with that email and compare the password if we have a user

  const user = Object.values(users).find(userObj => userObj.email === email);

  if (user && user.password === password) {
    return user;
  }

  return false;
};

app.get('/api/hello', (req, res) => {
  res.json({
    messsage: 'Hello API works',
  });
});

app.get('/api/users', getToken, (req, res) => {
  // verify the token

  jwt.verify(req.token, secret, (err, authData) => {
    if (err) {
      res.status(403).send(err);
    } else res.json({ authData, users });
  });

  // Query the database to get the user list
});

app.post('/api/login', (req, res) => {
  // extracting the information from the request

  // classic
  // const email = req.body.email;
  // const password = req.body.password;

  // es6 desstructuring
  const { email, password } = req.body;

  // authenticate the user
  // fetch the user with that email in the db and check the password

  const user = authenticateUser(email, password);

  // We need to sign the payload and issue the token

  if (user) {
    const payload = {
      userId: user.id,
    };

    const options = {
      expiresIn: '1h',
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        res.sendStatus(err);
      } else {
        res.json({
          token: token,
        });
      }
    });
  } else {
    res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log(`server listens to port: ${PORT}`);
});
