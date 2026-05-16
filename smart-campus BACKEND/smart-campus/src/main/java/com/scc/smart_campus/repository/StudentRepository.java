package com.scc.smart_campus.repository;

import com.scc.smart_campus.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * AUTH NODE: Used by AuthController to verify identity
     */
    Optional<Student> findByEmail(String email);

    /**
     * LEADERBOARD NODE: Fetches all students ranked by XP for the #Rankings section.
     * This is the preferred method for StudentServiceImpl.getTopStudentsByXP()
     */
    List<Student> findAllByOrderByExperiencePointsDesc();

    /**
     * TALENT DISCOVERY NODE: Manual query for custom sorting logic
     */
    @Query("SELECT s FROM Student s ORDER BY s.experiencePoints DESC")
    List<Student> findTopPerformers();

    /**
     * SKILL NODE: Finds students who have achieved specific verified technical prowess
     */
    @Query("SELECT s FROM Student s JOIN SkillAudit sa ON s.id = sa.userId WHERE sa.skillName = ?1 AND sa.status = 'VERIFIED'")
    List<Student> findByVerifiedSkill(String skillName);
    
    @Query("SELECT s FROM Student s WHERE s.role = 'STUDENT' ORDER BY s.experiencePoints DESC")
List<Student> findTopStudentsOnly();
    
}