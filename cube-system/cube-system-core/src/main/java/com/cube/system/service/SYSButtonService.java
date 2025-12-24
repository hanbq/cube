package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.system.entity.SYSButton;
import com.cube.system.dao.SYSButtonDao;
import com.cube.system.dao.SYSButtonRoleDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 按钮Service
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSButtonService {

    private final SYSButtonDao buttonDao;
    private final SYSButtonRoleDao buttonRoleDao;

    public SYSButtonService(SYSButtonDao buttonDao, SYSButtonRoleDao buttonRoleDao) {
        this.buttonDao = buttonDao;
        this.buttonRoleDao = buttonRoleDao;
    }

    /**
     * 创建按钮
     *
     * @param button 按钮对象
     * @return 创建后的按钮ID
     */
    public Long createButton(SYSButton button) {
        // 验证按钮名是否已存在
        if (button.getButtonName() != null && buttonDao.findByButtonName(button.getButtonName()).isPresent()) {
            throw new DataException("Button name already exists: " + button.getButtonName());
        }
        return buttonDao.insert(button);
    }

    /**
     * 更新按钮
     *
     * @param button 按钮对象
     * @return 是否更新成功
     */
    public boolean updateButton(SYSButton button) {
        return buttonDao.update(button) > 0;
    }

    /**
     * 删除按钮（软删除）
     *
     * @param buttonId 按钮ID
     * @return 是否删除成功
     */
    public boolean deleteButton(Long buttonId) {
        return buttonDao.softDeleteById(buttonId) > 0;
    }

    /**
     * 根据ID查询按钮
     *
     * @param buttonId 按钮ID
     * @return 按钮对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSButton> getButtonById(Long buttonId) {
        return buttonDao.findById(buttonId);
    }

    /**
     * 根据按钮名查询按钮
     *
     * @param buttonName 按钮名
     * @return 按钮对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSButton> getButtonByName(String buttonName) {
        return buttonDao.findByButtonName(buttonName);
    }

    /**
     * 查询所有按钮
     *
     * @return 按钮列表
     */
    @Transactional(readOnly = true)
    public List<SYSButton> getAllButtons() {
        return buttonDao.findAll();
    }

    /**
     * 根据角色ID查询按钮列表
     *
     * @param roleId 角色ID
     * @return 按钮列表
     */
    @Transactional(readOnly = true)
    public List<SYSButton> getButtonsByRoleId(Long roleId) {
        return buttonDao.findByRoleId(roleId);
    }

    /**
     * 统计按钮数量
     *
     * @return 按钮总数
     */
    @Transactional(readOnly = true)
    public long countButtons() {
        return buttonDao.count();
    }

    /**
     * 为角色分配按钮
     *
     * @param buttonId 按钮ID
     * @param roleId 角色ID
     * @return 是否分配成功
     */
    public boolean assignButtonToRole(Long buttonId, Long roleId) {
        return buttonRoleDao.insert(buttonId, roleId) != null;
    }

    /**
     * 移除角色的按钮
     *
     * @param buttonId 按钮ID
     * @param roleId 角色ID
     * @return 是否移除成功
     */
    public boolean removeButtonFromRole(Long buttonId, Long roleId) {
        return buttonRoleDao.deleteByButtonIdAndRoleId(buttonId, roleId) > 0;
    }
}