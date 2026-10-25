package com.NBRO.backend.controller;

import com.NBRO.backend.dto.SignupRequest;
import com.NBRO.backend.service.InvalidCredentialsException;
import com.NBRO.backend.service.InvalidPasswordResetTokenException;
import com.NBRO.backend.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class UserController {

    private final UserService authService;

    @Value("${app.frontend.base-url:https://nbro-web.vercel.app}")
    private String frontendBaseUrl;

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
        try {
            return ResponseEntity.ok(authService.login(req.get("email"), req.get("password")));
        } catch (InvalidCredentialsException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyLogin(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(
                authService.verifyLoginOtp(req.get("email"), req.get("otp"))
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        authService.requestPasswordReset(req.get("email"), frontendBaseUrl);
        return ResponseEntity.ok(Map.of(
                "message", "If an account exists for that email, a password reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        String password = req.get("password");
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password is required."));
        }
        try {
            authService.resetPassword(req.get("token"), password);
            return ResponseEntity.ok(Map.of("message", "Password has been reset. You can now sign in."));
        } catch (InvalidPasswordResetTokenException exception) {
            return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
        }
    }
}