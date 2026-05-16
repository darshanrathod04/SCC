package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    // Required for the Login Logic
    Optional<Partner> findByEmail(String email);
    
    // Required for the Admin Dashboard
    List<Partner> findByStatus(String status);
}