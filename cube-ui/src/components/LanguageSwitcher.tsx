import React from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  color?: 'inherit' | 'default' | 'primary' | 'secondary';
}

interface LanguageSwitcherState {
  anchorEl: HTMLElement | null;
}

class LanguageSwitcherClass extends React.Component<
  LanguageSwitcherProps & { i18n: any; t: any },
  LanguageSwitcherState
> {
  constructor(props: LanguageSwitcherProps & { i18n: any; t: any }) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLanguageChange = (language: string) => {
    this.props.i18n.changeLanguage(language);
    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;
    const { color = 'inherit', i18n } = this.props;
    const open = Boolean(anchorEl);
    const currentLanguage = i18n.language;

    const languages = [
      { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
      { code: 'en-US', label: 'English', flag: '🇺🇸' },
    ];

    return (
      <>
        <IconButton color={color} onClick={this.handleClick}>
          <LanguageIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={this.handleClose}>
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              selected={currentLanguage === lang.code}
              onClick={() => this.handleLanguageChange(lang.code)}
            >
              <ListItemIcon sx={{ fontSize: '1.5rem' }}>{lang.flag}</ListItemIcon>
              <ListItemText>{lang.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  return <LanguageSwitcherClass {...props} i18n={i18n} t={t} />;
}
