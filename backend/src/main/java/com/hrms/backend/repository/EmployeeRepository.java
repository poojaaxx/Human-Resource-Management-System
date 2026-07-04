package com.hrms.backend.repository;

import com.hrms.backend.entity.Employee;
import com.hrms.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByNameContainingIgnoreCase(String name);

    Optional<Employee> findByEmailIgnoreCase(String email);

    List<Employee> findByRole(Role role);

    List<Employee> findByRoleAndNameContainingIgnoreCase(Role role, String name);

    long countByRole(Role role);

    List<Employee> findByRoleIsNull();

}