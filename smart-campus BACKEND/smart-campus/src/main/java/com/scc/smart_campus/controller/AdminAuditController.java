package com.scc.smart_campus.controller;


import com.scc.smart_campus.model.ActivityLog;
import com.scc.smart_campus.model.Partner;
import com.scc.smart_campus.model.SkillAudit;
import com.scc.smart_campus.repository.ActivityLogRepository;
import com.scc.smart_campus.repository.PartnerRepository;
import com.scc.smart_campus.service.StudentService;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/admin")

public class AdminAuditController {
    
    @Autowired
    private ActivityLogRepository activityRepo;

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private com.scc.smart_campus.service.ReportService reportService;

    // Fetch all pending skill nodes for the Founder
    @GetMapping("/audit-stream")
    public List<SkillAudit> getPendingAudits() {
        return studentService.getAllPendingAudits();
    }

    // Executive Approval Protocol
    @PostMapping("/approve-task/{auditId}")
    public MessageResponse approveTask(@PathVariable Long auditId) {
        studentService.approveAndIssueCertificate(auditId);
        return new MessageResponse("Task Approved: Certificate Issued via Mainframe");
    }
    @GetMapping("/activity")
public List<ActivityLog> getSystemPulse() {
    return activityRepo.findAllByOrderByTimestampDesc();
}
@GetMapping("/download-report")
public ResponseEntity<byte[]> downloadReport() {
    byte[] csvData = reportService.generateHiringReportCSV();
    
    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=SCC_Hiring_Report.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csvData);
}
@GetMapping("/velocity-data")
public ResponseEntity<Map<String, Long>> getMarketVelocity() {
    LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
    
    // Fetch leads from the last 7 days and group by Date
    Map<String, Long> velocityData = activityRepo.findAll().stream()
        .filter(log -> "LEAD_GEN".equals(log.getType()) && log.getTimestamp().isAfter(sevenDaysAgo))
        .collect(Collectors.groupingBy(
            log -> log.getTimestamp().toLocalDate().toString(),
            TreeMap::new, // Keeps dates in order
            Collectors.counting()
        ));

    return ResponseEntity.ok(velocityData);
}
@Autowired
private PartnerRepository partnerRepo; // Ensure repository is autowired

// Fetch all partners for the Registry List
@GetMapping("/partners/all")
public List<Partner> getAllPartners() {
    return partnerRepo.findAll(); // Sabhi partners (Verified + Pending) fetch honge
}

// Termination Protocol: Delete fake partner
@DeleteMapping("/partners/{id}")
public ResponseEntity<?> terminatePartner(@PathVariable Long id) {
    partnerRepo.deleteById(id);
    return ResponseEntity.ok(new MessageResponse("Partner node purged from mainframe."));
}
}