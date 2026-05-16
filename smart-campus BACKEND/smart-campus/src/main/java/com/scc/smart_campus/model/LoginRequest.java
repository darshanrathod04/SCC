package com.scc.smart_campus.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * SCC AUTH PROTOCOL: LOGIN REQUEST DTO
 * Encapsulates security credentials for identity verification.
 */
public class LoginRequest {

    @NotBlank(message = "Identity identifier (Email) cannot be empty")
    @Email(message = "Invalid institutional email format")
    private String email;

    @NotBlank(message = "Security credential (Password) cannot be empty")
    @Size(min = 8, message = "Security protocols require at least 8 characters")
    private String password;

    // --- CONSTRUCTORS ---
    
    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // --- GETTERS & SETTERS ---

    public String getEmail() { 
        return email; 
    }

    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getPassword() { 
        return password; 
    }

    public void setPassword(String password) { 
        this.password = password; 
    }
}