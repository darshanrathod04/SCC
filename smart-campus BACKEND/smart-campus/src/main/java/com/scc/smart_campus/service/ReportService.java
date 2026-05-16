package com.scc.smart_campus.service;

import com.scc.smart_campus.model.ActivityLog;
import com.scc.smart_campus.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ActivityLogRepository activityRepo;

    public byte[] generateHiringReportCSV() {
        // 1. Fetch only Hiring Leads
        List<ActivityLog> leads = activityRepo.findAll().stream()
                .filter(log -> "LEAD_GEN".equals(log.getType()))
                .collect(Collectors.toList());

        // 2. Build CSV Content using standard Java
        StringBuilder csv = new StringBuilder();
        
        // Header Row
        csv.append("Partner Email,Action Description,Date,Timestamp\n");

        // Data Rows
        for (ActivityLog log : leads) {
            csv.append(log.getUserName()).append(",")
               .append("\"").append(log.getDescription()).append("\",") // Quotes handle commas in text
               .append(log.getTimestamp().toLocalDate()).append(",")
               .append(log.getTimestamp()).append("\n");
        }

        return csv.toString().getBytes();
    }
}