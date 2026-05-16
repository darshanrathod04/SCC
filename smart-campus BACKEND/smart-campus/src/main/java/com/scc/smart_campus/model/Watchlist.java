package com.scc.smart_campus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partner_watchlist")
public class Watchlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String partnerEmail; // The partner who saved the talent
    private Long studentId;      // The student node being tracked
    private LocalDateTime savedAt;

    public Watchlist() { this.savedAt = LocalDateTime.now(); }

    // Getters and Setters
    public Long getId() { return id; }
    public String getPartnerEmail() { return partnerEmail; }
    public void setPartnerEmail(String partnerEmail) { this.partnerEmail = partnerEmail; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
}
