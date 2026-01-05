import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../services/roleService';
import type { SYSRole, RoleFormData, SYSRoleParam } from '../types/role';

export const useRole = () => {
  const [roles, setRoles] = useState<SYSRole[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 加载角色列表
  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getAllRoles();
      setRoles(data);
      setTotal(data.length);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load roles:', err);
      setRoles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索角色（分页）
  const searchRoles = useCallback(async (param: SYSRoleParam) => {
    setLoading(true);
    setError(null);
    try {
      const pageResult = await roleService.searchRoles(param);
      setRoles(pageResult.records);
      setTotal(pageResult.total);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to search roles:', err);
      setRoles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建角色
  const createRole = useCallback(async (role: RoleFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newRole = await roleService.createRole(role);
      await loadRoles();
      return newRole;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to create role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRoles]);

  // 更新角色
  const updateRole = useCallback(async (roleId: number, role: RoleFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedRole = await roleService.updateRole(roleId, role);
      await loadRoles();
      return updatedRole;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRoles]);

  // 删除角色
  const deleteRole = useCallback(async (roleId: number) => {
    setLoading(true);
    setError(null);
    try {
      await roleService.deleteRole(roleId);
      await loadRoles();
    } catch (err) {
      setError(err as Error);
      console.error('Failed to delete role:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRoles]);

  // 批量删除角色
  const batchDeleteRoles = useCallback(async (roleIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await roleService.batchDeleteRoles(roleIds);
      await loadRoles();
    } catch (err) {
      setError(err as Error);
      console.error('Failed to batch delete roles:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRoles]);

  // 初始加载
  useEffect(() => {
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    roles,
    total,
    loading,
    error,
    loadRoles,
    searchRoles,
    createRole,
    updateRole,
    deleteRole,
    batchDeleteRoles,
  };
};
