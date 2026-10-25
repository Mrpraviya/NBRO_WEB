package com.NBRO.backend.controller;

import com.NBRO.backend.config.SecurityConfig;
import com.NBRO.backend.service.InvalidCredentialsException;
import com.NBRO.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {HealthController.class, UserController.class})
@Import(SecurityConfig.class)
class PublicEndpointSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    void backendRootReturnsHealthStatusWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"status\":\"UP\",\"service\":\"NBRO backend\"}"));
    }

    @Test
    void loginEndpointIsPublic() throws Exception {
        when(userService.login("test@example.com", "invalid")).thenReturn("OTP sent for login");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"invalid\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void loginEndpointAllowsFrontendCorsPreflight() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "*"));
    }

    @Test
    void loginReturnsRequestedMessageForIncorrectCredentials() throws Exception {
        when(userService.login("test@example.com", "invalid"))
                .thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"invalid\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().json("{\"message\":\"Username , Password is incorrect\"}"));
    }

    @Test
    void forgotPasswordIsPublicAndDoesNotDiscloseWhetherAccountExists() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().json(
                        "{\"message\":\"If an account exists for that email, a password reset link has been sent.\"}"
                ));

        verify(userService).requestPasswordReset("test@example.com", "http://localhost:5173");
    }

    @Test
    void signupVerificationEndpointIsPublicAndPassesCodeToService() throws Exception {
        when(userService.verifyOtp("test@example.com", "123456")).thenReturn("Account verified!");

        mockMvc.perform(post("/api/auth/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"otp\":\"123456\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Account verified!"));

        verify(userService).verifyOtp("test@example.com", "123456");
    }
}
