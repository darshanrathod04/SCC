package com.scc.smart_campus.service;

import com.scc.smart_campus.model.Student;
import com.scc.smart_campus.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatcherService {

    @Autowired
    private ActivityLogRepository activityRepo;

    @Autowired
    private EmailNotificationService emailService;

    public void processAutoMatch(Student student) {
        // 1. Identify the 'Market Heat' (Top searched skills)
        List<String> hotSkills = activityRepo.findAll().stream()
            .filter(log -> "SEARCH_INTENT".equals(log.getType()))
            .map(log -> log.getDescription().replace("Searched for talent node: ", "").toLowerCase().trim())
            .collect(Collectors.groupingBy(s -> s, Collectors.counting()))
            .entrySet().stream()
            .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
            .limit(5)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // 2. Scan student skills for a match
        for (String skill : hotSkills) {
            if (student.getSkills() != null && student.getSkills().toLowerCase().contains(skill)) {
                // 3. Trigger the email from the other service
                emailService.sendAutoMatchAlert(student.getFullName(), skill, student.getXp());
                break; 
            }
        }
    }
}