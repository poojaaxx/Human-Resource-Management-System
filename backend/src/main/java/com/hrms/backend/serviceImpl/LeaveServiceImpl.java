package com.hrms.backend.serviceImpl;

import com.hrms.backend.dto.LeaveRequestDto;
import com.hrms.backend.dto.LeaveResponseDto;
import com.hrms.backend.entity.LeaveRequest;
import com.hrms.backend.enums.LeaveStatus;
import com.hrms.backend.repository.LeaveRequestRepository;
import com.hrms.backend.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRepository;

    private LeaveResponseDto map(LeaveRequest leave) {
        return LeaveResponseDto.builder()
                .id(leave.getId())
                .employeeId(leave.getEmployeeId())
                .employeeName(leave.getEmployeeName())
                .leaveType(leave.getLeaveType())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .build();
    }

    @Override
    public LeaveResponseDto applyLeave(LeaveRequestDto request) {

        LeaveRequest leave = LeaveRequest.builder()
                .employeeId(request.getEmployeeId())
                .employeeName(request.getEmployeeName())
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        leaveRepository.save(leave);

        return map(leave);
    }

    @Override
    public List<LeaveResponseDto> getAllLeaves() {
        return leaveRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public LeaveResponseDto getLeaveById(Long id) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Request Not Found"));

        return map(leave);
    }

    @Override
    public LeaveResponseDto updateLeave(Long id, LeaveRequestDto request) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Request Not Found"));

        leave.setEmployeeId(request.getEmployeeId());
        leave.setEmployeeName(request.getEmployeeName());
        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());

        leaveRepository.save(leave);

        return map(leave);
    }

    @Override
    public void deleteLeave(Long id) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Request Not Found"));

        leaveRepository.delete(leave);
    }

    @Override
    public LeaveResponseDto approveLeave(Long id) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Request Not Found"));

        leave.setStatus(LeaveStatus.APPROVED);

        leaveRepository.save(leave);

        return map(leave);
    }

    @Override
    public LeaveResponseDto rejectLeave(Long id) {

        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Request Not Found"));

        leave.setStatus(LeaveStatus.REJECTED);

        leaveRepository.save(leave);

        return map(leave);
    }

    @Override
    public List<LeaveResponseDto> getLeavesByEmployee(Long employeeId) {

        return leaveRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::map)
                .toList();
    }
}