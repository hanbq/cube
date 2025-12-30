package com.cube.gateway.aspect;

import com.cube.gateway.annotation.SysLog;
import com.cube.gateway.entity.UserPrincipal;
import com.cube.gateway.service.AsyncSysLogService;
import com.cube.system.entity.SYSLoginRequest;
import com.cube.system.entity.SYSSysLog;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import tools.jackson.databind.ObjectMapper;

import java.lang.reflect.Method;
import java.time.ZonedDateTime;

/**
 * 系统日志切面
 * 处理带有@SysLog注解的方法，记录系统操作日志
 *
 * @author system
 */
@Aspect
@Component
public class SysLogAspect {

    private static final Logger logger = LoggerFactory.getLogger(SysLogAspect.class);

    @Resource
    private AsyncSysLogService asyncSysLogService;

    /**
     * 定义切点，拦截带有@SysLog注解的方法
     */
    @Pointcut("@annotation(com.cube.gateway.annotation.SysLog)")
    public void sysLogPointCut() {
    }

    /**
     * 方法成功执行后记录系统日志
     *
     * @param joinPoint 连接点
     * @param result 方法执行结果
     */
    @AfterReturning(pointcut = "sysLogPointCut()", returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        handleLog(joinPoint, null, result);
    }

    /**
     * 方法抛出异常后记录系统日志
     *
     * @param joinPoint 连接点
     * @param e 异常
     */
    @AfterThrowing(pointcut = "sysLogPointCut()", throwing = "e")
    public void afterThrowing(JoinPoint joinPoint, Exception e) {
        handleLog(joinPoint, e, null);
    }

    /**
     * 处理日志记录
     *
     * @param joinPoint 连接点
     * @param e 异常
     * @param result 方法执行结果
     */
    private void handleLog(JoinPoint joinPoint, Exception e, Object result) {
        // 创建日志对象
        var sysLog = new SYSSysLog();
        sysLog.setCreatedTime(ZonedDateTime.now());

        try {
            // 获取请求信息
            var request = getHttpServletRequest();

            // 获取注解信息
            var method = getMethod(joinPoint);
            var sysLogAnnotation = method.getAnnotation(SysLog.class);

            String username = getCurrentUsername(request, joinPoint);
            sysLog.setUsername(username);

            String ip = getIpAddress(request);
            sysLog.setIp(ip);

            // 设置操作信息
            var operation = sysLogAnnotation.operation();
            if (!StringUtils.hasLength(operation)) {
                operation = sysLogAnnotation.value();
            }
            if (!StringUtils.hasLength(operation)) {
                operation = method.getName();
            }
            sysLog.setOperation(operation);

            // 设置请求参数
            if (sysLogAnnotation.saveRequestData()) {
                Object[] args = joinPoint.getArgs();
                String params = arrayToString(args);
                sysLog.setParams(params);
            }

            // 设置方法信息
            var className = joinPoint.getTarget().getClass().getName();
            var methodName = method.getName();
            sysLog.setMethod(className + "." + methodName + "()");

            // 设置异常信息
            // 设置状态信息
            if (e != null) {
                sysLog.setStatus("FAILED");
            } else {
                sysLog.setStatus("SUCCESS");
            }

        } catch (Exception ex) {
            logger.error("ERROR", ex);
        } finally {
            // 异步保存日志
            asyncSysLogService.saveSysLogAsync(sysLog);
        }
    }

    private static Method getMethod(JoinPoint joinPoint) {
        var signature = (MethodSignature) joinPoint.getSignature();
        return signature.getMethod();
    }

    private static HttpServletRequest getHttpServletRequest() {
        var attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        assert attributes != null;
        return attributes.getRequest();
    }

    /**
     * 获取当前用户名
     * 对于登录接口，从请求参数中获取用户名
     * 对于其他接口，从Spring Security的SecurityContext中获取当前用户名
     *
     * @param request HTTP请求
     * @param joinPoint 连接点
     * @return 用户名
     */
    private String getCurrentUsername(HttpServletRequest request, JoinPoint joinPoint) {
        try {
            // 检查是否是登录接口
            String requestURI = request.getRequestURI();
            
            // 如果是登录接口，从请求参数中获取用户名
            if (requestURI != null && requestURI.contains("/api/auth/login")) {
                Object[] args = joinPoint.getArgs();
                if (args != null && args.length > 0 && args[0] instanceof SYSLoginRequest loginRequest) {
                    return loginRequest.getUsername();
                }
            }
            
            // 对于其他接口，从SecurityContext中获取用户名
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                var principal = (UserPrincipal) authentication.getPrincipal();
                return principal.userName();
            }
        } catch (Exception e) {
            logger.debug("无法获取当前用户名", e);
        }
        
        return "anonymous";
    }

    /**
     * 数组转字符串
     *
     * @param array 数组
     * @return 字符串
     */
    private String arrayToString(Object[] array) {
        if (array == null || array.length == 0) {
            return "[]";
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < array.length; i++) {
            if (i > 0) {
                sb.append(", ");
            }
            sb.append(objectToString(array[i]));
        }
        sb.append("]");

        return sb.toString();
    }

    /**
     * 对象转字符串
     *
     * @param obj 对象
     * @return 字符串
     */
    private String objectToString(Object obj) {
        if (obj == null) {
            return "null";
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }

    private String getIpAddress(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }
        
        String ip = request.getHeader("X-Real-IP");
        if (!StringUtils.hasLength(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Forwarded-For");
        }
        if (!StringUtils.hasLength(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (!StringUtils.hasLength(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (!StringUtils.hasLength(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (!StringUtils.hasLength(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (!StringUtils.hasLength(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 对于通过多个代理的情况，第一个IP才是客户端的真实IP
        if (StringUtils.hasLength(ip) && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        // 处理IPv6本地回环地址，转换为IPv4格式
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }
        
        return ip;
    }
}