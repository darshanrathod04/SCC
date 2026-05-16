package com.scc.smart_campus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "partners")
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String industry;
    private String email;
    
    // Status can be: PENDING_APPROVAL, VERIFIED, or REJECTED
    private String status;

    // Default Constructor (Required by JPA)
    public Partner() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    // Inside Partner.java
private String password; // Add this field

public String getPassword() { return password; }
public void setPassword(String password) { this.password = password; }
}