# Solo Preneur App

A React Native app built with Expo and React Native Reusables for solo entrepreneurs.

## Features

- ✅ **Authentication Pages**
  - Login page with email/password
  - Sign up page with registration form
  - Social login (Google & Apple)
  - Navigation between login/signup

- ⚛️ **Tech Stack**
  - [Expo Router](https://expo.dev/router) for navigation
  - [Tailwind CSS](https://tailwindcss.com/) via [Nativewind](https://www.nativewind.dev/)
  - [React Native Reusables](https://github.com/founded-labs/react-native-reusables) for UI components
  - New Architecture enabled
  - Edge to Edge enabled
  - Runs on iOS, Android, and Web

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd solo-preuneur-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start Expo development server
npm run android      # Start development server (Android focus)
npm run ios          # Start development server (iOS focus)
npm run web          # Start development server (Web focus)
```

### Running the App

1. **iOS**: Press `i` in terminal or scan QR code with Camera app
2. **Android**: Press `a` in terminal or scan QR code with Expo Go app
3. **Web**: Press `w` in terminal or open browser to localhost

## Project Structure

```
├── app/                    # App routes (Expo Router)
│   ├── index.tsx          # Login page (root)
│   ├── sign-up.tsx        # Sign up page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components (buttons, inputs, etc.)
│   ├── sign-in-form.tsx  # Login form component
│   ├── sign-up-form.tsx  # Sign up form component
│   └── social-connections.tsx # Social login buttons
└── lib/                  # Utilities and configurations
```

## Adding Components

Add more reusable components using the CLI:

```bash
npx @react-native-reusables/cli@latest add [component-name]

# Examples:
npx @react-native-reusables/cli@latest add input textarea
npx @react-native-reusables/cli@latest add --all
```

## Authentication Flow

1. **Login Page** (`/`) - Default landing page
   - Email/password form
   - "Forgot password" link
   - Social login options (Google, Apple)
   - Link to sign up page

2. **Sign Up Page** (`/sign-up`) - Registration page
   - Registration form
   - Social sign up options
   - Link back to login page

## Deployment

Deploy with [Expo Application Services (EAS)](https://expo.dev/eas):

```bash
# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all

# Over-the-air updates
eas update
```

## Learn More

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Nativewind Docs](https://www.nativewind.dev/)
- [React Native Reusables](https://reactnativereusables.com)

## Support

If you enjoy using React Native Reusables, please consider giving it a ⭐ on [GitHub](https://github.com/founded-labs/react-native-reusables).
