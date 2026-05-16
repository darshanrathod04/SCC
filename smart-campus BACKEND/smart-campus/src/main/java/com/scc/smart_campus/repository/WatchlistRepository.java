package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByPartnerEmail(String partnerEmail);
    boolean existsByPartnerEmailAndStudentId(String email, Long studentId);
}