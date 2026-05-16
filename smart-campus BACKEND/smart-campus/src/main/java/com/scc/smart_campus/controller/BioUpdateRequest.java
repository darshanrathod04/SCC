package com.scc.smart_campus.controller;

public class BioUpdateRequest {
    private String email;
    private String education;
    private String bio;

    // Standard Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}