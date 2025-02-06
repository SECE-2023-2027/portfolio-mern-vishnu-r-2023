const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 4444;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB connection
const mongodb = process.env.MONGODB_URI || "mongodb+srv://vishnuramesh:Vishnu123@cluster0.oun5q.mongodb.net/Portfolio";

mongoose
  .connect(mongodb)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });


// Contact schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
});

const ContactModel = mongoose.model("Contact", contactSchema);

// API to receive contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMessage = new ContactModel({ name, email, subject, message });
    await newMessage.save();

    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ message: "Failed to save message. Please try again later." });
  }
});

// API to fetch all contact entries
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contact entries." });
  }
});
