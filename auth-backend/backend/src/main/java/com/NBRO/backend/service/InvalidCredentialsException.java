package com.NBRO.backend.service;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Username , Password is incorrect");
    }
}
