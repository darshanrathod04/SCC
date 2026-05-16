package com.scc.smart_campus.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * SCC PROTOCOL: INTERNSHIP ENTITY
 * Synchronized with Database Columns: title, company, location, duration, skills.
 */
@Entity
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    @Column(name = "title", nullable = false) 
    private String title;

    @NotBlank(message = "Company is mandatory")
    @Column(name = "company", nullable = false)
    private String company;

    @Column(name = "location")
    private String location;

    @Column(name = "duration")
    private String duration;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "published_at", updatable = false)
    private LocalDateTime publishedAt;

    @PrePersist
    protected void onCreate() {
        this.publishedAt = LocalDateTime.now();
    }

    public Internship() {}

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
}