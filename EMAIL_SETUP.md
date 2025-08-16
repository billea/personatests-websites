# Email Service Setup for 360 Feedback Invitations

## Overview
The platform now supports automatic email sending for 360 feedback invitations instead of manual link sharing.

## Email Service: Resend
We use [Resend](https://resend.com) for reliable email delivery with the following benefits:
- High deliverability rates
- Professional email templates
- Simple API integration
- Affordable pricing (100 emails/month free)

## Setup Instructions

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Generate API Key
1. Go to your Resend dashboard
2. Navigate to "API Keys" section
3. Click "Create API Key"
4. Give it a name like "Korean MBTI Platform"
5. Copy the generated API key (starts with `re_`)

### 3. Configure Netlify Environment Variables
1. Go to your Netlify site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add a new environment variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (e.g., `re_your_api_key_here`)
4. Save the changes

### 4. Domain Configuration (Optional but Recommended)
For better deliverability and branding:
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `korean-mbti-platform.netlify.app`)
3. Follow the DNS configuration instructions
4. Update the email function to use your domain instead of the generic one

## How It Works

### Email Flow
1. User completes 360 feedback test
2. User enters participant email addresses
3. System generates unique invitation links
4. Netlify function sends professional emails to all participants
5. Participants receive branded emails with direct links
6. Success message confirms emails were sent

### Email Template Features
- **Korean/English bilingual** support
- **Professional branding** with Korean MBTI Platform styling
- **Clear call-to-action** buttons
- **Anonymous participation** messaging
- **Mobile-responsive** design

### Fallback System
If email sending fails:
- System automatically falls back to manual link sharing
- Users get notified about the failure
- Original clipboard copy functionality remains available

## Email Content

### Korean Template
- Subject: `{userName}님의 360도 피드백 참여 요청`
- Professional Korean language content
- Explains the 360 feedback process
- Anonymous participation assurance

### English Template  
- Subject: `360° Feedback Request from {userName}`
- Clear English language content
- 5-10 minute time estimate
- Constructive feedback encouragement

## Benefits

### For Users
- ✅ **No manual work**: Automatic email sending
- ✅ **Professional appearance**: Branded email templates
- ✅ **Higher response rates**: Direct email invitations
- ✅ **Better user experience**: Seamless invitation process

### For Participants
- ✅ **Clear instructions**: Professional email with context
- ✅ **Easy access**: Direct link in email
- ✅ **Mobile friendly**: Responsive email design
- ✅ **Anonymous assurance**: Clear privacy messaging

## Monitoring and Troubleshooting

### Check Email Delivery
1. Monitor Resend dashboard for delivery statistics
2. Check Netlify function logs for any errors
3. Test with your own email addresses first

### Common Issues
- **API key not set**: Check Netlify environment variables
- **Domain not verified**: Complete domain verification in Resend
- **Rate limits**: Free plan has 100 emails/month limit
- **Spam filters**: Verify domain and use professional content

## Cost Considerations
- **Free tier**: 100 emails/month (suitable for testing)
- **Paid plans**: Start at $20/month for 50,000 emails
- **Current usage**: Estimate ~5-10 participants per test

## Future Enhancements
- [ ] Email delivery status tracking
- [ ] Reminder emails for non-responders
- [ ] Custom email templates per category
- [ ] Bulk invitation management
- [ ] Email analytics and reporting