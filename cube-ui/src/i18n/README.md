# 国际化 (i18n) 使用指南

本项目使用 `react-i18next` 实现国际化功能。

## 目录结构

```
src/i18n/
├── index.ts           # i18n 配置文件
├── locales/
│   ├── zh-CN.ts      # 中文翻译
│   └── en-US.ts      # 英文翻译
└── README.md         # 本文档
```

## 在函数组件中使用

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.home')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

## 在 Class 组件中使用

由于 Class 组件无法直接使用 Hooks，需要创建包装组件：

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MyComponentProps {
  t?: any;
}

class MyComponentClass extends React.Component<MyComponentProps> {
  render() {
    const { t } = this.props;

    return (
      <div>
        <h1>{t?.('common.home') || '首页'}</h1>
        <button>{t?.('common.save') || '保存'}</button>
      </div>
    );
  }
}

export default function MyComponent(props: Omit<MyComponentProps, 't'>) {
  const { t } = useTranslation();
  return <MyComponentClass {...props} t={t} />;
}
```

## 切换语言

语言切换器组件已经内置，可以在任何地方使用：

```tsx
import LanguageSwitcher from './components/LanguageSwitcher';

<LanguageSwitcher color="inherit" />
```

或者手动切换语言：

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <button onClick={() => changeLanguage('en-US')}>
      Switch to English
    </button>
  );
}
```

## 添加新的翻译

1. 在 `locales/zh-CN.ts` 中添加中文翻译
2. 在 `locales/en-US.ts` 中添加对应的英文翻译

例如：

```typescript
// zh-CN.ts
export default {
  translation: {
    myNewSection: {
      title: '我的标题',
      description: '这是描述',
    },
  },
};

// en-US.ts
export default {
  translation: {
    myNewSection: {
      title: 'My Title',
      description: 'This is description',
    },
  },
};
```

## 使用参数化翻译

在翻译文件中使用 `{{variable}}` 语法：

```typescript
// zh-CN.ts
{
  welcome: '欢迎, {{name}}！',
  items: '你有 {{count}} 个项目',
}
```

在组件中使用：

```tsx
t('welcome', { name: 'John' })
// 输出: 欢迎, John！

t('items', { count: 5 })
// 输出: 你有 5 个项目
```

## 支持的语言

- 简体中文 (zh-CN) - 默认语言
- 英语 (en-US)

## 添加新语言

1. 在 `locales/` 目录下创建新的语言文件，如 `ja-JP.ts`
2. 在 `i18n/index.ts` 中导入并注册：

```typescript
import jaJP from './locales/ja-JP';

i18n.init({
  resources: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,  // 添加新语言
  },
  // ...
});
```

3. 在 `LanguageSwitcher.tsx` 中添加语言选项：

```typescript
const languages = [
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },  // 添加新语言
];
```

## 注意事项

- 语言设置会自动保存到 localStorage
- 页面刷新后会自动恢复之前选择的语言
- 所有翻译文本都应该通过 `t()` 函数获取，不要硬编码
- 为保证向后兼容，使用 `t?.('key') || '默认值'` 的形式
