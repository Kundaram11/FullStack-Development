
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "Frontend")));

// JavaScript array to store blogs
let blogs = [
    {
        id: 1,
        title: "HTML Basics",
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

// GET SINGLE BLOG
app.get("/api/blogs/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    const blog = blogs.find(blog => blog.id === blogId);

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    res.json(blog);
});

// POST - Add new blog
app.post("/api/blogs", (req, res) => {
    const { title, author, description } = req.body;

    if (!title || !author || !description) {
        return res.status(400).json({
            message: "All fields are required!"
        });
    }

    // Generate today's date
    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const newBlog = {
        id: blogs.length > 0
            ? blogs[blogs.length - 1].id + 1
            : 1,
        title,
        author,
        description,
        date: today
    };

    blogs.push(newBlog);

    res.status(201).json({
        message: "Blog added successfully!",
        blog: newBlog
    });
});

// PUT - Update an existing blog
app.put("/api/blogs/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    const { title, author, description } = req.body;

    if (!title || !author || !description) {
        return res.status(400).json({
            message: "All fields are required!"
        });
    }

    const blogIndex = blogs.findIndex(blog => blog.id === blogId);

    if (blogIndex === -1) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    // Generate today's date when blog is updated
    const updatedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    blogs[blogIndex] = {
        id: blogId,
        title,
        author,
        description,
        date: updatedDate
    };

    res.json({
        message: "Blog updated successfully!",
        blog: blogs[blogIndex]
    });
});

// DELETE - Delete a blog
app.delete("/api/blogs/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    const blogIndex = blogs.findIndex(blog => blog.id === blogId);

    if (blogIndex === -1) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    const deletedBlog = blogs.splice(blogIndex, 1);

    res.json({
        message: "Blog deleted successfully!",
        blog: deletedBlog[0]
    });
});

// Default Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

// Start server locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export app for Vercel
module.exports = app;

