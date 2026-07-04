package com.hrms.backend.entity;

import com.hrms.backend.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee name is required")
    private String name;

    @Email(message = "Invalid email")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Designation is required")
    private String designation;

    private Double salary;

    private String phone;

    private String address;

    // Which account role this profile row belongs to (EMPLOYEE/HR/ADMIN) —
    // determines whether it shows up in the Employees directory vs HR staff list.
    @Enumerated(EnumType.STRING)
    private Role role;
}