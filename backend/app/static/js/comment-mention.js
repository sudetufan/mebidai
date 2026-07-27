const commentInput = document.getElementById("commentInput");
const mentionResults = document.getElementById("mentionResults");


if (commentInput && mentionResults) {

    let timeout = null;


    commentInput.addEventListener("input", function () {

        clearTimeout(timeout);


        const text = this.value;

        const match = text.match(/@([A-Za-zA-Z0-9_]*)$/);


        if (!match) {

            mentionResults.innerHTML = "";
            mentionResults.style.display = "none";

            return;

        }


        const query = match[1];


        if (query.length === 0) {

            mentionResults.innerHTML = "";
            mentionResults.style.display = "none";

            return;

        }


        timeout = setTimeout(async () => {


            try {


                const response = await fetch(
                    `/api/v1/users/search?q=${encodeURIComponent(query)}`
                );


                if (!response.ok) {

                    mentionResults.style.display = "none";
                    return;

                }


                const users = await response.json();


                mentionResults.innerHTML = "";


                if (users.length === 0) {

                    mentionResults.style.display = "none";
                    return;

                }



                users.forEach(user => {


                    const item = document.createElement("div");


                    item.className = "mention-item";


                    item.textContent = user.username;



                    item.onclick = function () {


                        const currentText = commentInput.value;


                        const replaced = currentText.replace(
                            /@([A-Za-zA-Z0-9_]*)$/,
                            "@" + user.username + " "
                        );


                        commentInput.value = replaced;


                        mentionResults.innerHTML = "";
                        mentionResults.style.display = "none";


                        commentInput.focus();


                    };


                    mentionResults.appendChild(item);


                });



                mentionResults.style.display = "block";



            } catch (error) {


                console.error(
                    "Mention search error:",
                    error
                );


            }


        }, 300);


    });



    document.addEventListener(
        "click",
        function(e){


            if (
                !mentionResults.contains(e.target)
                &&
                e.target !== commentInput
            ){

                mentionResults.style.display = "none";

            }


        }
    );


}