package com.scc.smart_campus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentEmail;
    private String partnerEmail;
    private String status; // e.g., "SENT", "REVIEWED", "INTERVIEWED"
    private LocalDateTime appliedAt;

    public JobApplication() { this.appliedAt = LocalDateTime.now(); }

    // Getters and Setters
    public Long getId() { return id; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getPartnerEmail() { return partnerEmail; }
    public void setPartnerEmail(String partnerEmail) { this.partnerEmail = partnerEmail; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}