package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    // Fetches latest logs first for the Admin Pulse
    List<ActivityLog> findAllByOrderByTimestampDesc();
    
    boolean existsByUserIdAndDescriptionAndTimestampAfter(
        Long userId, 
        String description, 
        LocalDateTime timestamp
    );
}