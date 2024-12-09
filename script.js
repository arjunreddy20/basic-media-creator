// Fetch posts from backend on page load
const fetchPosts = async () => {
    try {
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const posts = await response.json();
        console.log("Fetched Posts:", posts); // Debugging line
        posts.forEach(post => createPost(post.id, post.image_url, post.description, post.comments));
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};
fetchPosts();


// Create a new post
document.getElementById("createPost").addEventListener("click", async () => {
    const imageUrl = document.getElementById("imageUrl").value;
    const description = document.getElementById("description").value;

    if (imageUrl && description) {
        const response = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl, description }),
        });
        const newPost = await response.json();
        createPost(newPost.id, imageUrl, description, []);
        document.getElementById("imageUrl").value = '';
        document.getElementById("description").value = '';
    } else {
        alert("Please fill in all fields!");
    }
});

// Create post in DOM
const createPost = (id, imageUrl, description, comments) => {
    const postsContainer = document.getElementById("postsContainer");

    const postElement = document.createElement("div");
    postElement.className = "post";

    postElement.innerHTML = `
        
        <img src="${imageUrl}" alt="Post Image">
        <p style="text-align:center";>${description}</p>
        <div class="comments-section">
            <input type="text" id="commentInput-${id}" placeholder="Add a comment"><br><br>
            <button onclick="handleAddComment(${id})">Add Comment</button>
            <div id="commentsContainer-${id}">
                ${comments.map(comment => `<p>${comment}</p>`).join("")}
            </div>
        </div>
    `;

    postsContainer.appendChild(postElement);
};

// Handle adding comments
window.handleAddComment = async (postId) => {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const comment = commentInput.value;

    if (comment) {
        await fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment }),
        });
        const commentsContainer = document.getElementById(`commentsContainer-${postId}`);
        const commentElement = document.createElement("p");
        commentElement.textContent = comment;
        commentsContainer.appendChild(commentElement);
        commentInput.value = '';
    } else {
        alert("Comment cannot be empty!");
    }
};
