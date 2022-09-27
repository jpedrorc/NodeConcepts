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
    next();
  }
  return false;
}

app.post("/users", alreadyExistsUserAccount, (request, response) => {
  const newUser = {
    id: v4(),
    name: request.body.name,
    username: request.body.username,
    todos: [],
  };
  users.push(newUser);
  console.log(`Usuário ${newUser.name} criado com sucesso.`);
  response.status(200).send(`Usuário ${newUser.name} criado com sucesso.`);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const user = users.find((user) => user.username === request.headers.username);
  response.status(200).send(user);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const newTask = {
    id: v4(),
    title: request.body.title,
    done: false,
    deadline: new Date(request.body.deadline),
    created_at: new Date(),
  };

  const userData = users.find((user, i) => {
    if (user.name === request.headers.name) {
      users[i].todos.push(newTask);
      response.status(200).send("Task incluida com sucesso!");
    }
  });
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const username = request.headers.username;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      const taskList = users[i].todos.find((task, j) => {
        if (task.id === request.params.id) {
          users[i].todos[j].title = title;
          users[i].todos[j].deadline = deadline;
          response.status(200).send("Dados atualizados com sucesso");
        }
      });
    }
  }
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      const taskList = users[i].todos.find((task, j) => {
        if (task.id === request.params.id) {
          users[i].todos[j].done = true;
          response.status(200).send("Status done alterado com sucesso!");
        }
      });
    }
  }
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === request.params.id) {
      users.slice(i, 1);
      response.status(200).send("Usuário apagado com sucesso!");
    }
  }
});

module.exports = app;
