export default {
  translation: {
    // Common
    common: {
      home: 'Home',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      reset: 'Reset',
      submit: 'Submit',
      loading: 'Loading...',
      noData: 'No Data',
      of: 'of',
      items: 'items',
      componentLoadFailed: 'Component "{path}" failed to load',
    },

    // Error Messages
    errors: {
      unauthorized: 'Unauthorized',
      unauthorizedClearing: 'Unauthorized - clearing authentication',
      tokenInvalidOrExpired: 'Token invalid or expired',
      forbidden: 'Forbidden - insufficient permissions',
      notFound: 'Resource not found',
      serverError: 'Internal server error',
      apiError: 'API error with status {status}: {message}',
      noResponse: 'No response received from server: {message}',
      requestSetupError: 'Request setup error: {message}',
      requestFailed: 'Request failed',
    },

    // Login Page
    login: {
      title: 'Cube',
      subtitle: '',
      username: 'Username',
      password: 'Password',
      loginButton: 'Login',
      forgotPassword: 'Forgot Password?',
      register: 'Register',
      rememberMe: 'Remember Me',
      validationError: 'Please enter username and password',
      loginError: 'Login failed, please check your username and password',
      loginSuccess: 'Login successful',
    },

    // Navigation Menu
    menu: {
      dashboard: 'Dashboard',
      workflow: 'Workflow Management',
      user: 'User Management',
      settings: 'System Settings',
    },

    // Header
    header: {
      notifications: 'Notifications',
      profile: 'Profile',
      logout: 'Logout',
      noNotifications: 'No Notifications',
    },

    // Breadcrumb
    breadcrumb: {
      home: 'Home',
    },

    // Menu Management
    menuManagement: {
      title: 'Menu Management',
      refresh: 'Refresh',
      createMenu: 'Create Menu',
      editMenu: 'Edit Menu',
      deleteMenu: 'Delete Menu',
      addChild: 'Add Child',
      confirmDelete: 'Confirm Delete',
      deleteWarning: 'Are you sure you want to delete menu "{name}"?',
      deleteWithChildren: 'This menu contains {count} sub-menu(s), which will also be deleted.',
      noData: 'No menu data, click "Create Menu" to get started',
      loadError: 'Load failed: {message}',
      backendTip: 'Tip: Please ensure the backend service is running at {url}',

      // Form
      form: {
        menuName: 'Menu Name',
        menuNameRequired: 'Menu name is required',
        menuNameEng: 'Menu Name (English)',
        menuNameEngRequired: 'Menu name (English) is required',
        menuPath: 'Menu Path',
        menuPathPlaceholder: '/home/example',
        menuPathRequired: 'Menu path is required',
        iconCls: 'Icon Class',
        iconClsPlaceholder: 'e.g., DashboardIcon',
        parentMenu: 'Parent Menu',
        noParent: 'None (Top Level)',
        sort: 'Sort Order',
        component: 'Component Path',
        componentPlaceholder: 'e.g., src/pages/Dashboard',
        componentRequired: 'Component path is required',
        submitting: 'Submitting...',
        submit: 'Submit',
      },

      // Messages
      message: {
        createSuccess: 'Menu created successfully',
        updateSuccess: 'Menu updated successfully',
        deleteSuccess: 'Menu deleted successfully',
        createFailed: 'Failed to create menu',
        updateFailed: 'Failed to update menu',
        deleteFailed: 'Failed to delete menu',
      },
    },

    // Role Management
    roleManagement: {
      // Fields
      roleId: 'Role ID',
      roleName: 'Role Name',
      description: 'Description',
      createdTime: 'Created Time',
      updatedTime: 'Updated Time',
      operations: 'Operations',

      // Buttons
      search: 'Search',
      create: 'Create',
      batchDelete: 'Batch Delete',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',

      // Dialogs
      createRole: 'Create Role',
      editRole: 'Edit Role',

      // Table
      noData: 'No Data',
      rowsPerPage: 'Rows per page:',
      displayedRows: '{from}-{to} of {count}',

      // Prompts
      confirmDelete: 'Are you sure you want to delete this role?',
      confirmBatchDelete: 'Are you sure you want to delete {count} selected role(s)?',
      selectFirst: 'Please select roles to delete first',
      loadError: 'Load failed: {message}',

      // Success Messages
      createSuccess: 'Role created successfully',
      updateSuccess: 'Role updated successfully',
      deleteSuccess: 'Role deleted successfully',
      batchDeleteSuccess: 'Batch deletion successful',

      // Error Messages
      saveFailed: 'Save failed: {error}',
      deleteFailed: 'Delete failed: {error}',
      batchDeleteFailed: 'Batch delete failed: {error}',
    },

    // Permission Management
    permissionManagement: {
      title: 'Permission Management',
      roleList: 'Role List',
      userTab: 'Users',
      menuTab: 'Menus',
      addUsers: 'Add Users',
      addMenus: 'Add Menus',
      deleteSelected: 'Delete Selected',
      confirmDelete: 'Are you sure you want to delete {count} selected item(s)?',
      saveSuccess: 'Saved successfully',
      saveFailed: 'Save failed',
      deleteSuccess: 'Deleted successfully',
    },

    // User Management
    userManagement: {
      // Fields
      userId: 'User ID',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      description: 'Description',
      status: 'Status',
      isSuperAdmin: 'Super Admin',
      createdTime: 'Created Time',
      operations: 'Operations',

      // Buttons
      search: 'Search',
      create: 'Create',
      batchDelete: 'Batch Delete',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',

      // Dialog
      createUser: 'Create User',
      editUser: 'Edit User',

      // Table
      noData: 'No data',
      rowsPerPage: 'Rows per page:',

      // Prompts
      confirmDelete: 'Are you sure you want to delete this user?',
      confirmBatchDelete: 'Are you sure you want to delete {count} selected users?',
      selectFirst: 'Please select users to delete first',
      passwordHint: 'Leave blank to keep current password',

      // Status Options
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      yes: 'Yes',
      no: 'No',

      // Success Messages
      createSuccess: 'User created successfully',
      updateSuccess: 'User updated successfully',
      deleteSuccess: 'User deleted successfully',
      batchDeleteSuccess: 'Batch deletion successful',
    },
  },
};
