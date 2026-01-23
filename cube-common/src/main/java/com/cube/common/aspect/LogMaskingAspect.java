package com.cube.common.aspect;

import com.cube.common.annotation.LogMasking;
import com.cube.common.annotation.SensitiveField;
import com.cube.common.utils.SensitiveDataMasker;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * 日志脱敏AOP切面
 * 自动拦截标注了@LogMasking的方法，对敏感数据进行脱敏后记录日志
 *
 * @author cube
 * @since 2026-01-04
 */
@Aspect
@Component
public class LogMaskingAspect {

    private static final Logger LOG = LoggerFactory.getLogger(LogMaskingAspect.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Around("@annotation(com.cube.common.annotation.LogMasking)")
    public Object maskSensitiveData(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        LogMasking logMasking = method.getAnnotation(LogMasking.class);

        // 获取方法参数
        Object[] args = joinPoint.getArgs();
        String methodName = method.getDeclaringClass().getSimpleName() + "." + method.getName();

        // 记录请求日志（脱敏）
        if (logMasking.maskRequest() && args != null && args.length > 0) {
            String maskedArgs = maskArguments(args);
        }

        // 执行目标方法
        Object result = joinPoint.proceed();

        // 记录响应日志（脱敏）
        if (logMasking.maskResponse() && result != null) {
            String maskedResult = maskObject(result);
        }

        return result;
    }

    /**
     * 脱敏方法参数
     */
    private String maskArguments(Object[] args) {
        try {
            Object[] maskedArgs = Arrays.stream(args)
                    .map(this::maskObject)
                    .toArray();
            return objectMapper.writeValueAsString(maskedArgs);
        } catch (Exception e) {
            LOG.warn("Failed to mask arguments", e);
            return "[MASKING_ERROR]";
        }
    }

    /**
     * 脱敏对象
     */
    private String maskObject(Object obj) {
        if (obj == null) {
            return "null";
        }

        try {
            // 基本类型直接返回
            if (obj.getClass().isPrimitive() || obj instanceof String ||
                obj instanceof Number || obj instanceof Boolean) {
                return obj.toString();
            }

            // 复制对象并脱敏敏感字段
            Object maskedObj = cloneAndMaskFields(obj);
            return objectMapper.writeValueAsString(maskedObj);
        } catch (Exception e) {
            LOG.warn("Failed to mask object: {}", obj.getClass().getName(), e);
            return "[MASKING_ERROR: " + obj.getClass().getSimpleName() + "]";
        }
    }

    /**
     * 克隆对象并脱敏敏感字段
     */
    private Object cloneAndMaskFields(Object obj) throws Exception {
        // 简化处理：直接在JSON字符串级别脱敏
        String json = objectMapper.writeValueAsString(obj);

        // 使用工具类自动检测并脱敏JSON中的敏感字段
        String maskedJson = SensitiveDataMasker.maskSensitiveJson(json);

        // 对于标注了@SensitiveField的字段，进行额外处理
        Class<?> clazz = obj.getClass();
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(SensitiveField.class)) {
                SensitiveField annotation = field.getAnnotation(SensitiveField.class);
                String fieldName = field.getName();

                // 在JSON字符串中替换该字段的值
                maskedJson = maskedJson.replaceAll(
                        "\"" + fieldName + "\"\\s*:\\s*\"[^\"]*\"",
                        "\"" + fieldName + "\":\"******\""
                );
            }
        }

        return maskedJson;
    }
}