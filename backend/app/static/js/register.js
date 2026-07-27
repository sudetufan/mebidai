document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!username || !email || !password) {
                alert("Please fill all fields");
                return;
            }

            try {
                const response = await fetch(
                    "/api/v1/users/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username,
                            email,
                            password,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.detail || "Registration failed");
                    return;
                }

                alert("Registration successful. Please verify your email.");
                window.location.href = "/login";

            } catch (error) {
                console.error(error);
                alert("Something went wrong.");
            }
        });
    }
});

async function handleGoogleLogin(response) {
    try {
        const res = await fetch(
            "/api/v1/users/google-login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: response.credential,
                }),
                credentials: "include",
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Google registration failed.");
            return;
        }

        window.location.href = "/";

    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
}