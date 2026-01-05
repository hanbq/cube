# Cube UI

A modern, elegant workflow management system built with React, TypeScript, and Material-UI, featuring a beautiful matcha green theme.

## ✨ Features

- 🎨 **Elegant Design**: Matcha green color scheme with sophisticated gradients
- 🌍 **Internationalization**: Full i18n support with English and Simplified Chinese
- 📱 **Responsive Layout**: Adaptive design that works on all devices
- 🔐 **Authentication**: Login system with elegant UI
- 🧭 **Navigation**: Collapsible sidebar menu with smooth animations
- 🍞 **Breadcrumb Navigation**: Clear page hierarchy display
- ⚛️ **Modern Stack**: Built with React 18, TypeScript, and Vite
- 🎭 **Material-UI**: Professional UI components with custom theming

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v6
- **Routing**: React Router v7
- **Internationalization**: react-i18next
- **Icons**: Material Icons
- **Fonts**: Roboto, Playfair Display

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Project Structure

```
cube-ui/
├── src/
│   ├── components/          # Reusable components
│   │   ├── home/           # Home page components
│   │   │   ├── Header.tsx  # Top navigation bar
│   │   │   ├── Menu.tsx    # Sidebar navigation
│   │   │   ├── Main.tsx    # Main content area with breadcrumb
│   │   │   └── Home.tsx    # Home layout wrapper
│   │   ├── Login.tsx       # Login page
│   │   └── LanguageSwitcher.tsx  # Language switcher component
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Dashboard page
│   │   ├── Workflow.tsx    # Workflow management page
│   │   ├── User.tsx        # User management page
│   │   └── Settings.tsx    # Settings page
│   ├── constants/          # Constants and configurations
│   │   └── menu.ts         # Menu items configuration
│   ├── types/              # TypeScript type definitions
│   │   └── common.ts       # Common type definitions
│   ├── i18n/               # Internationalization
│   │   ├── index.ts        # i18n configuration
│   │   ├── locales/        # Translation files
│   │   │   ├── zh-CN.ts    # Simplified Chinese
│   │   │   └── en-US.ts    # English
│   │   └── README.md       # i18n usage guide
│   ├── theme/              # Theme configuration
│   │   └── theme.ts        # Material-UI theme customization
│   ├── App.tsx             # App component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🌍 Internationalization

The application supports multiple languages with persistent storage:

- **Default Language**: English (en-US)
- **Available Languages**: English, Simplified Chinese
- **Storage**: Language preference is saved to localStorage

### Adding New Languages

1. Create a new translation file in `src/i18n/locales/`:
```typescript
// src/i18n/locales/ja-JP.ts
export default {
  translation: {
    common: { ... },
    login: { ... },
    // ... more translations
  }
};
```

2. Register the language in `src/i18n/index.ts`:
```typescript
import jaJP from './locales/ja-JP';

i18n.init({
  resources: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,  // Add new language
  },
  // ...
});
```

3. Add the language option to `LanguageSwitcher.tsx`:
```typescript
const languages = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
];
```

See [i18n README](src/i18n/README.md) for detailed usage instructions.

## 🎨 Theme Customization

The application uses a custom Material-UI theme with matcha green colors:

- **Primary Color**: `#2d5016` (Dark Forest Green)
- **Secondary Color**: `#88b04b` (Matcha Green)
- **Background**: Soft cream tones with subtle gradients

To customize the theme, edit `src/theme/theme.ts`.

## 📱 Pages

### Login
- Elegant login form with gradient background
- Username and password fields with icons
- Password visibility toggle
- Language switcher in top-right corner

### Dashboard
- Overview of system metrics
- Quick access to common functions

### Workflow Management
- Create and manage workflows
- Visual workflow designer

### User Management
- User CRUD operations
- Role and permission management

### Settings
- System configuration
- User preferences

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server (default: http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Environment Setup

The development server is configured to listen on all network interfaces (0.0.0.0), making it accessible from other devices on your network.

## 🚢 Deployment

```bash
# Build the application
npm run build

# The built files will be in the `dist` directory
# Deploy the contents of `dist` to your web server
```

## 🎭 Component Patterns

This project uses Class Components with functional wrappers for hooks:

```typescript
// Class component for logic
class MyComponentClass extends React.Component<MyComponentProps> {
  render() {
    const { t } = this.props;
    return <div>{t('key')}</div>;
  }
}

// Functional wrapper for hooks
export default function MyComponent(props: Omit<MyComponentProps, 't'>) {
  const { t } = useTranslation();
  return <MyComponentClass {...props} t={t} />;
}
```

## 📝 License

This project is part of the Cube workflow management system.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👥 Team

Built with ❤️ by the Cube development team.

---

**Note**: This is the UI component of the Cube system. For the complete system, you'll also need:
- `cube-api`: Backend REST API
- `cube-workflow`: Workflow engine

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [i18next Documentation](https://www.i18next.com/)
