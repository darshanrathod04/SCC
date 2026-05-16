package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.ActivityLog;
import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.repository.ActivityLogRepository;
import com.scc.smart_campus.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
public class LeadTrackingController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityLogRepository activityRepo;

    @PostMapping("/track")
    public ResponseEntity<?> trackPartnerInterest(
            @RequestParam Long studentId, 
            @RequestParam String partnerEmail) {
        
        try {
            // 1. Validate the Student Node
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student Node Not Found"));

            // 2. Generate the Activity Entry for the Founder's Pulse
            ActivityLog log = new ActivityLog();
            log.setUserName(partnerEmail);
            log.setDescription("Analyzed credentials and Resume of " + student.getFullName());
            log.setType("LEAD_GEN"); // Critical for color-coding in admin.html
            
            activityRepo.save(log);

            return ResponseEntity.ok("LEAD_SYNCHRONIZED");
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }
    @PostMapping("/track-search")
public ResponseEntity<?> trackSearch(@RequestParam String query, @RequestParam String partnerEmail) {
    ActivityLog log = new ActivityLog();
    log.setUserName(partnerEmail);
    // Log what they are looking for specifically
    log.setDescription("Searched for talent node: " + query);
    log.setType("SEARCH_INTENT"); 
    
    activityRepo.save(log);
    return ResponseEntity.ok("SEARCH_LOGGED");
}
}