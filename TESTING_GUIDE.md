# 🧪 Complete Testing Guide - All Workflows

## 🚀 **Quick Start Testing (2 Minutes)**

### Essential Setup
```bash
cd app
npm install
npm run dev
# Visit: http://localhost:3000 (auto-redirects to /en)
```

### ⚡ **Rapid Workflow Test**
1. **Sign In** → Click "Sign In with Google" → Complete OAuth
2. **Take Test** → "Take a Test" → "MBTI Personality Test" → Answer 4 questions
3. **View Results** → "View My Results" → Click "View Details" → Verify MBTI type displayed
4. **Test Feedback** → Take "360° Feedback Assessment" → Add email → "Send Invitations"

**✅ Success Indicators**: Authentication working, tests completing, results saving, emails sending

---

## 🔐 **Workflow 1: Authentication & User Management**

### 🎯 **Core Authentication Flow**
**Purpose**: Verify user sign-in, profile creation, and session management

#### Test Sequence:
1. **Initial State Check**
   - Navigate to `http://localhost:3000/en`
   - Verify "You are not signed in" message appears
   - Confirm "Sign In with Google" button is present

2. **Google OAuth Login**
   - Click "Sign In with Google" 
   - Complete Google OAuth flow (use real Google account)
   - Allow all requested permissions

3. **Post-Login Verification**
   - Verify "Welcome, [Your Name]!" message
   - Confirm "View My Results" button appears
   - Check language switcher functionality
   - Test "Sign Out" button

#### ✅ **Success Criteria**:
- OAuth popup opens without browser blocking
- User profile displays correctly with name/email
- Firestore `users` collection contains new user document
- Session persists across page refreshes
- Sign out functionality works properly

#### 🚨 **Troubleshooting**:
```bash
# Common Issues & Solutions:
"popup-blocked" → Enable popups for localhost
"auth/network-request-failed" → Check internet connection
"auth/popup-closed-by-user" → Retry authentication
No user profile → Check Firestore security rules
```

#### 📊 **Database Verification**:
Check Firestore Console → `users` collection:
```javascript
{
  uid: "generated-user-id",
  email: "user@gmail.com",
  displayName: "User Name",
  preferredLanguage: "en",
  createdAt: firebase_timestamp
}
```

---

## 📝 **Workflow 2: Test Taking & Scoring System**

### 🎯 **Interactive Test Experience**  
**Purpose**: Verify complete test-taking workflow with real-time progress and accurate scoring

#### Test Sequence:

1. **Test Discovery & Selection**
   - Navigate to `/en/tests` or click "Take a Test"
   - Verify three categories display:
     - **Know Yourself**: Personal assessment tests
     - **How Others See Me**: Social feedback tests (marked "Requires Feedback")
     - **Couple Compatibility**: Relationship tests (marked "Compatibility Test")

2. **MBTI Test Execution**
   - Click "MBTI Personality Test"
   - Verify test loads with progress bar (0%)
   - Answer Question 1: "How do you prefer to recharge your energy?"
     - Select either Extroversion or Introversion option
   - Verify progress updates to 25%
   - Continue through all 4 questions:
     - Energy (E/I), Information (S/N), Decisions (T/F), Organization (J/P)
   - Watch progress bar advance to 100%

3. **Test Completion & Scoring**
   - Verify "Test Completed!" screen appears
   - Check for MBTI type calculation (e.g., "ENFP", "ISTJ")
   - Verify completion message displays
   - Click "View My Results"

4. **Result Verification**
   - Confirm test appears in results dashboard
   - Click "View Details" to expand
   - Verify sections appear:
     - **Your Results**: MBTI type and trait breakdown
     - **Your Answers**: Complete question-answer history

#### ✅ **Success Criteria**:
- All questions load with proper translations
- Progress bar updates accurately (25%, 50%, 75%, 100%)
- MBTI scoring algorithm works correctly
- Results save automatically to database
- Navigation buttons function properly

#### 📊 **Scoring Verification**:
Test with known combinations:
```bash
# Test Combinations to Try:
E+N+T+P = ENTP (The Debater)
I+S+F+J = ISFJ (The Protector) 
E+S+T+J = ESTJ (The Executive)
I+N+F+P = INFP (The Mediator)
```

#### 🗃️ **Database Validation**:
Check Firestore Console → `testResults` collection:
```javascript
{
  userId: "user-firebase-uid",
  testId: "mbti-classic",
  resultPayload: {
    answers: {
      "mbti_1": "E",  // Extroversion
      "mbti_2": "N",  // Intuition
      "mbti_3": "T",  // Thinking
      "mbti_4": "P"   // Perceiving
    },
    result: {
      scores: { E: 1, I: 0, S: 0, N: 1, T: 1, F: 0, J: 0, P: 1 },
      type: "ENTP",
      traits: ["ENTP"]
    },
    completedAt: "2025-08-10T..."
  },
  isPublic: false,
  createdAt: firebase_timestamp
}
```

#### 🚨 **Edge Case Testing**:
- Test without authentication (should redirect to sign-in)
- Test with slow internet connection (loading states)
- Test browser back/forward during test (state preservation)
- Test page refresh mid-test (should restart or save progress)

---

## 📊 **Workflow 3: Results Dashboard & Analytics**

### 🎯 **Comprehensive Results Management**
**Purpose**: Verify results display, detailed analytics, and historical data tracking

#### Test Sequence:

1. **Results Page Access**
   - Navigate to `/en/results` or click "View My Results"  
   - Verify authentication check (redirect if not signed in)
   - Confirm page title "My Test Results" displays

2. **Results Overview Verification**
   - Check summary statistics: "Total tests completed: X"
   - Verify each test displays:
     - **Test name** (e.g., "MBTI Personality Test")
     - **Completion date** (formatted in current language)
     - **Question count** and **status indicators**
     - **Test type badges** (Feedback-enabled, Compatibility Test)

3. **Detailed Results Analysis**
   - Click "View Details" on any test result
   - Verify expansion shows multiple sections:
     - **Your Results**: Calculated personality type/scores
     - **Feedback Summary**: If applicable (number of responses)  
     - **Your Answers**: Complete question-answer breakdown
   - Test "Hide Details" toggle functionality

4. **Pending Invitations Monitor**
   - Complete a feedback test to generate invitations
   - Verify "Pending Feedback Invitations" section appears
   - Check invitation details:
     - Test name and participant email
     - Status indicator ("Waiting for response")
     - Creation timestamp

#### ✅ **Success Criteria**:
- Results load within 3 seconds
- All test data displays accurately  
- Detailed analytics expand/collapse smoothly
- Historical data sorts chronologically (newest first)
- Feedback integration shows aggregated data
- Navigation buttons function correctly

#### 📈 **Analytics Verification**:
For MBTI results, verify display shows:
```javascript
// Your Results Section
{
  type: "ENFP",           // Personality type clearly displayed
  scores: {               // Score breakdown
    E: 1, I: 0,          // Energy preference  
    S: 0, N: 1,          // Information preference
    T: 0, F: 1,          // Decision preference
    J: 0, P: 1           // Organization preference
  },
  traits: ["ENFP"]       // Associated traits
}

// Your Answers Section  
{
  "mbti_1": "By being around people and socializing",
  "mbti_2": "Focus on patterns and possibilities", 
  "mbti_3": "Considering people and values",
  "mbti_4": "Staying flexible and keeping options open"
}
```

#### 🕒 **Historical Data Testing**:
- Complete multiple tests to verify chronological ordering
- Check date formatting in different languages
- Verify test count accuracy across sessions
- Test results persistence across sign-out/sign-in

#### 📱 **Responsive Design Testing**:
- Test on mobile device (or browser dev tools)
- Verify results cards stack properly
- Check button accessibility on touch devices
- Ensure readable text sizes across screen sizes

---

## 📧 **Workflow 4: 360° Feedback System**

### 🎯 **Social Feedback Integration**
**Purpose**: Verify complete social feedback workflow from invitation to aggregated insights

#### **Phase A: Feedback Test Completion**

1. **Feedback Test Selection**
   - Navigate to `/en/tests`
   - Locate "360° Feedback Assessment" (marked "Requires Feedback")
   - Click to start test

2. **Scale-Based Assessment**
   - Complete 3 questions using 1-5 scale:
     - **Question 1**: "This person communicates effectively with others"
     - **Question 2**: "This person demonstrates strong leadership qualities"  
     - **Question 3**: "This person handles conflict well"
   - Select ratings (try different combinations: 5,4,3 or 2,3,4)
   - Verify progress bar advances correctly

3. **Invitation Setup**
   - Verify "Invite Others for Feedback" section appears
   - Enter test email addresses (use accessible emails):
     - Enter first email address
     - Click "Add Another Email" 
     - Add 2-3 total email addresses
   - Click "Send Invitations"
   - Verify success message and redirect to results

#### **Phase B: Invitation Management**

1. **Invitation Tracking**
   - Navigate to results page (`/en/results`)
   - Verify "Pending Feedback Invitations" section displays
   - Check invitation details show:
     - Test name: "360° Feedback Assessment"
     - All invited email addresses
     - Status: "Waiting for response"
     - Timestamp of invitation sent

2. **Email Delivery Verification**
   - Check email inboxes for invitation emails
   - Verify email contains:
     - Sender name in subject/body
     - Clear feedback request message
     - Secure feedback link with token
     - Professional email formatting

#### **Phase C: External Feedback Submission**

1. **Feedback Form Access**
   - Click feedback link from email
   - Verify redirect to `/en/feedback/[invitationId]?token=xxx`
   - Confirm no authentication required
   - Check page displays inviter's name

2. **Anonymous Feedback Completion**
   - Verify feedback form shows same 3 questions
   - Questions should be framed about the inviter:
     - "[Name] communicates effectively with others"
     - "[Name] demonstrates strong leadership qualities"
     - "[Name] handles conflict well"
   - Complete all questions (use different ratings than self-assessment)
   - Verify progress tracking works

3. **Submission Verification**
   - Click final answer to submit
   - Verify "Thank You!" confirmation page
   - Check confirmation message mentions inviter's name
   - Verify anonymity assurance is displayed

#### **Phase D: Feedback Aggregation**

1. **Results Integration**
   - Return to original user's results page
   - Refresh page to see updates
   - Verify test result now shows:
     - "Feedback: 1 responses" (or number submitted)
     - Green feedback indicator

2. **Aggregated Analytics**
   - Click "View Details" on feedback test
   - Verify "Feedback Summary" section appears
   - Check aggregated data displays:
     - Number of feedback responses received
     - Submission timestamps
     - Combined insights (if multiple responses)

#### ✅ **Success Criteria**:
- Email invitations send successfully via Firebase Functions
- External feedback forms work without authentication
- Token-based security prevents unauthorized access
- Feedback aggregates properly in results dashboard
- Anonymity is maintained (no respondent identification)

#### 🔗 **Integration Testing**:
```bash
# Test Scenarios:
Single feedback: 1 invitation → 1 response → aggregated display
Multiple feedback: 3 invitations → 2 responses → proper counting
Invalid token: Modified URL → error message displayed
Expired invitation: Old link → appropriate error handling
```

#### 📊 **Database Verification**:
Check Firestore collections for proper data flow:

**`invitations` Collection:**
```javascript
{
  inviterUid: "user-id",
  inviterName: "Test User",
  testId: "360-feedback", 
  testResultId: "result-doc-id",
  participantEmail: "friend@example.com",
  status: "completed",
  invitationToken: "secure-random-token",
  createdAt: timestamp,
  completedAt: timestamp
}
```

**`anonymousFeedback` Collection:**
```javascript
{
  invitationId: "invitation-doc-id",
  feedbackPayload: {
    answers: {
      "feedback_1": 4,  // Communication rating
      "feedback_2": 3,  // Leadership rating  
      "feedback_3": 5   // Conflict handling rating
    },
    result: {
      scores: { overall: 4.0 },
      traits: ["communication", "leadership", "conflict-resolution"]
    },
    aboutPerson: "Test User"
  },
  submittedAt: timestamp
}
```

#### 🚨 **Security Testing**:
- Test with invalid/modified invitation tokens
- Verify completed invitations can't be resubmitted  
- Check that feedback can't be accessed without proper token
- Confirm no personal information leaks in anonymous feedback

---

## 💕 **Workflow 5: Compatibility Testing & Analysis**

### 🎯 **Relationship Assessment System**
**Purpose**: Verify couple compatibility tests and automated relationship analysis

#### **Phase A: Love Languages Assessment**

1. **Compatibility Test Access**
   - Navigate to `/en/tests` 
   - Locate "Love Languages Assessment" (marked "Compatibility Test")
   - Verify pink badge indicates compatibility test
   - Click to start test

2. **Love Language Questions**
   - **Question 1**: "What makes you feel most loved?"
     - Test each option: Quality Time, Physical Touch, Words of Affirmation, Acts of Service, Receiving Gifts
   - **Question 2**: "How important is physical affection to you?" (1-5 scale)
     - Test different scale values
   - Verify progress tracking and question navigation

3. **Results Analysis**
   - Complete test and verify completion screen
   - Check results show identified primary love language
   - Verify result saved with compatibility flag
   - Navigate to results dashboard

#### **Phase B: Partner Assessment Simulation**

1. **Create Partner Results** (For Testing)
   - Sign out and create second test account OR
   - Use different browser/incognito mode
   - Complete same love language test with different answers
   - Note second result ID for compatibility testing

2. **Compatibility Report Generation**
   - Return to first account
   - Access compatibility report generation (if implemented)
   - OR manually test compatibility algorithm with both results

#### **Phase C: Relationship Insights**

1. **Compatibility Analysis**
   - Verify compatibility scoring algorithm works
   - Check relationship insights generation:
     - Overall compatibility percentage
     - Relationship strengths identification
     - Communication challenges analysis
     - Recommendations for improvement

2. **Report Display**
   - Verify compatibility report formatting
   - Check visual compatibility indicators
   - Test report sharing capabilities (if implemented)
   - Confirm report saves to database

#### ✅ **Success Criteria**:
- Love language test completes with accurate scoring
- Primary love language correctly identified
- Compatibility algorithms calculate properly
- Results marked as "Compatibility Test" in dashboard
- Report generation functions (when implemented)

#### 🔬 **Algorithm Testing**:
Test different love language combinations:
```bash
# Test Compatibility Scenarios:
Same Primary Language: Quality Time + Quality Time = High Compatibility
Complementary Languages: Acts of Service + Receiving Gifts = Good Compatibility
Different Categories: Physical Touch + Words of Affirmation = Moderate Compatibility
Opposing Patterns: Individual scores + partner scores = compatibility analysis
```

#### 📊 **Database Verification**:
**`testResults` for Compatibility Tests:**
```javascript
{
  userId: "user-id",
  testId: "relationship-strengths",
  resultPayload: {
    answers: {
      "rel_1": "quality_time",     // Primary love language selection
      "rel_2": 4                   // Physical affection importance rating
    },
    result: {
      scores: {
        quality_time: 3,
        physical_touch: 1,
        words_of_affirmation: 0,
        acts_of_service: 0,
        receiving_gifts: 0
      },
      description_key: "tests.relationship.results.quality_time",
      traits: ["quality_time"]
    }
  },
  isPublic: false,
  createdAt: timestamp
}
```

**`compatibilityReports` Collection (When Generated):**
```javascript
{
  result1_id: "first-partner-result-id",
  result2_id: "second-partner-result-id", 
  generatedBy: "user-id",
  reportPayload: {
    overallCompatibility: 78,              // Percentage score
    strengths: [
      "Strong communication foundation",
      "Shared core values",
      "Complementary personality traits"
    ],
    challenges: [
      "Different conflict resolution styles",
      "Varying social energy levels"
    ],
    recommendations: [
      "Focus on active listening during disagreements",
      "Establish regular check-ins about relationship goals",
      "Respect each other's different social needs"
    ],
    generatedAt: "2025-08-10T..."
  },
  createdAt: timestamp
}
```

#### 🧪 **Advanced Testing**:
- Test with identical love language profiles (high compatibility)
- Test with completely different profiles (challenge identification)
- Verify recommendation algorithms provide actionable advice
- Test report generation with multiple compatibility factors

---

## 🌍 **Workflow 6: Multilingual Support & Localization**

### 🎯 **International User Experience**
**Purpose**: Verify complete multilingual functionality and cultural adaptation

#### **Phase A: Language Detection & Switching**

1. **Initial Language Detection**
   - Visit base URL `http://localhost:3000`
   - Verify auto-redirect to `/en` (default locale)
   - Check browser language detection (if implemented)
   - Confirm URL structure includes language code

2. **Manual Language Switching**
   - Test each language button on homepage:
     - **English** → `/en` → Verify full English content
     - **Spanish** → `/es` → Check Spanish translations  
     - **French** → `/fr` → Verify French content
     - **Korean** → `/ko` → Test Korean character display
   - Confirm URL changes without page reload
   - Verify language state persists across navigation

3. **Translation Engine Performance**  
   - Switch languages rapidly (stress test)
   - Verify no loading delays or flickering
   - Check memory usage doesn't accumulate
   - Test translation engine on slow connections

#### **Phase B: Content Localization Testing**

1. **Test Interface Localization**
   - Navigate through all major pages in each language:
     - Homepage (`/[locale]`)
     - Tests page (`/[locale]/tests`)
     - Results page (`/[locale]/results`)
   - Verify UI elements translate: buttons, labels, messages
   - Check form validation messages in correct language

2. **Test Content Localization**
   - Test titles and descriptions update properly
   - Verify test questions display in selected language
   - Check result interpretations use correct language
   - Confirm error messages appear in user's language

3. **Date & Number Formatting**
   - Complete tests in different languages
   - Check date formatting matches locale conventions:
     - English: MM/DD/YYYY format
     - French: DD/MM/YYYY format  
     - Korean: YYYY-MM-DD format
   - Verify number formatting (decimals, thousands separators)

#### **Phase C: Cross-Language Functionality**

1. **Test Taking in Multiple Languages**  
   - Complete MBTI test in English
   - Switch to Spanish and take 360° Feedback test
   - Return to Korean and check results display
   - Verify all results appear regardless of test language

2. **Results Language Consistency**
   - Take test in Spanish (`/es/tests/mbti-classic`)
   - View results in French (`/fr/results`)
   - Verify results display correctly in current language
   - Check that switching languages updates result display

3. **Feedback System Multilingual**
   - Send feedback invitations while in Korean language
   - Receive feedback in Spanish language interface
   - Verify email communications respect language preferences
   - Check aggregated results display in user's current language

#### ✅ **Success Criteria**:
- Language switching works instantly without page reload
- URLs correctly reflect language choice (`/en`, `/es`, `/fr`, `/ko`)
- All UI elements translate where translations exist
- Fallback to English works for missing translations
- Test functionality works identically across all languages
- Date/number formatting respects locale conventions

#### 🔤 **Translation Coverage Testing**:
Verify key translation paths work:
```bash
# Critical Translation Keys to Test:
hero.title → "Discover Your Personality ✨"
tests.mbti.title → "MBTI Personality Test"
test.completed_title → "Test Completed!"  
results.page_title → "My Test Results"
tests.categories.know_yourself → "Know Yourself"
```

#### 📱 **Character Set & Display Testing**:
- **Korean**: Test Korean characters display properly (한글)
- **Japanese**: Verify Japanese characters if supported (日本語)
- **Chinese**: Check Chinese character rendering (中文)
- **Spanish**: Test accented characters (español, ñ, ü)
- **French**: Verify French accents (français, é, ç, ü)

#### 🌐 **URL & SEO Testing**:
- Test direct access to localized URLs:
  - `http://localhost:3000/es/tests/mbti-classic`
  - `http://localhost:3000/fr/results`
  - `http://localhost:3000/ko/tests`
- Verify 404 handling for invalid language codes
- Check canonical URL structure for SEO

#### 🔄 **Translation Engine Technical Testing**:
1. **MutationObserver Performance**
   - Add dynamic content and verify automatic translation  
   - Test with large amounts of text
   - Check performance with frequent DOM changes

2. **Translation Key Fallbacks**
   - Test with missing translation keys
   - Verify fallback to English works
   - Check console for translation warnings

3. **Memory Management**
   - Switch languages repeatedly (20+ times)
   - Monitor memory usage in browser dev tools
   - Verify no memory leaks in translation engine

---

## 🔧 **Error Handling & Edge Cases**

### 🎯 **Robustness & Security Testing**
**Purpose**: Verify application handles errors gracefully and maintains security

#### **Authentication Edge Cases**

1. **Mid-Session Authentication Loss**
   - Sign in and start taking a test
   - Open browser dev tools → Application → Storage → Clear all data
   - Continue with test and verify graceful handling
   - Expected: Redirect to sign-in with session restoration

2. **Unauthorized Access Attempts**
   - Sign out completely
   - Try accessing `/en/results` directly
   - Try accessing `/en/tests/mbti-classic` directly
   - Expected: Redirect to homepage with authentication prompt

3. **Token Manipulation** 
   - Access valid feedback URL: `/en/feedback/[id]?token=valid-token`
   - Modify token in URL to invalid value
   - Expected: "Invalid invitation link" error page
   - Try accessing without token parameter
   - Expected: "Invalid invitation link" error page

#### **Network & Connectivity Issues**

1. **Offline Behavior Testing**
   - Start taking a test online
   - Disable internet connection (dev tools → Network → Offline)
   - Try to submit answers
   - Expected: Appropriate offline message, retry mechanism

2. **Slow Connection Simulation**
   - Dev tools → Network → Slow 3G
   - Navigate through application
   - Verify loading states appear appropriately
   - Check timeout handling for long requests

3. **Firebase Service Interruption**
   - Simulate Firebase downtime (modify Firebase config temporarily)
   - Test authentication, database reads/writes
   - Expected: Clear error messages, retry options

#### **Data Validation & Integrity**

1. **Invalid Test IDs**
   - Access `/en/tests/nonexistent-test-id`
   - Expected: "Test Not Found" message with navigation options
   - Verify redirect to tests page

2. **Malformed Data Scenarios**
   - Interrupt test mid-way (close browser, kill process)
   - Return and check for data consistency
   - Verify no corrupted test results saved

3. **Database Permission Testing**
   - Temporarily modify Firestore rules (restrict access)
   - Try to save test results
   - Expected: Clear permission error messages

#### **UI & UX Edge Cases**

1. **Rapid User Actions**
   - Click buttons rapidly (double-click, spam-click)
   - Verify no duplicate submissions or state corruption
   - Test form validation with rapid input

2. **Browser Compatibility**
   - Test in different browsers (Chrome, Firefox, Safari, Edge)
   - Check for JavaScript errors in console
   - Verify consistent functionality across browsers

3. **Mobile & Touch Device Testing**
   - Test on mobile devices or browser mobile simulation
   - Verify touch interactions work properly
   - Check responsive design edge cases

#### ✅ **Error Recovery Testing**:
```bash
# Test Error Recovery Scenarios:
Network failure → Show retry button → Success on retry
Invalid data → Clear error message → User can correct and continue
Authentication failure → Redirect to login → Restore user session
Database timeout → Loading indicator → Fallback or retry mechanism
```

#### 🚨 **Security Validation**:
- Test CSRF protection on form submissions
- Verify no sensitive data in browser console logs  
- Check for XSS vulnerabilities in user input fields
- Validate proper sanitization of feedback responses
- Test rate limiting on invitation sending

---

## 📊 **Database Verification & Monitoring**

### 🎯 **Complete Database Validation**
**Purpose**: Verify data integrity, relationships, and proper storage across all collections

#### **Firestore Collections Overview**

Access Firebase Console → Firestore Database to verify:

1. **`users` Collection**
   ```javascript
   // Document ID: Firebase Auth UID
   {
     uid: "firebase-user-uid",
     email: "testuser@gmail.com", 
     displayName: "Test User",
     preferredLanguage: "en",
     createdAt: firebase_timestamp
   }
   ```
   **Validation**: User created on first sign-in, language preference stored

2. **`testResults` Collection**
   ```javascript  
   // Document ID: Auto-generated
   {
     userId: "firebase-user-uid",
     testId: "mbti-classic", 
     resultPayload: {
       answers: {
         "mbti_1": "E", "mbti_2": "N", "mbti_3": "T", "mbti_4": "P"
       },
       result: {
         scores: { E: 1, I: 0, S: 0, N: 1, T: 1, F: 0, J: 0, P: 1 },
         type: "ENTP",
         traits: ["ENTP"]
       },
       completedAt: "2025-08-10T15:30:00.000Z"
     },
     isPublic: false,
     createdAt: firebase_timestamp
   }
   ```
   **Validation**: Results save immediately after test completion, proper scoring calculation

3. **`invitations` Collection (Feedback Tests)**
   ```javascript
   // Document ID: Auto-generated  
   {
     inviterUid: "firebase-user-uid",
     inviterName: "Test User",
     testId: "360-feedback",
     testResultId: "test-result-doc-id", 
     participantEmail: "friend@example.com",
     status: "pending", // or "completed"
     invitationToken: "secure-random-token-string",
     createdAt: firebase_timestamp,
     completedAt: firebase_timestamp // when feedback submitted
   }
   ```
   **Validation**: Created when sending feedback invitations, status updates on completion

4. **`anonymousFeedback` Collection**
   ```javascript
   // Document ID: Auto-generated
   {
     invitationId: "invitation-doc-id",
     feedbackPayload: {
       answers: {
         "feedback_1": 4, "feedback_2": 3, "feedback_3": 5
       },
       result: {
         scores: { overall: 4.0 },
         traits: ["communication", "leadership", "conflict-resolution"] 
       },
       aboutPerson: "Test User"
     },
     submittedAt: firebase_timestamp
   }
   ```
   **Validation**: Anonymous feedback stored without personal identifiers

5. **`compatibilityReports` Collection (If Generated)**
   ```javascript
   // Document ID: Auto-generated
   {
     result1_id: "first-partner-result-id",
     result2_id: "second-partner-result-id",
     generatedBy: "firebase-user-uid", 
     reportPayload: {
       overallCompatibility: 78,
       strengths: ["communication", "shared values"],
       challenges: ["conflict resolution", "social energy"], 
       recommendations: ["active listening", "regular check-ins"]
     },
     createdAt: firebase_timestamp
   }
   ```
   **Validation**: Generated when comparing two test results

#### **Data Relationship Validation**

1. **User → Test Results Relationship**
   - Each `testResults` document should have valid `userId` matching `users` collection
   - User should be able to access only their own results
   - Results should appear in chronological order (newest first)

2. **Test Results → Invitations Relationship** 
   - Each `invitations` document should reference valid `testResultId`
   - `inviterUid` should match test result owner
   - Multiple invitations can reference same test result

3. **Invitations → Feedback Relationship**
   - Each `anonymousFeedback` should reference valid `invitationId`
   - Completed invitations should have status "completed"
   - Feedback should aggregate properly in results display

#### **Security Rules Verification**

Test database security rules work correctly:

1. **Authentication Required**
   - Try accessing Firestore directly without authentication
   - Should receive permission denied errors

2. **User Data Isolation**  
   - User A should not access User B's test results
   - Anonymous feedback should be readable only by system

3. **Public vs Private Data**
   - Invitations readable with proper token validation
   - Anonymous feedback creation allowed without auth
   - User profiles private to individual users

#### **Performance & Indexing**

1. **Query Performance**
   - Results should load within 2-3 seconds
   - Large number of results should paginate properly
   - Date-based sorting should work efficiently

2. **Index Verification**
   - Check Firestore Console → Indexes tab
   - Verify composite indexes exist for:
     - `testResults`: `userId` + `createdAt` (desc)
     - `invitations`: `inviterUid` + `status` + `createdAt` (desc)
     - `anonymousFeedback`: `invitationId` + `submittedAt` (desc)

#### **Data Consistency Checks**

1. **Complete Test Workflow Data**
   ```bash
   # Verify complete data flow:
   User signs in → `users` document created
   Takes test → `testResults` document created  
   Sends feedback invitation → `invitations` document created
   External user submits feedback → `anonymousFeedback` created + invitation updated
   Views results → All data displays properly integrated
   ```

2. **Cross-Reference Validation**
   - All document IDs should be valid Firebase document IDs
   - All timestamps should be Firebase Timestamp objects
   - All foreign key references should point to existing documents

---

## 🐛 **Common Issues & Troubleshooting Guide**

### 🔥 **Critical Issues (Fix Immediately)**

#### **Authentication Failures**
```bash
# Issue: "Firebase: Error (auth/popup-blocked)"
Solution: Enable popups for localhost in browser settings
Chrome: Settings → Privacy → Site Settings → Pop-ups → Allow for localhost

# Issue: "Firebase: Error (auth/network-request-failed)" 
Solution: Check internet connection and Firebase project status
Verify: Firebase Console → Project Overview → check project status

# Issue: User profile not created in Firestore
Solution: Check Firestore security rules allow user document creation
Verify: Firebase Console → Firestore → Rules → allow write for authenticated users
```

#### **Test Taking Failures**
```bash
# Issue: Tests don't load or show "Test Not Found"
Solution: Check test definitions and routing
Debug: Browser console for JavaScript errors
Verify: Test IDs match between routes and test-definitions.ts

# Issue: Progress bar doesn't advance or scoring incorrect
Solution: Check test scoring algorithms and question mapping  
Debug: Console log answers object and scoring results
Verify: MBTI scoring logic produces expected personality types
```

#### **Database Connection Issues**
```bash
# Issue: "Missing or insufficient permissions"
Solution: Check Firestore security rules
Debug: Firebase Console → Firestore → Rules tab
Verify: Rules allow read/write for authenticated users' own data

# Issue: Data not saving or loading slowly
Solution: Check network connection and Firebase indexes
Debug: Firebase Console → Firestore → Indexes tab  
Verify: Composite indexes exist for common queries
```

### ⚠️ **Common Issues (Impact User Experience)**

#### **Email & Feedback System**
```bash
# Issue: Feedback invitations not sending
Solution: Check EmailJS configuration in Firebase Functions
Debug: Firebase Console → Functions → Logs tab
Fix: Set EmailJS environment variables properly

# Issue: "Invalid invitation link" for valid links
Solution: Check token validation and invitation status
Debug: Verify invitation exists in Firestore with correct token
Fix: Ensure invitation status is "pending" not "completed"

# Issue: Feedback forms not submitting  
Solution: Check anonymous feedback permissions and validation
Debug: Browser network tab for failed requests
Fix: Verify feedback submission function handles all scenarios
```

#### **Translation & Multilingual**
```bash
# Issue: Text not translating when switching languages
Solution: Check translation keys exist in all language files
Debug: Browser console for missing translation key warnings
Fix: Add missing keys to translation JSON files

# Issue: Language switching not working
Solution: Verify translation engine initialization and URL routing
Debug: Check currentLanguage state in translation provider
Fix: Ensure URL structure matches locale routing pattern

# Issue: Fallback translations not working
Solution: Check translation engine fallback logic
Debug: Console log translation key lookup failures  
Fix: Implement proper fallback to English for missing keys
```

#### **Performance & Loading Issues**
```bash
# Issue: Slow page loads or timeouts
Solution: Check network conditions and Firebase performance
Debug: Browser Network tab for slow requests
Fix: Implement loading states and optimize queries

# Issue: Memory usage increasing with language switching
Solution: Check translation engine memory management
Debug: Browser Performance tab for memory leaks
Fix: Properly dispose of observers and cached translations
```

### 💡 **Development & Debugging Tips**

#### **Browser Developer Tools Usage**
```bash
# Essential debugging workflow:
1. Open browser dev tools (F12)
2. Console tab: Check for JavaScript errors
3. Network tab: Monitor API calls and response times
4. Application tab: Check localStorage, cookies, and service workers
5. Performance tab: Profile memory usage and performance bottlenecks
```

#### **Firebase Debugging**
```bash  
# Firebase Console debugging:
1. Authentication: Check user sign-ins and token validity
2. Firestore: Verify data structure and security rule violations  
3. Functions: Monitor function execution logs and errors
4. Performance: Check app performance metrics and user analytics
```

#### **Testing Environment Setup**
```bash
# Local development debugging:
npm run dev                    # Start Next.js development server
npm run firebase:emulator     # Start Firebase emulators (optional)

# Production environment debugging:
npm run build                 # Test production build locally
npm run start                 # Run production build locally

# Firebase Functions debugging:
firebase functions:log        # View function execution logs
firebase emulators:start --only functions  # Test functions locally
```

#### **Quick Fix Checklist**
```bash
# When something breaks, check in this order:
✅ Browser console for JavaScript errors
✅ Network tab for failed API requests  
✅ Firebase Console for authentication/database issues
✅ Translation engine for missing keys or language switching
✅ Test definitions for scoring algorithm problems
✅ Firebase Functions logs for backend issues
```

---

---

## ✅ **Testing Checklist**

### Core Functionality
- [ ] User authentication (sign in/out)
- [ ] Test browsing and selection
- [ ] Test completion with progress tracking
- [ ] Results storage and retrieval
- [ ] Results dashboard display

### Advanced Features
- [ ] 360° feedback invitation system
- [ ] External feedback submission
- [ ] Feedback aggregation and display
- [ ] Multiple language support
- [ ] Compatibility test workflow

### Error Handling
- [ ] Invalid test IDs
- [ ] Authentication failures
- [ ] Network connectivity issues
- [ ] Invalid feedback tokens
- [ ] Database permission errors

### Performance
- [ ] Page load times < 3 seconds
- [ ] Smooth question transitions
- [ ] Responsive design on mobile
- [ ] Translation engine performance

---

## 🚀 **Production Testing**

Before deploying to production:

1. **Deploy to Firebase**: `npm run firebase:deploy`
2. **Test production URL**: Your Firebase Hosting URL
3. **Verify all workflows** work on production
4. **Check EmailJS** sending in production environment
5. **Monitor Firebase Console** for errors and usage

---

## 📈 **Monitoring & Analytics**

### Key Metrics to Track:
- **Test completion rates**: How many start vs. finish tests
- **Feedback response rates**: How many invitations get responses  
- **Email delivery success**: EmailJS delivery statistics
- **Error rates**: Firebase Functions error logs
- **Language usage**: Which languages are most popular

Your platform is now ready for comprehensive testing! 🎉