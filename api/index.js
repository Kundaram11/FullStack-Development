const express = require("express");

const app = express();

app.get("/api/blogs", (req, res) => {
    res.json([
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
    ]);
});

module.exports = app;