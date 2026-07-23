document.getElementById("blogForm").addEventListener("submit", async function(event){

event.preventDefault();

const title = document.getElementById("title").value.trim();
const author = document.getElementById("author").value.trim();
const description = document.getElementById("description").value.trim();

if(title === "" || author === "" || description === ""){
    alert("Please fill all fields!");
    return;
}

const response = await fetch("/api/blog",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title,
author,
description
})

});

const data = await response.json();

alert(data.message);

document.getElementById("blogForm").reset();

});
