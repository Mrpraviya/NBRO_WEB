package com.NBRO.backend.controller;

import com.NBRO.backend.dto.SignupRequest;
import com.NBRO.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService authService;

    public UserController(UserService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        return ResponseEntity.ok(
                authService.signup(req.getEmail(), req.getPassword())
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(
                authService.verifyOtp(req.get("email"), req.get("otp"))
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(
                authService.login(req.get("email"), req.get("password"))
        );
    }

    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyLogin(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(
                authService.verifyLoginOtp(req.get("email"), req.get("otp"))
        );
    }
}