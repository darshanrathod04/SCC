package com.scc.smart_campus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.scc.smart_campus.model.Internship;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.scc.smart_campus.model.Student;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO internship_registrations (internship_id, student_id) VALUES (:internshipId, :studentId)", nativeQuery = true)
    void registerStudentDirectly(@Param("internshipId") Long internshipId, @Param("studentId") Long studentId);

    @Query(value = "SELECT COUNT(*) FROM internship_registrations WHERE internship_id = :internshipId AND student_id = :studentId", nativeQuery = true)
    int checkIfAlreadyApplied(@Param("internshipId") Long internshipId, @Param("studentId") Long studentId);

@Query(value = "SELECT s.* FROM students s " +
                   "JOIN internship_registrations ir ON s.id = ir.student_id " +
                   "WHERE ir.internship_id = :internshipId", nativeQuery = true)
    List<com.scc.smart_campus.model.Student> findStudentsByInternshipId(@Param("internshipId") Long internshipId);
}
