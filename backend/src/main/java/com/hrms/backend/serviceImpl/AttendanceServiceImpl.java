package com.hrms.backend.serviceImpl;

import com.hrms.backend.dto.AttendanceDayRequest;
import com.hrms.backend.dto.AttendanceResponse;
import com.hrms.backend.entity.Attendance;
import com.hrms.backend.repository.AttendanceRepository;
import com.hrms.backend.service.AttendanceService;
import com.hrms.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeService employeeService;

    private Long resolveEmployeeId(String email) {
        return employeeService.getOrCreateForEmail(email).getId();
    }

    private AttendanceResponse map(Attendance attendance) {
        return AttendanceResponse.builder()
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .checkInTime(attendance.getCheckInTime())
                .build();
    }

    @Override
    public List<AttendanceResponse> getMyAttendance(String email) {
        Long employeeId = resolveEmployeeId(email);
        return attendanceRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public AttendanceResponse checkIn(String email) {
        Long employeeId = resolveEmployeeId(email);
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseGet(() -> Attendance.builder().employeeId(employeeId).date(today).build());

        attendance.setStatus("PRESENT");
        attendance.setCheckInTime(LocalDateTime.now());

        attendanceRepository.save(attendance);

        return map(attendance);
    }

    @Override
    public AttendanceResponse checkOut(String email) {
        Long employeeId = resolveEmployeeId(email);
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("No check-in found for today"));

        attendance.setCheckInTime(null);

        attendanceRepository.save(attendance);

        return map(attendance);
    }

    @Override
    public AttendanceResponse setDayStatus(String email, AttendanceDayRequest request) {
        Long employeeId = resolveEmployeeId(email);

        if (request.getStatus() == null) {
            attendanceRepository.deleteByEmployeeIdAndDate(employeeId, request.getDate());
            return AttendanceResponse.builder().date(request.getDate()).status(null).build();
        }

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, request.getDate())
                .orElseGet(() -> Attendance.builder().employeeId(employeeId).date(request.getDate()).build());

        attendance.setStatus(request.getStatus());

        attendanceRepository.save(attendance);

        return map(attendance);
    }
}
