package com.scc.smart_campus.service;


import com.scc.smart_campus.controller.BioUpdateRequest;
import com.scc.smart_campus.controller.SkillRequest;
import com.scc.smart_campus.model.ActivityLog;
import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.model.SkillAudit;
import com.scc.smart_campus.repository.ActivityLogRepository;
import com.scc.smart_campus.repository.StudentRepository;
import com.scc.smart_campus.repository.SkillAuditRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional; // CRITICAL: Added for findById
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired // FIX: You were missing this injection
    private ActivityLogRepository activityLogRepository;
    
    @Autowired
private ActivityLogRepository activityRepo;

    @Autowired
    private SkillAuditRepository skillAuditRepository;

    // 1. FIXED: Implemented findById to satisfy the interface contract
    @Override
    public Optional<Student> findById(Long id) {
        // Returns Optional to allow the Controller to use .map()
        return studentRepository.findById(id);
    }

    @Override
    public void updateStudentBio(Long userId, BioUpdateRequest bioData) {
        Student student = studentRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Student Node Not Found"));
        student.setEmail(bioData.getEmail());
        student.setEducation(bioData.getEducation());
        student.setBio(bioData.getBio());
        studentRepository.save(student);
    }

    @Override
    public void submitToAudit(Long userId, SkillRequest skillRequest) {
        SkillAudit audit = new SkillAudit();
        audit.setUserId(userId);
        audit.setSkillName(skillRequest.getSkillName());
        audit.setSkillLevel(skillRequest.getSkillLevel());
        audit.setStatus("PENDING");
        skillAuditRepository.save(audit);
    }

    @Override
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    @Override
    public Student save(Student student) {
        return studentRepository.save(student);
    }

    // 2. FIXED: Corrected sorting to use getExperiencePoints()
    @Override
    public List<Student> getTopStudentsByXP() {
        return studentRepository.findAll()
                .stream()
                .sorted((s1, s2) -> Integer.compare(s2.getExperiencePoints(), s1.getExperiencePoints()))
                .limit(5)
                .collect(Collectors.toList());
    }

    @Override
    public List<SkillAudit> getAllPendingAudits() {
        return skillAuditRepository.findByStatus("PENDING");
    }

    @Override
    public void approveAndIssueCertificate(Long auditId) {
        SkillAudit audit = skillAuditRepository.findById(auditId)
            .orElseThrow(() -> new RuntimeException("Audit Node Not Found"));
        audit.setStatus("VERIFIED");
        skillAuditRepository.save(audit);
    }
@Override
public void addExperiencePoints(Long userId, int points, String taskName) {
    // 1. Aaj ki date nikaalna (Daily reset ke liye)
    LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

    // 2. ActivityLog mein check karna: Kya Sahil ne yeh task aaj kiya hai?
   boolean alreadyDone = activityLogRepository.existsByUserIdAndDescriptionAndTimestampAfter(
            userId, "COMPLETED_TASK: " + taskName, startOfToday
        );

    if (alreadyDone) {
        throw new RuntimeException("Task already completed for this cycle.");
    }

    // Update XP safely
    Student student = studentRepository.findById(userId).orElseThrow();
    int currentXP = (student.getExperiencePoints() != null) ? student.getExperiencePoints() : 0;
    student.setExperiencePoints(currentXP + points);
    studentRepository.save(student);

    // Log with Name for ReportService (Line 30 fix)
    ActivityLog log = new ActivityLog();
    log.setUserId(userId);
    log.setUserName(student.getFullName()); // Sets Sahil Chavhan
    log.setDescription("COMPLETED_TASK: " + taskName);
    log.setType("XP_GAIN");
    log.setTimestamp(LocalDateTime.now());
    activityRepo.save(log);
}
}