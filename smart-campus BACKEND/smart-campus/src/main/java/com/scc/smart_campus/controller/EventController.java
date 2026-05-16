package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.Event;
import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.repository.EventRepository;
import com.scc.smart_campus.service.EventService;
import jakarta.validation.Valid;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;
    
    private final EventService eventService;

    // Expert Tip: Use Constructor Injection for better testability
    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
@PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        // Log to NetBeans console to see if the request arrives
        System.out.println("SCC LOG: Deploying Event - " + event.getTitle());
        return ResponseEntity.ok(eventService.saveEvent(event));
    }

   // This MUST match the JavaScript call: /api/events/{id}/students
    @GetMapping("/{eventId}/students")
    public ResponseEntity<List<Student>> getRegisteredStudents(@PathVariable Long eventId) {
        System.out.println("SCC LOG: Fetching Audit Registry for Event ID: " + eventId);
        
        // Use the eager-loading method to avoid the "null" issue
        List<Student> students = eventService.getApplicants(eventId);
        
        if (students == null) {
            return ResponseEntity.ok(new ArrayList<>()); // Return empty list instead of null
        }
        
        return ResponseEntity.ok(students);
    }
    @PostMapping("/{eventId}/register/{studentId}")
    public ResponseEntity<?> registerStudentToEvent(@PathVariable Long eventId, @PathVariable Long studentId) {
        try {
            boolean success = eventService.registerStudent(eventId, studentId);
            if (success) {
                return ResponseEntity.ok("Protocol Success: Identity registered and XP awarded.");
            }
            return ResponseEntity.badRequest().body("Identity Conflict: Already registered for this conclave.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Resource Not Found: Check Event or Student IDs.");
        }
    }
}