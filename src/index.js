const express = require("express");
const cors = require("cors");
const { v4: uuidv4, v4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function alreadyExistsUserAccount(request, response, next) {
  const alreadyExist = users.find((user) => {
    return user.username === request.body.username;
  });
  if (alreadyExist) {
    return response.status(400).send({
      error: "User already exist",
    });
  }
  next();
}

function checksExistsUserAccount(request, response, next) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === request.headers.username) {
      response.locals.user = users[i];
      next();
      return;
    }
  }
  return response.status(404).send({
    error: "User not found",
  });
}

app.post("/users", alreadyExistsUserAccount, (request, response) => {
  const newUser = {
    id: v4(),
    name: request.body.name,
    username: request.body.username,
    todos: [],
  };
  users.push(newUser);
  response.status(201).send(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  response.status(200).send(response.locals.user.todos);
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
      return response.status(201).send("Task incluida com sucesso!");
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
    if (users[i].username === request.headers.username) {
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
    if (users[i].username === request.headers.username) {
      for (let j = 0; j < users[i].todos.length; j++) {
        const newTodos = users[i].todos.filter((task) => {
          return task.id !== request.params.id;
        });
        users[i].todos = newTodos;
        response.status(200).send("Task apagada com sucesso!");
      }
    }
  }
});

module.exports = app;
