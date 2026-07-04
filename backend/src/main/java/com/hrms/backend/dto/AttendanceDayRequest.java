package com.hrms.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceDayRequest {

    private LocalDate date;

    // null clears the day's status
    private String status;
}
