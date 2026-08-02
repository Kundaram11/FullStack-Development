const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "Frontend")));


// GET all blogs
app.get("/api/blogs", (req, res) => {

     console.log("GET /api/blogs called");
    const sql = `
SELECT
    id,
    title,
    author,
    description,
    DATE_FORMAT(
        CONVERT_TZ(created_at, '+00:00', '+05:30'),
        '%d %b %Y, %h:%i:%s %p'
    ) AS created_at
FROM blogs
ORDER BY id ASC
`;

    db.query(sql, (err, result) => {

         if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).json({
                message: err.message
            });
        }

        console.log("DATA:", result);
        res.json(result);
    });

});

// GET single blog
app.get("/api/blogs/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM blogs WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).json({
                message: err.message
            });
        }


        if (result.length === 0) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }


        res.json(result[0]);

    });

});


// ADD new blog
app.post("/api/blogs", (req, res) => {

    const { title, description, author } = req.body;

    const sql =
    "INSERT INTO blogs(title, description, author) VALUES (?, ?, ?)";


    db.query(sql, 
    [title, description, author], 
    (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message:"Insert failed"
            });
        }

        res.json({
            message:"Blog added successfully",
            id: result.insertId
        });

    });

});


// DELETE blog
app.delete("/api/blogs/:id", (req,res)=>{

    const id = req.params.id;

    const sql="DELETE FROM blogs WHERE id=?";


    db.query(sql,[id],(err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Delete failed"
            });
        }

        res.json({
            message:"Blog deleted"
        });

    });

});


// UPDATE blog
app.put("/api/blogs/:id",(req,res)=>{

    const id=req.params.id;

    const {title,description,author}=req.body;


    const sql=
    "UPDATE blogs SET title=?, description=?, author=? WHERE id=?";


    db.query(sql,
    [title,description,author,id],
    (err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Update failed"
            });
        }


        res.json({
            message:"Blog updated"
        });

    });

});

// Start server locally
if (require.main === module) {
    app.get("/test", (req, res) => {
    console.log("TEST ROUTE HIT");
    res.send("Server is working");
});
    app.listen(3000, () => {
        console.log(`Server running on port 3000`);
    });
}

// Export app for Vercel
module.exports = app;

