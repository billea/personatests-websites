# EmailJS Templates for PersonaTests.com

This document contains the email templates that need to be created in your EmailJS dashboard.

## Setup Instructions

1. Log in to your EmailJS dashboard
2. Create email templates using the configurations below
3. Replace template IDs in `email-config.js` with your actual template IDs
4. Configure your Google Workspace SMTP settings in EmailJS

## Template Configurations

### 1. Test Results Template (`template_results`)

**Template ID**: `template_results`
**Subject**: `Your {{test_name}} Results`
**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Your PersonaTests Results</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .result-box { background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Your PersonaTests Results Are Ready!</h1>
            <p>Hi {{to_name}}, your {{test_name}} results have been generated</p>
        </div>
        
        <p>Thank you for taking the <strong>{{test_name}}</strong> personality test on PersonaTests!</p>
        
        <div class="result-box">
            <h3>📊 Your Results Summary</h3>
            <p><strong>{{result_summary}}</strong></p>
            {{#result_score}}<p><strong>Score:</strong> {{result_score}}</p>{{/result_score}}
            {{#result_percentage}}<p><strong>Percentage:</strong> {{result_percentage}}%</p>{{/result_percentage}}
            {{#result_description}}<p>{{result_description}}</p>{{/result_description}}
            <p><small>Completed on: {{completion_date}}</small></p>
        </div>
        
        {{#result_url}}
        <div style="text-align: center;">
            <a href="{{result_url}}" class="cta-button">View Full Results 📋</a>
        </div>
        {{/result_url}}
        
        <p>Want to discover more about your personality? Take another test or share this one with friends!</p>
        
        <div class="footer">
            <p>This email was sent from <a href="{{website_url}}">PersonaTests.com</a></p>
            <p>© 2025 PersonaTests. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 2. 360° Assessment Invitation Template (`template_360_invite`)

**Template ID**: `template_360_invite`
**Subject**: `{{sender_name}} has invited you to provide feedback`
**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>360° Assessment Invitation</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .invitation-box { background: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffa726; }
        .cta-button { display: inline-block; background: #764ba2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>👥 360° Feedback Invitation</h1>
            <p>{{sender_name}} values your perspective!</p>
        </div>
        
        <p>Hi {{to_name}},</p>
        
        <p><strong>{{sender_name}}</strong> has invited you to participate in a 360° personality assessment. Your honest feedback will help them gain valuable insights about their personality and behavior.</p>
        
        <div class="invitation-box">
            <h3>💬 Personal Message</h3>
            <p><em>"{{personal_message}}"</em></p>
            <p><small>— {{sender_name}}</small></p>
        </div>
        
        <p><strong>What is a 360° Assessment?</strong><br>
        It's a comprehensive feedback tool where friends, family, and colleagues provide insights about someone's personality traits, helping create a well-rounded perspective.</p>
        
        <div style="text-align: center;">
            <a href="{{assessment_url}}" class="cta-button">Provide Feedback 📝</a>
        </div>
        
        <p><small>⏰ This invitation expires in {{expires_in}}. Your responses will be kept confidential and combined with others to provide {{sender_name}} with meaningful insights.</small></p>
        
        <div class="footer">
            <p>This invitation was sent through <a href="{{website_url}}">PersonaTests.com</a></p>
            <p>© 2025 PersonaTests. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 3. Question Set Share Template (`template_question_share`)

**Template ID**: `template_question_share`
**Subject**: `{{sender_name}} wants to know: How well do you know them?`
**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>How Well Do You Know Me?</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .questions-preview { background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
        .cta-button { display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤔 How Well Do You Know Me?</h1>
            <p>{{sender_name}} has created a fun challenge for you!</p>
        </div>
        
        <p>Hi {{to_name}},</p>
        
        <p><strong>{{sender_name}}</strong> has created a personalized quiz to see how well you know them. Think you've got what it takes to get a perfect score?</p>
        
        <div class="questions-preview">
            <h3>📋 Quiz Preview</h3>
            <p><strong>{{question_count}} questions</strong> covering topics like:</p>
            <p><em>{{sample_questions}}</em> ... and more!</p>
            <p><small>Created on: {{share_date}}</small></p>
        </div>
        
        <p>Test your knowledge and see how well you really know {{sender_name}}! They'll receive your results anonymously (unless you choose to share your name).</p>
        
        <div style="text-align: center;">
            <a href="{{question_set_url}}" class="cta-button">Take the Quiz 🎯</a>
        </div>
        
        <p><small>💡 <strong>Tip:</strong> Be honest with your answers - {{sender_name}} is curious to see how others perceive them!</small></p>
        
        <div class="footer">
            <p>This quiz was created using <a href="{{website_url}}">PersonaTests.com</a></p>
            <p>© 2025 PersonaTests. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Contact Form Template (`template_contact`)

**Template ID**: `template_contact`
**Subject**: `Contact Form: {{subject}}`
**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Contact Form Submission</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .form-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #555; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📩 New Contact Form Submission</h1>
            <p>PersonaTests.com</p>
        </div>
        
        <div class="form-details">
            <h3>Contact Details</h3>
            <div class="detail-row">
                <span class="label">Name:</span> {{from_name}}
            </div>
            <div class="detail-row">
                <span class="label">Email:</span> {{from_email}}
            </div>
            <div class="detail-row">
                <span class="label">Subject:</span> {{subject}}
            </div>
            <div class="detail-row">
                <span class="label">Type:</span> {{contact_type}}
            </div>
            <div class="detail-row">
                <span class="label">Date:</span> {{submission_date}}
            </div>
            <div class="detail-row">
                <span class="label">Page URL:</span> {{page_url}}
            </div>
        </div>
        
        <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3>💬 Message</h3>
            <p>{{message}}</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0; color: #666; font-size: 12px;">
            <p>Reply directly to this email to respond to {{from_name}}</p>
            <p>User Agent: {{user_agent}}</p>
        </div>
    </div>
</body>
</html>
```

### 5. Notification Template (`template_notification`)

**Template ID**: `template_notification`
**Subject**: `New {{feedback_type}} received for {{item_name}}`
**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Feedback Notification</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: #4caf50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .notification-box { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50; }
        .cta-button { display: inline-block; background: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 New Feedback Received!</h1>
            <p>Someone has responded to your {{item_name}}</p>
        </div>
        
        <p>Hi {{recipient_name}},</p>
        
        <p>Great news! You've received new {{feedback_type}} from <strong>{{sender_name}}</strong>.</p>
        
        <div class="notification-box">
            <h3>📊 Feedback Details</h3>
            <p><strong>Item:</strong> {{item_name}}</p>
            <p><strong>Type:</strong> {{feedback_type}}</p>
            <p><strong>From:</strong> {{sender_name}}</p>
            <p><strong>Date:</strong> {{notification_date}}</p>
        </div>
        
        <p>Log in to your dashboard to view the complete feedback and insights.</p>
        
        <div style="text-align: center;">
            <a href="{{dashboard_url}}" class="cta-button">View Dashboard 📋</a>
        </div>
        
        <div class="footer">
            <p>This notification was sent from <a href="{{website_url}}">PersonaTests.com</a></p>
            <p>© 2025 PersonaTests. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 6. Welcome Template (`template_welcome`)

**Template ID**: `template_welcome`
**Subject**: `Welcome to PersonaTests! 🎉`
**HTML Content**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to PersonaTests</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
        .feature-box { background: #f8f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to PersonaTests!</h1>
            <p>Hi {{to_name}}, thanks for joining our community!</p>
        </div>
        
        <p>Welcome to PersonaTests, where personality insights meet scientific accuracy!</p>
        
        <p>You now have access to our comprehensive suite of personality tests and social features:</p>
        
        <div class="feature-box">
            <h4>🧠 Know Yourself Tests</h4>
            <p>Discover your personality traits with our scientifically-backed assessments including Big Five, DISC, and more.</p>
        </div>
        
        <div class="feature-box">
            <h4>👥 Social Features</h4>
            <p>Create "Ask My Friends" quizzes and 360° assessments to see how others perceive you.</p>
        </div>
        
        <div class="feature-box">
            <h4>📊 Detailed Results</h4>
            <p>Get comprehensive reports with actionable insights and personalized recommendations.</p>
        </div>
        
        <p>Ready to start your personality discovery journey?</p>
        
        <div style="text-align: center;">
            <a href="{{website_url}}" class="cta-button">Take Your First Test 🚀</a>
        </div>
        
        <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team at <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
        
        <div class="footer">
            <p>Welcome email sent on {{welcome_date}}</p>
            <p>© 2025 PersonaTests. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## Google Workspace SMTP Configuration

When setting up your EmailJS service, use these Google Workspace SMTP settings:

- **SMTP Server**: smtp.gmail.com
- **Port**: 587 (TLS) or 465 (SSL)
- **Authentication**: OAuth2 or App Password
- **From Email**: Use your `@personatests.com` addresses

## Template Variables Reference

Each template uses specific variables. Make sure to pass these when calling the email functions:

### Common Variables
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{from_email}}` - Sender email
- `{{from_name}}` - Sender name
- `{{website_url}}` - Website URL

### Test Results Variables
- `{{test_name}}` - Name of the test
- `{{result_summary}}` - Brief result summary
- `{{result_score}}` - Test score
- `{{result_percentage}}` - Percentage score
- `{{result_description}}` - Detailed description

### 360° Assessment Variables
- `{{sender_name}}` - Person requesting feedback
- `{{assessment_url}}` - Link to assessment
- `{{personal_message}}` - Custom message
- `{{expires_in}}` - Expiration timeframe

## Next Steps

1. Create these templates in your EmailJS dashboard
2. Update the template IDs in `email-config.js`
3. Configure your Google Workspace SMTP settings
4. Test each template type
5. Integrate with existing website features