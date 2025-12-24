import { useEffect, useState } from "react";

export default function NotificationBell({ userId, role }) {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/auth/notifications/${userId}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll every 5s for new notifications
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-bell relative cursor-pointer">
      🔔
      {unreadCount > 0 && (
        <span className="notification-count">{unreadCount}</span>
      )}

      <div className="notification-dropdown">
        {notifications.length === 0 && <div className="empty">No notifications</div>}
        {notifications.map(n => (
          <div key={n._id} className="notification-item animate-slide-in">
            {n.message} <br />
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
