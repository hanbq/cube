package com.cube;

import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;

/**
 * JDBC分页工具使用示例
 *
 * @author cube
 * @since 2025-12-24
 */
public class JdbcPageHelperExample {

    public static void main(String[] args) {
        System.out.println("========== JDBC分页工具使用示例 ==========\n");

        // 示例1：PageRequest的使用
        example1_PageRequest();

        // 示例2：PageResult的使用
        example2_PageResult();

        // 示例3：JdbcPageHelper的使用
        example3_JdbcPageHelper();

        System.out.println("\n========== 示例结束 ==========");
    }

    /**
     * 示例1：PageRequest的使用
     */
    private static void example1_PageRequest() {
        System.out.println("【示例1】PageRequest的使用");

        // 创建分页请求
        PageRequest page1 = new PageRequest(1, 10);
        PageRequest page2 = PageRequest.of(2, 20);

        System.out.println("第1页：" + page1);
        System.out.println("  - Offset: " + page1.getOffset());
        System.out.println("  - Limit: " + page1.getLimit());

        System.out.println("第2页：" + page2);
        System.out.println("  - Offset: " + page2.getOffset());
        System.out.println("  - Limit: " + page2.getLimit());
        System.out.println();
    }

    /**
     * 示例2：PageResult的使用
     */
    private static void example2_PageResult() {
        System.out.println("【示例2】PageResult的使用");

        // 创建分页结果（模拟数据）
        PageRequest pageRequest = PageRequest.of(1, 10);
        PageResult<String> result = PageResult.of(
                pageRequest,
                100,  // 总记录数
                java.util.Arrays.asList("数据1", "数据2", "数据3", "数据4", "数据5")
        );

        System.out.println(result);
        System.out.println("  - 当前页数据数量: " + result.getSize());
        System.out.println("  - 是否第一页: " + result.isFirst());
        System.out.println("  - 是否最后一页: " + result.isLast());
        System.out.println("  - 是否有上一页: " + result.hasPrevious());
        System.out.println("  - 是否有下一页: " + result.hasNext());
        System.out.println();
    }

    /**
     * 示例3：JdbcPageHelper的使用
     */
    private static void example3_JdbcPageHelper() {
        System.out.println("【示例3】JdbcPageHelper的使用");
        System.out.println("注意：需要配置JdbcTemplate才能运行\n");

        System.out.println("代码示例：");
        System.out.println("```java");
        System.out.println("// 1. 创建JdbcPageHelper（自动检测数据库类型）");
        System.out.println("JdbcPageHelper pageHelper = new JdbcPageHelper(jdbcTemplate);");
        System.out.println();
        System.out.println("// 或者手动指定数据库类型");
        System.out.println("JdbcPageHelper mysqlHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.MYSQL);");
        System.out.println("JdbcPageHelper pgHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.POSTGRESQL);");
        System.out.println("JdbcPageHelper oracleHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.ORACLE);");
        System.out.println();
        System.out.println("// Oracle 11g及以下版本使用专用工具类");
        System.out.println("Oracle11gPageHelper oracle11gHelper = new Oracle11gPageHelper(jdbcTemplate);");
        System.out.println();
        System.out.println("// 2. 准备SQL和分页参数");
        System.out.println("String sql = \"SELECT * FROM user WHERE status = ?\";");
        System.out.println("PageRequest pageRequest = PageRequest.of(1, 10);");
        System.out.println();
        System.out.println("// 3. 执行分页查询");
        System.out.println("PageResult<User> result = pageHelper.queryForPage(");
        System.out.println("    sql,");
        System.out.println("    pageRequest,");
        System.out.println("    (rs, rowNum) -> {");
        System.out.println("        User user = new User();");
        System.out.println("        user.setId(rs.getLong(\"id\"));");
        System.out.println("        user.setName(rs.getString(\"name\"));");
        System.out.println("        return user;");
        System.out.println("    },");
        System.out.println("    1  // status参数");
        System.out.println(");");
        System.out.println();
        System.out.println("// 4. 使用分页结果");
        System.out.println("System.out.println(\"总记录数: \" + result.getTotal());");
        System.out.println("System.out.println(\"总页数: \" + result.getPages());");
        System.out.println("result.getRecords().forEach(System.out::println);");
        System.out.println("```");
        System.out.println();

        // 演示不同数据库的SQL构建
        System.out.println("不同数据库的分页SQL：");
        String originalSql = "SELECT * FROM user WHERE status = ? ORDER BY create_time DESC";
        PageRequest pageRequest = PageRequest.of(2, 10);

        System.out.println("\n原始SQL:");
        System.out.println(originalSql);

        System.out.println("\nMySQL分页SQL:");
        System.out.println(originalSql + " LIMIT " + pageRequest.getLimit() +
                " OFFSET " + pageRequest.getOffset());

        System.out.println("\nPostgreSQL分页SQL:");
        System.out.println(originalSql + " LIMIT " + pageRequest.getLimit() +
                " OFFSET " + pageRequest.getOffset());

        System.out.println("\nOracle 12c+分页SQL:");
        System.out.println(originalSql + " OFFSET " + pageRequest.getOffset() +
                " ROWS FETCH NEXT " + pageRequest.getLimit() + " ROWS ONLY");

        System.out.println("\nOracle 11g分页SQL:");
        System.out.println("SELECT * FROM (\n" +
                "  SELECT t.*, ROWNUM rn FROM (" + originalSql + ") t\n" +
                "  WHERE ROWNUM <= " + (pageRequest.getOffset() + pageRequest.getLimit()) + "\n" +
                ") WHERE rn >= " + (pageRequest.getOffset() + 1));

        System.out.println("\nCount SQL:");
        System.out.println("SELECT COUNT(*) FROM (SELECT * FROM user WHERE status = ?) AS count_table");
    }
}
