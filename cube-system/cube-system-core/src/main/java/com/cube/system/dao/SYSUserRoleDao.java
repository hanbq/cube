package com.cube.system.dao;

import com.cube.common.exception.DataException;
import com.cube.system.entity.SYSUserRole;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;
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

    private static final String FIND_ALL_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE deleted = false ORDER BY id";

    private static final String FIND_BY_USER_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE user_id = ? AND deleted = false ORDER BY id";

    private static final String FIND_BY_ROLE_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE role_id = ? AND deleted = false ORDER BY id";

    private static final String PHYSICAL_DELETE_BY_USER_AND_ROLE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE user_id = ? AND role_id = ?";

    private static final String PHYSICAL_DELETE_BY_ID_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE id = ?";

    public SYSUserRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * RowMapper for SYSUserRole
     */
    private final RowMapper<SYSUserRole> rowMapper = (rs, rowNum) -> {
        SYSUserRole userRole = new SYSUserRole();
        userRole.setId(rs.getLong("id"));
        userRole.setUserId(rs.getLong("user_id"));
        userRole.setRoleId(rs.getLong("role_id"));

        // BaseBean fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            userRole.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        userRole.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            userRole.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        userRole.setUpdatedBy(rs.getString("updated_by"));
        userRole.setDeleted(rs.getBoolean("deleted"));

        return userRole;
    };

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

    /**
     * 查询所有用户角色关联
     *
     * @return 用户角色关联列表
     */
    public List<SYSUserRole> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 根据用户ID查询角色关联
     *
     * @param userId 用户ID
     * @return 用户角色关联列表
     */
    public List<SYSUserRole> findByUserId(Long userId) {
        return jdbcTemplate.query(FIND_BY_USER_ID_SQL, rowMapper, userId);
    }

    /**
     * 根据角色ID查询用户关联
     *
     * @param roleId 角色ID
     * @return 用户角色关联列表
     */
    public List<SYSUserRole> findByRoleId(Long roleId) {
        return jdbcTemplate.query(FIND_BY_ROLE_ID_SQL, rowMapper, roleId);
    }

    /**
     * 批量插入用户角色关联
     *
     * @param userRoles 用户角色关联列表（包含userId和roleId）
     * @return 插入的数量
     */
    public int batchInsert(List<SYSUserRole> userRoles) {
        if (userRoles == null || userRoles.isEmpty()) {
            return 0;
        }

        int[] results = jdbcTemplate.batchUpdate(BATCH_INSERT_SQL, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                SYSUserRole userRole = userRoles.get(i);
                ps.setLong(1, userRole.getUserId());
                ps.setLong(2, userRole.getRoleId());
                ps.setTimestamp(3, Timestamp.from(ZonedDateTime.now().toInstant()));
            }

            @Override
            public int getBatchSize() {
                return userRoles.size();
            }
        });

        int successCount = 0;
        for (int result : results) {
            if (result > 0) {
                successCount++;
            }
        }
        return successCount;
    }

    /**
     * 物理删除用户角色关联
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int physicalDeleteByUserIdAndRoleId(Long userId, Long roleId) {
        return jdbcTemplate.update(PHYSICAL_DELETE_BY_USER_AND_ROLE_SQL, userId, roleId);
    }

    /**
     * 批量物理删除用户角色关联
     *
     * @param ids ID列表
     * @return 删除的数量
     */
    public int physicalDeleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        int[] results = jdbcTemplate.batchUpdate(PHYSICAL_DELETE_BY_ID_SQL, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setLong(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
            }
        });

        int successCount = 0;
        for (int result : results) {
            if (result > 0) {
                successCount++;
            }
        }
        return successCount;
    }
}