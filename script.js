// Global Variables
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let testData = {};

// Stripe Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RnwPt1zgojmRZcvyMqAGsWCkGiYJKKbW7TrG0TwKphbY45p0XHHGEeowBviUwIB5d4odMDgMw4Rz8X8YUfYHATX005yTDQBGq';
let stripe;
let elements;

// Initialize Stripe when script loads
function initializeStripe() {
    if (typeof Stripe !== 'undefined' && STRIPE_PUBLISHABLE_KEY !== 'YOUR_STRIPE_PUBLISHABLE_KEY_HERE') {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        elements = stripe.elements();
    }
}

// Initialize Stripe Elements for payment form
let cardElement;
function initializeStripeElements() {
    if (!stripe || !elements) {
        console.warn('Stripe not initialized');
        return;
    }
    
    // Create an instance of the card Element
    cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
    });
    
    // Add an instance of the card Element into the card-element div
    const cardElementDiv = document.getElementById('stripe-card-element');
    if (cardElementDiv) {
        cardElement.mount('#stripe-card-element');
        
        // Handle real-time validation errors from the card Element
        cardElement.on('change', function(event) {
            const displayError = document.getElementById('stripe-card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }
}

// Reliability and validation functions
function getReliabilityDisplay(testType) {
    const test = tests[testType];
    if (!test.reliability_score) return '';
    
    const score = test.reliability_score;
    const percentage = Math.round(score * 100);
    let reliabilityLevel, color, description;
    
    if (score >= 0.85) {
        reliabilityLevel = "Excellent";
        color = "#10b981";
        description = "Highly reliable with strong scientific validation";
    } else if (score >= 0.75) {
        reliabilityLevel = "Very Good";
        color = "#3b82f6";
        description = "Good reliability with established research backing";
    } else if (score >= 0.65) {
        reliabilityLevel = "Good";
        color = "#f59e0b";
        description = "Moderate reliability suitable for self-reflection";
    } else {
        reliabilityLevel = "Fair";
        color = "#ef4444";
        description = "Limited reliability - primarily for entertainment";
    }
    
    return `
        <div style="background: linear-gradient(135deg, ${color}, ${color}dd); color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
            <h4 style="margin-bottom: 0.5rem;">📊 Test Reliability: ${reliabilityLevel} (${percentage}%)</h4>
            <p style="margin-bottom: 1rem; font-size: 0.9rem;">${description}</p>
            <p style="margin-bottom: 0; font-size: 0.85rem; opacity: 0.9;"><strong>Scientific Basis:</strong> ${test.scientific_basis || 'Self-report personality assessment'}</p>
        </div>
    `;
}

function calculateResponseConsistency(answers, testType) {
    // Simple consistency check for tests with reverse-scored items
    if (!tests[testType] || !tests[testType].questions) return null;
    
    const questions = tests[testType].questions;
    let consistencyScore = 0;
    let checksPerformed = 0;
    
    // Look for reverse-scored items in same dimension
    for (let i = 0; i < questions.length - 1; i++) {
        for (let j = i + 1; j < questions.length; j++) {
            const q1 = questions[i];
            const q2 = questions[j];
            
            if (q1.dimension && q2.dimension && q1.dimension === q2.dimension && 
                q1.reverse !== undefined && q2.reverse !== undefined && q1.reverse !== q2.reverse) {
                
                const ans1 = answers[i] || 0;
                const ans2 = answers[j] || 0;
                const maxScore = q1.options ? q1.options.length - 1 : 4;
                
                // Check if answers are appropriately opposite
                const expectedDifference = Math.abs(ans1 - (maxScore - ans2));
                const actualDifference = Math.abs(ans1 - ans2);
                
                if (expectedDifference <= 1) consistencyScore++;
                checksPerformed++;
                
                if (checksPerformed >= 5) break; // Limit checks for performance
            }
        }
        if (checksPerformed >= 5) break;
    }
    
    return checksPerformed > 0 ? Math.round((consistencyScore / checksPerformed) * 100) : null;
}

// Debug function to test if JavaScript is working
function testFunction() {
    console.log('Test function called successfully');
    alert('JavaScript is working!');
}

// Simple direct MBTI test function
function directMBTITest() {
    console.log('directMBTITest called');
    
    // Force clear everything
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset variables
    currentTest = 'mbti';
    currentQuestionIndex = 0;
    userAnswers = [];
    testData = tests.mbti;
    
    console.log('MBTI data:', testData);
    
    // Get modal elements
    const modal = document.getElementById('testModal');
    const title = document.getElementById('testTitle');
    
    console.log('Modal found:', !!modal);
    console.log('Title found:', !!title);
    
    if (!modal || !title) {
        alert('Modal elements not found!');
        return;
    }
    
    // Set up the test
    title.textContent = 'MBTI Test';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Use the existing showQuestion function
    console.log('About to call showQuestion()');
    showQuestion();
    console.log('MBTI test started successfully');
}

// Check if page is loaded
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, tests object:', typeof tests);
    console.log('MBTI test exists:', !!tests.mbti);
    console.log('startTest function exists:', typeof startTest);
    console.log('startTestFresh function exists:', typeof startTestFresh);
});

// Test Configurations
const tests = {
    mbti: {
        title: "16 Personality Types (MBTI)",
        reliability_score: 0.83,
        scientific_basis: "Based on Carl Jung's psychological types and Myers-Briggs research",
        questions: [
            // Extraversion vs Introversion (E/I)
            { 
                text: "You're at a networking event for your industry. After two hours, how do you feel?", 
                options: [
                    "Energized and excited - you've met 15 new people and exchanged business cards with potential collaborators", 
                    "Mentally drained but accomplished - you had 3 meaningful conversations and are ready to go home and process"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "Your company is launching a new project. Which scenario appeals to you more?", 
                options: [
                    "Leading a cross-functional team of 8 people, conducting daily standups and brainstorming sessions", 
                    "Being the solo technical expert who deep-dives into research and presents findings to the team"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "It's 3 PM on a busy workday. Your phone rings with an unknown number. What's your typical response?", 
                options: [
                    "Answer immediately - it could be an important opportunity or someone who needs help", 
                    "Let it go to voicemail - you'll call back when you have time to focus on the conversation"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "You're at a house party where you know the host but only 2-3 other people. How do you typically spend your evening?", 
                options: [
                    "Introducing yourself to new people, joining group conversations, and helping the host entertain guests", 
                    "Having deeper conversations with the few people you know, helping in the kitchen, or finding a quiet corner"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "After a particularly stressful week at work, what sounds most appealing for your weekend?", 
                options: [
                    "Organizing a group activity - hosting friends for dinner, going to a concert, or planning a group hiking trip", 
                    "Having minimal social commitments - reading a book, taking a solo walk, or binge-watching a series you love"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "During team meetings, you typically:", 
                options: [
                    "Share ideas as they come to you, build on others' suggestions, and help facilitate discussion", 
                    "Listen carefully, take notes, and share your thoughts when directly asked or after you've processed them"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "Your manager wants to discuss your career development. Which format would you prefer?", 
                options: [
                    "An interactive conversation where you can brainstorm ideas together and talk through possibilities", 
                    "Time to prepare beforehand, then a structured discussion where you can present your thoughtful analysis"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "You're trying to master a new software tool for work. What's your preferred learning approach?", 
                options: [
                    "Join a group training session, ask colleagues questions, and learn through discussion and collaboration", 
                    "Work through online tutorials at your own pace, experiment privately, and ask specific questions when needed"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "It's Friday evening after work. Your ideal night looks like:", 
                options: [
                    "Meeting friends for happy hour, then going to a new restaurant or event happening in the city", 
                    "Ordering takeout, catching up on personal projects, or having one close friend over for conversation"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "When you meet someone new at work, you typically:", 
                options: [
                    "Quickly learn about their role, share about yourself, and find common ground for future collaboration", 
                    "Observe them in different settings first, then gradually build a relationship through shared work experiences"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "A colleague asks about your weekend plans during lunch. You're most likely to:", 
                options: [
                    "Share details about your activities and ask about their plans, potentially making spontaneous plans together", 
                    "Give a brief overview and redirect the conversation to work topics or listen to their stories"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "When you need to give difficult feedback to a team member, you prefer to:", 
                options: [
                    "Have a face-to-face conversation where you can read their reactions and address concerns immediately", 
                    "Prepare your thoughts in writing first, then have a structured conversation with clear points"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "Your team is stuck on a complex problem. You're most likely to:", 
                options: [
                    "Gather everyone for a collaborative session, encouraging rapid-fire ideas and group problem-solving", 
                    "Take time to analyze the problem individually, then propose well-thought-out solutions to the team"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "At a company all-hands meeting with 200+ people, you:", 
                options: [
                    "Feel comfortable asking questions during Q&A and networking during breaks", 
                    "Prefer to listen, take notes, and follow up with smaller group discussions later"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },
            { 
                text: "You've just finished a demanding project. To recharge, you:", 
                options: [
                    "Celebrate with your team, share the success story with colleagues, and start networking for the next opportunity", 
                    "Take some quiet time to reflect on lessons learned, decompress alone, and mentally prepare for what's next"
                ], 
                dimension: "E/I", trait: ["E", "I"] 
            },

            // Sensing vs Intuition (S/N)
            { 
                text: "Your company is evaluating a new marketing strategy. Which presentation would you find more compelling?", 
                options: [
                    "Detailed case studies showing exactly how this strategy worked for 5 similar companies, with specific ROI data and implementation steps", 
                    "A visionary presentation about market trends, consumer psychology, and innovative approaches that could disrupt the industry"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "You're choosing between two job offers. Which factor carries more weight in your decision?", 
                options: [
                    "Company A has a proven track record, clear career progression, established training programs, and positive reviews from current employees", 
                    "Company B is a startup with innovative technology, potential for rapid growth, flexible roles, and the chance to shape company culture"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "When planning your team's quarterly goals, you're more likely to:", 
                options: [
                    "Analyze last quarter's performance data, identify specific improvements needed, and set measurable targets based on current capabilities", 
                    "Envision where the industry is heading, brainstorm breakthrough opportunities, and set ambitious goals that push boundaries"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "You're learning a new programming language. Your preferred approach is:", 
                options: [
                    "Start with syntax basics, work through structured tutorials step-by-step, and build practical projects to reinforce each concept", 
                    "Understand the language's philosophy and design principles first, then experiment with different approaches to see how everything connects"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "During a project review meeting, you're most interested in discussing:", 
                options: [
                    "Specific metrics, what worked well, concrete problems encountered, and detailed action items for improvement", 
                    "Broader insights gained, patterns emerging across projects, and innovative ideas for future initiatives"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "Your ideal work environment includes:", 
                options: [
                    "Clear procedures, consistent routines, well-defined roles, and predictable daily tasks that you can master and optimize", 
                    "Diverse projects, changing priorities, opportunities to explore new ideas, and flexibility to innovate and experiment"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "When a colleague describes a complex problem they're facing, you're more likely to:", 
                options: [
                    "Ask detailed questions about the current situation, what's been tried before, and specific constraints they're working within", 
                    "Explore underlying causes, imagine alternative scenarios, and brainstorm creative solutions that challenge assumptions"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "You're designing a solution to improve customer satisfaction. Your approach is to:", 
                options: [
                    "Analyze current customer feedback, identify specific pain points, and implement proven best practices from successful companies", 
                    "Reimagine the entire customer experience, explore emerging technologies, and create innovative touchpoints that exceed expectations"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "When your manager gives you a new assignment, you prefer instructions that:", 
                options: [
                    "Specify exactly what needs to be done, provide templates or examples, and include detailed criteria for success", 
                    "Outline the overall goal and desired outcome, then give you freedom to determine the best approach and methods"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "In team brainstorming sessions, you typically contribute:", 
                options: [
                    "Practical solutions based on your experience, concrete examples of what has worked before, and realistic implementation ideas", 
                    "Creative possibilities, innovative concepts, and imaginative 'what if' scenarios that push thinking in new directions"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "When researching a topic for work, you're more likely to:", 
                options: [
                    "Focus on established sources, gather concrete data and facts, and look for proven methodologies with track records", 
                    "Explore cutting-edge research, read about emerging theories, and seek out unconventional perspectives and experimental approaches"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "Your ideal professional development includes:", 
                options: [
                    "Mastering current tools and technologies, developing expertise in established methodologies, and building proven skills", 
                    "Exploring future trends, learning about emerging technologies, and developing insights into where your field is heading"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "When attending a conference in your field, you're most drawn to sessions about:", 
                options: [
                    "Best practices, case studies, hands-on workshops, and practical tools you can immediately apply in your work", 
                    "Industry vision, future trends, disruptive technologies, and big-picture thinking about where the field is evolving"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "You're more naturally skilled at:", 
                options: [
                    "Remembering specific details, noticing what's changed from last time, and keeping track of concrete facts and data", 
                    "Seeing connections between different ideas, recognizing patterns across situations, and understanding underlying themes"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },
            { 
                text: "When evaluating a new business opportunity, you primarily consider:", 
                options: [
                    "Market data, financial projections, competitive analysis, and proven business models with clear implementation paths", 
                    "Market potential, innovative differentiation, disruptive possibilities, and creative approaches that could change the game"
                ], 
                dimension: "S/N", trait: ["S", "N"] 
            },

            // Thinking vs Feeling (T/F)
            { 
                text: "Your team missed an important deadline, causing problems for other departments. As the manager, your priority is to:", 
                options: [
                    "Analyze what went wrong systematically - review the timeline, identify process failures, and implement changes to prevent recurrence", 
                    "Address team morale first - acknowledge their stress, understand individual challenges, and ensure everyone feels supported moving forward"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "You're implementing a cost-cutting initiative that requires laying off 10% of your department. Your approach focuses on:", 
                options: [
                    "Using objective criteria like performance metrics, redundancy analysis, and business impact to make fair, defensible decisions", 
                    "Considering individual circumstances, family situations, and team dynamics while trying to minimize personal hardship"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "When colleagues seek your advice on work conflicts, you typically:", 
                options: [
                    "Help them analyze the situation objectively, identify the core issues, and develop logical strategies to address the problem", 
                    "Listen to their feelings, validate their experience, and help them find solutions that maintain relationships and team harmony"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "A junior colleague consistently submits work that doesn't meet standards. Your feedback approach is to:", 
                options: [
                    "Provide specific examples of what's wrong, explain the standards clearly, and outline exactly what needs to improve", 
                    "Start by acknowledging their effort, gently explain areas for growth, and offer support while being encouraging about their progress"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "You're choosing between two qualified candidates for a promotion. The deciding factor is more likely to be:", 
                options: [
                    "Objective performance data, technical skills assessment, and track record of meeting measurable goals", 
                    "Team collaboration skills, cultural fit, and positive impact on colleague morale and development"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "In performance reviews, you believe the most important thing is to:", 
                options: [
                    "Give honest, accurate feedback about strengths and weaknesses with specific examples and clear improvement goals", 
                    "Motivate and encourage the person while providing constructive feedback in a way that maintains their confidence"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "Your team is debating between two project approaches. You're most persuaded by arguments that:", 
                options: [
                    "Present clear data, logical reasoning, cost-benefit analysis, and evidence-based projections of success", 
                    "Consider stakeholder buy-in, team enthusiasm, company values alignment, and positive impact on workplace culture"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "When someone disagrees with your recommendation in a meeting, you:", 
                options: [
                    "Present additional evidence, challenge their logic, and work through the reasoning to determine the best solution", 
                    "Try to understand their perspective, find common ground, and explore ways to address their concerns while moving forward"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "A colleague is upset because they weren't chosen for a high-visibility project. You would:", 
                options: [
                    "Explain the objective selection criteria, help them understand the business rationale, and suggest concrete skills to develop", 
                    "Acknowledge their disappointment, validate their feelings, and work together to find other opportunities for visibility and growth"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "Your ideal workplace culture emphasizes:", 
                options: [
                    "Merit-based advancement, clear performance standards, objective evaluation, and direct communication about expectations", 
                    "Collaborative relationships, mutual support, inclusive decision-making, and consideration for individual circumstances"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "When a policy change negatively affects your team, your first response is to:", 
                options: [
                    "Analyze the business rationale, understand the broader context, and focus on adapting efficiently to the new requirements", 
                    "Consider the human impact on your team, advocate for their concerns, and work to minimize disruption to their well-being"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "You're mediating a dispute between two team members. Your approach is to:", 
                options: [
                    "Focus on the facts, identify the root cause of disagreement, and establish clear guidelines to prevent future conflicts", 
                    "Help each person feel heard, facilitate understanding of different perspectives, and rebuild the working relationship"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "When making hiring decisions, you place the highest priority on:", 
                options: [
                    "Technical competence, problem-solving ability, relevant experience, and demonstrated results in previous roles", 
                    "Cultural fit, interpersonal skills, team chemistry, and potential to contribute positively to workplace dynamics"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "A team member approaches you, clearly frustrated about their workload. You:", 
                options: [
                    "Ask for specific details about their tasks, analyze their time allocation, and work together to optimize their workflow", 
                    "Listen to their concerns empathetically, acknowledge their stress, and explore ways to provide support and relief"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },
            { 
                text: "Your leadership style is best described as:", 
                options: [
                    "Setting clear expectations, providing honest feedback, making tough decisions when needed, and focusing on results", 
                    "Building strong relationships, understanding individual motivations, creating inclusive environments, and supporting team growth"
                ], 
                dimension: "T/F", trait: ["T", "F"] 
            },

            // Judging vs Perceiving (J/P)
            { 
                text: "You're planning a two-week vacation to Europe. Your ideal approach is:", 
                options: [
                    "Book flights, hotels, and major activities 3 months in advance with a detailed daily itinerary and restaurant reservations", 
                    "Book flights and first few nights accommodation, then decide day-by-day based on weather, mood, and local recommendations"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "Your team has been given a project with a 6-month deadline. You prefer to:", 
                options: [
                    "Create a detailed project plan with weekly milestones, assign responsibilities immediately, and track progress against the schedule", 
                    "Start with broad goals, allow the approach to evolve as you learn more, and maintain flexibility to adapt as needed"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "When you receive an important work assignment, you typically:", 
                options: [
                    "Break it down into specific tasks, create a timeline, and start working systematically through your plan", 
                    "Think about it for a while, gather information, and let your approach develop naturally as inspiration strikes"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "Your manager asks for a project status update. You feel most confident when you can report:", 
                options: [
                    "That you're exactly on schedule according to your plan, with specific metrics showing progress toward completion", 
                    "That you've made good progress and discovered new opportunities, even if the timeline has shifted from the original plan"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "Your workspace typically looks like:", 
                options: [
                    "Everything has a designated place, files are systematically organized, and your desk is clean with only current projects visible", 
                    "Organized chaos with current projects spread out, reference materials easily accessible, and flexibility for different types of work"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "When working on a complex report, you prefer to:", 
                options: [
                    "Complete it section by section according to your outline, finishing each part before moving to the next", 
                    "Work on different sections as inspiration strikes, allowing ideas to develop and connect organically"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "A critical decision needs to be made for your project, but you have 80% of the information you'd like. You:", 
                options: [
                    "Make the decision based on available information to keep the project moving forward according to schedule", 
                    "Spend more time gathering additional information, even if it means adjusting timelines, to make the best possible decision"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "Your ideal daily work schedule includes:", 
                options: [
                    "Planned blocks of time for specific activities, scheduled meetings, and protected time for focused work on priorities", 
                    "Flexibility to respond to urgent needs, follow up on interesting opportunities, and work on whatever feels most important"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "When your company announces a major reorganization that will affect your role, you:", 
                options: [
                    "Want to know the details quickly - new reporting structure, timeline, responsibilities - so you can plan accordingly", 
                    "Are comfortable with uncertainty and prefer to see how things develop rather than locking in plans too early"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "You're most productive when your projects:", 
                options: [
                    "Have clear requirements, defined scope, established deadlines, and minimal changes once you've started", 
                    "Allow for creative exploration, evolving requirements, and the freedom to discover better solutions along the way"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "When preparing for an important presentation, you:", 
                options: [
                    "Create detailed slides well in advance, practice multiple times, and have backup plans for potential questions", 
                    "Prepare key points and supporting materials, but prefer to keep the presentation somewhat flexible based on audience response"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "Your approach to managing multiple projects is to:", 
                options: [
                    "Maintain detailed task lists, use project management tools, and systematically work through priorities in order", 
                    "Keep mental notes of what needs to be done and work on whatever seems most urgent or interesting at the time"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "When a meeting agenda changes at the last minute, you:", 
                options: [
                    "Feel frustrated because you prepared for specific topics and prefer to reschedule if major changes are needed", 
                    "Adapt easily and are comfortable discussing whatever topics emerge, even if they weren't on the original agenda"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "You feel most satisfied at the end of a workday when you've:", 
                options: [
                    "Completed everything on your planned task list and can clearly see progress toward your goals", 
                    "Made meaningful progress on important work, even if it wasn't exactly what you planned to accomplish"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            },
            { 
                text: "When starting a new job, you prefer an onboarding process that:", 
                options: [
                    "Provides a structured schedule, clear expectations, systematic training, and defined goals for your first 90 days", 
                    "Offers general orientation and then flexibility to explore different areas, meet various people, and find your own path"
                ], 
                dimension: "J/P", trait: ["J", "P"] 
            }
        ]
    },
    
    bigfive: {
        title: "Big Five Personality Assessment",
        reliability_score: 0.89,
        scientific_basis: "Based on Costa & McCrae's NEO-PI-R and validated research",
        questions: [
            // Openness to Experience
            { text: "You love trying new restaurants and cuisines, even if they seem weird or unfamiliar to you.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "You prefer sticking to movies and music you already know you like rather than exploring new genres.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: true },
            { text: "You enjoy abstract art and can spend time analyzing what it might represent.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "You prefer practical, realistic discussions over philosophical or theoretical conversations.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: true },
            { text: "You actively seek out new experiences and adventures, even if they're outside your comfort zone.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "You enjoy creative activities like writing, drawing, or making music.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "You prefer traditional ways of doing things rather than trying innovative approaches.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: true },
            { text: "You find yourself daydreaming often and have a vivid imagination.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "You enjoy learning about different cultures and ways of life.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "You prefer concrete facts over abstract theories.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: true },

            // Conscientiousness
            { text: "You always complete tasks on time and rarely miss deadlines.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "Your living space tends to be messy and disorganized.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: true },
            { text: "You make detailed plans before starting important projects.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "You often procrastinate on tasks you don't enjoy.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: true },
            { text: "You're extremely reliable and others can always count on you.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "You have strong self-discipline and can resist temptations easily.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "You often start projects but struggle to finish them.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: true },
            { text: "You pay attention to details and rarely make careless mistakes.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "You prefer spontaneity over careful planning.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: true },
            { text: "You have clear goals and work systematically towards achieving them.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },

            // Extraversion
            { text: "You feel energized after spending time at large social gatherings.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "You prefer one-on-one conversations over group discussions.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: true },
            { text: "You often take the lead in group projects and discussions.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "You feel comfortable being the center of attention.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "You need alone time to recharge after social activities.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: true },
            { text: "You're usually the first to start conversations with strangers.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "You prefer activities that involve minimal social interaction.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: true },
            { text: "You speak up readily in meetings and group discussions.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "You find large parties overwhelming rather than exciting.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: true },
            { text: "You actively seek out social activities and events.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },

            // Agreeableness
            { text: "You go out of your way to help others, even when it's inconvenient for you.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "You often put your own needs before others' needs.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },
            { text: "You're naturally trusting and assume people have good intentions.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "You don't hesitate to express criticism when you disagree with someone.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },
            { text: "You feel genuinely happy when others succeed, even if it doesn't benefit you.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "You prefer to compete rather than collaborate when possible.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },
            { text: "You often forgive others easily, even when they've hurt you.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "You believe most people are basically selfish and untrustworthy.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },
            { text: "You actively try to understand other people's perspectives, even when you disagree.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "You tend to be skeptical of others' motives.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },

            // Neuroticism
            { text: "You often worry about things that might go wrong in the future.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false },
            { text: "You rarely feel stressed or anxious, even in challenging situations.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            { text: "Your mood changes frequently throughout the day.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false },
            { text: "You remain calm and composed under pressure.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            { text: "You often feel overwhelmed by daily responsibilities.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false },
            { text: "You bounce back quickly from setbacks and disappointments.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            { text: "You tend to be self-critical and hard on yourself.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false },
            { text: "You generally maintain a positive outlook, even during difficult times.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            { text: "You often feel nervous or anxious in social situations.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false },
            { text: "You're emotionally stable and rarely experience extreme mood swings.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            
            // Additional research-validated items for higher reliability
            // Openness - Additional validated items
            { text: "I have a vivid imagination.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "I prefer routine and predictable activities.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: true },
            { text: "I enjoy thinking about abstract concepts.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: false },
            { text: "I find philosophical discussions boring.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "openness", reverse: true },
            
            // Conscientiousness - Additional validated items  
            { text: "I always follow through on my commitments.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "I often act without thinking things through.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: true },
            { text: "I maintain high standards for my work.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: false },
            { text: "I tend to be disorganized in my daily life.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "conscientiousness", reverse: true },
            
            // Extraversion - Additional validated items
            { text: "I feel comfortable being the center of attention.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "I often keep my thoughts and feelings to myself.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: true },
            { text: "I enjoy meeting new people and making connections.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: false },
            { text: "I prefer working alone rather than in groups.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "extraversion", reverse: true },
            
            // Agreeableness - Additional validated items
            { text: "I genuinely care about other people's wellbeing.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "I often put my needs before others'.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },
            { text: "I try to see the best in people.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: false },
            { text: "I can be quite stubborn and argumentative.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "agreeableness", reverse: true },
            
            // Neuroticism - Additional validated items
            { text: "I handle stress very well.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            { text: "I worry about things that are out of my control.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false },
            { text: "I remain optimistic even when things go wrong.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: true },
            { text: "I often feel overwhelmed by everyday tasks.", options: ["Strongly agree", "Somewhat agree", "Neither agree nor disagree", "Somewhat disagree", "Strongly disagree"], dimension: "neuroticism", reverse: false }
        ]
    },

    iq: {
        title: "Brain Teaser Challenge",
        questions: [
            { text: "Which number should come next in this sequence: 2, 4, 8, 16, ?", options: ["24", "32", "36", "48"], correct: 1 },
            { text: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely:", options: ["Lazzles", "Not Lazzles", "Sometimes Lazzles", "Cannot be determined"], correct: 0 },
            { text: "Which word doesn't belong: Apple, Orange, Banana, Carrot, Grape", options: ["Apple", "Orange", "Carrot", "Grape"], correct: 2 },
            { text: "What comes next in this pattern: ○ △ ○ △ △ ○ △ △ △ ?", options: ["○", "△", "○ △", "△ △"], correct: 0 },
            { text: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?", options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"], correct: 0 },
            { text: "Which number is missing: 3, 7, 15, 31, ?", options: ["47", "63", "71", "127"], correct: 1 },
            { text: "Book is to Reading as Fork is to:", options: ["Eating", "Kitchen", "Spoon", "Food"], correct: 0 },
            { text: "Which figure completes the analogy? Circle is to Sphere as Square is to:", options: ["Rectangle", "Triangle", "Cube", "Pyramid"], correct: 2 },
            { text: "What's the next number: 1, 4, 9, 16, 25, ?", options: ["30", "35", "36", "49"], correct: 2 },
            { text: "If some Flibs are Globs and no Globs are Blobs, then:", options: ["Some Flibs are Blobs", "No Flibs are Blobs", "All Flibs are Blobs", "Some Flibs are not Blobs"], correct: 3 },
            { text: "Which comes next: Z, Y, X, W, V, ?", options: ["U", "T", "S", "R"], correct: 0 },
            { text: "If you rearrange the letters 'CIFAIPC', you get the name of a:", options: ["Country", "Animal", "Ocean", "Planet"], correct: 2 },
            { text: "What number should replace the question mark: 4, 9, 16, 25, 36, ?", options: ["42", "49", "56", "64"], correct: 1 },
            { text: "Water is to Ice as Milk is to:", options: ["Cheese", "Cow", "White", "Liquid"], correct: 0 },
            { text: "Complete the sequence: 2, 6, 12, 20, 30, ?", options: ["40", "42", "45", "48"], correct: 1 },
            { text: "Which word can be made from these letters: TEGRNAUDAIO", options: ["GRADUATION", "RADIATION", "TRADITION", "GENERATION"], correct: 0 },
            { text: "If A = 1, B = 2, C = 3... what does 'CAB' equal?", options: ["6", "8", "9", "12"], correct: 0 },
            { text: "What comes next: 1, 1, 2, 3, 5, 8, ?", options: ["11", "13", "15", "21"], correct: 1 },
            { text: "Mountain is to Valley as Peak is to:", options: ["Hill", "Bottom", "Trough", "High"], correct: 2 },
            { text: "Which number doesn't fit: 4, 6, 8, 9, 10, 12", options: ["4", "6", "9", "10"], correct: 2 },
            { text: "If you multiply me by any other number, the answer will always be the same. What number am I?", options: ["0", "1", "10", "100"], correct: 0 },
            { text: "What letter comes next: A, E, I, O, ?", options: ["U", "Y", "B", "F"], correct: 0 },
            { text: "Clock is to Time as Thermometer is to:", options: ["Heat", "Cold", "Temperature", "Weather"], correct: 2 },
            { text: "Complete: 7, 14, 28, 56, ?", options: ["84", "98", "112", "168"], correct: 2 },
            { text: "Which shape is different?", options: ["Triangle with 3 sides", "Square with 4 sides", "Pentagon with 5 sides", "Hexagon with 7 sides"], correct: 3 },
            { text: "What's the missing number: 8, 27, 64, ?", options: ["100", "125", "144", "169"], correct: 1 },
            { text: "Dog is to Puppy as Cat is to:", options: ["Kitten", "Feline", "Meow", "Pet"], correct: 0 },
            { text: "Which doesn't belong: Rose, Tulip, Carrot, Daisy", options: ["Rose", "Tulip", "Carrot", "Daisy"], correct: 2 },
            { text: "What comes next: 100, 95, 85, 70, 50, ?", options: ["25", "30", "35", "40"], correct: 0 },
            { text: "If all squares are rectangles but not all rectangles are squares, then a shape that is definitely a rectangle but might not be a square is:", options: ["Always a square", "Never a square", "Sometimes a square", "Cannot be determined"], correct: 2 }
        ]
    },

    adhd: {
        title: "Focus & Energy Style",
        questions: [
            { text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you have problems remembering appointments or obligations?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you make careless mistakes when you have to work on a boring or difficult project?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you misplace or have difficulty finding things at home or at work?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often are you distracted by activity or noise around you?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you leave your seat in meetings or other situations where you are expected to remain seated?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you feel restless or fidgety?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you have difficulty unwinding and relaxing when you have time to yourself?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you find yourself talking too much when you are in social situations?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you have difficulty waiting your turn in situations when turn taking is required?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] },
            { text: "How often do you interrupt others when they are busy?", options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"], scoring: [0, 1, 2, 3, 4] }
        ]
    },

    anxiety: {
        title: "Stress Management Style",
        questions: [
            { text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by trouble relaxing?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "How much do these problems interfere with your daily life (work, school, relationships)?", options: ["Not at all", "Somewhat", "Quite a bit", "Extremely"], scoring: [0, 1, 2, 3] },
            { text: "How often do you avoid situations because they make you anxious?", options: ["Never", "Rarely", "Sometimes", "Often"], scoring: [0, 1, 2, 3] },
            { text: "How often do you experience physical symptoms of anxiety (racing heart, sweating, trembling)?", options: ["Never", "Rarely", "Sometimes", "Often"], scoring: [0, 1, 2, 3] }
        ]
    },

    depression: {
        title: "Emotional Regulation Style",
        questions: [
            { text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things like reading or watching TV?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people notice, or being fidgety or restless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] },
            { text: "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead or hurting yourself?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], scoring: [0, 1, 2, 3] }
        ]
    },

    disc: {
        title: "DISC Assessment", 
        reliability_score: 0.81,
        scientific_basis: "Based on Marston's DISC theory and modern workplace research",
        questions: [
            { text: "In team meetings, I tend to:", options: ["Take charge and direct the discussion", "Enthusiastically share ideas and energize others", "Listen carefully and support team decisions", "Focus on details and ask clarifying questions"], scoring: ["D", "I", "S", "C"] },
            { text: "When facing a deadline, I prefer to:", options: ["Push for quick decisions and fast action", "Rally the team and maintain positive energy", "Work steadily and systematically", "Double-check everything is accurate"], scoring: ["D", "I", "S", "C"] },
            { text: "My ideal work environment is:", options: ["Fast-paced with opportunities to lead", "Collaborative and socially engaging", "Stable and supportive", "Organized and detail-oriented"], scoring: ["D", "I", "S", "C"] },
            { text: "When solving problems, I usually:", options: ["Make quick decisions based on key facts", "Brainstorm creatively with others", "Consider all stakeholders affected", "Analyze all available data thoroughly"], scoring: ["D", "I", "S", "C"] },
            { text: "People often describe me as:", options: ["Direct and results-focused", "Enthusiastic and persuasive", "Patient and dependable", "Precise and analytical"], scoring: ["D", "I", "S", "C"] },
            { text: "In conflict situations, I typically:", options: ["Address issues head-on", "Try to find win-win solutions", "Seek harmony and avoid confrontation", "Focus on facts and procedures"], scoring: ["D", "I", "S", "C"] },
            { text: "My communication style is usually:", options: ["Brief and to the point", "Warm and expressive", "Thoughtful and considerate", "Detailed and systematic"], scoring: ["D", "I", "S", "C"] },
            { text: "When making decisions, I rely most on:", options: ["My instincts and experience", "Input from others and gut feelings", "Consensus and group harmony", "Data and logical analysis"], scoring: ["D", "I", "S", "C"] },
            { text: "I'm most motivated by:", options: ["Challenges and competition", "Recognition and social interaction", "Stability and teamwork", "Quality and accuracy"], scoring: ["D", "I", "S", "C"] },
            { text: "Under pressure, I tend to:", options: ["Become more assertive and demanding", "Rally others and stay optimistic", "Work harder to maintain stability", "Focus more intensely on details"], scoring: ["D", "I", "S", "C"] },
            { text: "My leadership style is:", options: ["Authoritative and decisive", "Inspirational and motivating", "Supportive and collaborative", "Methodical and thorough"], scoring: ["D", "I", "S", "C"] },
            { text: "I prefer tasks that are:", options: ["Challenging with immediate results", "People-focused and varied", "Routine and predictable", "Complex and require precision"], scoring: ["D", "I", "S", "C"] },
            { text: "When learning something new, I like to:", options: ["Jump right in and learn by doing", "Discuss it with others and get excited", "Take my time and learn step by step", "Study all the details first"], scoring: ["D", "I", "S", "C"] },
            { text: "My biggest strength in teams is:", options: ["Getting things done quickly", "Building relationships and morale", "Providing stability and support", "Ensuring quality and accuracy"], scoring: ["D", "I", "S", "C"] },
            { text: "I work best when:", options: ["I have control and autonomy", "I can collaborate and socialize", "I have clear expectations", "I have time to be thorough"], scoring: ["D", "I", "S", "C"] },
            { text: "When presenting ideas, I:", options: ["Focus on bottom-line results", "Use stories and enthusiasm", "Consider everyone's perspectives", "Present detailed analysis"], scoring: ["D", "I", "S", "C"] },
            { text: "My approach to change is:", options: ["Embrace it if it brings results", "Get excited about new possibilities", "Prefer gradual, well-planned change", "Want to understand all implications"], scoring: ["D", "I", "S", "C"] },
            { text: "In social situations, I usually:", options: ["Take control of conversations", "Engage actively with everyone", "Listen more than I talk", "Observe and ask thoughtful questions"], scoring: ["D", "I", "S", "C"] },
            { text: "My work pace is typically:", options: ["Fast and urgent", "Energetic and variable", "Steady and consistent", "Deliberate and careful"], scoring: ["D", "I", "S", "C"] },
            { text: "When giving feedback, I tend to:", options: ["Be direct about what needs fixing", "Focus on positives and encouragement", "Be gentle and considerate", "Provide specific, detailed suggestions"], scoring: ["D", "I", "S", "C"] },
            { text: "I'm most comfortable when:", options: ["I'm in charge of outcomes", "I'm working with people I like", "Everyone gets along well", "Everything is organized properly"], scoring: ["D", "I", "S", "C"] },
            { text: "My decision-making process is:", options: ["Quick and decisive", "Collaborative and intuitive", "Consensus-seeking and careful", "Thorough and systematic"], scoring: ["D", "I", "S", "C"] },
            { text: "I handle stress by:", options: ["Taking action to solve problems", "Talking it through with others", "Maintaining routines and support", "Planning and organizing"], scoring: ["D", "I", "S", "C"] },
            { text: "Others see me as someone who:", options: ["Gets results no matter what", "Brings energy and positivity", "Provides stability and loyalty", "Ensures quality and follows rules"], scoring: ["D", "I", "S", "C"] },
            { text: "In meetings, I typically:", options: ["Drive toward decisions and action", "Keep energy high and engage everyone", "Make sure everyone is heard", "Ask important clarifying questions"], scoring: ["D", "I", "S", "C"] },
            { text: "My ideal feedback is:", options: ["Brief and focused on results", "Positive and personally delivered", "Supportive and encouraging", "Specific and improvement-focused"], scoring: ["D", "I", "S", "C"] },
            { text: "When starting new projects, I:", options: ["Jump in and figure it out", "Get others excited and involved", "Plan carefully before beginning", "Research thoroughly first"], scoring: ["D", "I", "S", "C"] },
            { text: "People come to me when they need:", options: ["Quick decisions and action", "Motivation and enthusiasm", "Steady support and listening", "Careful analysis and planning"], scoring: ["D", "I", "S", "C"] }
        ]
    },

    conflict: {
        title: "Conflict Style Assessment",
        questions: [
            { text: "When you disagree with a colleague about a project approach, you typically:", options: ["Push for your solution because you believe it's best", "Try to find a creative solution that incorporates both ideas", "Give in to keep the peace and maintain the relationship", "Avoid the conflict and hope it resolves itself", "Suggest a compromise that both parties can accept"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "In team meetings when tensions arise, you usually:", options: ["Take charge and direct the discussion toward resolution", "Encourage everyone to share their perspectives openly", "Smooth things over and focus on what we agree on", "Stay quiet and let others handle the conflict", "Suggest we table the issue and find middle ground later"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When someone criticizes your work, your first instinct is to:", options: ["Defend your position and explain why you're right", "Ask questions to understand their perspective better", "Accept their feedback gracefully", "Change the subject or withdraw from the conversation", "Acknowledge some validity while maintaining your key points"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "If your roommate/partner doesn't do their share of household chores, you would:", options: ["Confront them directly about the unfairness", "Sit down together to create a fair chore system", "Just do the chores yourself to avoid conflict", "Hope they notice and start doing more without being asked", "Suggest splitting the chores differently but keep some you prefer"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When negotiating a deadline with your boss, you typically:", options: ["Stand firm on what you think is realistic", "Explore creative solutions that work for everyone", "Agree to their timeline even if it's challenging", "Avoid bringing up timeline concerns", "Propose meeting somewhere in the middle"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "During family gatherings when political discussions get heated, you:", options: ["Express your views strongly and debate the issues", "Try to facilitate understanding between different viewpoints", "Agree with whoever seems most upset", "Leave the room or change the subject", "Find common ground everyone can accept"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When your friend cancels plans at the last minute repeatedly, you:", options: ["Tell them directly that this behavior is unacceptable", "Have an honest conversation about how this affects you both", "Say it's fine even though you're disappointed", "Stop making plans with them without explaining why", "Ask them to give you more notice in the future"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "If you receive a bill you believe is incorrect, you would:", options: ["Demand they fix it immediately and refuse to pay", "Work with them to understand the discrepancy", "Pay it anyway to avoid the hassle", "Ignore it and hope it goes away", "Offer to pay part while they investigate"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When your team can't agree on a restaurant for lunch, you:", options: ["Insist on your choice because you made the suggestion", "Suggest everyone shares what they want and find something for all", "Go along with whatever others decide", "Say you'll just eat at your desk instead", "Propose rotating who chooses each week"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "If a store clerk is rude to you, you typically:", options: ["Ask to speak to their manager immediately", "Try to understand if they're having a bad day", "Be extra nice hoping to improve their mood", "Just finish your transaction and leave quickly", "Remain polite but don't engage beyond what's necessary"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When your neighbor's music is too loud late at night, you:", options: ["Go over and tell them to turn it down", "Talk to them about finding times that work for everyone", "Wear earplugs and don't say anything", "Call the landlord or authorities instead of confronting them", "Ask if they could turn it down just a little"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "In group projects when someone isn't contributing equally, you:", options: ["Confront them about not pulling their weight", "Organize a team meeting to redistribute tasks fairly", "Do their work so the project doesn't suffer", "Don't say anything but remember for future projects", "Suggest they take on different tasks that suit them better"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When your partner wants to spend money on something you think is unnecessary, you:", options: ["Put your foot down and say no", "Discuss both of your financial priorities together", "Let them buy it to avoid an argument", "Sulk but don't bring up your objections", "Suggest they buy something less expensive instead"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "If someone cuts in line in front of you, you would:", options: ["Tell them firmly that you were there first", "Politely ask if they realized there was a line", "Let it go to avoid making a scene", "Give them dirty looks but not say anything", "Ask if they're in a rush and offer to let them go"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] },
            { text: "When you and a friend have different opinions about a mutual friend's behavior, you:", options: ["Try to convince them that your view is correct", "Share perspectives to better understand the situation", "Agree with them to maintain harmony", "Avoid discussing that friend altogether", "Acknowledge both views have merit"], scoring: ["competing", "collaborating", "accommodating", "avoiding", "compromising"] }
        ]
    },

    via: {
        title: "Character Strengths (VIA)",
        questions: [
            { text: "I love learning new things and exploring ideas that others might find boring.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "curiosity" },
            { text: "I think of novel and productive ways to do things.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "creativity" },
            { text: "I can look at things from different perspectives and see all sides.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "judgment" },
            { text: "I have a strong desire to learn and improve myself constantly.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "love-of-learning" },
            { text: "I can see the big picture and how things connect.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "perspective" },
            { text: "I stand up for what I believe is right, even when it's difficult.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "bravery" },
            { text: "I finish what I begin and follow through on commitments.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "perseverance" },
            { text: "I am authentic and genuine in how I present myself to others.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "honesty" },
            { text: "I approach life with excitement and energy.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "zest" },
            { text: "I care deeply about those close to me and show it.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "love" },
            { text: "I am kind and compassionate toward others.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "kindness" },
            { text: "I understand how groups work and can help bring people together.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "social-intelligence" },
            { text: "I treat people fairly and give everyone an equal chance.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "fairness" },
            { text: "I take charge and guide groups to accomplish goals.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "leadership" },
            { text: "I forgive people who have hurt me and give them second chances.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "forgiveness" },
            { text: "I am humble and modest about my accomplishments.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "humility" },
            { text: "I am disciplined and can resist temptations.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "self-regulation" },
            { text: "I notice and appreciate beauty and excellence in various areas of life.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "appreciation-of-beauty" },
            { text: "I regularly express gratitude for the good things in my life.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "gratitude" },
            { text: "I often see the bright side and expect good things to happen.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "hope" },
            { text: "I find meaning and purpose in my daily activities.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "spirituality" },
            { text: "I try to add fun and lightness to what I do.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "humor" },
            { text: "I work hard to make the communities I belong to better places.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "teamwork" },
            { text: "I am aware of my emotions and how they affect my behavior.", options: ["Very much like me", "Mostly like me", "Somewhat like me", "Not much like me", "Not like me at all"], scoring: [5, 4, 3, 2, 1], strength: "self-awareness" }
        ]
    },

    eq: {
        title: "Emotional Intelligence Assessment",
        reliability_score: 0.84,
        scientific_basis: "Based on Mayer-Salovey EI model and Bar-On EQ-i research",
        questions: [
            { text: "I can easily identify my emotions as they happen.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-awareness" },
            { text: "I understand what triggers my emotional reactions.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-awareness" },
            { text: "I can stay calm under pressure.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-regulation" },
            { text: "I can manage my anger when I'm frustrated.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-regulation" },
            { text: "I bounce back quickly from setbacks.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-regulation" },
            { text: "I can tell when someone is upset, even if they don't say so.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "empathy" },
            { text: "I understand other people's perspectives, even when I disagree.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "empathy" },
            { text: "I can sense the mood of a room when I walk in.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "empathy" },
            { text: "I adjust my communication style based on who I'm talking to.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "social-skills" },
            { text: "I can resolve conflicts effectively.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "social-skills" },
            { text: "I build rapport easily with new people.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "social-skills" },
            { text: "I can influence others to see my point of view.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "social-skills" },
            { text: "I recognize my emotional patterns and habits.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-awareness" },
            { text: "I can control my impulses when necessary.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-regulation" },
            { text: "I notice when others need emotional support.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "empathy" },
            { text: "I can work well in teams and collaborate effectively.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "social-skills" },
            { text: "I'm aware of how my emotions affect others.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-awareness" },
            { text: "I can adapt my behavior when situations change.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "self-regulation" },
            { text: "I can put myself in other people's shoes.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "empathy" },
            { text: "I can lead and motivate teams effectively.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scoring: [5, 4, 3, 2, 1], dimension: "social-skills" }
        ]
    },
    
    // New Trending Tests
    
    loveLanguage: {
        title: "Love Language Assessment",
        category: "Love & Relationships",
        trending: true,
        reliability_score: 0.78,
        scientific_basis: "Based on Dr. Gary Chapman's 5 Love Languages research",
        questions: [
            { text: "Your bae just had the most chaotic day ever. What's your immediate vibe?", options: ["Give them the biggest bear hug and don't let go 🤗", "Flood their DMs with how amazing they are 💬", "Literally do their laundry/dishes without them asking 🧺", "Order their favorite boba or snacks to their door 🛒", "Cancel everything and have a no-phone cuddle session 📱❌"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "When you're absolutely obsessed with someone, how do you show it?", options: ["Can't keep your hands off them (in a cute way!) 👐", "Send them paragraphs about why they're perfect ✨", "Become their personal assistant for everything 📋", "Surprise them with random gifts that scream 'thinking of you' 🎁", "Plan dates where it's just you two and zero distractions 🗓️"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "What absolutely melts your heart in a relationship?", options: ["Random hugs, forehead kisses, holding hands 24/7 💕", "Getting good morning texts and being called beautiful/handsome 📲", "When they do the thing you hate doing before you even ask 🙌", "Finding little gifts or treats they picked up 'just because' 🌹", "Having deep 3am conversations with zero interruptions 🌙"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "You and your partner just had a fight. What would actually make you feel better?", options: ["They come over and just hold you until you're not mad anymore 🫂", "A long voice message explaining everything and how much you mean to them 🎤", "They handle something stressful for you without being asked 💪", "Show up with your comfort food or a small 'sorry' gift 🍕", "Sit down and actually talk it out until you both understand 💬"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "It's your birthday! What would make you feel most special?", options: ["Being surrounded by hugs and physical affection all day 🎂", "Getting the most heartfelt birthday post/message that makes you cry 📝", "They handle ALL the planning so you just show up and vibe ✨", "The most thoughtful gift that shows they really know you 🎁", "A whole day planned around just you two with zero other plans 🗓️"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            
            // Additional validated Love Language questions for higher reliability
            { text: "When your partner comes home from work, what feels most natural to you?", options: ["Give them a welcome hug and kiss 🤗", "Ask about their day and really listen to the answer 👂", "Have their favorite drink ready or start cooking dinner 🍽️", "Surprise them with something small you picked up 🛍️", "Put away your phone and give them your full attention 📱"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "What makes you feel most connected in a relationship?", options: ["Cuddling on the couch watching movies 🛋️", "Having long meaningful conversations 💭", "Working together on shared tasks or goals 🤝", "Exchanging thoughtful gifts and surprises 🎁", "Spending uninterrupted one-on-one time together ⏰"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "When you want to show appreciation, you naturally...", options: ["Give a hug, pat on the back, or high-five ✋", "Tell them specifically what they did well 🗣️", "Offer to help with something they need to do 💪", "Buy or make them something special 🎨", "Plan dedicated time to spend together 📅"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "What would hurt your feelings most in a relationship?", options: ["Lack of physical affection or touch 💔", "Not receiving compliments or encouraging words 😔", "Having to ask for help with everything 😤", "Never receiving thoughtful gifts or gestures 🎁", "Feeling like they're always too busy for you ⌚"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] },
            { text: "On a typical date night, you prefer...", options: ["Staying in for cozy physical closeness 🏠", "Going somewhere you can talk and connect 🗨️", "Doing an activity or project together 🎯", "Trying a new restaurant or experience 🌟", "Having each other's undivided attention 👥"], dimension: "love_language", scoring: [1, 2, 3, 4, 5] }
        ]
    },

    petPersonality: {
        title: "What Pet Matches Your Personality?",
        category: "Fun & Lifestyle",
        trending: true,
        questions: [
            { text: "It's Saturday night and you have zero plans. What's the vibe?", options: ["Home is where the heart is - time for a cozy night in 🏠", "Adventure time! Let's find something spontaneous to do 🌟", "Game night or something active - let's gooo! 🎮", "Netflix and literal chill with my favorite people 🍿", "Peaceful vibes only - maybe some self-care or reading 🧘‍♀️"], dimension: "pet_type", scoring: [1, 2, 3, 4, 5] },
            { text: "At a party, you're the person who...", options: ["Finds the host's room and judges everyone from afar 👑", "Is everyone's bestie and knows the whole squad by the end 🐕", "Starts the group games and gets everyone hyped 🎉", "Gives the best hugs and makes sure everyone feels included 🤗", "Vibes quietly in the corner but somehow everyone gravitates to you ✨"], dimension: "pet_type", scoring: [1, 2, 3, 4, 5] },
            { text: "When life gets overwhelming, your go-to coping mechanism is...", options: ["Disappear into my room and emerge when I'm ready 🚪", "Call my bestie and go for a long walk to vent 🚶‍♀️", "Turn up the music and dance/workout it out 💃", "Find my comfort person and demand cuddles immediately 🫂", "Go completely offline and find my zen space 🧘"], dimension: "pet_type", scoring: [1, 2, 3, 4, 5] },
            { text: "Your dream living situation is...", options: ["Aesthetic apartment with the perfect lighting for selfies ☀️", "House with a backyard for BBQs and friend hangouts 🏡", "Somewhere in the city with gyms, cafes, and things happening 🏙️", "Anywhere cozy where I can have people over constantly 🕯️", "A quiet, minimalist space that's my personal sanctuary 🌿"], dimension: "pet_type", scoring: [1, 2, 3, 4, 5] },
            { text: "When you care about someone, how do they know?", options: ["I remember everything they tell me and show up when it matters 🧠", "I'm literally attached to their hip and support everything they do 💪", "I plan fun activities and try to make them laugh constantly 😂", "Physical touch and constant affection - they'll never doubt it 💕", "I'm just... there. Quiet support and good vibes always 🌙"], dimension: "pet_type", scoring: [1, 2, 3, 4, 5] },
            { text: "What honestly gets you out of bed in the morning?", options: ["The perfect morning routine and aesthetic breakfast 📸", "Knowing I get to see my favorite people today 👥", "There's something fun planned or a goal to crush 🎯", "Cuddles and the promise of good vibes ahead ☀️", "The peace of a quiet morning before chaos starts 🌅"], dimension: "pet_type", scoring: [1, 2, 3, 4, 5] }
        ]
    },

    careerPersonality: {
        title: "What's Your Ideal Career Path?",
        category: "Career & Growth",
        trending: true,
        questions: [
            { text: "You're in a Zoom meeting and something needs to happen. You're the one who...", options: ["Takes over the screen share and gets everyone moving 💻", "Drops the most creative solution in the chat 💡", "Makes sure everyone's voice is heard and builds the vibe 🤝", "Opens another tab to research the perfect answer 📊", "Asks the deep questions about how this affects real people 💭"], dimension: "career_style", scoring: [1, 2, 3, 4, 5] },
            { text: "Your dream work vibe is...", options: ["Startup energy where every decision matters and moves fast ⚡", "Creative chaos where you can brainstorm and innovate freely 🎨", "Solid team where everyone has each other's backs 👥", "Quiet focus time where you can dive deep into complex problems 🔍", "Making a real difference in people's lives every single day 💝"], dimension: "career_style", scoring: [1, 2, 3, 4, 5] },
            { text: "When work gets stressful and chaotic, you...", options: ["Thrive honestly - bring on the pressure and big decisions! 🔥", "Turn it into a creative challenge and think outside the box 🌈", "Rally the team and figure it out together step by step 🫂", "Go full detective mode and research until you find the answer 🕵️", "Focus on protecting and supporting the people affected 🛡️"], dimension: "career_style", scoring: [1, 2, 3, 4, 5] },
            { text: "The work that makes you feel most fulfilled is...", options: ["Crushing huge goals that everyone said were impossible 🏆", "Building something completely new that didn't exist before ✨", "Creating strong relationships and being the person people trust 🤗", "Solving puzzles that make your brain hurt in the best way 🧩", "Knowing your work actually improved someone's life today 🌟"], dimension: "career_style", scoring: [1, 2, 3, 4, 5] },
            { text: "When you need to learn something new for work, you...", options: ["Jump right in and figure it out while doing the actual work 🏃‍♀️", "Watch YouTube tutorials and experiment until something clicks 🎥", "Find a mentor or join a study group to learn together 👥", "Read everything possible and take detailed notes first 📚", "Focus on learning things that will help you help others better 💪"], dimension: "career_style", scoring: [1, 2, 3, 4, 5] }
        ]
    },

    relationshipStyle: {
        title: "What's Your Relationship Style?",
        category: "Love & Relationships", 
        trending: true,
        questions: [
            { text: "In relationships, your natural energy is...", options: ["Main character energy - I need my space to be my best self 👑", "Ride or die soulmate vibes - let's share everything 💕", "Golden retriever energy - let's have fun and see what happens! 🐕", "Mom friend energy - reliable, steady, always there ☀️", "Protective bestie energy - I will literally fight for this person 🛡️"], dimension: "relationship_type", scoring: [1, 2, 3, 4, 5] },
            { text: "When planning the perfect date, you're thinking...", options: ["Something that sounds like it belongs on my vision board ✨", "Deep conversation over dinner where we bare our souls 🕯️", "Something fun and Instagram-worthy that we'll laugh about later 📸", "Our usual spot because consistency hits different 🏠", "Whatever will make them smile - I just want them happy 🥰"], dimension: "relationship_type", scoring: [1, 2, 3, 4, 5] },
            { text: "When you and bae have beef, your approach is...", options: ["I need to process this alone first, then we can talk 🧘‍♀️", "We're talking about this RIGHT NOW until we figure it out 💬", "Let me crack a joke to diffuse this tension real quick 😂", "Let's be adults and work through this step by step 📝", "My main priority is protecting what we have together 💖"], dimension: "relationship_type", scoring: [1, 2, 3, 4, 5] },
            { text: "The non-negotiable thing you need in a partner is...", options: ["They respect that I'm a whole person outside this relationship 🦋", "They match my emotional depth and vulnerability energy 🌊", "They can laugh at my jokes and don't take life too seriously 😄", "They show up consistently and I never have to wonder 🕰️", "They're loyal AF and would choose me every single time 💯"], dimension: "relationship_type", scoring: [1, 2, 3, 4, 5] },
            { text: "Your ideal relationship timeline is...", options: ["Slow burn - let's be whole people who happen to vibe together ⏰", "When you know, you know - let's go deep from day one 🌊", "No pressure vibes - let's just have fun and see where it leads 🎈", "Traditional build-up - friendship to dating to serious over time 📈", "I'm either all in or all out - no middle ground 🎯"], dimension: "relationship_type", scoring: [1, 2, 3, 4, 5] }
        ]
    }
};

// MBTI Type Descriptions
const mbtiTypes = {
    "INTJ": {
        title: "The Architect",
        description: "Imaginative and strategic thinkers, with a plan for everything. You're independent, decisive, and highly determined. You see the big picture and focus on implementing ideas efficiently.",
        traits: ["Independent", "Strategic", "Determined", "Analytical"],
        careers: ["Software Engineer", "Scientist", "Consultant", "Architect", "Project Manager"],
        strengths: ["Strategic thinking", "Independence", "Determination", "Analytical skills"],
        challenges: ["Can be overly critical", "May seem arrogant", "Impatient with inefficiency"]
    },
    "INTP": {
        title: "The Thinker",
        description: "Innovative inventors with an unquenchable thirst for knowledge. You're logical, analytical, and creative. You love exploring theories and finding logical explanations.",
        traits: ["Analytical", "Creative", "Logical", "Independent"],
        careers: ["Researcher", "Software Developer", "Professor", "Engineer", "Analyst"],
        strengths: ["Logical analysis", "Creativity", "Objectivity", "Problem-solving"],
        challenges: ["Can be absent-minded", "May seem insensitive", "Procrastination"]
    },
    "ENTJ": {
        title: "The Commander",
        description: "Bold, imaginative and strong-willed leaders, always finding a way – or making one. You're natural leaders who are confident, charismatic, and strategic.",
        traits: ["Confident", "Strategic", "Charismatic", "Decisive"],
        careers: ["CEO", "Manager", "Lawyer", "Consultant", "Entrepreneur"],
        strengths: ["Leadership", "Strategic planning", "Confidence", "Efficiency"],
        challenges: ["Can be impatient", "May seem arrogant", "Overly demanding"]
    },
    "ENTP": {
        title: "The Debater",
        description: "Smart and curious thinkers who cannot resist an intellectual challenge. You're innovative, enthusiastic, and great at generating ideas and inspiring others.",
        traits: ["Innovative", "Enthusiastic", "Curious", "Energetic"],
        careers: ["Entrepreneur", "Consultant", "Inventor", "Lawyer", "Journalist"],
        strengths: ["Innovation", "Enthusiasm", "Versatility", "Communication"],
        challenges: ["Can be argumentative", "May lack follow-through", "Impatient with routine"]
    },
    "INFJ": {
        title: "The Advocate",
        description: "Quiet and mystical, yet very inspiring and tireless idealists. You're empathetic, insightful, and driven by your values to help others and make a difference.",
        traits: ["Empathetic", "Insightful", "Idealistic", "Organized"],
        careers: ["Counselor", "Writer", "Teacher", "Social Worker", "Psychologist"],
        strengths: ["Empathy", "Insight", "Idealism", "Organization"],
        challenges: ["Can be overly sensitive", "May burn out", "Perfectionist tendencies"]
    },
    "INFP": {
        title: "The Mediator",
        description: "Poetic, kind and altruistic people, always eager to help a good cause. You're creative, idealistic, and driven by your values and desire to help others.",
        traits: ["Creative", "Idealistic", "Empathetic", "Flexible"],
        careers: ["Writer", "Artist", "Counselor", "Teacher", "Social Worker"],
        strengths: ["Creativity", "Empathy", "Idealism", "Flexibility"],
        challenges: ["Can be overly idealistic", "May take criticism personally", "Difficulty with criticism"]
    },
    "ENFJ": {
        title: "The Protagonist",
        description: "Charismatic and inspiring leaders, able to mesmerize their listeners. You're empathetic, organized, and natural teachers who inspire others to grow.",
        traits: ["Charismatic", "Empathetic", "Organized", "Inspiring"],
        careers: ["Teacher", "Counselor", "Coach", "Manager", "Social Worker"],
        strengths: ["Leadership", "Empathy", "Communication", "Organization"],
        challenges: ["Can be overly idealistic", "May neglect own needs", "Sensitive to criticism"]
    },
    "ENFP": {
        title: "The Campaigner",
        description: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile. You're energetic, creative, and excellent at connecting with others.",
        traits: ["Enthusiastic", "Creative", "Sociable", "Energetic"],
        careers: ["Marketing", "Psychology", "Journalist", "Actor", "Consultant"],
        strengths: ["Enthusiasm", "Creativity", "Social skills", "Versatility"],
        challenges: ["Can be scattered", "May struggle with routine", "Difficulty following through"]
    },
    "ISTJ": {
        title: "The Logistician",
        description: "Practical and fact-minded, reliable and responsible. You're organized, dependable, and prefer established methods and clear expectations.",
        traits: ["Practical", "Reliable", "Organized", "Responsible"],
        careers: ["Accountant", "Manager", "Administrator", "Engineer", "Auditor"],
        strengths: ["Reliability", "Organization", "Practicality", "Responsibility"],
        challenges: ["Can be inflexible", "May resist change", "Overly critical"]
    },
    "ISFJ": {
        title: "The Protector",
        description: "Very dedicated and warm protectors, always ready to defend their loved ones. You're caring, responsible, and focused on helping others and maintaining harmony.",
        traits: ["Caring", "Responsible", "Practical", "Loyal"],
        careers: ["Nurse", "Teacher", "Social Worker", "Administrator", "Counselor"],
        strengths: ["Caring nature", "Reliability", "Attention to detail", "Loyalty"],
        challenges: ["Can be overly selfless", "May avoid conflict", "Resistant to change"]
    },
    "ESTJ": {
        title: "The Executive",
        description: "Excellent administrators, unsurpassed at managing things – or people. You're organized, practical, and natural leaders who value tradition and efficiency.",
        traits: ["Organized", "Practical", "Decisive", "Traditional"],
        careers: ["Manager", "Administrator", "Executive", "Judge", "Military Officer"],
        strengths: ["Leadership", "Organization", "Efficiency", "Decisiveness"],
        challenges: ["Can be inflexible", "May be overly critical", "Impatient with inefficiency"]
    },
    "ESFJ": {
        title: "The Consul",
        description: "Extraordinarily caring, social and popular people, always eager to help. You're warm, cooperative, and focused on harmony and helping others succeed.",
        traits: ["Caring", "Social", "Cooperative", "Responsible"],
        careers: ["Teacher", "Nurse", "Social Worker", "Manager", "Counselor"],
        strengths: ["Caring nature", "Social skills", "Cooperation", "Organization"],
        challenges: ["Can be overly sensitive", "May neglect own needs", "Difficulty with criticism"]
    },
    "ISTP": {
        title: "The Virtuoso",
        description: "Bold and practical experimenters, masters of all kinds of tools. You're adaptable, logical, and excellent at understanding how things work.",
        traits: ["Practical", "Adaptable", "Logical", "Independent"],
        careers: ["Engineer", "Mechanic", "Pilot", "Software Developer", "Scientist"],
        strengths: ["Problem-solving", "Adaptability", "Logical thinking", "Independence"],
        challenges: ["Can be insensitive", "May seem distant", "Difficulty expressing emotions"]
    },
    "ISFP": {
        title: "The Adventurer",
        description: "Flexible and charming artists, always ready to explore new possibilities. You're creative, sensitive, and value personal freedom and authenticity.",
        traits: ["Creative", "Sensitive", "Flexible", "Peaceful"],
        careers: ["Artist", "Designer", "Musician", "Counselor", "Writer"],
        strengths: ["Creativity", "Sensitivity", "Flexibility", "Loyalty"],
        challenges: ["Can be overly sensitive", "May avoid conflict", "Difficulty with criticism"]
    },
    "ESTP": {
        title: "The Entrepreneur",
        description: "Smart, energetic and very perceptive people, who truly enjoy living on the edge. You're adaptable, energetic, and excellent at reading people and situations.",
        traits: ["Energetic", "Adaptable", "Social", "Practical"],
        careers: ["Sales", "Marketing", "Entrepreneur", "Actor", "Paramedic"],
        strengths: ["Adaptability", "Energy", "Social skills", "Practicality"],
        challenges: ["Can be impulsive", "May avoid long-term planning", "Difficulty with theory"]
    },
    "ESFP": {
        title: "The Entertainer",
        description: "Spontaneous, energetic and enthusiastic people – life is never boring around them. You're warm, creative, and love bringing joy to others through your enthusiasm.",
        traits: ["Enthusiastic", "Creative", "Social", "Spontaneous"],
        careers: ["Performer", "Teacher", "Social Worker", "Artist", "Counselor"],
        strengths: ["Enthusiasm", "Creativity", "Social skills", "Adaptability"],
        challenges: ["Can be scattered", "May avoid conflict", "Difficulty with long-term planning"]
    }
};

// Progress Saving Functions
function saveTestProgress() {
    if (!currentTest) return;
    
    const progressData = {
        testType: currentTest,
        currentQuestionIndex: currentQuestionIndex,
        userAnswers: userAnswers,
        timestamp: Date.now()
    };
    
    localStorage.setItem(`vibecheck_${currentTest}_progress`, JSON.stringify(progressData));
}

function loadTestProgress(testType) {
    const saved = localStorage.getItem(`vibecheck_${testType}_progress`);
    if (!saved) return null;
    
    try {
        const progressData = JSON.parse(saved);
        // Check if progress is less than 7 days old
        if (Date.now() - progressData.timestamp > 7 * 24 * 60 * 60 * 1000) {
            clearTestProgress(testType);
            return null;
        }
        return progressData;
    } catch (e) {
        return null;
    }
}

function clearTestProgress(testType) {
    localStorage.removeItem(`vibecheck_${testType}_progress`);
}

function clearAllTestProgress() {
    // Clear all test progress - useful for debugging
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('vibecheck_') && key.endsWith('_progress')) {
            localStorage.removeItem(key);
        }
    });
    console.log('All test progress cleared');
}

function forceClearMBTI() {
    // Force clear all MBTI-related data
    console.log('Force clearing all MBTI data...');
    
    // Clear all possible MBTI storage keys
    const keysToRemove = [
        'vibecheck_mbti_progress',
        'mbti_progress',
        'vibecheck_mbti_result',
        'mbti_result',
        'currentTest',
        'testProgress_mbti'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    
    // Reset global variables
    currentTest = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    testData = {};
    
    console.log('All MBTI data cleared, starting fresh test...');
}

function hasTestProgress(testType) {
    return loadTestProgress(testType) !== null;
}

function showResumeDialog(testType, progressData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Resume Test?</h2>
            </div>
            <div style="padding: 2rem;">
                <p>You have an unfinished ${tests[testType].title} test.</p>
                <p><strong>Progress:</strong> Question ${progressData.currentQuestionIndex + 1} of ${tests[testType].questions.length}</p>
                <p>Would you like to continue where you left off or start over?</p>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="resumeTest('${testType}', ${progressData.currentQuestionIndex})" style="flex: 1;">
                        Resume Test
                    </button>
                    <button class="btn btn-secondary" onclick="startTestFresh('${testType}'); closeResumeDialog();" style="flex: 1;">
                        Start Over
                    </button>
                    <button class="btn btn-secondary" onclick="closeResumeDialog()" style="background: #64748b;">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeResumeDialog() {
    console.log('closeResumeDialog called');
    const modals = document.querySelectorAll('.modal');
    console.log('Found modals:', modals.length);
    
    modals.forEach((modal, index) => {
        console.log(`Modal ${index}:`, modal.id || 'no id');
        // Remove resume dialogs (modals without an id that aren't the main test modal)
        if (!modal.id && modal !== document.getElementById('testModal')) {
            console.log('Removing resume dialog modal');
            document.body.removeChild(modal);
        }
    });
    
    // Don't reset overflow here since we're opening the test modal
}

function resumeTest(testType, questionIndex) {
    console.log('resumeTest called with:', testType, questionIndex);
    closeResumeDialog();
    const progressData = loadTestProgress(testType);
    console.log('Progress data loaded:', progressData);
    
    if (progressData) {
        currentTest = testType;
        currentQuestionIndex = questionIndex;
        userAnswers = progressData.userAnswers;
        testData = tests[testType];
        
        console.log('Setting up test resume:');
        console.log('- currentTest:', currentTest);
        console.log('- currentQuestionIndex:', currentQuestionIndex);
        console.log('- userAnswers length:', userAnswers.length);
        console.log('- testData loaded:', !!testData);
        
        document.getElementById('testTitle').textContent = testData.title;
        document.getElementById('testModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('About to call showQuestion() for resume');
        showQuestion();
        console.log('Test resumed successfully');
    } else {
        console.error('No progress data found for resume');
    }
}

function startFreshTest(testType) {
    closeResumeDialog();
    clearTestProgress(testType);
    startTestNew(testType);
}

// Test Functions
function startTest(testType) {
    console.log('Starting test:', testType);
    console.log('Test data exists:', !!tests[testType]);
    
    // Track test start
    if (typeof trackTestStart !== 'undefined') {
        trackTestStart(testType);
    }
    
    // Check if there's existing progress
    if (hasTestProgress(testType)) {
        console.log('Found existing progress for', testType);
        const progressData = loadTestProgress(testType);
        showResumeDialog(testType, progressData);
        return;
    }
    
    console.log('No existing progress, starting new test');
    startTestNew(testType);
}

function startTestFresh(testType) {
    // Force start a fresh test, clearing any existing progress
    clearTestProgress(testType);
    startTestNew(testType);
}

function startTestNew(testType) {
    console.log('startTestNew called with:', testType);
    
    try {
        currentTest = testType;
        currentQuestionIndex = 0;
        userAnswers = [];
        testData = tests[testType];
        
        console.log('Test data loaded:', testData ? 'yes' : 'no');
        console.log('Questions count:', testData ? testData.questions.length : 'N/A');
        
        const testModal = document.getElementById('testModal');
        const testTitle = document.getElementById('testTitle');
        
        console.log('testModal element found:', !!testModal);
        console.log('testTitle element found:', !!testTitle);
        
        if (!testModal) {
            console.error('testModal element not found!');
            return;
        }
        
        if (!testTitle) {
            console.error('testTitle element not found!');
            return;
        }
        
        testTitle.textContent = testData.title;
        testModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        console.log('About to call showQuestion()');
        showQuestion();
        console.log('showQuestion() called successfully');
        
    } catch (error) {
        console.error('Error in startTestNew:', error);
    }
}

function showQuestion() {
    console.log('showQuestion() called, currentQuestionIndex:', currentQuestionIndex);
    
    try {
        const question = testData.questions[currentQuestionIndex];
        const totalQuestions = testData.questions.length;
        
        console.log('Current question:', question ? 'found' : 'not found');
        console.log('Total questions:', totalQuestions);
        
        // Update progress
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        
        // Show question
        const testContent = document.getElementById('testContent');
        testContent.innerHTML = `
            <div class="question">
                <h3>${question.text}</h3>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <label class="option" onclick="selectOption(${index})">
                            <input type="radio" name="answer" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="test-navigation">
                    <button class="nav-btn prev" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        Previous
                    </button>
                    <button class="nav-btn next" onclick="nextQuestion()" id="nextBtn" disabled>
                        ${currentQuestionIndex === totalQuestions - 1 ? 'Finish Test' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        
        console.log('Question display completed successfully');
        
    } catch (error) {
        console.error('Error in showQuestion:', error);
    }
}

function selectOption(optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    document.querySelectorAll('.option')[optionIndex].classList.add('selected');
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
    
    // Store answer
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Save progress automatically
    saveTestProgress();
}

function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    if (currentQuestionIndex === testData.questions.length - 1) {
        finishTest();
    } else {
        currentQuestionIndex++;
        saveTestProgress(); // Save progress when moving to next question
        showQuestion();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        saveTestProgress(); // Save progress when moving to previous question
        showQuestion();
        
        // If there's a previous answer, select it
        if (userAnswers[currentQuestionIndex] !== undefined) {
            setTimeout(() => {
                const options = document.querySelectorAll('.option');
                options[userAnswers[currentQuestionIndex]].classList.add('selected');
                document.getElementById('nextBtn').disabled = false;
            }, 50);
        }
    }
}

function finishTest() {
    let result;
    
    switch(currentTest) {
        case 'mbti':
            result = calculateMBTI();
            showMBTIResults(result);
            break;
        case 'bigfive':
            result = calculateBigFive();
            showBigFiveResults(result);
            break;
        case 'iq':
            result = calculateIQ();
            showIQResults(result);
            break;
        case 'adhd':
            result = calculateADHD();
            showADHDResults(result);
            break;
        case 'anxiety':
            result = calculateAnxiety();
            showAnxietyResults(result);
            break;
        case 'depression':
            result = calculateDepression();
            showDepressionResults(result);
            break;
        case 'disc':
            result = calculateDISC();
            showDISCResults(result);
            break;
        case 'conflict':
            result = calculateConflict();
            showConflictResults(result);
            break;
        case 'via':
            result = calculateVIA();
            showVIAResults(result);
            break;
        case 'eq':
            result = calculateEQ();
            showEQResults(result);
            break;
        case 'loveLanguage':
            result = calculateLoveLanguage();
            showLoveLanguageResults(result);
            break;
        case 'petPersonality':
            result = calculatePetPersonality();
            showPetPersonalityResults(result);
            break;
        case 'careerPersonality':
            result = calculateCareerPersonality();
            showCareerPersonalityResults(result);
            break;
        case 'relationshipStyle':
            result = calculateRelationshipStyle();
            showRelationshipStyleResults(result);
            break;
    }
    
    // Clear progress when test is completed
    clearTestProgress(currentTest);
    closeTest();
}

function exitToHome() {
    if (currentTest && userAnswers.length > 0) {
        if (confirm('Your progress will be saved. You can resume this test later. Continue to home?')) {
            saveTestProgress();
            closeTest();
        }
    } else {
        closeTest();
    }
}

function closeTest() {
    document.getElementById('testModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    // Reset current test variables
    currentTest = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    testData = {};
}

function calculateMBTI() {
    let scores = { 'E': 0, 'I': 0, 'S': 0, 'N': 0, 'T': 0, 'F': 0, 'J': 0, 'P': 0 };
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        const selectedTrait = question.trait[answerIndex];
        scores[selectedTrait]++;
    });
    
    // Determine personality type
    const type = 
        (scores.E > scores.I ? 'E' : 'I') +
        (scores.S > scores.N ? 'S' : 'N') +
        (scores.T > scores.F ? 'T' : 'F') +
        (scores.J > scores.P ? 'J' : 'P');
    
    return {
        type: type,
        scores: scores,
        percentages: {
            'E/I': Math.round((Math.max(scores.E, scores.I) / 15) * 100),
            'S/N': Math.round((Math.max(scores.S, scores.N) / 15) * 100),
            'T/F': Math.round((Math.max(scores.T, scores.F) / 15) * 100),
            'J/P': Math.round((Math.max(scores.J, scores.P) / 15) * 100)
        }
    };
}

function calculateBigFive() {
    let scores = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
    };
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        const dimension = question.dimension;
        let score = answerIndex; // 0-4 scale
        
        // Reverse scoring for reverse-coded items
        if (question.reverse) {
            score = 4 - score;
        }
        
        scores[dimension] += score;
    });
    
    // Convert to percentiles (each dimension has 10 questions, max score 40)
    const percentiles = {};
    Object.keys(scores).forEach(trait => {
        percentiles[trait] = Math.round((scores[trait] / 40) * 100);
    });
    
    return {
        scores: scores,
        percentiles: percentiles
    };
}

function calculateIQ() {
    let correctAnswers = 0;
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        if (answerIndex === question.correct) {
            correctAnswers++;
        }
    });
    
    // Calculate IQ score (scaled to typical IQ range)
    const percentage = correctAnswers / testData.questions.length;
    let iq = Math.round(85 + (percentage * 60)); // Range from 85-145
    
    // Ensure minimum IQ of 70 and maximum of 160
    iq = Math.max(70, Math.min(160, iq));
    
    return {
        score: iq,
        correctAnswers: correctAnswers,
        totalQuestions: testData.questions.length,
        percentage: Math.round(percentage * 100)
    };
}

function calculateADHD() {
    let totalScore = 0;
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        totalScore += question.scoring[answerIndex];
    });
    
    let level, description;
    if (totalScore >= 24) {
        level = "High";
        description = "Your responses suggest a high likelihood of ADHD symptoms. Consider consulting with a healthcare professional for a comprehensive evaluation.";
    } else if (totalScore >= 17) {
        level = "Moderate";
        description = "Your responses suggest moderate ADHD symptoms. It might be helpful to discuss these patterns with a healthcare professional.";
    } else {
        level = "Low";
        description = "Your responses suggest low likelihood of ADHD symptoms. Your attention and activity patterns appear to be within typical ranges.";
    }
    
    return {
        score: totalScore,
        maxScore: 72,
        level: level,
        description: description
    };
}

function calculateAnxiety() {
    let totalScore = 0;
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        totalScore += question.scoring[answerIndex];
    });
    
    let level, description;
    if (totalScore >= 15) {
        level = "Severe";
        description = "Your responses suggest severe anxiety symptoms. It's important to speak with a mental health professional who can provide proper support and treatment options.";
    } else if (totalScore >= 10) {
        level = "Moderate";
        description = "Your responses suggest moderate anxiety levels. Consider speaking with a counselor or therapist about strategies to manage these feelings.";
    } else if (totalScore >= 5) {
        level = "Mild";
        description = "Your responses suggest mild anxiety. Some stress management techniques, regular exercise, and mindfulness practices might be helpful.";
    } else {
        level = "Minimal";
        description = "Your responses suggest minimal anxiety symptoms. You seem to be managing stress and worry quite well.";
    }
    
    return {
        score: totalScore,
        maxScore: 30,
        level: level,
        description: description
    };
}

function calculateDepression() {
    let totalScore = 0;
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        totalScore += question.scoring[answerIndex];
    });
    
    let level, description;
    if (totalScore >= 20) {
        level = "Severe";
        description = "Your responses suggest severe depression symptoms. Please reach out to a mental health professional immediately. You don't have to go through this alone.";
    } else if (totalScore >= 15) {
        level = "Moderately Severe";
        description = "Your responses suggest moderately severe depression. It's important to connect with a therapist or counselor who can provide support and treatment options.";
    } else if (totalScore >= 10) {
        level = "Moderate";
        description = "Your responses suggest moderate depression symptoms. Consider speaking with a mental health professional about how you're feeling.";
    } else if (totalScore >= 5) {
        level = "Mild";
        description = "Your responses suggest mild depression symptoms. Self-care activities, social support, and possibly talking to a counselor could be beneficial.";
    } else {
        level = "Minimal";
        description = "Your responses suggest minimal depression symptoms. You seem to be maintaining good emotional well-being.";
    }
    
    return {
        score: totalScore,
        maxScore: 27,
        level: level,
        description: description
    };
}

function calculateDISC() {
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        const score = question.scoring[answerIndex];
        scores[question.dimension] += score;
    });
    
    // Calculate percentages
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = {};
    Object.keys(scores).forEach(key => {
        percentages[key] = Math.round((scores[key] / totalScore) * 100);
    });
    
    // Determine primary style
    const primaryStyle = Object.keys(percentages).reduce((a, b) => 
        percentages[a] > percentages[b] ? a : b
    );
    
    return {
        scores: scores,
        percentages: percentages,
        primaryStyle: primaryStyle,
        totalScore: totalScore
    };
}

function calculateConflict() {
    const scores = { 
        competing: 0, 
        collaborating: 0, 
        accommodating: 0, 
        avoiding: 0, 
        compromising: 0 
    };
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        const score = question.scoring[answerIndex];
        scores[question.dimension] += score;
    });
    
    // Calculate percentages
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const percentages = {};
    Object.keys(scores).forEach(key => {
        percentages[key] = Math.round((scores[key] / totalScore) * 100);
    });
    
    // Determine primary style
    const primaryStyle = Object.keys(percentages).reduce((a, b) => 
        percentages[a] > percentages[b] ? a : b
    );
    
    return {
        scores: scores,
        percentages: percentages,
        primaryStyle: primaryStyle,
        totalScore: totalScore
    };
}

function calculateVIA() {
    const strengthScores = {};
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        const score = question.scoring[answerIndex];
        if (!strengthScores[question.dimension]) {
            strengthScores[question.dimension] = 0;
        }
        strengthScores[question.dimension] += score;
    });
    
    // Sort strengths by score
    const sortedStrengths = Object.entries(strengthScores)
        .sort(([,a], [,b]) => b - a)
        .map(([strength, score]) => ({ strength, score }));
    
    // Get top 5 character strengths
    const topStrengths = sortedStrengths.slice(0, 5);
    
    return {
        allStrengths: strengthScores,
        topStrengths: topStrengths,
        sortedStrengths: sortedStrengths
    };
}

function calculateEQ() {
    const scores = { 
        'self-awareness': 0, 
        'self-regulation': 0, 
        'empathy': 0, 
        'social-skills': 0 
    };
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        const question = testData.questions[questionIndex];
        const score = question.scoring[answerIndex];
        scores[question.dimension] += score;
    });
    
    // Calculate averages (each dimension has 5 questions)
    const averages = {};
    Object.keys(scores).forEach(key => {
        averages[key] = Math.round((scores[key] / 5) * 20); // Convert to percentage
    });
    
    // Calculate overall EQ score
    const overallScore = Math.round(Object.values(averages).reduce((sum, score) => sum + score, 0) / 4);
    
    return {
        scores: scores,
        averages: averages,
        overallScore: overallScore
    };
}

// Trending Test Calculations

function calculateLoveLanguage() {
    const scores = [0, 0, 0, 0, 0]; // Physical Touch, Words, Acts of Service, Gifts, Quality Time
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        scores[answerIndex]++;
    });
    
    const max = Math.max(...scores);
    const primaryIndex = scores.indexOf(max);
    
    const languages = [
        { name: "Physical Touch", emoji: "🤗", description: "You express and feel love through physical affection like hugs, kisses, and touch." },
        { name: "Words of Affirmation", emoji: "💬", description: "You express and feel love through verbal expressions of care, compliments, and encouragement." },
        { name: "Acts of Service", emoji: "🛠️", description: "You express and feel love through helpful actions and doing things for your loved ones." },
        { name: "Receiving Gifts", emoji: "🎁", description: "You express and feel love through thoughtful gifts and tokens of appreciation." },
        { name: "Quality Time", emoji: "⏰", description: "You express and feel love through focused, uninterrupted time spent together." }
    ];
    
    return {
        primary: languages[primaryIndex],
        scores: scores,
        percentages: scores.map(score => Math.round((score / userAnswers.length) * 100))
    };
}

function calculatePetPersonality() {
    const scores = [0, 0, 0, 0, 0]; // Cat, Dog, Hamster, Rabbit, Fish
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        scores[answerIndex]++;
    });
    
    const max = Math.max(...scores);
    const primaryIndex = scores.indexOf(max);
    
    const pets = [
        { 
            name: "Cat", 
            emoji: "🐱", 
            description: "Independent, selective, and mysterious. You value your autonomy and choose your close relationships carefully.",
            traits: ["Independent", "Selective", "Observant", "Calm", "Self-sufficient"]
        },
        { 
            name: "Dog", 
            emoji: "🐕", 
            description: "Loyal, energetic, and social. You're devoted to your pack and love adventure and new experiences.",
            traits: ["Loyal", "Energetic", "Social", "Adventurous", "Faithful"]
        },
        { 
            name: "Hamster", 
            emoji: "🐹", 
            description: "Playful, active, and busy. You're always on the go and love staying active and engaged.",
            traits: ["Active", "Playful", "Busy", "Energetic", "Fun-loving"]
        },
        { 
            name: "Rabbit", 
            emoji: "🐰", 
            description: "Gentle, affectionate, and comfort-loving. You value warmth, love, and close relationships.",
            traits: ["Gentle", "Affectionate", "Soft-hearted", "Loving", "Sensitive"]
        },
        { 
            name: "Fish", 
            emoji: "🐠", 
            description: "Peaceful, calm, and tranquil. You prefer serene environments and quiet contemplation.",
            traits: ["Peaceful", "Calm", "Tranquil", "Meditative", "Serene"]
        }
    ];
    
    return {
        petMatch: pets[primaryIndex],
        scores: scores,
        percentages: scores.map(score => Math.round((score / userAnswers.length) * 100))
    };
}

function calculateCareerPersonality() {
    const scores = [0, 0, 0, 0, 0]; // Leader, Creator, Team Player, Analyst, Helper
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        scores[answerIndex]++;
    });
    
    const max = Math.max(...scores);
    const primaryIndex = scores.indexOf(max);
    
    const careers = [
        { 
            name: "The Leader", 
            emoji: "👑", 
            description: "You're a natural born leader who thrives in high-stakes environments and loves taking charge.",
            careers: ["CEO/Executive", "Project Manager", "Entrepreneur", "Sales Director", "Team Lead"],
            traits: ["Decisive", "Ambitious", "Confident", "Strategic", "Goal-oriented"]
        },
        { 
            name: "The Creator", 
            emoji: "🎨", 
            description: "You're innovative and creative, always looking for new ways to express ideas and solve problems.",
            careers: ["Designer", "Artist", "Writer", "Architect", "Marketing Creative", "Product Developer"],
            traits: ["Creative", "Innovative", "Artistic", "Imaginative", "Original"]
        },
        { 
            name: "The Team Player", 
            emoji: "🤝", 
            description: "You excel in collaborative environments and love building strong relationships with colleagues.",
            careers: ["HR Manager", "Team Coordinator", "Counselor", "Social Worker", "Customer Success"],
            traits: ["Collaborative", "Supportive", "Diplomatic", "Reliable", "Team-oriented"]
        },
        { 
            name: "The Analyst", 
            emoji: "📊", 
            description: "You love diving deep into data and solving complex problems through systematic analysis.",
            careers: ["Data Scientist", "Research Analyst", "Software Engineer", "Financial Analyst", "Scientist"],
            traits: ["Analytical", "Detail-oriented", "Logical", "Systematic", "Precise"]
        },
        { 
            name: "The Helper", 
            emoji: "💝", 
            description: "You're passionate about making a positive impact and helping others achieve their goals.",
            careers: ["Teacher", "Nurse", "Therapist", "Non-profit Worker", "Coach", "Social Worker"],
            traits: ["Empathetic", "Caring", "Patient", "Supportive", "Purpose-driven"]
        }
    ];
    
    return {
        careerType: careers[primaryIndex],
        scores: scores,
        percentages: scores.map(score => Math.round((score / userAnswers.length) * 100))
    };
}

function calculateRelationshipStyle() {
    const scores = [0, 0, 0, 0, 0]; // Independent, Intimate, Playful, Steady, Devoted
    
    userAnswers.forEach((answerIndex, questionIndex) => {
        scores[answerIndex]++;
    });
    
    const max = Math.max(...scores);
    const primaryIndex = scores.indexOf(max);
    
    const styles = [
        { 
            name: "The Independent Partner", 
            emoji: "🦋", 
            description: "You value your autonomy and need space to grow. You bring your whole self to relationships while maintaining your individuality.",
            traits: ["Self-sufficient", "Authentic", "Freedom-loving", "Growth-oriented", "Balanced"],
            tips: "Best with partners who respect your need for space and have their own interests and goals."
        },
        { 
            name: "The Intimate Connector", 
            emoji: "💕", 
            description: "You crave deep emotional connections and love sharing your inner world. You create profound bonds with your partner.",
            traits: ["Emotionally deep", "Intuitive", "Passionate", "Vulnerable", "Soul-connected"],
            tips: "Best with partners who are emotionally available and enjoy deep conversations and connection."
        },
        { 
            name: "The Playful Spirit", 
            emoji: "🎉", 
            description: "You bring joy and laughter to relationships. You keep things light, fun, and full of adventure.",
            traits: ["Fun-loving", "Spontaneous", "Optimistic", "Adventurous", "Light-hearted"],
            tips: "Best with partners who appreciate humor and are up for spontaneous adventures together."
        },
        { 
            name: "The Steady Companion", 
            emoji: "🌳", 
            description: "You provide stability and consistency. You're the rock that your partner can always count on.",
            traits: ["Reliable", "Consistent", "Supportive", "Patient", "Grounding"],
            tips: "Best with partners who value security and appreciate your dependable, caring nature."
        },
        { 
            name: "The Devoted Guardian", 
            emoji: "🛡️", 
            description: "You love with your whole heart and are fiercely protective of your relationships. Loyalty is everything to you.",
            traits: ["Loyal", "Protective", "Committed", "Passionate", "Dedicated"],
            tips: "Best with partners who appreciate deep commitment and can match your level of devotion."
        }
    ];
    
    return {
        relationshipType: styles[primaryIndex],
        scores: scores,
        percentages: scores.map(score => Math.round((score / userAnswers.length) * 100))
    };
}

function showMBTIResults(result) {
    const typeInfo = mbtiTypes[result.type];
    
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('mbti', '16 Personality Types (MBTI)', result.type, result);
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.type}</div>
            <div class="result-title">${typeInfo.title}</div>
            <div class="result-description">${typeInfo.description}</div>
        </div>
        
        <div class="traits-grid">
            <div class="trait">
                <div class="trait-label">Extraversion/Introversion</div>
                <div class="trait-score">${result.percentages['E/I']}%</div>
                <div class="trait-detail">${result.scores.E > result.scores.I ? 'Extraversion' : 'Introversion'}</div>
            </div>
            <div class="trait">
                <div class="trait-label">Sensing/Intuition</div>
                <div class="trait-score">${result.percentages['S/N']}%</div>
                <div class="trait-detail">${result.scores.S > result.scores.N ? 'Sensing' : 'Intuition'}</div>
            </div>
            <div class="trait">
                <div class="trait-label">Thinking/Feeling</div>
                <div class="trait-score">${result.percentages['T/F']}%</div>
                <div class="trait-detail">${result.scores.T > result.scores.F ? 'Thinking' : 'Feeling'}</div>
            </div>
            <div class="trait">
                <div class="trait-label">Judging/Perceiving</div>
                <div class="trait-score">${result.percentages['J/P']}%</div>
                <div class="trait-detail">${result.scores.J > result.scores.P ? 'Judging' : 'Perceiving'}</div>
            </div>
        </div>
        
        <div class="result-section">
            <h3>Your Strengths</h3>
            <ul>
                ${typeInfo.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-section">
            <h3>Potential Challenges</h3>
            <ul>
                ${typeInfo.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-section">
            <h3>Career Suggestions</h3>
            <div class="careers">
                ${typeInfo.careers.map(career => `<span class="career-tag">${career}</span>`).join('')}
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Flex Your Results ✨</h3>
            <p>I'm ${result.type} energy (${typeInfo.title}) and it's honestly perfect for me! What's your vibe? 🔥</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.type}', '${typeInfo.title}')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.type}', '${typeInfo.title}')">🐦 Twitter</button>
                <button class="share-btn tiktok" onclick="shareResults('tiktok', '${result.type}', '${typeInfo.title}')">🎵 TikTok</button>
                <button class="share-btn copy" onclick="copyResults('${result.type}', '${typeInfo.title}')">📋 Copy Link</button>
            </div>
        </div>
        
        <div class="email-capture">
            <h3>Want The Full Breakdown? ✨</h3>
            <p>Get your complete personality guide with career matches, relationship insights, and growth tips delivered straight to your inbox!</p>
            <div class="email-form">
                <input type="email" id="userEmail" placeholder="Enter your email for the full vibe report ✨" class="email-input">
                <button onclick="sendDetailedReport('${result.type}')" class="btn btn-primary">Send My Report ✨</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showBigFiveResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        const shortResult = `O:${result.openness}% C:${result.conscientiousness}% E:${result.extraversion}% A:${result.agreeableness}% N:${result.neuroticism}%`;
        saveTestResult('bigfive', 'Big Five Personality Test', shortResult, result);
    }
    
    const traitDescriptions = {
        openness: {
            high: "You're creative, curious, and love exploring new ideas and experiences! ✨",
            low: "You prefer familiar routines and practical approaches to life! 🎯"
        },
        conscientiousness: {
            high: "You're organized, disciplined, and always get things done! 📋",
            low: "You're flexible and spontaneous, preferring to go with the flow! 🌊"
        },
        extraversion: {
            high: "You're energetic, social, and love being around people! 🎉",
            low: "You recharge in quiet moments and prefer deeper conversations! 🌙"
        },
        agreeableness: {
            high: "You're empathetic, cooperative, and naturally trust others! 🤝",
            low: "You're direct, competitive, and value honest feedback! 💪"
        },
        neuroticism: {
            high: "You feel emotions deeply and are sensitive to stress! 💭",
            low: "You stay calm under pressure and bounce back from setbacks! 🧘"
        }
    };
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">Big Five</div>
            <div class="result-title">Your Personality Breakdown</div>
            <div class="result-description">Here's how you scored across the five major personality dimensions! Each trait is a strength in its own way. ✨</div>
        </div>
        
        <div class="traits-grid">
            ${Object.keys(result.percentiles).map(trait => {
                const score = result.percentiles[trait];
                const isHigh = score >= 60;
                const description = traitDescriptions[trait][isHigh ? 'high' : 'low'];
                return `
                    <div class="trait">
                        <div class="trait-label">${trait.charAt(0).toUpperCase() + trait.slice(1)}</div>
                        <div class="trait-score">${score}%</div>
                        <div class="trait-description">${description}</div>
                    </div>
                `;
            }).join('')}
        </div>
        
        ${getReliabilityDisplay('bigfive')}
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Flex Your Results ✨</h3>
            <p>Just took the Big Five test and honestly these results are so me! What's your personality breakdown? 🧠</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', 'BigFive', 'Science-backed personality')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', 'BigFive', 'Science-backed personality')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('BigFive', 'Science-backed personality')">📋 Copy Link</button>
            </div>
        </div>
        
        <div class="email-capture">
            <h3>Want The Full Breakdown? ✨</h3>
            <p>Get your complete Big Five analysis with career matches and relationship insights!</p>
            <div class="email-form">
                <input type="email" id="userEmail" placeholder="Enter your email for the full report ✨" class="email-input">
                <button onclick="sendDetailedReport('BigFive')" class="btn btn-primary">Send My Report ✨</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showIQResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('iq', 'IQ Test', `IQ: ${result.score}`, result);
    }
    
    // Detailed IQ analysis with percentiles and feedback
    let category, description, percentile, population, strengths, considerations;
    
    if (result.score >= 145) {
        category = "Exceptionally Gifted! 🧠✨";
        description = "Your cognitive abilities are truly exceptional and rare.";
        percentile = "99.9th percentile";
        population = "Only 0.1% of people score this high";
        strengths = [
            "Outstanding abstract reasoning and pattern recognition",
            "Exceptional problem-solving abilities across complex domains",
            "Superior capacity for learning and processing new information",
            "Advanced logical thinking and analytical skills"
        ];
        considerations = [
            "Consider pursuing intellectually challenging careers in research, academia, or innovation",
            "You may find intellectual stimulation in complex puzzles, advanced mathematics, or strategic games",
            "Your thinking style might be quite different from most people - this is perfectly normal"
        ];
    } else if (result.score >= 130) {
        category = "Highly Gifted! 🚀";
        description = "You have superior intellectual abilities that place you in the gifted range.";
        percentile = "98th percentile";
        population = "About 2% of people score in this range";
        strengths = [
            "Strong abstract thinking and conceptual understanding",
            "Excellent problem-solving and analytical abilities",
            "Quick learning and information processing",
            "Good pattern recognition and logical reasoning"
        ];
        considerations = [
            "You likely excel in academic and professional environments",
            "Consider careers that challenge your intellect: STEM fields, law, research, or leadership roles",
            "You may enjoy complex puzzles, strategy games, and intellectual discussions"
        ];
    } else if (result.score >= 115) {
        category = "Above Average Intelligence! 📈";
        description = "Your cognitive abilities are stronger than most people.";
        percentile = "84th percentile";
        population = "About 16% of people score in this range";
        strengths = [
            "Good analytical and reasoning abilities",
            "Solid problem-solving skills",
            "Effective learning and comprehension",
            "Decent pattern recognition abilities"
        ];
        considerations = [
            "You have the cognitive tools for success in most academic and professional areas",
            "Consider roles that utilize your analytical strengths",
            "Continue challenging yourself with learning new skills and concepts"
        ];
    } else if (result.score >= 100) {
        category = "Average Intelligence! 👍";
        description = "Your cognitive abilities are right in the typical range.";
        percentile = "50th percentile";
        population = "About 50% of people score in this range";
        strengths = [
            "Balanced cognitive abilities across different areas",
            "Good practical problem-solving skills",
            "Ability to learn and adapt effectively",
            "Solid reasoning and comprehension abilities"
        ];
        considerations = [
            "You have the cognitive foundation for success in many areas",
            "Focus on developing your unique talents and interests",
            "Consider how motivation, creativity, and persistence contribute to your success"
        ];
    } else if (result.score >= 85) {
        category = "Lower Average Range! 🌱";
        description = "Your results fall in the lower average range, but remember - intelligence has many forms!";
        percentile = "16th percentile";
        population = "About 16% of people score in this range";
        strengths = [
            "Everyone has unique cognitive strengths in different areas",
            "Practical intelligence and life skills are equally important",
            "Creativity, emotional intelligence, and social skills matter greatly",
            "Determination and hard work often matter more than test scores"
        ];
        considerations = [
            "This test measures only specific types of reasoning - you may excel in other areas",
            "Consider your strengths in creativity, emotional intelligence, practical skills, or social abilities",
            "Focus on developing your unique talents and interests"
        ];
    } else {
        category = "Every Brain is Unique! 🌈";
        description = "This test measures only one narrow type of intelligence - you have many other strengths!";
        percentile = "Lower percentiles";
        population = "Test results can vary for many reasons";
        strengths = [
            "Intelligence comes in many forms not measured by IQ tests",
            "Creativity, emotional intelligence, and practical skills are equally valuable",
            "Musical, artistic, athletic, and social intelligences are real and important",
            "Life success depends on many factors beyond test performance"
        ];
        considerations = [
            "Focus on your unique talents, interests, and strengths",
            "Consider that test anxiety, unfamiliarity with format, or other factors may affect results",
            "Multiple intelligences theory suggests we all have different cognitive strengths"
        ];
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">IQ: ${result.score}</div>
            <div class="result-title">${category}</div>
            <div class="result-description">${description}</div>
        </div>
        
        <div class="result-stats">
            <div class="stat-card">
                <div class="stat-number">${result.correctAnswers}/${result.totalQuestions}</div>
                <div class="stat-label">Correct Answers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${result.percentage}%</div>
                <div class="stat-label">Accuracy Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${result.score}</div>
                <div class="stat-label">IQ Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${percentile}</div>
                <div class="stat-label">Percentile Rank</div>
            </div>
        </div>
        
        <div class="result-section">
            <h3>What This Means 📊</h3>
            <p><strong>${population}</strong></p>
            <p>Your score indicates ${description.toLowerCase()}</p>
        </div>
        
        <div class="result-section">
            <h3>Your Cognitive Strengths 💪</h3>
            <ul>
                ${strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-section">
            <h3>What to Consider 💡</h3>
            <ul>
                ${considerations.map(consideration => `<li>${consideration}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-section" style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 1.5rem;">
            <h3>About This Test's Reliability ⚖️</h3>
            <p><strong>Important Disclaimer:</strong> This is a brief online cognitive assessment, not a professional IQ test.</p>
            <ul style="margin-top: 1rem;">
                <li><strong>Limitations:</strong> 30 questions cannot fully capture the complexity of human intelligence</li>
                <li><strong>Factors affecting results:</strong> Test anxiety, fatigue, distractions, unfamiliarity with format, or language barriers</li>
                <li><strong>Professional tests:</strong> Standardized IQ tests (like WAIS-IV) are much longer (2-3 hours) and administered by trained psychologists</li>
                <li><strong>Multiple intelligences:</strong> This test focuses mainly on logical-mathematical reasoning, missing other important types of intelligence</li>
                <li><strong>Cultural bias:</strong> Some questions may favor certain educational or cultural backgrounds</li>
            </ul>
            <div style="background: linear-gradient(135deg, #ff6b95, #ff9a56); color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                <h4 style="margin-bottom: 1rem;">🧠 Important Disclaimer</h4>
                <p style="margin-bottom: 1rem;"><strong>This is a fun brain teaser game, NOT a real IQ test!</strong> Actual IQ testing requires professional administration by qualified psychologists under standardized conditions.</p>
                <p style="margin-bottom: 1rem;">Real IQ tests take 2-4 hours and use validated instruments like the WAIS-IV or Stanford-Binet. This quick quiz is just for entertainment!</p>
                <p style="margin-bottom: 0;"><strong>Use this for fun only - don't make important decisions based on these results! 🎯</strong></p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your Brain Power! 🧠</h3>
            <p>Just scored ${result.score} on the IQ test! My brain is definitely working today 🔥</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', 'IQ-${result.score}', 'Big brain energy')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', 'IQ-${result.score}', 'Big brain energy')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('IQ-${result.score}', 'Big brain energy')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showADHDResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('adhd', 'ADHD Assessment', result.level, result);
    }
    
    const resources = {
        "High": "Consider speaking with a healthcare professional who specializes in ADHD. There are many effective treatments and strategies available!",
        "Moderate": "It might be helpful to discuss these patterns with your doctor or a mental health professional.",
        "Low": "Your responses suggest typical attention and activity patterns. Keep doing what works for you!"
    };
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.level}</div>
            <div class="result-title">ADHD Assessment Results</div>
            <div class="result-description">${result.description}</div>
        </div>
        
        <div class="result-stats">
            <div class="stat-card">
                <div class="stat-number">${result.score}/${result.maxScore}</div>
                <div class="stat-label">Total Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${result.level}</div>
                <div class="stat-label">Likelihood Level</div>
            </div>
        </div>
        
        <div class="result-section">
            <h3>What This Means</h3>
            <p>${resources[result.level]}</p>
            <div style="background: linear-gradient(135deg, #ff6b95, #ff9a56); color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                <h4 style="margin-bottom: 1rem;">⚠️ Medical Disclaimer</h4>
                <p style="margin-bottom: 1rem;"><strong>This is for entertainment and self-reflection only - NOT a medical assessment!</strong> Only licensed healthcare professionals can diagnose ADHD using clinical interviews, medical history, and validated testing.</p>
                <p style="margin-bottom: 1rem;">If you have concerns about attention, focus, or hyperactivity that impact your daily life, please consult:</p>
                <ul style="margin-bottom: 1rem; padding-left: 1.5rem;">
                    <li>Your primary care physician</li>
                    <li>A licensed psychologist or psychiatrist</li>
                    <li>ADHD specialist or clinic</li>
                </ul>
                <p style="margin-bottom: 0;"><strong>Don't use this quiz for medical or professional decisions!</strong></p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Understanding ADHD ⚡</h3>
            <p>Just did an ADHD assessment and learned some interesting things about my brain patterns! 🧠</p>
            <div class="share-buttons">
                <button class="share-btn copy" onclick="copyResults('ADHD-Assessment', 'Understanding my brain')">📋 Share Resources</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showAnxietyResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('anxiety', 'Anxiety Assessment', result.level, result);
    }
    
    const selfCareApproaches = {
        "Severe": ["Reach out to a mental health professional", "Practice deep breathing exercises", "Consider meditation apps", "Connect with trusted friends or family"],
        "Moderate": ["Try regular exercise", "Practice mindfulness", "Limit caffeine", "Talk to a counselor"],
        "Mild": ["Practice stress management", "Get regular sleep", "Try journaling", "Take breaks when needed"],
        "Minimal": ["Keep doing what you're doing", "Maintain healthy habits", "Stay connected with others", "Practice gratitude"]
    };
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.level}</div>
            <div class="result-title">Anxiety Level Assessment</div>
            <div class="result-description">${result.description}</div>
        </div>
        
        <div class="result-stats">
            <div class="stat-card">
                <div class="stat-number">${result.score}/${result.maxScore}</div>
                <div class="stat-label">Anxiety Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${result.level}</div>
                <div class="stat-label">Anxiety Level</div>
            </div>
        </div>
        
        <div class="result-section">
            <h3>Self-Care Suggestions 💚</h3>
            <ul>
                ${selfCareApproaches[result.level].map(approach => `<li>${approach}</li>`).join('')}
            </ul>
            <div style="background: linear-gradient(135deg, #ff6b95, #ff9a56); color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                <h4 style="margin-bottom: 1rem;">💚 Mental Health Disclaimer</h4>
                <p style="margin-bottom: 1rem;"><strong>This is a fun self-reflection tool, NOT a mental health assessment!</strong> Only licensed mental health professionals can diagnose anxiety disorders.</p>
                <p style="margin-bottom: 1rem;"><strong>If you're struggling with anxiety, stress, or worry, please reach out:</strong></p>
                <ul style="margin-bottom: 1rem; padding-left: 1.5rem;">
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong>Licensed therapist or counselor</strong></li>
                    <li><strong>Your healthcare provider</strong></li>
                </ul>
                <p style="margin-bottom: 0;">You deserve support and care. This quiz is just for fun - not medical advice! 💝</p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="crisis-info" style="background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: 8px; margin-top: 2rem;">
            <p><strong>Crisis Support:</strong> If you're in crisis, please reach out to the 988 Suicide & Crisis Lifeline (call or text 988) or go to your nearest emergency room.</p>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showDepressionResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('depression', 'Depression Assessment', result.level, result);
    }
    
    const supportResources = {
        "Severe": ["Contact a mental health professional immediately", "Reach out to trusted friends or family", "Consider crisis hotlines if needed", "You don't have to face this alone"],
        "Moderately Severe": ["Connect with a therapist or counselor", "Talk to your doctor", "Lean on your support system", "Consider professional help"],
        "Moderate": ["Consider talking to a counselor", "Practice self-care activities", "Stay connected with others", "Monitor your mood"],
        "Mild": ["Engage in activities you enjoy", "Exercise regularly", "Maintain social connections", "Practice good sleep hygiene"],
        "Minimal": ["Keep up your positive habits", "Stay connected with others", "Continue self-care practices", "Be there for others who might need support"]
    };
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.level}</div>
            <div class="result-title">Mood Assessment Results</div>
            <div class="result-description">${result.description}</div>
        </div>
        
        <div class="result-stats">
            <div class="stat-card">
                <div class="stat-number">${result.score}/${result.maxScore}</div>
                <div class="stat-label">Assessment Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${result.level}</div>
                <div class="stat-label">Severity Level</div>
            </div>
        </div>
        
        <div class="result-section">
            <h3>Support & Resources 🌻</h3>
            <ul>
                ${supportResources[result.level].map(resource => `<li>${resource}</li>`).join('')}
            </ul>
            <div style="background: linear-gradient(135deg, #ff6b95, #ff9a56); color: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                <h4 style="margin-bottom: 1rem;">🌻 Mental Health Disclaimer</h4>
                <p style="margin-bottom: 1rem;"><strong>This is for entertainment and self-reflection only - NOT a clinical assessment!</strong> Only licensed mental health professionals can diagnose depression or mood disorders.</p>
                <p style="margin-bottom: 1rem;"><strong>If you're struggling with your mood or mental health, please seek support:</strong></p>
                <ul style="margin-bottom: 1rem; padding-left: 1.5rem;">
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong>Licensed therapist, counselor, or psychologist</strong></li>
                    <li><strong>Your primary care physician</strong></li>
                    <li><strong>Mental health crisis center</strong></li>
                </ul>
                <p style="margin-bottom: 0;"><strong>You matter and you deserve support.</strong> This quiz cannot replace professional care! 💚</p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="crisis-info" style="background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: 8px; margin-top: 2rem;">
            <p><strong>Crisis Support:</strong> If you're having thoughts of self-harm, please reach out immediately:</p>
            <ul>
                <li>988 Suicide & Crisis Lifeline: Call or text 988</li>
                <li>Crisis Text Line: Text HOME to 741741</li>
                <li>Go to your nearest emergency room</li>
            </ul>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showDISCResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('disc', 'DISC Assessment', `${result.primaryStyle} Primary`, result);
    }
    
    const discDescriptions = {
        D: {
            title: "Dominance",
            description: "You're direct, decisive, and results-oriented. You prefer taking charge and making things happen!",
            traits: ["Direct", "Decisive", "Results-focused", "Competitive"],
            strengths: ["Quick decision-making", "Goal achievement", "Leadership", "Problem-solving"],
            tips: ["Practice patience with slower-paced colleagues", "Consider others' input before deciding", "Focus on relationship building"]
        },
        I: {
            title: "Influence", 
            description: "You're enthusiastic, sociable, and inspiring. You excel at motivating others and building relationships!",
            traits: ["Enthusiastic", "Sociable", "Inspiring", "Optimistic"],
            strengths: ["Communication", "Team motivation", "Networking", "Creativity"],
            tips: ["Follow through on commitments", "Pay attention to details", "Practice active listening"]
        },
        S: {
            title: "Steadiness",
            description: "You're reliable, patient, and supportive. You provide stability and help others feel secure!",
            traits: ["Reliable", "Patient", "Supportive", "Team-oriented"],
            strengths: ["Consistency", "Collaboration", "Patience", "Loyalty"],
            tips: ["Embrace change as opportunity", "Speak up with your ideas", "Set personal goals"]
        },
        C: {
            title: "Conscientiousness",
            description: "You're analytical, accurate, and systematic. You focus on quality and getting things right!",
            traits: ["Analytical", "Accurate", "Systematic", "Quality-focused"],
            strengths: ["Attention to detail", "Quality control", "Analysis", "Planning"],
            tips: ["Accept that perfection isn't always needed", "Practice quick decision-making", "Focus on the big picture"]
        }
    };
    
    const primaryInfo = discDescriptions[result.primaryStyle];
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.primaryStyle}</div>
            <div class="result-title">${primaryInfo.title} Style</div>
            <div class="result-description">${primaryInfo.description}</div>
        </div>
        
        <div class="traits-grid">
            ${Object.keys(result.percentages).map(style => `
                <div class="trait">
                    <div class="trait-label">${style.toUpperCase()}</div>
                    <div class="trait-score">${result.percentages[style]}%</div>
                    <div class="trait-description">${discDescriptions[style].title}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="result-section">
            <h3>Your Key Traits 💪</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${primaryInfo.traits.map(trait => `<span style="background: #f0f4ff; color: #4f46e5; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600;">${trait}</span>`).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>Your Strengths 🌟</h3>
            <ul>
                ${primaryInfo.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-section">
            <h3>Growth Tips 🚀</h3>
            <ul>
                ${primaryInfo.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your DISC Style! 🎯</h3>
            <p>Just discovered I'm ${result.primaryStyle} (${primaryInfo.title}) style! This explains so much about how I work and communicate 💼</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.primaryStyle}-style', '${primaryInfo.title}')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.primaryStyle}-style', '${primaryInfo.title}')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('${result.primaryStyle}-style', '${primaryInfo.title}')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showConflictResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('conflict', 'Conflict Style Assessment', `${result.primaryStyle} Style`, result);
    }
    
    const conflictDescriptions = {
        competing: {
            title: "Competing",
            description: "You prefer to assert your position and pursue your concerns at others' expense. You're firm and decisive in conflicts.",
            traits: ["Assertive", "Direct", "Goal-oriented", "Confident"],
            strengths: ["Quick decision-making", "Standing up for beliefs", "Emergency leadership", "Goal achievement"],
            tips: ["Listen to others' perspectives", "Consider win-win solutions", "Practice empathy", "Use when quick decisive action is needed"]
        },
        collaborating: {
            title: "Collaborating",
            description: "You seek to work with others to find solutions that fully satisfy everyone's concerns. You're great at finding win-win outcomes!",
            traits: ["Cooperative", "Creative", "Patient", "Thorough"],
            strengths: ["Problem-solving", "Relationship building", "Innovation", "Consensus building"],
            tips: ["Use when all concerns are important", "Be patient with the process", "Ensure everyone participates", "Best for complex issues"]
        },
        accommodating: {
            title: "Accommodating", 
            description: "You're willing to neglect your own concerns to satisfy others. You're generous and self-sacrificing in conflicts.",
            traits: ["Selfless", "Peaceful", "Supportive", "Flexible"],
            strengths: ["Maintaining relationships", "Team harmony", "Flexibility", "Supporting others"],
            tips: ["Speak up for your needs too", "Set healthy boundaries", "Use when preserving relationships is key", "Balance giving with receiving"]
        },
        avoiding: {
            title: "Avoiding",
            description: "You tend to sidestep conflicts altogether. You're diplomatic and prefer to postpone difficult conversations.",
            traits: ["Diplomatic", "Patient", "Reflective", "Non-confrontational"],
            strengths: ["Staying calm under pressure", "Giving space for emotions to cool", "Preventing escalation", "Thoughtful responses"],
            tips: ["Address important issues directly", "Practice assertiveness", "Use when tensions are high", "Don't avoid forever - set a time to revisit"]
        },
        compromising: {
            title: "Compromising",
            description: "You seek middle-ground solutions where everyone gives up something. You're practical and expedient in resolving conflicts.",
            traits: ["Practical", "Fair", "Expedient", "Balanced"],
            strengths: ["Quick resolution", "Fairness", "Practicality", "Flexibility"],
            tips: ["Ensure compromise is truly fair", "Consider if full collaboration is possible", "Use when time is limited", "Make sure core needs are met"]
        }
    };
    
    const primaryInfo = conflictDescriptions[result.primaryStyle];
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${primaryInfo.title}</div>
            <div class="result-title">Conflict Resolution Style</div>
            <div class="result-description">${primaryInfo.description}</div>
        </div>
        
        <div class="traits-grid">
            ${Object.keys(result.percentages).map(style => `
                <div class="trait">
                    <div class="trait-label">${style.charAt(0).toUpperCase() + style.slice(1)}</div>
                    <div class="trait-score">${result.percentages[style]}%</div>
                    <div class="trait-description">${conflictDescriptions[style].title}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="result-section">
            <h3>Your Approach 🤝</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${primaryInfo.traits.map(trait => `<span style="background: #f0f4ff; color: #4f46e5; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600;">${trait}</span>`).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>Your Strengths ⚖️</h3>
            <ul>
                ${primaryInfo.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        
        <div class="result-section">
            <h3>Usage Tips 💡</h3>
            <ul>
                ${primaryInfo.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your Conflict Style! ⚖️</h3>
            <p>Just learned I'm a ${primaryInfo.title.toLowerCase()} when it comes to conflict resolution! Understanding our styles helps relationships so much 🤝</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.primaryStyle}-conflict', '${primaryInfo.title}')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.primaryStyle}-conflict', '${primaryInfo.title}')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('${result.primaryStyle}-conflict', '${primaryInfo.title}')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showVIAResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('via', 'Character Strengths (VIA)', `Top: ${result.topStrengths[0].strength}`, result);
    }
    
    const strengthDescriptions = {
        creativity: "You think of novel and productive ways to conceptualize and do things",
        curiosity: "You take an ongoing interest in experience and find subjects fascinating",
        judgment: "You think things through and examine them from all sides",
        love_of_learning: "You love learning new things and mastering new skills",
        perspective: "You are able to provide wise counsel and take the big picture view",
        bravery: "You don't shirk from challenge, difficulty, or pain",
        perseverance: "You work hard to finish what you begin",
        honesty: "You speak the truth and are genuine and authentic",
        zest: "You approach life with excitement and energy",
        love: "You are capable of close relationships and value them",
        kindness: "You are kind and generous to others and never too busy to do a favor",
        social_intelligence: "You are aware of others' feelings and know what to do socially",
        teamwork: "You are a loyal team member and do your share",
        fairness: "You treat all people the same according to justice and fairness",
        leadership: "You encourage a group to accomplish tasks while maintaining good relations",
        forgiveness: "You forgive those who have done you wrong",
        humility: "You let your accomplishments speak for themselves",
        prudence: "You are careful and your choices are consistently wise",
        self_regulation: "You discipline yourself and are in control of your actions",
        appreciation_of_beauty: "You notice and appreciate beauty, excellence, and skill",
        gratitude: "You are aware of good things and express thanks",
        hope: "You expect the best in the future and work to achieve it",
        humor: "You like to laugh and bring smiles to other people",
        spirituality: "You have strong beliefs about the higher purpose and meaning of life"
    };
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">💎</div>
            <div class="result-title">Your Character Strengths</div>
            <div class="result-description">These are your core character strengths that define who you are at your best!</div>
        </div>
        
        <div class="result-section">
            <h3>Your Top 5 Character Strengths 🌟</h3>
            <div style="display: grid; gap: 1rem;">
                ${result.topStrengths.map((item, index) => `
                    <div style="background: linear-gradient(135deg, #f0f4ff, #fef3c7); padding: 1.5rem; border-radius: 12px; border: 2px solid ${index === 0 ? '#4f46e5' : '#e2e8f0'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <h4 style="margin: 0; color: #1e293b; text-transform: capitalize;">${index + 1}. ${item.strength.replace(/_/g, ' ')}</h4>
                            <span style="background: #4f46e5; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-weight: 600; font-size: 0.9rem;">${item.score}/5</span>
                        </div>
                        <p style="margin: 0; color: #64748b; line-height: 1.5;">${strengthDescriptions[item.strength]}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>How to Use Your Strengths 💪</h3>
            <ul>
                <li><strong>At Work:</strong> Look for opportunities to use your top strengths daily</li>
                <li><strong>Relationships:</strong> Share your strengths with loved ones and appreciate theirs</li>
                <li><strong>Personal Growth:</strong> Develop your signature strengths further</li>
                <li><strong>Challenges:</strong> Use your strengths to overcome difficulties</li>
                <li><strong>Team Dynamics:</strong> Contribute your unique strengths to group efforts</li>
            </ul>
        </div>
        
        <div class="result-section">
            <h3>All Your Strengths Rankings 📊</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 1rem;">
                ${result.sortedStrengths.map((item, index) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: #f8fafc; border-radius: 6px; font-size: 0.9rem;">
                        <span style="text-transform: capitalize;">${item.strength.replace(/_/g, ' ')}</span>
                        <span style="font-weight: 600; color: #4f46e5;">${item.score}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your Character Strengths! 💎</h3>
            <p>Just discovered my top character strength is ${result.topStrengths[0].strength.replace(/_/g, ' ')}! It's amazing to understand what makes us uniquely awesome ✨</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', 'character-strengths', '${result.topStrengths[0].strength.replace(/_/g, ' ')}')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', 'character-strengths', '${result.topStrengths[0].strength.replace(/_/g, ' ')}')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('character-strengths', '${result.topStrengths[0].strength.replace(/_/g, ' ')}')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showEQResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('eq', 'Emotional Intelligence (EQ)', `Overall EQ: ${result.overallScore}%`, result);
    }
    
    const dimensionDescriptions = {
        'self-awareness': {
            title: "Self-Awareness",
            description: "Your ability to recognize and understand your own emotions as they occur"
        },
        'self-regulation': {
            title: "Self-Regulation", 
            description: "Your ability to manage and control your emotional responses effectively"
        },
        'empathy': {
            title: "Empathy",
            description: "Your ability to understand and share the feelings of others"
        },
        'social-skills': {
            title: "Social Skills",
            description: "Your ability to manage relationships and navigate social situations"
        }
    };
    
    let overallLevel;
    if (result.overallScore >= 80) {
        overallLevel = "Exceptional! 🌟";
    } else if (result.overallScore >= 70) {
        overallLevel = "High 🎯";
    } else if (result.overallScore >= 60) {
        overallLevel = "Good 👍";
    } else if (result.overallScore >= 50) {
        overallLevel = "Developing 📈";
    } else {
        overallLevel = "Growing 🌱";
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.overallScore}%</div>
            <div class="result-title">Emotional Intelligence</div>
            <div class="result-description">Your overall EQ level is ${overallLevel} You have ${result.overallScore >= 70 ? 'strong' : 'developing'} emotional intelligence skills!</div>
        </div>
        
        <div class="traits-grid">
            ${Object.keys(result.averages).map(dimension => `
                <div class="trait">
                    <div class="trait-label">${dimensionDescriptions[dimension].title}</div>
                    <div class="trait-score">${result.averages[dimension]}%</div>
                    <div class="trait-description">${dimensionDescriptions[dimension].description}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="result-section">
            <h3>What Your EQ Means 🧡</h3>
            <div style="background: linear-gradient(135deg, #fef3c7, #fce7f3); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                ${result.overallScore >= 80 ? `
                    <p><strong>Exceptional EQ!</strong> You have outstanding emotional intelligence. You're highly aware of emotions, both your own and others', and you manage them skillfully. You likely excel in leadership, relationships, and collaboration.</p>
                ` : result.overallScore >= 70 ? `
                    <p><strong>High EQ!</strong> You have strong emotional intelligence skills. You're generally good at understanding emotions and managing relationships. Continue developing these skills for even greater success.</p>
                ` : result.overallScore >= 60 ? `
                    <p><strong>Good EQ!</strong> You have solid emotional intelligence foundations. There's room to grow in some areas, which is totally normal! Focus on your lower-scoring dimensions for improvement.</p>
                ` : result.overallScore >= 50 ? `
                    <p><strong>Developing EQ!</strong> You're building your emotional intelligence skills. This is a great starting point! EQ can be learned and improved with practice and awareness.</p>
                ` : `
                    <p><strong>Growing EQ!</strong> You're at the beginning of your emotional intelligence journey. The good news? EQ can be significantly improved with practice, mindfulness, and learning!</p>
                `}
            </div>
        </div>
        
        <div class="result-section">
            <h3>Tips to Improve Your EQ 🚀</h3>
            <ul>
                <li><strong>Practice mindfulness:</strong> Pay attention to your emotions as they arise</li>
                <li><strong>Listen actively:</strong> Focus fully on others when they speak</li>
                <li><strong>Pause before reacting:</strong> Take a moment to choose your response</li>
                <li><strong>Ask questions:</strong> Show genuine interest in others' perspectives</li>
                <li><strong>Express empathy:</strong> Acknowledge and validate others' feelings</li>
                <li><strong>Manage stress:</strong> Develop healthy coping strategies</li>
                <li><strong>Practice assertiveness:</strong> Communicate your needs respectfully</li>
            </ul>
        </div>
        
        <div class="result-section">
            <h3>Your Strongest Areas 💪</h3>
            ${Object.entries(result.averages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 2)
                .map(([dimension, score]) => `
                    <div style="background: #f0f4ff; padding: 1rem; border-radius: 8px; margin: 0.5rem 0;">
                        <strong>${dimensionDescriptions[dimension].title}</strong> (${score}%): ${dimensionDescriptions[dimension].description}
                    </div>
                `).join('')}
        </div>
        
        ${addLoginPromptToResults()}
        
        <!-- Premium Report Upsell -->
        <div class="premium-upsell">
            <h3>🎯 Want Your Complete Personality Report?</h3>
            <div class="premium-preview">
                <p>Get your detailed 8-page professional report including:</p>
                <ul class="premium-features">
                    <li>✨ <strong>Career Recommendations</strong> - Specific jobs perfect for your EQ level</li>
                    <li>💕 <strong>Relationship Compatibility Guide</strong> - How to connect with different personality types</li>
                    <li>🚀 <strong>Personal Growth Action Plan</strong> - Step-by-step emotional intelligence development</li>
                    <li>🎭 <strong>Communication Style Analysis</strong> - How you interact and influence others</li>
                    <li>🌟 <strong>Famous People With Your Type</strong> - See who shares your emotional style</li>
                    <li>📊 <strong>Detailed Score Breakdown</strong> - Deep dive into each EQ dimension</li>
                </ul>
                <div class="premium-price">
                    <span class="price-highlight">Just $2.99</span>
                    <span class="price-note">• Instant download • No subscription</span>
                </div>
                <button class="btn-premium" onclick="purchasePremiumReport('eq', ${result.overallScore}, '${JSON.stringify(result).replace(/'/g, "\\'")}')">
                    💎 Get My Premium Report - $2.99
                </button>
                <p class="premium-guarantee">30-day money-back guarantee • Secure payment via Stripe</p>
            </div>
        </div>
        
        <div class="share-section">
            <h3>Share Your EQ Results! 🧡</h3>
            <p>Just measured my emotional intelligence and got ${result.overallScore}% overall EQ! Understanding emotions is such a superpower 💝</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', 'EQ-${result.overallScore}%', 'Emotional Intelligence')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', 'EQ-${result.overallScore}%', 'Emotional Intelligence')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('EQ-${result.overallScore}%', 'Emotional Intelligence')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

// Trending Test Result Display Functions

function showLoveLanguageResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('loveLanguage', 'Love Language Test', `${result.primary.name}`, result);
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.primary.emoji}</div>
            <div class="result-title">${result.primary.name}</div>
            <div class="result-description">${result.primary.description}</div>
        </div>
        
        <div class="result-section">
            <h3>Your Love Language Breakdown 💕</h3>
            <div class="traits-grid">
                ${result.percentages.map((percentage, index) => {
                    const languages = [
                        { name: "Physical Touch", emoji: "🤗" },
                        { name: "Words of Affirmation", emoji: "💬" },
                        { name: "Acts of Service", emoji: "🛠️" },
                        { name: "Receiving Gifts", emoji: "🎁" },
                        { name: "Quality Time", emoji: "⏰" }
                    ];
                    return `
                        <div class="trait">
                            <div class="trait-label">${languages[index].emoji} ${languages[index].name}</div>
                            <div class="trait-score">${percentage}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>What This Means For You 💖</h3>
            <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                <p><strong>Your primary love language is ${result.primary.name}!</strong> This means you feel most loved and express love most naturally through this approach.</p>
                <br>
                <p><strong>Tips for your relationships:</strong></p>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    <li>Share this with your partner so they know how to love you best!</li>
                    <li>Remember that others might have different love languages</li>
                    <li>Try to express love in your partner's primary language, not just your own</li>
                    <li>Don't be afraid to ask for love in the way that speaks to you most</li>
                </ul>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <!-- Premium Report Upsell -->
        <div class="premium-upsell">
            <h3>💕 Want Your Complete Love Language Analysis?</h3>
            <div class="premium-preview">
                <p>Get your detailed relationship compatibility report including:</p>
                <ul class="premium-features">
                    <li>💑 <strong>Partner Compatibility Guide</strong> - How to love and connect with every personality type</li>
                    <li>💬 <strong>Communication Scripts</strong> - Exact words to use for deeper connection</li>
                    <li>🎯 <strong>Relationship Action Plan</strong> - Build stronger bonds in 30 days</li>
                    <li>💍 <strong>Dating Profile Optimizer</strong> - Attract your perfect match</li>
                    <li>🔥 <strong>Passion & Intimacy Guide</strong> - Speak each other's love language fluently</li>
                    <li>⭐ <strong>Celebrity Love Matches</strong> - See famous couples who share your style</li>
                </ul>
                <div class="premium-price">
                    <span class="price-highlight">Just $2.99</span>
                    <span class="price-note">• Perfect for couples • No subscription</span>
                </div>
                <button class="btn-premium" onclick="purchasePremiumReport('loveLanguage', '${result.primary.name}', '${JSON.stringify(result).replace(/'/g, "\\'")}')">
                    💎 Get My Love Report - $2.99
                </button>
                <p class="premium-guarantee">30-day money-back guarantee • Secure payment via Stripe</p>
            </div>
        </div>
        
        <div class="share-section">
            <h3>Share Your Love Language! 💕</h3>
            <p>Just discovered my love language is ${result.primary.name}! Finally understanding how I give and receive love 💖</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.primary.name}', 'Love Language')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.primary.name}', 'Love Language')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('${result.primary.name}', 'Love Language')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showPetPersonalityResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('petPersonality', 'Pet Personality Match', `${result.petMatch.name}`, result);
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.petMatch.emoji}</div>
            <div class="result-title">You're a ${result.petMatch.name}!</div>
            <div class="result-description">${result.petMatch.description}</div>
        </div>
        
        <div class="result-section">
            <h3>Your ${result.petMatch.name} Traits 🐾</h3>
            <div class="traits-grid">
                ${result.petMatch.traits.map(trait => `
                    <div class="trait">
                        <div class="trait-label">${trait}</div>
                        <div class="trait-score">✨</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>All Pet Personalities 🏆</h3>
            <div class="traits-grid">
                ${result.percentages.map((percentage, index) => {
                    const pets = [
                        { name: "Cat", emoji: "🐱" },
                        { name: "Dog", emoji: "🐕" },
                        { name: "Hamster", emoji: "🐹" },
                        { name: "Rabbit", emoji: "🐰" },
                        { name: "Fish", emoji: "🐠" }
                    ];
                    return `
                        <div class="trait">
                            <div class="trait-label">${pets[index].emoji} ${pets[index].name}</div>
                            <div class="trait-score">${percentage}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>Perfect Pet Match! 🎯</h3>
            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                <p><strong>You'd be perfect with a ${result.petMatch.name}!</strong> Your personalities would complement each other beautifully.</p>
                <br>
                <p>Just like ${result.petMatch.name.toLowerCase()}s, you bring these amazing qualities to your relationships and daily life. Whether you already have a ${result.petMatch.name.toLowerCase()} or you're thinking about getting one, this match makes total sense! 🥰</p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your Pet Match! 🐾</h3>
            <p>Just found out my personality matches a ${result.petMatch.name}! This is so accurate it's scary 😅</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.petMatch.name} Personality', 'Pet Match')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.petMatch.name} Personality', 'Pet Match')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('${result.petMatch.name} Personality', 'Pet Match')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showCareerPersonalityResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('careerPersonality', 'Career Personality Type', `${result.careerType.name}`, result);
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.careerType.emoji}</div>
            <div class="result-title">${result.careerType.name}</div>
            <div class="result-description">${result.careerType.description}</div>
        </div>
        
        <div class="result-section">
            <h3>Your Career Traits 💼</h3>
            <div class="traits-grid">
                ${result.careerType.traits.map(trait => `
                    <div class="trait">
                        <div class="trait-label">${trait}</div>
                        <div class="trait-score">🌟</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>Perfect Career Matches 🚀</h3>
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                <p><strong>Careers that would suit you:</strong></p>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${result.careerType.careers.map(career => `<li>${career}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="result-section">
            <h3>All Career Types 📊</h3>
            <div class="traits-grid">
                ${result.percentages.map((percentage, index) => {
                    const careers = [
                        { name: "Leader", emoji: "👑" },
                        { name: "Creator", emoji: "🎨" },
                        { name: "Team Player", emoji: "🤝" },
                        { name: "Analyst", emoji: "📊" },
                        { name: "Helper", emoji: "💝" }
                    ];
                    return `
                        <div class="trait">
                            <div class="trait-label">${careers[index].emoji} ${careers[index].name}</div>
                            <div class="trait-score">${percentage}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your Career Type! 💼</h3>
            <p>Just discovered I'm ${result.careerType.name} energy! This explains so much about my work style 🎯</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.careerType.name}', 'Career Type')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.careerType.name}', 'Career Type')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('${result.careerType.name}', 'Career Type')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

function showRelationshipStyleResults(result) {
    // Save result if user is logged in
    if (currentUser) {
        saveTestResult('relationshipStyle', 'Relationship Style', `${result.relationshipType.name}`, result);
    }
    
    document.getElementById('resultsContent').innerHTML = `
        <div class="result-header">
            <div class="result-type">${result.relationshipType.emoji}</div>
            <div class="result-title">${result.relationshipType.name}</div>
            <div class="result-description">${result.relationshipType.description}</div>
        </div>
        
        <div class="result-section">
            <h3>Your Relationship Traits 💝</h3>
            <div class="traits-grid">
                ${result.relationshipType.traits.map(trait => `
                    <div class="trait">
                        <div class="trait-label">${trait}</div>
                        <div class="trait-score">💖</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="result-section">
            <h3>Relationship Tips For You 🌟</h3>
            <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                <p><strong>Perfect Partner Match:</strong> ${result.relationshipType.tips}</p>
                <br>
                <p><strong>General Relationship Advice:</strong></p>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    <li>Communicate your relationship style to your partner early on</li>
                    <li>Respect differences in how others approach relationships</li>
                    <li>Stay true to your authentic relationship needs</li>
                    <li>Find someone who appreciates and complements your style</li>
                </ul>
            </div>
        </div>
        
        <div class="result-section">
            <h3>All Relationship Styles 💕</h3>
            <div class="traits-grid">
                ${result.percentages.map((percentage, index) => {
                    const styles = [
                        { name: "Independent", emoji: "🦋" },
                        { name: "Intimate", emoji: "💕" },
                        { name: "Playful", emoji: "🎉" },
                        { name: "Steady", emoji: "🌳" },
                        { name: "Devoted", emoji: "🛡️" }
                    ];
                    return `
                        <div class="trait">
                            <div class="trait-label">${styles[index].emoji} ${styles[index].name}</div>
                            <div class="trait-score">${percentage}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="share-section">
            <h3>Share Your Relationship Style! 💝</h3>
            <p>Just discovered I'm ${result.relationshipType.name} in relationships! This is so accurate 💖</p>
            <div class="share-buttons">
                <button class="share-btn instagram" onclick="shareResults('instagram', '${result.relationshipType.name}', 'Relationship Style')">📸 Instagram Story</button>
                <button class="share-btn twitter" onclick="shareResults('twitter', '${result.relationshipType.name}', 'Relationship Style')">🐦 Twitter</button>
                <button class="share-btn copy" onclick="copyResults('${result.relationshipType.name}', 'Relationship Style')">📋 Copy Link</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsModal').style.display = 'block';
}

// Premium Report System

function purchasePremiumReport(testType, score, resultData) {
    // Track premium report view
    if (typeof trackPremiumView !== 'undefined') {
        trackPremiumView(testType);
    }
    
    // Show premium purchase modal
    document.getElementById('premiumModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Generate premium content based on test type
    const premiumContent = generatePremiumContent(testType, score, resultData);
    document.getElementById('premiumContent').innerHTML = premiumContent;
    
    // Initialize Stripe Elements after modal content is loaded
    setTimeout(() => {
        initializeStripeElements();
    }, 100);
}

function generatePremiumContent(testType, score, resultData) {
    const testTitles = {
        'mbti': 'MBTI Personality Report',
        'bigfive': 'Big Five Personality Report',
        'eq': 'Emotional Intelligence Report',
        'iq': 'Intelligence Quotient Report',
        'loveLanguage': 'Love Language Analysis Report',
        'petPersonality': 'Pet Personality Match Report',
        'careerPersonality': 'Career Personality Report',
        'relationshipStyle': 'Relationship Style Report'
    };

    return `
        <div class="premium-purchase-content">
            <h3>📊 ${testTitles[testType]} - Premium Edition</h3>
            <p>Get your comprehensive 8-page professional report with detailed analysis and actionable insights.</p>
            
            <div class="premium-preview-pages">
                <h4>📋 What's Included in Your Report:</h4>
                <div class="report-pages">
                    <div class="report-page">
                        <strong>📊 Page 1-2: Detailed Score Analysis</strong>
                        <p>Complete breakdown of your results with percentile rankings and comparison data.</p>
                    </div>
                    <div class="report-page">
                        <strong>💼 Page 3-4: Career Recommendations</strong>
                        <p>Specific job roles, industries, and career paths perfect for your personality type.</p>
                    </div>
                    <div class="report-page">
                        <strong>💕 Page 5-6: Relationship Compatibility</strong>
                        <p>How you connect with others, communication style, and relationship advice.</p>
                    </div>
                    <div class="report-page">
                        <strong>🚀 Page 7-8: Growth Action Plan</strong>
                        <p>Step-by-step personal development plan with specific goals and milestones.</p>
                    </div>
                </div>
            </div>
            
            <div class="payment-section">
                <div class="payment-form">
                    <h4>💳 Secure Payment - $2.99</h4>
                    <form id="premiumPaymentForm" onsubmit="processPremiumPayment(event, '${testType}', '${score}')">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" id="premiumEmail" placeholder="your@email.com" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Payment Details</label>
                                <div id="stripe-card-element" style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: white;">
                                    <!-- Stripe Elements will create form elements here -->
                                </div>
                                <div id="stripe-card-errors" role="alert" style="color: #e74c3c; margin-top: 8px; font-size: 14px;"></div>
                            </div>
                        </div>
                        
                        <div class="security-badges">
                            <div class="security-badge">🔒 256-bit SSL</div>
                            <div class="security-badge">💳 Stripe Secure</div>
                            <div class="security-badge">🛡️ PCI Compliant</div>
                        </div>
                        
                        <button type="submit" class="btn-premium" style="width: 100%; margin-top: 1rem;">
                            💎 Purchase Report - $2.99
                        </button>
                    </form>
                    
                    <p class="premium-guarantee" style="text-align: center; margin-top: 1rem;">
                        ✅ Instant download • 💰 30-day money-back guarantee • 🔄 No subscription
                    </p>
                </div>
            </div>
        </div>
    `;
}

function processPremiumPayment(event, testType, score) {
    event.preventDefault();
    
    // Get email
    const email = document.getElementById('premiumEmail').value;
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    
    // Show processing state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '⏳ Processing Payment...';
    submitButton.disabled = true;
    
    // Check if Stripe is properly initialized
    if (!stripe || !elements) {
        // Fallback to demo mode if Stripe not configured
        console.warn('Stripe not configured, using demo mode');
        setTimeout(() => {
            showPremiumSuccess(testType, score, email);
        }, 2000);
        return;
    }
    
    // Create payment method with Stripe
    stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            email: email,
        },
    }).then(function(result) {
        if (result.error) {
            // Show error to customer
            document.getElementById('stripe-card-errors').textContent = result.error.message;
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        } else {
            // Send payment method to your server for processing
            processPaymentOnServer(result.paymentMethod, testType, score, email, submitButton, originalText);
        }
    });
}

// Process payment on server (you'll need to implement the server endpoint)
function processPaymentOnServer(paymentMethod, testType, score, email, submitButton, originalText) {
    // This would normally send to your server to complete the payment
    // For now, we'll simulate a successful payment
    
    fetch('/api/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            payment_method_id: paymentMethod.id,
            email: email,
            test_type: testType,
            score: score,
            amount: 299, // $2.99 in cents
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showPremiumSuccess(testType, score, email);
        } else {
            document.getElementById('stripe-card-errors').textContent = data.error || 'Payment failed. Please try again.';
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    })
    .catch(error => {
        // For demo purposes, simulate success
        console.warn('Payment endpoint not available, using demo mode');
        showPremiumSuccess(testType, score, email);
    });
}

function showPremiumSuccess(testType, score, email) {
    document.getElementById('premiumContent').innerHTML = `
        <div class="premium-success">
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                <h3>Payment Successful!</h3>
                <p>Your premium report has been generated and sent to <strong>${email}</strong></p>
                
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 12px; margin: 2rem 0;">
                    <h4>📧 Check Your Email</h4>
                    <p>Your detailed 8-page personality report is being delivered to your inbox. If you don't see it in a few minutes, check your spam folder.</p>
                </div>
                
                <div style="margin: 2rem 0;">
                    <button class="btn-premium" onclick="downloadPremiumReport('${testType}', '${score}')">
                        📥 Download Report Now
                    </button>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; font-size: 0.9rem;">
                    <p><strong>Order ID:</strong> VBC-${Date.now()}</p>
                    <p><strong>Report Type:</strong> ${testType.toUpperCase()} Premium Analysis</p>
                    <p><strong>Amount Paid:</strong> $2.99</p>
                </div>
                
                <button class="btn btn-secondary" onclick="closePremiumModal()" style="margin-top: 1rem; background: rgba(255, 255, 255, 0.2); border: none; color: white;">
                    Continue to Website
                </button>
            </div>
        </div>
    `;
}

function downloadPremiumReport(testType, score) {
    // Generate and download premium report
    const reportContent = generatePremiumReportPDF(testType, score);
    
    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `Vibecheck-${testType}-Premium-Report.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Track premium purchase
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            'transaction_id': 'VBC-' + Date.now(),
            'value': 2.99,
            'currency': 'USD',
            'items': [{
                'item_id': testType + '_premium',
                'item_name': testType.toUpperCase() + ' Premium Report',
                'category': 'Premium Reports',
                'quantity': 1,
                'price': 2.99
            }]
        });
    }
}

function generatePremiumReportPDF(testType, score) {
    // Generate comprehensive premium report content
    const reportDate = new Date().toLocaleDateString();
    
    return `
===============================================
    VIBECHECK PREMIUM PERSONALITY REPORT
===============================================

Report Type: ${testType.toUpperCase()} Professional Analysis
Generated: ${reportDate}
Score: ${score}
Order ID: VBC-${Date.now()}

===============================================
EXECUTIVE SUMMARY
===============================================

Congratulations on completing your ${testType} personality assessment! This premium report provides a comprehensive analysis of your personality type, including detailed insights, career recommendations, relationship compatibility, and a personalized growth action plan.

Your results indicate unique strengths and areas for development that can guide your personal and professional journey.

===============================================
DETAILED SCORE ANALYSIS
===============================================

[Comprehensive score breakdown would be here]

Your ${testType} results place you in the [SPECIFIC CATEGORY] range, indicating [DETAILED ANALYSIS BASED ON ACTUAL RESULTS].

Percentile Rankings:
- Overall Score: ${score}th percentile
- [Additional detailed breakdowns]

===============================================
CAREER RECOMMENDATIONS
===============================================

Based on your personality type, here are the top career paths that align with your natural strengths:

TOP CAREER MATCHES:
1. [Specific job title] - [Why it fits]
2. [Specific job title] - [Why it fits]
3. [Specific job title] - [Why it fits]

INDUSTRIES TO CONSIDER:
- [Industry 1]: [Explanation]
- [Industry 2]: [Explanation]
- [Industry 3]: [Explanation]

WORK ENVIRONMENTS THAT SUIT YOU:
[Detailed analysis of ideal work settings]

===============================================
RELATIONSHIP COMPATIBILITY
===============================================

COMMUNICATION STYLE:
Your natural communication approach is [DETAILED ANALYSIS]

RELATIONSHIP STRENGTHS:
- [Strength 1]: [Explanation]
- [Strength 2]: [Explanation]
- [Strength 3]: [Explanation]

COMPATIBILITY WITH OTHER TYPES:
[Detailed compatibility analysis]

===============================================
PERSONAL GROWTH ACTION PLAN
===============================================

90-DAY DEVELOPMENT PLAN:

MONTH 1 GOALS:
- [Specific goal 1]
- [Specific goal 2]
- [Specific goal 3]

MONTH 2 GOALS:
- [Specific goal 1]
- [Specific goal 2]
- [Specific goal 3]

MONTH 3 GOALS:
- [Specific goal 1]
- [Specific goal 2]
- [Specific goal 3]

RECOMMENDED RESOURCES:
- Books: [Specific recommendations]
- Apps: [Specific recommendations]
- Courses: [Specific recommendations]

===============================================
FAMOUS PEOPLE WITH YOUR TYPE
===============================================

You share personality traits with successful individuals such as:
[List of famous people with explanations]

===============================================
CONCLUSION & NEXT STEPS
===============================================

Your ${testType} results reveal a unique personality profile with significant strengths in [AREAS]. By focusing on the recommended development areas and leveraging your natural talents, you can achieve greater success and satisfaction in both personal and professional domains.

For continued growth, consider retaking this assessment in 6-12 months to track your development progress.

===============================================
SUPPORT & RESOURCES
===============================================

Need help implementing your action plan?
- Email: support@vibecheck.com
- Visit: vibecheck.com/resources
- Community: Join our personality type groups

Thank you for choosing Vibecheck Premium Reports!

===============================================
© 2024 Vibecheck. All rights reserved.
This report is confidential and intended solely for the recipient.
`;
}

function closePremiumModal() {
    document.getElementById('premiumModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Card number formatting
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe
    initializeStripe();
    // Format card number input
    document.addEventListener('input', function(e) {
        if (e.target.id === 'cardNumber') {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
            if (formattedValue.length <= 19) {
                e.target.value = formattedValue;
            }
        }
        
        if (e.target.id === 'expiryDate') {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        }
        
        if (e.target.id === 'cvv') {
            e.target.value = e.target.value.replace(/\D/g, '');
        }
    });
});

function shareResults(platform, type, title) {
    const texts = {
        twitter: `just got ${type} energy (${title}) on Vibecheck and it's SO accurate ✨ what's your personality type? genuinely curious 👀`,
        instagram: `I'm ${type} energy and honestly it explains everything ✨ check your vibe too!`,
        tiktok: `POV: you find out you're ${type} energy (${title}) and suddenly everything makes sense ✨`
    };
    
    const url = 'https://vibecheck-personality.netlify.app';
    const text = texts[platform] || texts.twitter;
    
    let shareUrl;
    switch(platform) {
        case 'instagram':
            // Instagram doesn't have direct URL sharing, copy text to clipboard
            navigator.clipboard.writeText(`${text}\n\nTake the test: ${url}`);
            alert('Text copied! Paste it in your Instagram story 📸');
            return;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'tiktok':
            // TikTok doesn't have direct URL sharing, copy text to clipboard
            navigator.clipboard.writeText(`${text}\n\nLink in bio: ${url}`);
            alert('Caption copied! Create your TikTok and paste this caption 🎵');
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyResults(type, title) {
    const text = `I just discovered I'm ${type} energy (${title}) on Vibecheck! ✨ What's your personality type?\n\nTake the test: ${window.location.href}`;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary success message
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(() => {
        alert('Link copied to clipboard!');
    });
}

function sendDetailedReport(type) {
    const email = document.getElementById('userEmail').value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Here you would typically send the email to your backend
    // For now, we'll just show a success message
    alert(`Amazing! Your complete ${type} vibe breakdown is on its way to ${email}. Check your inbox in a few minutes! ✨`);
    
    // You could also redirect to a payment page for premium reports
    // window.location.href = `/premium-report?type=${type}&email=${email}`;
}

function closeTest() {
    document.getElementById('testModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeResults() {
    document.getElementById('resultsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const testModal = document.getElementById('testModal');
    const resultsModal = document.getElementById('resultsModal');
    
    if (event.target === testModal) {
        closeTest();
    }
    if (event.target === resultsModal) {
        closeResults();
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add some analytics tracking (replace with your analytics code)
    console.log('Vibecheck website loaded successfully ✨');
});

// Additional CSS for career tags and email form
const additionalCSS = `
<style>
.result-section {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 8px;
}

.result-section h3 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.result-section ul {
    list-style: none;
    padding: 0;
}

.result-section li {
    padding: 0.5rem 0;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
}

.result-section li:last-child {
    border-bottom: none;
}

.careers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.career-tag {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.email-capture {
    background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-top: 2rem;
}

.email-capture h3 {
    color: #1e293b;
    margin-bottom: 1rem;
}

.email-capture p {
    color: #64748b;
    margin-bottom: 1.5rem;
}

.email-form {
    display: flex;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
}

.email-input {
    flex: 1;
    padding: 0.8rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
}

.email-input:focus {
    outline: none;
    border-color: #4f46e5;
}

@media (max-width: 600px) {
    .email-form {
        flex-direction: column;
    }
    
    .careers {
        justify-content: center;
    }
}
</style>
`;

// Inject additional CSS
document.head.insertAdjacentHTML('beforeend', additionalCSS);

// User Management System
let currentUser = null;

// Initialize user system on page load
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
});

function checkUserLogin() {
    const savedUser = localStorage.getItem('vibecheck_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigation(true);
    } else {
        updateNavigation(false);
    }
}

function updateNavigation(isLoggedIn) {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        profileLink.style.display = 'block';
        profileLink.textContent = `${currentUser.name}'s Vibes`;
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        profileLink.style.display = 'none';
    }
}

// Authentication Functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchToRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Create Your Vibe Account ✨';
}

function switchToLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Login to Save Your Vibes ✨';
}

function register() {
    const name = document.getElementById('registerName').value;
    const age = document.getElementById('registerAge').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !age || !email || !password) {
        alert('Please fill in all fields!');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('vibecheck_users') || '[]');
    if (existingUsers.find(user => user.email === email)) {
        alert('An account with this email already exists! Try logging in instead.');
        switchToLogin();
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        age: age,
        email: email,
        password: password, // In a real app, this would be hashed
        joinDate: new Date().toISOString(),
        testResults: [],
        shareableResults: [] // For couples sharing
    };
    
    // Save to users list
    existingUsers.push(newUser);
    localStorage.setItem('vibecheck_users', JSON.stringify(existingUsers));
    
    // Log in the user
    currentUser = newUser;
    localStorage.setItem('vibecheck_user', JSON.stringify(currentUser));
    
    updateNavigation(true);
    closeLogin();
    
    alert(`Welcome to Vibecheck, ${name}! Your account has been created and you're now logged in ✨`);
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Find user
    const existingUsers = JSON.parse(localStorage.getItem('vibecheck_users') || '[]');
    const user = existingUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('Invalid email or password. Please try again or create a new account.');
        return;
    }
    
    // Log in the user
    currentUser = user;
    localStorage.setItem('vibecheck_user', JSON.stringify(currentUser));
    
    updateNavigation(true);
    closeLogin();
    
    alert(`Welcome back, ${user.name}! ✨`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('vibecheck_user');
    updateNavigation(false);
    alert('You\'ve been logged out. Thanks for checking your vibes! ✨');
}

// Profile Functions
function showProfile() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    loadProfileContent();
    document.getElementById('profileModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadProfileContent() {
    const testCount = currentUser.testResults.length;
    const joinDate = new Date(currentUser.joinDate).toLocaleDateString();
    
    // Count unique test types
    const uniqueTests = [...new Set(currentUser.testResults.map(result => result.testType))].length;
    
    let historyHTML = '';
    if (currentUser.testResults.length > 0) {
        historyHTML = currentUser.testResults
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(result => {
                const date = new Date(result.date).toLocaleDateString();
                return `
                    <div class="history-item">
                        <div>
                            <div class="history-test">${result.testName}</div>
                            <div class="history-date">${date}</div>
                        </div>
                        <div>
                            <div class="history-result">${result.shortResult}</div>
                            <div class="history-actions">
                                <button class="btn-small btn-view" onclick="viewSavedResult('${result.id}')">View</button>
                                <button class="btn-small btn-retake" onclick="retakeTest('${result.testType}')">Retake</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
    } else {
        historyHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">No tests taken yet! Time to discover your vibe ✨</p>';
    }
    
    document.getElementById('profileContent').innerHTML = `
        <div class="profile-header">
            <div class="profile-name">${currentUser.name}</div>
            <p style="color: #64748b;">Member since ${joinDate}</p>
            <div class="profile-stats">
                <div class="profile-stat">
                    <span class="profile-stat-number">${testCount}</span>
                    <span class="profile-stat-label">Tests Taken</span>
                </div>
                <div class="profile-stat">
                    <span class="profile-stat-number">${uniqueTests}</span>
                    <span class="profile-stat-label">Different Tests</span>
                </div>
                <div class="profile-stat">
                    <span class="profile-stat-number">✨</span>
                    <span class="profile-stat-label">Vibe Level</span>
                </div>
            </div>
        </div>
        
        <div class="test-history">
            <h3>Your Test History</h3>
            <div class="history-grid">
                ${historyHTML}
            </div>
        </div>
    `;
}

function viewSavedResult(resultId) {
    const result = currentUser.testResults.find(r => r.id === resultId);
    if (result) {
        // Show the full result based on test type
        switch(result.testType) {
            case 'mbti':
                showMBTIResults(result.fullResult);
                break;
            case 'bigfive':
                showBigFiveResults(result.fullResult);
                break;
            case 'iq':
                showIQResults(result.fullResult);
                break;
            case 'adhd':
                showADHDResults(result.fullResult);
                break;
            case 'anxiety':
                showAnxietyResults(result.fullResult);
                break;
            case 'depression':
                showDepressionResults(result.fullResult);
                break;
        }
        closeProfile();
    }
}

function retakeTest(testType) {
    closeProfile();
    startTest(testType);
}

// Save test result to user account
function saveTestResult(testType, testName, shortResult, fullResult) {
    if (!currentUser) {
        return; // Not logged in, don't save
    }
    
    const resultData = {
        id: Date.now().toString(),
        testType: testType,
        testName: testName,
        shortResult: shortResult,
        fullResult: fullResult,
        date: new Date().toISOString()
    };
    
    // Add to user's results
    currentUser.testResults.push(resultData);
    
    // Update user in storage
    localStorage.setItem('vibecheck_user', JSON.stringify(currentUser));
    
    // Also update the users list
    const existingUsers = JSON.parse(localStorage.getItem('vibecheck_users') || '[]');
    const userIndex = existingUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        existingUsers[userIndex] = currentUser;
        localStorage.setItem('vibecheck_users', JSON.stringify(existingUsers));
    }
}

// Add login prompt to results
function addLoginPromptToResults() {
    if (!currentUser) {
        return `
            <div class="login-prompt" style="background: linear-gradient(135deg, #f0f4ff, #e0e7ff); padding: 1.5rem; border-radius: 12px; text-align: center; margin-top: 2rem;">
                <h3 style="color: #1e293b; margin-bottom: 1rem;">Want to Save Your Results? ✨</h3>
                <p style="color: #64748b; margin-bottom: 1rem;">Create a free account to save your test results and track your personality journey!</p>
                <button class="btn btn-primary" onclick="showLogin()">Save My Vibes ✨</button>
            </div>
        `;
    }
    return `
        <div style="background: #f0fff4; border: 1px solid #bbf7d0; padding: 1rem; border-radius: 8px; text-align: center; margin-top: 2rem;">
            <p style="color: #166534; margin: 0;">✅ Result saved to your profile!</p>
        </div>
    `;
}

// Couples Compatibility System
function showCouplesModal() {
    if (!currentUser) {
        alert('Please create an account to use couples features! ✨');
        showLogin();
        return;
    }
    
    loadCouplesContent();
    document.getElementById('couplesModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCouplesModal() {
    document.getElementById('couplesModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function loadCouplesContent() {
    const myShareableResults = currentUser.shareableResults || [];
    
    let shareableResultsHTML = '';
    if (myShareableResults.length > 0) {
        shareableResultsHTML = myShareableResults.map(result => `
            <div class="share-id-section">
                <h4>${result.testName} Results</h4>
                <div class="share-id-code">${result.shareId}</div>
                <p>Share this code with your partner!</p>
                <button class="btn btn-secondary" onclick="copyShareId('${result.shareId}')">Copy Code</button>
            </div>
        `).join('');
    } else {
        shareableResultsHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">Take some tests first to get shareable results! ✨</p>';
    }

    document.getElementById('couplesContent').innerHTML = `
        <div class="couples-tabs">
            <button class="couples-tab active" onclick="switchCouplesTab('share')">Share Results</button>
            <button class="couples-tab" onclick="switchCouplesTab('connect')">Connect</button>
            <button class="couples-tab" onclick="switchCouplesTab('compatibility')">Our Match</button>
        </div>
        
        <div id="shareTab" class="couples-tab-content active">
            <h3>Your Shareable Results ✨</h3>
            <p>Each test you complete gets a unique sharing code. Give these to your partner to compare results!</p>
            ${shareableResultsHTML}
        </div>
        
        <div id="connectTab" class="couples-tab-content">
            <h3>Connect with Your Partner 💕</h3>
            <p>Enter your partner's sharing code to see their results and analyze your compatibility!</p>
            <div class="partner-input">
                <input type="text" id="partnerCode" placeholder="ENTER CODE" maxlength="8" style="text-transform: uppercase;">
                <button class="btn btn-primary" onclick="connectWithPartner()">Connect!</button>
            </div>
            <div id="partnerResults"></div>
        </div>
        
        <div id="compatibilityTab" class="couples-tab-content">
            <h3>Relationship Compatibility Analysis 🌟</h3>
            <div id="compatibilityResults">
                <p style="text-align: center; color: #64748b; padding: 2rem;">Connect with your partner first to see your compatibility analysis! 💖</p>
            </div>
        </div>
    `;
}

function switchCouplesTab(tab) {
    // Remove active from all tabs and content
    document.querySelectorAll('.couples-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.couples-tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active to clicked tab and corresponding content
    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

function generateShareId(testType, result) {
    // Generate unique 8-character code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoiding confusing characters
    let shareId = '';
    for (let i = 0; i < 8; i++) {
        shareId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const shareableResult = {
        shareId: shareId,
        testType: testType,
        testName: getTestName(testType),
        result: result,
        userId: currentUser.id,
        userName: currentUser.name,
        userAge: currentUser.age,
        timestamp: new Date().toISOString()
    };
    
    // Add to user's shareable results
    if (!currentUser.shareableResults) {
        currentUser.shareableResults = [];
    }
    
    // Remove old result of same test type
    currentUser.shareableResults = currentUser.shareableResults.filter(r => r.testType !== testType);
    currentUser.shareableResults.push(shareableResult);
    
    // Update storage
    localStorage.setItem('vibecheck_user', JSON.stringify(currentUser));
    updateUserInStorage(currentUser);
    
    // Store globally for partner lookup
    const globalShares = JSON.parse(localStorage.getItem('vibecheck_shares') || '{}');
    globalShares[shareId] = shareableResult;
    localStorage.setItem('vibecheck_shares', JSON.stringify(globalShares));
    
    return shareId;
}

function getTestName(testType) {
    const names = {
        'mbti': '16 Personality Types (MBTI)',
        'bigfive': 'Big Five Personality Test',
        'iq': 'IQ Test',
        'adhd': 'ADHD Assessment',
        'anxiety': 'Anxiety Assessment',
        'depression': 'Depression Assessment'
    };
    return names[testType] || testType;
}

function copyShareId(shareId) {
    navigator.clipboard.writeText(shareId).then(() => {
        alert(`Share code ${shareId} copied! Send it to your partner ✨`);
    }).catch(() => {
        alert(`Your share code is: ${shareId}`);
    });
}

function connectWithPartner() {
    const partnerCode = document.getElementById('partnerCode').value.toUpperCase().trim();
    
    if (!partnerCode || partnerCode.length !== 8) {
        alert('Please enter a valid 8-character share code!');
        return;
    }
    
    const globalShares = JSON.parse(localStorage.getItem('vibecheck_shares') || '{}');
    const partnerResult = globalShares[partnerCode];
    
    if (!partnerResult) {
        alert('Share code not found! Make sure your partner has taken a test and generated a share code.');
        return;
    }
    
    if (partnerResult.userId === currentUser.id) {
        alert('You can\'t connect with yourself! 😄');
        return;
    }
    
    showPartnerResults(partnerResult);
    generateCompatibilityAnalysis(partnerResult);
}

function showPartnerResults(partnerResult) {
    const ageDisplay = getAgeDisplay(partnerResult.userAge);
    
    document.getElementById('partnerResults').innerHTML = `
        <div class="compatibility-result">
            <h4>✨ Connected with ${partnerResult.userName}${ageDisplay}</h4>
            <p><strong>Test:</strong> ${partnerResult.testName}</p>
            <p><strong>Result:</strong> ${getResultSummary(partnerResult.testType, partnerResult.result)}</p>
            <p style="color: #10b981; font-weight: 600;">Connection successful! Check the "Our Match" tab for compatibility analysis 💕</p>
        </div>
    `;
    
    // Auto-switch to compatibility tab
    setTimeout(() => {
        switchCouplesTab('compatibility');
        document.querySelector('[onclick="switchCouplesTab(\'compatibility\')"]').click();
    }, 2000);
}

function getResultSummary(testType, result) {
    switch(testType) {
        case 'mbti':
            return `${result.type} (${mbtiTypes[result.type]?.title || 'Personality Type'})`;
        case 'bigfive':
            return `O:${result.openness}% C:${result.conscientiousness}% E:${result.extraversion}% A:${result.agreeableness}% N:${result.neuroticism}%`;
        case 'iq':
            return `IQ: ${result.score}`;
        case 'adhd':
            return `${result.level} likelihood`;
        case 'anxiety':
            return `${result.level} anxiety level`;
        case 'depression':
            return `${result.level} mood level`;
        default:
            return 'Test completed';
    }
}

function generateCompatibilityAnalysis(partnerResult) {
    // Find matching test results between partners
    const myResults = currentUser.shareableResults || [];
    const matchingTests = myResults.filter(my => my.testType === partnerResult.testType);
    
    if (matchingTests.length === 0) {
        document.getElementById('compatibilityResults').innerHTML = `
            <p style="text-align: center; color: #64748b; padding: 2rem;">
                Take the ${partnerResult.testName} to see compatibility analysis with ${partnerResult.userName}! 
                <br><br>
                <button class="btn btn-primary" onclick="startTest('${partnerResult.testType}'); closeCouplesModal();">Take Test Now</button>
            </p>
        `;
        return;
    }
    
    const myResult = matchingTests[0];
    const compatibility = calculateCompatibility(myResult, partnerResult);
    
    document.getElementById('compatibilityResults').innerHTML = `
        <div class="compatibility-result">
            <div class="compatibility-score">${compatibility.score}%</div>
            <div class="compatibility-level">${compatibility.level} Match! ${compatibility.emoji}</div>
            <p>${compatibility.description}</p>
            
            <div class="compatibility-details">
                ${compatibility.aspects.map(aspect => `
                    <div class="compatibility-aspect">
                        <h4>${aspect.title}</h4>
                        <p>${aspect.description}</p>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 2rem; padding: 1.5rem; background: #f0fff4; border-radius: 8px;">
                <h4 style="color: #166534; margin-bottom: 1rem;">💡 Relationship Tips</h4>
                <ul style="color: #166534; margin: 0;">
                    ${compatibility.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function calculateCompatibility(user1, user2) {
    const testType = user1.testType;
    
    switch(testType) {
        case 'mbti':
            return calculateMBTICompatibility(user1.result, user2.result, user1.userName, user2.userName);
        case 'bigfive':
            return calculateBigFiveCompatibility(user1.result, user2.result, user1.userName, user2.userName);
        case 'iq':
            return calculateIQCompatibility(user1.result, user2.result, user1.userName, user2.userName);
        default:
            return {
                score: 75,
                level: "Good",
                emoji: "😊",
                description: "You both completed the same test, which shows you're both interested in self-discovery!",
                aspects: [
                    { title: "Shared Interests", description: "You both enjoy learning about yourselves!" }
                ],
                tips: ["Keep taking tests together and discussing your results!"]
            };
    }
}

function calculateMBTICompatibility(result1, result2, name1, name2) {
    const type1 = result1.type;
    const type2 = result2.type;
    
    // MBTI compatibility logic
    let score = 50; // Base compatibility
    let aspects = [];
    let tips = [];
    
    // Same type = high compatibility
    if (type1 === type2) {
        score = 85;
        aspects.push({
            title: "Perfect Match! 🎯",
            description: `You're both ${type1} types! You likely understand each other's motivations, decision-making style, and energy patterns naturally.`
        });
        tips.push("Embrace your similarities while making sure to challenge each other to grow");
    } else {
        // Analyze individual dimensions
        const dims1 = type1.split('');
        const dims2 = type2.split('');
        
        // E/I compatibility
        if (dims1[0] === dims2[0]) {
            score += 10;
            aspects.push({
                title: "Energy Alignment ⚡",
                description: dims1[0] === 'E' ? 
                    "You both love social energy and external stimulation!" :
                    "You both appreciate quiet time and deep conversations!"
            });
        } else {
            score += 5;
            aspects.push({
                title: "Complementary Energy 🔄",
                description: "One extrovert, one introvert - you can balance and learn from each other!"
            });
            tips.push("Respect each other's energy needs - social time AND quiet time");
        }
        
        // S/N compatibility  
        if (dims1[1] === dims2[1]) {
            score += 15;
            aspects.push({
                title: "Information Processing 🧠",
                description: dims1[1] === 'S' ?
                    "You both focus on practical, concrete details and real-world applications!" :
                    "You both love big picture thinking, possibilities, and future potential!"
            });
        } else {
            score -= 5;
            aspects.push({
                title: "Different Perspectives 👁️",
                description: "One focuses on details, one on big picture - this can create great balance but requires patience!"
            });
            tips.push("Practice appreciating both practical details AND future possibilities");
        }
        
        // T/F compatibility
        if (dims1[2] === dims2[2]) {
            score += 15;
            aspects.push({
                title: "Decision Making 🤝",
                description: dims1[2] === 'T' ?
                    "You both value logical analysis and objective decision-making!" :
                    "You both prioritize harmony, values, and the human impact of decisions!"
            });
        } else {
            score += 10;
            aspects.push({
                title: "Balanced Decisions ⚖️",
                description: "One thinks with head, one with heart - together you make well-rounded decisions!"
            });
            tips.push("Combine logical analysis with consideration for people's feelings");
        }
        
        // J/P compatibility
        if (dims1[3] === dims2[3]) {
            score += 10;
            aspects.push({
                title: "Lifestyle Sync 📅",
                description: dims1[3] === 'J' ?
                    "You both like structure, planning, and having things decided!" :
                    "You both enjoy flexibility, spontaneity, and keeping options open!"
            });
        } else {
            score += 5;
            aspects.push({
                title: "Planning Balance 🎯",
                description: "One planner, one improviser - you can help each other find the right balance!"
            });
            tips.push("Compromise between structure and flexibility in your plans");
        }
    }
    
    // Determine level
    let level, emoji;
    if (score >= 80) {
        level = "Excellent";
        emoji = "🔥";
    } else if (score >= 65) {
        level = "Very Good";
        emoji = "💕";
    } else if (score >= 50) {
        level = "Good";
        emoji = "😊";
    } else {
        level = "Challenging";
        emoji = "🌱";
    }
    
    if (tips.length === 0) {
        tips.push("Keep communicating openly about your different approaches to life");
        tips.push("Celebrate both your similarities and differences");
    }
    
    return {
        score: Math.min(95, Math.max(40, score)),
        level: level,
        emoji: emoji,
        description: `As ${type1} and ${type2}, you have ${level.toLowerCase()} compatibility! Your personality types ${score >= 70 ? 'complement each other beautifully' : 'can work together with understanding and communication'}.`,
        aspects: aspects,
        tips: tips
    };
}

function calculateBigFiveCompatibility(result1, result2, name1, name2) {
    // Calculate similarity across Big Five dimensions
    const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    let totalDifference = 0;
    let aspects = [];
    
    traits.forEach(trait => {
        const diff = Math.abs(result1[trait] - result2[trait]);
        totalDifference += diff;
        
        if (diff <= 20) {
            aspects.push({
                title: `${trait.charAt(0).toUpperCase() + trait.slice(1)} Alignment ✨`,
                description: `You both score similarly on ${trait} (${result1[trait]}% vs ${result2[trait]}%), showing compatibility in this area!`
            });
        } else if (diff >= 40) {
            aspects.push({
                title: `${trait.charAt(0).toUpperCase() + trait.slice(1)} Difference 🔄`,
                description: `You have different ${trait} levels (${result1[trait]}% vs ${result2[trait]}%), which can create balance if you understand each other!`
            });
        }
    });
    
    const avgDifference = totalDifference / traits.length;
    const score = Math.max(40, 100 - (avgDifference * 1.5));
    
    let level, emoji;
    if (score >= 80) {
        level = "Excellent";
        emoji = "🔥";
    } else if (score >= 65) {
        level = "Very Good";
        emoji = "💕";
    } else if (score >= 50) {
        level = "Good";
        emoji = "😊";
    } else {
        level = "Challenging";
        emoji = "🌱";
    }
    
    return {
        score: Math.round(score),
        level: level,
        emoji: emoji,
        description: `Your Big Five personalities show ${level.toLowerCase()} compatibility based on trait similarities and differences.`,
        aspects: aspects.slice(0, 4), // Show top 4 most relevant aspects
        tips: [
            "Discuss your different approaches to situations openly",
            "Use your personality differences as strengths, not obstacles",
            "Practice empathy when your traits create different perspectives"
        ]
    };
}

function calculateIQCompatibility(result1, result2, name1, name2) {
    const score1 = result1.score;
    const score2 = result2.score;
    const difference = Math.abs(score1 - score2);
    
    let score, level, emoji, description;
    
    if (difference <= 10) {
        score = 90;
        level = "Excellent";
        emoji = "🧠";
        description = "Your cognitive abilities are very similar, making intellectual communication and problem-solving smooth!";
    } else if (difference <= 20) {
        score = 75;
        level = "Very Good";
        emoji = "💡";
        description = "You have compatible intellectual levels that can complement each other well!";
    } else if (difference <= 30) {
        score = 60;
        level = "Good";
        emoji = "🤝";
        description = "Your different cognitive strengths can balance each other with mutual understanding!";
    } else {
        score = 45;
        level = "Challenging";
        emoji = "🌱";
        description = "Your intellectual approaches differ significantly, which requires extra patience and communication!";
    }
    
    return {
        score: score,
        level: level,
        emoji: emoji,
        description: description,
        aspects: [
            {
                title: "Intellectual Connection 🧠",
                description: `Your IQ scores (${score1} vs ${score2}) show ${difference <= 15 ? 'similar' : 'different'} cognitive processing styles.`
            },
            {
                title: "Problem Solving 🎯",
                description: difference <= 15 ? 
                    "You likely approach problems and learning in compatible ways!" :
                    "Your different thinking styles can provide unique perspectives on challenges!"
            }
        ],
        tips: [
            "Remember that IQ is just one type of intelligence",
            "Appreciate each other's unique cognitive strengths",
            "Use your different thinking styles to solve problems together"
        ]
    };
}

function getAgeDisplay(ageGroup) {
    const ageLabels = {
        'teen': ' (Teen)',
        'young-adult': ' (Young Adult)', 
        'adult': ' (Adult)',
        'mature': ' (Mature Adult)',
        'senior': ' (Senior)'
    };
    return ageLabels[ageGroup] || '';
}

function updateUserInStorage(user) {
    const existingUsers = JSON.parse(localStorage.getItem('vibecheck_users') || '[]');
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        existingUsers[userIndex] = user;
        localStorage.setItem('vibecheck_users', JSON.stringify(existingUsers));
    }
}

// Age-based Question Variations
function getAgeAppropriateQuestions(testType, baseQuestions, userAge) {
    if (!userAge || !currentUser) return baseQuestions;
    
    // For now, return base questions but could implement age-specific variations
    // This is where you'd add age-appropriate question modifications
    return baseQuestions;
}

// Enhanced result saving to include sharing capability
function saveTestResult(testType, testName, shortResult, fullResult) {
    if (!currentUser) {
        return; // Not logged in, don't save
    }
    
    const resultData = {
        id: Date.now().toString(),
        testType: testType,
        testName: testName,
        shortResult: shortResult,
        fullResult: fullResult,
        date: new Date().toISOString()
    };
    
    // Add to user's results
    currentUser.testResults.push(resultData);
    
    // Generate shareable result for couples
    const shareId = generateShareId(testType, fullResult);
    
    // Update user in storage
    localStorage.setItem('vibecheck_user', JSON.stringify(currentUser));
    updateUserInStorage(currentUser);
    
    return shareId;
}

// Update modal close handlers
window.onclick = function(event) {
    const testModal = document.getElementById('testModal');
    const resultsModal = document.getElementById('resultsModal');
    const loginModal = document.getElementById('loginModal');
    const profileModal = document.getElementById('profileModal');
    const couplesModal = document.getElementById('couplesModal');
    
    if (event.target === testModal) {
        closeTest();
    }
    if (event.target === resultsModal) {
        closeResults();
    }
    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === profileModal) {
        closeProfile();
    }
    if (event.target === couplesModal) {
        closeCouplesModal();
    }
}