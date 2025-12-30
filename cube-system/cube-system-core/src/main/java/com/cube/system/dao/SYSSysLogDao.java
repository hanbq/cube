package com.cube.system.dao;

import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSSysLog;
import com.cube.system.param.SYSLogParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 系统日志DAO
 *
 * @author system
 */
@Repository
public class SYSSysLogDao {

    private final JdbcTemplate jdbcTemplate;
    private final JdbcPageHelper pageHelper;

    @Autowired
    public SYSSysLogDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.pageHelper = new JdbcPageHelper(jdbcTemplate);
    }

    private static final String TABLE_NAME = "CUBE_SYS_SYS_LOG";

    private static final String INSERT_SQL = "INSERT INTO " + TABLE_NAME +
            " (user_name, operation, method, params, ip, created_time) VALUES (?, ?, ?, ?, ?, ?)";

    private static final String DELETE_BY_ID_SQL = "DELETE FROM " + TABLE_NAME + " WHERE log_id = ?";

    private static final String DELETE_BY_IDS_SQL = "DELETE FROM " + TABLE_NAME + " WHERE log_id IN (?)";

    private final RowMapper<SYSSysLog> rowMapper = new RowMapper<SYSSysLog>() {
        @Override
        public SYSSysLog mapRow(ResultSet rs, int rowNum) throws SQLException {
            SYSSysLog log = new SYSSysLog();

            log.setLogId(rs.getLong("log_id"));
            log.setUsername(rs.getString("user_name"));
            log.setOperation(rs.getString("operation"));
            log.setMethod(rs.getString("method"));
            log.setParams(rs.getString("params"));
            log.setIp(rs.getString("ip"));

            Timestamp createdTime = rs.getTimestamp("created_time");
            if (createdTime != null) {
                log.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                        java.time.ZoneId.systemDefault()));
            }

            return log;
        }
    };

    /**
     * 插入日志
     *
     * @param entity 日志对象
     */
    public void insert(SYSSysLog entity) {
        jdbcTemplate.update(connection -> {
            java.sql.PreparedStatement ps = connection.prepareStatement(INSERT_SQL);
            ps.setString(1, entity.getUsername());
            ps.setString(2, entity.getOperation());
            ps.setString(3, entity.getMethod());
            ps.setString(4, entity.getParams());
            ps.setString(5, entity.getIp());
            ps.setTimestamp(6, Timestamp.from(entity.getCreatedTime().toInstant()));
            return ps;
        });
    }

    /**
     * 根据ID删除日志
     *
     * @param id 日志ID
     * @return 删除的行数
     */
    public int deleteById(Long id) {
        return jdbcTemplate.update(DELETE_BY_ID_SQL, id);
    }

    /**
     * 批量删除日志
     *
     * @param ids 日志ID列表
     * @return 删除的行数
     */
    public int deleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        String inClause = String.join(",", Collections.nCopies(ids.size(), "?"));
        String sql = DELETE_BY_IDS_SQL.replace("(?)", "(" + inClause + ")");

        return jdbcTemplate.update(sql, ids.toArray());
    }

    /**
     * 根据参数动态查询日志列表（分页）
     *
     * @param param 查询参数
     * @param pageRequest 分页参数
     * @return 分页结果
     */
    public PageResult<SYSSysLog> findByParamWithPage(SYSLogParam param, PageRequest pageRequest) {
        StringBuilder sql = new StringBuilder("SELECT * FROM " + TABLE_NAME + " WHERE 1=1");
        List<Object> params = new ArrayList<>();

        // 如果username不为空，添加username条件（模糊查询+忽略大小写）
        if (param != null && param.getUsername() != null && !param.getUsername().trim().isEmpty()) {
            sql.append(" AND LOWER(user_name) LIKE LOWER(?)");
            params.add("%" + param.getUsername() + "%");
        }

        // 如果operation不为空，添加operation条件（忽略大小写）
        if (param != null && param.getOperation() != null && !param.getOperation().trim().isEmpty()) {
            sql.append(" AND LOWER(operation) = LOWER(?)");
            params.add(param.getOperation());
        }

        // 如果method不为空，添加method条件（忽略大小写）
        if (param != null && param.getMethod() != null && !param.getMethod().trim().isEmpty()) {
            sql.append(" AND LOWER(method) = LOWER(?)");
            params.add(param.getMethod());
        }

        // 如果ip不为空，添加ip条件
        if (param != null && param.getIp() != null && !param.getIp().trim().isEmpty()) {
            sql.append(" AND ip = ?");
            params.add(param.getIp());
        }

        // 如果createdTimeStart不为空，添加createdTime开始时间条件
        if (param != null && param.getCreatedTimeStart() != null) {
            sql.append(" AND created_time >= ?");
            params.add(Timestamp.from(param.getCreatedTimeStart().toInstant()));
        }

        // 如果createdTimeEnd不为空，添加createdTime结束时间条件
        if (param != null && param.getCreatedTimeEnd() != null) {
            sql.append(" AND created_time <= ?");
            params.add(Timestamp.from(param.getCreatedTimeEnd().toInstant()));
        }

        sql.append(" ORDER BY log_id DESC");

        // 使用pageHelper进行分页查询
        return pageHelper.queryForPage(sql.toString(), pageRequest, rowMapper, params.toArray());
    }
}