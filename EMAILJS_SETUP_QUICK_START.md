# EmailJS Setup - Quick Start Guide

## Problem
Couple compatibility test invitation emails are not being sent because EmailJS is not configured.

## Solution Overview
1. Get EmailJS credentials (5 minutes)
2. Create email template (10 minutes)
3. Configure environment variables (2 minutes)
4. Deploy to production (5 minutes)

---

## Step 1: Get EmailJS Credentials (5 minutes)

### 1.1 Create EmailJS Account
- Visit: https://dashboard.emailjs.com/sign-up
- Sign up with email or Google
- Free tier: 200 emails/month (sufficient for testing)

### 1.2 Get Service ID
1. Go to: https://dashboard.emailjs.com/admin/services
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow connection instructions
5. **Copy Service ID** (e.g., `service_abc1234`)

### 1.3 Get Public Key
1. Go to: https://dashboard.emailjs.com/admin/account
2. Find "Public Key" section
3. **Copy Public Key** (e.g., `xyz789ABC`)

---

## Step 2: Create Email Template (10 minutes)

### 2.1 Create Template
1. Go to: https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Name: "Couple Compatibility Invitation"

### 2.2 Template Content

**Subject:**
```
💑 {{from_name}} invites you to take a Couple Compatibility Test
```

**Content (simplified version):**
```
Hi {{to_name}},

{{from_name}} has invited you to take a Couple Compatibility Test together!

This assessment will help you discover:
- Communication compatibility
- Lifestyle and values alignment
- Emotional connection strength
- Overall relationship compatibility score

Time Required: 5-10 minutes

Click here to take the test:
{{invitation_link}}

After you complete the test, both you and {{from_name}} will receive a comprehensive compatibility report!

---
This invitation was sent via PersonaTests.com
```

### 2.3 Configure Template Variables
Ensure these variables are available in your template:
- `to_name` - Partner's name
- `to_email` - Partner's email
- `from_name` - Your name
- `invitation_link` - Test URL

### 2.4 Save and Copy Template ID
- Click "Save"
- **Copy Template ID** from URL or template list (e.g., `template_abc123`)

---

## Step 3: Configure Environment Variables (2 minutes)

### 3.1 Local Development

**Create `.env.local` file:**
```bash
cd C:\Users\durha\Project\korean-mbti-platform
notepad .env.local
```

**Add these lines (use YOUR actual values):**
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc1234
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xyz789ABC
NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID=template_abc123
```

**Restart dev server:**
```bash
npm run dev
```

### 3.2 Production (Netlify)

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com
   - Select your site (korean-mbti-platform or personatests.com)

2. **Add Environment Variables:**
   - Go to: Site Settings → Environment Variables
   - Click "Add a variable"
   - Add each:
     - Key: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, Value: `service_abc1234`
     - Key: `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, Value: `xyz789ABC`
     - Key: `NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID`, Value: `template_abc123`

3. **Trigger Deployment:**
   - Go to: Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for build to complete (~2-3 minutes)

---

## Step 4: Test the Fix (5 minutes)

### 4.1 Test Locally
```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:3000/en/tests/couple-compatibility

# 3. Login and complete test

# 4. Send invitation to test email

# 5. Check email inbox (and spam folder)
```

### 4.2 Test Production
1. Visit: https://personatests.com
2. Login and complete couple compatibility test
3. Send invitation to test email
4. Verify email received with correct link
5. Click link and verify test loads

---

## Verification Checklist

- [ ] EmailJS account created
- [ ] Email service connected (Gmail/Outlook/etc.)
- [ ] Service ID obtained
- [ ] Public Key obtained
- [ ] Email template created with correct variables
- [ ] Template ID obtained
- [ ] `.env.local` updated with real values
- [ ] Dev server restarted
- [ ] Local test successful (email received)
- [ ] Netlify environment variables added
- [ ] Production deployment triggered
- [ ] Production test successful (email received)

---

## Troubleshooting

### Issue: "Email service not configured"
**Cause:** Missing environment variables
**Fix:**
```bash
# Check .env.local exists
ls .env.local

# Verify content
cat .env.local

# Ensure no placeholder values like "your_service_id_here"
```

### Issue: Email not received
**Cause:** Multiple possible causes
**Fix:**
1. Check spam/junk folder
2. Verify template ID is correct
3. Check EmailJS dashboard → Email Log for errors
4. Verify service is active in EmailJS
5. Check browser console for errors

### Issue: Template variables not working
**Cause:** Variable names don't match
**Fix:**
- Use exact variable names: `{{to_name}}`, `{{from_name}}`, `{{invitation_link}}`
- Check template preview in EmailJS dashboard
- Test send from EmailJS dashboard first

### Issue: Netlify build fails after adding variables
**Cause:** Build process issue, not email config
**Fix:**
- Check build logs in Netlify
- Environment variables only affect runtime, not build
- Try clearing build cache and rebuilding

---

## Quick Reference

### EmailJS Dashboard Links
- **Account**: https://dashboard.emailjs.com/admin/account
- **Services**: https://dashboard.emailjs.com/admin/services
- **Templates**: https://dashboard.emailjs.com/admin/templates
- **Email Log**: https://dashboard.emailjs.com/admin/email-log

### Environment Variables
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_*******
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=***************
NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID=template_*******
```

### Test Email Command (Browser Console)
```javascript
// After logging in to personatests.com
// Open browser console (F12) and run:
console.log('EmailJS Config:', {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_COUPLE_TEMPLATE_ID
});
```

---

## Next Steps After Setup

1. **Monitor Email Quota**
   - Free tier: 200 emails/month
   - Check usage: https://dashboard.emailjs.com/admin/account
   - Upgrade if needed

2. **Set Up Email Notifications**
   - Configure sender name and reply-to
   - Customize email footer
   - Add branding/logo

3. **Track Success Rates**
   - Monitor email log in EmailJS dashboard
   - Check delivery rates
   - Review bounce/spam reports

---

## Support

**EmailJS Issues:**
- Documentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/
- Community: https://www.emailjs.com/community/

**Project Issues:**
- See: `COUPLE_COMPATIBILITY_EMAIL_FIX.md` for detailed debugging
- See: `CLAUDE.md` for project architecture
- Check browser console for detailed error logs
