package com.NBRO.backend.service;

import com.NBRO.backend.entity.User;
import com.NBRO.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
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

    @Test
    void signupVerificationAcceptsSentCodeAndConsumesIt() {
        AtomicReference<User> storedUser = new AtomicReference<>();
        when(userRepository.findByEmail("new@example.com"))
                .thenAnswer(invocation -> Optional.ofNullable(storedUser.get()));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            storedUser.set(savedUser);
            return savedUser;
        });
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        UserService userService = new UserService(userRepository, passwordEncoder, otpEmailService);

        userService.signup("new@example.com", "password");
        ArgumentCaptor<String> otpCaptor = ArgumentCaptor.forClass(String.class);
        verify(otpEmailService).sendOtp(eq("new@example.com"), otpCaptor.capture());

        assertEquals("Account verified!", userService.verifyOtp("new@example.com", otpCaptor.getValue()));
        assertTrue(storedUser.get().isVerified());
        assertNull(storedUser.get().getOtp());
        assertNull(storedUser.get().getOtpExpiry());
        verify(userRepository, times(2)).save(storedUser.get());
    }

    @Test
    void signupVerificationRejectsInvalidCode() {
        User user = new User();
        user.setOtp("123456");
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        when(userRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(user));
        UserService userService = new UserService(userRepository, passwordEncoder, otpEmailService);

        assertThrows(RuntimeException.class, () -> userService.verifyOtp("pending@example.com", "000000"));

        assertFalse(user.isVerified());
        verify(userRepository, never()).save(user);
    }

    @Test
    void signupVerificationRejectsExpiredCode() {
        User user = new User();
        user.setOtp("123456");
        user.setOtpExpiry(LocalDateTime.now().minusSeconds(1));
        when(userRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(user));
        UserService userService = new UserService(userRepository, passwordEncoder, otpEmailService);

        assertThrows(RuntimeException.class, () -> userService.verifyOtp("pending@example.com", "123456"));

        assertFalse(user.isVerified());
        verify(userRepository, never()).save(user);
    }
}
