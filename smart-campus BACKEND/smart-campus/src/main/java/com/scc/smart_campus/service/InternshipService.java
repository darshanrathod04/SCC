package com.scc.smart_campus.service;

import com.scc.smart_campus.model.Internship;
import com.scc.smart_campus.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * SCC PROTOCOL: INTERNSHIP SERVICE
 * Orchestrates recruitment logic and tech-stack matching for the campus hub.
 */
@Service
public class InternshipService {
    
    

    private final InternshipRepository internshipRepository;

    // PROFESSIONAL FIX: Manual Constructor Injection instead of Lombok
    @Autowired
    public InternshipService(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }

    /**
     * Authorizes and persists a new internship listing.
     */
    @Transactional
    public Internship saveInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    /**
     * Retrieves all active market listings.
     */
    @Transactional(readOnly = true)
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

/**
     * SCC ADVANCED FEATURE: TECH STACK MATCHING
     * Optimized to handle empty student profiles without crashing.
     */
    @Transactional(readOnly = true)
    public List<Internship> findMatchesBySkills(String studentTechStack) {
        // PRO FIX: If the student hasn't entered skills yet, show all listings
        if (studentTechStack == null || studentTechStack.trim().isEmpty()) {
            return internshipRepository.findAll();
        }
        
        String searchStack = studentTechStack.toLowerCase().trim();
        
        return internshipRepository.findAll().stream()
                .filter(i -> i.getSkills() != null && 
                             i.getSkills().toLowerCase().contains(searchStack))
                .collect(Collectors.toList());
    }
    /**
     * Retrieves a single internship by ID for the detailed view modal.
     */
    @Transactional(readOnly = true)
    public Internship getInternshipById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Protocol Error: Opportunity ID not found."));
    }
    
   /**
     * SCC APPLICATION PROTOCOL - FIXED VERSION
     * Updated to match names in InternshipRepository.java
     */
    @Transactional
    public boolean applyStudentToInternship(Long internshipId, Long studentId) {
        // 1. Check if the student is already registered (Uses repository name)
        int count = internshipRepository.checkIfAlreadyApplied(internshipId, studentId); // FIXED line 79
        
        if (count == 0) {
            // 2. Directly insert the link into the join table (Uses repository name)
            internshipRepository.registerStudentDirectly(internshipId, studentId); // FIXED line 83
            return true; // Success
        }
        
        return false; // Already applied
    }
    
    /**
     * SCC AUDIT ENGINE: Retrieves student list for a specific internship.
     * This connects the Controller to the Repository.
     */
    @Transactional(readOnly = true)
    public List<com.scc.smart_campus.model.Student> getApplicants(Long internshipId) {
        // Calls the new query you are adding to the repository
        return internshipRepository.findStudentsByInternshipId(internshipId);
    }
} // This is the final brace of the class
    
