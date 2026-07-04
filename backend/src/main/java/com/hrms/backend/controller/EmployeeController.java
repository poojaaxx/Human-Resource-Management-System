package com.hrms.backend.controller;

import com.hrms.backend.dto.ContactUpdateRequest;
import com.hrms.backend.dto.DepartmentUpdateRequest;
import com.hrms.backend.dto.EmployeeRequest;
import com.hrms.backend.dto.EmployeeResponse;
import com.hrms.backend.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // The Employees directory (list/search/create/full-edit/delete) is scoped to
    // EMPLOYEE-role profiles only. HR/Admin's own profiles are managed via /me
    // and (for Admin managing HR) the separate /hr-staff surface.

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EmployeeResponse createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.createEmployee(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public List<EmployeeResponse> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public EmployeeResponse getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public EmployeeResponse updateEmployee(@PathVariable Long id,
                                           @Valid @RequestBody EmployeeRequest request) {
        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return "Employee Deleted Successfully";
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public List<EmployeeResponse> searchEmployee(@RequestParam String name) {
        return employeeService.searchEmployee(name);
    }

    // Admin-only view of HR staff profiles — kept separate from the Employees
    // directory above so HR accounts never mix into the employee list.
    @GetMapping("/hr-staff")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EmployeeResponse> getAllHrStaff() {
        return employeeService.getAllHrStaff();
    }

    // Department-only reassignment. Admin can target anyone; HR can only target
    // EMPLOYEE-role rows (enforced in the service, since it depends on the
    // target's role, not just the caller's).
    @PutMapping("/{id}/department")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public EmployeeResponse updateDepartment(@PathVariable Long id,
                                              @Valid @RequestBody DepartmentUpdateRequest request,
                                              Authentication authentication) {
        return employeeService.updateDepartment(id, request.getDepartment(), authentication.getName());
    }

    @GetMapping("/me")
    public EmployeeResponse getMyEmployee(Authentication authentication) {
        return employeeService.getOrCreateForEmail(authentication.getName());
    }

    @PutMapping("/me/contact")
    public EmployeeResponse updateMyContact(@Valid @RequestBody ContactUpdateRequest request,
                                             Authentication authentication) {
        return employeeService.updateMyContact(authentication.getName(), request);
    }
}
