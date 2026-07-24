const express = require("express");
const path = require("path");
const { title } = require("process");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "Frontend")));

// JavaScript array to store blogs
let blogs =[
    {
        title:"HTML Basics",
        author: "Tim Berners-Lee",
        description: "HTML is the standard language used to create web pages."
    },
    {
        title: "Learn CSS",
        author: "Hakon Wium Lie",
        description: "CSS makes websites attractive using colors, fonts and layouts."

    },
    {
        title: "JavaScript Introduction",
        author: "Brendan Eich",
        description: "JavaScript adds interactivity and dynamic behavior to websites."
    }
];

// GET all blogs
app.get("/api/blogs", (req, res) => {
    res.json(blogs);
});
        
// POST new blog
app.post("/api/blog", (req, res) => {

    const { title, author, description } = req.body;

    const newBlog = {
        title,
        author,
        description
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog added successfully!",
        blog: newBlog
    });

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
