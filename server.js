const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "Frontend")));


// GET all blogs

app.get("/api/blogs", (req, res) => {
    const sql = `
        SELECT
            id,
            title,
            author,
            description,
            DATE_FORMAT(created_at, '%d %M %Y') AS date
        FROM blogs
        ORDER BY id ASC
    `;
    console.log("GET BLOGS API CALLED")
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }
        console.log(results);
        res.json(results);
    });
});

// GET SINGLE BLOG
app.get("/api/blogs/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT
            id,
            title,
            author,
            description,
            DATE_FORMAT(created_at, '%d %M %Y') AS date
        FROM blogs
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            
            return res.status(500).json(err);
        };
        

        if (results.length === 0) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json(results[0]);

    });

});
// POST - Add new blog
app.post("/api/blogs", (req, res) => {

    const { title, author, description } = req.body;

    const sql = `
        INSERT INTO blogs(title, author, description)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [title, author, description],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Unable to add blog"
                });
            }

            res.status(201).json({
                message: "Blog added successfully",
                id: result.insertId
            });

        }
    );

});

// PUT - Update an existing blog
   app.put("/api/blogs/:id", (req, res) => {

    const id = req.params.id;

    const { title, author, description } = req.body;

    const sql = `
        UPDATE blogs
        SET
            title = ?,
            author = ?,
            description = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, author, description, id],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Update failed"
                });
            }

        
            res.json({
                message: "Blog updated successfully",
                id: id
            });

        }
    );

});

// DELETE BLOG
app.delete("/api/blogs/:id", (req, res) => {

    const id = req.params.id;

    const deleteSQL = "DELETE FROM blogs WHERE id = ?";


    db.query(deleteSQL, [id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Delete failed"
            });
        }


        // Check if table is empty
        db.query(
            "SELECT COUNT(*) AS total FROM blogs",
            (err, rows) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        message: "Count failed"
                    });
                }


                if (rows[0].total === 0) {

                    db.query(
                        "ALTER TABLE blogs AUTO_INCREMENT = 1",
                        (err) => {

                            if (err) {
                                console.error(
                                    "Reset ID error:",
                                    err
                                );
                            }

                        }
                    );

                }


                res.json({
                    message: "Blog deleted successfully"
                });

            }
        );

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

