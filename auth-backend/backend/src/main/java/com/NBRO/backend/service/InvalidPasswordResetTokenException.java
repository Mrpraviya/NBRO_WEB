package com.NBRO.backend.service;

public class InvalidPasswordResetTokenException extends RuntimeException {
    public InvalidPasswordResetTokenException() {
        super("This password reset link is invalid or expired. Request a new one.");
    }
}
