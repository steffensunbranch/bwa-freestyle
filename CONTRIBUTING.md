# Contributing to BuildWithAI Boilerplate

Thank you for your interest in contributing to BuildWithAI Boilerplate! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/buildwithai-boilerplate.git
   cd buildwithai-boilerplate
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style
- Follow the existing code style and patterns
- Use TypeScript for type safety
- Follow the ESLint configuration
- Run `npm run lint` before committing

### Testing
- Test your changes on both iOS and Android
- Test in both light and dark themes
- Verify authentication flows work correctly
- Check that internationalization works properly

### Documentation
- Update README.md if you add new features
- Update `.github/copilot-instructions.md` for development changes
- Add comments for complex logic

## 🔄 Pull Request Process

1. **Ensure your code works**:
   ```bash
   npm run lint
   npm run dev
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Screenshots if UI changes
   - Reference any related issues

## 🏗️ Project Structure

- `app/` - File-based routing with Expo Router
- `components/` - Reusable UI components
- `lib/` - Core utilities and configurations
- `assets/` - Static assets (images, fonts, etc.)

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Device/OS information
- Screenshots if applicable

## ✨ Feature Requests

For feature requests, please:
- Check existing issues first
- Provide clear use case
- Explain the benefit to other users

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to BuildWithAI Boilerplate! Your contributions help make this project better for everyone.
