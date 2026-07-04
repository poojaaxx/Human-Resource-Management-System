package com.hrms.backend.controller;

import com.hrms.backend.dto.JwtResponse;
import com.hrms.backend.dto.LoginRequest;
import com.hrms.backend.dto.RegisterRequest;
import com.hrms.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public JwtResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);

    }

    @PostMapping("/login")
    public JwtResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);

    }

}