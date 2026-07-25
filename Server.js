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
        id: 1,
        title:"HTML Basics",
        author: "Tim Berners-Lee",
        description: "HTML is the standard language used to create web pages.",
        date: "25 July 2026"
    },
    {   
        id: 2,
        title: "Learn CSS",
        author: "Hakon Wium Lie",
        description: "CSS makes websites attractive using colors, fonts and layouts.",
        date: "25 July 2026"

    },
    {   
        id: 3,
        title: "JavaScript Introduction",
        author: "Brendan Eich",
        description: "JavaScript adds interactivity and dynamic behavior to websites.",
        date: "25 July 2026"
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
        id: blogs.length + 1,
        title,
        author,
        description,
        date: new Date().toLocaleDateString("en-GB",{
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "✅ Blog added successfully!",
        blog: newBlog
    });

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
