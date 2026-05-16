package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.SkillAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * SCC SYSTEM REPOSITORY
 * Extends JpaRepository to provide automated CRUD operations for the Audit Stream.
 */
@Repository
public interface SkillAuditRepository extends JpaRepository<SkillAudit, Long> {

    /**
     * Custom query to fetch audits based on their current status (e.g., "PENDING").
     * @param status The status string to filter by.
     * @return A list of SkillAudit nodes matching the status.
     */
    List<SkillAudit> findByStatus(String status);
}