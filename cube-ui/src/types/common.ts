import React from 'react';

export interface IMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  subItems?: IMenuItem[];
}

export interface IUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface INotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}
