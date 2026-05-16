package com.scc.smart_campus.service;

import com.scc.smart_campus.controller.BioUpdateRequest;
import com.scc.smart_campus.controller.SkillRequest;
import com.scc.smart_campus.model.SkillAudit;
import com.scc.smart_campus.model.Student;
import java.util.List;
import java.util.Optional;

public interface StudentService {
    void updateStudentBio(Long userId, BioUpdateRequest bioData);
    void submitToAudit(Long userId, SkillRequest skillRequest);
    List<Student> getAll();
    Student save(Student student);
    List<Student> getTopStudentsByXP();
    List<SkillAudit> getAllPendingAudits();
    void approveAndIssueCertificate(Long auditId);
    
    // This is the clean, correct declaration for your controller
    Optional<Student> findById(Long id);
    
    void addExperiencePoints(Long userId, int points, String taskName);
}
