package com.hrms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String phone;

    private String address;
}
