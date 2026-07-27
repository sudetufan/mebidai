document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim();

        if (!email) {
            alert("Please enter your email.");
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
                alert(data.detail || "Something went wrong.");
                return;
            }

            alert(data.message);

            window.location.href = "/login";

        } catch (error) {
            console.error(error);

            alert("Server error.");
        }

    });