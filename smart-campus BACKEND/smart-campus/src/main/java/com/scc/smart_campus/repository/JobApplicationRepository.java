package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByStudentEmailAndPartnerEmail(String studentEmail, String partnerEmail);
    List<JobApplication> findByStudentEmail(String studentEmail);
}