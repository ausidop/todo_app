const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
  const client = getConnectedClient(); 
  const collection = client.db("todosdb").collection("todos");
  return collection;
};

// Get
// /todos
router.get("/todos", async (req, res) => {
  const collection = getCollection();
  const todos = await collection.find({}).toArray();
  res.status(200).json(todos);
});

// Post
// /todos
router.post("/todos", async (req, res) => {
  const collection = getCollection();
  const { todo } = req.body;

  const newTodo = await collection.insertOne({ todo, status: false });
  res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// Delete
// /todos/:id
router.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  const deleteTodo = await collection.deleteOne({ _id });

  res.status(200).json(deleteTodo);
});

// Put
// /todos/:id
router.put("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const { status } = req.body;

  const updateTodo = await collection.updateOne(
    { _id },
    { $set: { status: !status } }
  );

  res.status(200).json({ msg: "Put request to /api/todos/:id" });
});

module.exports = router;
