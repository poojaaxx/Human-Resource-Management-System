package com.hrms.backend.repository;

import com.hrms.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeId(Long employeeId);

    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    void deleteByEmployeeIdAndDate(Long employeeId, LocalDate date);
}
