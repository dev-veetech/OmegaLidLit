# Omega LidLit - React Native App

A comprehensive React Native application for selling hats and tokens, featuring a TikTok-like social feed and AI-powered token generation.

## 🚀 Features

- **Complete E-commerce Flow**: Shop → Token Selection → Order Summary → Login → Order Confirmation
- **CreateTokenDrawer**: AI Magic, Upload Photo, and Take Photo options
- **Responsive Design**: Optimized for mobile with proper navigation
- **Asset Integration**: Hats, tokens, and UI elements
- **Bottom Navigation**: Sticky navigation with Home, Explore, Create, Bag, and You tabs

## 🛠 Tech Stack

- React Native
- TypeScript
- React Navigation 6
- Expo

## 📱 Screens

1. **HomeScreen** - Landing page with hero section, latest drops, and design sections
2. **ShopScreen** - Hat selection with color/size options and product details
3. **TokenSelectionScreen** - NBA/NFL token selection with visual feedback
4. **OrderSummaryScreen** - Order review and sign-in options
5. **LoginScreen** - Apple/Google authentication with compact design
6. **OrderConfirmationScreen** - Order confirmation with next steps and create token options

## 🎨 Components

- **HeroSection** - Main landing section with Omega branding
- **CreateTokenDrawer** - Modal drawer for token creation options
- **BottomNavBar** - Sticky bottom navigation with create button
- **Various UI Sections** - How it works, latest drops, shop classics, etc.

## 🔧 Setup

```bash
cd LidLitApp
npm install
npx expo start
```

## 📸 Assets

All required assets are included in the `assets/` folder:
- Hat images and tokens
- Navigation icons
- UI elements and backgrounds
- Create token option icons

## 🚀 User Flow

1. **Browse Home** - View featured content and sections
2. **Select Hat** - Choose hat with color/size options
3. **Select Token** - Pick from NBA/NFL token collection
4. **Review Order** - See order summary and sign in
5. **Authentication** - Login with Apple or Google
6. **Confirmation** - View order confirmation and next steps
7. **Create Token** - Use AI, upload photo, or take photo

## 📁 Project Structure

```
LidLitApp/
├── src/
│   ├── components/
│   │   ├── navigation/
│   │   │   └── BottomNavBar.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── LatestDropsSection.tsx
│   │   │   ├── ShopClassicsSection.tsx
│   │   │   ├── SnapYourStyleSection.tsx
│   │   │   ├── TopPicksSection.tsx
│   │   │   ├── DesignSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── FooterSection.tsx
│   │   └── CreateTokenDrawer.tsx
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── ShopScreen.tsx
│       ├── TokenSelectionScreen.tsx
│       ├── OrderSummaryScreen.tsx
│       ├── LoginScreen.tsx
│       └── OrderConfirmationScreen.tsx
├── assets/
│   ├── hat.png
│   ├── Create.png
│   ├── GenUsingAI.png
│   ├── UploadPicture.png
│   ├── SnapAPicture.png
│   └── [other assets...]
├── App.tsx
└── package.json
```

## 🎯 Key Features

- **Responsive Design**: Optimized for various screen sizes
- **Navigation**: Seamless flow between screens
- **State Management**: Proper component state handling
- **Asset Management**: Efficient image and icon usage
- **User Experience**: Intuitive interface and interactions

## 📱 Platform Support

- Android (primary target)
- iOS (compatible)
- Responsive design for various screen sizes

## 🔮 Future Enhancements

- AI token generation integration
- Payment processing with Stripe
- Social media integration
- Push notifications
- User authentication backend
