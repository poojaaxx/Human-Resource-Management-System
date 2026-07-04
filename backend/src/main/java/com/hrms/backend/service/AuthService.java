package com.hrms.backend.service;

import com.hrms.backend.dto.JwtResponse;
import com.hrms.backend.dto.LoginRequest;
import com.hrms.backend.dto.RegisterRequest;

public interface AuthService {

    JwtResponse register(RegisterRequest request);

    JwtResponse login(LoginRequest request);

}