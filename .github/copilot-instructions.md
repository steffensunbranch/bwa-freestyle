# BuildWithAI Boilerplate - React Native Mobile App

BuildWithAI Boilerplate is a React Native mobile application built with Expo that supports iOS, Android, and web platforms. The app uses Expo Router for file-based navigation, TypeScript for type safety, and includes modern React Native features like theming and authentication.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Build
Run these commands in sequence to set up and build the project:

1. **Install dependencies**: `npm install` 
   - Takes approximately 30-40 seconds
   - Downloads ~800+ packages including Expo SDK and React Native dependencies
   - May show deprecation warnings for some packages - these are normal

2. **Environment Setup**:
   ```bash
   cp app.json.example app.json
   # Edit app.json with your app details (name, slug, bundleId, etc.)
   ```

3. **Supabase Configuration**:
   - Create project at [supabase.com](https://supabase.com)
   - Get Project URL and anon key from Project Settings → API
   - Add to `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
   - Configure URLs for Expo Go (use IP from terminal output)

4. **Lint the code**: `npm run lint`
   - Takes approximately 2-3 seconds
   - Uses ESLint with expo-config-eslint configuration
   - Always run before committing changes

### Development Servers

**Start development server for all platforms:**
```bash
npx expo start
```
- NEVER CANCEL: Server startup takes 20-30 seconds. Set timeout to 60+ minutes.
- Runs on port 8081 by default
- Provides QR code for mobile testing (not available in CI environment)

**Start web development server:**
```bash
npm run dev
```
- NEVER CANCEL: Web server startup takes 25-30 seconds. Set timeout to 60+ minutes.
- Includes hot reloading for development

### Production Build

**Export static web build:**
```bash
npx expo export --platform web
# OR for unminified development build:
npx expo export --platform web --no-minify
```
- NEVER CANCEL: Build takes 20-25 seconds. Set timeout to 60+ minutes.
- Outputs to `dist/` directory
- Generates static HTML files and bundled JavaScript
- Creates routes for: /, /login, /register, /onboarding, /(tabs), /(tabs)/account, etc.

## Validation

### Manual Validation Requirements
After making changes, ALWAYS perform these validation steps:

1. **Start the web development server** and verify it loads without errors
2. **Test navigation** by clicking between Home and Account tabs
3. **Verify authentication flow**:
   - Test login/register functionality
   - Verify onboarding flow
   - Check account settings and user management
5. **Check console** for any JavaScript errors or warnings
6. **Test responsive behavior** if making UI changes

### Validation Commands
Always run these commands before completing your work:
```bash
npm run lint          # Check code style (2-3 seconds)
npx expo export --platform web --no-minify  # Verify build works (20+ seconds)
```


## Project Structure

### Key Directories
```
/
├── app/                 # File-based routing (Expo Router)
│   ├── (tabs)/         # Tab navigation layout
│   │   ├── index.tsx   # Home screen
│   │   ├── account.tsx # Account screen
│   │   └── _layout.tsx # Tab layout configuration
│   ├── _layout.tsx     # Root layout with theming
│   ├── +not-found.tsx  # 404 page
│   ├── login.tsx       # Login screen
│   ├── register.tsx    # Register screen
│   ├── onboarding.tsx  # Onboarding flow
│   └── +html.tsx       # HTML configuration
├── components/          # Reusable UI components
│   ├── ui/             # Platform-specific UI components
│   ├── account/        # Account-related components
│   ├── onboarding/     # Onboarding components
│   ├── theme-toggle.tsx # Theme switching component
│   └── user-avatar.tsx # User avatar component
├── lib/                # Core utilities and configurations
│   ├── auth/           # Authentication system
│   ├── hooks/          # Custom React hooks
│   ├── i18n/           # Internationalization
│   ├── notifications/  # Push notifications
│   ├── config.ts       # App configuration
│   ├── theme.ts        # Theme configuration
│   └── utils.ts        # Utility functions
├── assets/             # Static assets (images, fonts, lotties)
└── scripts/            # Build and utility scripts
```

### Navigation System
- Uses **Expo Router** for file-based routing
- Tab navigation with Home and Account screens
- Authentication flow with login/register/onboarding
- Automatic deep linking support
- Type-safe navigation with TypeScript

### Authentication System
- Email/Password authentication
- Password management (reset, change)
- User onboarding flow
- Account management and settings
- Deep linking for auth flows

### Theming System
- Light and dark mode support
- Automatic system theme detection
- Consistent color scheme across platforms
- Custom themed components
- Internationalization support (EN/FR)

## Common Tasks

### Adding New Screens
1. Create new `.tsx` file in `app/` directory
2. Export default React component
3. Navigation will be automatically configured based on file structure
4. Add translations in `lib/i18n/locales/` if needed

### Modifying Existing Screens
- **Home screen**: Edit `app/(tabs)/index.tsx`
- **Account screen**: Edit `app/(tabs)/account.tsx`
- **Login screen**: Edit `app/login.tsx`
- **Register screen**: Edit `app/register.tsx`
- **Onboarding**: Edit `app/onboarding.tsx`
- **Tab layout**: Edit `app/(tabs)/_layout.tsx`
- **Root layout**: Edit `app/_layout.tsx`

### Working with Components
- **UI components**: Use components from `components/ui/` (30+ accessible components)
- **Account components**: Use bottom sheet components from `components/account/` for settings screens
- **Themed components**: Follow existing theme patterns
- **Icons**: Use `components/ui/icon.tsx` with Lucide icons

**Available UI Components:**
- `accordion.tsx`, `alert.tsx`, `alert-dialog.tsx`, `aspect-ratio.tsx`
- `avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`
- `checkbox.tsx`, `collapsible.tsx`, `context-menu.tsx`, `dialog.tsx`
- `dropdown-menu.tsx`, `hover-card.tsx`, `icon.tsx`, `input.tsx`
- `label.tsx`, `menubar.tsx`, `popover.tsx`, `progress.tsx`
- `radio-group.tsx`, `select.tsx`, `separator.tsx`, `skeleton.tsx`
- `switch.tsx`, `tabs.tsx`, `text.tsx`, `textarea.tsx`
- `toggle.tsx`, `toggle-group.tsx`, `tooltip.tsx`

### Authentication Development
- **Auth methods**: Configure in `lib/auth/methods/`
- **User management**: Use bottom sheet components in `components/account/` for account settings
- **Deep linking**: Configure in `lib/linking.ts`

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow existing color scheme and theme patterns
- Test both light and dark themes
- Ensure cross-platform compatibility
- Use responsive design principles

## Configuration Files

### Key Configuration
- **package.json**: Scripts, dependencies, and project metadata
- **app.json.example**: Expo app configuration template
- **tsconfig.json**: TypeScript configuration with path mapping
- **tailwind.config.js**: Tailwind CSS configuration
- **metro.config.js**: Metro bundler configuration
- **babel.config.js**: Babel configuration

### Environment Setup
- Copy `app.json.example` to `app.json` and configure
- Set up environment variables as needed

### Key Dependencies
- **Expo SDK 54**: React Native development platform
- **React Native 0.81**: Mobile app framework
- **TypeScript**: Type-safe JavaScript
- **Expo Router**: File-based navigation
- **Supabase**: Backend-as-a-Service
- **NativeWind v4**: Tailwind CSS for React Native
- **React Native Reusables**: Accessible UI components
- **i18next**: Internationalization

## Troubleshooting

### Common Issues
- **Port conflicts**: Use different port numbers if needed
- **Metro bundler issues**: Clear cache with `npx expo start --clear`
- **TypeScript errors**: Ensure all imports use proper path aliases
- **Build failures**: Check for syntax errors and run `npm run lint`
- **Auth issues**: Verify configuration in `lib/auth/`

### Environment Notes
- **CI mode**: Metro runs in CI mode in automated environments (no hot reloading)
- **Networking disabled**: Some Expo services unavailable in sandboxed environments
- **Offline mode**: Uses local dependency maps when network unavailable

### Performance
- Install time: ~30-40 seconds
- Lint time: ~2-3 seconds  
- Development server startup: 25-30 seconds
- Web build time: 20-25 seconds
- **NEVER CANCEL long-running commands** - they are normal for mobile development

