package com.NBRO.backend.service;

import com.NBRO.backend.entity.User;
import com.NBRO.backend.repository.UserRepository;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

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

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Account verified!";
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (password == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
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

    public void requestPasswordReset(String email, String frontendBaseUrl) {
        if (email == null || email.isBlank()) {
            return;
        }

        userRepository.findByEmail(email)
                .filter(User::isVerified)
                .ifPresent(user -> {
                    String token = generateResetToken();
                    user.setOtp(hashResetToken(token));
                    user.setOtpExpiry(LocalDateTime.now().plusMinutes(30));
                    userRepository.save(user);

                    String resetLink = UriComponentsBuilder.fromUriString(frontendBaseUrl.replaceAll("/+$", ""))
                            .path("/reset-password")
                            .queryParam("token", token)
                            .build()
                            .encode()
                            .toUriString();
                    otpEmailService.sendPasswordResetLink(email, resetLink);
                });
    }

    public void resetPassword(String token, String password) {
        if (token == null || token.isBlank() || password == null || password.isBlank()) {
            throw new InvalidPasswordResetTokenException();
        }

        User user = userRepository.findByOtp(hashResetToken(token))
                .orElseThrow(InvalidPasswordResetTokenException::new);
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            user.setOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new InvalidPasswordResetTokenException();
        }

        user.setPassword(passwordEncoder.encode(password));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }

    public String verifyLoginOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow();

        if (otp == null || user.getOtp() == null || !otp.equals(user.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Login successful (Generate JWT here)";
    }

    private String generateOtp() {
        return String.valueOf(SECURE_RANDOM.nextInt(900000) + 100000);
    }

    private String generateResetToken() {
        byte[] token = new byte[32];
        SECURE_RANDOM.nextBytes(token);
        return HexFormat.of().formatHex(token);
    }

    private String hashResetToken(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}