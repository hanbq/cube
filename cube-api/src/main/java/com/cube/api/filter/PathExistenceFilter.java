package com.cube.api.filter;

import jakarta.annotation.Resource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 路径存在性检查过滤器
 * 在JWT认证过滤器之前运行，用于检查请求路径是否存在
 * 如果路径不存在，直接返回404，避免返回401
 *
 * @author cube
 * @since 2025-12-29
 */
@Component
public class PathExistenceFilter extends OncePerRequestFilter {

    private static final Logger LOG = LoggerFactory.getLogger(PathExistenceFilter.class);
    
    @Resource
    private RequestMappingHandlerMapping requestMappingHandlerMapping;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain) throws ServletException, IOException {
        
        // 获取请求路径
        String requestURI = request.getRequestURI();
        
        // 跳过认证相关的路径
        if (requestURI.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 检查请求路径是否存在对应的控制器方法
        // 如果不存在，直接返回404
        if (!isPathExists(request)) {
            LOG.warn("Path not found: {}", requestURI);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(HttpStatus.NOT_FOUND.value());
            
            String jsonResponse = String.format(
                    "{\"code\":%d,\"message\":\"Not Found: %s\",\"data\":null}",
                    HttpStatus.NOT_FOUND.value(),
                    "The requested resource was not found"
            );
            
            PrintWriter writer = response.getWriter();
            writer.write(jsonResponse);
            writer.flush();
            return;
        }
        
        // 路径存在，继续执行过滤器链
        filterChain.doFilter(request, response);
    }
    
    /**
     * 检查请求路径是否存在对应的控制器方法
     * 使用Spring的RequestMappingHandlerMapping来动态检查路径是否存在
     */
    private boolean isPathExists(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        try {
            // 使用RequestMappingHandlerMapping检查路径是否存在对应的处理器
            return requestMappingHandlerMapping.getHandler(request) != null;
        } catch (Exception e) {
            LOG.debug("Error checking path existence for: {}", requestURI, e);
            return false;
        }
    }
}