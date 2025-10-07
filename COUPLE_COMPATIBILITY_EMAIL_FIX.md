# Couple Compatibility Email Invitation Fix

## Issue Diagnosis
The couple compatibility test invitation emails are not being sent due to two critical issues:

### 1. Missing EmailJS Configuration
**File**: `.env.local`
**Problem**: Contains placeholder values instead of real EmailJS credentials

```env
# Current (BROKEN)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Solution**: Replace with actual EmailJS credentials

### 2. Wrong Email Template
**File**: `src/lib/firestore.ts:414`
**Problem**: Using `template_360_feedback_request` for couple compatibility invitations

```typescript
// Current (WRONG)
const templateId = 'template_360_feedback_request'; // Using existing template
```

**Solution**: Create and use dedicated couple compatibility template

---

## Step-by-Step Fix

### Step 1: Configure EmailJS Service

1. **Login to EmailJS Dashboard**
   - Visit: https://dashboard.emailjs.com/admin
   - Create account or login

2. **Get Service ID**
   - Go to "Email Services" tab
   - Note your Service ID (e.g., `service_abc123`)

3. **Get Public Key**
   - Go to "Account" tab
   - Find "Public Key" (e.g., `abc123XYZ`)
   - This is used for client-side sending

### Step 2: Create Couple Compatibility Email Template

1. **Go to Email Templates**
   - Click "Email Templates" in EmailJS dashboard
   - Click "Create New Template"

2. **Template Configuration**
   - Template Name: `Couple Compatibility Invitation`
   - Template ID: `template_couple_compatibility` (you'll get this after saving)

3. **Email Template Content**

**Subject Line:**
```
💑 {{from_name}} invites you to take a Couple Compatibility Test
```

**Email Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px;">
  <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

    <h1 style="color: #667eea; text-align: center; margin-bottom: 20px;">
      💑 Couple Compatibility Test Invitation
    </h1>

    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      Hi <strong>{{to_name}}</strong>,
    </p>

    <p style="font-size: 16px; color: #333; line-height: 1.6;">
      <strong>{{from_name}}</strong> has invited you to take a Couple Compatibility Test together!
      This fun and insightful assessment will help you discover how compatible you are as a couple.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #667eea; margin-top: 0;">📊 What you'll discover:</h3>
      <ul style="color: #555; line-height: 1.8;">
        <li>Communication compatibility</li>
        <li>Lifestyle and values alignment</li>
        <li>Emotional connection strength</li>
        <li>Future goals compatibility</li>
        <li>Overall relationship compatibility score</li>
      </ul>
    </div>

    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; color: #856404;">
        ⏱️ <strong>Time Required:</strong> 5-10 minutes<br>
        🔒 <strong>Privacy:</strong> Your individual answers remain private
      </p>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="{{invitation_link}}"
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px;
                font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
        Take the Test Now
      </a>
    </p>

    <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
      After you complete the test, both you and {{from_name}} will receive a comprehensive compatibility report!
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="font-size: 12px; color: #999; text-align: center;">
      This invitation was sent via <strong>PersonaTests.com</strong><br>
      If you're having trouble with the button, copy and paste this link: {{invitation_link}}
    </p>
  </div>
</div>
```

**Template Variables:**
- `{{to_name}}` - Partner's name
- `{{to_email}}` - Partner's email
- `{{from_name}}` - Inviter's name
- `{{invitation_link}}` - Full URL to the test with token

4. **Save Template and Note Template ID**
   - After saving, note the Template ID (e.g., `template_couple_compatibility`)

### Step 3: Update Code Configuration

**File**: `src/lib/firestore.ts:414`

```typescript
// Change this line:
const templateId = 'template_360_feedback_request'; // Using existing template

// To this:
const templateId = process.env.NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID || 'template_couple_compatibility';
```

### Step 4: Update Environment Variables

**File**: `.env.local`

```env
# EmailJS Configuration for Korean MBTI Platform
# Get these values from https://dashboard.emailjs.com/admin

# EmailJS Service ID (required)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_YOUR_ACTUAL_ID

# EmailJS Public Key (required)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=YOUR_ACTUAL_PUBLIC_KEY

# Couple Compatibility Template ID (optional - will fall back to default)
NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID=template_couple_compatibility
```

### Step 5: Deploy Changes

**For Netlify Deployment:**

1. **Add Environment Variables in Netlify Dashboard**
   - Go to: Site Settings → Environment Variables
   - Add each variable:
     - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
     - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
     - `NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID`

2. **Trigger Rebuild**
   - Push code changes to trigger auto-deploy
   - Or manually trigger rebuild in Netlify dashboard

3. **Verify Deployment**
   - Check build logs for successful build
   - Test on production URL

---

## Testing the Fix

### Local Testing
```bash
# 1. Update .env.local with real credentials
# 2. Restart dev server
npm run dev

# 3. Test couple compatibility invitation
# - Login to app
# - Complete couple compatibility test
# - Send invitation to test email
# - Check email inbox (including spam folder)
```

### Production Testing
1. Deploy to Netlify with environment variables
2. Visit: https://personatests.com
3. Login and complete couple compatibility test
4. Send invitation to test email address
5. Verify email received with correct link
6. Click link and verify partner can access test

---

## Debugging Tips

### Check EmailJS Configuration
```typescript
// In firestore.ts:425-436, the code logs all EmailJS details
// Check browser console for:
console.log('Service ID:', serviceId);
console.log('Template ID:', templateId);
console.log('Public Key:', publicKey ? `${publicKey.substring(0, 8)}...` : 'MISSING');
```

### Common Issues

**Issue 1: "Email service not configured"**
- **Cause**: Missing NEXT_PUBLIC_EMAILJS_SERVICE_ID or NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
- **Fix**: Add to .env.local and restart dev server

**Issue 2: "EmailJS API error: 404"**
- **Cause**: Template ID doesn't exist in EmailJS dashboard
- **Fix**: Create template or use correct template ID

**Issue 3: "Email sent but not received"**
- **Cause**: Email provider blocking or spam filtering
- **Fix**: Check spam folder, verify sender domain in EmailJS

**Issue 4: "Permission denied"**
- **Cause**: EmailJS service not configured correctly
- **Fix**: Verify service is active in EmailJS dashboard

---

## Verification Checklist

- [ ] EmailJS account created
- [ ] Service ID obtained
- [ ] Public Key obtained
- [ ] Couple compatibility template created
- [ ] Template ID noted
- [ ] .env.local updated with real values
- [ ] Code updated with correct template ID
- [ ] Local testing successful
- [ ] Netlify environment variables added
- [ ] Production deployment successful
- [ ] Production testing successful
- [ ] Email received in inbox

---

## Alternative: Use Existing 360 Feedback Template

If you prefer to use the existing template temporarily:

**Quick Fix** (Not recommended for production):
1. Keep current template ID: `template_360_feedback_request`
2. Update .env.local with EmailJS credentials
3. Test - emails will send but with 360 feedback branding

**Why this isn't ideal**:
- Email content says "360° Feedback Assessment"
- Confusing for recipients
- Not branded for couple compatibility

---

## Next Steps After Fix

1. **Monitor EmailJS Dashboard**
   - Check "Email Log" for sent emails
   - Monitor success/failure rates

2. **Consider Email Quota**
   - Free tier: 200 emails/month
   - Upgrade if needed for production use

3. **Add Error Handling**
   - Current code catches email errors gracefully
   - Returns invitation link even if email fails
   - Users can manually share link as fallback

4. **Track Analytics**
   - Monitor invitation send rates
   - Track email open rates (requires EmailJS Pro)
   - Measure conversion rates

---

## Support

**EmailJS Issues:**
- Documentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/

**Project Issues:**
- Check Firebase Functions logs: `firebase functions:log`
- Check browser console for EmailJS debug logs
- Review CLAUDE.md for testing procedures
