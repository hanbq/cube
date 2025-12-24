package com.cube.system.exception;

public class SYSAuthException extends RuntimeException{
    public SYSAuthException(String message) {
        super(message);
    }
    public SYSAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}
