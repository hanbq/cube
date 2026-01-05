package com.cube.api.annotation;

import java.lang.annotation.*;

/**
 * 系统日志注解
 * 用于标记需要记录系统日志的方法
 *
 * @author system
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SysLog {
    
    /**
     * 操作描述
     *
     * @return 操作描述
     */
    String value() default "";
    
    /**
     * 操作类型
     *
     * @return 操作类型
     */
    String operation() default "";
    
    /**
     * 是否记录请求参数
     *
     * @return 是否记录请求参数
     */
    boolean saveRequestData() default true;
    
    /**
     * 是否记录响应数据
     *
     * @return 是否记录响应数据
     */
    boolean saveResponseData() default false;
}