/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.Partner;
import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.model.Watchlist;
import com.scc.smart_campus.repository.PartnerRepository;
import com.scc.smart_campus.repository.StudentRepository;
import com.scc.smart_campus.repository.WatchlistRepository;
import com.scc.smart_campus.service.EmailNotificationService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partners") // Base Path
public class PartnerController {

    @Autowired
    private EmailNotificationService emailService;

@PostMapping("/send-otp")
public ResponseEntity<String> sendOTP(@RequestBody Map<String, String> request) {
    try {
        String email = request.get("email");
        emailService.sendPartnerOTP(email); 
        return ResponseEntity.ok("OTP_SENT");
    } catch (Exception e) {
        e.printStackTrace(); // Console mein error dekhne ke liye
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("AUTHENTICATION_FAILED: Check App Password");
    }
}

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        
        if (emailService.verifyOTP(email, code)) {
            return ResponseEntity.ok("VERIFIED");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID_CODE");
        }
    }
    @Autowired
private PartnerRepository partnerRepository;

@PostMapping("/register")
public ResponseEntity<String> registerPartner(@RequestBody Partner partner) {
    // 1. Force status to PENDING so users don't skip security
    partner.setStatus("PENDING_APPROVAL");
    
    // 2. Save the validated company to the database
    partnerRepository.save(partner);
    
    return ResponseEntity.ok("REGISTRATION_SUCCESSFUL");
}
/**
 * MAINFRAME ADMIN ACCESS: 
 * Authorizes a pending partner to view the Conclave talent pool.
 */
@PatchMapping("/{id}/approve")
public ResponseEntity<String> approvePartner(@PathVariable Long id) {
    return partnerRepository.findById(id)
            .map(partner -> {
                // Elevate status to grant access
                partner.setStatus("VERIFIED");
                partnerRepository.save(partner);
                
                // Professional Step: Notify the partner via email
                emailService.sendPartnerApprovalEmail(partner.getEmail(), partner.getCompanyName());
                
                return ResponseEntity.ok("PARTNER_AUTHORIZED");
            })
            .orElse(ResponseEntity.notFound().build());
}
@GetMapping("/pending")
public ResponseEntity<List<Partner>> getPendingPartners() {
    // Fetches partners where status is 'PENDING_APPROVAL'
    return ResponseEntity.ok(partnerRepository.findByStatus("PENDING_APPROVAL"));
}
/**
 * MAINFRAME ADMIN ACCESS: 
 * Rejects a partner application and removes them from the pending stream.
 */
@DeleteMapping("/{id}/reject")
public ResponseEntity<String> rejectPartner(@PathVariable Long id) {
    return partnerRepository.findById(id)
            .map(partner -> {
                // Update status to REJECTED
                partner.setStatus("REJECTED");
                partnerRepository.save(partner);
                
                // Professional Step: Inform the user via email
                emailService.sendPartnerRejectionEmail(partner.getEmail(), partner.getCompanyName());
                
                return ResponseEntity.ok("PARTNER_REJECTED");
            })
            .orElse(ResponseEntity.notFound().build());
}
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
    String email = credentials.get("email");
    String password = credentials.get("password");

    // Replace with actual database search and password encryption check
    return partnerRepository.findByEmail(email)
        .map(partner -> {
            if (partner.getPassword().equals(password)) {
                return ResponseEntity.ok(partner); // Returns all data including status
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Password");
        })
        .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Partner Not Found"));
}
@Autowired
private WatchlistRepository watchlistRepository;

@Autowired
private StudentRepository studentRepository; // Ensure you have this

@GetMapping("/watchlist")
public ResponseEntity<List<Student>> getWatchlist(@RequestParam String email) {
    // 1. Find all student IDs saved by this partner
    List<Watchlist> watchlistEntries = watchlistRepository.findByPartnerEmail(email);
    
    // 2. Convert IDs into full Student objects for the UI
    List<Long> studentIds = watchlistEntries.stream()
                                            .map(Watchlist::getStudentId)
                                            .toList();
                                            
    return ResponseEntity.ok(studentRepository.findAllById(studentIds));
}

@PostMapping("/watchlist/add")
public ResponseEntity<String> addToWatchlist(@RequestBody Watchlist entry) {
    if (watchlistRepository.existsByPartnerEmailAndStudentId(entry.getPartnerEmail(), entry.getStudentId())) {
        return ResponseEntity.badRequest().body("NODE_ALREADY_TRACKED");
    }
    watchlistRepository.save(entry);
    return ResponseEntity.ok("ADDED_TO_WATCHLIST");
}
// Add to your Controller
@DeleteMapping("/partners/{id}")
public ResponseEntity<?> removePartner(@PathVariable Long id) {
    return partnerRepository.findById(id).map(partner -> {
        partnerRepository.delete(partner);
        return ResponseEntity.ok("Partner node terminated successfully.");
    }).orElse(ResponseEntity.status(404).body("Partner node not found."));
}
}