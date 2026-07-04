package com.hrms.backend.controller;

import com.hrms.backend.dto.AttendanceDayRequest;
import com.hrms.backend.dto.AttendanceResponse;
import com.hrms.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/me")
    public List<AttendanceResponse> getMyAttendance(Authentication authentication) {
        return attendanceService.getMyAttendance(authentication.getName());
    }

    @PostMapping("/checkin")
    public AttendanceResponse checkIn(Authentication authentication) {
        return attendanceService.checkIn(authentication.getName());
    }

    @PostMapping("/checkout")
    public AttendanceResponse checkOut(Authentication authentication) {
        return attendanceService.checkOut(authentication.getName());
    }

    @PutMapping("/day")
    public AttendanceResponse setDayStatus(@RequestBody AttendanceDayRequest request, Authentication authentication) {
        return attendanceService.setDayStatus(authentication.getName(), request);
    }
}
