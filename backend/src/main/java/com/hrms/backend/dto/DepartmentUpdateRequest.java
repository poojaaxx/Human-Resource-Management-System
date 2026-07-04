package com.hrms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentUpdateRequest {

    @NotBlank(message = "Department is required")
    private String department;
}
