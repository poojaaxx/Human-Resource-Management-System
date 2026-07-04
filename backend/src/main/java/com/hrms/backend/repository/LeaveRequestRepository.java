package com.hrms.backend.repository;

import com.hrms.backend.entity.LeaveRequest;
import com.hrms.backend.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeId(Long employeeId);

    long countByStatus(LeaveStatus status);

}