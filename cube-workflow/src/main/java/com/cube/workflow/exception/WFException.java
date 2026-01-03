package com.cube.workflow.exception;

/**
 * 工作流异常
 */
public class WFException extends RuntimeException {

    public WFException(String message) {
        super(message);
    }

    public WFException(String message, Throwable cause) {
        super(message, cause);
    }
}