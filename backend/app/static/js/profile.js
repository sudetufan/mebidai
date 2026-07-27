function openFollowers() {
    const modal = document.getElementById("followersModal");
    if (modal) {
        modal.classList.add("show");
    }
}

function openFollowing() {
    const modal = document.getElementById("followingModal");
    if (modal) {
        modal.classList.add("show");
    }
}

function closeModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
            closeModals();
        }
    });
});