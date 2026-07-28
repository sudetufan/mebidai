document.addEventListener("DOMContentLoaded", function () {
    let notificationInterval = null;

    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationCount = document.getElementById("notificationCount");


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
        if (!notificationDropdown) {
            return;
        }


        if (!notifications || notifications.length === 0) {

            notificationDropdown.innerHTML = `
                <p class="empty-notif">
                    No notifications
                </p>
            `;

            if (notificationCount) {
                notificationCount.style.display = "none";
            }

            return;
        }


        const unreadCount = notifications.filter(
            notification => !notification.is_read
        ).length;


        if (notificationCount) {

            if (unreadCount > 0) {

                notificationCount.innerText = unreadCount;
                notificationCount.style.display = "inline-block";

            } else {

                notificationCount.style.display = "none";

            }
        }


        notificationDropdown.innerHTML = "";


        notifications.forEach(notification => {

            const item = document.createElement("div");

            item.className = `
                notification-item 
                ${notification.is_read ? "read" : "unread"}
            `;


            let message = "";

            if (notification.type === "like") {
                message = `${notification.sender_username} liked your post`;
            }

            else if (notification.type === "comment") {
                message = `${notification.sender_username} commented on your post`;
            }

            else if (notification.type === "follow") {
                message = `${notification.sender_username} started following you`;
            }

            else if (notification.type === "mention") {
                message = `${notification.sender_username} mentioned you`;
            }

            else {
                message = "New notification";
            }


item.innerText = message;


            item.addEventListener("click", async () => {

                await markAsRead(notification.id);


                if (notification.type === "follow") {

                    window.location.href = `/users/${notification.sender_username}`;

                } 
    
                else if (
                    notification.type === "like" ||
                    notification.type === "comment" ||
                    notification.type === "mention"
                ) {

                    window.location.href = `/posts/${notification.post_id}`;

                }

            });


            notificationDropdown.appendChild(item);

        });

    }



    async function markAsRead(notificationId) {

        try {

            await fetch(
                `/api/v1/notifications/${notificationId}/read`,
                {
                    method: "PATCH"
                }
            );


            fetchNotifications();


        } catch (error) {

            console.error(
                "Mark as read error:",
                error
            );

        }

    }



    // Dropdown aç/kapat

    if (notificationBtn && notificationDropdown) {

        notificationBtn.addEventListener(
            "click",
            function () {

                notificationDropdown.classList.toggle("show");

            }
        );

    }



    // İlk yükleme

    fetchNotifications();


    // 30 saniyede bir güncelle

    notificationInterval = setInterval(
        fetchNotifications,
        30000
    );


});