package com.hrms.backend.service;

import com.hrms.backend.dto.LeaveRequestDto;
import com.hrms.backend.dto.LeaveResponseDto;

import java.util.List;

public interface LeaveService {

    LeaveResponseDto applyLeave(LeaveRequestDto request);

    List<LeaveResponseDto> getAllLeaves();

    LeaveResponseDto getLeaveById(Long id);

    LeaveResponseDto updateLeave(Long id, LeaveRequestDto request);

    void deleteLeave(Long id);

    LeaveResponseDto approveLeave(Long id);

    LeaveResponseDto rejectLeave(Long id);

    List<LeaveResponseDto> getLeavesByEmployee(Long employeeId);

}