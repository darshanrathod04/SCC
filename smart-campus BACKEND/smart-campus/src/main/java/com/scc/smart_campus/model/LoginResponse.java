package com.scc.smart_campus.model;

public class LoginResponse {
    private String name;
    private String role;
    private String status;
    private Long userId;
    private Integer experiencePoints;
    private String email;

public LoginResponse(String name, String role, String status, Long userId, Integer experiencePoints, String email) {
        this.name = name;
        this.role = role;
        this.status = status;
        this.userId = userId;
        this.experiencePoints = experiencePoints;
        this.email = email; // ADD THIS LINE
    }
    // Getters only (Responses are usually read-only)
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
    public Long getUserId() { return userId; }
    public Integer getExperiencePoints() { return experiencePoints; }
    public String getEmail() { return email; }
}