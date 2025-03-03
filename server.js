import express from "express";
import mongoose from "mongoose";
import { Contact } from "./ContactModel.js";
import bodyParser from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
dotenv.config(); // Load .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB();

// Get all contacts
app.get("/home", async (req, res) => {
  try {
    let contact = await Contact.find().sort({ createdAt: -1 });
    res.json({ message: "All contacts", contact });
  } catch (error) {
    res.json({ error: error.message });
  }
});
// Add contacts
app.post("/home", async (req, res) => {
  const { name, gmail, phone } = req.body;
  try {
    let contact = await Contact.findOne({ gmail });
    if (contact) return res.json({ message: "Contact already exists!" });

    contact = await Contact.create({ name, gmail, phone });
    res.json({ message: "contact saved successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Edit contacts

app.put("/home/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    let contact = await Contact.findById(id);
    if (!contact) return res.json({ message: "Contact does not exist" });
    let data = await Contact.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "user contact has been update ...!", data });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Delete contacts

app.delete("/home/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let contact = await Contact.findById(id);
    if (!contact) return res.json({ message: "Contact does not exist" });

    await contact.deleteOne();
    res.json({ message: "Contact has been deleted successfully!!!" });
  } catch (error) {
    res.json({ error: error.message });
  }
});
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
