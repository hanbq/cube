package com.cube.system.dao;

import com.cube.common.exception.DataException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
/**
 * 用户角色关联DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSUserRoleDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String TABLE_NAME = "CUBE_SYS_USER_ROLE";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (user_id, role_id, created_time, deleted) VALUES (?, ?, ?, false)";

    private static final String BATCH_INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (user_id, role_id, created_time, deleted) VALUES (?, ?, ?, false)";

    private static final String DELETE_BY_USER_AND_ROLE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE user_id = ? AND role_id = ? AND deleted = false";

    private static final String DELETE_BY_USER_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE user_id = ? AND deleted = false";

    private static final String DELETE_BY_ROLE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE role_id = ? AND deleted = false";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME +
            " WHERE user_id = ? AND role_id = ? AND deleted = false";

    public SYSUserRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 插入用户角色关联
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 插入后的主键ID
     */
    public Long insert(Long userId, Long roleId) {
        // 检查是否已存在
        if (exists(userId, roleId)) {
            throw new DataException("user role association already exists.");
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, userId);
            ps.setLong(2, roleId);
            ps.setTimestamp(3, Timestamp.from(ZonedDateTime.now().toInstant()));
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    /**
     * 删除用户角色关联（软删除）
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int deleteByUserIdAndRoleId(Long userId, Long roleId) {
        return jdbcTemplate.update(DELETE_BY_USER_AND_ROLE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                userId,
                roleId
        );
    }

    /**
     * 删除用户的所有角色关联（软删除）
     *
     * @param userId 用户ID
     * @return 删除的行数
     */
    public int deleteByUserId(Long userId) {
        return jdbcTemplate.update(DELETE_BY_USER_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                userId
        );
    }

    /**
     * 删除角色的所有用户关联（软删除）
     *
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int deleteByRoleId(Long roleId) {
        return jdbcTemplate.update(DELETE_BY_ROLE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                roleId
        );
    }

    /**
     * 判断用户是否拥有指定角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 是否存在关联
     */
    public boolean exists(Long userId, Long roleId) {
        Integer count = jdbcTemplate.queryForObject(EXISTS_SQL, Integer.class, userId, roleId);
        return count != null && count > 0;
    }
}