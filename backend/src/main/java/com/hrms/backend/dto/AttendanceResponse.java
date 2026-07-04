package com.hrms.backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponse {

    private LocalDate date;
    private String status;
    private LocalDateTime checkInTime;
}
