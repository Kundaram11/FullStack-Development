const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        
        // Check which form is being used
        const isEditPage = document.getElementById("blogId")?.value;

        let title;
        let author;
        let description;

        if (isEditPage) {

            // EDIT BLOG
            title = document.getElementById("title").value.trim();
            author = document.getElementById("author").value.trim();
            description = document.getElementById("description").value.trim();

        } else {

            // ADD BLOG
            title = document.getElementById("title1").value.trim();
            author = document.getElementById("author1").value.trim();
            description = document.getElementById("description1").value.trim();
        }

        if (title === "" || author === "" || description === "") {
            alert("⚠️ Please fill all fields!");
            return;
        }
        // Check if we are editing a blog
        const blogId = document.getElementById("blogId")?.value;

        try {

            
            // EDIT / UPDATE BLOG
            

            if (blogId) {

                const response = await fetch(`/api/blogs/${blogId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title,
                        author,
                        description
                    })
                });

                const data = await response.json();

                alert(data.message);

                if (response.ok) {
                    // remove edit id
                    localStorage.removeItem("editBlogId");
                    // Go to home page
                    window.location.href = "index.html";
                }

                return;
            }
         
           // ADD NEW BLOG
        
            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    author: author,
                    description: description
            })
        });

        const data = await response.json();

        alert(data.message);

         if (response.ok) {
                // clear form
                blogForm.reset();
            }

        } catch (error) {

            console.error("Error:", error);

            alert("❌ Something went wrong!");

        }

    });
}
    
// loadBlogs
async function loadBlogs() {
    try{

    const response = await fetch("/api/blogs");
    const blogs = await response.json();

    const blogList = document.getElementById("blogList");

    if (!blogList) return;
    //  Blog Counter
    const blogCount = document.getElementById("blogCount");
    if(blogCount){
        blogCount.textContent = `📊 Total Blogs: ${blogs.length}`;
    }
    // No Blogs
    if(blogs.length === 0){
        blogList.innerHTML = `
        <h3 class="no-blog">
           No blogs available
        </h3>`;
        return;
    }
    // clear previous blogs
    blogList.innerHTML = "";
    // Display Blogs
    blogs.forEach((blog,index) => {

        blogList.innerHTML += `
            <div class="card">
                ${index === blogs.length-1?`<span class="badge"></span>` : ''}
                <h2>${blog.title}</h2>
                <p><strong>👤 Author:</strong> ${blog.author}</p>
                <p>${blog.description}</p>
                <p class="blog-date">📅 ${blog.date}</p>
            
            
                <div class="blog-actions">

                    <button class="edit-btn" onclick="editBlog(${blog.id})">
                        ✏️ Edit
                    </button>
                    <button
                            class="delete-btn"
                            onclick="deleteBlog(${blog.id})">
                            🗑️ Delete
                    </button>

                </div>
            </div>  
            
        `;

    });
    // Apply current search
        applySearch();


} catch (error) {

        console.error("Error loading blogs:", error);

    }
}

// EDIT BLOG

async function editBlog(id) {

    try {

        const response = await fetch("/api/blogs");

        const blogs = await response.json();

        const blog = blogs.find(
            blog => blog.id === parseInt(id)
        );


        if (!blog) {

            alert("❌ Blog not found!");

            return;
        }


        // Save blog ID
        localStorage.setItem("editBlogId", blog.id);


        // Open EditBlog.html
        window.location.href = "EditBlog.html";

    } catch (error) {

        console.error("Error:", error);

        alert("❌ Unable to edit blog!");

    }

}

// LOAD BLOG DATA INTO EDIT FORM


async function loadEditBlog() {

    const blogId = localStorage.getItem("editBlogId");

    if (!blogId) return;


    // Check whether form exists

    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const descriptionInput = document.getElementById("description");
    const blogIdInput = document.getElementById("blogId");

    if (!titleInput || !authorInput || !descriptionInput) {
        return;
    }


    try {

        const response = await fetch("/api/blogs");

        const blogs = await response.json();

        const blog = blogs.find(
            blog => blog.id === parseInt(blogId)
        );


        if (!blog) {

             alert("❌ Blog not found!");

            localStorage.removeItem("editBlogId");

            window.location.href = "Index.html";

            return;
        }


        // Fill form with existing data

        titleInput.value = blog.title;

        authorInput.value = blog.author;

        descriptionInput.value = blog.description;


        // Create hidden ID field if it doesn't exist

        let idInput = document.getElementById("blogId");

        if (!idInput) {

            idInput = document.createElement("input");

            idInput.type = "hidden";

            idInput.id = "blogId";

            idInput.value = blog.id;

            blogForm.appendChild(idInput);

        } else {

            idInput.value = blog.id;

        }


        // Change heading

        const formTitle = document.getElementById("formTitle");

        if (formTitle) {
            formTitle.textContent = "✏️ Edit Blog";
        }


        // Change button

        const submitButton = document.getElementById("submitButton");

        if (submitButton) {
            submitButton.textContent = "🔄 Update Blog";
        }


        // Change subtitle

        const formSubtitle =
            document.getElementById("formSubtitle");

        if (formSubtitle) {

            formSubtitle.textContent =
                "Update your existing blog post";

        }

    } catch (error) {

        console.error("Error:", error);

    }

}
// Delete Blog
// ==========================================

async function deleteBlog(id) {

    // Confirmation
    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(`/api/blogs/${id}`, {

                method: "DELETE"
            });


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            // Reload blogs
            loadBlogs();
        }


    } catch (error) {

        console.error("Error:", error);

        alert("❌ Unable to delete blog!");

    }
}

// Search Blogs
const search =
    document.getElementById("search");


if (search) {

    search.addEventListener(
        "input",
        function () {

            applySearch();

        }
    );
}
// Apply Search
function applySearch() {

    const searchInput =
        document.getElementById("search");


    if (!searchInput) {
        return;
    }
    const value =
        searchInput.value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(".card");
        cards.forEach(card => {

        const title =
            card.querySelector("h2")
                .textContent
                .toLowerCase();


        const authorElement =
            card.querySelector("strong");


        const author = 
        authorElement ? authorElement.parentElement.textContent.toLowerCase() : "";
        const description =
            card.textContent.toLowerCase();


        if (
            title.includes(value) ||
            author.includes(value) ||
            description.includes(value)
        ) {

            card.style.display = "";
        } else {

            card.style.display = "none";
        }

    });
}


loadBlogs();
loadEditBlog();