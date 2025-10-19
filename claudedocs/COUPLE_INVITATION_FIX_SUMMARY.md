# Couple Compatibility Invitation Fixes - Summary

## Issues Identified

### 1. Firebase Security Rules Mismatch ✅ FIXED
**File**: `src/lib/firestore.ts:358`
**Error**: `Firebase permissions - Missing or insufficient permissions`

**Root Cause**:
The code was using `inviterUserId` but Firestore security rules expect `inviterUid`.

**Security Rule** (firestore.rules:42-47):
```javascript
match /invitations/{invitationId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.inviterUid;
  allow write: if request.auth != null && request.auth.uid == resource.data.inviterUid;
  allow read: if true;
}
```

**Fix Applied**:
```typescript
// Before (WRONG)
const invitationData = {
  inviterUserId: userId,  // ❌ Wrong field name
  participantEmail: partnerEmail,
  // ...
};

// After (CORRECT)
const invitationData = {
  inviterUid: userId,  // ✅ Matches security rules
  participantEmail: partnerEmail,
  // ...
};
```

**File Modified**: `src/lib/firestore.ts:358`

---

### 2. EmailJS Template Configuration ⚠️ NEEDS ATTENTION
**File**: `src/lib/firestore.ts:415`
**Error**: `400 Bad Request` from EmailJS API

**Root Cause**:
The code uses `template_360_feedback_request` for couple compatibility emails. This template may not have the correct variable mappings or doesn't exist in your EmailJS account.

**Current Code**:
```typescript
const templateId = process.env.NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID || 'template_360_feedback_request';
```

**EmailJS Parameters Being Sent**:
```javascript
{
  to_email: partnerEmail,
  email: partnerEmail,
  recipient_email: partnerEmail,
  to_name: recipientName,
  name: recipientName,
  recipient_name: recipientName,
  from_name: userName,
  sender_name: userName,
  invitation_link: invitationUrl,
  link: invitationUrl,
  message: "...",
  time_estimate: '5-10 minutes',
  additional_info: '...'
}
```

---

## What You Need to Do

### Option 1: Create Dedicated Couple Compatibility Template (Recommended)

1. **Log into EmailJS Dashboard**: https://dashboard.emailjs.com/admin
2. **Create New Template**:
   - Go to Email Templates → Add New Template
   - Template ID: `template_couple_compatibility`
   - Subject: `{{from_name}} invited you to take a Couple Compatibility Test!`

3. **Template Content**:
```html
Hi {{to_name}}!

{{from_name}} has invited you to take a Couple Compatibility Test together.

Discover how compatible you are as a couple! This fun test analyzes your relationship compatibility across key areas like communication, lifestyle, and values.

Click here to take the test:
{{invitation_link}}

Time estimate: {{time_estimate}}

{{additional_info}}

Best regards,
Persona Tests Team
```

4. **Configure Template Variables**:
   - `to_name` - Recipient's name
   - `from_name` - Your partner's name
   - `invitation_link` - Test link
   - `time_estimate` - Expected duration
   - `additional_info` - Additional context

5. **Update Environment Variables**:
```env
NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID=template_couple_compatibility
```

---

### Option 2: Verify Existing Template (Quick Fix)

If you want to use the existing `template_360_feedback_request` template:

1. **Check Template in EmailJS Dashboard**:
   - Verify that `template_360_feedback_request` exists
   - Check that it has these variables configured:
     - `{{to_email}}` or `{{email}}` or `{{recipient_email}}`
     - `{{to_name}}` or `{{name}}` or `{{recipient_name}}`
     - `{{from_name}}` or `{{sender_name}}`
     - `{{invitation_link}}` or `{{link}}`

2. **Verify EmailJS Credentials**:
Open browser console on your site and run:
```javascript
console.log({
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  templateId: 'template_360_feedback_request'
});
```

All three should show actual values (not `undefined`).

---

## Environment Variables Checklist

Create/update `.env.local`:

```env
# Required EmailJS credentials
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_XXXXXXX
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=XXXXXXXXX

# Optional: Dedicated couple template (recommended)
NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID=template_couple_compatibility
```

**Get Your Credentials**:
- Service ID: https://dashboard.emailjs.com/admin (Email Services section)
- Public Key: https://dashboard.emailjs.com/admin/account (Account section)
- Template ID: https://dashboard.emailjs.com/admin/templates

---

## Testing the Fix

### Test Locally

1. **Restart development server**:
```bash
npm run dev
```

2. **Take Couple Compatibility Test**:
   - Go to: http://localhost:3000/en/tests/couple-compatibility
   - Complete the test
   - Try sending invitation to a partner

3. **Check Browser Console**:
   - Look for: `✅ EMAIL SENT SUCCESSFULLY`
   - If you see errors, check the EmailJS debug logs in console

### Test on Production (Netlify)

1. **Add environment variables** in Netlify:
   - Go to: Site Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
     - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
     - `NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID` (if using dedicated template)

2. **Trigger new deployment**:
```bash
git add .
git commit -m "Fix: Couple compatibility invitation Firebase and EmailJS issues"
git push origin main
```

3. **Test on live site**: https://korean-mbti-platform.netlify.app

---

## Verification Checklist

✅ **Firebase Fix Applied**:
- [x] Changed `inviterUserId` to `inviterUid` in firestore.ts:358
- [ ] Test invitation creation (should not see Firebase permission errors)

⚠️ **EmailJS Configuration Required**:
- [ ] Create dedicated couple compatibility template OR verify existing template
- [ ] Add environment variables to `.env.local`
- [ ] Restart dev server
- [ ] Test email sending
- [ ] Add environment variables to Netlify
- [ ] Deploy and test on production

---

## Expected Results

### Before Fix:
```
❌ Firebase permissions - Missing or insufficient permissions
❌ EMAIL SENDING FAILED: 400 Bad Request
❌ Error sending couple compatibility invitation
```

### After Fix:
```
✅ Couple compatibility invitation created with ID: couple_1234567890_abc123
✅ EMAIL SENT SUCCESSFULLY: {status: 200, text: 'OK'}
✅ Couple compatibility invitation sent successfully!
```

---

## Need Help?

### EmailJS Dashboard Links:
- Templates: https://dashboard.emailjs.com/admin/templates
- Services: https://dashboard.emailjs.com/admin
- Account: https://dashboard.emailjs.com/admin/account

### Debugging Tips:
1. Check browser console for detailed EmailJS debug logs
2. Verify Firebase security rules allow `inviterUid` field
3. Test EmailJS template preview in dashboard before deploying
4. Use `/en/email-test` page to test email sending without authentication

### Related Documentation:
- `COUPLE_COMPATIBILITY_EMAIL_FIX.md` - Detailed fix instructions
- `EMAILJS_SETUP_QUICK_START.md` - EmailJS setup guide
- `EMAIL_SETUP.md` - General email configuration

---

## Summary

✅ **Fixed**: Firebase security rules mismatch (`inviterUserId` → `inviterUid`)
⚠️ **Action Required**: Configure EmailJS template and environment variables

The Firebase fix is already applied in the code. You just need to configure EmailJS properly and the couple compatibility invitations will work.
