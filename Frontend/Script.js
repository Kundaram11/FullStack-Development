const API_URL = "";
const blogForm = document.getElementById("blogForm");

if (blogForm) {

    blogForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Form submitted");

        // CHECK EDIT OR ADD

        const blogIdElement =
            document.getElementById("blogId");

        const blogId =
            blogIdElement ? blogIdElement.value : "";

        let title;
        let author;
        let description;

        // EDIT BLOG

        if (blogId) {

            const titleElement =
                document.getElementById("title");

            const authorElement =
                document.getElementById("author");

            const descriptionElement =
                document.getElementById("description");


            if (
                !titleElement ||
                !authorElement ||
                !descriptionElement
            ) {

                alert("❌ Edit form fields not found!");

                return;
            }

            title =
                titleElement.value.trim();

            author =
                authorElement.value.trim();

            description =
                descriptionElement.value.trim();

        }

        // ADD BLOG

        else {

            const titleElement =
                document.getElementById("title1");

            const authorElement =
                document.getElementById("author1");

            const descriptionElement =
                document.getElementById("description1");


            if (
                !titleElement ||
                !authorElement ||
                !descriptionElement
            ) {

                alert("❌ Add Blog form fields not found!");

                return;
            }


            title =
                titleElement.value.trim();

            author =
                authorElement.value.trim();

            description =
                descriptionElement.value.trim();

        }

        // VALIDATION

        if (
            title === "" ||
            author === "" ||
            description === ""
        ) {

            alert("⚠️ Please fill all fields!");

            return;
        }


        try {

            // UPDATE BLOG

            if (blogId) {

                console.log(
                    "Updating blog:",
                    blogId
                );


                const response =
                    await fetch(
                        `${API_URL}/api/blogs/${blogId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                title: title,
                                author: author,
                                description: description
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Update response:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to update blog"
                    );

                }


                alert(
                    "✅ Blog updated successfully!"
                );


                localStorage.removeItem(
                    "editBlogId"
                );


                window.location.href =
                    "index.html";


                return;
            }

            // ADD BLOG

            console.log("Adding new blog");


            const response =
                await fetch(
                    `${API_URL}/api/blogs`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            title: title,
                            author: author,
                            description: description
                        })
                    }
                );


            const data =
                await response.json();


            console.log(
                "Add response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add blog"
                );

            }

            // THIS ALERT WILL NOW APPEAR
            alert(
                "✅ Blog added successfully!"
            );


            blogForm.reset();


            // Go to home page
            window.location.href =
                "index.html";

        }


        catch (error) {

            console.error(
                "Add/Edit error:",
                error
            );


            alert(
                "❌ " + error.message
            );

        }

    });

}

// LOAD BLOGS

async function loadBlogs() {

    const blogList =
        document.getElementById("blogList");

    if (!blogList) {

        return;
    }


    try {

        console.log(
            "Loading blogs from API..."
        );


        const response =
            await fetch(
                    `${API_URL}/api/blogs`);
                  


        console.log(
            "GET /api/blogs status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load blogs"
            );

        }

        const blogs =
            await response.json();
        blogs.sort((a,b)=>a.id-b.id);    


        console.log(
            "Blogs received:",
            blogs
        );

        // BLOG COUNTER

        const blogCount =
            document.getElementById("blogCount");


        if (blogCount) {

            blogCount.textContent =
                `📊 Total Blogs: ${blogs.length}`;

        }

        // NO BLOGS

        if (
            !Array.isArray(blogs) ||
            blogs.length === 0
        ) {

            blogList.innerHTML = `
                <h3 class="no-blog">
                    📝 No blogs available
                </h3>
            `;

            return;
        }

        // DISPLAY BLOGS
        
        blogList.innerHTML = "";


        blogs.forEach(function (blog) {

            const card =
                document.createElement("div");


            card.className = "card";


            card.innerHTML = `

                <h2>
                    ${escapeHTML(blog.title)}
                </h2>

                <p>
                    <strong>👤 Author:</strong>
                    ${escapeHTML(blog.author)}
                </p>

                <p>
                    ${escapeHTML(blog.description)}
                </p>

                <p class="blog-date">
                    📅 ${escapeHTML(
                        blog.date || "No date"
                    )}
                </p>


                <div class="blog-actions">

                    <button
                        class="edit-btn"
                        onclick="editBlog(${blog.id})">
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteBlog(${blog.id})">
                        🗑️ Delete
                    </button>

                </div>
            `;


            blogList.appendChild(card);

        });


        applySearch();

    }


    catch (error) {

        console.error(
            "Load blogs error:",
            error
        );


        blogList.innerHTML = `
            <h3 class="no-blog">
                ❌ Failed to load blogs
            </h3>
        `;

    }

}


// EDIT BLOG

async function editBlog(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/blogs/${id}`
            );


        const blog =
            await response.json();


        if (!response.ok) {

            throw new Error(
                blog.message ||
                "Blog not found"
            );

        }


        localStorage.setItem(
            "editBlogId",
            blog.id
        );


        window.location.href =
            "EditBlog.html";

    }


    catch (error) {

        console.error(
            "Edit error:",
            error
        );


        alert(
            "❌ Unable to edit blog!"
        );

    }

}

// LOAD EDIT BLOG

async function loadEditBlog() {

    const blogId =
        localStorage.getItem("editBlogId");


    if (!blogId) {

        return;
    }


    const titleInput =
        document.getElementById("title");

    const authorInput =
        document.getElementById("author");

    const descriptionInput =
        document.getElementById("description");


    // Not EditBlog page
    if (
        !titleInput ||
        !authorInput ||
        !descriptionInput
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/blogs/${blogId}`
            );


        const blog =
            await response.json();


        if (!response.ok) {

            throw new Error(
                blog.message ||
                "Blog not found"
            );

        }

        // Fill form
        titleInput.value =
            blog.title;

        authorInput.value =
            blog.author;

        descriptionInput.value =
            blog.description;


        // Hidden ID
        let hiddenId =
            document.getElementById("blogId");


        if (!hiddenId) {

            hiddenId =
                document.createElement("input");

            hiddenId.type = "hidden";

            hiddenId.id = "blogId";

            hiddenId.name = "blogId";

            blogForm.appendChild(
                hiddenId
            );

        }


        hiddenId.value =
            blog.id;


        // Change title
        const formTitle =
            document.getElementById(
                "formTitle"
            );


        if (formTitle) {

            formTitle.textContent =
                "✏️ Edit Blog";

        }


        // Change button
        const submitButton =
            document.getElementById(
                "submitButton"
            );


        if (submitButton) {

            submitButton.textContent =
                "🔄 Update Blog";

        }


        // Change subtitle
        const formSubtitle =
            document.getElementById(
                "formSubtitle"
            );


        if (formSubtitle) {

            formSubtitle.textContent =
                "Update your existing blog post";

        }

    }

    catch (error) {

        console.error(
            "Load edit blog error:",
            error
        );


        alert(
            "❌ Unable to load blog!"
        );

    }

}

// DELETE BLOG

async function deleteBlog(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/blogs/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete blog"
            );

        }


        alert(
            "🗑️ Blog deleted successfully!"
        );


        loadBlogs();

    }


    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "❌ " + error.message
        );

    }

}

// SEARCH BLOGS

const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchValue = searchInput.value
            .toLowerCase()
            .trim();

        const cards = document.querySelectorAll(".card");

        let found = false;

        cards.forEach(function (card) {

            const cardText = card.textContent.toLowerCase();

            if (cardText.includes(searchValue)) {

                card.style.display = "";
                found = true;

            } else {

                card.style.display = "none";

            }

        });


        // Remove previous "Blog not found" message
        const oldMessage =
            document.getElementById("searchNotFound");

        if (oldMessage) {
            oldMessage.remove();
        }


        // Show message if no blog matches
        if (!found && searchValue !== "") {

            const blogList =
                document.getElementById("blogList");

            const message =
                document.createElement("h3");

            message.id = "searchNotFound";

            message.className = "no-blog";

            message.textContent =
                "⚠️ Blog not found!";

            blogList.appendChild(message);

        }

    });

}

// APPLY SEARCH

function applySearch() {

    const searchInput =
        document.getElementById("search");


    if (!searchInput) {

        return;
    }


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(".card");


    cards.forEach(function (card) {

        const cardText =
            card.textContent
                .toLowerCase();


        if (
            cardText.includes(
                searchValue
            )
        ) {

            card.style.display = "";

        }

        else {

            card.style.display =
                "none";

        }

    });

}

// ESCAPE HTML

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}

// START

document.addEventListener("DOMContentLoaded", function () {
    loadBlogs();
    loadEditBlog();
});

