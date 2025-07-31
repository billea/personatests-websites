# EmailJS Setup Guide for PersonaTests.com

## Overview

This guide will help you configure EmailJS with Google Workspace to enable email functionality across your PersonaTests website.

## 📋 Prerequisites

1. **Google Workspace Account** with `@personatests.com` domain
2. **EmailJS Account** (free tier supports 200 emails/month)
3. **Access to PersonaTests website files**

## 🚀 Step-by-Step Setup

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up with your email address
3. Verify your email account

### Step 2: Create Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail** as your email provider
4. Follow these configuration steps:

   **Service Configuration:**
   - **Service Name**: `PersonaTests Gmail Service`
   - **Service ID**: Note this down (replace `service_dc4y1ov` in code)
   - **Gmail Account**: Use your `admin@personatests.com` or main account
   - **Authentication**: Complete OAuth2 flow with Google

### Step 3: Configure Google Workspace SMTP

**For sending from different `@personatests.com` addresses:**

1. In Google Workspace Admin Console:
   - Go to **Apps > Gmail > Advanced settings**
   - Enable **"Allow per-user outbound gateways"**
   - Configure SMTP relay if needed

2. In Gmail settings for each account:
   - Go to **Settings > Accounts and Import**
   - Add the specific `@personatests.com` address
   - Verify ownership via verification email

### Step 4: Create Email Templates

Create these 6 templates in your EmailJS dashboard:

#### Template 1: Test Results (`template_results`)
```
Template Name: Test Results Email
Template ID: template_results
Subject: Your {{test_name}} Results
```
Use the HTML content from `email-templates.md`

#### Template 2: 360° Assessment Invitation (`template_360_invite`)
```
Template Name: 360 Assessment Invitation
Template ID: template_360_invite
Subject: {{sender_name}} has invited you to provide feedback
```
Use the HTML content from `email-templates.md`

#### Template 3: Question Set Share (`template_question_share`)
```
Template Name: Question Set Share
Template ID: template_question_share
Subject: {{sender_name}} wants to know: How well do you know them?
```
Use the HTML content from `email-templates.md`

#### Template 4: Contact Form (`template_contact`)
```
Template Name: Contact Form Submission
Template ID: template_contact
Subject: Contact Form: {{subject}}
```
Use the HTML content from `email-templates.md`

#### Template 5: Notification (`template_notification`)
```
Template Name: Feedback Notification
Template ID: template_notification
Subject: New {{feedback_type}} received for {{item_name}}
```
Use the HTML content from `email-templates.md`

#### Template 6: Welcome Email (`template_welcome`)
```
Template Name: Welcome Email
Template ID: template_welcome
Subject: Welcome to PersonaTests! 🎉
```
Use the HTML content from `email-templates.md`

### Step 5: Get Your Public Key

1. In EmailJS dashboard, go to **Integration**
2. Copy your **Public Key**
3. Note this down (replace `bqGKo-dBalpy6MeZE` in code)

### Step 6: Update Website Configuration

1. **Update `email-config.js`:**
   ```javascript
   const EMAILJS_CONFIG = {
       serviceId: 'YOUR_ACTUAL_SERVICE_ID', // Replace service_dc4y1ov
       publicKey: 'YOUR_ACTUAL_PUBLIC_KEY', // Replace bqGKo-dBalpy6MeZE
       
       templates: {
           testResults: 'YOUR_TEMPLATE_ID',        // Replace template_results
           assessmentInvite: 'YOUR_TEMPLATE_ID',   // Replace template_360_invite
           questionSetShare: 'YOUR_TEMPLATE_ID',   // Replace template_question_share
           contactForm: 'YOUR_TEMPLATE_ID',        // Replace template_contact
           feedback: 'YOUR_TEMPLATE_ID',           // Replace template_notification
           welcome: 'YOUR_TEMPLATE_ID'             // Replace template_welcome
       },
       // ... rest of config
   };
   ```

### Step 7: Configure Email Routing

**Set up these email addresses in Google Workspace:**

1. **admin@personatests.com**
   - Purpose: Administrative notifications
   - Forward to: Your main admin email

2. **business@personatests.com**
   - Purpose: Business inquiries, premium reports
   - Forward to: Business/sales team

3. **privacy@personatests.com**
   - Purpose: GDPR/privacy requests
   - Forward to: Privacy officer or admin

4. **support@personatests.com**
   - Purpose: User support, technical issues
   - Forward to: Support team or admin

5. **no-reply@personatests.com**
   - Purpose: Automated system emails
   - Set as automated/no-reply inbox

### Step 8: Test Configuration

1. **Test Contact Form:**
   - Visit `/contact.html`
   - Fill out and submit form
   - Check if email arrives at correct address

2. **Test Social Features:**
   - Create a question set in "Ask My Friends"
   - Try sending test invitation
   - Check email delivery

3. **Test 360° Assessment:**
   - Create 360° assessment
   - Send invitation to test email
   - Verify email format and content

## 🔧 Troubleshooting

### Common Issues

1. **"Email service not initialized" Error**
   - Check browser console for errors
   - Verify EmailJS library loads correctly
   - Ensure `email-config.js` is included

2. **Emails not sending**
   - Verify service ID and public key are correct
   - Check EmailJS dashboard for quota limits
   - Verify template IDs match configuration

3. **Emails going to spam**
   - Set up SPF records for your domain
   - Configure DKIM authentication
   - Use professional email content

4. **Wrong sender address**
   - Verify Google Workspace SMTP settings
   - Check "Send mail as" settings in Gmail
   - Ensure proper authentication

### Advanced Configuration

**SPF Record (add to DNS):**
```
v=spf1 include:_spf.google.com include:emailjs.com ~all
```

**DKIM Setup:**
1. Enable DKIM in Google Admin Console
2. Add DKIM record to DNS
3. Verify authentication in EmailJS

## 📊 Monitoring & Analytics

### EmailJS Dashboard
- Monitor email delivery rates
- Track usage against monthly limits
- View error logs and bounce rates

### Google Workspace Admin
- Monitor email flow
- Check for delivery issues
- Review security alerts

## 🔒 Security Best Practices

1. **Limit Access:**
   - Use service accounts where possible
   - Regularly rotate access credentials
   - Monitor unusual activity

2. **Rate Limiting:**
   - Implement client-side rate limiting
   - Monitor for abuse patterns
   - Set usage alerts

3. **Template Security:**
   - Validate all user inputs
   - Sanitize email content
   - Use trusted templates only

## 📈 Scaling Considerations

**Free Tier Limits:**
- 200 emails/month
- 2 email services
- Basic templates

**Paid Plans:**
- Up to 100,000 emails/month
- Advanced features
- Better deliverability

**Migration Path:**
- Monitor usage monthly
- Upgrade before hitting limits
- Consider dedicated SMTP for high volume

## ✅ Final Checklist

- [ ] EmailJS account created
- [ ] Gmail service configured
- [ ] 6 email templates created
- [ ] Website configuration updated
- [ ] Email addresses set up in Google Workspace
- [ ] Contact form tested
- [ ] Social features tested
- [ ] SPF/DKIM configured
- [ ] Monitoring set up

## 🆘 Support

**EmailJS Support:**
- Documentation: https://www.emailjs.com/docs/
- Support: support@emailjs.com

**Google Workspace Support:**
- Admin Help: https://support.google.com/a/
- Business Support: Available with paid plans

**Implementation Support:**
- Check browser console for detailed error messages
- Verify all template variables are correctly mapped
- Test with different email providers (Gmail, Outlook, etc.)

---

**Next Steps:** Once EmailJS is configured, proceed to test all email functionality and monitor delivery rates for the first week of operation.