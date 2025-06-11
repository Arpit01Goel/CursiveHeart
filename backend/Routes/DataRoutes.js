const express = require("express");
const Letter = require("../Models/Letter");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = express.Router();

// Secret key for JWT (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

// Route to create a new letter
router.post("/", authenticateToken, async (req, res) => {
  const { title, date, content, password, pin, favourite, public: isPublic, images } = req.body;

  try {
    let encryptedContent = content;
    let isEncrypted = false;

    // Encrypt content if password is provided
    if (password) {
      const key = crypto.scryptSync(password, "salt", 32); // Derive a 256-bit key from the password
      const iv = crypto.randomBytes(16); // Generate a random Initialization Vector (IV)
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      encryptedContent =
        cipher.update(content, "utf8", "hex") + cipher.final("hex");

      // Store the IV along with the encrypted content
      encryptedContent = `${iv.toString("hex")}:${encryptedContent}`;
      isEncrypted = true; // Mark the content as encrypted
    }

    // Encrypt images if provided
    const encryptedImages = (images || []).map((image) => {
      const key = crypto.scryptSync(password || "default", "salt", 32); // Use password or default key
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      const encryptedImage =
        cipher.update(image, "utf8", "hex") + cipher.final("hex");

      return `${iv.toString("hex")}:${encryptedImage}`;
    });

    // Create a new letter with the provided data
    const newLetter = new Letter({
      username: req.user.username,
      title,
      date: date ? new Date(date) : new Date(),
      content: encryptedContent,
      isEncrypted, // Set based on whether the content was encrypted
      pin: !!pin, // Ensure boolean value
      favourite: !!favourite, // Ensure boolean value
      public: !!isPublic, // Ensure boolean value for public view
      images: encryptedImages,
    });

    await newLetter.save();

    res.status(201).json({ message: "Letter saved successfully" });
  } catch (error) {
    console.error("Error saving letter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch all letters for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const letters = await Letter.find({ username: req.user.username });

    // Include `_id` in the response
    const truncatedLetters = letters.map((letter) => ({
      ...letter._doc,
      content: letter.content.substring(0, 25) + (letter.content.length > 25 ? "..." : ""),
    }));

    res.status(200).json(truncatedLetters);
  } catch (error) {
    console.error("Error fetching letters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update a specific letter by ID
router.put("/letters/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Ensure `public`, `favourite`, and `pin` are included in the request body

  try {
    const updatedLetter = await Letter.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedLetter) {
      console.log("Letter not found for update:", id);
      return res.status(404).json({ message: "Letter not found" });
    }

    res.status(200).json(updatedLetter);
  } catch (error) {
    console.error("Error updating letter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch a specific letter by ID
router.get("/letters/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const letter = await Letter.findById(id);

    if (!letter) {
      console.log("Letter not found:", id);
      return res.status(404).json({ message: "Letter not found" });
    }

    res.status(200).json(letter); // Return the full letter content
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/letters/:id/decrypt", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const letter = await Letter.findById(id);

    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }

    if (!letter.isEncrypted) {
      return res.status(400).json({ message: "This letter is not encrypted." });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required for decryption." });
    }

    try {
      // Split the encrypted content to extract IV and ciphertext
      const [ivHex, ciphertext] = letter.content.split(":");
      if (!ivHex || !ciphertext) {
        throw new Error("Invalid encrypted content format.");
      }

      // Convert IV and ciphertext to buffers
      const iv = Buffer.from(ivHex, "hex");
      const encryptedBytes = Buffer.from(ciphertext, "hex");

      // Derive the key using the password
      const key = crypto.scryptSync(password, "salt", 32);

      // Decrypt the content
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(encryptedBytes, "hex", "utf8");
      decrypted += decipher.final("utf8");

      res.status(200).json({ decryptedContent: decrypted });
    } catch (error) {
      console.error("Error decrypting content:", error);
      res.status(400).json({ message: "Failed to decrypt content. Incorrect password or corrupted data." });
    }
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;