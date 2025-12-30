package com.cube.system.dao;

import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSSysLog;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 系统日志DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSSysLogDao {

    private final JdbcTemplate jdbcTemplate;
    private final JdbcPageHelper pageHelper;

    private static final String TABLE_NAME = "CUBE_SYS_SYS_LOG";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (user_name, operation, method, params, ip, created_time) " +
            " VALUES (?, ?, ?, ?, ?, ?)";

    private static final String FIND_BY_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE log_id = ?";

    private static final String FIND_ALL_SQL =
            "SELECT * FROM " + TABLE_NAME + " ORDER BY created_time DESC";

    private static final String FIND_BY_USER_NAME_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE user_name = ? ORDER BY created_time DESC";

    private static final String FIND_BY_OPERATION_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE operation = ? ORDER BY created_time DESC";

    private static final String FIND_BY_IP_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE ip = ? ORDER BY created_time DESC";

    private static final String DELETE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE log_id = ?";

    private static final String DELETE_BEFORE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE created_time < ?";

    private static final String COUNT_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME;

    public SYSSysLogDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.pageHelper = new JdbcPageHelper(jdbcTemplate);
    }

    /**
     * RowMapper for SYSSysLog
     */
    private final RowMapper<SYSSysLog> rowMapper = (rs, rowNum) -> {
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
    };

    /**
     * 插入日志
     *
     * @param entity 日志对象
     * @return 插入后的主键ID
     */
    public Long insert(SYSSysLog entity) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, entity.getUsername());
            ps.setString(2, entity.getOperation());
            ps.setString(3, entity.getMethod());
            ps.setString(4, entity.getParams());
            ps.setString(5, entity.getIp());
            ps.setTimestamp(6, Timestamp.from(ZonedDateTime.now().toInstant())); // created_time

            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    /**
     * 根据ID查询日志
     *
     * @param id 日志ID
     * @return 日志对象
     */
    public Optional<SYSSysLog> findById(Long id) {
        List<SYSSysLog> results = jdbcTemplate.query(FIND_BY_ID_SQL, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 查询所有日志
     *
     * @return 日志列表
     */
    public List<SYSSysLog> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 分页查询日志
     *
     * @param pageRequest 分页请求
     * @return 分页结果
     */
    public PageResult<SYSSysLog> findPage(PageRequest pageRequest) {
        return pageHelper.queryForPage(FIND_ALL_SQL, pageRequest, rowMapper);
    }

    /**
     * 根据用户名查询日志列表
     *
     * @param userName 用户名
     * @return 日志列表
     */
    public List<SYSSysLog> findByUserName(String userName) {
        return jdbcTemplate.query(FIND_BY_USER_NAME_SQL, rowMapper, userName);
    }

    /**
     * 根据操作类型查询日志列表
     *
     * @param operation 操作类型
     * @return 日志列表
     */
    public List<SYSSysLog> findByOperation(String operation) {
        return jdbcTemplate.query(FIND_BY_OPERATION_SQL, rowMapper, operation);
    }

    /**
     * 根据IP查询日志列表
     *
     * @param ip IP地址
     * @return 日志列表
     */
    public List<SYSSysLog> findByIp(String ip) {
        return jdbcTemplate.query(FIND_BY_IP_SQL, rowMapper, ip);
    }

    /**
     * 根据ID删除日志（物理删除）
     *
     * @param id 日志ID
     * @return 删除的行数
     */
    public int deleteById(Long id) {
        return jdbcTemplate.update(DELETE_SQL, id);
    }

    /**
     * 删除指定时间之前的日志（物理删除）
     *
     * @param beforeTime 截止时间
     * @return 删除的行数
     */
    public int deleteBefore(ZonedDateTime beforeTime) {
        return jdbcTemplate.update(DELETE_BEFORE_SQL, Timestamp.from(beforeTime.toInstant()));
    }

    /**
     * 统计日志数量
     *
     * @return 日志总数
     */
    public long count() {
        Long count = jdbcTemplate.queryForObject(COUNT_SQL, Long.class);
        return count != null ? count : 0L;
    }
}
