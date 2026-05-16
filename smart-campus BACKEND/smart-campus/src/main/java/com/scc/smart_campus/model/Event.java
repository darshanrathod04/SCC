package com.scc.smart_campus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * SCC PROTOCOL: CONCLAVE ENTITY
 * Represents a high-stakes technical engagement or campus event.
 *
 */
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @Column(name = "title")
    private String title;

    @Column(nullable = false)
    private String organizer; // Authorized Dept or Identity

    @Column(nullable = false)
    private String date; // Standard Protocol Date

    @Column(nullable = false)
    private String mode; // Deployment: Online/Offline

    @Column(columnDefinition = "TEXT")
    private String eligibility; // Technical Stack Requirements
    
    @Column(name = "registration_link")
private String registrationLink;

    /**
     * CONCLAVE MANIFEST: Many-to-Many relationship with Students.
     * Maps to the 'event_registrations' Join Table for Analytics.
     *
     */
    // Inside Event.java
@ManyToMany(fetch = FetchType.EAGER) // Change LAZY to EAGER
@JoinTable(
  name = "event_registrations",
  joinColumns = @JoinColumn(name = "event_id"),
  inverseJoinColumns = @JoinColumn(name = "student_id")
)
@JsonIgnoreProperties("registeredEvents") 
private List<Student> registeredStudents = new ArrayList<>();
    // ===== PROFESSIONAL CONSTRUCTORS =====

    public Event() {}

    // ===== CORE ANALYTICS HELPERS =====

    /**
     * Professional Helper: Returns the live count of registrants for the dashboard.
     *
     */
    @Transient
    public int getRegistrantCount() {
        return registeredStudents != null ? registeredStudents.size() : 0;
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    
    public String getRegistrationLink() { 
    return registrationLink; 
}
public void setRegistrationLink(String registrationLink) { 
    this.registrationLink = registrationLink; 
}

    public List<Student> getRegisteredStudents() { return registeredStudents; }
    public void setRegisteredStudents(List<Student> registeredStudents) { 
        this.registeredStudents = registeredStudents; 
    }
}