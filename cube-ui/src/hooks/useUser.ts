import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import type { SYSUser, UserFormData, SYSUserParam } from '../types/user';

export const useUser = () => {
  const [users, setUsers] = useState<SYSUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 加载用户列表
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setTotal(data.length);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load users:', err);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索用户(分页)
  const searchUsers = useCallback(async (param: SYSUserParam) => {
    setLoading(true);
    setError(null);
    try {
      const pageResult = await userService.searchUsers(param);
      setUsers(pageResult.records);
      setTotal(pageResult.total);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to search users:', err);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建用户
  const createUser = useCallback(async (user: UserFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newUserId = await userService.createUser(user);
      await loadUsers();
      return newUserId;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to create user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  // 更新用户
  const updateUser = useCallback(async (userId: number, user: UserFormData) => {
    setLoading(true);
    setError(null);
    try {
      const success = await userService.updateUser(userId, user);
      await loadUsers();
      return success;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  // 删除用户
  const deleteUser = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError(err as Error);
      console.error('Failed to delete user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  // 批量删除用户
  const batchDeleteUsers = useCallback(async (userIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await userService.batchDeleteUsers(userIds);
      await loadUsers();
    } catch (err) {
      setError(err as Error);
      console.error('Failed to batch delete users:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUsers]);

  // 初始加载
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    total,
    loading,
    error,
    loadUsers,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    batchDeleteUsers,
  };
};
