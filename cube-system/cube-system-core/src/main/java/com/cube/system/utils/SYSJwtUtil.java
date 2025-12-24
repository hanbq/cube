package com.cube.system.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT工具类
 * 用于生成和验证JWT token
 *
 * @author cube
 * @since 2025-12-24
 */
public class SYSJwtUtil {

    /**
     * 默认密钥（建议通过配置文件配置，至少32个字符）
     */
    private static final String DEFAULT_SECRET_KEY = "cube-system-jwt-secret-key-2025-please-change-this-in-production";

    /**
     * Token有效期（默认24小时）
     */
    private static final long DEFAULT_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    /**
     * 密钥
     */
    private final SecretKey secretKey;

    /**
     * Token有效期（毫秒）
     */
    private final long expirationTime;

    /**
     * 构造函数（使用默认配置）
     */
    public SYSJwtUtil() {
        this(DEFAULT_SECRET_KEY, DEFAULT_EXPIRATION_TIME);
    }

    /**
     * 构造函数
     *
     * @param secretKey 密钥字符串
     * @param expirationTime Token有效期（毫秒）
     */
    public SYSJwtUtil(String secretKey, long expirationTime) {
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
    }

    /**
     * 生成Token
     *
     * @param userId 用户ID
     * @param userName 用户名
     * @return JWT token
     */
    public String generateToken(Long userId, String userName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userName", userName);
        return createToken(claims, userName);
    }

    /**
     * 生成Token（带额外声明）
     *
     * @param userId 用户ID
     * @param userName 用户名
     * @param additionalClaims 额外的声明
     * @return JWT token
     */
    public String generateToken(Long userId, String userName, Map<String, Object> additionalClaims) {
        Map<String, Object> claims = new HashMap<>(additionalClaims);
        claims.put("userId", userId);
        claims.put("userName", userName);
        return createToken(claims, userName);
    }

    /**
     * 创建Token
     *
     * @param claims 声明
     * @param subject 主题（通常是用户名）
     * @return JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从Token中提取用户名
     *
     * @param token JWT token
     * @return 用户名
     */
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * 从Token中提取用户ID
     *
     * @param token JWT token
     * @return 用户ID
     */
    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        Object userId = claims.get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        }
        return null;
    }

    /**
     * 从Token中提取过期时间
     *
     * @param token JWT token
     * @return 过期时间
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * 从Token中提取指定声明
     *
     * @param token JWT token
     * @param claimsResolver 声明解析器
     * @param <T> 返回类型
     * @return 声明值
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 从Token中提取所有声明
     *
     * @param token JWT token
     * @return 所有声明
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 检查Token是否过期
     *
     * @param token JWT token
     * @return 是否过期
     */
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * 验证Token
     *
     * @param token JWT token
     * @param userName 用户名
     * @return 是否有效
     */
    public Boolean validateToken(String token, String userName) {
        final String extractedUserName = extractUserName(token);
        return (extractedUserName.equals(userName) && !isTokenExpired(token));
    }

    /**
     * 验证Token（只检查是否有效，不验证用户名）
     *
     * @param token JWT token
     * @return 是否有效
     */
    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 刷新Token
     *
     * @param token 旧的JWT token
     * @return 新的JWT token
     */
    public String refreshToken(String token) {
        Claims claims = extractAllClaims(token);
        String userName = claims.getSubject();
        Long userId = extractUserId(token);

        // 移除时间相关的claims
        claims.remove(Claims.ISSUED_AT);
        claims.remove(Claims.EXPIRATION);

        return generateToken(userId, userName, claims);
    }
}