const params = new URLSearchParams(window.location.search);

const token = params.get("token");

document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const new_password =
            document
                .getElementById("password")
                .value;

        const response = await fetch(
            "/api/v1/users/reset-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    new_password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showToast(data.detail, "error");
            return;
        }
        showToast(data.message)
        window.location.href = "/login";

    });