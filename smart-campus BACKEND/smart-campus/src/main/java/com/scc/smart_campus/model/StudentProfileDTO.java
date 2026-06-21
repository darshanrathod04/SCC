package com.scc.smart_campus.model;

import java.util.List;

public class StudentProfileDTO {
    private Long id;
    private String fullName;
    private String email;
    private String college;
    private String mobile;
    private String skills;
    private String education;
    private String bio;
    private Integer experiencePoints;

    public StudentProfileDTO(Student student) {
        this.id = student.getId();
        this.fullName = student.getFullName();
        this.email = student.getEmail();
        this.college = student.getCollege();
        this.mobile = student.getMobile();
        this.skills = student.getSkills();
        this.education = student.getEducation();
        this.bio = student.getBio();
        this.experiencePoints = student.getExperiencePoints();
    }

    // --- GETTERS ---
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getCollege() { return college; }
    public String getMobile() { return mobile; }
    public String getSkills() { return skills; }
    public String getEducation() { return education; }
    public String getBio() { return bio; }
    public Integer getExperiencePoints() { return experiencePoints; }
}