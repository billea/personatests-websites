const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { invitations, userName, language } = JSON.parse(event.body);

    if (!invitations || !Array.isArray(invitations)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid invitations data' }),
      };
    }

    // Email template based on language
    const getEmailContent = (invitation, lang) => {
      if (lang === 'ko') {
        return {
          subject: `${userName}님의 360도 피드백 참여 요청`,
          html: `
            <div style="font-family: 'Malgun Gothic', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #6366f1; text-align: center;">360도 피드백 참여 요청</h2>
              
              <p>안녕하세요!</p>
              
              <p><strong>${userName}님</strong>이 360도 피드백 평가에 귀하의 참여를 요청했습니다.</p>
              
              <p>360도 피드백은 다양한 관점에서 개인의 성격과 행동 특성을 평가하는 도구로, 귀하의 솔직하고 건설적인 피드백이 ${userName}님의 자기 이해와 성장에 큰 도움이 됩니다.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitation.link}" 
                   style="background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  피드백 참여하기
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                • 평가는 약 5-10분 정도 소요됩니다<br>
                • 귀하의 응답은 완전히 익명으로 처리됩니다<br>
                • 솔직하고 건설적인 피드백을 부탁드립니다
              </p>
              
              <p style="font-size: 12px; color: #999; margin-top: 30px;">
                이 이메일은 Korean MBTI Platform에서 발송되었습니다.
              </p>
            </div>
          `
        };
      } else {
        return {
          subject: `360° Feedback Request from ${userName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #6366f1; text-align: center;">360° Feedback Request</h2>
              
              <p>Hello!</p>
              
              <p><strong>${userName}</strong> has requested your participation in a 360° feedback assessment.</p>
              
              <p>360° feedback is a tool that evaluates personal characteristics and behaviors from multiple perspectives. Your honest and constructive feedback will greatly help ${userName} understand themselves better and grow.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitation.link}" 
                   style="background-color: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Participate in Feedback
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                • The assessment takes approximately 5-10 minutes<br>
                • Your responses are completely anonymous<br>
                • Please provide honest and constructive feedback
              </p>
              
              <p style="font-size: 12px; color: #999; margin-top: 30px;">
                This email was sent from Korean MBTI Platform.
              </p>
            </div>
          `
        };
      }
    };

    // Send emails to all participants
    const emailPromises = invitations.map(async (invitation) => {
      const emailContent = getEmailContent(invitation, language);
      
      try {
        const result = await resend.emails.send({
          from: 'Korean MBTI Platform <noreply@korean-mbti-platform.netlify.app>',
          to: [invitation.email],
          subject: emailContent.subject,
          html: emailContent.html,
        });

        return {
          email: invitation.email,
          success: true,
          messageId: result.id
        };
      } catch (emailError) {
        console.error(`Failed to send email to ${invitation.email}:`, emailError);
        return {
          email: invitation.email,
          success: false,
          error: emailError.message
        };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Successfully sent ${successCount} emails${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
        results: results
      }),
    };

  } catch (error) {
    console.error('Error sending invitation emails:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send invitation emails',
        details: error.message 
      }),
    };
  }
};