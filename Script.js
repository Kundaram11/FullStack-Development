document.getElementById("blogForm").addEventListener("submit", function(event){

event.preventDefault();

let title = document.getElementById("title").value.trim();
let author = document.getElementById("author").value.trim();
let description = document.getElementById("description").value.trim();

if(title === "" || author === "" || description === ""){

alert("Please fill all fields!");

return;

}

alert("Blog submitted successfully!");

document.getElementById("blogForm").reset();

});