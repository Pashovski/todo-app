# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo-based React Native application with cross-platform support (iOS, Android, Web). It uses:
- **Framework**: React Native 0.81.5 with React 19.1.0
- **Build System**: Expo CLI (~54.0.33)
- **Routing**: expo-router with file-based routing (located in `/app` directory)
- **Navigation**: React Navigation with bottom tab navigation
- **Styling**: React Native StyleSheet with theme support (light/dark mode)
- **Type System**: TypeScript with strict mode enabled
- **Animation**: React Native Reanimated for advanced animations
- **Icons**: expo-symbols for SF Symbols (iOS) / Material Design (Android)

## Common Development Commands

### Running the App

```bash
npm start                 # Start development server (interactive menu to choose platform)
npm run android          # Run on Android emulator
npm run ios             # Run on iOS simulator
npm run web             # Run on web browser
```

### Linting & Code Quality

```bash
npm run lint            # Run ESLint with expo config
```

### Project Reset

```bash
npm run reset-project   # Reset app directory to blank state (moves current app to app-example)
```

## Architecture

### Routing (expo-router)

The app uses **file-based routing** where the file structure maps directly to routes:

```
app/
├── _layout.tsx              # Root layout - ThemeProvider, Stack navigator
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator - manages bottom tabs
│   ├── index.tsx            # Home screen (route: /)
│   └── explore.tsx          # Explore screen (route: /explore)
└── modal.tsx                # Modal screen (route: /modal)
```

**Key Points:**
- Parenthesized folders like `(tabs)` are layout groups (not part of route path)
- Screens are exported as default functions
- Root layout wraps the entire app with `<ThemeProvider>` from react-navigation
- `unstable_settings.anchor` in root layout sets `(tabs)` as the default route

### Navigation

- **Tab Navigation**: Bottom tabs in `app/(tabs)/_layout.tsx` using `<Tabs>` from expo-router
- **Stack Navigation**: Root-level screens in `app/_layout.tsx` using `<Stack>` from expo-router
- **Modal Presentation**: Modal screen uses `presentation: 'modal'` option
- **Link Previews**: Enhanced Link component with preview menus (see `app/(tabs)/index.tsx`)

### Component Organization

- **`/components`**: Reusable UI components
  - Themed components (ThemedText, ThemedView) - respect light/dark mode
  - Layout helpers (ParallaxScrollView)
  - Navigation components (HapticTab for tab feedback)
  - Icon components (IconSymbol wrapper)

- **`/hooks`**: Custom React hooks
  - `useColorScheme`: Detect system color preference
  - Platform-specific implementations available (.web.ts files for web-specific logic)

- **`/constants`**: App-wide constants
  - `theme.ts`: Color palette and font definitions for light/dark modes
    - `Colors`: Color definitions indexed by theme ('light' | 'dark')
    - `Fonts`: Platform-specific font families (iOS/Android/Web)

### Theming System

Colors are centralized in `constants/theme.ts`:

```typescript
const Colors = {
  light: { text, background, tint, icon, tabIconDefault, tabIconSelected },
  dark: { text, background, tint, icon, tabIconDefault, tabIconSelected }
}
```

**Usage Pattern:**
```typescript
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// In component:
const colorScheme = useColorScheme();
const color = Colors[colorScheme ?? 'light'].text;
```

Themed components (ThemedText, ThemedView) automatically handle this using the theme from navigation's ThemeProvider.

### Styling

- React Native **StyleSheet** API (not CSS)
- Styles are typically defined at the bottom of component files
- Platform-specific styling via `Platform.select()`
- Theme colors come from `constants/theme.ts`
- No CSS-in-JS library currently in use (alternatives: Nativewind, Tamagui, unistyles)

## Key Configurations

### app.json (Expo Configuration)

- **New Architecture**: Enabled (`newArchEnabled: true`)
- **Experiments**:
  - `typedRoutes: true` - Type-safe route navigation
  - `reactCompiler: true` - React compiler optimization
- **Adaptive Icons** (Android): With monochrome variant for Android 13+
- **Edge-to-Edge** (Android): Enabled for full screen experience

### TypeScript (tsconfig.json)

- Path alias: `@/*` maps to root directory (e.g., `@/components` = `./components`)
- Extends: `expo/tsconfig.base`
- Strict mode enabled
- Includes `.expo/types/**/*.ts` for Expo-generated types

### ESLint (eslint.config.js)

- Uses flat config format
- Extends `eslint-config-expo` with Expo-specific rules
- Ignores `/dist` directory

## Important Patterns & Conventions

### File Naming

- Components: PascalCase (e.g., `ThemedText.tsx`)
- Screens: kebab-case or index.tsx (e.g., `explore.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `use-color-scheme.ts`)
- Platform-specific files: `filename.platform.ts` (e.g., `use-color-scheme.web.ts`)

### Imports

Use path alias `@/` for all imports:
```typescript
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
```

### Screen Components

- Default export expected by expo-router
- Use descriptive names (e.g., `HomeScreen`, `ExploreScreen`)
- StyleSheet often defined at component bottom

### Animated Components

Use React Native Reanimated for animations. Imported from 'react-native-reanimated'.

## Platform-Specific Considerations

- **iOS**: Uses native SF Symbols via `expo-symbols` (imported as `IconSymbol`)
- **Android**: Material Design icons via `expo-symbols`
- **Web**: Static output mode in app.json (runs on web)
- **Platform.select()**: Use for OS-specific logic or styling

## Build & Deployment Notes

- **Development**: Use `expo start` which provides QR code for Expo Go or emulator options
- **Development Builds**: Option available for advanced native customization
- **Web**: Outputs to `static` format (configured in app.json)
- **Icons**: Adaptive icons configured for Android 12+

## Development Workflow

1. Edit files in `/app`, `/components`, `/hooks`, or `/constants`
2. Changes hot reload in Expo Go or dev build
3. Use `npm run lint` to check code quality before committing
4. Press `Cmd+D` (iOS), `Cmd+M` (Android), or `F12` (Web) to access dev menu

## Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native API Reference](https://reactnative.dev/docs/components-and-apis)
- [SF Symbols for iOS](https://developer.apple.com/sf-symbols/) (used via expo-symbols)

## Development Preferences

- **Git Workflow**: Do not push to GitHub automatically. User will push manually when ready using `git push`.
