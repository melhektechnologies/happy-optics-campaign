# 🌙 Dark Theme Feature

## Overview

The website now includes a beautiful dark theme option that users can toggle. The theme preference is saved in the browser's localStorage and persists across sessions.

## Features

### ✅ What's Included

1. **Theme Toggle Button**
   - Located in the navbar (desktop and mobile)
   - Smooth animated transition between themes
   - Sun/Moon icon that rotates on toggle

2. **Automatic Theme Detection**
   - Detects system preference on first visit
   - Respects user's saved preference
   - Falls back to light theme if no preference is set

3. **Persistent Storage**
   - Theme choice saved in localStorage
   - Remembers preference across page reloads
   - Works across all pages

4. **Premium Dark Palette**
   - Dark navy background (#0f1419)
   - Teal accent colors for luxury feel
   - Proper contrast for accessibility
   - Maintains brand identity

## How It Works

### Theme Provider
- Wraps the entire app in `app/layout.tsx`
- Manages theme state and localStorage
- Detects system preference

### Theme Toggle Component
- Located in navbar
- Animated icon transition
- Accessible with ARIA labels

### CSS Variables
- All colors use CSS variables
- Dark theme overrides variables
- Smooth transitions between themes

## Usage

### For Users
1. Click the sun/moon icon in the navbar
2. Theme switches instantly
3. Preference is saved automatically

### For Developers

**Access theme in components:**
```typescript
import { useTheme } from "@/components/theme-provider";

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## Color Palette

### Light Theme
- Background: #faf9f7 (warm off-white)
- Foreground: #1a1a1a (near black)
- Primary: #0d7377 (deep teal)
- Accent: #14b8a6 (mint/seafoam)

### Dark Theme
- Background: #0f1419 (dark navy)
- Foreground: #e5e7eb (light gray)
- Primary: #14b8a6 (bright teal)
- Accent: #0d7377 (deep teal)

## Customization

To adjust dark theme colors, edit `app/globals.css`:

```css
.dark {
  --background: #your-color;
  --foreground: #your-color;
  /* ... other variables */
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Accessibility

- ✅ High contrast ratios
- ✅ Proper color contrast for text
- ✅ ARIA labels on toggle button
- ✅ Keyboard accessible

## Future Enhancements

Potential additions:
- System preference auto-switch
- Theme transition animations
- Multiple theme options (light, dark, auto)
- Per-page theme preferences

