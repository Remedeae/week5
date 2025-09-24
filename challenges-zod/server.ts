import { error } from "console";
import express from "express";
import z from "zod";

const app = express();
app.use(express.json());

let pets = [{}];

const PetSchema = z.object({
  name: z.string().min(1),
  age: z.number().positive(),
  type: z.enum(["dog", "cat", "bird"]),
});

const PetsSchema = z.array(PetSchema);

const validatedPets = PetsSchema.safeParse(pets);

app.post("/pets", (req, res) => {
  const validatedPet = PetSchema.safeParse(req.body);
  if (!validatedPet.success) {
    res.status(400).json({ message: validatedPet.error });
  } else {
    pets.push(validatedPet);
    res.status(201).json({ message: pets });
  }
});

app.get("/pets", (req, res) => {
  res.json(pets);
});

app.listen(3000, () => console.log("Server running on port 3000"));
