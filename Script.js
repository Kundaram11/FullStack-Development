const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const description = document.getElementById("description").value.trim();

        if (title === "" || author === "" || description === "") {
            alert("Please fill all fields!");
            return;
        }

        const response = await fetch("/api/blog", {
            method: "POST",
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

        blogForm.reset();

    });
}
async function loadBlogs() {

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

    blogList.innerHTML = "";

    blogs.forEach((blog,index) => {

        blogList.innerHTML += `
            <div class="card">
                ${index === blogs.length-1?`<span class="badge"></span>` : ''}
                <h2>${blog.title}</h2>
                <p><strong>👤 Author:</strong> ${blog.author}</p>
                <p>${blog.description}</p>
                <p class="blog-date">📅 ${blog.date || "Today"}</p>
            </div>
        `;

    });

}
const search = document.getElementById("search");

if (search) {

    search.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {

            const title = card.querySelector("h2").textContent.toLowerCase();
            if(title.includes(value)){
               card.style.display = "";
            }else{
                card.style.display ="none";
            }
            
                

        });

    });

}

loadBlogs();
