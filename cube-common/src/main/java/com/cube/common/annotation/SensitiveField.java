package com.cube.common.annotation;

import com.cube.common.utils.SensitiveDataMasker.SensitiveType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 敏感字段注解
 * 用于标记实体类中需要脱敏的字段
 *
 * @author cube
 * @since 2026-01-04
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface SensitiveField {

    /**
     * 脱敏类型
     */
    SensitiveType value() default SensitiveType.PASSWORD;

    /**
     * 是否在日志中完全隐藏该字段
     */
    boolean hideInLog() default false;
}