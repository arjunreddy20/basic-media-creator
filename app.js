const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/posts", postRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
