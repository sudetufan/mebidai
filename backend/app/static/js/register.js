document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!username || !email || !password) {
                showToast("Please fill all fields", "error");
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
                    showToast(data.detail || "Registration failed", "error");
                    return;
                }

                showToast("Registration successful. Please verify your email.");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);

            } catch (error) {
                console.error(error);
                showToast("Something went wrong.", "error");
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
            showToast(data.detail || "Google registration failed.", "error");
            return;
        }

        window.location.href = "/";

    } catch (error) {
        console.error(error);
        showToast("Something went wrong.", "error");
    }
}