package com.NBRO.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.springframework.http.HttpMethod.POST;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class BrevoOtpEmailServiceTests {

    @Test
    void sendsOtpThroughBrevoTransactionalEmailApi() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://api.brevo.com/v3");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        BrevoOtpEmailService emailService = new BrevoOtpEmailService(
                builder,
                "test-api-key",
                "otp@example.com",
                "NBRO"
        );
        server.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(POST))
                .andExpect(header("api-key", "test-api-key"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {
                          "sender": {"name": "NBRO", "email": "otp@example.com"},
                          "to": [{"email": "recipient@example.com"}],
                          "subject": "Your NBRO verification code",
                          "textContent": "Your verification code is 123456. It expires in 5 minutes."
                        }
                        """))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        emailService.sendOtp("recipient@example.com", "123456");

        server.verify();
    }

    @Test
    void sendsPasswordResetLinkThroughBrevoTransactionalEmailApi() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://api.brevo.com/v3");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        BrevoOtpEmailService emailService = new BrevoOtpEmailService(
                builder,
                "test-api-key",
                "otp@example.com",
                "NBRO"
        );
        server.expect(requestTo("https://api.brevo.com/v3/smtp/email"))
                .andExpect(method(POST))
                .andExpect(header("api-key", "test-api-key"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {
                          "sender": {"name": "NBRO", "email": "otp@example.com"},
                          "to": [{"email": "recipient@example.com"}],
                          "subject": "Reset your NBRO password",
                          "textContent": "Use this link to reset your NBRO password. It expires in 30 minutes: https://nbro.example/reset-password?token=abc123"
                        }
                        """))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        emailService.sendPasswordResetLink(
                "recipient@example.com",
                "https://nbro.example/reset-password?token=abc123"
        );

        server.verify();
    }
}
