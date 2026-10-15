package com.career.connect.user.controller;

import com.career.connect.user.AppUser;
import com.career.connect.user.UserRole;
import com.career.connect.user.dto.RegisterRequest;
import com.career.connect.user.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request) {

        AppUser user = userService.register(
            request.getName(),
            request.getEmail().trim().toLowerCase(),
            request.getPassword(),
            UserRole.STUDENT
        );

        Map<String, Object> response = Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole().name(),
            "message", "Registration successful"
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}