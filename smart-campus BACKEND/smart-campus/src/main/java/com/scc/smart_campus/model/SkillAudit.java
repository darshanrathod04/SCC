package com.scc.smart_campus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_stream")
public class SkillAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String skillName;
    private String skillLevel;
    private String status = "PENDING"; // Default state
    private LocalDateTime submittedAt = LocalDateTime.now();

    // --- CONSTRUCTORS ---
    public SkillAudit() {}

    // --- GETTERS & SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}