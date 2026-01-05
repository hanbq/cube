package com.cube.common.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 敏感数据脱敏工具类
 * 用于在日志中隐藏敏感信息
 *
 * @author cube
 * @since 2026-01-04
 */
public class SensitiveDataMasker {

    private static final String MASK_CHAR = "*";

    // 常见敏感字段的正则匹配
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "(password|pwd|passwd|secret|token|apikey|api_key)([\"']?\\s*[:=]\\s*[\"']?)([^\"',\\s}]+)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern CREDIT_CARD_PATTERN = Pattern.compile(
            "(\\d{4})[\\s-]?(\\d{4})[\\s-]?(\\d{4})[\\s-]?(\\d{4})"
    );

    /**
     * 完全隐藏密码
     * 例如: "myPassword123" -> "******"
     */
    public static String maskPassword(String password) {
        if (password == null || password.isEmpty()) {
            return password;
        }
        return MASK_CHAR.repeat(6);
    }

    /**
     * 保留首尾字符，中间隐藏
     * 例如: "myPassword123" -> "m***********3"
     */
    public static String maskKeepEnds(String data, int keepLength) {
        if (data == null || data.length() <= keepLength * 2) {
            return MASK_CHAR.repeat(Math.max(6, data != null ? data.length() : 0));
        }

        String prefix = data.substring(0, keepLength);
        String suffix = data.substring(data.length() - keepLength);
        int maskLength = data.length() - keepLength * 2;

        return prefix + MASK_CHAR.repeat(maskLength) + suffix;
    }

    /**
     * 隐藏邮箱地址
     * 例如: "user@example.com" -> "u***@example.com"
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }

        String[] parts = email.split("@");
        if (parts.length != 2) {
            return email;
        }

        String localPart = parts[0];
        String domain = parts[1];

        if (localPart.length() <= 1) {
            return localPart + "***@" + domain;
        }

        return localPart.charAt(0) + MASK_CHAR.repeat(Math.min(localPart.length() - 1, 3)) + "@" + domain;
    }

    /**
     * 隐藏手机号
     * 例如: "13812345678" -> "138****5678"
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 7) {
            return phone;
        }

        return phone.substring(0, 3) + MASK_CHAR.repeat(4) + phone.substring(phone.length() - 4);
    }

    /**
     * 隐藏身份证号
     * 例如: "110101199001011234" -> "110101********1234"
     */
    public static String maskIdCard(String idCard) {
        if (idCard == null || idCard.length() < 8) {
            return idCard;
        }

        return idCard.substring(0, 6) + MASK_CHAR.repeat(8) + idCard.substring(idCard.length() - 4);
    }

    /**
     * 隐藏银行卡号
     * 例如: "6222021234567890123" -> "6222 **** **** 0123"
     */
    public static String maskBankCard(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 8) {
            return cardNumber;
        }

        String cleaned = cardNumber.replaceAll("[\\s-]", "");
        if (cleaned.length() < 8) {
            return cardNumber;
        }

        return cleaned.substring(0, 4) + " " + MASK_CHAR.repeat(4) + " " +
               MASK_CHAR.repeat(4) + " " + cleaned.substring(cleaned.length() - 4);
    }

    /**
     * 自动检测并脱敏JSON字符串中的敏感字段
     * 例如: {"username":"admin","password":"123456"}
     *    -> {"username":"admin","password":"******"}
     */
    public static String maskSensitiveJson(String json) {
        if (json == null || json.isEmpty()) {
            return json;
        }

        // 脱敏密码相关字段
        Matcher matcher = PASSWORD_PATTERN.matcher(json);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            String fieldName = matcher.group(1);
            String separator = matcher.group(2);
            String value = matcher.group(3);

            String replacement = fieldName + separator + "\"******\"";
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(sb);

        return sb.toString();
    }

    /**
     * 脱敏URL中的敏感参数
     * 例如: /api/login?username=admin&password=123456
     *    -> /api/login?username=admin&password=******
     */
    public static String maskSensitiveUrl(String url) {
        if (url == null || !url.contains("?")) {
            return url;
        }

        String[] parts = url.split("\\?", 2);
        if (parts.length != 2) {
            return url;
        }

        String path = parts[0];
        String queryString = parts[1];

        // 脱敏查询参数
        String maskedQuery = queryString.replaceAll(
                "(?i)(password|pwd|passwd|secret|token|apikey|api_key)=([^&]+)",
                "$1=******"
        );

        return path + "?" + maskedQuery;
    }

    /**
     * 通用脱敏方法 - 根据数据类型自动选择脱敏策略
     */
    public static String mask(String data, SensitiveType type) {
        if (data == null) {
            return null;
        }

        return switch (type) {
            case PASSWORD -> maskPassword(data);
            case EMAIL -> maskEmail(data);
            case PHONE -> maskPhone(data);
            case ID_CARD -> maskIdCard(data);
            case BANK_CARD -> maskBankCard(data);
            case KEEP_ENDS -> maskKeepEnds(data, 1);
            default -> data;
        };
    }

    /**
     * 敏感数据类型枚举
     */
    public enum SensitiveType {
        /** 密码 - 完全隐藏 */
        PASSWORD,
        /** 邮箱 - 保留域名 */
        EMAIL,
        /** 手机号 - 保留前3后4 */
        PHONE,
        /** 身份证号 - 保留前6后4 */
        ID_CARD,
        /** 银行卡号 - 保留前4后4 */
        BANK_CARD,
        /** 保留首尾 - 保留首尾各1位 */
        KEEP_ENDS,
        /** 无脱敏 */
        NONE
    }
}