package com.cube.common.entity;

/**
 * 统一响应包装类
 * 扩展ResponseEntity，提供统一的响应格式
 *
 * @param <T> 响应数据类型
 * @author cube
 * @since 2025-12-24
 */
public class CubeResponse<T> {

    public static final String SUCCESS = "success";
    public static final String FAILED = "failed";

    public static final int SUCCESS_CODE = 200;
    public static final int FAILED_CODE = 500;

    private int code;

    private String message;

    private T data;

    public static <T> CubeResponse<T> success() {
        return restResult(null, SUCCESS_CODE, SUCCESS);
    }

    public static <T> CubeResponse<T> success(T result) {
        return restResult(result, SUCCESS_CODE, SUCCESS);
    }

    public static <T> CubeResponse<T> success(T result, String message) {
        return restResult(result, SUCCESS_CODE, message);
    }

    public static <T> CubeResponse<T> failed() {
        return restResult(null, FAILED_CODE, FAILED);
    }

    public static <T> CubeResponse<T> failed(String message) {
        return restResult(null, FAILED_CODE, message);
    }

    public static <T> CubeResponse<T> failed(T result) {
        return restResult(result, FAILED_CODE, FAILED);
    }

    public static <T> CubeResponse<T> failed(T result, String message) {
        return restResult(result, FAILED_CODE, message);
    }

    public static <T> CubeResponse<T> failed(int code, String message) {
        return restResult(null, code, message);
    }

    private static <T> CubeResponse<T> restResult(T result, int code, String message) {
        var apiResult = new CubeResponse<T>();
        apiResult.setCode(code);
        apiResult.setData(result);
        apiResult.setMessage(message);
        return apiResult;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}