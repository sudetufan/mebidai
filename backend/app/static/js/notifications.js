document.addEventListener("DOMContentLoaded", function () {
    let notificationInterval = null;

    async function fetchNotifications() {
        try {
            const response = await fetch("/api/v1/notifications/");

            if (response.status === 401) {
                if (notificationInterval) {
                    clearInterval(notificationInterval);
                }
                return;
            }

            if (!response.ok) {
                return;
            }

            const notifications = await response.json();
            renderNotifications(notifications);
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    }

    function renderNotifications(notifications) {
        const dropdown = document.querySelector(".notifications-dropdown") || document.getElementById("notificationsDropdown");
        const badge = document.querySelector(".notification-badge") || document.getElementById("notificationBadge");

        if (!dropdown) return;

        if (!notifications || notifications.length === 0) {
            dropdown.innerHTML = `<p class="empty-notif" style="padding: 10px; text-align: center; color: #888;">No notifications</p>`;
            if (badge) badge.style.display = "none";
            return;
        }

        const unreadCount = notifications.filter(n => !n.is_read).length;
        if (badge) {
            if (unreadCount > 0) {
                badge.innerText = unreadCount;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
            }
        }

        dropdown.innerHTML = "";
        notifications.forEach(notification => {
            const item = document.createElement("div");
            item.className = `notification-item ${notification.is_read ? 'read' : 'unread'}`;
            item.innerText = notification.message || "New notification";
            
            item.addEventListener("click", async () => {
                await markAsRead(notification.id);
            });

            dropdown.appendChild(item);
        });
    }

    async function markAsRead(notificationId) {
        try {
            await fetch(`/api/v1/notifications/${notificationId}/read`, {
                method: "POST"
            });
            fetchNotifications();
        } catch (error) {
            console.error("Mark as read error:", error);
        }
    }

    fetchNotifications();

    notificationInterval = setInterval(fetchNotifications, 30000);
});