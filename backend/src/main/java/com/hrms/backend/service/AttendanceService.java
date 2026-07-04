package com.hrms.backend.service;

import com.hrms.backend.dto.AttendanceDayRequest;
import com.hrms.backend.dto.AttendanceResponse;

import java.util.List;

public interface AttendanceService {

    List<AttendanceResponse> getMyAttendance(String email);

    AttendanceResponse checkIn(String email);

    AttendanceResponse checkOut(String email);

    AttendanceResponse setDayStatus(String email, AttendanceDayRequest request);
}
