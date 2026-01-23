package com.cube.system.exception;

public class SYSException extends RuntimeException{
    public SYSException(String message) {
        super(message);
    }
    public SYSException(String message, Throwable cause) {
        super(message, cause);
    }
}
