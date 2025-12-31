package com.cube.system.dao;

import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSUser;
import com.cube.system.param.SYSUserParam;
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
 * 用户DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSUserDao {

    private final JdbcTemplate jdbcTemplate;
    private final JdbcPageHelper pageHelper;

    private static final String TABLE_NAME = "CUBE_SYS_USER";
    private static final String QUERY = "SELECT * FROM ";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (username, password, description, email, status, is_super_admin, created_time, created_by, updated_time, updated_by, deleted) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME +
            " SET username = ?, password = ?, description = ?, email = ?, status = ?," +
            " updated_time = ?, updated_by = ? " +
            " WHERE user_id = ? AND deleted = false";

    private static final String SOFT_DELETE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? WHERE user_id = ?";

    private static final String FIND_BY_ID_SQL =
            QUERY + TABLE_NAME + " WHERE user_id = ? AND deleted = false";

    private static final String FIND_ALL_SQL =
            QUERY + TABLE_NAME + " WHERE deleted = false ORDER BY user_id";

    private static final String FIND_BY_USERNAME_SQL =
            QUERY + TABLE_NAME + " WHERE username = ? AND deleted = false";

    private static final String FIND_BY_EMAIL_SQL =
            QUERY + TABLE_NAME + " WHERE email = ? AND deleted = false";

    private static final String FIND_BY_ROLE_ID_SQL =
            "SELECT u.* FROM " + TABLE_NAME + " u " +
            "INNER JOIN CUBE_SYS_USER_ROLE ur ON u.user_id = ur.user_id " +
            "WHERE ur.role_id = ? AND u.deleted = false AND ur.deleted = false " +
            "ORDER BY u.user_id";

    public SYSUserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.pageHelper = new JdbcPageHelper(jdbcTemplate);
    }

    /**
     * RowMapper for SYSUser
     */
    private final RowMapper<SYSUser> rowMapper = (rs, rowNum) -> {
        SYSUser user = new SYSUser();
        user.setUserId(rs.getLong("user_id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setDescription(rs.getString("description"));
        user.setEmail(rs.getString("email"));
        user.setStatus(rs.getString("status"));
        user.setIsSuperAdmin(rs.getBoolean("is_super_admin"));

        // BaseBean fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            user.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        user.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            user.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        user.setUpdatedBy(rs.getString("updated_by"));
        user.setDeleted(rs.getBoolean("deleted"));

        return user;
    };

    /**
     * 插入用户
     *
     * @param entity 用户对象
     */
    public void insert(SYSUser entity) {
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, entity.getUsername());
            ps.setString(2, entity.getPassword());
            ps.setString(3, entity.getDescription());
            ps.setString(4, entity.getEmail());
            ps.setString(5, entity.getStatus() != null ? entity.getStatus() : "ACTIVE");
            ps.setBoolean(6, entity.getIsSuperAdmin() != null && entity.getIsSuperAdmin()); // is_super_admin

            // BaseBean fields
            ZonedDateTime now = ZonedDateTime.now();
            ps.setTimestamp(7, Timestamp.from(now.toInstant())); // created_time
            ps.setString(8, entity.getCreatedBy());
            ps.setTimestamp(9, Timestamp.from(now.toInstant())); // updated_time
            ps.setString(10, entity.getUpdatedBy());
            ps.setBoolean(11, false); // deleted

            return ps;
        });
    }

    /**
     * 更新用户
     *
     * @param entity 用户对象
     * @return 更新的行数
     */
    public int update(SYSUser entity) {
        return jdbcTemplate.update(UPDATE_SQL,
                entity.getUsername(),
                entity.getPassword(),
                entity.getDescription(),
                entity.getEmail(),
                entity.getStatus(),
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                entity.getUserId()
        );
    }

    /**
     * 根据ID删除用户（软删除）
     *
     * @param id 用户ID
     * @return 删除的行数
     */
    public int softDeleteById(Long id) {
        return jdbcTemplate.update(SOFT_DELETE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                id
        );
    }

    /**
     * 根据ID查询用户
     *
     * @param id 用户ID
     * @return 用户对象
     */
    public Optional<SYSUser> findById(Long id) {
        List<SYSUser> results = jdbcTemplate.query(FIND_BY_ID_SQL, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 查询所有用户（不包含已删除）
     *
     * @return 用户列表
     */
    public List<SYSUser> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 根据用户名查询用户
     *
     * @param userName 用户名
     * @return 用户对象
     */
    public Optional<SYSUser> findByUserName(String userName) {
        List<SYSUser> results = jdbcTemplate.query(FIND_BY_USERNAME_SQL, rowMapper, userName);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 根据邮箱查询用户
     *
     * @param email 邮箱
     * @return 用户对象
     */
    public Optional<SYSUser> findByEmail(String email) {
        List<SYSUser> results = jdbcTemplate.query(FIND_BY_EMAIL_SQL, rowMapper, email);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 批量删除用户（软删除）
     *
     * @param userIds 用户ID列表
     * @return 删除的行数
     */
    public int deleteByIds(List<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return 0;
        }

        int totalDeleted = 0;
        for (Long userId : userIds) {
            totalDeleted += softDeleteById(userId);
        }
        return totalDeleted;
    }

    /**
     * 根据参数动态查询用户列表（分页）
     * 如果参数为空，则不作为查询条件
     * 用户名忽略大小写查询
     *
     * @param param 查询参数
     * @param pageRequest 分页参数
     * @return 分页结果
     */
    public PageResult<SYSUser> findByParamWithPage(SYSUserParam param, PageRequest pageRequest) {
        StringBuilder sql = new StringBuilder(QUERY + TABLE_NAME + " WHERE deleted = false");
        List<Object> params = new ArrayList<>();

        // 如果userId不为空，添加userId条件
        if (param != null && param.getUserId() != null) {
            sql.append(" AND user_id = ?");
            params.add(param.getUserId());
        }

        // 如果userName不为空，添加userName条件（忽略大小写）
        if (param != null && param.getUserName() != null && !param.getUserName().trim().isEmpty()) {
            sql.append(" AND LOWER(username) LIKE LOWER(?)");
            params.add("%" + param.getUserName() + "%");
        }

        // 如果status不为空，添加status条件
        if (param != null && param.getStatus() != null && !param.getStatus().trim().isEmpty()) {
            sql.append(" AND status = ?");
            params.add(param.getStatus());
        }

        // 如果isSuperAdmin不为空，添加isSuperAdmin条件
        if (param != null && param.getIsSuperAdmin() != null) {
            sql.append(" AND is_super_admin = ?");
            params.add(param.getIsSuperAdmin());
        }

        sql.append(" ORDER BY user_id");

        // 使用pageHelper进行分页查询
        return pageHelper.queryForPage(sql.toString(), pageRequest, rowMapper, params.toArray());
    }

    /**
     * 根据角色ID查询用户列表
     * 通过CUBE_SYS_USER_ROLE表关联查询
     *
     * @param roleId 角色ID
     * @return 用户列表
     */
    public List<SYSUser> findByRoleId(Long roleId) {
        return jdbcTemplate.query(FIND_BY_ROLE_ID_SQL, rowMapper, roleId);
    }
}
