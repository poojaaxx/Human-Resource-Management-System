package com.hrms.backend.service;

import com.hrms.backend.dto.ContactUpdateRequest;
import com.hrms.backend.dto.EmployeeRequest;
import com.hrms.backend.dto.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(EmployeeRequest request);

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(Long id);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);

    void deleteEmployee(Long id);

    List<EmployeeResponse> searchEmployee(String name);

    EmployeeResponse updateMyContact(String email, ContactUpdateRequest request);

    EmployeeResponse getOrCreateForEmail(String email);

    List<EmployeeResponse> getAllHrStaff();

    EmployeeResponse updateDepartment(Long id, String department, String requesterEmail);

}