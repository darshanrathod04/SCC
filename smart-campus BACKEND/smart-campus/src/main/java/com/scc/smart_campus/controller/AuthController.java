package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.LoginRequest;
import com.scc.smart_campus.model.LoginResponse;
import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.repository.StudentRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return studentRepository.findByEmail(request.getEmail())
            .map(user -> {
                // 1. Verify Password
                if (user.getPassword().equals(request.getPassword())) {
                    
                    // 2. UPDATE TIMESTAMP HERE (Inside the success block)
                    user.setLastLogin(LocalDateTime.now());
                    studentRepository.save(user); // Use 'user', not 'student'

                    // 3. Return Response
                    LoginResponse response = new LoginResponse(
                        user.getFullName(), 
                        user.getRole(), 
                        "success", 
                        user.getId(), 
                        user.getExperiencePoints(),
                        user.getEmail()
                    );
                    return ResponseEntity.ok(response);
                }
                return ResponseEntity.status(401).body("Invalid Authentication Protocol");
            })
            .orElse(ResponseEntity.status(404).body("Identity Not Found"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentRepository.save(student));
    }
}