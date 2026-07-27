const searchInput=document.getElementById("userSearch");
const resultsBox=document.getElementById("searchResults");

if(searchInput&&resultsBox){

    let timeout=null;

    searchInput.addEventListener("input",function(){

        clearTimeout(timeout);

        const query=this.value.trim();

        if(query.length===0){
            resultsBox.innerHTML="";
            resultsBox.style.display="none";
            return;
        }

        timeout=setTimeout(async()=>{

            try{

                const response=await fetch(`/api/v1/users/search?q=${encodeURIComponent(query)}`);

                if(!response.ok){
                    resultsBox.style.display="none";
                    return;
                }

                const users=await response.json();

                resultsBox.innerHTML="";

                if(users.length===0){
                    const empty=document.createElement("div");
                    empty.className="search-empty";
                    empty.textContent="No users found";
                    resultsBox.appendChild(empty);
                    resultsBox.style.display="block";
                    return;
                }

                users.forEach(user=>{

                    const item=document.createElement("a");

                    item.href=`/users/${user.username}`;
                    item.className="search-user";
                    item.textContent=user.username;

                    resultsBox.appendChild(item);

                });

                resultsBox.style.display="block";

            }catch(err){

                console.error("Search error:",err);
                resultsBox.innerHTML="";
                resultsBox.style.display="none";

            }

        },300);

    });

    document.addEventListener("click",function(e){

        if(!resultsBox.contains(e.target)&&e.target!==searchInput){
            resultsBox.style.display="none";
        }

    });

    document.addEventListener("keydown",function(e){

        if(e.key==="Escape"){
            resultsBox.style.display="none";
            searchInput.blur();
        }

    });

}