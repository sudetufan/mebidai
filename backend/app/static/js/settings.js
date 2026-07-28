document.addEventListener("DOMContentLoaded", async () => {

    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const saveButton = document.getElementById("saveUsername");

    const changePasswordButton = document.getElementById("changePassword");
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const settingsLinks = document.querySelectorAll(".settings-menu a");
    const settingsSections = document.querySelectorAll(".settings-section");

    const bioInput = document.getElementById("bio");
    const saveBioButton = document.getElementById("saveBio");

    async function loadUser() {
        try {
            const response = await fetch("/api/v1/users/me", {
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("User not found");
            }

            const user = await response.json();

            if (usernameInput) usernameInput.value = user.username || "";
            if (emailInput) emailInput.value = user.email || "";
            if (bioInput) bioInput.value = user.bio || "";

        } catch (error) {
            console.error(error);
        }
    }

    if (saveButton) {
        saveButton.addEventListener("click", async () => {
            const username = usernameInput.value.trim();

            if (!username) {
                showToast("Username cannot be empty", "error");
                return;
            }

            try {
                const response = await fetch("/api/v1/users/me/username", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ username: username })
                });

                const data = await response.json();

                if (!response.ok) {
                    showToast(data.detail || "Something went wrong", "error");
                    return;
                }

                showToast(data.message || "Username updated successfully", "success");

            } catch (error) {
                console.error("SETTINGS ERROR:", error);
                showToast(error.message, "error");
            }
        });
    }

    if (changePasswordButton) {
        changePasswordButton.addEventListener("click", async () => {
            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                showToast("Please fill all password fields", "error");
                return;
            }

            try {
                const response = await fetch("/api/v1/users/me/password", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword,
                        confirm_password: confirmPassword
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    showToast(data.detail || "Something went wrong", "error");
                    return;
                }

                showToast(data.message || "Password changed successfully", "success");

                currentPasswordInput.value = "";
                newPasswordInput.value = "";
                confirmPasswordInput.value = "";

            } catch (error) {
                console.error("PASSWORD CHANGE ERROR:", error);
                showToast(error.message, "error");
            }
        });
    }

    if (saveBioButton) {
        saveBioButton.addEventListener("click", async () => {
            const bio = bioInput ? bioInput.value.trim() : "";

            try {
                const response = await fetch("/api/v1/users/me/bio", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ bio: bio })
                });

                const data = await response.json();

                if (!response.ok) {
                    showToast(data.detail || "Something went wrong", "error");
                    return;
                }

                showToast(data.message || "Bio updated successfully", "success");

                await loadUser();

            } catch (error) {
                console.error("BIO UPDATE ERROR:", error);
                showToast(error.message, "error");
            }
        });
    }

    settingsLinks.forEach(link => {
        link.addEventListener("click", () => {
            settingsLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            const section = link.dataset.section;
            localStorage.setItem("settingsSection", section);

            settingsSections.forEach(card => {
                if (card.id === section) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    const savedSection = localStorage.getItem("settingsSection") || "account";

    settingsSections.forEach(card => {
        if (card.id === savedSection) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

    settingsLinks.forEach(link => {
        if (link.dataset.section === savedSection) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    loadUser();

});