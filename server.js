const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add CORS support
const path = require("path");
require("dotenv").config();

const app = express();
const port = 4444;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Allow requests from any origin
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB connection
const mongodb = process.env.MONGODB_URI || "mongodb://localhost:27017/sample_testing";
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });

// Contact schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required:true},
  message: { type: String, required: true }
});

const ContactModel = mongoose.model("Contact", contactSchema);

// API to receive contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save the message to MongoDB
    const newMessage = new ContactModel({ name, email, subject, message });
    await newMessage.save();

    // Return a success response
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving message:', error); // Log the error in detail
    return res.status(500).json({ message: 'Failed to save message. Please try again later.' });
  }
});



// Test route to fetch all contact entries
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact entries." });
  }
});
