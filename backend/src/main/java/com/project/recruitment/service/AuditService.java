package com.project.recruitment.service;

import com.project.recruitment.domain.AuditLog;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AuditService {
    private final Map<Long, AuditLog> logsById = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public AuditLog logAction(Long actorUserId, String actorName, String actionType, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(
            idCounter.getAndIncrement(),
            actorUserId,
            actorName != null ? actorName : "System",
            actionType,
            entityType,
            entityId,
            details
        );
        logsById.put(log.getId(), log);
        return log;
    }

    public List<AuditLog> getAllAuditLogs() {
        return logsById.values().stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .toList();
    }
}
