# 12 Step Tracker

A React Native recovery tracking app designed for 12-step programs with a relaxed, calming interface focused on supporting daily recovery practices.

## 🌟 Features

### Core Features

- **Clean Time Counter**: Track your sobriety time with elegant visual displays
- **Meeting Locator**: Find nearby meetings and track attendance
- **Daily Reflections**: Inspirational messages and personal reflection tools

### Progress Tracking

- **90 in 90 Tracker**: Visual progress tracking for meeting attendance goals
- **Goal Setting**: Set and monitor personal recovery goals
- **Mood Tracking**: Daily mood logging with visual charts
- **Achievement System**: Milestone celebrations and progress recognition

### Community Features

- **Group Challenges**: Participate in community challenges with leaderboards
- **Support Groups**: Connect with specific recovery communities
- **Progress Sharing**: Celebrate milestones with the community

### Sponsor/Sponsee Management

- **Sponsor Connection**: Maintain contact with your sponsor
- **Meeting Scheduling**: Plan and track sponsor meetings
- **Step Work Assignments**: Track progress through the 12 steps
- **Message System**: Direct communication with sponsor/sponsees

### Daily Principles

- **Meditation Timer**: Guided meditation with customizable durations
- **Gratitude Journal**: Daily gratitude practice with entry history
- **Habit Tracker**: Monitor daily recovery habits (meditation, sleep, etc.)
- **Daily Affirmations**: Positive reinforcement messages

### Literature & Resources

- **Digital Library**: Access to recovery literature with reading progress
- **Speaker Recordings**: Listen to recovery speakers and testimonials
- **Daily Readers**: "Daily Reflections" and other daily reading resources
- **Resource Links**: Direct access to official AA resources

## 🎨 Design Philosophy

This app embraces a **relaxed, calming aesthetic** designed to support recovery:

- **Soft Color Palette**: Gentle blues, greens, and warm earth tones
- **Comfortable Typography**: Easy-to-read fonts with generous spacing
- **Intuitive Navigation**: Tab-based navigation with clear iconography
- **Mindful Interactions**: Smooth animations and thoughtful user feedback
- **Recovery-Themed Colors**: Special color schemes for meditation, gratitude, community, and progress

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- watchman (if on iOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 12_step_tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - For iOS: Press `i` in the terminal or scan QR code with Expo Go app
   - For Android: Press `a` in the terminal or scan QR code with Expo Go app
   - For Web: Press `w` in the terminal

## 📱 Platform Support

- **iOS**: Native iOS app with tablet support
- **Android**: Native Android app with tablet support
- **Web**: Progressive web app for browser access

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js       # Customizable button component
│   ├── Card.js         # Card container component
│   ├── Input.js        # Form input component
│   └── index.js        # Component exports
├── navigation/          # Navigation configuration
│   └── AppNavigator.js # Tab-based navigation
├── screens/            # Screen components
│   ├── HomeScreen.js       # Clean time & daily reflections
│   ├── ProgressScreen.js   # Goals, mood, and meeting tracking
│   ├── CommunityScreen.js  # Challenges and support groups
│   ├── SponsorScreen.js    # Sponsor/sponsee management
│   ├── PrinciplesScreen.js # Meditation, gratitude, habits
│   └── LiteratureScreen.js # Resources and readings
└── theme/              # Design system
    ├── colors.js       # Color palette
    ├── typography.js   # Typography system
    └── index.js        # Theme configuration
```

## 🎨 Design System

### Color Palette

- **Primary**: Calming blues (#0ea5e9 and variants)
- **Secondary**: Encouraging greens (#22c55e and variants)
- **Accent**: Warm yellows (#eab308 and variants)
- **Recovery Themes**:
  - Serenity (light blue)
  - Gratitude (light amber)
  - Progress (light green)
  - Meditation (light purple)
  - Community (light pink)

### Typography

- **System fonts** for platform consistency
- **Hierarchical sizing** from 12px to 60px
- **Relaxed line heights** for comfortable reading
- **Special styles** for counters, affirmations, and milestones

### Components

- **Flexible Button** with multiple variants and sizes
- **Adaptive Card** with customizable shadows and styling
- **Feature-rich Input** with icons, validation, and helper text

## 🔧 Customization

The app is built with customization in mind:

### Theme Customization

Edit `src/theme/colors.js` and `src/theme/typography.js` to adjust the visual design.

### Adding Features

The modular structure makes it easy to add new screens and features:

1. Create new screen component in `src/screens/`
2. Add navigation route in `src/navigation/AppNavigator.js`
3. Use existing components from `src/components/` for consistency

### Backend Integration

Currently designed as a frontend-only app. To add backend functionality:

1. Add state management (Redux, Zustand, or Context API)
2. Integrate with Firebase, Supabase, or custom backend
3. Add authentication and data persistence

## 📋 Planned Enhancements

- **Backend Integration**: Firebase for data persistence and sync
- **Push Notifications**: Daily reminders and milestone celebrations
- **Offline Support**: Local data storage and sync when online
- **Social Features**: Enhanced community interactions
- **Accessibility**: Improved screen reader and navigation support
- **Internationalization**: Multi-language support

## 🤝 Contributing

This project is designed as scaffolding for your personal 12-step tracking app. Feel free to:

- Customize the design to match your preferences
- Add features specific to your recovery needs
- Integrate with your preferred backend solution
- Share improvements with the recovery community

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- The 12-step community for inspiration and guidance
- Recovery literature and principles that inform the app's philosophy
- The React Native and Expo communities for excellent development tools

---

**Remember**: Recovery is a personal journey. This app is designed to support your daily practice, but it's not a substitute for professional treatment, sponsorship, or meeting attendance. Always prioritize your recovery program and seek appropriate help when needed.
