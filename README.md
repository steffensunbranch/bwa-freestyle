# BuildWithAI Boilerplate

A production-ready React Native mobile app boilerplate built with Expo, Supabase, and TypeScript. Features authentication, theming, internationalization, and a comprehensive UI component library.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🚀 Quick Start

### 1. Install & Setup
```bash
npm install
```

### 2. Configure Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Get your URL and anon key from Project Settings → API
3. Update `lib/config.ts` with your credentials:
```typescript
export const SUPABASE_URL = 'https://your-project.supabase.co';
export const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Start Development
```bash
npm run dev
```

## 🏗️ What's Included

### Core Features
- **Authentication**: Email/password with Supabase
- **Theming**: Light/dark mode with Tailwind CSS
- **Navigation**: File-based routing with Expo Router
- **Internationalization**: Multi-language support (EN/FR)
- **UI Components**: 30+ accessible components
- **Onboarding**: Animated onboarding flow

### Project Structure
```
app/                    # File-based routing
├── (tabs)/            # Tab navigation
├── login.tsx          # Auth screens
└── onboarding.tsx     # Onboarding

components/            # UI components
├── ui/               # Component library
├── account/          # Account management
└── onboarding/       # Onboarding components

lib/                  # Core utilities
├── auth/             # Authentication
├── i18n/             # Internationalization
├── config.ts         # App configuration
└── theme.ts          # Theme configuration
```

## ⚙️ Configuration

### Supabase Setup
1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials** from Project Settings → API
3. **Update `lib/config.ts`** with your actual values:
   ```typescript
   export const SUPABASE_URL = 'https://your-project.supabase.co';
   export const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

### App Customization
Edit `lib/config.ts` to customize:
- App name and version
- Legal URLs (terms of service, privacy policy)
- Any other app-specific settings

## 🛠️ Development

```bash
npm run dev          # Start development server
npm run lint         # Lint code
npm run clean        # Clean project
```

## 📚 Documentation

- [BuildWithAI Docs](https://docs.buildwithai.io/) - Complete documentation
- [App Icons Guide](https://docs.buildwithai.io/features/app-icons-guide)

## 🎯 Next Steps

1. **Configure**: Set up Supabase and customize `lib/config.ts`
2. **Build**: Use existing components and patterns
3. **Deploy**: Use EAS Build for production

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Supabase](https://supabase.com/) for the backend infrastructure
- [React Native Reusables](https://reactnativereusables.com/) for the UI components
- [NativeWind](https://www.nativewind.dev/) for Tailwind CSS support

---

*For detailed development instructions, see `.github/copilot-instructions.md`*