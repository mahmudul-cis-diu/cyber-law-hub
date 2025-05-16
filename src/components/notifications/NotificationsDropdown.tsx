
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const NotificationsDropdown = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Only fetch notifications if user is logged in
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Count unread notifications
  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  // Get notification icon and link based on type
  const getNotificationDetails = (notification: any) => {
    let icon = '🔔';
    let link = '/';
    
    switch (notification.type) {
      case 'comment':
        icon = '💬';
        link = notification.related_law_id ? `/laws/${notification.related_law_id}` : '/';
        break;
      case 'moderation':
        icon = '🔍';
        link = notification.related_law_id ? `/laws/${notification.related_law_id}` : '/';
        break;
      case 'like':
        icon = '👍';
        link = notification.related_law_id ? `/laws/${notification.related_law_id}` : '/';
        break;
      case 'update':
        icon = '📝';
        link = notification.related_law_id ? `/laws/${notification.related_law_id}` : '/';
        break;
    }
    
    return { icon, link };
  };

  if (!user) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mr-4">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7" 
              onClick={() => markAllAsReadMutation.mutate()}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem className="flex justify-center">
            Loading...
          </DropdownMenuItem>
        ) : notifications && notifications.length > 0 ? (
          <DropdownMenuGroup>
            {notifications.map(notification => {
              const { icon, link } = getNotificationDetails(notification);
              return (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`p-3 flex gap-3 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsReadMutation.mutate(notification.id)}
                >
                  <div className="text-xl">{icon}</div>
                  <div className="flex-grow">
                    <Link to={link} className="block">
                      <p className="text-sm text-gray-800 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>
                    </Link>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuItem className="flex justify-center p-4">
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
