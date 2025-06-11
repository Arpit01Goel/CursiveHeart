const express = require("express");
const Letter = require("../Models/Letter");
const router = express.Router();

router.get("/", async (req, res) => {
  const { username } = req.query;

  try {
    // Fetch only the first 50 public letters for the given username
    const publicLetters = await Letter.find({ username, public: true }).limit(50);

    // Trim the content and title fields
    const trimmedLetters = publicLetters.map((letter) => ({
      ...letter._doc, // Spread the document fields
      title: letter.title.substring(0, 500) + (letter.title.length > 50 ? "..." : ""), // Trim title to 50 characters
      content: letter.content.substring(0, 500) + (letter.content.length > 50 ? "..." : ""), // Trim content to 50 characters
    }));

    res.status(200).json(trimmedLetters);
  } catch (error) {
    console.error("Error fetching public letters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Example: GET /api/public/letters/:id
router.get("/letters/:id", async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ message: "Letter not found" });
    }
    res.status(200).json(letter);
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;