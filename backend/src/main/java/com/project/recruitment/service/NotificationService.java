package com.project.recruitment.service;

import com.project.recruitment.domain.Notification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NotificationService {
    private final Map<Long, Notification> notificationsById = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public Notification sendNotification(Long userId, String title, String message, String type) {
        if (userId == null) return null;
        Notification notification = new Notification(
            idCounter.getAndIncrement(),
            userId,
            title,
            message,
            type
        );
        notificationsById.put(notification.getId(), notification);
        return notification;
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        if (userId == null) return List.of();
        return notificationsById.values().stream()
            .filter(n -> userId.equals(n.getUserId()))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationsById.get(notificationId);
        if (notification != null) {
            notification.setRead(true);
        }
        return notification;
    }

    public void markAllAsRead(Long userId) {
        if (userId == null) return;
        notificationsById.values().stream()
            .filter(n -> userId.equals(n.getUserId()))
            .forEach(n -> n.setRead(true));
    }
}
