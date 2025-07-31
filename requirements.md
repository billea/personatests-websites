# Project Requirements

This document outlines the functional and non-functional requirements for the project, based on the development changelog.

## Functional Requirements

### User and Authentication
- [ ] Implement basic Firebase Authentication for a user account system.

### Core Features

#### "Ask My Friends" Social Feature
- [x] Design and implement a viral "Ask My Friends" social feature (MVP).
- [x] Create a results dashboard for question creators.
- [ ] Integrate Firebase to replace `localStorage` for data persistence.
- [ ] Update the answer collection system with Firebase integration.
- [ ] Update the results dashboard with Firebase data retrieval.
- [ ] Extend EmailJS integration for sharing and notifications.

#### "360-Degree Assessment" Feature
- [x] Design and implement a comprehensive 360-degree assessment system.
- [x] Create a professional interface for collecting 360-degree feedback.
- [x] Build a comprehensive results dashboard with professional insights.
- [x] Update assessment language to be more social and friendly.
- [ ] Integrate Firebase to replace `localStorage` for data persistence.
- [ ] Extend EmailJS integration for feedback requests and notifications.

### Content and Test Management
- [x] Develop 5 viral service concepts.
- [x] Reorganize homepage tests into "Know Yourself" and "How Others See Me" categories.

### Communication
- [x] Implement EmailJS for the contact form.
- [x] Debug and fix contact form variable name mismatch.

### Internationalization & Localization
- [x] Add missing translation keys for the blog and contact navigation.
- [x] Add blog translations for all 9 supported languages.
- [ ] Add complete translations for the new category system.

### Monetization
- [x] Add Google AdSense verification code.
- [x] Fix all Google AdSense policy violations.
- [x] Conduct a comprehensive AdSense policy audit.
- [x] Fix duplicate AdSense verification code.
- [ ] Create a monetization system for premium features.

### Security
- [ ] Add input validation and security measures for all features.

### Marketing & Growth
- [ ] Add social media sharing optimization and viral mechanics.

## UI/UX Requirements

### Mobile Experience
- [x] Redesign mobile navigation with a hamburger menu.
- [x] Implement Gen Z-focused mobile UI improvements.
- [x] Conduct a comprehensive mobile QA audit.
- [x] Optimize `contact.html`, `about.html`, `faq.html`, and `privacy.html` for mobile.
- [x] Ensure mobile navigation consistency across all pages.
- [x] Fix critical mobile UX issues (e.g., desktop flags showing, limited scroll area).
- [x] Reduce mobile header height to optimize content viewing space.
- [x] Move the mobile language selector to the bottom for better UX.

### Desktop Experience
- [x] Fix visibility issues for Korean and Chinese flags in the language selector.
- [x] Fix Chinese language selector visibility issue.
- [x] Relocate the desktop language selector below the navigation bar.
- [x] Fix navigation alignment issues using consistent CSS.
- [x] Update the navigation menu to reflect new content categories.
- [x] Clean up the navigation menu by removing duplicate items.
- [x] Implement a dropdown navigation menu for tests.
- [x] Fix missing tests in the "Know Yourself" submenu.
- [x] Apply micro-improvements like visual separators and breadcrumb navigation.

## Backend & Infrastructure
- [x] Create a Firebase Social Service for data persistence for social features.

## Research & Pre-development
- [x] Research latest social media and viral content trends.
- [x] Analyze personality test market trends.

## Design
- use clean & Modern Minimalism and Bold & Expressive Typograhy properly.
- dark mode, light mode and system mode can be selected
- responsive design: well presented in mobile, tablet, and desktop view