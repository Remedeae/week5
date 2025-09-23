import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to our API!");
});

/* app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "John Nightreign" },
    { id: 2, name: "LetMeSoloHer" },
  ];
  res.json(users);
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  res.json({ message: "User added sucessfully", user: newUser });
}); */

app.get("/greet", (req, res) => {
  res.send("Welcome peasant, behold my incredibly complex API!");
});

app.post("/submit", (req, res) => {
  const newPeasant = req.body;
  //  console.log(newPeasant);
  /*   console.log(
    `Greetings ${newPeasant.name}, I heard you like to play ${newPeasant.game}, despite only beeing ${newPeasant.age} years old.`
  ); */
  res.json({
    Message: `Greetings ${newPeasant.name}, I heard you like to play ${newPeasant.game}, despite beeing ${newPeasant.age} years old.`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
