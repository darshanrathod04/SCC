package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.Internship;
import com.scc.smart_campus.service.InternshipService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/internships")
// This tells the browser to allow both the standard cards AND the audit list
public class InternshipController {
    private final InternshipService internshipService;

    // Industry Standard: Constructor Injection
    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    /**
     * Retrieves all listings for the Market.
     * Maps to: fetchMarketListings() in internship.js
     */
    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    /**
     * Publishes a new internship.
     * Maps to: initializeBroadcastSystem() in internship.js
     */
    @PostMapping
    public ResponseEntity<Internship> createInternship(@RequestBody Internship internship) {
        // Logging for the NetBeans terminal
        System.out.println("SCC LOG: Publishing Internship for: " + internship.getTitle()); 
        
        Internship saved = internshipService.saveInternship(internship);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Internship>> searchBySkills(@RequestParam String techStack) {
        return ResponseEntity.ok(internshipService.findMatchesBySkills(techStack));
    }
    
    /**
     * STUDENT APPLICATION PROTOCOL
     * Connects the "Acquire Position" button in internship.js to the database.
     * Maps to: fetch(`${INTERNSHIP_API}/${internshipId}/apply/${user.id}`)
     */
    @PostMapping("/{id}/apply/{studentId}")
    public ResponseEntity<?> applyForInternship(@PathVariable Long id, @PathVariable Long studentId) {
        try {
            // This calls the Many-to-Many logic in your Service
            boolean success = internshipService.applyStudentToInternship(id, studentId);
            
            if (success) {
                return ResponseEntity.ok("Protocol Success: Application Registered.");
            } else {
                return ResponseEntity.badRequest().body("Identity Conflict: Already applied for this position.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body("Mainframe Error: Resource Not Found.");
        }
    }
    
    /**
     * AUDIT APPLICANTS ENDPOINT
     * Fetches the list of students for a specific internship.
     * Maps to: fetch(`${INTERNSHIP_API}/${internshipId}/students`) in internship.js
     */
    @GetMapping("/{id}/students")
    public ResponseEntity<List<com.scc.smart_campus.model.Student>> getInternshipApplicants(@PathVariable Long id) {
        System.out.println("SCC LOG: Auditing Applicants for Internship ID: " + id);
        
        // This calls the method we added to your InternshipService
        List<com.scc.smart_campus.model.Student> applicants = internshipService.getApplicants(id);
        
        return ResponseEntity.ok(applicants);
    }
    
}