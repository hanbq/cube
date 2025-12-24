package com.cube.system.dao;

import com.cube.system.entity.SYSRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

/**
 * 角色DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSRoleDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String TABLE_NAME = "CUBE_SYS_ROLE";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME + " (role_name, description) VALUES (?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME + " SET role_name = ?, description = ? WHERE role_id = ?";

    private static final String DELETE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE role_id = ?";

    private static final String FIND_BY_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE role_id = ?";

    private static final String FIND_BY_ROLE_NAME_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE role_name = ?";

    private static final String FIND_ALL_SQL =
            "SELECT * FROM " + TABLE_NAME + " ORDER BY role_id";

    private static final String FIND_BY_USER_ID_SQL =
            "SELECT r.* FROM " + TABLE_NAME + " r " +
            "INNER JOIN CUBE_SYS_USER_ROLE ur ON r.role_id = ur.role_id " +
            "WHERE ur.user_id = ? AND ur.deleted = false " +
            "ORDER BY r.role_id";

    private static final String COUNT_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME;

    public SYSRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * RowMapper for SYSRole
     */
    private final RowMapper<SYSRole> rowMapper = (rs, rowNum) -> {
        SYSRole role = new SYSRole();
        role.setRoleId(rs.getLong("role_id"));
        role.setRoleName(rs.getString("role_name"));
        role.setDescription(rs.getString("description"));
        return role;
    };

    /**
     * 插入角色
     *
     * @param role 角色对象
     * @return 插入后的主键ID
     */
    public Long insert(SYSRole role) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, role.getRoleName());
            ps.setString(2, role.getDescription());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    /**
     * 更新角色
     *
     * @param role 角色对象
     * @return 更新的行数
     */
    public int update(SYSRole role) {
        return jdbcTemplate.update(UPDATE_SQL,
                role.getRoleName(),
                role.getDescription(),
                role.getRoleId()
        );
    }

    /**
     * 根据ID删除角色
     *
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int deleteById(Long roleId) {
        return jdbcTemplate.update(DELETE_SQL, roleId);
    }

    /**
     * 根据ID查询角色
     *
     * @param roleId 角色ID
     * @return 角色对象
     */
    public Optional<SYSRole> findById(Long roleId) {
        List<SYSRole> results = jdbcTemplate.query(FIND_BY_ID_SQL, rowMapper, roleId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 根据角色名查询角色
     *
     * @param roleName 角色名
     * @return 角色对象
     */
    public Optional<SYSRole> findByRoleName(String roleName) {
        List<SYSRole> results = jdbcTemplate.query(FIND_BY_ROLE_NAME_SQL, rowMapper, roleName);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    public List<SYSRole> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 根据用户ID查询角色列表
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    public List<SYSRole> findByUserId(Long userId) {
        return jdbcTemplate.query(FIND_BY_USER_ID_SQL, rowMapper, userId);
    }

    /**
     * 统计角色数量
     *
     * @return 角色总数
     */
    public long count() {
        Long count = jdbcTemplate.queryForObject(COUNT_SQL, Long.class);
        return count != null ? count : 0L;
    }
}
