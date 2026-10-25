package com.NBRO.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@ConditionalOnProperty(prefix = "app.mail", name = "provider", havingValue = "brevo", matchIfMissing = true)
public class BrevoOtpEmailService implements OtpEmailService {

    private final RestClient brevoClient;
    private final String apiKey;
    private final String fromAddress;
    private final String fromName;

    public BrevoOtpEmailService(
            RestClient.Builder restClientBuilder,
            @Value("${BREVO_API_KEY:}") String apiKey,
            @Value("${MAIL_FROM:}") String fromAddress,
            @Value("${MAIL_FROM_NAME:NBRO}") String fromName
    ) {
        this.brevoClient = restClientBuilder.baseUrl("https://api.brevo.com/v3").build();
        this.apiKey = apiKey;
        this.fromAddress = fromAddress;
        this.fromName = fromName;
    }

    @Override
    public void sendOtp(String email, String otp) {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("BREVO_API_KEY is not configured");
        }
        if (fromAddress.isBlank()) {
            throw new IllegalStateException("MAIL_FROM is not configured");
        }

        brevoClient.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "sender", Map.of("name", fromName, "email", fromAddress),
                        "to", new Object[]{Map.of("email", email)},
                        "subject", "Your NBRO verification code",
                        "textContent", "Your verification code is " + otp + ". It expires in 5 minutes."
                ))
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public void sendPasswordResetLink(String email, String resetLink) {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("BREVO_API_KEY is not configured");
        }
        if (fromAddress.isBlank()) {
            throw new IllegalStateException("MAIL_FROM is not configured");
        }

        brevoClient.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "sender", Map.of("name", fromName, "email", fromAddress),
                        "to", new Object[]{Map.of("email", email)},
                        "subject", "Reset your NBRO password",
                        "textContent", "Use this link to reset your NBRO password. It expires in 30 minutes: "
                                + resetLink
                ))
                .retrieve()
                .toBodilessEntity();
    }
}
