const express = require("express");
const db = require("../db/connection");

const router = express.Router();

// Get all posts with comments
router.get("/", (req, res) => {
    const query = `
        SELECT posts.id, posts.image_url, posts.description, 
        JSON_ARRAYAGG(comments.comment) AS comments
        FROM posts
        LEFT JOIN comments ON posts.id = comments.post_id
        GROUP BY posts.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new post
router.post("/", (req, res) => {
    const { imageUrl, description } = req.body;
    const query = "INSERT INTO posts (image_url, description) VALUES (?, ?)";
    db.query(query, [imageUrl, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId });
    });
});

// Add a comment to a post
router.post("/:postId/comments", (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const query = "INSERT INTO comments (post_id, comment) VALUES (?, ?)";
    db.query(query, [postId, comment], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Comment added!" });
    });
});

module.exports = router;
