package com.NBRO.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@ConditionalOnProperty(prefix = "app.mail", name = "provider", havingValue = "resend", matchIfMissing = true)
public class ResendOtpEmailService implements OtpEmailService {

    private final RestClient resendClient;
    private final String apiKey;
    private final String fromAddress;

    public ResendOtpEmailService(
            RestClient.Builder restClientBuilder,
            @Value("${RESEND_API_KEY:}") String apiKey,
            @Value("${MAIL_FROM:}") String fromAddress
    ) {
        this.resendClient = restClientBuilder.baseUrl("https://api.resend.com").build();
        this.apiKey = apiKey;
        this.fromAddress = fromAddress;
    }

    @Override
    public void sendOtp(String email, String otp) {
        if (apiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY is not configured");
        }
        if (fromAddress.isBlank()) {
            throw new IllegalStateException("MAIL_FROM is not configured");
        }

        resendClient.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "from", fromAddress,
                        "to", new String[]{email},
                        "subject", "Your NBRO verification code",
                        "text", "Your verification code is " + otp + ". It expires in 5 minutes."
                ))
                .retrieve()
                .toBodilessEntity();
    }
}
