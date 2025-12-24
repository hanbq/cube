package com.cube.system.dao;

import com.cube.system.entity.SYSButton;
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
 * 按钮DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSButtonDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String SELECT_FROM = "SELECT * FROM ";

    private static final String TABLE_NAME = "CUBE_SYS_BUTTON";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (button_name, description, created_time, created_by, updated_time, updated_by, deleted) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME +
            " SET button_name = ?, description = ?, updated_time = ?, updated_by = ? " +
            " WHERE button_id = ? AND deleted = false";

    private static final String SOFT_DELETE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? WHERE button_id = ?";

    private static final String FIND_BY_ID_SQL =
            SELECT_FROM + TABLE_NAME + " WHERE button_id = ? AND deleted = false";

    private static final String FIND_ALL_SQL =
            SELECT_FROM + TABLE_NAME + " WHERE deleted = false ORDER BY button_id";

    private static final String FIND_BY_NAME_SQL =
            SELECT_FROM + TABLE_NAME + " WHERE button_name = ? AND deleted = false";

    private static final String FIND_BY_ROLE_ID_SQL =
            "SELECT b.* FROM " + TABLE_NAME + " b " +
            "INNER JOIN CUBE_SYS_BUTTON_ROLE br ON b.button_id = br.button_id " +
            "WHERE br.role_id = ? AND br.deleted = false AND b.deleted = false " +
            "ORDER BY b.button_id";

    private static final String COUNT_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME + " WHERE deleted = false";

    public SYSButtonDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * RowMapper for SYSButton
     */
    private final RowMapper<SYSButton> rowMapper = (rs, rowNum) -> {
        SYSButton button = new SYSButton();
        button.setButtonId(rs.getLong("button_id"));
        button.setButtonName(rs.getString("button_name"));
        button.setDescription(rs.getString("description"));

        // BaseBean fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            button.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        button.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            button.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        button.setUpdatedBy(rs.getString("updated_by"));
        button.setDeleted(rs.getBoolean("deleted"));

        return button;
    };

    /**
     * 插入按钮
     *
     * @param entity 按钮对象
     * @return 插入后的主键ID
     */
    public Long insert(SYSButton entity) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, entity.getButtonName());
            ps.setString(2, entity.getDescription());

            // BaseBean fields
            ZonedDateTime now = ZonedDateTime.now();
            ps.setTimestamp(3, Timestamp.from(now.toInstant())); // created_time
            ps.setString(4, entity.getCreatedBy());
            ps.setTimestamp(5, Timestamp.from(now.toInstant())); // updated_time
            ps.setString(6, entity.getUpdatedBy());
            ps.setBoolean(7, false); // deleted

            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    /**
     * 更新按钮
     *
     * @param entity 按钮对象
     * @return 更新的行数
     */
    public int update(SYSButton entity) {
        return jdbcTemplate.update(UPDATE_SQL,
                entity.getButtonName(),
                entity.getDescription(),
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                entity.getButtonId()
        );
    }

    /**
     * 根据ID删除按钮（软删除）
     *
     * @param id 按钮ID
     * @return 删除的行数
     */
    public int softDeleteById(Long id) {
        return jdbcTemplate.update(SOFT_DELETE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                id
        );
    }

    /**
     * 根据ID查询按钮
     *
     * @param id 按钮ID
     * @return 按钮对象
     */
    public Optional<SYSButton> findById(Long id) {
        List<SYSButton> results = jdbcTemplate.query(FIND_BY_ID_SQL, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 查询所有按钮
     *
     * @return 按钮列表
     */
    public List<SYSButton> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 根据按钮名查询按钮
     *
     * @param buttonName 按钮名
     * @return 按钮对象
     */
    public Optional<SYSButton> findByButtonName(String buttonName) {
        List<SYSButton> results = jdbcTemplate.query(FIND_BY_NAME_SQL, rowMapper, buttonName);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 根据角色ID查询按钮列表
     *
     * @param roleId 角色ID
     * @return 按钮列表
     */
    public List<SYSButton> findByRoleId(Long roleId) {
        return jdbcTemplate.query(FIND_BY_ROLE_ID_SQL, rowMapper, roleId);
    }

    /**
     * 统计按钮数量
     *
     * @return 按钮总数
     */
    public long count() {
        Long count = jdbcTemplate.queryForObject(COUNT_SQL, Long.class);
        return count != null ? count : 0L;
    }
}
