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
      all: 'All',
      success: 'Success',
      failure: 'Failure',
      error: 'Error',
      add: 'Add',
      update: 'Update',
      title: 'Title',
      value: 'Value',
      description: 'Description',
      text: 'Text',
      content: 'Content',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      select: 'Select',
      placeholder: 'Please enter...',
      required: 'Required',
      updating: 'Updating...',
      resize: 'Resize',
    },

    // Error Messages
    errors: {
      unauthorized: 'Unauthorized',
      unauthorizedClearing: 'Unauthorized - clearing authentication',
      tokenInvalidOrExpired: 'Token invalid or expired',
      forbidden: 'Forbidden - insufficient permissions',
      notFound: 'Resource not found',
      serverError: 'Internal server error',
      serverUnavailable: 'Backend service has stopped, please check if the backend service is running',
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

    // Register Page
    register: {
      title: 'Create Account',
      subtitle: 'Create your Cube account',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      description: 'Description',
      registerButton: 'Register',
      backToLogin: 'Back to Login',
      validationError: 'Please fill in all required fields',
      passwordMismatchError: 'Passwords do not match',
      emailError: 'Please enter a valid email address',
      usernameError: 'Username must be at least 3 characters',
      passwordError: 'Password must be at least 6 characters',
      registerSuccess: 'Registration successful!',
      registerError: 'Registration failed, please try again',
      usernameExistsError: 'Username already exists',
      emailExistsError: 'Email already registered',
    },

    // Navigation Menu
    menu: {
      dashboard: 'Dashboard',
      workflow: 'Workflow Management',
      user: 'User Management',
      settings: 'System Settings',
      mine: 'Mine',
      userProfile: 'User Profile',
      changePassword: 'Change Password',
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
      deleteWarning: 'Are you sure you want to delete menu ?',
      deleteWithChildren: 'This menu contains {{count}} sub-menu(s), which will also be deleted.',
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
      confirmBatchDelete: 'Are you sure you want to delete {{count}} selected role(s)?',
      deleteWarning: 'Are you sure you want to delete this role?',
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
      tabsAriaLabel: 'Permission management tabs',
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
      confirmBatchDelete: 'Are you sure you want to delete {{count}} selected users?',
      deleteWarning: 'Are you sure you want to delete this user?',
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
      
      // Validation Messages
      invalidEmail: 'Please enter a valid email address',
    },

    // System Log Management
    sysLogManagement: {
      // Fields
      username: 'Username',
      operation: 'Operation',
      method: 'Method',
      params: 'Parameters',
      status: 'Status',
      ip: 'IP Address',
      createdTime: 'Created Time',
      createdTimeStart: 'Start Time',
      createdTimeEnd: 'End Time',
      operations: 'Operations',

      // Buttons
      search: 'Search',
      batchDelete: 'Batch Delete',
      delete: 'Delete',

      // Table
      noData: 'No data',
      rowsPerPage: 'Rows per page:',

      // Prompts
      confirmDelete: 'Are you sure you want to delete this log?',
      confirmBatchDelete: 'Are you sure you want to delete {{count}} selected logs?',
      deleteWarning: 'Are you sure you want to delete this log?',
      selectFirst: 'Please select logs to delete first',

      // Success Messages
      deleteSuccess: 'Log deleted successfully',
      batchDeleteSuccess: 'Batch deletion successful',
    },

    // User Profile
    userProfile: {
      title: 'User Profile',
      avatar: 'Avatar',
      username: 'Username',
      password: 'Password',
      email: 'Email',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      updateSuccess: 'Profile updated successfully',
      updateFailed: 'Update failed: {error}',
      usernameNotEditable: 'Username cannot be edited',
      passwordNotEditable: 'Password cannot be edited',
    },

    // Change Password
    changePassword: {
      title: 'Change Password',
      oldPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      changeButton: 'Change Password',
      oldPasswordRequired: 'Please enter current password',
      newPasswordRequired: 'Please enter new password',
      confirmPasswordRequired: 'Please confirm new password',
      passwordMismatch: 'Passwords do not match',
      changeSuccess: 'Password changed successfully',
      changeFailed: 'Password change failed: {error}',
      newPasswordMinLength: 'New password must be at least 6 characters',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalUsers: 'Total Users',
      totalUsersDesc: 'Total number of registered users in the system',
      totalWorkflows: 'Total Workflows',
      totalWorkflowsDesc: 'Total number of workflows in the system',
      activeTasks: 'Active Tasks',
      activeTasksDesc: 'Currently executing tasks',
      completionRate: 'Completion Rate',
      completionRateDesc: 'Average task completion rate',
    },

    // Workspace
    workspace: {
      title: 'Workspace',
      addWidget: 'Add Widget',
      dragging: 'Dragging',
      selectWorkspace: 'Select Workspace',
      defaultWorkspace: 'Default Workspace',
      noWorkspace: 'No Workspace',
      noWidgets: 'No Widgets',
      noWidgetsDescription: 'Click the button below to add the widgets you need',
      loading: 'Loading...',
      // Workspace Dialog
      dialog: {
        title: 'Workspace Management',
        create: 'Create Workspace',
        edit: 'Edit Workspace',
        name: 'Workspace Name',
        nameRequired: 'Workspace name is required',
        description: 'Workspace Description',
      },
      // Delete Workspace
      delete: {
        content: 'Are you sure you want to delete workspace "{{name}}"? This action cannot be undone.',
      },
    },

    // Widget
    widget: {
      chartPlaceholder: 'Chart Placeholder',
      tablePlaceholder: 'Table Placeholder',
      textContent: 'Text Content',
    },

    // Add widget dialog
    addWidgetDialog: {
      title: 'Add Widget',
      selectWidget: 'Select Widget',
      selectSize: 'Select Size',
      searchPlaceholder: 'Search widgets...',
      ariaLabel: 'Widget selection tabs',
      categories: {
        charts: 'Charts',
        reports: 'Reports',
        statistics: 'Statistics',
        other: 'Other',
      },
      widgets: {
        statistic: {
          name: 'Statistic Card',
          description: 'Display key metrics with values and descriptions',
          preview: '1234\nTotal Users',
        },
        chart: {
          name: 'Pie Chart',
          description: 'Display data distribution in pie chart format',
          preview: '📊\nPie Chart Preview',
        },
        barChart: {
          name: 'Bar Chart',
          description: 'Compare data in bar chart format',
          preview: '📈\nBar Chart Preview',
        },
        lineChart: {
          name: 'Line Chart',
          description: 'Display trends in line chart format',
          preview: '📉\nLine Chart Preview',
        },
        table: {
          name: 'Table',
          description: 'Display detailed data in table format',
          preview: 'Header1 | Header2\nData1 | Data2',
        },
        text: {
          name: 'Text',
          description: 'Display custom text content',
          preview: 'This is a preview of the text widget',
        },
        activity: {
          name: 'Activity Feed',
          description: 'Display recent activity records',
          preview: 'User A completed task B\nUser C created issue D',
        },
        calendar: {
          name: 'Calendar',
          description: 'Display calendar view',
          preview: '📅\nNovember 2023',
        },
      },
      sizes: {
        small: {
          description: 'Small size widget',
        },
        medium: {
          description: 'Standard size widget',
        },
        large: {
          description: 'Full width widget',
        },
      },
    },

    // Edit Widget Dialog
    editWidgetDialog: {
      title: 'Edit Widget',
      textLabel: 'Text Content',
      errors: {
        titleRequired: 'Please enter widget title',
        valueRequired: 'Please enter statistic value',
        textRequired: 'Please enter text content',
        updateFailed: 'Failed to update widget',
      },
    },

    // Resize Widget Dialog
    resizeWidgetDialog: {
      title: 'Resize Widget: {{widgetTitle}}',
    },
  },
};