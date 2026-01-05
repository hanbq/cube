package com.cube.common.page;

import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Oracle 11g分页工具类
 * <p>
 * 使用ROWNUM语法实现分页，适用于Oracle 11g及以下版本
 * <p>
 * Oracle 12c及以上版本建议使用{@link JdbcPageHelper}默认实现
 *
 * @author cube
 * @since 2025-12-24
 */
public class Oracle11gPageHelper extends JdbcPageHelper {

    /**
     * 构造函数
     *
     * @param jdbcTemplate JdbcTemplate实例
     */
    public Oracle11gPageHelper(JdbcTemplate jdbcTemplate) {
        super(jdbcTemplate, DatabaseType.ORACLE);
    }

    /**
     * 构建Oracle 11g分页SQL（使用ROWNUM）
     * <p>
     * 分页原理：
     * <pre>
     * SELECT * FROM (
     *   SELECT t.*, ROWNUM rn FROM (
     *     原始SQL
     *   ) t WHERE ROWNUM <= 结束行号
     * ) WHERE rn >= 起始行号
     * </pre>
     *
     * @param sql         原始SQL
     * @param pageRequest 分页请求
     * @return Oracle 11g分页SQL
     */
    @Override
    protected String buildPageSql(String sql, PageRequest pageRequest) {
        int start = pageRequest.getOffset() + 1;
        int end = pageRequest.getOffset() + pageRequest.getLimit();

        return "SELECT * FROM ( " +
                "  SELECT t.*, ROWNUM rn FROM (" + sql + ") t " +
                "  WHERE ROWNUM <= " + end +
                ") WHERE rn >= " + start;
    }

    /**
     * 创建Oracle 11g分页工具实例
     *
     * @param jdbcTemplate JdbcTemplate实例
     * @return Oracle 11g分页工具实例
     */
    public static Oracle11gPageHelper create(JdbcTemplate jdbcTemplate) {
        return new Oracle11gPageHelper(jdbcTemplate);
    }
}
