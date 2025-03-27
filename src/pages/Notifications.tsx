
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActiveClientHeader from '@/components/ActiveClientHeader';
import NotificationsHeader from '@/components/notifications/NotificationsHeader';
import NotificationsList from '@/components/notifications/NotificationsList';
import EmptyNotifications from '@/components/notifications/EmptyNotifications';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
  const navigate = useNavigate();
  const { 
    notifications,
    hasUnreadNotifications,
    handleNotificationClick,
    handleRemove,
    handleClearAll,
    handleMarkAllAsRead
  } = useNotifications();

  const handleNavigateToLink = (id: string, link?: string) => {
    const navigateToLink = handleNotificationClick(id, link);
    if (navigateToLink) {
      navigate(navigateToLink);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ActiveClientHeader />
      <div className="container mx-auto p-4 sm:p-6">
        <NotificationsHeader 
          hasNotifications={notifications.length > 0}
          hasUnreadNotifications={hasUnreadNotifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
        />

        {notifications.length > 0 ? (
          <NotificationsList 
            notifications={notifications}
            onNotificationClick={handleNavigateToLink}
            onRemove={handleRemove}
          />
        ) : (
          <EmptyNotifications />
        )}
      </div>
    </div>
  );
};

export default Notifications;
