# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multilingual personality testing platform built with Next.js 15, React 19, Firebase, and TypeScript. The platform provides scientifically-backed personality assessments (MBTI, Big Five, Enneagram, 360° Feedback, and Couple Compatibility) with advanced features including social feedback, email invitations, and comprehensive multilingual support.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server (default port 3000)
- `npm run dev:clean` - Clean cache and start dev server
- `npm run dev:stable` - Start ultra-stable development environment (Windows batch script with enhanced stability)
- `npm run build` - Build production version (generates static export in `/out` directory)
- `npm run start` - Start production build locally
- `npm run clean` - Clean Next.js cache and temporary files (runs cache-cleanup.js script)

### Single Test Execution
- For E2E tests: `npx playwright test tests/specific-test.spec.ts`
- For specific browser: `npx playwright test --project=chromium`
- For debug mode: `npx playwright test --debug tests/specific-test.spec.ts`

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
- `npm run firebase:emulator` - Start Firebase emulators for local development
- `npm run firebase:deploy` - Build and deploy to Firebase (includes functions and hosting)
- `npm run firebase:functions` - Deploy only Firebase Functions
- `cd functions && npm run deploy` - Deploy functions from functions directory
- `firebase functions:log` - View Firebase Functions logs

## Technology Stack

### Frontend Architecture
- **Next.js 15** with App Router and locale-based routing (`/[locale]/page.tsx`)
- **Static Export Configuration** for Netlify deployment (`output: 'export'`)
- **React 19** with functional components and hooks
- **TypeScript** with strict type checking and path aliases (`@/*` → `./src/*`)
- **Tailwind CSS 4** for styling with glassmorphism design
- **Custom Translation Engine** with MutationObserver for dynamic content

### Backend & Services
- **Firebase Authentication** with Google OAuth provider
- **Firestore Database** for structured data storage
- **Firebase Functions** for serverless backend operations
- **EmailJS Integration** for automated email notifications

### Key Libraries
- `@emailjs/browser` - Email service integration for feedback invitations
- `firebase` - Firebase SDK for web (v12.2.1)
- `@playwright/test` - End-to-end testing framework with multi-browser support
- `@tailwindcss/postcss` - PostCSS plugin for Tailwind CSS 4

### Critical Architecture Patterns
- **Static Export**: Uses `output: 'export'` in `next.config.js` - NO server-side rendering, all pages are pre-rendered at build time for Netlify hosting
- **Dynamic Routing**: `[locale]` folder structure handles internationalization (e.g., `/en/tests`, `/ko/tests`)
- **TypeScript Path Aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json)
- **Windows Optimization**: Development mode uses polling-based file watching (500ms) and disabled webpack caching to prevent infinite rebuild loops
- **Cache Busting**: Build IDs include timestamps (`DIRECT-FALLBACK-FIX-${Date.now()}`) to force fresh translation loading

## Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── auth/          # Authentication pages
│   │   ├── tests/         # Test-taking interface
│   │   │   └── [testId]/  # Dynamic test pages
│   │   ├── results/       # Results dashboard
│   │   ├── feedback/      # External feedback forms
│   │   ├── profile/       # User profile management
│   │   ├── welcome/       # Welcome/onboarding pages
│   │   └── debug-*/       # Development debug pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Root redirect to locale
├── components/            # React components
│   ├── providers/         # Context providers (auth, translation)
│   │   ├── auth-provider.tsx    # Firebase auth context
│   │   └── translation-provider.tsx # Translation context
│   ├── EmailSignup.tsx    # Email signup component
│   ├── Header.tsx         # Navigation header
│   └── error-boundary.tsx # React error boundary
├── lib/                   # Core libraries and utilities
│   ├── firebase.ts        # Firebase configuration
│   ├── firestore.ts       # Database operations and schemas
│   ├── test-definitions.ts # Test configurations and scoring algorithms
│   └── translation-engine.js # Custom i18n with MutationObserver
functions/                 # Firebase Functions (Node.js 20)
├── src/
│   └── index.ts          # Email and feedback processing functions
├── package.json          # Separate dependencies for functions
tests/                     # Playwright test files
public/
├── translations/          # JSON translation files (en.json, ko.json, etc.)
└── favicon.ico           # Static assets
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
2. Install Firebase CLI globally: `npm install -g firebase-tools`
3. Install function dependencies: `cd functions && npm install && cd ..`
4. Install Playwright browsers: `npm run test:install`
5. Start development server: `npm run dev` (use `npm run dev:stable` on Windows if experiencing cache issues)
6. Access application at `http://localhost:3000` (Playwright tests use port 3004 via `webServer` config)

### Critical Configuration Notes
- **Static Export Mode**: `output: 'export'` means NO server-side APIs, Firebase Functions, or dynamic API routes work during build - only client-side Firebase SDK calls work
- **Playwright Port**: Tests configured for port 3004 in `playwright.config.ts` but dev server runs on port 3000 by default - Playwright auto-starts the server
- **Functions Deployment**: Node.js 20 runtime with separate `package.json` in `/functions` directory - deployed separately via `npm run firebase:functions`
- **Translation Cache**: Translation files loaded with nuclear cache-busting (`nuclear-${timestamp}-${random}-${sessionId}`) to prevent stale translations in development
- **Windows Development**: If experiencing infinite rebuild loops, use `npm run dev:stable` which runs the `dev-ultra-stable.bat` script

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

### End-to-End Testing with Playwright
- **Test Configuration**: `playwright.config.ts` defines 5 projects (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- **Auto Dev Server**: Playwright runs `npm run dev` automatically before tests and waits for `http://localhost:3004`
- **Single Test Execution**: `npx playwright test tests/auth.spec.ts --project=chromium` for targeted testing
- **Interactive Mode**: `npm run test:e2e:ui` opens Playwright UI for debugging and watching tests
- **CI Mode**: Retries failing tests 2 times on CI, runs serially (workers: 1) to avoid race conditions

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
1. Run tests: `npm test` (linting + build validation)
2. Build application: `npm run build` (generates static export in `/out` directory)
3. Deploy functions: `npm run firebase:functions`
4. Deploy hosting: `npm run firebase:deploy` (includes build step)

### Development Scripts and Utilities
- **cache-cleanup.js**: Cleans Next.js cache and temporary files
- **dev-ultra-stable.bat**: Windows batch script for ultra-stable development environment
- **Debug Scripts**: Multiple JavaScript debug files for testing specific features
- **Validation Scripts**: QA and validation scripts for production testing

### Production Considerations
- **Performance**: Optimized builds with Next.js production settings
- **Security**: Firebase security rules enforce data access controls
- **Monitoring**: Firebase Console provides error tracking and analytics
- **Scalability**: Serverless architecture scales automatically with usage

### Environment Variables
No client-side environment variables required. Firebase configuration is included in the codebase for the demo project (`personatest-c8eb1`). For production deployment, update `src/lib/firebase.ts` with your Firebase project configuration.

### Platform-Specific Notes
- **Windows Development**: Enhanced compatibility with polling-based file watching and aggressive cache management
- **Netlify Deployment**: Configured for static export with `netlify.toml` for routing
- **Cache Strategy**: Build IDs include timestamps to prevent infinite loop issues in development

## Critical Development Notes

### Test System Architecture (`src/lib/test-definitions.ts`)
All personality tests are defined as TypeScript objects with this structure:
- **Test Definition**: Interface with `id`, `category`, `title_key`, `questions[]`, `scoring()` function
- **Question Types**: `multiple_choice` (MBTI binary), `scale` (1-5 rating for Big Five), `text` (open-ended)
- **Scoring Functions**: Pure functions taking `answers` object, returning `TestResult` with scores and type
- **Translation Keys**: All text uses dot notation keys (e.g., `tests.mbti.questions.q1`) resolved by `translation-engine.js`
- **No Database Storage**: Test questions are code-defined, not stored in Firestore - only results are persisted

**Adding New Tests**: Define in `test-definitions.ts` → export from `TEST_REGISTRY` → automatically appears in UI

### Translation System Implementation (`src/lib/translation-engine.js`)
Custom i18n system built from scratch (not using next-intl or i18next):
- **MutationObserver**: Watches DOM and auto-translates any element with `data-translate="key.path"` attribute
- **Client-Side Only**: Translation JSON files loaded via fetch from `public/translations/{lang}.json`
- **Fallback Chain**: Requested language → English → display key if translation missing
- **URL Routing**: Next.js `[locale]` dynamic route segments handle language switching (e.g., `/en/tests`, `/ko/tests`)
- **Cache Busting**: Files loaded with `nuclear-${timestamp}-${random}` query params to force fresh loads in development

**Adding Translations**: Edit `public/translations/en.json` (source of truth) → copy structure to other language files

### Firebase Architecture Specifics
- **Security Rules**: Users can only access their own data, feedback requires valid tokens
- **Functions Environment**: EmailJS configuration stored in Firebase Functions config, not environment variables
- **Database Schema**: Structured collections for users, testResults, invitations, and anonymousFeedback
- **Authentication Flow**: Google OAuth only, with automatic user profile creation

## Troubleshooting Common Issues

### Development Environment
- **Infinite Rebuild Loops**: Run `npm run dev:stable` (Windows batch script disables aggressive caching)
- **Stale Cache**: Run `npm run clean` to delete `.next` cache directory
- **Build Failures**: Check if `functions/` directory Node.js version matches (requires Node.js 20)
- **Port Already in Use**: Kill process on port 3000 or set custom port: `PORT=3005 npm run dev`

### Translation Not Updating
- Translation files cached despite nuclear cache-busting? Check `public/translations/` files are actually modified
- Missing keys show in console as warnings - check browser DevTools console for `Translation key not found`
- MutationObserver watches DOM changes - if translations aren't applying, check `translation-engine.js` initialization

### Authentication & Firebase
- Google OAuth popup blocked? Check browser settings and Firebase Console authorized domains
- "Permission denied" errors? Review Firestore security rules - users can only access their own `testResults`
- EmailJS not working? Verify Firebase Functions config: `firebase functions:config:get` should show emailjs keys

### Testing Issues
- Playwright can't find dev server? It auto-starts on port 3004 - check `playwright.config.ts` webServer config
- Tests timing out? Increase `timeout` in test files or use `--timeout=60000` flag
- Single test execution: Use `npx playwright test <file> --project=chromium --headed --debug` for step-through debugging

This project represents a complete full-stack personality testing platform with advanced social features and comprehensive multilingual support, ready for production deployment and further enhancement.