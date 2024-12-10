// <!-- // Ibrahim Aldulaimi
// dulaimi@iastate.edu
// Date : Nov / 22 / 2024 -->

// Import dependencies
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

// Configuration
const port = "8081";
const host = "localhost";

// MySQL Database Connection
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "a7743725", //change this based on your MYSQL data
  database: "secoms3190",
});

// Connect to Database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1); // Exit if DB connection fails
  }
  console.log("Connected to the database successfully.");
});

// Ensure "uploads" folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName); // Unique filenames
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG files are allowed."));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

// Initialize the Express App
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve static files

// Start Server
app.listen(port, () => {
  console.log(`App running at http://${host}:${port}/`);
});

// API Routes

// Get All Contacts
app.get("/contact", (req, res) => {
  const query = "SELECT * FROM contact";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching contacts:", err.message);
      return res.status(500).json({ error: "Failed to fetch contacts" });
    }
    res.status(200).json(result);
  });
});

// Add a New Contact
app.post("/contact", upload.single("image"), (req, res) => {
  const { contact_name, phone_number, message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
  db.query(checkQuery, [contact_name], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Validation error:", checkErr.message);
      return res.status(500).json({ error: "Error validating contact name" });
    }
    if (checkResult.length > 0) {
      return res.status(409).json({ error: "Contact name already exists" });
    }

    const query =
      "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
    db.query(query, [contact_name, phone_number, message, imageUrl], (err) => {
      if (err) {
        console.error("Error adding contact:", err.message);
        return res.status(500).json({ error: "Failed to add contact" });
      }
      res.status(201).json({ message: "Contact added successfully" });
    });
  });
});

//Existing user Login
app.post("/contact/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required." });
    }

    // Query MySQL
    const query = "SELECT role FROM user WHERE user = ? AND password = ?";

    // Query MySQL
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error("Database error during login:", err);
        return res
          .status(500)
          .send({ error: "An error occurred in Query. Please try again." });
      }
      if (results.length === 0) {
        return res.status(401).send({ error: "Invalid username or password." });
      }
      // If there is not any error, respond with code and role
      const { role } = results[0];
      res.status(200).send({ role });
    });
  } catch (err) {
    // Handle synchronous errors
    console.error("Error in GET /contact/login", err);
    res
      .status(500)
      .send({ error: "An unexpected error occurred in Login: " + err.message });
  }
});

// Delete a Contact by ID
app.delete("/contact/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM contact WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting contact:", err.message);
      return res.status(500).json({ error: "Failed to delete contact" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  });
});

// Update a Contact by ID
app.put("/contact/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { contact_name, phone_number, message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Build the SQL query based on whether an image is included
  const query = imageUrl
    ? "UPDATE contact SET contact_name = ?, phone_number = ?, message = ?, image_url = ? WHERE id = ?"
    : "UPDATE contact SET contact_name = ?, phone_number = ?, message = ? WHERE id = ?";

  const queryParams = imageUrl
    ? [contact_name, phone_number, message, imageUrl, id]
    : [contact_name, phone_number, message, id];

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error updating contact:", err.message);
      return res.status(500).json({ error: "Failed to update contact" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact updated successfully" });
  });
});


// Search Contacts by Name
app.get("/contact/name", (req, res) => {
  const { contact_name } = req.query;
  if (!contact_name) {
    return res.status(400).json({ error: "contact_name is required" });
  }

  const query = "SELECT * FROM contact WHERE LOWER(contact_name) LIKE LOWER(?)";
  const searchValue = `%${contact_name}%`;
  db.query(query, [searchValue], (err, result) => {
    if (err) {
      console.error("Error searching contacts:", err.message);
      return res.status(500).json({ error: "Failed to search contacts" });
    }
    res.status(200).json(result);
  });
});

// Request Method to add new messages given a Contact
app.post("/contact/messages", (req, res) => {
  try {
    // Read data from Body
    const { contactId, message } = req.body;

    // Query MySQL
    const query =
      "INSERT INTO message (contact_id, message, message_timestamp) VALUES (?, ?, NOW())";

    db.query(query, [contactId, message], (err, results) => {
      if (err) {
        // In case of an error occurs
        console.log("Error in /contact/messages " + err);
        res.status(409).send({ error: "Error adding Messages " + err });
      } else {
        // If it was successful
        res.status(201).send("Message added successfully");
      }
    });
  } catch (err) {
    console.err("Error in /contact/messages " + err);
    res.status(500).send({ error: "Error sending message" + err });
  }
});

// Request method to read all messages from given Id contact
app.get("/contact/messages/:contactId", (req, res) => {
  try {
    // Read Id from params
    const { contactId } = req.params;

    // MySQL Query
    const query =
      "SELECT * FROM message WHERE contact_id = ? ORDER BY message_timestamp DESC";

    // Database query
    db.query(query, [contactId], (err, results) => {
      if (err) {
        console.error("Error fetching Messages:", err);
        return res.status(500).send({ error: "Error fetching Messages" + err });
      }
      console.log(results);
      res.status(200).json(results);
    });
  } catch (err) {
    res.status(500).send({ error: "Error fetching messages", err });
  }
});

// Request method to read the picture user
app.get("/contact/profile_picture/:contact_name", (req, res) => {
  try {
    // Read contact_name from route parameter
    const contact_name = req.params.contact_name;

    // MySQL Query
    const query = "SELECT image_url FROM contact WHERE contact_name = ?";

    db.query(query, [contact_name], (err, result) => {
      if (err) {
        console.log({ error: "Error in Profile Picture" });
        return res
          .status(500)
          .send({ error: "Error fetching Profile Picture :" + err });
      } else if (result.length) {
        console.log(result);
        res.json({ picture: result[0].image_url }); // return local url
      } else {
        res.status(404).send({ error: "Profile picture not found" });
      }
    });
  } catch (err) {
    console.error("Error fetching profile picture:", err);
    res.status(500).send({ error: "Error fetching profile picture :" + err });
  }
});
