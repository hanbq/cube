export default {
  translation: {
    // 通用
    common: {
      home: '首页',
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      search: '搜索',
      reset: '重置',
      submit: '提交',
      loading: '加载中...',
      noData: '暂无数据',
      of: '共',
      items: '条',
      componentLoadFailed: '组件 "{path}" 加载失败',
      all: '全部',
      success: '成功',
      failure: '失败',
      error: '错误',
    },

    // 错误信息
    errors: {
      unauthorized: '未授权',
      unauthorizedClearing: '未授权 - 清除认证信息',
      tokenInvalidOrExpired: '认证令牌无效或已过期',
      forbidden: '禁止访问 - 权限不足',
      notFound: '资源未找到',
      serverError: '服务器内部错误',
      apiError: 'API 错误 (状态码 {status}): {message}',
      noResponse: '服务器无响应: {message}',
      requestSetupError: '请求配置错误: {message}',
      requestFailed: '请求失败',
    },

    // 登录页面
    login: {
      title: 'Cube',
      subtitle: '',
      username: '用户名',
      password: '密码',
      loginButton: '登录',
      forgotPassword: '忘记密码？',
      register: '注册账号',
      rememberMe: '记住我',
      validationError: '请输入用户名和密码',
      loginError: '登录失败，请检查用户名和密码',
      loginSuccess: '登录成功',
    },

    // 注册页面
    register: {
      title: '注册账号',
      subtitle: '创建您的Cube账户',
      username: '用户名',
      password: '密码',
      confirmPassword: '确认密码',
      email: '邮箱',
      description: '描述',
      registerButton: '注册',
      backToLogin: '返回登录',
      validationError: '请填写所有必填字段',
      passwordMismatchError: '两次输入的密码不一致',
      emailError: '请输入有效的邮箱地址',
      usernameError: '用户名至少需要3个字符',
      passwordError: '密码至少需要6个字符',
      registerSuccess: '注册成功！',
      registerError: '注册失败，请重试',
      usernameExistsError: '用户名已存在',
      emailExistsError: '邮箱已被注册',
    },

    // 导航菜单
    menu: {
      dashboard: '仪表盘',
      workflow: '工作流管理',
      user: '用户管理',
      settings: '系统设置',
      menu_management: '菜单管理',
    },

    // 头部
    header: {
      notifications: '通知',
      profile: '个人信息',
      logout: '退出登录',
      noNotifications: '暂无通知',
    },

    // 面包屑
    breadcrumb: {
      home: '首页',
    },

    // 菜单管理
    menuManagement: {
      title: '菜单管理',
      refresh: '刷新',
      createMenu: '新建菜单',
      editMenu: '编辑菜单',
      deleteMenu: '删除菜单',
      addChild: '添加子节点',
      confirmDelete: '确认删除',
      deleteWarning: '确定要删除菜单 "{name}" 吗?',
      deleteWithChildren: '此菜单包含 {count} 个子菜单,删除后子菜单也会被删除。',
      noData: '暂无菜单数据,点击"新建菜单"开始添加',
      loadError: '加载失败: {message}',
      backendTip: '提示: 请确保后端服务运行在 {url}',

      // 表单
      form: {
        menuName: '菜单名称',
        menuNameRequired: '菜单名称不能为空',
        menuNameEng: '菜单英文名称',
        menuNameEngRequired: '菜单英文名称不能为空',
        menuPath: '菜单路径',
        menuPathPlaceholder: '/home/example',
        menuPathRequired: '菜单路径不能为空',
        iconCls: '图标类名',
        iconClsPlaceholder: '如: DashboardIcon',
        parentMenu: '父级菜单',
        noParent: '无(顶级菜单)',
        sort: '排序',
        component: '组件路径',
        componentPlaceholder: '如: src/pages/Dashboard',
        componentRequired: '组件路径不能为空',
        submitting: '提交中...',
        submit: '确定',
      },

      // 操作提示
      message: {
        createSuccess: '菜单创建成功',
        updateSuccess: '菜单更新成功',
        deleteSuccess: '菜单删除成功',
        createFailed: '菜单创建失败',
        updateFailed: '菜单更新失败',
        deleteFailed: '菜单删除失败',
      },
    },

    // 角色管理
    roleManagement: {
      // 字段
      roleId: '角色ID',
      roleName: '角色名称',
      description: '描述',
      createdTime: '创建时间',
      updatedTime: '更新时间',
      operations: '操作',

      // 按钮
      search: '查询',
      create: '新建',
      batchDelete: '批量删除',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',

      // 对话框
      createRole: '新建角色',
      editRole: '编辑角色',

      // 表格
      noData: '暂无数据',
      rowsPerPage: '每页行数:',
      displayedRows: '{from}-{to} 共 {count} 条',

      // 提示
      confirmDelete: '确定要删除这个角色吗?',
      confirmBatchDelete: '确定要删除选中的 {count} 个角色吗?',
      selectFirst: '请先选择要删除的角色',
      loadError: '加载失败: {message}',

      // 成功消息
      createSuccess: '角色创建成功',
      updateSuccess: '角色更新成功',
      deleteSuccess: '角色删除成功',
      batchDeleteSuccess: '批量删除成功',

      // 错误消息
      saveFailed: '保存失败: {error}',
      deleteFailed: '删除失败: {error}',
      batchDeleteFailed: '批量删除失败: {error}',
    },

    permissionManagement: {
      title: '',
      roleList: '角色列表',
      userTab: '用户',
      menuTab: '菜单',
      addUsers: '添加用户',
      addMenus: '添加菜单',
      deleteSelected: '删除选中',
      confirmDelete: '确定要删除选中的 {count} 项吗?',
      saveSuccess: '保存成功',
      saveFailed: '保存失败',
      deleteSuccess: '删除成功',
    },

    // 用户管理
    userManagement: {
      // 字段
      userId: '用户ID',
      username: '用户名',
      password: '密码',
      email: '邮箱',
      description: '描述',
      status: '状态',
      isSuperAdmin: '超级管理员',
      createdTime: '创建时间',
      operations: '操作',

      // 按钮
      search: '查询',
      create: '新建',
      batchDelete: '批量删除',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',

      // 对话框
      createUser: '新建用户',
      editUser: '编辑用户',

      // 表格
      noData: '暂无数据',
      rowsPerPage: '每页行数:',

      // 提示
      confirmDelete: '确定要删除这个用户吗?',
      confirmBatchDelete: '确定要删除选中的 {count} 个用户吗?',
      selectFirst: '请先选择要删除的用户',
      passwordHint: '留空则不修改密码',

      // 状态选项
      all: '全部',
      active: '激活',
      inactive: '未激活',
      yes: '是',
      no: '否',

      // 成功消息
      createSuccess: '用户创建成功',
      updateSuccess: '用户更新成功',
      deleteSuccess: '用户删除成功',
      batchDeleteSuccess: '批量删除成功',
      
      // 验证消息
      invalidEmail: '请输入有效的邮箱地址',
    },

    // 系统日志管理
    sysLogManagement: {
      // 字段
      logId: '日志ID',
      username: '用户名',
      operation: '操作',
      method: '方法',
      params: '参数',
      status: '状态',
      ip: 'IP地址',
      createdTime: '创建时间',
      createdTimeStart: '开始时间',
      createdTimeEnd: '结束时间',
      operations: '操作',

      // 按钮
      search: '查询',
      batchDelete: '批量删除',
      delete: '删除',

      // 表格
      noData: '暂无数据',
      rowsPerPage: '每页行数:',

      // 提示
      confirmDelete: '确定要删除这条日志吗?',
      confirmBatchDelete: '确定要删除选中的 {count} 条日志吗?',
      selectFirst: '请先选择要删除的日志',

      // 成功消息
      deleteSuccess: '日志删除成功',
      batchDeleteSuccess: '批量删除成功',
    },
  },
};