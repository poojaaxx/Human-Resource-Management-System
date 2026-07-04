package com.hrms.backend.serviceImpl;

import com.hrms.backend.dto.JwtResponse;
import com.hrms.backend.dto.LoginRequest;
import com.hrms.backend.dto.RegisterRequest;
import com.hrms.backend.entity.User;
import com.hrms.backend.repository.UserRepository;
import com.hrms.backend.security.JwtService;
import com.hrms.backend.service.AuthService;
import com.hrms.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final EmployeeService employeeService;

    @Override
    public JwtResponse register(RegisterRequest request) {

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        repository.save(user);
        employeeService.getOrCreateForEmail(user.getEmail());

        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        java.util.Collections.emptyList()
                )
        );

        return new JwtResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public JwtResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        java.util.Collections.emptyList()
                )
        );

        return new JwtResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }
}