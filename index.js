const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Todo = require("./models/Todo")

dotenv.config();

app.set("view engine", "ejs");

app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    Todo.find({}, (err, tasks) => {
        res.render('todo.ejs', {todoTasks: tasks});
    });
});

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

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => {
    console.log("Connected to database!");
    app.listen(3000, () => console.log("Server up and running!"));
});

app
.route("/edit/:id")
.get((req, res) => {
    const id = req.params.id;
    Todo.find( {}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id});
    });
})

.post((req, res) => {
    const id = req.params.id;
    Todo.findByIdAndUpdate(id, { content: req.body.content}, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    })
})

app
.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    Todo.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    })
})




