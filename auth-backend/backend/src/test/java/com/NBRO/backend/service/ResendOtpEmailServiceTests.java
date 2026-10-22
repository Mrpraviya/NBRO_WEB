package com.NBRO.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.http.HttpMethod.POST;

class ResendOtpEmailServiceTests {

    @Test
    void sendsOtpThroughResendHttpsApi() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://api.resend.com");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        ResendOtpEmailService emailService = new ResendOtpEmailService(
                builder,
                "test-api-key",
                "NBRO <onboarding@resend.dev>"
        );
        server.expect(requestTo("https://api.resend.com/emails"))
                .andExpect(method(POST))
                .andExpect(header(HttpHeaders.AUTHORIZATION, "Bearer test-api-key"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("""
                        {
                          "from": "NBRO <onboarding@resend.dev>",
                          "to": ["recipient@example.com"],
                          "subject": "Your NBRO verification code",
                          "text": "Your verification code is 123456. It expires in 5 minutes."
                        }
                        """))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        emailService.sendOtp("recipient@example.com", "123456");

        server.verify();
    }
}
