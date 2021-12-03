const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};
const users_ = {
  'userRandomID': [{
    email: "user@example.com",
    password: "22eA3e7R2Y3q8c7564t7Y3q",
    category: 'Social'
  },
    {
      email: "user@example.com",
      password: "0LDHaXqChU0LYmJ1xRfYwwNA",
      category: 'Work'
    }, {
      email: "user@example.com",
      password: "1312312",
      category: 'Entertainment'
    }],
  'id2': {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});


app.get("/password", (req, res) => {
  const userUrls = Object.fromEntries(
    Object.entries(urlDatabase).filter(([_, value]) => value.userID === 'aJ48lW'));
  const users = users_['userRandomID'];
  const templateVars = {users, body: req.body};

  res.render('passwords_index', templateVars);
});


app.post("/password", (req, res) => {

  users_['userRandomID'].push({
    id: "userRandomID",
    email: "user@example.com",
    password: req.body.password,
    category: req.body.category
  })
  const users = users_['userRandomID'];
  console.log('users', users)
  const templateVars = {users, body: req.body};

  res.render('passwords_index', templateVars);

});

app.get("/password/:pass", (req, res) => {
  const users = users_['userRandomID'];
  console.log('users', req.params)
  const templateVars = {users, body: req.params};
  res.render('password_show', templateVars);

});

app.post('/password/delete/:pass', (req, res) => {
  const results = users_['userRandomID'];
  let index = "";
  results.forEach(result =>
  {
    if(result.password === req.params.pass){
      index =  results.indexOf(result);
    }
  })
  users_['userRandomID'].splice(index,1);
  res.redirect('/password');

});

app.use("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "404.html"));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})