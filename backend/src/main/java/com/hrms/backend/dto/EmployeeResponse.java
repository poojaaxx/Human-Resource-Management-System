package com.hrms.backend.dto;

import com.hrms.backend.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {

    private Long id;
    private String name;
    private String email;
    private String department;
    private String designation;
    private Double salary;
    private String phone;
    private String address;
    private Role role;
}