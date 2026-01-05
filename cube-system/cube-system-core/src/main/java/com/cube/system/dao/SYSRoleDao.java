package com.cube.system.dao;

import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSRole;
import com.cube.system.param.SYSRoleParam;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.ArrayList;
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
    private final JdbcPageHelper pageHelper;

    private static final String QUERY = "SELECT * FROM ";
    private static final String TABLE_NAME = "CUBE_SYS_ROLE";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (role_name, description, created_time, created_by, updated_time, updated_by, deleted) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME +
            " SET role_name = ?, description = ?, updated_time = ?, updated_by = ? " +
            " WHERE role_id = ? AND deleted = false";

    private static final String SOFT_DELETE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? WHERE role_id = ? AND deleted = false";

    private static final String FIND_BY_ID_SQL =
            QUERY + TABLE_NAME + " WHERE role_id = ? AND deleted = false";


    private static final String FIND_BY_ROLE_NAME_SQL =
            QUERY + TABLE_NAME + " WHERE role_name = ? AND deleted = false";

    private static final String FIND_ALL_SQL =
            QUERY + TABLE_NAME + " WHERE deleted = false ORDER BY role_id";

    private static final String FIND_BY_USER_ID_SQL =
            "SELECT r.* FROM " + TABLE_NAME + " r " +
            "INNER JOIN CUBE_SYS_USER_ROLE ur ON r.role_id = ur.role_id " +
            "WHERE ur.user_id = ? AND r.deleted = false AND ur.deleted = false " +
            "ORDER BY r.role_id";

    public SYSRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.pageHelper = new JdbcPageHelper(jdbcTemplate);
    }

    /**
     * RowMapper for SYSRole
     */
    private final RowMapper<SYSRole> rowMapper = (rs, rowNum) -> {
        SYSRole role = new SYSRole();
        role.setRoleId(rs.getLong("role_id"));
        role.setRoleName(rs.getString("role_name"));
        role.setDescription(rs.getString("description"));

        // BaseBean fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            role.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        role.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            role.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        role.setUpdatedBy(rs.getString("updated_by"));
        role.setDeleted(rs.getBoolean("deleted"));

        return role;
    };

    /**
     * 插入角色
     *
     * @param role 角色对象
     */
    public void insert(SYSRole role) {
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, role.getRoleName());
            ps.setString(2, role.getDescription());

            // BaseBean fields
            ZonedDateTime now = ZonedDateTime.now();
            ps.setTimestamp(3, Timestamp.from(now.toInstant())); // created_time
            ps.setString(4, role.getCreatedBy());
            ps.setTimestamp(5, Timestamp.from(now.toInstant())); // updated_time
            ps.setString(6, role.getUpdatedBy());
            ps.setBoolean(7, false); // deleted

            return ps;
        });
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
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                role.getUpdatedBy(),
                role.getRoleId()
        );
    }

    /**
     * 根据ID软删除角色
     *
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int softDeleteById(Long roleId) {
        return jdbcTemplate.update(SOFT_DELETE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                roleId
        );
    }

    /**
     * 批量删除角色（软删除）
     *
     * @param roleIds 角色ID列表
     * @return 删除的行数
     */
    public int deleteByIds(List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return 0;
        }

        int totalDeleted = 0;
        for (Long roleId : roleIds) {
            totalDeleted += softDeleteById(roleId);
        }
        return totalDeleted;
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
     * 根据用户ID查询角色列表（通过JOIN查询，避免N+1问题）
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    public List<SYSRole> findByUserId(Long userId) {
        return jdbcTemplate.query(FIND_BY_USER_ID_SQL, rowMapper, userId);
    }

    /**
     * 根据参数动态查询角色列表（分页）
     * 如果参数为空，则不作为查询条件
     * 角色名称忽略大小写查询
     *
     * @param param 查询参数
     * @param pageRequest 分页参数
     * @return 分页结果
     */
    public PageResult<SYSRole> findByParamWithPage(SYSRoleParam param, PageRequest pageRequest) {
        StringBuilder sql = new StringBuilder(QUERY + TABLE_NAME + " WHERE deleted = false");
        List<Object> params = new ArrayList<>();

        // 如果roleId不为空，添加roleId条件
        if (param != null && param.getRoleId() != null) {
            sql.append(" AND role_id = ?");
            params.add(param.getRoleId());
        }

        // 如果roleName不为空，添加roleName条件（忽略大小写）
        if (param != null && param.getRoleName() != null && !param.getRoleName().trim().isEmpty()) {
            sql.append(" AND LOWER(role_name) LIKE LOWER(?)");
            params.add("%" + param.getRoleName() + "%");
        }

        sql.append(" ORDER BY role_id");

        // 使用pageHelper进行分页查询
        return pageHelper.queryForPage(sql.toString(), pageRequest, rowMapper, params.toArray());
    }
}
