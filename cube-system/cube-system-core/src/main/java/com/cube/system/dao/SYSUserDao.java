package com.cube.system.dao;

import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSUser;
import com.cube.system.param.SYSUserParam;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
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

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (user_name, password, description, email, status, is_super_admin, created_time, created_by, updated_time, updated_by, deleted) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME +
            " SET user_name = ?, password = ?, description = ?, email = ?, status = ?, is_super_admin = ?, " +
            " updated_time = ?, updated_by = ? " +
            " WHERE user_id = ? AND deleted = false";

    private static final String DELETE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE user_id = ?";

    private static final String SOFT_DELETE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? WHERE user_id = ?";

    private static final String FIND_BY_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE user_id = ? AND deleted = false";

    private static final String FIND_ALL_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE deleted = false ORDER BY user_id";

    private static final String FIND_ALL_INCLUDE_DELETED_SQL =
            "SELECT * FROM " + TABLE_NAME + " ORDER BY user_id";

    private static final String FIND_BY_USERNAME_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE user_name = ? AND deleted = false";

    private static final String FIND_BY_EMAIL_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE email = ? AND deleted = false";

    private static final String FIND_BY_STATUS_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE status = ? AND deleted = false ORDER BY user_id";

    private static final String UPDATE_STATUS_SQL =
            "UPDATE " + TABLE_NAME + " SET status = ?, updated_time = ? WHERE user_id = ? AND deleted = false";

    private static final String UPDATE_PASSWORD_SQL =
            "UPDATE " + TABLE_NAME + " SET password = ?, updated_time = ? WHERE user_id = ? AND deleted = false";

    private static final String UPDATE_SUPER_ADMIN_SQL =
            "UPDATE " + TABLE_NAME + " SET is_super_admin = ?, updated_time = ? WHERE user_id = ? AND deleted = false";

    private static final String FIND_SUPER_ADMINS_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE is_super_admin = true AND deleted = false ORDER BY user_id";

    private static final String COUNT_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME + " WHERE deleted = false";

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
        user.setUserName(rs.getString("user_name"));
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
            ps.setString(1, entity.getUserName());
            ps.setString(2, entity.getPassword());
            ps.setString(3, entity.getDescription());
            ps.setString(4, entity.getEmail());
            ps.setString(5, entity.getStatus() != null ? entity.getStatus() : "ACTIVE");
            ps.setBoolean(6, entity.getIsSuperAdmin() != null ? entity.getIsSuperAdmin() : false); // is_super_admin

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
                entity.getUserName(),
                entity.getPassword(),
                entity.getDescription(),
                entity.getEmail(),
                entity.getStatus(),
                entity.getIsSuperAdmin() != null ? entity.getIsSuperAdmin() : false, // is_super_admin
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                entity.getUserId()
        );
    }

    /**
     * 根据ID删除用户（物理删除）
     *
     * @param id 用户ID
     * @return 删除的行数
     */
    public int deleteById(Long id) {
        return jdbcTemplate.update(DELETE_SQL, id);
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
     * 查询所有用户（包含已删除）
     *
     * @return 用户列表
     */
    public List<SYSUser> findAllIncludeDeleted() {
        return jdbcTemplate.query(FIND_ALL_INCLUDE_DELETED_SQL, rowMapper);
    }

    /**
     * 分页查询用户
     *
     * @param pageRequest 分页请求
     * @return 分页结果
     */
    public PageResult<SYSUser> findPage(PageRequest pageRequest) {
        return pageHelper.queryForPage(FIND_ALL_SQL, pageRequest, rowMapper);
    }

    /**
     * 统计用户数量
     *
     * @return 用户总数
     */
    public long count() {
        Long count = jdbcTemplate.queryForObject(COUNT_SQL, Long.class);
        return count != null ? count : 0L;
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
     * 根据状态查询用户列表
     *
     * @param status 状态
     * @return 用户列表
     */
    public List<SYSUser> findByStatus(String status) {
        return jdbcTemplate.query(FIND_BY_STATUS_SQL, rowMapper, status);
    }

    /**
     * 更新用户状态
     *
     * @param userId 用户ID
     * @param status 新状态
     * @return 更新的行数
     */
    public int updateStatus(Long userId, String status) {
        return jdbcTemplate.update(UPDATE_STATUS_SQL,
                status,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                userId
        );
    }

    /**
     * 更新用户密码
     *
     * @param userId 用户ID
     * @param newPassword 新密码
     * @return 更新的行数
     */
    public int updatePassword(Long userId, String newPassword) {
        return jdbcTemplate.update(UPDATE_PASSWORD_SQL,
                newPassword,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                userId
        );
    }

    /**
     * 更新用户超级管理员状态
     *
     * @param userId 用户ID
     * @param isSuperAdmin 是否是超级管理员
     * @return 更新的行数
     */
    public int updateSuperAdmin(Long userId, Boolean isSuperAdmin) {
        return jdbcTemplate.update(UPDATE_SUPER_ADMIN_SQL,
                isSuperAdmin,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                userId
        );
    }

    /**
     * 查询所有超级管理员
     *
     * @return 超级管理员列表
     */
    public List<SYSUser> findSuperAdmins() {
        return jdbcTemplate.query(FIND_SUPER_ADMINS_SQL, rowMapper);
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
     * 根据参数动态查询用户列表
     * 如果参数为空，则不作为查询条件
     * 用户名忽略大小写查询
     *
     * @param param 查询参数
     * @return 用户列表
     */
    public List<SYSUser> findByParam(SYSUserParam param) {
        if (param == null) {
            return findAll();
        }

        StringBuilder sql = new StringBuilder("SELECT * FROM " + TABLE_NAME + " WHERE deleted = false");
        List<Object> params = new ArrayList<>();

        // 如果userId不为空，添加userId条件
        if (param.getUserId() != null) {
            sql.append(" AND user_id = ?");
            params.add(param.getUserId());
        }

        // 如果userName不为空，添加userName条件（忽略大小写）
        if (param.getUserName() != null && !param.getUserName().trim().isEmpty()) {
            sql.append(" AND LOWER(user_name) LIKE LOWER(?)");
            params.add("%" + param.getUserName() + "%");
        }

        // 如果status不为空，添加status条件
        if (param.getStatus() != null && !param.getStatus().trim().isEmpty()) {
            sql.append(" AND status = ?");
            params.add(param.getStatus());
        }

        // 如果isSuperAdmin不为空，添加isSuperAdmin条件
        if (param.getIsSuperAdmin() != null) {
            sql.append(" AND is_super_admin = ?");
            params.add(param.getIsSuperAdmin());
        }

        sql.append(" ORDER BY user_id");

        return jdbcTemplate.query(sql.toString(), rowMapper, params.toArray());
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
        StringBuilder sql = new StringBuilder("SELECT * FROM " + TABLE_NAME + " WHERE deleted = false");
        List<Object> params = new ArrayList<>();

        // 如果userId不为空，添加userId条件
        if (param != null && param.getUserId() != null) {
            sql.append(" AND user_id = ?");
            params.add(param.getUserId());
        }

        // 如果userName不为空，添加userName条件（忽略大小写）
        if (param != null && param.getUserName() != null && !param.getUserName().trim().isEmpty()) {
            sql.append(" AND LOWER(user_name) LIKE LOWER(?)");
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
}
