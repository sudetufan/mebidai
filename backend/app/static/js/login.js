const form = document.getElementById("loginForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {

            const response = await fetch(
                "/api/v1/users/login",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            if (!response.ok) {

                const error = await response.json();

                alert(error.detail || "Login failed");

                return;
            }

            alert("Login successful!");

            window.location.href = "/";

        } catch (error) {

            console.error(error);

            alert("Something went wrong.");

        }

    });

}


// Google Sign-In callback
window.handleGoogleLogin = async function (response) {

    try {

        const res = await fetch(
            "/api/v1/users/google-login",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: response.credential,
                }),
            }
        );

        if (!res.ok) {

            const error = await res.json();

            alert(error.detail || "Google login failed.");

            return;
        }

        window.location.href = "/";

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

};