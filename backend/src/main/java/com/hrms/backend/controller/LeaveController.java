package com.hrms.backend.controller;

import com.hrms.backend.dto.LeaveRequestDto;
import com.hrms.backend.dto.LeaveResponseDto;
import com.hrms.backend.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public LeaveResponseDto applyLeave(@Valid @RequestBody LeaveRequestDto request) {
        return leaveService.applyLeave(request);
    }

    @GetMapping
    public List<LeaveResponseDto> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @GetMapping("/{id}")
    public LeaveResponseDto getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id);
    }

    @PutMapping("/{id}")
    public LeaveResponseDto updateLeave(@PathVariable Long id,
                                        @Valid @RequestBody LeaveRequestDto request) {
        return leaveService.updateLeave(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteLeave(@PathVariable Long id) {

        leaveService.deleteLeave(id);

        return "Leave Request Deleted Successfully";
    }

    @PutMapping("/approve/{id}")
    public LeaveResponseDto approveLeave(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    @PutMapping("/reject/{id}")
    public LeaveResponseDto rejectLeave(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }

    @GetMapping("/employee/{employeeId}")
    public List<LeaveResponseDto> getLeavesByEmployee(@PathVariable Long employeeId) {
        return leaveService.getLeavesByEmployee(employeeId);
    }
}