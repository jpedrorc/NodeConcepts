const express = require("express");
const cors = require("cors");
const { v4: uuidv4, v4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function alreadyExistsUserAccount(request, response, next) {
  const alreadyExist = users.find((user) => {
    return user.name === request.body.name;
  });
  if (alreadyExist) {
    return response.send("Usuário já xistente na base de dados.");
  }
  next();
}

function checksExistsUserAccount(request, response, next) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === request.name) {
      return true;
    }
  }
  return false;
  next();
}

app.post("/users", alreadyExistsUserAccount, (request, response) => {
  const newUser = {
    id: v4(),
    name: request.body.name,
    username: request.body.username,
    todos: [],
  };
  users.push(newUser);
  return response.send(`Usuário ${newUser.name} criado com sucesso.`);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  return response.send(users);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
