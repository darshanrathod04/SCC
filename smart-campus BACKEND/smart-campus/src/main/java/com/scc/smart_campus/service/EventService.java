package com.scc.smart_campus.service;

import java.util.List;
import com.scc.smart_campus.model.Event;
import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.repository.EventRepository;
import com.scc.smart_campus.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EventService {

    // Using final and Constructor Injection (Professional Best Practice)
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;

    public EventService(EventRepository eventRepository, StudentRepository studentRepository) {
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public boolean registerStudent(Long eventId, Long studentId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Protocol Error: Event ID not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Protocol Error: Student ID not found."));

        if (!event.getRegisteredStudents().contains(student)) {
            // 1. Add to Conclave Registry
            event.getRegisteredStudents().add(student);
            
            // 2. Award Experience Points (XP)
            // Manual logic to bypass Lombok issues
            Integer currentXP = student.getExperiencePoints();
            if (currentXP == null) currentXP = 0;
            student.setExperiencePoints(currentXP + 100);
            
            // 3. Persist Changes (Atomic Operation)
            studentRepository.save(student);
            eventRepository.save(event);
            return true;
        }
        return false;
    }

    @Transactional
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }
    
    /**
 * SCC AUDIT PROTOCOL: Fetches all students registered for a specific conclave.
 * This satisfies the 'fetch(`${EVENT_API}/${eventId}/students`)' call in event.js.
 */
@Transactional(readOnly = true)
public List<Student> getApplicants(Long eventId) {
    // 1. Locate the Conclave Node
    Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Protocol Error: Event ID " + eventId + " not found."));
    
    // 2. Access the Registered Students collection
    List<Student> students = event.getRegisteredStudents();
    
    // 3. FORCE INITIALIZATION: Accessing size ensures Hibernate loads the list 
    // before the transaction closes, preventing a 'null' or 'LazyInit' error.
    students.size(); 
    
    return students;
}
    
}