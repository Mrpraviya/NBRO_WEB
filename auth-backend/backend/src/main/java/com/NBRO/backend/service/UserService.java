package com.NBRO.backend.service;

import com.NBRO.backend.entity.User;
import com.NBRO.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.security.SecureRandom;

@Service
public class UserService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpEmailService otpEmailService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            OtpEmailService otpEmailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpEmailService = otpEmailService;
    }

    public String signup(String email, String password) {
        if (email == null || password == null) {
            throw new IllegalArgumentException("Email or password is missing");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        boolean resendingVerification = user != null && !user.isVerified();
        if (user != null && !resendingVerification) {
            throw new RuntimeException("User already exists");
        }

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setVerified(false);
        }

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        otpEmailService.sendOtp(email, otp);

        return resendingVerification
                ? "Verification code resent."
                : "User registered. Verify OTP.";
    }

    public String verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setVerified(true);
        user.setOtp(null);
        userRepository.save(user);

        return "Account verified!";
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isVerified()) {
            throw new RuntimeException("Verify OTP first");
        }

        // Step 2 OTP
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        otpEmailService.sendOtp(email, otp);

        return "OTP sent for login";
    }

    public String verifyLoginOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if (!otp.equals(user.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        return "Login successful (Generate JWT here)";
    }

    private String generateOtp() {
        return String.valueOf(SECURE_RANDOM.nextInt(900000) + 100000);
    }
}