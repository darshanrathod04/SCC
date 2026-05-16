package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // No extra code needed for basic saving
}