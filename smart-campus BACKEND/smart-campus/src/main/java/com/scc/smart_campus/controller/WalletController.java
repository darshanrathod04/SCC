
package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.repository.StudentRepository;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final StudentRepository studentRepository;

    public WalletController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping("/{studentId}/deduct")
    @Transactional
    public ResponseEntity<String> useWallet(@PathVariable Long studentId, @RequestParam Double amount) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Node Identity Not Found"));

        if (student.getBalance() < amount) {
            return ResponseEntity.status(400).body("INSUFFICIENT CREDITS");
        }

        student.setBalance(student.getBalance() - amount);
        studentRepository.save(student);
        return ResponseEntity.ok("TRANSACTION AUTHORIZED. NEW BALANCE: " + student.getBalance());
    }
    
    @GetMapping("/{studentId}/sync")
public ResponseEntity<Student> syncWallet(@PathVariable Long studentId) {
    return ResponseEntity.ok(studentRepository.findById(studentId)
        .orElseThrow(() -> new RuntimeException("Node Not Found")));
}
@PostMapping("/{id}/add-xp")
public ResponseEntity<Student> addExperience(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
    try {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Node Not Found"));
        
        Integer xpToAdd = payload.get("xp");
        
        // Update the Talent Score in the Database
        student.setExperiencePoints(student.getExperiencePoints() + xpToAdd);
        studentRepository.save(student);
        
        return ResponseEntity.ok(student);
    } catch (Exception e) {
        return ResponseEntity.status(500).build();
    }
}
    
}