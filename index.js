const express = require("express");
const app = express();

const PORT = 3000;

// middleware (allows JSON input)
app.use(express.json());

// in-memory data
let users = [
  { id: 1, name: "Ishan", email: "ishan@example.com" },
  { id: 2, name: "Rahul", email: "rahul@example.com" }
];

// test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.get("/users", (req, res) => {

  let result = [...users];

  // SEARCH
  const { search, sort, order } = req.query;

  if (search) {
    result = result.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // SORT
  if (sort) {
    result.sort((a, b) => {
      if (a[sort] < b[sort]) return order === "desc" ? 1 : -1;
      if (a[sort] > b[sort]) return order === "desc" ? -1 : 1;
      return 0;
    });
  }

  res.json(result);
});

// GET user by ID
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// ✅ CREATE new user (POST)
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json(newUser);
});
// UPDATE user
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name || user.name;
  user.email = email || user.email;

  res.json(user);
});
// DELETE user
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);

  res.json({ message: "User deleted successfully" });
});
// start server (ONLY ONE)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});