'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/Button';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'auto', label: '自动', icon: Monitor },
    { value: 'light', label: '浅色', icon: Sun },
    { value: 'dark', label: '深色', icon: Moon },
  ] as const;

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          className={`flex items-center space-x-1 px-3 py-1.5 text-xs transition-all ${
            theme === value
              ? 'bg-blue-500 text-white dark:bg-blue-600'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Icon className="h-3 w-3" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ThemeSelector;