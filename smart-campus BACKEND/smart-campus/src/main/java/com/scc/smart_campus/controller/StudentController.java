package com.scc.smart_campus.controller;

import com.scc.smart_campus.model.*;
import com.scc.smart_campus.model.MessageResponse;
import com.scc.smart_campus.repository.*;
import com.scc.smart_campus.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.scc.smart_campus.service.EmailNotificationService;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityLogRepository activityRepo;

    @Autowired
    private JobApplicationRepository applicationRepo;

    @Autowired
    private EmailNotificationService emailService;
    



    @Autowired
    private StudentService studentService;

    // Standard constructor for dependency safety
//    public StudentController(StudentService studentService) {
//        this.studentService = studentService;
//    }

    // ==========================================
    // 1. DIRECTORY & IDENTITY PROTOCOLS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAll());
    }

//    @PostMapping
//    public ResponseEntity<Student> registerStudent(@Valid @RequestBody Student student) {
//        if (student.getExperiencePoints() == null) {
//            student.setExperiencePoints(0);
//        }
//        System.out.println("PROTOCOL: Initializing new identity for: " + student.getFullName());
//        Student savedStudent = studentService.save(student);
//        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
//    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Student>> getTopContributors() {
        return ResponseEntity.ok(studentService.getTopStudentsByXP());
    }

  @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.findById(id)
                .map(student -> {
                    if (student.getSkills() == null) student.setSkills("Verified System Node");
                    return ResponseEntity.ok(student);
                })
                .orElse(ResponseEntity.notFound().build());
    }

  @GetMapping("/{id}/sync")
    public ResponseEntity<Student> syncStudent(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================
    // 2. BIO, SKILLS & AUDIT STREAM (Merged Logic)
    // ==========================================

  @PostMapping("/{id}/sync-bio")
    public ResponseEntity<?> updateBio(@PathVariable Long id, @RequestBody BioUpdateRequest bioData) {
        studentService.updateStudentBio(id, bioData);
        return ResponseEntity.ok(new MessageResponse("Bio Node Synchronized Successfully"));
    }

    @PostMapping("/{userId}/commit-skill")
    public ResponseEntity<?> addSkill(@PathVariable Long userId, @RequestBody SkillRequest skillRequest) {
        studentService.submitToAudit(userId, skillRequest);
        return ResponseEntity.ok(new MessageResponse("Skill Node Committed to Audit Stream"));
    }

    // ==========================================
    // 3. MEDIA & PROFILE IDENTITY
    // ==========================================

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String fileName = "profile_" + id + ".png";
            Path path = Paths.get("src/main/resources/static/images/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            Student student = studentRepository.findById(id).orElseThrow();
            student.setProfileImage(fileName);
            studentRepository.save(student);

            return ResponseEntity.ok(fileName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error");
        }
    }

    // ==========================================
    // 4. RESUME & PLACEMENT INFRASTRUCTURE
    // ==========================================

    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> getResume(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Node " + id + " not found"));

        String fileName = student.getResumeFileName();
        if (fileName == null || fileName.isEmpty()) return ResponseEntity.notFound().build();

        Path path = Paths.get("uploads/resumes/").resolve(fileName);
        File file = path.toFile();
        if (!file.exists()) return ResponseEntity.notFound().build();

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file,
                                             @RequestParam("email") String email) {
        try {
            String uploadDir = "uploads/resumes/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Student student = studentRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            student.setResumeFileName(fileName);
            studentRepository.save(student);

            return ResponseEntity.ok("FILE_UPLOADED_SUCCESSFULLY");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("UPLOAD_ERROR");
        }
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyToPartner(@RequestBody Map<String, String> data) {
        String studentEmail = data.get("studentEmail");
        String partnerEmail = data.get("partnerEmail");

        Student student = studentRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student record not found for: " + studentEmail));

        if (student.getResumeFileName() == null || student.getResumeFileName().isEmpty()) {
            return ResponseEntity.badRequest().body("RESUME_MISSING");
        }

        try {
            JobApplication app = new JobApplication();
            app.setStudentEmail(studentEmail);
            app.setPartnerEmail(partnerEmail);
            app.setStatus("SENT");
            applicationRepo.save(app);

            emailService.sendJobApplication(
                partnerEmail,
                student.getFullName(),
                (student.getExperiencePoints() != null ? student.getExperiencePoints() : 0),
                "uploads/resumes/" + student.getResumeFileName()
            );

            return ResponseEntity.ok("APPLICATION_SUCCESSFUL");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("MAINFRAME_ERROR: " + e.getMessage());
        }
    }

    // ==========================================
    // 5. CONCLAVE & APPLICATION MONITORING
    // ==========================================

    @GetMapping("/conclave-list")
    public ResponseEntity<List<Map<String, Object>>> getConclaveList(@RequestParam String partnerEmail) {
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> enrichedStudents = students.stream().map(student -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", student.getId());
            map.put("fullName", student.getFullName());
            map.put("xp", student.getExperiencePoints() != null ? student.getExperiencePoints() : 0);
            boolean applied = applicationRepo.existsByStudentEmailAndPartnerEmail(student.getEmail(), partnerEmail);
            map.put("hasApplied", applied);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(enrichedStudents);
    }

    @GetMapping("/{id}/check-app")
    public ResponseEntity<Map<String, Object>> checkApplicationStatus(@PathVariable Long id, @RequestParam String partnerEmail) {
        Student student = studentRepository.findById(id).orElseThrow();
        boolean exists = applicationRepo.existsByStudentEmailAndPartnerEmail(student.getEmail(), partnerEmail);
        Map<String, Object> response = new HashMap<>();
        response.put("hasApplied", exists);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // 6. ADMINISTRATIVE COMMAND (XP & Analytics)
    // ==========================================

    @GetMapping("/admin/students-summary")
    public List<Map<String, Object>> getAdminStudentList() {
        List<Student> students = studentRepository.findAll();
        List<String> hotSkills = activityRepo.findAll().stream()
                .filter(log -> "SEARCH_INTENT".equals(log.getType()))
                .map(log -> log.getDescription().replace("Searched for talent node: ", "").toLowerCase().trim())
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()))
                .entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5).map(Map.Entry::getKey).collect(Collectors.toList());

        return students.stream().map(student -> {
            Map<String, Object> map = new HashMap<>();
            boolean isHot = hotSkills.stream().anyMatch(skill ->
                    student.getSkills() != null && student.getSkills().toLowerCase().contains(skill));
            String status = (student.getLastLogin() != null) ? student.getLastLogin().toLocalDate().toString() : "Never";
            map.put("fullName", student.getFullName());
            map.put("xp", student.getExperiencePoints() != null ? student.getExperiencePoints() : 0);
            map.put("isHotMatch", isHot);
            map.put("lastActive", status);
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/admin/total-xp")
    public ResponseEntity<Map<String, Object>> getTotalXP() {
        List<Student> students = studentRepository.findAll();
        int totalXp = students.stream()
                .mapToInt(s -> (s.getExperiencePoints() != null) ? s.getExperiencePoints() : 0)
                .sum();
        Map<String, Object> response = new HashMap<>();
        response.put("totalXp", totalXp);
        response.put("studentCount", students.size());
        return ResponseEntity.ok(response);
    }
    // ==========================================
    // 2. XP SYSTEM (Fixes 500)
    // ==========================================

  @PostMapping("/{id}/add-xp")
public ResponseEntity<?> addExperience(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
    try {
        // Safe parsing: String ko Integer mein badalna
        int points = Integer.parseInt(payload.get("xp").toString());
        String taskName = payload.get("task").toString();

        studentService.addExperiencePoints(id, points, taskName);
        
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "XP Synchronized"));
    } catch (RuntimeException e) {
        // Agar task pehle se complete hai, toh 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
        // Kisi aur technical error ke liye 500
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}


@PostMapping("/request-otp")
public ResponseEntity<?> requestStudentOTP(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    
    // Generate 6-digit OTP
    String otp = String.valueOf((int)((Math.random() * 900000) + 100000));
    
    // SCC Security Protocol: Email dispatch
    try {
        emailService.sendOTP(email, otp); 
        return ResponseEntity.ok(Map.of("message", "Verification code transmitted to " + email));
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Email Service Offline: " + e.getMessage());
    }
}


@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String otp = request.get("otp");
    
    // Aapki service mein pehle se 'verifyOTP' method hai
    boolean isValid = emailService.verifyOTP(email, otp);
    
    if (isValid) {
        return ResponseEntity.ok("Verified");
    } else {
        return ResponseEntity.status(401).body("Invalid OTP");
    }
}

// ==========================================
// 1. DIRECTORY & IDENTITY PROTOCOLS
// ==========================================


@PostMapping("/register")
public ResponseEntity<?> registerStudent(@Valid @RequestBody Student student) {
    // 1. Initial XP Logic
    if (student.getExperiencePoints() == null) {
        student.setExperiencePoints(0);
    }

    System.out.println("PROTOCOL: Initializing Identity for: " + student.getFullName());

    // 2. Database Save
    Student savedStudent = studentService.save(student);
    System.out.println("PROTOCOL: Identity Saved with ID: " + savedStudent.getId());

    // 3. Welcome Email Trigger (Mandatory)
    try {
        System.out.println("PROTOCOL: Attempting Welcome Email dispatch to: " + savedStudent.getEmail());
        emailService.sendWelcomeEmail(savedStudent.getEmail(), savedStudent.getFullName());
        System.out.println("PROTOCOL: Welcome Email DISPATCHED.");
    } catch (Exception e) {
        System.err.println("CRITICAL: Welcome Email Failed: " + e.getMessage());
    }

    return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
}

// 1. Notification Endpoint (Jo frontend bar-baar dhoond raha hai)
@GetMapping("/notifications")
public ResponseEntity<List<Map<String, String>>> getNotifications() {
    List<Map<String, String>> announcements = new ArrayList<>();
    
    // Default system message agar DB khali hai
    Map<String, String> note = new HashMap<>();
    note.put("subject", "System Update");
    note.put("message", "Mainframe is now synchronized with Port 5505.");
    announcements.add(note);
    
    return ResponseEntity.ok(announcements);
}

}