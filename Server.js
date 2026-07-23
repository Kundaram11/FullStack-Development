const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "Frontend")));

// GET Route
app.get("/api/blogs", (req, res) => {
    res.json([
        {
            title: "HTML Basics",
            author: "Tim Berners-Lee"
        },
        {
            title: "Learn CSS",
            author: "Hakon Wium Lie"
        },
        {
            title: "JavaScript Introduction",
            author: "Brendan Eich"
        }
    ]);
});

// POST Route
app.post("/api/blog", (req, res) => {

    const blog = req.body;

    console.log(blog);

    res.json({
        message: "Blog received successfully!",
        blog: blog
    });

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});