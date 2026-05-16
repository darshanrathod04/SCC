package com.scc.smart_campus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "students")
public class Student {
    
    
    
    private String profileImage; // This will map to the new database column

public String getProfileImage() {
    return profileImage;
}

// Setter for the profile image
public void setProfileImage(String profileImage) {
    this.profileImage = profileImage;
}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name")
    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password;
    private String role;
    private String college;
    private String mobile;
    private String skills;
    
    // Bio and Education Node Fields
    private String education;
    private String bio;

    @Column(name = "balance", nullable = false)
    private Double balance = 0.0; // Smart Wallet Infrastructure

    @Column(name = "experience_points", nullable = false)
    private Integer experiencePoints = 0; // Protocol XP Node

    /**
     * Infrastructure Node: Skill & Audit Relationships
     * This replaces the "Object skillAudits" and solves the duplicate variable error.
     * We remove 'final' to allow Hibernate to inject the list from the database.
     */
    @OneToMany(mappedBy = "userId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SkillAudit> skillAudits = new ArrayList<>();

    // --- CONSTRUCTORS ---
    public Student() {}

    // --- GETTERS & SETTERS ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public Integer getExperiencePoints() { 
        return experiencePoints != null ? experiencePoints : 0; 
    }
    public void setExperiencePoints(Integer experiencePoints) { 
        this.experiencePoints = experiencePoints; 
    }

    // Alias for Service Logic
    public int getXp() { 
        return getExperiencePoints(); 
    }

    public List<SkillAudit> getSkillAudits() { return skillAudits; }
    public void setSkillAudits(List<SkillAudit> skillAudits) { this.skillAudits = skillAudits; }

    /**
     * Logic to gather verified skill names for the JSON response.
     * Now that skillAudits is a List, .stream() works perfectly.
     */
    public List<String> getVerifiedSkills() {
        return (this.skillAudits != null) ? 
               this.skillAudits.stream()
                   .filter(a -> "VERIFIED".equals(a.getStatus()))
                   .map(SkillAudit::getSkillName)
                   .collect(Collectors.toList()) : new ArrayList<>();
    }
    // Inside Student.java
private String resumeFileName;

public String getResumeFileName() { return resumeFileName; }
public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }

private LocalDateTime lastLogin;

// Getters and Setters
public LocalDateTime getLastLogin() { return lastLogin; }
public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

}