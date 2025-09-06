# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual personality testing platform built with Next.js 15, React 19, Firebase, and TypeScript. The platform provides scientifically-backed personality assessments (MBTI, Big Five, Enneagram, 360° Feedback, and Couple Compatibility) with advanced features including social feedback, email invitations, and comprehensive multilingual support.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server (port 3004)
- `npm run dev:clean` - Clean cache and start dev server
- `npm run dev:stable` - Start stable development environment
- `npm run build` - Build production version
- `npm run start` - Start production build locally
- `npm run clean` - Clean cache and temporary files

### Testing Commands
- `npm test` - Run linter and build (basic validation)
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright tests with UI
- `npm run test:e2e:headed` - Run Playwright tests in headed mode
- `npm run test:install` - Install Playwright browsers

### Code Quality
- `npm run lint` - Run ESLint
- No separate format command (using Next.js defaults)

### Firebase Operations
- `npm run firebase:emulator` - Start Firebase emulators
- `npm run firebase:deploy` - Build and deploy to Firebase
- `npm run firebase:functions` - Deploy only Firebase Functions

## Technology Stack

### Frontend Architecture
- **Next.js 15** with App Router and locale-based routing (`/[locale]/page.tsx`)
- **React 19** with functional components and hooks
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling with glassmorphism design
- **Custom Translation Engine** with MutationObserver for dynamic content

### Backend & Services
- **Firebase Authentication** with Google OAuth provider
- **Firestore Database** for structured data storage
- **Firebase Functions** for serverless backend operations
- **EmailJS Integration** for automated email notifications

### Key Libraries
- `@emailjs/browser` - Email service integration
- `firebase` - Firebase SDK for web
- `@playwright/test` - End-to-end testing framework

## Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── auth/          # Authentication pages
│   │   ├── tests/         # Test-taking interface
│   │   ├── results/       # Results dashboard
│   │   └── feedback/      # External feedback forms
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── providers/         # Context providers (auth, translation)
│   ├── EmailSignup.tsx    # Email signup component
│   └── Header.tsx         # Navigation header
├── lib/                   # Core libraries and utilities
│   ├── firebase.ts        # Firebase configuration
│   ├── firestore.ts       # Database operations
│   ├── test-definitions.ts # Test configurations and scoring
│   └── translation-engine.js # Multilingual support
functions/                 # Firebase Functions
├── src/
│   └── index.ts          # Email and feedback processing
tests/                     # Playwright test files
public/
├── translations/          # JSON translation files (en.json, ko.json, etc.)
```

### Core Components and Systems

#### Test System (`src/lib/test-definitions.ts`)
- **Dynamic Test Engine**: Configurable tests with scoring algorithms
- **Test Categories**: Know Yourself, How Others See Me, Couple Compatibility  
- **Question Types**: Multiple choice, scale ratings (1-5), text input
- **Scoring Systems**: MBTI (binary choices), Big Five (scale), 360° feedback (aggregated)
- **Test Flow**: Selection → Progress tracking → Real-time scoring → Result storage

#### Translation Engine (`src/lib/translation-engine.js`)
- **Custom i18n System**: Pure JavaScript with DOM observation
- **MutationObserver**: Automatically translates dynamic content
- **Language Support**: English (default), Korean, Spanish, French with fallback
- **URL-based Localization**: `/[locale]/` routing pattern
- **Translation Keys**: Nested dot notation (e.g., `tests.mbti.title`)

#### Firebase Integration
- **Authentication**: Google OAuth with user profile creation
- **Database Collections**:
  - `users` - User profiles and preferences
  - `testResults` - Individual test completions with scoring
  - `invitations` - Feedback invitation tracking
  - `anonymousFeedback` - External feedback submissions
  - `compatibilityReports` - Partner analysis results
- **Functions**: Email notifications via EmailJS integration

#### 360° Feedback System
- **Invitation Workflow**: Email invitations with secure tokens
- **Anonymous Feedback**: External users can provide feedback without authentication
- **Token Security**: URL-based tokens with expiration and single-use validation
- **Aggregation**: Multiple feedback responses combined for insights

## Development Workflow

### Getting Started
1. Install dependencies: `npm install`
2. Install Firebase CLI: `npm install -g firebase-tools`
3. Install function dependencies: `cd functions && npm install`
4. Start development server: `npm run dev`
5. Access application at `http://localhost:3004`

### Testing Strategy
- **Unit Testing**: Not currently implemented (focused on integration testing)
- **E2E Testing**: Playwright tests for complete user workflows
- **Manual Testing**: Comprehensive testing guide in `TESTING_GUIDE.md`
- **Browser Testing**: Chrome, Firefox, Safari, and mobile viewports configured

### Firebase Development
- **Local Development**: Use Firebase emulators with `npm run firebase:emulator`
- **Function Testing**: Test email functions with local emulator
- **Database Rules**: Security rules prevent unauthorized access
- **Production Deploy**: `npm run firebase:deploy` for complete deployment

## Key Features and Implementation Details

### Personality Test Types
1. **MBTI Classic** - 20-question forced-choice test with binary scoring (E/I, S/N, T/F, J/P)
2. **Big Five** - 5-question scale-based assessment (Openness, Conscientiousness, etc.)
3. **Enneagram** - 3-question type identification system
4. **360° Feedback** - 20-question social assessment with email invitations
5. **Couple Compatibility** - 15-question relationship analysis with partner comparison

### Advanced Features
- **Progress Tracking**: Visual progress bars during test-taking
- **Dynamic Scoring**: Real-time result calculation with multiple algorithms
- **Email Notifications**: Automated invitations and feedback requests
- **Results Dashboard**: Historical test results with detailed analytics
- **Compatibility Analysis**: Partner comparison with relationship insights

### Multilingual Implementation
- **Language Detection**: Automatic browser language detection with manual override
- **Dynamic Translation**: MutationObserver-based DOM content translation
- **Fallback System**: English fallback for missing translations
- **URL Localization**: SEO-friendly locale-based routing
- **Cultural Adaptation**: Region-specific formatting and content

## Firebase Configuration

### Environment Setup
The project uses a pre-configured Firebase project `personatest-c8eb1`. For email functionality, Firebase Functions require EmailJS configuration:

```bash
firebase functions:config:set \
  emailjs.service_id="service_id" \
  emailjs.feedback_template_id="template_id" \
  emailjs.user_id="user_id" \
  emailjs.private_key="private_key"
```

### Database Security
- Users can only access their own test results
- Anonymous feedback requires valid invitation tokens
- Feedback responses are anonymous and cannot be traced to specific users
- Invitations expire after use to prevent unauthorized access

## Testing and Quality Assurance

### End-to-End Testing
- **Playwright Configuration**: Tests run on multiple browsers and mobile viewports
- **Test Scenarios**: Complete user workflows from authentication to result viewing
- **Base URL**: Tests run against `http://localhost:3004`
- **CI/CD**: Configured for continuous integration with retry logic

### Manual Testing Workflows
Refer to `TESTING_GUIDE.md` for comprehensive testing procedures:
- Authentication and user management
- Test-taking system validation
- 360° feedback workflow testing
- Multilingual support verification
- Error handling and edge cases

### Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement with React and TypeScript rules
- **Error Boundaries**: React error boundaries for graceful failure handling
- **Loading States**: Proper loading indicators for async operations

## Deployment and Production

### Build Process
1. Run tests: `npm test`
2. Build application: `npm run build`
3. Deploy functions: `npm run firebase:functions`
4. Deploy hosting: `npm run firebase:deploy`

### Production Considerations
- **Performance**: Optimized builds with Next.js production settings
- **Security**: Firebase security rules enforce data access controls
- **Monitoring**: Firebase Console provides error tracking and analytics
- **Scalability**: Serverless architecture scales automatically with usage

### Environment Variables
No client-side environment variables required. Firebase configuration is included in the codebase for the demo project. For production deployment, update `src/lib/firebase.ts` with your Firebase project configuration.

## Troubleshooting Common Issues

### Authentication Problems
- Ensure Google OAuth is enabled in Firebase Console
- Check browser popup blocking settings
- Verify Firebase project permissions and API keys

### Email Functionality
- Confirm EmailJS configuration in Firebase Functions
- Check EmailJS service status and template configuration
- Monitor Firebase Functions logs for email sending errors

### Translation Issues
- Verify translation JSON files exist in `public/translations/`
- Check browser console for missing translation key warnings
- Ensure MutationObserver is properly initialized

### Database Access
- Review Firestore security rules for proper user access
- Check Firebase Console for permission denied errors
- Verify user authentication state before database operations

This project represents a complete full-stack personality testing platform with advanced social features and comprehensive multilingual support, ready for production deployment and further enhancement.