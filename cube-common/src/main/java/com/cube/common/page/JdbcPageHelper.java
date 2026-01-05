package com.cube.common.page;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * JDBC分页工具类
 * <p>
 * 提供便捷的分页查询功能，支持自动生成count查询
 * <p>
 * 支持的数据库：
 * - MySQL
 * - PostgreSQL
 * - Oracle
 *
 * @author cube
 * @since 2025-12-24
 */
public class JdbcPageHelper {

    /**
     * SQL中的ORDER BY子句正则表达式
     */
    private static final Pattern ORDER_BY_PATTERN = Pattern.compile(
            "\\s+order\\s+by\\s+[^)]+$", Pattern.CASE_INSENSITIVE);
    private static final String OFFSET = " OFFSET ";

    /**
     * JdbcTemplate实例
     */
    private final JdbcTemplate jdbcTemplate;

    /**
     * 数据库类型
     */
    private final DatabaseType databaseType;

    /**
     * 构造函数（自动检测数据库类型）
     *
     * @param jdbcTemplate JdbcTemplate实例
     */
    public JdbcPageHelper(JdbcTemplate jdbcTemplate) {
        this(jdbcTemplate, detectDatabaseType(jdbcTemplate));
    }

    /**
     * 构造函数（指定数据库类型）
     *
     * @param jdbcTemplate JdbcTemplate实例
     * @param databaseType 数据库类型
     */
    public JdbcPageHelper(JdbcTemplate jdbcTemplate, DatabaseType databaseType) {
        if (jdbcTemplate == null) {
            throw new IllegalArgumentException("JdbcTemplate不能为空");
        }
        if (databaseType == null) {
            throw new IllegalArgumentException("数据库类型不能为空");
        }
        this.jdbcTemplate = jdbcTemplate;
        this.databaseType = databaseType;
    }

    /**
     * 自动检测数据库类型
     *
     * @param jdbcTemplate JdbcTemplate实例
     * @return 数据库类型
     */
    private static DatabaseType detectDatabaseType(JdbcTemplate jdbcTemplate) {
        DataSource dataSource = jdbcTemplate.getDataSource();
        if (dataSource == null) {
            return DatabaseType.MYSQL;  // 默认使用MySQL
        }

        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            String databaseProductName = metaData.getDatabaseProductName();
            return DatabaseType.fromProductName(databaseProductName);
        } catch (SQLException e) {
            // 如果检测失败，默认使用MySQL
            return DatabaseType.MYSQL;
        }
    }

    /**
     * 分页查询
     *
     * @param sql         查询SQL
     * @param pageRequest 分页请求
     * @param rowMapper   结果映射器
     * @param args        SQL参数
     * @param <T>         结果类型
     * @return 分页结果
     */
    public <T> PageResult<T> queryForPage(String sql, PageRequest pageRequest,
                                          RowMapper<T> rowMapper, Object... args) {
        // 1. 查询总记录数
        long total = queryTotal(sql, args);

        // 2. 如果总记录数为0，直接返回空结果
        if (total == 0) {
            return PageResult.empty(pageRequest.getPageNum(), pageRequest.getPageSize());
        }

        // 3. 查询当前页数据
        String pageSql = buildPageSql(sql, pageRequest);
        List<T> records = jdbcTemplate.query(pageSql, rowMapper, args);

        // 4. 构建分页结果
        return PageResult.of(pageRequest, total, records);
    }

    /**
     * 分页查询（返回List）
     *
     * @param sql         查询SQL
     * @param pageRequest 分页请求
     * @param elementType 元素类型（支持基本类型：String, Integer, Long等）
     * @param args        SQL参数
     * @param <T>         结果类型
     * @return 分页结果
     */
    public <T> PageResult<T> queryForPage(String sql, PageRequest pageRequest,
                                          Class<T> elementType, Object... args) {
        // 1. 查询总记录数
        long total = queryTotal(sql, args);

        // 2. 如果总记录数为0，直接返回空结果
        if (total == 0) {
            return PageResult.empty(pageRequest.getPageNum(), pageRequest.getPageSize());
        }

        // 3. 查询当前页数据
        String pageSql = buildPageSql(sql, pageRequest);
        List<T> records = jdbcTemplate.queryForList(pageSql, elementType, args);

        // 4. 构建分页结果
        return PageResult.of(pageRequest, total, records);
    }

    /**
     * 查询总记录数
     *
     * @param sql  查询SQL
     * @param args SQL参数
     * @return 总记录数
     */
    public long queryTotal(String sql, Object... args) {
        String countSql = buildCountSql(sql);
        Long count = jdbcTemplate.queryForObject(countSql, Long.class, args);
        return count != null ? count : 0L;
    }

    /**
     * 构建count查询SQL
     * <p>
     * 自动移除ORDER BY子句以提高性能
     *
     * @param sql 原始SQL
     * @return count查询SQL
     */
    protected String buildCountSql(String sql) {
        // 移除ORDER BY子句
        String countSql = removeOrderBy(sql);

        // 构建count查询
        return "SELECT COUNT(*) FROM (" + countSql + ") AS count_table";
    }

    /**
     * 构建分页查询SQL
     *
     * @param sql         原始SQL
     * @param pageRequest 分页请求
     * @return 分页查询SQL
     */
    protected String buildPageSql(String sql, PageRequest pageRequest) {
        return switch (databaseType) {
            case MYSQL -> buildMySqlPageSql(sql, pageRequest);
            case POSTGRESQL -> buildPostgreSqlPageSql(sql, pageRequest);
            case ORACLE -> buildOraclePageSql(sql, pageRequest);
            default ->
                // 默认使用MySQL语法
                    buildMySqlPageSql(sql, pageRequest);
        };
    }

    /**
     * 构建MySQL分页SQL
     *
     * @param sql         原始SQL
     * @param pageRequest 分页请求
     * @return MySQL分页SQL
     */
    private String buildMySqlPageSql(String sql, PageRequest pageRequest) {
        return buildPostgreSqlPageSql(sql, pageRequest);
    }

    /**
     * 构建PostgreSQL分页SQL
     *
     * @param sql         原始SQL
     * @param pageRequest 分页请求
     * @return PostgreSQL分页SQL
     */
    private String buildPostgreSqlPageSql(String sql, PageRequest pageRequest) {
        // PostgreSQL使用与MySQL相同的语法
        return sql + " LIMIT " + pageRequest.getLimit() + OFFSET + pageRequest.getOffset();
    }

    /**
     * 构建Oracle分页SQL
     * <p>
     * Oracle 12c及以上版本使用OFFSET/FETCH语法
     * 如需支持Oracle 11g及以下版本，请重写此方法使用ROWNUM
     *
     * @param sql         原始SQL
     * @param pageRequest 分页请求
     * @return Oracle分页SQL
     */
    private String buildOraclePageSql(String sql, PageRequest pageRequest) {
        // Oracle 12c+ 使用 OFFSET/FETCH
        return sql + OFFSET + pageRequest.getOffset() + " ROWS FETCH NEXT " +
                pageRequest.getLimit() + " ROWS ONLY";
    }

    /**
     * 移除SQL中的ORDER BY子句
     *
     * @param sql 原始SQL
     * @return 移除ORDER BY后的SQL
     */
    protected String removeOrderBy(String sql) {
        Matcher matcher = ORDER_BY_PATTERN.matcher(sql);
        if (matcher.find()) {
            return matcher.replaceAll("");
        }
        return sql;
    }

    /**
     * 获取JdbcTemplate实例
     *
     * @return JdbcTemplate实例
     */
    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    /**
     * 获取数据库类型
     *
     * @return 数据库类型
     */
    public DatabaseType getDatabaseType() {
        return databaseType;
    }

    /**
     * 创建JdbcPageHelper实例（自动检测数据库类型）
     *
     * @param jdbcTemplate JdbcTemplate实例
     * @return JdbcPageHelper实例
     */
    public static JdbcPageHelper create(JdbcTemplate jdbcTemplate) {
        return new JdbcPageHelper(jdbcTemplate);
    }

    /**
     * 创建JdbcPageHelper实例（指定数据库类型）
     *
     * @param jdbcTemplate JdbcTemplate实例
     * @param databaseType 数据库类型
     * @return JdbcPageHelper实例
     */
    public static JdbcPageHelper create(JdbcTemplate jdbcTemplate, DatabaseType databaseType) {
        return new JdbcPageHelper(jdbcTemplate, databaseType);
    }
}
