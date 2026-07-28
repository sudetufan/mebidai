async function openLikesModal(postId){

    const modal=document.getElementById("likesModal");
    const likesList=document.getElementById("likesList");
    likesList.innerHTML="<li>Loading...</li>";
    modal.style.display="flex";
    try{
        const response=await fetch(`/api/v1/posts/${postId}/likes`);
        const users=await response.json();
        if(users.length===0){
            likesList.innerHTML="<li>No likes yet.</li>";
            return;
        }
        likesList.innerHTML="";
        users.forEach(user=>{
            likesList.innerHTML+=`
                <li>
                    <a href="/users/${user.username}">
                        ${user.username}
                    </a>
                </li>
            `;
        });
    }catch(error){
        console.error(error);
        likesList.innerHTML="<li>Failed to load likes.</li>";
    }
}
function closeLikesModal(){
    document.getElementById("likesModal").style.display="none";
}
window.addEventListener("click",event=>{
    const modal=document.getElementById("likesModal");
    if(event.target===modal){
        closeLikesModal();
    }
});