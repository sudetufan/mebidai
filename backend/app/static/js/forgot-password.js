document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document
            .getElementById("email")
            .value
            .trim();
        if (!email) {
            showToast("Please enter your email.", "error");
            return;
        }
        try {
            const response = await fetch(
                "/api/v1/users/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                showToast(data.detail || "Something went wrong.", "error");
                return;
            }
            showToast(data.message);
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            showToast("Server error.", "error");
        }
    });