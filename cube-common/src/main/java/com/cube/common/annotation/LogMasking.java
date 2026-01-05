package com.cube.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 日志脱敏注解
 * 用于Controller方法上，自动脱敏请求参数和返回值中的敏感数据
 *
 * @author cube
 * @since 2026-01-04
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogMasking {

    /**
     * 是否脱敏请求参数
     */
    boolean maskRequest() default true;

    /**
     * 是否脱敏响应数据
     */
    boolean maskResponse() default false;

    /**
     * 需要脱敏的参数名列表（如果为空则自动检测）
     */
    String[] sensitiveParams() default {};
}