package com.hrms.backend.serviceImpl;

import com.hrms.backend.dto.ContactUpdateRequest;
import com.hrms.backend.dto.EmployeeRequest;
import com.hrms.backend.dto.EmployeeResponse;
import com.hrms.backend.entity.Employee;
import com.hrms.backend.entity.User;
import com.hrms.backend.enums.Role;
import com.hrms.backend.repository.EmployeeRepository;
import com.hrms.backend.repository.UserRepository;
import com.hrms.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    private EmployeeResponse map(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .salary(employee.getSalary())
                .phone(employee.getPhone())
                .address(employee.getAddress())
                .role(employee.getRole())
                .build();
    }

    private String defaultDesignation(Role role) {
        return switch (role) {
            case ADMIN -> "Admin";
            case HR -> "HR Officer";
            case EMPLOYEE -> "Employee";
        };
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {

        // The Employees directory only ever holds EMPLOYEE-role profiles —
        // HR/Admin profiles are auto-provisioned separately via getOrCreateForEmail.
        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .salary(request.getSalary())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(Role.EMPLOYEE)
                .build();

        employeeRepository.save(employee);

        return map(employee);
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findByRole(Role.EMPLOYEE)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return map(employee);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());

        employeeRepository.save(employee);

        return map(employee);
    }

    @Override
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employeeRepository.delete(employee);
    }

    @Override
    public List<EmployeeResponse> searchEmployee(String name) {

        return employeeRepository.findByRoleAndNameContainingIgnoreCase(Role.EMPLOYEE, name)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public EmployeeResponse updateMyContact(String email, ContactUpdateRequest request) {

        Employee employee = employeeRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Employee record not found for current user"));

        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setAddress(request.getAddress());

        employeeRepository.save(employee);

        return map(employee);
    }

    @Override
    public EmployeeResponse getOrCreateForEmail(String email) {

        return employeeRepository.findByEmailIgnoreCase(email)
                .map(this::map)
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    Employee employee = Employee.builder()
                            .name(user.getFullName())
                            .email(user.getEmail())
                            .department("Unassigned")
                            .designation(defaultDesignation(user.getRole()))
                            .role(user.getRole())
                            .build();

                    employeeRepository.save(employee);

                    return map(employee);
                });
    }

    @Override
    public List<EmployeeResponse> getAllHrStaff() {
        return employeeRepository.findByRole(Role.HR)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public EmployeeResponse updateDepartment(Long id, String department, String requesterEmail) {

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Employee target = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Admin can reassign anyone's department. HR can only reassign EMPLOYEE-role
        // rows — never another HR row, and never their own (their own row is HR, not
        // EMPLOYEE, so it never satisfies this check).
        boolean allowed = requester.getRole() == Role.ADMIN
                || (requester.getRole() == Role.HR && target.getRole() == Role.EMPLOYEE);

        if (!allowed) {
            throw new AccessDeniedException("You are not allowed to change this department");
        }

        target.setDepartment(department);
        employeeRepository.save(target);

        return map(target);
    }
}
