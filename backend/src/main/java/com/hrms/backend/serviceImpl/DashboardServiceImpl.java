package com.hrms.backend.serviceImpl;

import com.hrms.backend.dto.DashboardResponse;
import com.hrms.backend.enums.LeaveStatus;
import com.hrms.backend.enums.Role;
import com.hrms.backend.repository.EmployeeRepository;
import com.hrms.backend.repository.LeaveRequestRepository;
import com.hrms.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRepository;

    @Override
    public DashboardResponse getDashboard() {

        return DashboardResponse.builder()
                .totalEmployees(employeeRepository.countByRole(Role.EMPLOYEE))
                .totalHrStaff(employeeRepository.countByRole(Role.HR))
                .totalLeaves(leaveRepository.count())
                .pendingLeaves(leaveRepository.countByStatus(LeaveStatus.PENDING))
                .approvedLeaves(leaveRepository.countByStatus(LeaveStatus.APPROVED))
                .rejectedLeaves(leaveRepository.countByStatus(LeaveStatus.REJECTED))
                .build();
    }
}