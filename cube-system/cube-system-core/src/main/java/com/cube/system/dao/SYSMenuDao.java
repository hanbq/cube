package com.cube.system.dao;

import com.cube.system.entity.SYSMenu;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 菜单DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSMenuDao {

    private static final Logger LOG = LoggerFactory.getLogger(SYSMenuDao.class);

    private final JdbcTemplate jdbcTemplate;

    private static final String TABLE_NAME = "CUBE_SYS_MENU";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (menu_name, menu_name_eng, path, icon_cls, parent_id, sort, component, created_time, created_by, updated_time, updated_by, deleted) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME +
            " SET menu_name = ?, menu_name_eng = ?, path = ?, icon_cls = ?, parent_id = ?, sort = ?, component = ?, " +
            " updated_time = ?, updated_by = ? " +
            " WHERE menu_id = ? AND deleted = false";

    private static final String SOFT_DELETE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? WHERE menu_id = ?";

    private static final String FIND_BY_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE menu_id = ? AND deleted = false";

    private static final String FIND_ALL_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE deleted = false ORDER BY sort, menu_id";

    private static final String FIND_BY_PARENT_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE parent_id = ? AND deleted = false ORDER BY sort, menu_id";

    private static final String FIND_ROOT_MENUS_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE parent_id IS NULL AND deleted = false ORDER BY sort, menu_id";

    private static final String FIND_BY_ROLE_ID_SQL =
            "SELECT m.* FROM " + TABLE_NAME + " m " +
            "INNER JOIN CUBE_SYS_MENU_ROLE mr ON m.menu_id = mr.menu_id " +
            "WHERE mr.role_id = ? AND mr.deleted = false AND m.deleted = false " +
            "ORDER BY m.sort, m.menu_id";

    private static final String COUNT_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME + " WHERE deleted = false";

    public SYSMenuDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * RowMapper for SYSMenu
     */
    private final RowMapper<SYSMenu> rowMapper = (rs, rowNum) -> {
        SYSMenu menu = new SYSMenu();
        menu.setMenuId(rs.getLong("menu_id"));
        menu.setMenuName(rs.getString("menu_name"));
        menu.setMenuNameEng(rs.getString("menu_name_eng"));
        menu.setPath(rs.getString("path"));
        menu.setIconCls(rs.getString("icon_cls"));
        Long parentId = rs.getLong("parent_id");
        if (!rs.wasNull()) {
            menu.setParentId(parentId);
        }
        menu.setSort(rs.getInt("sort"));
        menu.setComponent(rs.getString("component"));

        // BaseBean fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            menu.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        menu.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            menu.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        menu.setUpdatedBy(rs.getString("updated_by"));
        menu.setDeleted(rs.getBoolean("deleted"));

        return menu;
    };

    /**
     * 插入菜单
     *
     * @param entity 菜单对象
     * @return 插入后的主键ID
     */
    public Long insert(SYSMenu entity) {
        LOG.info("=== SYSMenuDao.insert called ===");
        LOG.info("Inserting menu: {}", entity.getMenuName());
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            // Specify only the menu_id column to be returned (PostgreSQL specific)
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"menu_id"});
            ps.setString(1, entity.getMenuName());
            ps.setString(2, entity.getMenuNameEng());
            ps.setString(3, entity.getPath());
            ps.setString(4, entity.getIconCls());
            if (entity.getParentId() != null) {
                ps.setLong(5, entity.getParentId());
            } else {
                ps.setNull(5, java.sql.Types.BIGINT);
            }
            ps.setInt(6, entity.getSort() != null ? entity.getSort() : 0);
            ps.setString(7, entity.getComponent());

            // BaseBean fields
            ZonedDateTime now = ZonedDateTime.now();
            ps.setTimestamp(8, Timestamp.from(now.toInstant())); // created_time
            ps.setString(9, entity.getCreatedBy());
            ps.setTimestamp(10, Timestamp.from(now.toInstant())); // updated_time
            ps.setString(11, entity.getUpdatedBy());
            ps.setBoolean(12, false); // deleted

            return ps;
        }, keyHolder);

        // Now we can safely use getKey() since only menu_id is returned
        Number key = keyHolder.getKey();
        Long menuId = key != null ? key.longValue() : null;
        LOG.info("Insert completed. Generated menu_id: {}", menuId);
        return menuId;
    }

    /**
     * 更新菜单
     *
     * @param entity 菜单对象
     * @return 更新的行数
     */
    public int update(SYSMenu entity) {
        return jdbcTemplate.update(UPDATE_SQL,
                entity.getMenuName(),
                entity.getMenuNameEng(),
                entity.getPath(),
                entity.getIconCls(),
                entity.getParentId(),
                entity.getSort(),
                entity.getComponent(),
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                entity.getMenuId()
        );
    }

    /**
     * 根据ID删除菜单（软删除）
     *
     * @param id 菜单ID
     * @return 删除的行数
     */
    public int softDeleteById(Long id) {
        return jdbcTemplate.update(SOFT_DELETE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                id
        );
    }

    /**
     * 根据ID查询菜单
     *
     * @param id 菜单ID
     * @return 菜单对象
     */
    public Optional<SYSMenu> findById(Long id) {
        List<SYSMenu> results = jdbcTemplate.query(FIND_BY_ID_SQL, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * 查询所有菜单
     *
     * @return 菜单列表
     */
    public List<SYSMenu> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 根据父菜单ID查询子菜单列表
     *
     * @param parentId 父菜单ID
     * @return 子菜单列表
     */
    public List<SYSMenu> findByParentId(Long parentId) {
        return jdbcTemplate.query(FIND_BY_PARENT_ID_SQL, rowMapper, parentId);
    }

    /**
     * 查询根菜单列表（parent_id为NULL）
     *
     * @return 根菜单列表
     */
    public List<SYSMenu> findRootMenus() {
        return jdbcTemplate.query(FIND_ROOT_MENUS_SQL, rowMapper);
    }

    /**
     * 根据角色ID查询菜单列表
     *
     * @param roleId 角色ID
     * @return 菜单列表
     */
    public List<SYSMenu> findByRoleId(Long roleId) {
        return jdbcTemplate.query(FIND_BY_ROLE_ID_SQL, rowMapper, roleId);
    }

    /**
     * 统计菜单数量
     *
     * @return 菜单总数
     */
    public long count() {
        Long count = jdbcTemplate.queryForObject(COUNT_SQL, Long.class);
        return count != null ? count : 0L;
    }
}
