package com.hrms.backend.config;

import com.hrms.backend.entity.Employee;
import com.hrms.backend.entity.User;
import com.hrms.backend.enums.Role;
import com.hrms.backend.repository.EmployeeRepository;
import com.hrms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

// One-time backfill for Employee rows created before the `role` column existed —
// resolves each row's role from the matching User account (defaults to EMPLOYEE
// for orphaned rows with no matching login), so directory filtering by role works
// for data that predates this change.
@Component
@RequiredArgsConstructor
public class EmployeeRoleBackfillRunner implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        for (Employee employee : employeeRepository.findByRoleIsNull()) {
            Optional<User> user = userRepository.findByEmail(employee.getEmail());
            employee.setRole(user.map(User::getRole).orElse(Role.EMPLOYEE));
            employeeRepository.save(employee);
        }
    }
}
