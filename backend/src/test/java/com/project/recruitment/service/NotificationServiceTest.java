package com.project.recruitment.service;

import com.project.recruitment.domain.Notification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NotificationServiceTest {
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService();
    }

    @Test
    void shouldSendAndMarkNotificationAsRead() {
        Notification n = notificationService.sendNotification(10L, "Chào mừng", "Bạn vừa tạo tài khoản", "SYSTEM");
        assertNotNull(n);
        assertFalse(n.isRead());

        List<Notification> userNotifications = notificationService.getNotificationsForUser(10L);
        assertEquals(1, userNotifications.size());

        notificationService.markAsRead(n.getId());
        assertTrue(notificationService.getNotificationsForUser(10L).get(0).isRead());
    }
}
