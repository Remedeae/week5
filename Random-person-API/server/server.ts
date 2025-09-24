import { error } from "console";
import express from "express";
import z, { email } from "zod";

const app = express();
const PORT = 3000;
app.use(express.json());

const randomPersonNameSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    })
  ),
});

const userNameSchema = z.object({
  results: z.array(
    z.object({
      login: z.object({
        username: z.string(),
      }),
      registered: z.object({
        date: z.string().datetime(),
      }),
    })
  ),
});

const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(12, { message: "Name cannot be longer then 12 characters" }),
  age: z
    .number()
    .min(18, { message: "You must be at least 18 years" })
    .max(100, { message: "Maaaan you're to old for this." })
    .optional()
    .default(28),
  email: z
    .email()
    .lowercase({ message: "Email must only contain lower case letters" }),
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/random-person", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const validatedPerson = randomPersonNameSchema.safeParse(data);
    if (!validatedPerson.success) {
      return res
        .status(500)
        .json({ error: "API data invalid", details: validatedPerson.error });
    }
    res.json({
      message: `Hi I'm a randomly generated person and my name is ${validatedPerson.data.results[0]?.name.first} ${validatedPerson.data.results[0]?.name.last} and I'm from ${validatedPerson.data.results[0]?.location.country}`,
    });
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch API." });
  }
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  const validatedUser = userSchema.safeParse(newUser);
  if (!validatedUser.success) {
    return res
      .status(400)
      .json({ error: validatedUser.error.issues[0]?.message });
  }
  res.status(201).json({ message: validatedUser.data });
});

app.get("/random-login", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const newUser = userNameSchema.safeParse(data);
    if (!newUser.success) {
      return res
        .status(500)
        .json({ error: "Data fetched invalid.", details: newUser.error });
    }
    res.status(201).json({
      message: `Username '${newUser.data.results[0]?.login.username}' was resistered ${newUser.data.results[0]!.registered.date.split("T")[0]}`,
    });
  } catch (error) {
    res.status(404).json({ error: "Failed to fetch API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
