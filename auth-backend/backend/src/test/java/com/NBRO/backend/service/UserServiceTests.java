package com.NBRO.backend.service;

import com.NBRO.backend.entity.User;
import com.NBRO.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private OtpEmailService otpEmailService;

    @Test
    void signupCreatesUserAndSendsVerificationCode() {
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        UserService userService = new UserService(userRepository, passwordEncoder, otpEmailService);

        String result = userService.signup("new@example.com", "password");

        assertEquals("User registered. Verify OTP.", result);
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("encoded-password", userCaptor.getValue().getPassword());
        verify(otpEmailService).sendOtp("new@example.com", userCaptor.getValue().getOtp());
    }

    @Test
    void signupResendsCodeForExistingUnverifiedUser() {
        User existingUser = new User();
        existingUser.setEmail("pending@example.com");
        existingUser.setPassword("existing-password");
        existingUser.setVerified(false);
        when(userRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(existingUser));
        UserService userService = new UserService(userRepository, passwordEncoder, otpEmailService);

        String result = userService.signup("pending@example.com", "new-password");

        assertEquals("Verification code resent.", result);
        assertEquals("existing-password", existingUser.getPassword());
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository).save(existingUser);
        verify(otpEmailService).sendOtp("pending@example.com", existingUser.getOtp());
    }

    @Test
    void signupRejectsExistingVerifiedUser() {
        User existingUser = new User();
        existingUser.setVerified(true);
        when(userRepository.findByEmail("verified@example.com")).thenReturn(Optional.of(existingUser));
        UserService userService = new UserService(userRepository, passwordEncoder, otpEmailService);

        assertThrows(RuntimeException.class, () -> userService.signup("verified@example.com", "password"));

        verify(otpEmailService, never()).sendOtp(any(), any());
    }
}
