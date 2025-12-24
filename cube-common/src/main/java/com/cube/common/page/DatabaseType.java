package com.cube.common.page;

/**
 * 数据库类型枚举
 *
 * @author cube
 * @since 2025-12-24
 */
public enum DatabaseType {

    /**
     * MySQL数据库
     */
    MYSQL("MySQL"),

    /**
     * PostgreSQL数据库
     */
    POSTGRESQL("PostgreSQL"),

    /**
     * Oracle数据库
     */
    ORACLE("Oracle"),

    /**
     * 其他数据库（默认使用MySQL语法）
     */
    OTHER("Other");

    private final String name;

    DatabaseType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    /**
     * 从数据库产品名称判断数据库类型
     *
     * @param databaseProductName 数据库产品名称
     * @return 数据库类型
     */
    public static DatabaseType fromProductName(String databaseProductName) {
        if (databaseProductName == null) {
            return OTHER;
        }

        String productName = databaseProductName.toLowerCase();

        if (productName.contains("mysql")) {
            return MYSQL;
        } else if (productName.contains("postgresql") || productName.contains("postgres")) {
            return POSTGRESQL;
        } else if (productName.contains("oracle")) {
            return ORACLE;
        } else {
            return OTHER;
        }
    }

    @Override
    public String toString() {
        return name;
    }
}
