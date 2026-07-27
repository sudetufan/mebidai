document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("notificationBtn");
    const dropdown = document.getElementById("notificationDropdown");
    const count = document.getElementById("notificationCount");

    if (!btn) {
        return;
    }

    btn.addEventListener("click", function () {
        dropdown.classList.toggle("show");
    });

    async function loadNotifications() {
        try {
            const response = await fetch("/api/v1/notifications/");

            if (!response.ok) {
                return;
            }

            const notifications = await response.json();
            renderNotifications(notifications);
        } catch (error) {
            console.error("Notification error:", error);
        }
    }

    function renderNotifications(notifications) {
        dropdown.innerHTML = "";
        let unread = 0;

        if (notifications.length === 0) {
            dropdown.innerHTML = `<p>No notifications</p>`;
            count.style.display = "none";
            return;
        }

        notifications.forEach(notification => {
            if (!notification.is_read) {
                unread++;
            }

            const item = document.createElement("div");
            item.className = `notification-item ${!notification.is_read ? 'unread' : ''}`;

            const sender = notification.sender_username || (notification.sender && notification.sender.username) || "Someone";
            let text = "";

            if (notification.type === "like") {
                text = `${sender} liked your post`;
            } else if (notification.type === "comment") {
                text = `${sender} commented on your post`;
            } else if (notification.type === "follow") {
                text = `${sender} started following you`;
            } else if (notification.type === "mention") {
                text = `${sender} mentioned you in a comment`;
            }

            item.innerText = text;

            item.addEventListener("click", function () {
                openNotification(notification);
            });

            dropdown.appendChild(item);
        });

        if (unread > 0) {
            count.innerText = unread;
            count.style.display = "inline";
        } else {
            count.style.display = "none";
        }
    }

    async function openNotification(notification) {
        try {
            await fetch(`/api/v1/notifications/${notification.id}/read`, {
                method: "PATCH"
            });
        } catch (err) {
            console.error("Could not mark notification as read", err);
        }

        const targetUsername = notification.sender_username || (notification.sender && notification.sender.username);

        if (notification.type === "follow") {
            if (targetUsername) {
                window.location.href = `/users/${targetUsername}`;
            } else {
                window.location.href = "/blog";
            }
        } else if (notification.post_id) {
            window.location.href = `/posts/${notification.post_id}`;
        } else {
            window.location.href = "/blog";
        }
    }

    loadNotifications();

    setInterval(loadNotifications, 30000);
});