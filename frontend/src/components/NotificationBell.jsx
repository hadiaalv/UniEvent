import { useEffect, useState } from "react";
import api from "../lib/api";

export default function NotificationBell({ userId, role }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      const res = await api.get(`/notifications`);
      setNotifications(res.data.notifications || []);
    } catch (err) {
      // Silently fail - notifications are not critical
      console.log("Notifications not available");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll every 30s for new notifications (reduced from 5s to be less aggressive)
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.log("Could not mark notification as read");
    }
  };

  const handleClose = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowDropdown(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl z-20 overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3">
              <h3 className="font-bold text-lg">Notifications</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔕</div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n._id} 
                    onClick={() => markAsRead(n._id)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.isRead && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <p className="text-gray-800 text-sm font-medium">{n.message}</p>
                        <small className="text-gray-500 text-xs">
                          {new Date(n.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 text-center">
                <button 
                  onClick={handleClose}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}