# EmailJS Setup for 360 Feedback Invitations

## Overview
The platform uses EmailJS for client-side email sending to deliver 360 feedback invitations automatically instead of manual link sharing.

## Why EmailJS?
- ✅ **Client-side**: No server configuration needed
- ✅ **Free tier**: 200 emails/month included
- ✅ **Easy setup**: Simple web-based configuration
- ✅ **Reliable**: Established email delivery service
- ✅ **Template system**: Professional email templates

## Setup Instructions

### 1. EmailJS Account Setup
Since you already have an EmailJS account:
1. Log in to your [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Note down your **User ID** (found in Account settings)

### 2. Create Email Service
1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (most common)
   - **Outlook/Hotmail**
   - **Yahoo**
   - **Custom SMTP**
4. Configure your email credentials
5. Note down the **Service ID** (e.g., `service_xyz123`)

### 3. Create Email Template
1. Go to "Email Templates" in your EmailJS dashboard
2. Click "Create New Template"
3. Use this template structure:

#### Template Variables
```
Subject: {{#if language_ko}}{{subject_ko}}{{else}}{{subject_en}}{{/if}}

From Name: Korean MBTI Platform
To Email: {{to_email}}
To Name: {{to_name}}
```

#### Email Template HTML
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{#if (eq language "ko")}}{{title_ko}}{{else}}{{title_en}}{{/if}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #6366f1; text-align: center; margin-bottom: 30px; }
        .button { 
            display: inline-block; 
            background-color: #6366f1; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0;
        }
        .button:hover { background-color: #5855eb; }
        .info { font-size: 14px; color: #666; margin: 20px 0; }
        .footer { font-size: 12px; color: #999; margin-top: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="header">
            {{#if (eq language "ko")}}{{title_ko}}{{else}}{{title_en}}{{/if}}
        </h2>
        
        <p>{{#if (eq language "ko")}}{{greeting_ko}}{{else}}{{greeting_en}}{{/if}}</p>
        
        <p>{{#if (eq language "ko")}}{{message_ko}}{{else}}{{message_en}}{{/if}}</p>
        
        <p>{{#if (eq language "ko")}}{{description_ko}}{{else}}{{description_en}}{{/if}}</p>
        
        <div style="text-align: center;">
            <a href="{{invitation_link}}" class="button">
                {{#if (eq language "ko")}}{{button_text_ko}}{{else}}{{button_text_en}}{{/if}}
            </a>
        </div>
        
        <div class="info">
            {{#if (eq language "ko")}}
                {{time_ko}}<br>
                {{anonymous_ko}}<br>
                {{feedback_ko}}
            {{else}}
                {{time_en}}<br>
                {{anonymous_en}}<br>
                {{feedback_en}}
            {{/if}}
        </div>
        
        <div class="footer">
            {{#if (eq language "ko")}}{{footer_ko}}{{else}}{{footer_en}}{{/if}}
        </div>
    </div>
</body>
</html>
```

4. Save the template and note down the **Template ID** (e.g., `template_abc456`)

### 4. Configure Environment Variables

Add these environment variables to your Netlify site:

1. Go to Netlify site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add these variables:

```
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_user_id
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id  
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
```

**Example:**
```
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_xyz123abc
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_gmail123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_feedback456
```

### 5. Test Email Configuration

1. Deploy your changes to Netlify
2. Complete a 360 feedback test
3. Try sending invitations to your own email
4. Check EmailJS dashboard for delivery status

## Email Templates

### Korean Email Content
- **Subject**: `{userName}님의 360도 피드백 참여 요청`
- **Professional Korean language**
- **Clear participation instructions**
- **Anonymous participation assurance**

### English Email Content  
- **Subject**: `360° Feedback Request from {userName}`
- **Professional English language**
- **Time estimate (5-10 minutes)**
- **Constructive feedback encouragement**

## How It Works

### Email Flow
1. User completes 360 feedback test
2. User enters participant email addresses
3. System generates unique invitation links
4. EmailJS sends emails directly from browser
5. Participants receive professional emails with direct links
6. Success message confirms emails were sent

### Template Variables Passed
- `to_email`: Recipient email address
- `to_name`: Recipient name (extracted from email)
- `from_name`: Test taker's name
- `invitation_link`: Direct feedback link
- `language`: "ko" or "en" for template selection
- All Korean/English text content for bilingual support

## Benefits of EmailJS

### For Implementation
- ✅ **No server required**: Client-side email sending
- ✅ **Simple setup**: Web-based configuration
- ✅ **Free tier**: 200 emails/month included
- ✅ **Reliable delivery**: Established service

### For Users
- ✅ **Professional emails**: Branded template design
- ✅ **Automatic sending**: No manual link copying
- ✅ **Bilingual support**: Korean and English templates
- ✅ **Mobile friendly**: Responsive email design

## Monitoring and Troubleshooting

### Check Email Delivery
1. Monitor EmailJS dashboard for sent emails
2. Check browser console for any errors
3. Verify environment variables are set correctly

### Common Issues
- **Template not found**: Check TEMPLATE_ID matches exactly
- **Service not configured**: Verify SERVICE_ID and email service setup
- **Rate limiting**: Free plan has 200 emails/month limit
- **Spam filtering**: Use professional from address in EmailJS service

### Fallback System
If EmailJS fails for any reason:
- System automatically falls back to manual link sharing
- Users get notified about the email failure
- Original clipboard copy functionality remains available

## EmailJS Dashboard Features

### Email Tracking
- View sent email statistics
- Monitor delivery success rates
- Track template usage

### Template Management
- Edit email templates without code changes
- A/B test different email designs
- Manage multiple templates for different purposes

### Service Management
- Configure multiple email services
- Switch between email providers
- Monitor service status and limits

## Cost Considerations
- **Free tier**: 200 emails/month (perfect for most users)
- **Pro plan**: $15/month for 1,000 emails/month
- **Current usage**: Estimate ~5-10 participants per test

## Security Notes
- EmailJS public key is safe to expose (hence NEXT_PUBLIC_ prefix)
- Template content is stored securely on EmailJS servers
- No sensitive credentials exposed in client-side code
- Rate limiting prevents abuse

## Future Enhancements
- [ ] Email delivery status notifications
- [ ] Custom email templates per feedback category
- [ ] Email scheduling for reminders
- [ ] Bulk invitation management
- [ ] Email analytics and reporting