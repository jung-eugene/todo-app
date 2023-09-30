const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Todo = require("./models/Todo")

dotenv.config();

// connect to database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  // server configuration
  app.listen(3000, () => console.log("Server started listening on port: 3000"));
});

// access css
app.use("/static", express.static("public"));
// allows to extract data from form
app.use(express.urlencoded({ extended: true }));

// view engine configuration
app.set("view engine", "ejs");

// POST method
// click add button -> app inserts data into db
app.post('/', async (req, res) => {
  const todoTask = new Todo ({
  content: req.body.content
  });

  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

// GET method
// read data from database - enter page/add new item -> shown on app
app.get("/", (req, res) => {
  Todo.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

// use findByIdAndUpdate to update tasks
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    Todo.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    Todo.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
      res.redirect("/");
    });
});

// use findByIdAndRemove to delete tasks
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  Todo.findByIdAndRemove(id, err => {
  if (err) return res.send(500, err);
    res.redirect("/");
  });
});
