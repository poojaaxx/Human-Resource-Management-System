package com.hrms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestDto {

    private Long employeeId;

    @NotBlank
    private String employeeName;

    @NotBlank
    private String leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank
    private String reason;

}