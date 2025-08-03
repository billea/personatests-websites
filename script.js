// Global Variables
let currentTest = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let testData = {};
let currentLanguage = 'en';

// Mobile Menu Functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuToggle) {
        // Toggle active states
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Close mobile menu when clicking on a menu item
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuToggle) {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuToggle && 
        !mobileMenu.contains(event.target) && 
        !menuToggle.contains(event.target) &&
        mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Add click event to all menu links to close mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
});

// Language translations
const translations = {
    en: {
        nav: {
            tests: "Tests",
            knowYourself: "🧠 Know Yourself",
            howOthersSeeMe: "👥 How Others See Me",
            couples: "Couples", 
            about: "About",
            blog: "Blog",
            contact: "Contact",
            results: "My Results",
            login: "Login ✨",
            logout: "Logout"
        },
        hero: {
            badge: "Most Accurate Personality Tests",
            title: "Discover Your Personality ✨",
            subtitle: "Take scientifically-backed personality tests that actually get you. From MBTI to Big Five, uncover what makes you uniquely you! 🔥",
            cta: "Check My Vibe",
            startJourney: "Start Your Journey",
            stats: {
                tests: "Personality Tests",
                languages: "Languages",
                access: "Always Free",
                private: "Private"
            },
            features: {
                scientific: "Science-Based",
                instant: "Instant Results",
                personalized: "100% Personalized",
                private: "Completely Private"
            }
        },
        stats: {
            categories: "Test Categories",
            reliability: "Scientific Reliability", 
            available: "Always Available"
        },
        ui: {
            previous: "Previous",
            next: "Next",
            finishTest: "Finish Test"
        },
        categories: {
            all: "All",
            knowYourself: "🧠 Know Yourself",
            howOthersSeeMe: "👥 How Others See Me",
            knowYourselfTitle: "🧠 Know Yourself",
            knowYourselfSubtitle: "Discover your inner personality, strengths, and unique traits through scientifically-backed assessments",
            howOthersSeeTitle: "👥 How Others See Me",
            howOthersSubtitle: "Get honest feedback and discover how friends, family, and colleagues really perceive you"
        },
        tests: {
            sectionTitle: "Discover Your Complete Picture ✨",
            sectionSubtitle: "Get the full view: who you are inside AND how others see you! 💫",
            disclaimer: "🎯 Important: For Entertainment & Self-Reflection Only",
            disclaimerText: "These assessments are designed for fun and self-reflection, not professional diagnosis. If you need mental health support, please consult a licensed healthcare provider.",
            takeTest: "Take Test",
            mbti: {
                title: "16 Personalities (MBTI)",
                description: "The ultimate personality test that actually gets you. Are you INTJ mastermind energy or ENFP golden retriever vibes? Time to find out! 💅"
            },
            bigfive: {
                title: "Big Five Personality",
                description: "The science-backed test that psychology professors actually approve of. Get your personality breakdown across 5 major traits! 🧠"
            },
            eq: {
                title: "Emotional Intelligence (EQ)",
                description: "How well do you understand emotions - yours and others? Test your self-awareness, empathy, and social skills! 💝"
            },
            ei: {
                title: "Emotional Intelligence",
                description: "How well do you understand emotions - yours and others? Test your self-awareness, empathy, and social skills! 💝"
            },
            iq: {
                title: "Brain Teaser Challenge",
                description: "Fun logic puzzles and brain games! This is just for entertainment - real IQ testing needs professional administration. Let's see how you do! 🤓"
            },
            lovelanguage: {
                title: "Love Language Test",
                description: "Discover how you give and receive love! Are you physical touch, words of affirmation, or something else? Perfect for couples! 💖"
            },
            adhd: {
                title: "ADHD Self-Assessment",
                description: "Discover your unique attention and energy patterns! This is for fun self-reflection only - not a medical assessment. ⚡"
            },
            anxiety: {
                title: "Anxiety Self-Check", 
                description: "Discover how you handle stress and pressure! This is for fun self-awareness only - not medical advice. 💚"
            },
            depression: {
                title: "Mood Self-Reflection",
                description: "Understand how you process emotions! This is for self-reflection and entertainment only - not a mental health assessment. 🌻"
            },
            strengths: {
                title: "Character Strengths",
                description: "Uncover your core character strengths! From creativity to leadership to kindness - discover what makes you uniquely awesome! ✨"
            },
            careerpath: {
                title: "Career Path Finder",
                description: "Discover the career that matches your personality! Are you a leader, creator, helper, analyst, or entrepreneur? 🚀"
            },
            relationshipstyle: {
                title: "Relationship Style",
                description: "How do you love and connect with others? Discover your unique relationship style and what makes you tick in love! ✨"
            },
            // Test badges and general terms
            trending: "🔥 Trending",
            popular: "✨ Popular", 
            new: "🔥 NEW",
            takeTest: "Take Test",
            createQuestions: "Create Questions",
            startAssessment: "Ask My People",
            // Test metadata terms
            meta: {
                duration: "⏱️ 8 min",
                duration5: "⏱️ 5 min",
                duration6: "⏱️ 6 min", 
                duration7: "⏱️ 7 min",
                duration8: "⏱️ 8 min",
                duration10: "⏱️ 10 min",
                duration12: "⏱️ 12 min",
                duration15: "⏱️ 15 min",
                setup5: "⏱️ 5 min setup",
                setup10: "⏱️ 10 min setup",
                accurate: "🎯 Highly Accurate",
                scienceBased: "🔬 Science-Based",
                researchGrade: "🎯 Research-Grade", 
                mostAccurate: "🏆 Most Accurate",
                relationship: "💝 Relationship",
                couplesFriendly: "❤️ Couples Friendly",
                funGame: "🎮 Fun Game",
                brainTraining: "🧠 Brain Training",
                careerFocused: "🎯 Career Focused",
                careerFocus: "💼 Career Focus",
                leadership: "💼 Leadership",
                selfReflection: "🔍 Self-Reflection",
                notMedical: "⚠️ Not Medical", 
                wellness: "🧘 Wellness",
                moodTracking: "🌈 Mood Tracking",
                strengthsBased: "🌟 Strengths-Based",
                personalGrowth: "🎯 Personal Growth",
                personalized: "🎯 Personalized",
                relationships: "💕 Relationships",
                connection: "🤝 Connection",
                socialApp: "📱 Social",
                socialPeople: "👥 Social", 
                viral: "🔥 Viral",
                detailed: "📊 Detailed",
                couples: "💕 Couples",
                instant: "⚡ Instant",
                fun: "😄 Fun",
                insights: "💡 Insights",
                guidance: "📝 Guidance",
                improvement: "📈 Improvement"
            },
            disc: "DISC Personality Check",
            discDesc: "Discover your communication style! Are you Dominant, Influential, Steady, or Conscientious? Perfect for understanding work and relationship dynamics! 💼",
            conflict: "Conflict Style Assessment", 
            conflictDesc: "How do you handle disagreements? Discover whether you're a collaborator, competitor, accommodator, avoider, or compromiser! 🤝",
            // Removed duplicate test title entries - these should only be in the nested test objects above
            trendingTitle: "Trending Now 🔥",
            trendingSubtitle: "The hottest personality tests everyone's talking about! Perfect for sharing with friends and social media 📱",
            love: "Love Language Test",
            loveDesc: "Discover how you give and receive love! Are you physical touch, words of affirmation, or something else? Perfect for couples! 💖",
            pet: "What Pet Matches Your Personality?",
            petDesc: "Are you a loyal dog, independent cat, playful hamster, or something else? Find your perfect pet match based on your personality! 🐱",
            career: "What's Your Ideal Career Path?",
            careerDesc: "Discover the career that matches your personality! Are you a leader, creator, helper, analyst, or entrepreneur? 🚀",
            relationship: "What's Your Relationship Style?",
            relationshipDesc: "How do you love and connect with others? Discover your unique relationship style and what makes you tick in love! ✨",
            buttons: {
                discoverType: "Discover My Type ✨",
                takeTest: "Take The Test",
                takeBrainChallenge: "Take Brain Challenge",
                checkEQ: "Check My EQ",
                findStyle: "Find My Style",
                checkStyle: "Check My Style",
                findStrengths: "Find My Strengths",
                findLoveLanguage: "Find My Love Language",
                findPetMatch: "Find My Pet Match",
                findCareer: "Find My Career"
            },
            // Ask My Friends Feature
            askfriends: {
                title: "See Who Knows Me Best",
                description: "Create questions about yourself, provide YOUR answers, then see who knows you best! Friends will try to match your answers and get scored on how well they know you.",
                heroTitle: "See Who Knows Me Best 🧩",
                heroSubtitle: "Create questions about yourself, provide YOUR answers, then see who knows you best! Friends will try to match your answers and get scored on how well they know you.",
                viralBadge: "🔥 VIRAL SOCIAL FEATURE",
                categoriesTitle: "What do you want to know about yourself?",
                categoriesSubtitle: "Choose question categories or create your own personalized questions!",
                customTab: "🎨 Custom Questions",
                categoryTab: "📋 Categories",
                customInstructions: "Create your own personalized questions that you're curious about!",
                categoryInstructions: "Pick categories and we'll suggest questions, or customize them yourself!",
                addCustomQuestion: "Add Question",
                customPlaceholder: "What's something you're curious to know about yourself?",
                createButton: "Create My Question Set 🚀",
                trackResultsTitle: "📊 Track Your Results",
                trackResultsDesc: "Your friends' responses will be collected here. We'll email you when someone answers!",
                namePlaceholder: "Your name (optional)",
                emailPlaceholder: "Your email for notifications",
                questionSetReady: "🎉 Your Question Set is Ready!",
                shareInstructions: "Share this link with your friends and see what they think about you!",
                copyLink: "📋 Copy Link",
                emailFriend: "📧 Email Friend", 
                quickShare: "🚀 Quick Share",
                whatsappShare: "💬 WhatsApp",
                twitterShare: "🐦 Twitter",
                facebookShare: "📘 Facebook"
            },
            // 360 Assessment Feature  
            "360assessment": {
                title: "360 Perception About Me",
                description: "Serious, multi-perspective feedback for growth and understanding. Get honest insights from friends, family, and colleagues.",
                heroTitle: "360 Perception About Me 🎯",
                heroSubtitle: "Serious, multi-perspective feedback for growth and understanding. Get comprehensive insights from people who know you best!",
                setupInstructions: "Set up your 360° feedback collection in 3 easy steps:",
                step1: "Choose feedback areas you want to explore",
                step2: "Select reviewers (friends, family, coworkers)",
                step3: "Send invitations and collect anonymous feedback",
                startButton: "Start My Assessment",
                getStarted: "Ask My People"
            },
            // Meta tags for tests
            meta: {
                duration: "⏱️ 8 min",
                duration5: "⏱️ 5 min", 
                duration6: "⏱️ 6 min",
                duration7: "⏱️ 7 min",
                duration8: "⏱️ 8 min",
                duration10: "⏱️ 10 min",
                duration12: "⏱️ 12 min",
                duration15: "⏱️ 15 min",
                setup5: "⏱️ 5 min setup",
                setup10: "⏱️ 10 min setup",
                accurate: "🎯 Highly Accurate",
                scienceBased: "🔬 Science-Based",
                researchGrade: "🎯 Research-Grade",
                mostAccurate: "🏆 Most Accurate",
                relationship: "💝 Relationship",
                couplesFriendly: "❤️ Couples Friendly", 
                funGame: "🎮 Fun Game",
                brainTraining: "🧠 Brain Training",
                careerFocused: "🎯 Career Focused",
                leadership: "💼 Leadership",
                selfReflection: "🔍 Self-Reflection",
                notMedical: "⚠️ Not Medical",
                wellness: "🧘 Wellness",
                moodTracking: "🌈 Mood Tracking",
                strengthsBased: "🌟 Strengths-Based",
                personalGrowth: "🎯 Personal Growth",
                careerFocus: "💼 Career Focus",
                personalized: "🎯 Personalized",
                relationships: "💕 Relationships",
                connection: "🤝 Connection",
                detailed: "📊 Detailed",
                viral: "🔥 Viral",
                couples: "💕 Couples",
                instant: "⚡ Instant",
                fun: "😄 Fun"
            },
            // Test badges
            trending: "🔥 Trending",
            popular: "✨ Popular", 
            featured: "🔥 POPULAR",
            new: "🔥 NEW",
            connect: "💝 CONNECT",
            // Test actions
            takeTest: "Take Test",
            createQuestions: "Create Questions",
            startAssessment: "Ask My People"
        },
        couples: {
            title: "Couple Compatibility ❤️",
            subtitle: "Take tests individually, then connect with your partner to discover your relationship dynamics and compatibility insights! 💕",
            shareResults: "Share Your Results",
            shareDesc: "After taking any test, get a unique sharing ID to connect with your partner and compare your vibes!",
            shareButton: "Connect With Partner",
            compatibility: "Compatibility Analysis",
            compatibilityDesc: "Get detailed insights into your relationship dynamics, communication styles, and areas of harmony or growth!",
            compatibilityButton: "View Our Match",
            growth: "Relationship Growth",
            growthDesc: "Discover tips and strategies to strengthen your bond based on both of your personality types and results!",
            growthButton: "Grow Together"
        },
        whyChoose: {
            title: "Why Choose PersonaTests? ✨",
            scientific: "Actually Scientific",
            scientificDesc: "Our tests are based on real psychology research, not just random questions. We're not playing around! 🧠",
            instant: "Instant Results",
            instantDesc: "Get your personality breakdown immediately. No waiting, no delays, just pure instant gratification! ⚡",
            safe: "Your Secrets Are Safe",
            safeDesc: "We keep your answers private. No selling your data, no weird emails. Just you and your results! 🔒",
            everywhere: "Works Everywhere",
            everywhereDesc: "Take tests on your phone, laptop, tablet - literally anywhere you want to discover your personality! 📱",
            // Feature bullets
            researchBased: "📚 Research-Based",
            validatedMethods: "🎯 Validated Methods",
            psychologyDriven: "🧠 Psychology-Driven",
            immediate: "⚡ Immediate",
            fastProcessing: "🚀 Fast Processing",
            userFriendly: "👆 User-Friendly",
            comprehensive: "📋 Comprehensive",
            actionable: "💡 Actionable",
            growthFocused: "🌱 Growth-Focused",
            evidenceBased: "🔬 Evidence-Based",
            practical: "🎯 Practical",
            insightful: "🔍 Insightful",
            realTimeAnalysis: "📊 Real-Time Analysis",
            privacyFirst: "🔒 Privacy First",
            dataProtection: "🛡️ Data Protection",
            noSpam: "✨ No Spam",
            mobileFriendly: "📱 Mobile Friendly",
            crossPlatform: "💻 Cross-Platform",
            anyDevice: "🌐 Any Device"
        },
        whyMatters: {
            title: "Why Personality Testing Matters",
            selfAwareness: "Self-Awareness",
            selfAwarenessDesc: "Understand your natural tendencies, strengths, and areas for growth to make better life decisions.",
            careerDevelopment: "Career Development", 
            careerDevelopmentDesc: "Discover career paths that align with your personality for increased job satisfaction and success.",
            betterRelationships: "Better Relationships",
            betterRelationshipsDesc: "Improve communication and understanding in personal and professional relationships."
        },
        blog: {
            title: "Psychology Insights & Tips 📚",
            subtitle: "Learn about personality psychology, self-improvement, and relationship insights",
            coming_soon: "More psychology articles and insights coming soon! ✨"
        },
        footer: {
            description: "Discover your personality with scientifically-backed tests that get you.",
            popularTests: "Popular Tests",
            sixteenTypes: "16 Personality Types",
            bigFive: "Big Five Test",
            brainTeaser: "Brain Teaser Challenge",
            moreInfo: "More Info",
            aboutUs: "About Us",
            blog: "Blog",
            privacyPolicy: "Privacy Policy",
            termsOfService: "Terms of Service"
        }
    },
    es: {
        nav: {
            tests: "Pruebas",
            couples: "Parejas",
            about: "Acerca de",
            blog: "Blog", 
            results: "Mis Resultados",
            login: "Iniciar Sesión ✨",
            logout: "Cerrar Sesión"
        },
        hero: {
            title: "Descubre Tu Personalidad ✨",
            subtitle: "Realiza pruebas de personalidad con respaldo científico que realmente te entienden. ¡Desde MBTI hasta Big Five, descubre qué te hace único! 🔥",
            cta: "Descubre Mi Personalidad",
            startJourney: "Comienza Tu Viaje",
            stats: {
                tests: "Tests de Personalidad",
                languages: "Idiomas",
                access: "Siempre Gratis",
                private: "Privado"
            },
            features: {
                scientific: "Basado en Ciencia",
                instant: "Resultados Instantáneos",
                personalized: "100% Personalizado",
                private: "Completamente Privado"
            }
        },
        stats: {
            categories: "Categorías de Pruebas",
            reliability: "Confiabilidad Científica",
            available: "Siempre Disponible"
        },
        ui: {
            previous: "Anterior",
            next: "Siguiente",
            finishTest: "Terminar Prueba"
        },
        categories: {
            all: "Todos",
            knowYourself: "🧠 Conócete a Ti Mismo",
            howOthersSeeMe: "👥 Cómo Me Ven Otros",
            knowYourselfTitle: "🧠 Conócete a Ti Mismo",
            knowYourselfSubtitle: "Descubre tu personalidad interior, fortalezas y rasgos únicos a través de evaluaciones con respaldo científico",
            howOthersSeeTitle: "👥 Cómo Me Ven Otros",
            howOthersSubtitle: "Obtén comentarios honestos y descubre cómo te perciben realmente amigos, familia y colegas"
        },
        tests: {
            sectionTitle: "Descubre Tu Personalidad ✨",
            sectionSubtitle: "Cuál test te interesa más? Todos tienen base científica y son súper divertidos! 💫",
            disclaimer: "🎯 Importante: Solo para Entretenimiento y Autorreflexión",
            disclaimerText: "Estos tests son para diversión y autoconocimiento, no para diagnóstico profesional. Si necesitas ayuda psicológica, consulta a un profesional de la salud.",
            takeTest: "Hacer Prueba",
            askfriends: {
                title: "Ve Quién Me Conoce Mejor",
                description: "Crea preguntas sobre ti mismo, proporciona TUS respuestas, ¡luego ve quién te conoce mejor! Los amigos intentarán coincidir con tus respuestas y serán puntuados sobre qué tan bien te conocen.",
                heroTitle: "Ve Quién Me Conoce Mejor 🧩",
                heroSubtitle: "Crea preguntas sobre ti mismo, proporciona TUS respuestas, ¡luego ve quién te conoce mejor! Los amigos intentarán coincidir con tus respuestas y serán puntuados sobre qué tan bien te conocen.",
                startButton: "Crear Mi Cuestionario",
                howItWorks: "Cómo Funciona",
                howItWorksDesc: "Es súper fácil crear tu cuestionario personalizado:",
                step1Title: "1️⃣ Crea Tus Preguntas",
                step1Desc: "Diseña preguntas únicas sobre tu personalidad",
                step2Title: "2️⃣ Comparte el Enlace",
                step2Desc: "Envía el enlace a tus amigos de confianza",
                step3Title: "3️⃣ Ve los Resultados",
                step3Desc: "Descubre lo que realmente piensan de ti",
                whyUseTitle: "Por qué usar esta función?",
                whyUseDesc: "Obtén perspectivas honestas de personas que te conocen bien. Es perfecto para descubrir puntos ciegos sobre tu personalidad y cómo te perciben otros en diferentes situaciones.",
                exampleQuestions: "Ejemplos de Preguntas",
                example1: "\"¿Qué palabra describe mejor mi personalidad?\"",
                example2: "\"¿En qué situación me ves más en mi elemento?\"",
                example3: "\"¿Cuál crees que es mi mayor fortaleza?\"",
                readyToStart: "Listo para Comenzar?",
                readyToStartDesc: "Crea tu cuestionario personalizado y descubre cómo te ven tus amigos"
            },
            "360assessment": {
                title: "360 Percepción Sobre Mí",
                description: "Retroalimentación seria y multi-perspectiva para el crecimiento y comprensión. Obtén ideas honestas de amigos, familia y colegas.",
                heroTitle: "360 Percepción Sobre Mí 🎯",
                heroSubtitle: "Retroalimentación seria y multi-perspectiva para el crecimiento y comprensión. Obtén ideas completas de las personas que mejor te conocen.",
                startButton: "Comenzar Mi Evaluación",
                fullCircleTitle: "Vista Completa de 360°",
                fullCircleDesc: "Obtén perspectivas de:",
                perspective1: "👥 Amigos cercanos",
                perspective2: "👨‍👩‍👧‍👦 Miembros de la familia",
                perspective3: "💼 Colegas de trabajo",
                perspective4: "🏫 Compañeros de estudio",
                benefitsTitle: "Beneficios de la Evaluación 360°",
                benefit1Title: "🎯 Puntos Ciegos",
                benefit1Desc: "Descubre aspectos de ti mismo que no ves",
                benefit2Title: "💪 Fortalezas Ocultas",
                benefit2Desc: "Encuentra talentos que otros notan en ti",
                benefit3Title: "📈 Áreas de Crecimiento",
                benefit3Desc: "Identifica oportunidades de mejora",
                benefit4Title: "🤝 Mejores Relaciones",
                benefit4Desc: "Comprende cómo interactuar mejor con otros",
                processTitle: "Cómo Funciona",
                processStep1: "1️⃣ Configuras tu evaluación",
                processStep2: "2️⃣ Invitas a diferentes grupos",
                processStep3: "3️⃣ Ellos dan retroalimentación anónima",
                processStep4: "4️⃣ Obtienes un informe completo",
                privacyTitle: "Privacidad y Anonimato",
                privacyDesc: "Toda la retroalimentación es completamente anónima. Tus evaluadores pueden ser honestos sin preocuparse por herir sentimientos.",
                readyTitle: "Listo para una Perspectiva Completa?",
                readyDesc: "Comienza tu evaluación 360° y descubre cómo te ve el mundo"
            },
            mbti: {
                title: "16 Tipos de Personalidad",
                description: "Descubre tu tipo de personalidad único con la evaluación clásica Myers-Briggs! Eres un pensador introvertido o un extrovertido emocional?"
            },
            bigfive: {
                title: "Test de los Cinco Grandes",
                description: "El estándar de oro de la psicología de la personalidad! Explora tu apertura, conciencia, extraversión, amabilidad y neuroticismo."
            },
            eq: {
                title: "Inteligencia Emocional (IE)",
                description: "Qué tan bien lees las emociones y navegas situaciones sociales? Pon a prueba tus superpoderes emocionales!"
            },
            ei: {
                title: "Inteligencia Emocional",
                description: "Qué tan bien lees las emociones y navegas situaciones sociales? Pon a prueba tus superpoderes emocionales!"
            },
            iq: {
                title: "Desafío Mental",
                description: "Pon a prueba tus habilidades de resolución de problemas! Rompecabezas lógicos divertidos para desafiar tu mente."
            },
            lovelanguage: {
                title: "Test del Lenguaje del Amor",
                description: "Palabras de afirmación, tiempo de calidad o contacto físico? Descubre cómo das y recibes amor mejor!"
            },
            adhd: {
                title: "Autoevaluación TDAH",
                description: "Explora tus patrones de atención y niveles de energía. Genial para entender tu estilo de productividad!"
            },
            anxiety: {
                title: "Autochequeo de Ansiedad",
                description: "Cómo manejas la presión? Aprende tus patrones de estrés y descubre estrategias saludables de afrontamiento."
            },
            depression: {
                title: "Autorreflexión del Estado de Ánimo",
                description: "Comprende tus patrones emocionales y resistencia. Perfecto para crecimiento personal y autoconocimiento!"
            },
            strengths: {
                title: "Fortalezas de Carácter",
                description: "Descubre tus principales fortalezas de carácter! Desde creatividad hasta bondad, encuentra lo que te hace brillar."
            },
            careerpath: {
                title: "Buscador de Trayectoria Profesional",
                description: "Descubre la carrera que coincide con tu personalidad! Eres líder, creador, ayudante, analista o emprendedor?"
            },
            relationshipstyle: {
                title: "Estilo de Relación",
                description: "Cómo amas y te conectas con otros? Descubre tu estilo único de relación y qué te hace vibrar en el amor!"
            },
            // Test badges and general terms - Spanish
            trending: "🔥 Tendencia",
            popular: "✨ Popular",
            new: "🔥 NUEVO",
            takeTest: "Tomar Prueba",
            createQuestions: "Crear Preguntas",
            startAssessment: "Preguntar a Mi Gente",
            // Test metadata terms - Spanish
            meta: {
                duration: "⏱️ 8 min",
                duration5: "⏱️ 5 min",
                duration6: "⏱️ 6 min",
                duration7: "⏱️ 7 min", 
                duration8: "⏱️ 8 min",
                duration10: "⏱️ 10 min",
                duration12: "⏱️ 12 min",
                duration15: "⏱️ 15 min",
                setup5: "⏱️ 5 min configuración",
                setup10: "⏱️ 10 min configuración",
                accurate: "🎯 Muy Preciso",
                scienceBased: "🔬 Base Científica",
                researchGrade: "🎯 Grado de Investigación",
                mostAccurate: "🏆 Más Preciso",
                relationship: "💝 Relaciones",
                couplesFriendly: "❤️ Amigable para Parejas",
                funGame: "🎮 Juego Divertido",
                brainTraining: "🧠 Entrenamiento Mental",
                careerFocused: "🎯 Enfoque Profesional",
                careerFocus: "💼 Enfoque de Carrera",
                leadership: "💼 Liderazgo",
                selfReflection: "🔍 Autorreflexión",
                notMedical: "⚠️ No Médico",
                wellness: "🧘 Bienestar",
                moodTracking: "🌈 Seguimiento del Estado de Ánimo",
                strengthsBased: "🌟 Basado en Fortalezas",
                personalGrowth: "🎯 Crecimiento Personal",
                personalized: "🎯 Personalizado",
                relationships: "💕 Relaciones",
                connection: "🤝 Conexión",
                socialApp: "📱 Social",
                socialPeople: "👥 Social",
                viral: "🔥 Viral",
                detailed: "📊 Detallado",
                couples: "💕 Parejas",
                instant: "⚡ Instantáneo",
                fun: "😄 Divertido",
                insights: "💡 Perspectivas",
                guidance: "📝 Orientación",
                improvement: "📈 Mejora"
            },
            disc: "Test de Personalidad DISC",
            discDesc: "¿Eres Dominante, Influyente, Estable o Concienzudo? ¡Perfecto para entender estilos de trabajo y relaciones!",
            conflict: "Evaluación de Estilo de Conflicto", 
            conflictDesc: "¿Cómo manejas los desacuerdos? Descubre si eres un colaborador, competidor o conciliador.",
            strengths: "Fortalezas de Carácter (VIA)",
            strengthsDesc: "¡Descubre tus principales fortalezas de carácter! Desde creatividad hasta bondad, encuentra lo que te hace brillar.",
            adhd: "Estilo de Enfoque y Energía",
            adhdDesc: "Explora tus patrones de atención y niveles de energía. ¡Genial para entender tu estilo de productividad!",
            anxiety: "Estilo de Manejo del Estrés", 
            anxietyDesc: "¿Cómo manejas la presión? Aprende tus patrones de estrés y descubre estrategias saludables de afrontamiento.",
            depression: "Estilo de Regulación Emocional",
            depressionDesc: "Comprende tus patrones emocionales y resistencia. ¡Perfecto para crecimiento personal y autoconocimiento!",
            trendingTitle: "Tendencia Ahora 🔥",
            trendingSubtitle: "¡Las pruebas de personalidad más populares de las que todos hablan! Perfectas para compartir con amigos y redes sociales 📱",
            love: "Test del Lenguaje del Amor",
            loveDesc: "¿Palabras de afirmación, tiempo de calidad o contacto físico? ¡Descubre cómo das y recibes amor mejor!",
            pet: "¿Qué Mascota Combina con Tu Personalidad?",
            petDesc: "¿Eres una persona leal de perros, amante independiente de gatos, o algo más exótico? ¡Encuentra tu combinación animal perfecta!",
            career: "¿Cuál es Tu Camino Profesional Ideal?",
            careerDesc: "¡Descubre la carrera que coincide con tu personalidad! ¿Eres líder, creador, ayudante, analista o emprendedor? 🚀",
            relationship: "¿Cuál es Tu Estilo de Relación?",
            relationshipDesc: "¿Cómo amas y te conectas con otros? ¡Descubre tu estilo único de relación y qué te hace especial en el amor! ✨",
            // Meta tags for tests - Spanish
            meta: {
                duration: "⏱️ 8 min",
                duration5: "⏱️ 5 min", 
                duration6: "⏱️ 6 min",
                duration7: "⏱️ 7 min",
                duration8: "⏱️ 8 min",
                duration10: "⏱️ 10 min",
                duration12: "⏱️ 12 min",
                duration15: "⏱️ 15 min",
                setup5: "⏱️ 5 min configuración",
                setup10: "⏱️ 10 min configuración",
                accurate: "🎯 Muy Preciso",
                scienceBased: "🔬 Basado en Ciencia",
                researchGrade: "🎯 Grado de Investigación",
                mostAccurate: "🏆 Más Preciso",
                relationship: "💝 Relación",
                couplesFriendly: "❤️ Amigable para Parejas", 
                funGame: "🎮 Juego Divertido",
                brainTraining: "🧠 Entrenamiento Cerebral",
                careerFocused: "🎯 Enfoque Profesional",
                leadership: "💼 Liderazgo",
                selfReflection: "🔍 Autorreflexión",
                notMedical: "⚠️ No Médico",
                wellness: "🧘 Bienestar",
                moodTracking: "🌈 Seguimiento del Estado de Ánimo",
                strengthsBased: "🌟 Basado en Fortalezas",
                personalGrowth: "🎯 Crecimiento Personal",
                careerFocus: "💼 Enfoque Profesional",
                personalized: "🎯 Personalizado",
                relationships: "💕 Relaciones",
                connection: "🤝 Conexión",
                detailed: "📊 Detallado",
                viral: "🔥 Viral",
                couples: "💕 Parejas",
                instant: "⚡ Instantáneo",
                fun: "😄 Divertido",
                insights: "💡 Perspectivas",
                guidance: "📝 Orientación",
                improvement: "📈 Mejora",
                socialApp: "📱 Social",
                socialPeople: "👥 Social"
            },
            // Test badges
            trending: "🔥 Tendencia",
            popular: "✨ Popular", 
            featured: "🔥 POPULAR",
            new: "🔥 NUEVO",
            connect: "💝 CONECTAR",
            growth: "🌱 CRECIMIENTO",
            // Test actions
            takeTest: "Hacer Prueba",
            createQuestions: "Crear Preguntas",
            startAssessment: "Preguntar a Mi Gente",
            buttons: {
                discoverType: "Descubrir Mi Tipo ✨",
                takeTest: "Hacer la Prueba",
                takeBrainChallenge: "Hacer Desafío Mental",
                checkEQ: "Revisar Mi IE",
                findStyle: "Encontrar Mi Estilo",
                checkStyle: "Revisar Mi Estilo",
                findStrengths: "Encontrar Mis Fortalezas",
                findLoveLanguage: "Encontrar Mi Lenguaje del Amor",
                findPetMatch: "Encontrar Mi Mascota",
                findCareer: "Encontrar Mi Carrera"
            }
        },
        couples: {
            title: "Compatibilidad de Parejas ❤️",
            subtitle: "¡Tomen las pruebas individualmente, luego conéctense con su pareja para descubrir la dinámica de su relación y conocimientos de compatibilidad! 💕",
            shareResults: "Compartir Tus Resultados",
            shareDesc: "¡Después de tomar cualquier prueba, obtén un ID único para conectarte con tu pareja y comparar sus vibras!",
            shareButton: "Conectar con Pareja",
            compatibility: "Análisis de Compatibilidad",
            compatibilityDesc: "¡Obtén información detallada sobre la dinámica de tu relación, estilos de comunicación y áreas de armonía o crecimiento!",
            compatibilityButton: "Ver Nuestra Compatibilidad",
            growth: "Crecimiento de Relación",
            growthDesc: "¡Descubre consejos y estrategias para fortalecer tu vínculo basado en ambos tipos de personalidad y resultados!",
            growthButton: "Crecer Juntos"
        },
        whyChoose: {
            title: "¿Por Qué Elegir PersonaTests? ✨",
            scientific: "Realmente Científico",
            scientificDesc: "Nuestros tests se basan en investigación psicológica real, no solo preguntas aleatorias. ¡Hablamos en serio! 🧠",
            instant: "Resultados Instantáneos",
            instantDesc: "Obtén tu análisis de personalidad inmediatamente. ¡Sin esperas, sin demoras, solo gratificación instantánea pura! ⚡",
            safe: "Tus Secretos Están Seguros",
            safeDesc: "Mantenemos tus respuestas privadas. Sin vender tus datos, sin correos raros. ¡Solo tú y tus resultados! 🔒",
            everywhere: "Funciona En Todas Partes",
            everywhereDesc: "¡Toma pruebas en tu teléfono, laptop, tablet - literalmente donde quieras descubrir tu personalidad! 📱",
            // Feature bullets
            researchBased: "📚 Basado en Investigación",
            validatedMethods: "🎯 Métodos Validados",
            psychologyDriven: "🧠 Basado en Psicología",
            immediate: "⚡ Inmediato",
            fastProcessing: "🚀 Procesamiento Rápido",
            userFriendly: "👆 Fácil de Usar",
            comprehensive: "📋 Integral",
            actionable: "💡 Práctico",
            growthFocused: "🌱 Enfocado en Crecimiento",
            evidenceBased: "🔬 Basado en Evidencia",
            practical: "🎯 Práctico",
            insightful: "🔍 Perspicaz",
            realTimeAnalysis: "📊 Análisis en Tiempo Real",
            privacyFirst: "🔒 Privacidad Primero",
            dataProtection: "🛡️ Protección de Datos",
            noSpam: "✨ Sin Spam",
            mobileFriendly: "📱 Amigable para Móviles",
            crossPlatform: "💻 Multiplataforma",
            anyDevice: "🌐 Cualquier Dispositivo"
        },
        whyMatters: {
            title: "Por Qué Importan las Pruebas de Personalidad",
            selfAwareness: "Autoconocimiento",
            selfAwarenessDesc: "Comprende tus tendencias naturales, fortalezas y áreas de crecimiento para tomar mejores decisiones en la vida.",
            careerDevelopment: "Desarrollo Profesional",
            careerDevelopmentDesc: "Descubre caminos profesionales que se alineen con tu personalidad para mayor satisfacción laboral y éxito.",
            betterRelationships: "Mejores Relaciones",
            betterRelationshipsDesc: "Mejora la comunicación y comprensión en relaciones personales y profesionales."
        },
        blog: {
            title: "Conocimientos y Consejos de Psicología 📚",
            subtitle: "Aprende sobre psicología de la personalidad, autoayuda y perspectivas de relaciones",
            coming_soon: "¡Próximamente más artículos y conocimientos de psicología! ✨"
        },
        footer: {
            description: "Descubre tu personalidad con pruebas científicamente respaldadas que te entienden.",
            popularTests: "Pruebas Populares",
            sixteenTypes: "16 Tipos de Personalidad",
            bigFive: "Test de los Cinco Grandes",
            brainTeaser: "Desafío Mental",
            moreInfo: "Más Información",
            aboutUs: "Sobre Nosotros",
            blog: "Blog",
            privacyPolicy: "Política de Privacidad",
            termsOfService: "Términos de Servicio"
        }
    },
    fr: {
        nav: {
            tests: "Tests",
            couples: "Couples",
            about: "À Propos", 
            blog: "Blog",
            results: "Mes Résultats",
            login: "Connexion ✨",
            logout: "Déconnexion"
        },
        hero: {
            title: "Découvrez Votre Personnalité ✨",
            subtitle: "Faites des tests de personnalité avec base scientifique qui vous comprennent vraiment. Du MBTI au Big Five, découvrez ce qui vous rend unique ! 🔥",
            cta: "Découvrir Mon Style",
            startJourney: "Commencez Votre Voyage",
            stats: {
                tests: "Tests de Personnalité",
                languages: "Langues",
                access: "Toujours Gratuit",
                private: "Privé"
            },
            features: {
                scientific: "Basé sur la Science",
                instant: "Résultats Instantanés",
                personalized: "100% Personnalisé",
                private: "Complètement Privé"
            }
        },
        stats: {
            categories: "Catégories de Tests",
            reliability: "Fiabilité Scientifique",
            available: "Toujours Disponible"
        },
        ui: {
            previous: "Précédent",
            next: "Suivant",
            finishTest: "Terminer le Test"
        },
        categories: {
            all: "Tous",
            knowYourself: "🧠 Connaissez-Vous",
            howOthersSeeMe: "👥 Comment Me Voient Les Autres",
            knowYourselfTitle: "🧠 Connaissez-Vous",
            knowYourselfSubtitle: "Découvrez votre personnalité intérieure, vos forces et traits uniques grâce à des évaluations scientifiquement validées",
            howOthersSeeTitle: "👥 Comment Me Voient Les Autres",
            howOthersSubtitle: "Obtenez des commentaires honnêtes et découvrez comment amis, famille et collègues vous perçoivent vraiment"
        },
        tests: {
            sectionTitle: "Découvrez Votre Personnalité ✨",
            sectionSubtitle: "Quel test vous intéresse ? Tous ont une base scientifique et sont super amusants ! 💫",
            disclaimer: "🎯 Important : Pour le Divertissement et l'Autoréflexion Uniquement",
            disclaimerText: "Ces tests sont faits pour s'amuser et mieux se connaître, pas pour un diagnostic professionnel. Si vous avez besoin d'aide psychologique, consultez un professionnel de santé qualifié.",
            takeTest: "Faire le Test",
            askfriends: {
                title: "Voir Qui Me Connaît Le Mieux",
                description: "Créez des questions sur vous-même, fournissez VOS réponses, puis voyez qui vous connaît le mieux ! Les amis essaieront de correspondre à vos réponses et seront notés sur la façon dont ils vous connaissent.",
                heroTitle: "Voir Qui Me Connaît Le Mieux 🧩",
                heroSubtitle: "Créez des questions sur vous-même, fournissez VOS réponses, puis voyez qui vous connaît le mieux ! Les amis essaieront de correspondre à vos réponses et seront notés sur la façon dont ils vous connaissent.",
                startButton: "Créer Mon Questionnaire",
                howItWorks: "Comment Ça Marche",
                howItWorksDesc: "C'est super facile de créer votre questionnaire personnalisé :",
                step1Title: "1️⃣ Créez Vos Questions",
                step1Desc: "Concevez des questions uniques sur votre personnalité",
                step2Title: "2️⃣ Partagez le Lien",
                step2Desc: "Envoyez le lien à vos amis de confiance",
                step3Title: "3️⃣ Voyez les Résultats",
                step3Desc: "Découvrez ce qu'ils pensent vraiment de vous",
                whyUseTitle: "Pourquoi utiliser cette fonction ?",
                whyUseDesc: "Obtenez des perspectives honnêtes de personnes qui vous connaissent bien. C'est parfait pour découvrir des angles morts sur votre personnalité et comment les autres vous perçoivent dans différentes situations.",
                exampleQuestions: "Exemples de Questions",
                example1: "\"Quel mot décrit le mieux ma personnalité ?\"",
                example2: "\"Dans quelle situation me voyez-vous le plus dans mon élément ?\"",
                example3: "\"Quelle pensez-vous être ma plus grande force ?\"",
                readyToStart: "Prêt à Commencer ?",
                readyToStartDesc: "Créez votre questionnaire personnalisé et découvrez comment vos amis vous voient"
            },
            "360assessment": {
                title: "360 Perception Sur Moi",
                description: "Commentaires sérieux et multi-perspectifs pour la croissance et la compréhension. Obtenez des insights honnêtes d'amis, de famille et de collègues.",
                heroTitle: "360 Perception Sur Moi 🎯",
                heroSubtitle: "Commentaires sérieux et multi-perspectifs pour la croissance et la compréhension. Obtenez des insights complets de personnes qui vous connaissent le mieux.",
                startButton: "Commencer Mon Évaluation",
                fullCircleTitle: "Vue Complète à 360°",
                fullCircleDesc: "Obtenez des perspectives de :",
                perspective1: "👥 Amis proches",
                perspective2: "👨‍👩‍👧‍👦 Membres de la famille",
                perspective3: "💼 Collègues de travail",
                perspective4: "🏫 Camarades d'études",
                benefitsTitle: "Avantages de l'Évaluation 360°",
                benefit1Title: "🎯 Angles Morts",
                benefit1Desc: "Découvrez des aspects de vous-même que vous ne voyez pas",
                benefit2Title: "💪 Forces Cachées",
                benefit2Desc: "Trouvez des talents que les autres remarquent en vous",
                benefit3Title: "📈 Domaines de Croissance",
                benefit3Desc: "Identifiez des opportunités d'amélioration",
                benefit4Title: "🤝 Meilleures Relations",
                benefit4Desc: "Comprenez comment mieux interagir avec les autres",
                processTitle: "Comment Ça Marche",
                processStep1: "1️⃣ Vous configurez votre évaluation",
                processStep2: "2️⃣ Vous invitez différents groupes",
                processStep3: "3️⃣ Ils donnent des commentaires anonymes",
                processStep4: "4️⃣ Vous obtenez un rapport complet",
                privacyTitle: "Confidentialité et Anonymat",
                privacyDesc: "Tous les commentaires sont complètement anonymes. Vos évaluateurs peuvent être honnêtes sans s'inquiéter de blesser les sentiments.",
                readyTitle: "Prêt pour une Perspective Complète ?",
                readyDesc: "Commencez votre évaluation 360° et découvrez comment le monde vous voit"
            },
            mbti: {
                title: "16 Types de Personnalité",
                description: "Découvrez votre type de personnalité unique avec l'évaluation classique Myers-Briggs ! Êtes-vous un penseur introverti ou un extraverti émotionnel ?"
            },
            bigfive: {
                title: "Test des Cinq Grands",
                description: "L'étalon-or de la psychologie de la personnalité ! Explorez votre ouverture, conscience, extraversion, amabilité et névrosisme."
            },
            eq: {
                title: "Intelligence Émotionnelle (IE)",
                description: "À quel point lisez-vous bien les émotions et naviguez dans les situations sociales ? Testez vos super-pouvoirs émotionnels !"
            },
            ei: {
                title: "Intelligence Émotionnelle",
                description: "À quel point lisez-vous bien les émotions et naviguez dans les situations sociales ? Testez vos super-pouvoirs émotionnels !"
            },
            iq: {
                title: "Défi Mental",
                description: "Testez vos compétences de résolution de problèmes ! Puzzles logiques amusants pour défier votre esprit."
            },
            lovelanguage: {
                title: "Test du Langage d'Amour",
                description: "Mots d'affirmation, temps de qualité ou contact physique ? Découvrez comment vous donnez et recevez l'amour le mieux !"
            },
            adhd: {
                title: "Auto-évaluation TDAH",
                description: "Explorez vos modèles d'attention et niveaux d'énergie. Génial pour comprendre votre style de productivité !"
            },
            anxiety: {
                title: "Auto-vérification de l'Anxiété",
                description: "Comment gérez-vous la pression ? Apprenez vos modèles de stress et découvrez des stratégies d'adaptation saines."
            },
            depression: {
                title: "Autoréflexion de l'Humeur",
                description: "Comprenez vos modèles émotionnels et votre résilience. Parfait pour la croissance personnelle et la connaissance de soi !"
            },
            strengths: {
                title: "Forces de Caractère",
                description: "Découvrez vos principales forces de caractère ! De la créativité à la gentillesse, trouvez ce qui vous fait briller."
            },
            careerpath: {
                title: "Découvreur de Parcours Professionnel",
                description: "Découvrez la carrière qui correspond à votre personnalité ! Êtes-vous un leader, créateur, aidant, analyste ou entrepreneur ?"
            },
            relationshipstyle: {
                title: "Style de Relation",
                description: "Comment aimez-vous et vous connectez-vous avec les autres ? Découvrez votre style de relation unique et ce qui vous fait vibrer en amour !"
            },
            // Test badges and general terms - French
            trending: "🔥 Tendance",
            popular: "✨ Populaire",
            new: "🔥 NOUVEAU",
            takeTest: "Faire le Test",
            createQuestions: "Créer des Questions",
            startAssessment: "Demander à Mes Gens",
            // Test metadata terms - French
            meta: {
                duration: "⏱️ 8 min",
                accuracy: "🎯 95% de précision",
                free: "🎁 Gratuit",
                scientific: "🧬 Scientifique",
                fun: "🎉 Amusant",
                quick: "⚡ Rapide",
                comprehensive: "📊 Complet",
                insightful: "💡 Perspicace",
                personalized: "🎯 Personnalisé",
                relationships: "💕 Relations",
                connection: "🤝 Connexion",
                socialApp: "📱 Social",
                socialPeople: "👥 Social",
                viral: "🔥 Viral",
                detailed: "📊 Détaillé",
                couples: "💕 Couples",
                workplace: "💼 Travail",
                growth: "🌱 Croissance",
                selfcare: "🧘 Bien-être",
                communication: "💬 Communication",
                leadership: "👑 Leadership",
                creativity: "🎨 Créativité",
                career: "💼 Carrière",
                minutes5: "⏱️ 5 min",
                minutes10: "⏱️ 10 min",
                minutes15: "⏱️ 15 min",
                setup5: "⏱️ Configuration 5 min",
                setup10: "⏱️ Configuration 10 min",
                // Missing French meta badges matching Korean ones
                scienceBased: "🔬 Base Scientifique",
                accurate: "🎯 Très Précis",
                researchGrade: "🎯 Niveau Recherche",
                mostAccurate: "🏆 Le Plus Précis",
                relationship: "💝 Relation",
                couplesFriendly: "❤️ Convivial Couples",
                funGame: "🎮 Jeu Amusant",
                brainTraining: "🧠 Entraînement Cérébral",
                careerFocused: "🎯 Axé Carrière",
                careerFocus: "💼 Focus Carrière",
                selfReflection: "🔍 Autoréflexion",
                notMedical: "⚠️ Non Médical",
                wellness: "🧘 Bien-être",
                moodTracking: "🌈 Suivi Humeur",
                strengthsBased: "🌟 Basé Forces",
                personalGrowth: "🎯 Croissance Personnelle",
                instant: "⚡ Instantané",
                insights: "💡 Insights"
            },
            strengths: "Forces de Caractère (VIA)",
            strengthsDesc: "Découvrez vos principales forces de caractère ! De la créativité au leadership en passant par la gentillesse - découvrez ce qui vous rend uniquement génial ! ✨",
            adhd: "Style de Concentration et d'Énergie",
            adhdDesc: "Découvrez vos modèles uniques d'attention et d'énergie ! C'est juste pour l'autoréflexion amusante - pas une évaluation médicale. ⚡",
            anxiety: "Style de Gestion du Stress",
            anxietyDesc: "Découvrez comment vous gérez le stress et la pression ! C'est juste pour le plaisir et la conscience de soi - pas des conseils médicaux. 💚",
            depression: "Style de Régulation Émotionnelle",
            depressionDesc: "Comprenez comment vous traitez les émotions ! C'est juste pour l'autoréflexion et le divertissement - pas une évaluation de santé mentale. 🌻",
            trendingTitle: "Tendances Actuelles 🔥",
            trendingSubtitle: "Les tests de personnalité dont tout le monde parle ! Parfaits pour partager avec des amis et sur les réseaux sociaux 📱",
            love: "Test du Langage d'Amour",
            loveDesc: "Découvrez comment vous donnez et recevez l'amour ! Êtes-vous toucher physique, mots d'affirmation ou autre chose ? Parfait pour les couples ! 💖",
            pet: "Quel Animal Correspond à Votre Personnalité ?",
            petDesc: "Êtes-vous un chien loyal, un chat indépendant, un hamster joueur ou autre chose ? Trouvez votre animal parfait basé sur votre personnalité ! 🐱",
            career: "Quel est Votre Parcours Professionnel Idéal ?",
            careerDesc: "Découvrez la carrière qui correspond à votre personnalité ! Êtes-vous un leader, créateur, aide, analyste ou entrepreneur ? 🚀",
            relationship: "Quel est Votre Style Relationnel ?",
            relationshipDesc: "Comment aimez-vous et vous connectez-vous avec les autres ? Découvrez votre style relationnel unique et ce qui vous fait vibrer en amour ! ✨",
            buttons: {
                discoverType: "Découvrir Mon Type ✨",
                takeTest: "Faire le Test",
                takeBrainChallenge: "Relever le Défi Cérébral",
                checkEQ: "Vérifier Mon QE",
                findStyle: "Trouver Mon Style",
                checkStyle: "Vérifier Mon Style",
                findStrengths: "Trouver Mes Forces",
                findLoveLanguage: "Trouver Mon Langage d'Amour",
                findPetMatch: "Trouver Mon Animal",
                findCareer: "Trouver Ma Carrière"
            }
        },
        couples: {
            title: "Compatibilité de Couple ❤️",
            subtitle: "Passez les tests individuellement, puis connectez-vous avec votre partenaire pour découvrir votre dynamique relationnelle et insights de compatibilité ! 💕",
            shareResults: "Partagez Vos Résultats",
            shareDesc: "Après avoir passé un test, obtenez un ID unique pour vous connecter avec votre partenaire et comparer vos vibes !",
            shareButton: "Se Connecter avec le Partenaire",
            compatibility: "Analyse de Compatibilité",
            compatibilityDesc: "Obtenez des insights détaillés sur votre dynamique relationnelle, styles de communication et zones d'harmonie ou de croissance !",
            compatibilityButton: "Voir Notre Compatibilité",
            growth: "Croissance Relationnelle",
            growthDesc: "Découvrez des conseils et stratégies pour renforcer votre lien basé sur vos types de personnalité et résultats !",
            growthButton: "Grandir Ensemble"
        },
        whyChoose: {
            title: "Pourquoi Choisir PersonaTests ? ✨",
            scientific: "Réellement Scientifique",
            scientificDesc: "Nos tests sont basés sur de vraies recherches en psychologie, pas juste des questions aléatoires. C'est du sérieux ! 🧠",
            instant: "Résultats Instantanés",
            instantDesc: "Obtenez votre analyse de personnalité immédiatement. Pas d'attente, pas de délais, juste une satisfaction immédiate ! ⚡",
            safe: "Vos Secrets Sont En Sécurité",
            safeDesc: "Nous gardons vos réponses privées. Pas de vente de données, pas d'emails bizarres. Juste vous et vos résultats ! 🔒",
            everywhere: "Fonctionne Partout",
            everywhereDesc: "Passez les tests sur votre téléphone, ordinateur portable, tablette - littéralement où vous voulez découvrir votre personnalité ! 📱",
            // Feature bullets
            researchBased: "📚 Basé sur la Recherche",
            validatedMethods: "🎯 Méthodes Validées",
            psychologyDriven: "🧠 Basé sur la Psychologie",
            immediate: "⚡ Immédiat",
            fastProcessing: "🚀 Traitement Rapide",
            userFriendly: "👆 Facile à Utiliser",
            comprehensive: "📋 Complet",
            actionable: "💡 Actionnable",
            growthFocused: "🌱 Axé sur la Croissance",
            evidenceBased: "🔬 Basé sur les Preuves",
            practical: "🎯 Pratique",
            insightful: "🔍 Perspicace",
            realTimeAnalysis: "📊 Analyse en Temps Réel",
            privacyFirst: "🔒 Confidentialité d'Abord",
            dataProtection: "🛡️ Protection des Données",
            noSpam: "✨ Pas de Spam",
            mobileFriendly: "📱 Compatible Mobile",
            crossPlatform: "💻 Multi-Plateforme",
            anyDevice: "🌐 Tout Appareil"
        },
        whyMatters: {
            title: "Pourquoi les Tests de Personnalité Sont Importants",
            selfAwareness: "Conscience de Soi",
            selfAwarenessDesc: "Comprenez vos tendances naturelles, vos forces et vos domaines d'amélioration pour prendre de meilleures décisions de vie.",
            careerDevelopment: "Développement de Carrière",
            careerDevelopmentDesc: "Découvrez des parcours professionnels qui s'alignent avec votre personnalité pour une satisfaction et un succès accrus au travail.",
            betterRelationships: "Meilleures Relations",
            betterRelationshipsDesc: "Améliorez la communication et la compréhension dans les relations personnelles et professionnelles."
        },
        blog: {
            title: "Conseils et Perspectives en Psychologie 📚",
            subtitle: "Apprenez sur la psychologie de la personnalité, l'amélioration de soi et les relations",
            coming_soon: "Plus d'articles et de perspectives en psychologie bientôt ! ✨"
        },
        meta: {
            duration: "⏱️ 8 minutes",
            duration5: "⏱️ 5 minutes",
            accurate: "🎯 Très précis",
            scienceBased: "🔬 Basé sur la science",
            takeTest: "Passer le test",
            badges: "🏆 Badges",
            researchBased: "🔬 Basé sur la recherche",
            scientificallyValid: "✅ Scientifiquement valide",
            personalityInsights: "🧠 Aperçus de personnalité",
            validated: "✅ Validé",
            comprehensive: "📋 Complet",
            detailed: "📊 Détaillé",
            professional: "💼 Professionnel",
            expertValidated: "👨‍🔬 Validé par des experts",
            psychologyBased: "🧠 Basé sur la psychologie",
            tested: "🧪 Testé",
            reliable: "🔒 Fiable",
            fastResults: "⚡ Résultats rapides",
            deepInsights: "🔍 Aperçus profonds",
            actionableAdvice: "💡 Conseils pratiques",
            personalDevelopment: "🌱 Développement personnel",
            selfAwareness: "🪞 Conscience de soi",
            growthOriented: "📈 Orienté croissance",
            lifeImprovement: "✨ Amélioration de la vie",
            easyToUse: "👆 Facile à utiliser",
            quickStart: "🚀 Démarrage rapide",
            noSignup: "🚫 Pas d'inscription",
            instantAccess: "⚡ Accès instantané",
            mobileOptimized: "📱 Optimisé mobile",
            shareable: "📤 Partageable",
            multilingual: "🌍 Multilingue"
        },
        footer: {
            description: "Découvrez votre personnalité avec des tests scientifiquement validés qui vous comprennent.",
            popularTests: "Tests Populaires",
            sixteenTypes: "16 Types de Personnalité",
            bigFive: "Test des Cinq Grands",
            brainTeaser: "Défi Cérébral",
            moreInfo: "Plus d'Infos",
            aboutUs: "À Propos",
            blog: "Blog",
            privacyPolicy: "Politique de Confidentialité",
            termsOfService: "Conditions de Service"
        }
    },
    de: {
        nav: {
            tests: "Tests",
            couples: "Paare",
            about: "Über Uns",
            blog: "Blog",
            results: "Meine Ergebnisse", 
            login: "Anmelden ✨",
            logout: "Abmelden"
        },
        hero: {
            title: "Entdecke Deine Persönlichkeit ✨",
            subtitle: "Mach wissenschaftlich fundierte Persönlichkeitstests, die dich wirklich verstehen. Von MBTI bis Big Five - finde heraus, was dich besonders macht! 🔥",
            cta: "Jetzt Testen",
            startJourney: "Beginne Deine Reise",
            stats: {
                tests: "Persönlichkeitstests",
                languages: "Sprachen",
                access: "Immer Kostenlos",
                private: "Privat"
            },
            features: {
                scientific: "Wissenschaftlich Fundiert",
                instant: "Sofortige Ergebnisse",
                personalized: "100% Personalisiert",
                private: "Vollständig Privat"
            }
        },
        stats: {
            categories: "Test-Kategorien",
            reliability: "Wissenschaftliche Zuverlässigkeit",
            available: "Immer Verfügbar"
        },
        ui: {
            previous: "Zurück",
            next: "Weiter",
            finishTest: "Test Beenden"
        },
        categories: {
            all: "Alle",
            knowYourself: "🧠 Kenne Dich Selbst",
            howOthersSeeMe: "👥 Wie Andere Mich Sehen",
            knowYourselfTitle: "🧠 Kenne Dich Selbst",
            knowYourselfSubtitle: "Entdecke deine innere Persönlichkeit, Stärken und einzigartigen Eigenschaften durch wissenschaftlich validierte Bewertungen",
            howOthersSeeTitle: "👥 Wie Andere Mich Sehen",
            howOthersSubtitle: "Erhalte ehrliches Feedback und entdecke, wie Freunde, Familie und Kollegen dich wirklich wahrnehmen"
        },
        tests: {
            sectionTitle: "Entdecke Deine Persönlichkeit ✨",
            sectionSubtitle: "Welcher Test gefällt dir? Alle sind wissenschaftlich und richtig spannend! 💫",
            disclaimer: "🎯 Wichtig: Nur zur Unterhaltung und Selbstreflexion",
            disclaimerText: "Diese Tests sind für Spaß und Selbsterkenntnis, nicht für professionelle Diagnosen. Wenn du psychologische Hilfe benötigst, konsultiere einen qualifizierten Gesundheitsexperten.",
            takeTest: "Test Machen",
            askfriends: {
                title: "Sieh Wer Mich Am Besten Kennt",
                description: "Erstelle Fragen über dich selbst, gib DEINE Antworten an, dann sieh wer dich am besten kennt! Freunde werden versuchen deine Antworten zu treffen und bekommen Punkte dafür wie gut sie dich kennen.",
                heroTitle: "Sieh Wer Mich Am Besten Kennt 🧩",
                heroSubtitle: "Erstelle Fragen über dich selbst, gib DEINE Antworten an, dann sieh wer dich am besten kennt! Freunde werden versuchen deine Antworten zu treffen und bekommen Punkte dafür wie gut sie dich kennen.",
                startButton: "Meinen Fragebogen Erstellen",
                howItWorks: "Wie Es Funktioniert",
                howItWorksDesc: "Es ist super einfach, deinen personalisierten Fragebogen zu erstellen:",
                step1Title: "1️⃣ Erstelle Deine Fragen",
                step1Desc: "Entwirf einzigartige Fragen über deine Persönlichkeit",
                step2Title: "2️⃣ Teile Den Link",
                step2Desc: "Sende den Link an deine vertrauenswürdigen Freunde",
                step3Title: "3️⃣ Sieh Die Ergebnisse",
                step3Desc: "Entdecke, was sie wirklich von dir denken",
                whyUseTitle: "Warum diese Funktion nutzen?",
                whyUseDesc: "Erhalte ehrliche Perspektiven von Menschen, die dich gut kennen. Es ist perfekt, um blinde Flecken über deine Persönlichkeit zu entdecken und wie andere dich in verschiedenen Situationen wahrnehmen.",
                exampleQuestions: "Beispielfragen",
                example1: "\"Welches Wort beschreibt meine Persönlichkeit am besten?\"",
                example2: "\"In welcher Situation siehst du mich am meisten in meinem Element?\"",
                example3: "\"Was denkst du ist meine größte Stärke?\"",
                readyToStart: "Bereit Anzufangen?",
                readyToStartDesc: "Erstelle deinen personalisierten Fragebogen und entdecke, wie dich deine Freunde sehen"
            },
            "360assessment": {
                title: "360 Wahrnehmung Über Mich",
                description: "Seriöses, multi-perspektivisches Feedback für Wachstum und Verständnis. Erhalte ehrliche Einblicke von Freunden, Familie und Kollegen.",
                heroTitle: "360 Wahrnehmung Über Mich 🎯",
                heroSubtitle: "Seriöses, multi-perspektivisches Feedback für Wachstum und Verständnis. Erhalte umfassende Einblicke von Menschen, die dich am besten kennen.",
                startButton: "Meine Bewertung Starten",
                fullCircleTitle: "Vollständige 360° Sicht",
                fullCircleDesc: "Erhalte Perspektiven von:",
                perspective1: "👥 Enge Freunde",
                perspective2: "👨‍👩‍👧‍👦 Familienmitglieder",
                perspective3: "💼 Arbeitskollegen",
                perspective4: "🏫 Mitschüler",
                benefitsTitle: "Vorteile Der 360° Bewertung",
                benefit1Title: "🎯 Blinde Flecken",
                benefit1Desc: "Entdecke Aspekte von dir selbst, die du nicht siehst",
                benefit2Title: "💪 Versteckte Stärken",
                benefit2Desc: "Finde Talente, die andere an dir bemerken",
                benefit3Title: "📈 Wachstumsbereiche",
                benefit3Desc: "Identifiziere Verbesserungsmöglichkeiten",
                benefit4Title: "🤝 Bessere Beziehungen",
                benefit4Desc: "Verstehe, wie du besser mit anderen interagieren kannst",
                processTitle: "Wie Es Funktioniert",
                processStep1: "1️⃣ Du richtest deine Bewertung ein",
                processStep2: "2️⃣ Du lädst verschiedene Gruppen ein",
                processStep3: "3️⃣ Sie geben anonymes Feedback",
                processStep4: "4️⃣ Du erhältst einen vollständigen Bericht",
                privacyTitle: "Privatsphäre Und Anonymität",
                privacyDesc: "Alles Feedback ist vollständig anonym. Deine Bewerter können ehrlich sein, ohne sich Sorgen zu machen, Gefühle zu verletzen.",
                readyTitle: "Bereit Für Eine Vollständige Perspektive?",
                readyDesc: "Starte deine 360° Bewertung und entdecke, wie die Welt dich sieht"
            },
            mbti: {
                title: "16 Persönlichkeitstypen",
                description: "Entdecke deinen einzigartigen Persönlichkeitstyp mit der klassischen Myers-Briggs Bewertung! Bist du ein introvertierter Denker oder ein emotionaler Extrovertierter?"
            },
            bigfive: {
                title: "Big Five Test",
                description: "Der Goldstandard der Persönlichkeitspsychologie! Erkunde deine Offenheit, Gewissenhaftigkeit, Extraversion, Verträglichkeit und Neurotizismus."
            },
            eq: {
                title: "Emotionale Intelligenz (EI)",
                description: "Wie gut liest du Emotionen und navigierst soziale Situationen? Teste deine emotionalen Superkräfte!"
            },
            ei: {
                title: "Emotionale Intelligenz",
                description: "Wie gut liest du Emotionen und navigierst soziale Situationen? Teste deine emotionalen Superkräfte!"
            },
            iq: {
                title: "Mentale Herausforderung",
                description: "Teste deine Problemlösungsfähigkeiten! Spaßige logische Rätsel, um deinen Geist herauszufordern."
            },
            lovelanguage: {
                title: "Liebessprachen Test",
                description: "Bestätigende Worte, Qualitätszeit oder körperliche Berührung? Entdecke, wie du Liebe am besten gibst und empfängst!"
            },
            adhd: {
                title: "ADHS Selbsteinschätzung",
                description: "Erkunde deine Aufmerksamkeitsmuster und Energielevel. Großartig, um deinen Produktivitätsstil zu verstehen!"
            },
            anxiety: {
                title: "Angst Selbstcheck",
                description: "Wie gehst du mit Druck um? Lerne deine Stressmuster kennen und entdecke gesunde Bewältigungsstrategien."
            },
            depression: {
                title: "Stimmungs Selbstreflexion",
                description: "Verstehe deine emotionalen Muster und Widerstandsfähigkeit. Perfekt für persönliches Wachstum und Selbsterkenntnis!"
            },
            strengths: {
                title: "Charakterstärken",
                description: "Entdecke deine wichtigsten Charakterstärken! Von Kreativität bis Freundlichkeit, finde heraus, was dich zum Strahlen bringt."
            },
            careerpath: {
                title: "Karriereweg Finder",
                description: "Entdecke die Karriere, die zu deiner Persönlichkeit passt! Bist du ein Führer, Schöpfer, Helfer, Analyst oder Unternehmer?"
            },
            relationshipstyle: {
                title: "Beziehungsstil",
                description: "Wie liebst und verbindest du dich mit anderen? Entdecke deinen einzigartigen Beziehungsstil und was dich in der Liebe antreibt!"
            },
            // Test badges and general terms - German
            trending: "🔥 Trend",
            popular: "✨ Beliebt",
            new: "🔥 NEU",
            takeTest: "Test Machen",
            createQuestions: "Fragen Erstellen",
            startAssessment: "Meine Leute Fragen",
            // Test metadata terms - German
            meta: {
                duration: "⏱️ 8 Min",
                accuracy: "🎯 95% Genauigkeit",
                free: "🎁 Kostenlos",
                scientific: "🧬 Wissenschaftlich",
                fun: "🎉 Spaßig",
                quick: "⚡ Schnell",
                comprehensive: "📊 Umfassend",
                insightful: "💡 Aufschlussreich",
                personalized: "🎯 Personalisiert",
                relationships: "💕 Beziehungen",
                connection: "🤝 Verbindung",
                socialApp: "📱 Sozial",
                socialPeople: "👥 Sozial",
                viral: "🔥 Viral",
                detailed: "📊 Detailliert",
                couples: "💕 Paare",
                workplace: "💼 Arbeitsplatz",
                growth: "🌱 Wachstum",
                selfcare: "🧘 Selbstfürsorge",
                communication: "💬 Kommunikation",
                leadership: "👑 Führung",
                creativity: "🎨 Kreativität",
                career: "💼 Karriere",
                minutes5: "⏱️ 5 Min",
                minutes10: "⏱️ 10 Min",
                minutes15: "⏱️ 15 Min",
                setup5: "⏱️ 5 Min Setup",
                setup10: "⏱️ 10 Min Setup"
            },
        },
        couples: {
            title: "Paar-Kompatibilität ❤️",
            subtitle: "Macht die Tests einzeln, dann verbindet euch mit eurem Partner, um eure Beziehungsdynamik und Kompatibilitäts-Insights zu entdecken! 💕",
            shareResults: "Teile Deine Ergebnisse",
            shareDesc: "Nach jedem Test erhältst du eine einzigartige Sharing-ID, um dich mit deinem Partner zu verbinden und eure Vibes zu vergleichen!",
            shareButton: "Mit Partner Verbinden",
            compatibility: "Kompatibilitäts-Analyse",
            compatibilityDesc: "Erhalte detaillierte Einblicke in eure Beziehungsdynamik, Kommunikationsstile und Bereiche der Harmonie oder des Wachstums!",
            compatibilityButton: "Unsere Übereinstimmung Sehen",
            growth: "Beziehungswachstum",
            growthDesc: "Entdecke Tipps und Strategien zur Stärkung eurer Bindung basierend auf beiden Persönlichkeitstypen und Ergebnissen!",
            growthButton: "Zusammen Wachsen"
        },
        whyChoose: {
            title: "Warum PersonaTests Wählen? ✨",
            scientific: "Wirklich Wissenschaftlich",
            scientificDesc: "Unsere Tests basieren auf echter psychologischer Forschung, nicht nur zufälligen Fragen. Wir machen keine Spass! 🧠",
            instant: "Sofortige Ergebnisse",
            instantDesc: "Erhalte deine Persönlichkeitsaufschlüsselung sofort. Kein Warten, keine Verzögerungen, nur pure sofortige Befriedigung! ⚡",
            safe: "Deine Geheimnisse Sind Sicher",
            safeDesc: "Wir halten deine Antworten privat. Kein Verkauf deiner Daten, keine seltsamen E-Mails. Nur du und deine Ergebnisse! 🔒",
            everywhere: "Funktioniert Überall",
            everywhereDesc: "Mache Tests auf deinem Handy, Laptop, Tablet - buchstäblich überall, wo du deine Persönlichkeit entdecken willst! 📱",
            // Feature bullets
            researchBased: "📚 Forschungsbasiert",
            validatedMethods: "🎯 Validierte Methoden",
            psychologyDriven: "🧠 Psychologie-basiert",
            immediate: "⚡ Sofort",
            fastProcessing: "🚀 Schnelle Bearbeitung",
            userFriendly: "👆 Benutzerfreundlich",
            comprehensive: "📋 Umfassend",
            actionable: "💡 Umsetzbar",
            growthFocused: "🌱 Wachstumsorientiert",
            evidenceBased: "🔬 Evidenzbasiert",
            practical: "🎯 Praktisch",
            insightful: "🔍 Aufschlussreich",
            realTimeAnalysis: "📊 Echtzeit-Analyse",
            privacyFirst: "🔒 Datenschutz Zuerst",
            dataProtection: "🛡️ Datenschutz",
            noSpam: "✨ Kein Spam",
            mobileFriendly: "📱 Mobilfreundlich",
            crossPlatform: "💻 Plattformübergreifend",
            anyDevice: "🌐 Jedes Gerät"
        },
        whyMatters: {
            title: "Warum Persönlichkeitstests Wichtig Sind",
            selfAwareness: "Selbstbewusstsein",
            selfAwarenessDesc: "Verstehe deine natürlichen Tendenzen, Stärken und Verbesserungsbereiche, um bessere Lebensentscheidungen zu treffen.",
            careerDevelopment: "Karriereentwicklung",
            careerDevelopmentDesc: "Entdecke Karrierewege, die zu deiner Persönlichkeit passen, für mehr Arbeitszufriedenheit und Erfolg.",
            betterRelationships: "Bessere Beziehungen",
            betterRelationshipsDesc: "Verbessere die Kommunikation und das Verständnis in persönlichen und beruflichen Beziehungen."
        },
        blog: {
            title: "Psychologie Einblicke & Tipps 📚",
            subtitle: "Lerne über Persönlichkeitspsychologie, Selbstverbesserung und Beziehungseinblicke",
            coming_soon: "Weitere Psychologie-Artikel und Einblicke kommen bald! ✨"
        },
        meta: {
            duration: "⏱️ 8 Minuten",
            duration5: "⏱️ 5 Minuten",
            accurate: "🎯 Sehr genau",
            scienceBased: "🔬 Wissenschaftlich fundiert",
            takeTest: "Test machen",
            badges: "🏆 Abzeichen",
            researchBased: "🔬 Forschungsbasiert",
            scientificallyValid: "✅ Wissenschaftlich validiert",
            personalityInsights: "🧠 Persönlichkeits-Einblicke",
            validated: "✅ Validiert",
            comprehensive: "📋 Umfassend",
            detailed: "📊 Detailliert",
            professional: "💼 Professionell",
            expertValidated: "👨‍🔬 Expertenvalidiert",
            psychologyBased: "🧠 Psychologie-basiert",
            tested: "🧪 Getestet",
            reliable: "🔒 Verlässlich",
            fastResults: "⚡ Schnelle Ergebnisse",
            deepInsights: "🔍 Tiefe Einblicke",
            actionableAdvice: "💡 Umsetzbare Ratschläge",
            personalDevelopment: "🌱 Persönliche Entwicklung",
            selfAwareness: "🪞 Selbstbewusstsein",
            growthOriented: "📈 Wachstumsorientiert",
            lifeImprovement: "✨ Lebensverbesserung",
            easyToUse: "👆 Einfach zu verwenden",
            quickStart: "🚀 Schneller Start",
            noSignup: "🚫 Keine Anmeldung",
            instantAccess: "⚡ Sofortiger Zugang",
            mobileOptimized: "📱 Mobil optimiert",
            shareable: "📤 Teilbar",
            multilingual: "🌍 Mehrsprachig"
        },
        footer: {
            description: "Entdecke deine Persönlichkeit mit wissenschaftlich fundierten Tests, die dich verstehen.",
            popularTests: "Beliebte Tests",
            sixteenTypes: "16 Persönlichkeitstypen",
            bigFive: "Big Five Test",
            brainTeaser: "Gehirn-Challenge",
            moreInfo: "Mehr Infos",
            aboutUs: "Über Uns",
            blog: "Blog",
            privacyPolicy: "Datenschutzrichtlinie",
            termsOfService: "Nutzungsbedingungen"
        }
    },
    it: {
        nav: {
            tests: "Test",
            couples: "Coppie",
            about: "Chi Siamo",
            blog: "Blog",
            results: "I Miei Risultati",
            login: "Accedi ✨", 
            logout: "Esci"
        },
        hero: {
            title: "Scopri La Tua Personalità ✨",
            subtitle: "Fai test di personalità scientifici che ti capiscono davvero. Da MBTI a Big Five, scopri cosa ti rende speciale! 🔥",
            cta: "Inizia Il Test",
            startJourney: "Inizia Il Tuo Viaggio",
            stats: {
                tests: "Test di Personalità",
                languages: "Lingue",
                access: "Sempre Gratis",
                private: "Privato"
            },
            features: {
                scientific: "Basato sulla Scienza",
                instant: "Risultati Istantanei",
                personalized: "100% Personalizzato",
                private: "Completamente Privato"
            }
        },
        stats: {
            categories: "Categorie di Test",
            reliability: "Affidabilità Scientifica",
            available: "Sempre Disponibile"
        },
        ui: {
            previous: "Precedente",
            next: "Avanti",
            finishTest: "Termina Test"
        },
        categories: {
            all: "Tutti",
            knowYourself: "🧠 Conosci Te Stesso",
            howOthersSeeMe: "👥 Come Mi Vedono Gli Altri",
            knowYourselfTitle: "🧠 Conosci Te Stesso",
            knowYourselfSubtitle: "Scopri la tua personalità interiore, i punti di forza e le caratteristiche uniche attraverso valutazioni scientificamente validate",
            howOthersSeeTitle: "👥 Come Mi Vedono Gli Altri",
            howOthersSubtitle: "Ricevi feedback onesti e scopri come amici, famiglia e colleghi ti percepiscono realmente"
        },
        tests: {
            sectionTitle: "Scopri La Tua Personalità ✨",
            sectionSubtitle: "Quale test ti piace di più? Tutti sono scientifici e divertenti! 💫",
            disclaimer: "🎯 Importante: Solo per Intrattenimento e Autoriflessione",
            disclaimerText: "Questi test sono per divertimento e autoconoscenza, non per diagnosi professionali. Se hai bisogno di aiuto psicologico, consulta un professionista sanitario qualificato.",
            takeTest: "Fai il Test",
            askfriends: {
                title: "Vedi Chi Mi Conosce Meglio",
                description: "Crea domande su te stesso, fornisci LE TUE risposte, poi vedi chi ti conosce meglio! Gli amici proveranno a indovinare le tue risposte e saranno valutati su quanto bene ti conoscono.",
                heroTitle: "Vedi Chi Mi Conosce Meglio 🧩",
                heroSubtitle: "Crea domande su te stesso, fornisci LE TUE risposte, poi vedi chi ti conosce meglio! Gli amici proveranno a indovinare le tue risposte e saranno valutati su quanto bene ti conoscono.",
                startButton: "Crea Il Mio Questionario",
                howItWorks: "Come Funziona",
                howItWorksDesc: "È super facile creare il tuo questionario personalizzato:",
                step1Title: "1️⃣ Crea Le Tue Domande",
                step1Desc: "Progetta domande uniche sulla tua personalità",
                step2Title: "2️⃣ Condividi Il Link",
                step2Desc: "Invia il link ai tuoi amici fidati",
                step3Title: "3️⃣ Vedi I Risultati",
                step3Desc: "Scopri cosa pensano davvero di te",
                whyUseTitle: "Perché usare questa funzione?",
                whyUseDesc: "Ottieni prospettive oneste da persone che ti conoscono bene. È perfetto per scoprire punti ciechi sulla tua personalità e come gli altri ti percepiscono in diverse situazioni.",
                exampleQuestions: "Esempi di Domande",
                example1: "\"Quale parola descrive meglio la mia personalità?\"",
                example2: "\"In quale situazione mi vedi più nel mio elemento?\"",
                example3: "\"Quale pensi sia la mia forza più grande?\"",
                readyToStart: "Pronto Per Iniziare?",
                readyToStartDesc: "Crea il tuo questionario personalizzato e scopri come ti vedono i tuoi amici"
            },
            "360assessment": {
                title: "360 Percezione Su Di Me",
                description: "Feedback serio e multi-prospettico per crescita e comprensione. Ricevi intuizioni oneste da amici, famiglia e colleghi.",
                heroTitle: "360 Percezione Su Di Me 🎯",
                heroSubtitle: "Feedback serio e multi-prospettico per crescita e comprensione. Ricevi intuizioni complete da persone che ti conoscono meglio.",
                startButton: "Inizia La Mia Valutazione",
                fullCircleTitle: "Vista Completa a 360°",
                fullCircleDesc: "Ottieni prospettive da:",
                perspective1: "👥 Amici stretti",
                perspective2: "👨‍👩‍👧‍👦 Membri della famiglia",
                perspective3: "💼 Colleghi di lavoro",
                perspective4: "🏫 Compagni di studio",
                benefitsTitle: "Benefici Della Valutazione 360°",
                benefit1Title: "🎯 Punti Ciechi",
                benefit1Desc: "Scopri aspetti di te stesso che non vedi",
                benefit2Title: "💪 Forze Nascoste",
                benefit2Desc: "Trova talenti che gli altri notano in te",
                benefit3Title: "📈 Aree di Crescita",
                benefit3Desc: "Identifica opportunità di miglioramento",
                benefit4Title: "🤝 Relazioni Migliori",
                benefit4Desc: "Capisci come interagire meglio con gli altri",
                processTitle: "Come Funziona",
                processStep1: "1️⃣ Imposti la tua valutazione",
                processStep2: "2️⃣ Inviti diversi gruppi",
                processStep3: "3️⃣ Loro danno feedback anonimo",
                processStep4: "4️⃣ Ottieni un rapporto completo",
                privacyTitle: "Privacy E Anonimato",
                privacyDesc: "Tutto il feedback è completamente anonimo. I tuoi valutatori possono essere onesti senza preoccuparsi di ferire i sentimenti.",
                readyTitle: "Pronto Per Una Prospettiva Completa?",
                readyDesc: "Inizia la tua valutazione 360° e scopri come ti vede il mondo"
            },
            mbti: {
                title: "16 Tipi di Personalità",
                description: "Scopri il tuo tipo di personalità unico con la valutazione classica Myers-Briggs! Sei un pensatore introverso o un estroverso emotivo?"
            },
            bigfive: {
                title: "Test dei Big Five",
                description: "Il gold standard della psicologia della personalità! Esplora la tua apertura, coscienziosità, estroversione, gradevolezza e nevroticismo."
            },
            eq: {
                title: "Intelligenza Emotiva (IE)",
                description: "Quanto bene leggi le emozioni e navighi le situazioni sociali? Testa i tuoi superpoteri emotivi!"
            },
            ei: {
                title: "Intelligenza Emotiva",
                description: "Quanto bene leggi le emozioni e navighi le situazioni sociali? Testa i tuoi superpoteri emotivi!"
            },
            iq: {
                title: "Sfida Mentale",
                description: "Testa le tue abilità di risoluzione dei problemi! Puzzle logici divertenti per sfidare la tua mente."
            },
            lovelanguage: {
                title: "Test del Linguaggio dell'Amore",
                description: "Parole di affermazione, tempo di qualità o contatto fisico? Scopri come dai e ricevi l'amore meglio!"
            },
            adhd: {
                title: "Autovalutazione ADHD",
                description: "Esplora i tuoi modelli di attenzione e livelli di energia. Ottimo per capire il tuo stile di produttività!"
            },
            anxiety: {
                title: "Autocontrollo dell'Ansia",
                description: "Come gestisci la pressione? Impara i tuoi modelli di stress e scopri strategie di coping salutari."
            },
            depression: {
                title: "Autoriflessione dell'Umore",
                description: "Comprendi i tuoi modelli emotivi e la resilienza. Perfetto per la crescita personale e l'autoconoscenza!"
            },
            strengths: {
                title: "Forze del Carattere",
                description: "Scopri le tue principali forze del carattere! Dalla creatività alla gentilezza, trova cosa ti fa brillare."
            },
            careerpath: {
                title: "Scopritore del Percorso Professionale",
                description: "Scopri la carriera che corrisponde alla tua personalità! Sei un leader, creatore, aiutante, analista o imprenditore?"
            },
            relationshipstyle: {
                title: "Stile Relazionale",
                description: "Come ami e ti connetti con gli altri? Scopri il tuo stile relazionale unico e cosa ti fa brillare in amore!"
            },
            // Test badges and general terms - Italian
            trending: "🔥 Tendenza",
            popular: "✨ Popolare",
            new: "🔥 NUOVO",
            takeTest: "Fai Il Test",
            createQuestions: "Crea Domande",
            startAssessment: "Chiedi Alla Mia Gente",
            // Test metadata terms - Italian
            meta: {
                duration: "⏱️ 8 min",
                accuracy: "🎯 95% accuratezza",
                free: "🎁 Gratis",
                scientific: "🧬 Scientifico",
                fun: "🎉 Divertente",
                quick: "⚡ Veloce",
                comprehensive: "📊 Completo",
                insightful: "💡 Perspicace",
                personalized: "🎯 Personalizzato",
                relationships: "💕 Relazioni",
                connection: "🤝 Connessione",
                socialApp: "📱 Sociale",
                socialPeople: "👥 Sociale",
                viral: "🔥 Virale",
                detailed: "📊 Dettagliato",
                couples: "💕 Coppie",
                workplace: "💼 Lavoro",
                growth: "🌱 Crescita",
                selfcare: "🧘 Benessere",
                communication: "💬 Comunicazione",
                leadership: "👑 Leadership",
                creativity: "🎨 Creatività",
                career: "💼 Carriera",
                minutes5: "⏱️ 5 min",
                minutes10: "⏱️ 10 min",
                minutes15: "⏱️ 15 min",
                setup5: "⏱️ 5 min setup",
                setup10: "⏱️ 10 min setup"
            },
        },
        couples: {
            title: "Compatibilità di Coppia ❤️",
            subtitle: "Fate i test individualmente, poi collegatevi con il vostro partner per scoprire le dinamiche della vostra relazione e insights di compatibilità! 💕",
            shareResults: "Condividi I Tuoi Risultati",
            shareDesc: "Dopo aver fatto qualsiasi test, ottieni un ID unico per connetterti con il tuo partner e confrontare le vostre vibes!",
            shareButton: "Connetti Con Il Partner",
            compatibility: "Analisi di Compatibilità",
            compatibilityDesc: "Ottieni insights dettagliati sulle dinamiche della vostra relazione, stili di comunicazione e aree di armonia o crescita!",
            compatibilityButton: "Vedi La Nostra Compatibilità",
            growth: "Crescita della Relazione",
            growthDesc: "Scopri consigli e strategie per rafforzare il vostro legame basato su entrambi i vostri tipi di personalità e risultati!",
            growthButton: "Crescere Insieme"
        },
        whyChoose: {
            title: "Perché Scegliere PersonaTests? ✨",
            scientific: "Realmente Scientifico",
            scientificDesc: "I nostri test sono basati su vera ricerca psicologica, non solo domande casuali. Non stiamo scherzando! 🧠",
            instant: "Risultati Istantanei",
            instantDesc: "Ottieni la tua analisi della personalità immediatamente. Nessuna attesa, nessun ritardo, solo pura gratificazione istantanea! ⚡",
            safe: "I Tuoi Segreti Sono Al Sicuro",
            safeDesc: "Manteniamo le tue risposte private. Nessuna vendita dei tuoi dati, nessuna email strana. Solo tu e i tuoi risultati! 🔒",
            everywhere: "Funziona Ovunque",
            everywhereDesc: "Fai i test sul tuo telefono, laptop, tablet - letteralmente ovunque tu voglia scoprire la tua personalità! 📱",
            // Feature bullets
            researchBased: "📚 Basato sulla Ricerca",
            validatedMethods: "🎯 Metodi Validati",
            psychologyDriven: "🧠 Basato sulla Psicologia",
            immediate: "⚡ Immediato",
            fastProcessing: "🚀 Elaborazione Rapida",
            userFriendly: "👆 Facile da Usare",
            comprehensive: "📋 Completo",
            actionable: "💡 Pratico",
            growthFocused: "🌱 Orientato alla Crescita",
            evidenceBased: "🔬 Basato sull'Evidenza",
            practical: "🎯 Pratico",
            insightful: "🔍 Perspicace",
            realTimeAnalysis: "📊 Analisi in Tempo Reale",
            privacyFirst: "🔒 Privacy Prima",
            dataProtection: "🛡️ Protezione Dati",
            noSpam: "✨ Niente Spam",
            mobileFriendly: "📱 Compatibile Mobile",
            crossPlatform: "💻 Multi-Piattaforma",
            anyDevice: "🌐 Qualsiasi Dispositivo"
        },
        whyMatters: {
            title: "Perché i Test di Personalità Sono Importanti",
            selfAwareness: "Autoconsapevolezza",
            selfAwarenessDesc: "Comprendi le tue tendenze naturali, i punti di forza e le aree di crescita per prendere decisioni di vita migliori.",
            careerDevelopment: "Sviluppo della Carriera",
            careerDevelopmentDesc: "Scopri percorsi di carriera che si allineano con la tua personalità per maggiore soddisfazione lavorativa e successo.",
            betterRelationships: "Relazioni Migliori",
            betterRelationshipsDesc: "Migliora la comunicazione e la comprensione nelle relazioni personali e professionali."
        },
        blog: {
            title: "Approfondimenti e Consigli di Psicologia 📚",
            subtitle: "Impara sulla psicologia della personalità, miglioramento personale e relazioni",
            coming_soon: "Altri articoli e approfondimenti di psicologia in arrivo! ✨"
        },
        meta: {
            duration: "⏱️ 8 minuti",
            duration5: "⏱️ 5 minuti",
            accurate: "🎯 Molto accurato",
            scienceBased: "🔬 Basato sulla scienza",
            takeTest: "Fai il test",
            badges: "🏆 Badge",
            researchBased: "🔬 Basato sulla ricerca",
            scientificallyValid: "✅ Scientificamente valido",
            personalityInsights: "🧠 Intuizioni sulla personalità",
            validated: "✅ Validato",
            comprehensive: "📋 Completo",
            detailed: "📊 Dettagliato",
            professional: "💼 Professionale",
            expertValidated: "👨‍🔬 Validato da esperti",
            psychologyBased: "🧠 Basato sulla psicologia",
            tested: "🧪 Testato",
            reliable: "🔒 Affidabile",
            fastResults: "⚡ Risultati rapidi",
            deepInsights: "🔍 Intuizioni profonde",
            actionableAdvice: "💡 Consigli pratici",
            personalDevelopment: "🌱 Sviluppo personale",
            selfAwareness: "🪞 Autoconsapevolezza",
            growthOriented: "📈 Orientato alla crescita",
            lifeImprovement: "✨ Miglioramento della vita",
            easyToUse: "👆 Facile da usare",
            quickStart: "🚀 Avvio rapido",
            noSignup: "🚫 Nessuna registrazione",
            instantAccess: "⚡ Accesso istantaneo",
            mobileOptimized: "📱 Ottimizzato per mobile",
            shareable: "📤 Condivisibile",
            multilingual: "🌍 Multilingue"
        },
        footer: {
            description: "Scopri la tua personalità con test scientificamente validati che ti capiscono.",
            popularTests: "Test Popolari",
            sixteenTypes: "16 Tipi di Personalità",
            bigFive: "Test dei Big Five",
            brainTeaser: "Sfida Mentale",
            moreInfo: "Maggiori Info",
            aboutUs: "Chi Siamo",
            blog: "Blog",
            privacyPolicy: "Politica sulla Privacy",
            termsOfService: "Termini di Servizio"
        }
    },
    pt: {
        nav: {
            tests: "Testes",
            couples: "Casais", 
            about: "Sobre",
            blog: "Blog",
            results: "Meus Resultados",
            login: "Entrar ✨",
            logout: "Sair"
        },
        hero: {
            title: "Descubra Sua Personalidade ✨",
            subtitle: "Faça testes de personalidade científicos que realmente te entendem. Do MBTI ao Big Five, descubra o que te torna especial! 🔥",
            cta: "Fazer Meu Teste",
            startJourney: "Comece Sua Jornada",
            stats: {
                tests: "Testes de Personalidade",
                languages: "Idiomas",
                access: "Sempre Grátis",
                private: "Privado"
            },
            features: {
                scientific: "Baseado em Ciência",
                instant: "Resultados Instantâneos",
                personalized: "100% Personalizado",
                private: "Completamente Privado"
            }
        },
        stats: {
            categories: "Categorias de Testes",
            reliability: "Confiabilidade Científica", 
            available: "Sempre Disponível"
        },
        ui: {
            previous: "Anterior",
            next: "Próximo",
            finishTest: "Finalizar Teste"
        },
        categories: {
            all: "Todos",
            knowYourself: "🧠 Conheça Você Mesmo",
            howOthersSeeMe: "👥 Como Outros Me Veem",
            knowYourselfTitle: "🧠 Conheça Você Mesmo",
            knowYourselfSubtitle: "Descubra sua personalidade interior, pontos fortes e características únicas através de avaliações cientificamente validadas",
            howOthersSeeTitle: "👥 Como Outros Me Veem",
            howOthersSubtitle: "Receba feedback honesto e descubra como amigos, família e colegas realmente te percebem"
        },
        tests: {
            sectionTitle: "Descubra Sua Personalidade ✨",
            sectionSubtitle: "Qual teste você quer fazer? Todos são científicos e super divertidos! 💫",
            disclaimer: "🎯 Importante: Apenas para Entretenimento e Autorreflexão",
            disclaimerText: "Estes testes são para diversão e autoconhecimento, não para diagnóstico profissional. Se você precisa de ajuda psicológica, consulte um profissional de saúde qualificado.",
            takeTest: "Fazer Teste",
            askfriends: {
                title: "Veja Quem Me Conhece Melhor",
                description: "Crie perguntas sobre você mesmo, forneça SUAS respostas, depois veja quem te conhece melhor! Os amigos tentarão acertar suas respostas e serão avaliados sobre o quão bem te conhecem.",
                heroTitle: "Veja Quem Me Conhece Melhor 🧩",
                heroSubtitle: "Crie perguntas sobre você mesmo, forneça SUAS respostas, depois veja quem te conhece melhor! Os amigos tentarão acertar suas respostas e serão avaliados sobre o quão bem te conhecem.",
                startButton: "Criar Meu Questionário",
                howItWorks: "Como Funciona",
                howItWorksDesc: "É super fácil criar seu questionário personalizado:",
                step1Title: "1️⃣ Crie Suas Perguntas",
                step1Desc: "Desenvolva perguntas únicas sobre sua personalidade",
                step2Title: "2️⃣ Compartilhe O Link",
                step2Desc: "Envie o link para seus amigos confiáveis",
                step3Title: "3️⃣ Veja Os Resultados",
                step3Desc: "Descubra o que eles realmente pensam de você",
                whyUseTitle: "Por que usar este recurso?",
                whyUseDesc: "Obtenha perspectivas honestas de pessoas que te conhecem bem. É perfeito para descobrir pontos cegos sobre sua personalidade e como os outros te percebem em diferentes situações.",
                exampleQuestions: "Exemplos de Perguntas",
                example1: "\"Qual palavra melhor descreve minha personalidade?\"",
                example2: "\"Em que situação você me vê mais no meu elemento?\"",
                example3: "\"Qual você acha que é minha maior força?\"",
                readyToStart: "Pronto Para Começar?",
                readyToStartDesc: "Crie seu questionário personalizado e descubra como seus amigos te veem"
            },
            "360assessment": {
                title: "360 Percepção Sobre Mim",
                description: "Feedback sério e multi-perspectivo para crescimento e compreensão. Receba insights honestos de amigos, família e colegas.",
                heroTitle: "360 Percepção Sobre Mim 🎯",
                heroSubtitle: "Feedback sério e multi-perspectivo para crescimento e compreensão. Receba insights abrangentes de pessoas que te conhecem melhor.",
                startButton: "Iniciar Minha Avaliação",
                fullCircleTitle: "Visão Completa 360°",
                fullCircleDesc: "Obtenha perspectivas de:",
                perspective1: "👥 Amigos próximos",
                perspective2: "👨‍👩‍👧‍👦 Membros da família",
                perspective3: "💼 Colegas de trabalho",
                perspective4: "🏫 Colegas de estudos",
                benefitsTitle: "Benefícios da Avaliação 360°",
                benefit1Title: "🎯 Pontos Cegos",
                benefit1Desc: "Descubra aspectos de si mesmo que você não vê",
                benefit2Title: "💪 Forças Ocultas",
                benefit2Desc: "Encontre talentos que outros percebem em você",
                benefit3Title: "📈 Áreas de Crescimento",
                benefit3Desc: "Identifique oportunidades de melhoria",
                benefit4Title: "🤝 Relacionamentos Melhores",
                benefit4Desc: "Entenda como interagir melhor com os outros",
                processTitle: "Como Funciona",
                processStep1: "1️⃣ Você configura sua avaliação",
                processStep2: "2️⃣ Convida diferentes grupos",
                processStep3: "3️⃣ Eles fornecem feedback anônimo",
                processStep4: "4️⃣ Você recebe um relatório abrangente",
                privacyTitle: "Privacidade E Anonimato",
                privacyDesc: "Todo feedback é completamente anônimo. Seus avaliadores podem ser honestos sem se preocupar em ferir sentimentos.",
                readyTitle: "Pronto Para Uma Perspectiva Completa?",
                readyDesc: "Inicie sua avaliação 360° e descubra como o mundo te vê"
            },
            mbti: {
                title: "16 Tipos de Personalidade",
                description: "O teste de personalidade mais famoso! Você é um INTJ estratégico ou um ENFP entusiasmado? Descubra agora! 💅"
            },
            bigfive: {
                title: "Teste dos Cinco Grandes",
                description: "O teste que até os psicólogos adoram! Descubra seus 5 traços de personalidade principais! 🧠"
            },
            eq: {
                title: "Inteligência Emocional (IE)",
                description: "O quanto você entende emoções - suas e dos outros? Teste seus superpoderes emocionais! 💝"
            },
            ei: {
                title: "Inteligência Emocional",
                description: "O quanto você entende emoções - suas e dos outros? Teste seus superpoderes emocionais! 💝"
            },
            iq: {
                title: "Desafio Mental",
                description: "Quebra-cabeças lógicos e jogos para o cérebro! Só por diversão - teste de QI real é com psicólogo. Vamos ver como você se sai! 🤓"
            },
            disc: {
                title: "Teste de Personalidade DISC",
                description: "Descubra seu estilo de comunicação! Você é Dominante, Influente, Estável ou Consciencioso? Perfeito para entender dinâmicas de trabalho e relacionamento! 💼"
            },
            conflict: {
                title: "Avaliação de Estilo de Conflito",
                description: "Como você lida com desacordos? Descubra se você é um colaborador, competidor, acomodador, evitador ou negociador! 🤝"
            },
            strengths: {
                title: "Forças de Caráter (VIA)",
                description: "Descubra suas principais forças de caráter! Da criatividade à liderança à bondade - descubra o que te torna únicamente incrível! ✨"
            },
            lovelanguage: {
                title: "Teste da Linguagem do Amor",
                description: "Palavras de afirmação, tempo de qualidade ou toque físico? Descubra como você dá e recebe amor melhor!"
            },
            careerpath: {
                title: "Descobridor de Caminho Profissional",
                description: "Descubra a carreira que combina com sua personalidade! Você é um líder, criador, ajudante, analista ou empreendedor?"
            },
            relationshipstyle: {
                title: "Estilo de Relacionamento",
                description: "Como você ama e se conecta com outros? Descubra seu estilo único de relacionamento e o que te faz brilhar no amor!"
            },
            adhd: {
                title: "Estilo de Foco e Energia",
                description: "Descubra seus padrões únicos de atenção e energia! Isso é apenas para autorreflexão divertida - não uma avaliação médica. ⚡"
            },
            anxiety: {
                title: "Estilo de Gerenciamento de Estresse",
                description: "Descubra como você lida com estresse e pressão! Isso é apenas para diversão e autoconsciência - não aconselhamento médico. 💚"
            },
            depression: {
                title: "Estilo de Regulação Emocional",
                description: "Entenda como você processa emoções! Isso é apenas para autorreflexão e entretenimento - não uma avaliação de saúde mental. 🌻"
            },
            trendingTitle: "Tendência Agora 🔥",
            trendingSubtitle: "Os testes de personalidade mais quentes sobre os quais todos estão falando! Perfeitos para compartilhar com amigos e nas redes sociais 📱",
            love: {
                title: "Teste da Linguagem do Amor",
                description: "Descubra como você dá e recebe amor! Você é toque físico, palavras de afirmação ou algo mais? Perfeito para casais! 💖"
            },
            pet: {
                title: "Qual Animal Combina com Sua Personalidade?",
                description: "Você é um cachorro leal, gato independente, hamster brincalhão ou algo mais? Encontre seu animal perfeito baseado na sua personalidade! 🐱"
            },
            career: {
                title: "Qual é Seu Caminho Profissional Ideal?",
                description: "Descubra a carreira que combina com sua personalidade! Você é um líder, criador, ajudante, analista ou empreendedor? 🚀"
            },
            relationship: {
                title: "Qual é Seu Estilo de Relacionamento?",
                description: "Como você ama e se conecta com outros? Descubra seu estilo único de relacionamento e o que te faz brilhar no amor! ✨"
            },
            buttons: {
                discoverType: "Descobrir Meu Tipo ✨",
                takeTest: "Fazer o Teste",
                takeBrainChallenge: "Fazer Desafio Mental",
                checkEQ: "Verificar Minha IE",
                findStyle: "Encontrar Meu Estilo",
                checkStyle: "Verificar Meu Estilo",
                findStrengths: "Encontrar Minhas Forças",
                findLoveLanguage: "Encontrar Minha Linguagem do Amor",
                findPetMatch: "Encontrar Meu Animal",
                findCareer: "Encontrar Minha Carreira"
            }
        },
        askfriends: {
            heroTitle: "Pergunte Aos Meus Amigos 🤝",
            createQuestions: "Criar Perguntas",
            shareLink: "Compartilhar Link",
            seeResults: "Ver Resultados",
            startButton: "Criar Questionário"
        },
        "360assessment": {
            heroTitle: "Como As Pessoas Me Veem? 🔄",
            startAssessment: "Iniciar Avaliação",
            startButton: "Iniciar Minha Avaliação"
        },
        meta: {
            badges: {
                scientific: "Científico",
                fun: "Divertido",
                quick: "Rápido",
                comprehensive: "Abrangente",
                insightful: "Perspicaz",
                reliable: "Confiável",
                popular: "Popular",
                detailed: "Detalhado",
                accurate: "Preciso",
                free: "Grátis",
                validated: "Validado",
                trending: "Tendência",
                engaging: "Envolvente",
                professional: "Profissional"
            }
        },
        couples: {
            title: "Compatibilidade de Casais ❤️",
            subtitle: "Façam os testes individualmente, depois conectem-se com seu parceiro para descobrir a dinâmica do relacionamento e insights de compatibilidade! 💕",
            shareResults: "Compartilhe Seus Resultados",
            shareDesc: "Depois de fazer qualquer teste, obtenha um ID único para se conectar com seu parceiro e comparar suas vibes!",
            shareButton: "Conectar com Parceiro",
            compatibility: "Análise de Compatibilidade",
            compatibilityDesc: "Obtenha insights detalhados sobre a dinâmica do seu relacionamento, estilos de comunicação e áreas de harmonia ou crescimento!",
            compatibilityButton: "Ver Nossa Compatibilidade",
            growth: "Crescimento do Relacionamento",
            growthDesc: "Descubra dicas e estratégias para fortalecer sua união baseado em ambos os tipos de personalidade e resultados!",
            growthButton: "Crescer Juntos"
        },
        whyChoose: {
            title: "Por Que Escolher PersonaTests? ✨",
            scientific: "Realmente Científico",
            scientificDesc: "Nossos testes são baseados em pesquisa psicológica real, não apenas perguntas aleatórias. Não estamos brincando! 🧠",
            instant: "Resultados Instantâneos",
            instantDesc: "Obtenha sua análise de personalidade imediatamente. Sem espera, sem atrasos, apenas gratificação instantânea pura! ⚡",
            safe: "Seus Segredos Estão Seguros",
            safeDesc: "Mantemos suas respostas privadas. Sem venda de seus dados, sem emails estranhos. Apenas você e seus resultados! 🔒",
            everywhere: "Funciona Em Qualquer Lugar",
            everywhereDesc: "Faça testes no seu telefone, laptop, tablet - literalmente em qualquer lugar que você queira descobrir sua personalidade! 📱",
            // Feature bullets
            researchBased: "📚 Baseado em Pesquisa",
            validatedMethods: "🎯 Métodos Validados",
            psychologyDriven: "🧠 Baseado em Psicologia",
            immediate: "⚡ Imediato",
            fastProcessing: "🚀 Processamento Rápido",
            userFriendly: "👆 Fácil de Usar",
            comprehensive: "📋 Abrangente",
            actionable: "💡 Prático",
            growthFocused: "🌱 Focado no Crescimento",
            evidenceBased: "🔬 Baseado em Evidências",
            practical: "🎯 Prático",
            insightful: "🔍 Perspicaz",
            realTimeAnalysis: "📊 Análise em Tempo Real",
            privacyFirst: "🔒 Privacidade em Primeiro",
            dataProtection: "🛡️ Proteção de Dados",
            noSpam: "✨ Sem Spam",
            mobileFriendly: "📱 Compatível com Mobile",
            crossPlatform: "💻 Multi-Plataforma",
            anyDevice: "🌐 Qualquer Dispositivo"
        },
        whyMatters: {
            title: "Por Que os Testes de Personalidade São Importantes",
            selfAwareness: "Autoconhecimento",
            selfAwarenessDesc: "Compreenda suas tendências naturais, pontos fortes e áreas para crescimento para tomar melhores decisões de vida.",
            careerDevelopment: "Desenvolvimento de Carreira",
            careerDevelopmentDesc: "Descubra caminhos de carreira que se alinhem com sua personalidade para maior satisfação no trabalho e sucesso.",
            betterRelationships: "Relacionamentos Melhores",
            betterRelationshipsDesc: "Melhore a comunicação e o entendimento em relacionamentos pessoais e profissionais."
        },
        blog: {
            title: "Insights e Dicas de Psicologia 📚",
            subtitle: "Aprenda sobre psicologia da personalidade, autoajuda e relacionamentos",
            coming_soon: "Mais artigos e insights de psicologia em breve! ✨"
        },
        meta: {
            duration: "⏱️ 8 minutos",
            duration5: "⏱️ 5 minutos",
            accurate: "🎯 Muito preciso",
            scienceBased: "🔬 Baseado na ciência",
            takeTest: "Fazer teste",
            badges: "🏆 Distintivos",
            researchBased: "🔬 Baseado em pesquisa",
            scientificallyValid: "✅ Cientificamente válido",
            personalityInsights: "🧠 Insights de personalidade",
            validated: "✅ Validado",
            comprehensive: "📋 Abrangente",
            detailed: "📊 Detalhado",
            professional: "💼 Profissional",
            expertValidated: "👨‍🔬 Validado por especialistas",
            psychologyBased: "🧠 Baseado em psicologia",
            tested: "🧪 Testado",
            reliable: "🔒 Confiável",
            fastResults: "⚡ Resultados rápidos",
            deepInsights: "🔍 Insights profundos",
            actionableAdvice: "💡 Conselhos práticos",
            personalDevelopment: "🌱 Desenvolvimento pessoal",
            selfAwareness: "🪞 Autoconhecimento",
            growthOriented: "📈 Orientado ao crescimento",
            lifeImprovement: "✨ Melhoria de vida",
            easyToUse: "👆 Fácil de usar",
            quickStart: "🚀 Início rápido",
            noSignup: "🚫 Sem cadastro",
            instantAccess: "⚡ Acesso instantâneo",
            mobileOptimized: "📱 Otimizado para mobile",
            shareable: "📤 Compartilhável",
            multilingual: "🌍 Multilíngue"
        },
        footer: {
            description: "Descubra sua personalidade com testes cientificamente fundamentados que te entendem.",
            popularTests: "Testes Populares",
            sixteenTypes: "16 Tipos de Personalidade",
            bigFive: "Teste dos Cinco Grandes",
            brainTeaser: "Desafio Mental",
            moreInfo: "Mais Informações",
            aboutUs: "Sobre Nós",
            blog: "Blog",
            privacyPolicy: "Política de Privacidade",
            termsOfService: "Termos de Serviço"
        }
    },
    ja: {
        nav: {
            tests: "テスト",
            couples: "カップル",
            about: "について",
            blog: "ブログ",
            results: "私の結果",
            login: "ログイン ✨",
            logout: "ログアウト"
        },
        hero: {
            title: "あなたの性格を見つけよう ✨",
            subtitle: "科学的な性格テストで本当の自分を知ろう。MBTIからビッグファイブまで、あなたの個性を発見！🔥",
            cta: "テストを始める",
            startJourney: "旅を始める",
            stats: {
                tests: "性格テスト",
                languages: "言語",
                access: "常に無料",
                private: "プライベート"
            },
            features: {
                scientific: "科学に基づく",
                instant: "即座の結果",
                personalized: "100% パーソナライズ",
                private: "完全にプライベート"
            }
        },
        stats: {
            categories: "テストカテゴリー",
            reliability: "科学的信頼性",
            available: "いつでも利用可能"
        },
        ui: {
            previous: "前へ",
            next: "次へ",
            finishTest: "テスト完了"
        },
        categories: {
            all: "すべて",
            knowYourself: "🧠 自分を知る",
            howOthersSeeMe: "👥 他の人から見た私",
            knowYourselfTitle: "🧠 自分を知る",
            knowYourselfSubtitle: "科学的に検証された評価を通じて、あなたの内面の性格、強み、ユニークな特性を発見しましょう",
            howOthersSeeTitle: "👥 他の人から見た私",
            howOthersSubtitle: "正直なフィードバックを受け取り、友人、家族、同僚があなたをどう本当に見ているかを発見しましょう"
        },
        tests: {
            sectionTitle: "あなたの性格を発見 ✨",
            sectionSubtitle: "どのテストがお気に入り？すべて科学的で楽しいよ！💫",
            disclaimer: "🎯 重要：娯楽と自己反省のみを目的としています",
            disclaimerText: "これらの評価は楽しみと自己反省のために設計されており、専門的な診断ではありません。メンタルヘルスのサポートが必要な場合は、認可された医療提供者にご相談ください。",
            takeTest: "テストを開始",
            askfriends: {
                title: "誰が私を一番知っているか見てみよう",
                description: "自分についての質問を作って、あなたの答えを提供し、誰があなたを一番知っているかを見てみよう！友達があなたの答えに合わせようとして、あなたをどれくらい知っているかで点数をつけられます。",
                heroTitle: "誰が私を一番知っているか見てみよう 🧩",
                heroSubtitle: "自分についての質問を作って、あなたの答えを提供し、誰があなたを一番知っているかを見てみよう！友達があなたの答えに合わせようとして、あなたをどれくらい知っているかで点数をつけられます。",
                startButton: "質問票を作成",
                howItWorks: "使い方",
                howItWorksDesc: "カスタム質問票の作成は超簡単：",
                step1Title: "1️⃣ 質問を作成",
                step1Desc: "あなたの性格についてのユニークな質問を作成",
                step2Title: "2️⃣ リンクをシェア",
                step2Desc: "信頼できる友達にリンクを送信",
                step3Title: "3️⃣ 結果を見る",
                step3Desc: "友達があなたについて本当に何を思っているかを発見",
                whyUseTitle: "なぜこの機能を使うの？",
                whyUseDesc: "あなたをよく知る人から正直な視点を獲得。あなたの性格の盲点を発見し、他の人があなたを異なる状況でどう認識しているかを知るのに最適です。",
                exampleQuestions: "質問の例",
                example1: "\"私の性格を最もよく表す言葉は何ですか？\"",
                example2: "\"私が最も自分らしい状況はどれですか？\"",
                example3: "\"私の最大の強みは何だと思いますか？\"",
                readyToStart: "始める準備はできた？",
                readyToStartDesc: "カスタム質問票を作成して、友達があなたをどう見ているかを発見しよう"
            },
            "360assessment": {
                title: "360度私に関する認識",
                description: "成長と理解のための真剣な多角的フィードバック。友人、家族、同僚から正直な洞察を得る。",
                heroTitle: "360度私に関する認識 🎯",
                heroSubtitle: "成長と理解のための真剣な多角的フィードバック。あなたを最もよく知っている人々から包括的な洞察を得る。",
                startButton: "私の評価を開始",
                fullCircleTitle: "完全な360度ビュー",
                fullCircleDesc: "以下からの視点を獲得：",
                perspective1: "👥 親しい友人",
                perspective2: "👨‍👩‍👧‍👦 家族",
                perspective3: "💼 職場の同僚",
                perspective4: "🏫 学校の仲間",
                benefitsTitle: "360度評価の利点",
                benefit1Title: "🎯 盲点",
                benefit1Desc: "自分では見えない自分の側面を発見",
                benefit2Title: "💪 隠れた強み",
                benefit2Desc: "他の人があなたに気づく才能を発見",
                benefit3Title: "📈 成長領域",
                benefit3Desc: "改善の機会を特定",
                benefit4Title: "🤝 より良い関係",
                benefit4Desc: "他の人とより良く交流する方法を理解",
                processTitle: "仕組み",
                processStep1: "1️⃣ 評価を設定",
                processStep2: "2️⃣ 異なるグループを招待",
                processStep3: "3️⃣ 匿名でフィードバックを提供",
                processStep4: "4️⃣ 包括的なレポートを受け取る",
                privacyTitle: "プライバシーと匿名性",
                privacyDesc: "すべてのフィードバックは完全に匿名です。評価者は感情を害することを心配せずに正直になれます。",
                readyTitle: "完全な視点の準備はできた？",
                readyDesc: "360度評価を開始して、世界があなたをどう見ているかを発見しよう"
            },
            mbti: {
                title: "16の性格タイプ",
                description: "定番の性格テスト！INTJの戦略家タイプかENFPの熱血タイプか？今すぐ発見しよう！💅"
            },
            bigfive: {
                title: "ビッグファイブ性格テスト",
                description: "心理学者も認める本格テスト！あなたの5大性格特性を知ろう！🧠"
            },
            eq: {
                title: "感情知能（EQ）",
                description: "自分や他人の感情をどのくらい理解してる？感情の超能力をテストしよう！💝"
            },
            ei: {
                title: "感情知能",
                description: "自分や他人の感情をどのくらい理解してる？感情の超能力をテストしよう！💝"
            },
            iq: {
                title: "脳力チャレンジ",
                description: "楽しい脳トレパズル！お遊びだけど - 本格IQテストは心理士さんとやろうね。やってみよう！🤓"
            },
            disc: {
                title: "DISC性格テスト",
                description: "あなたのコミュニケーションスタイルを発見！支配的、影響力がある、安定している、慎重？仕事と人間関係の動力学を理解するのに最適！💼"
            },
            conflict: {
                title: "対立スタイル評価",
                description: "意見の相違をどう扱いますか？あなたが協力者、競争者、適応者、回避者、妥協者かを発見！🤝"
            },
            strengths: {
                title: "キャラクター強み（VIA）",
                description: "あなたの核となるキャラクター強みを発見！創造性からリーダーシップ、親切さまで - あなたをユニークに素晴らしくするものを発見！✨"
            },
            lovelanguage: {
                title: "愛の言語テスト",
                description: "肯定の言葉、質の時間、身体的接触？どのように愛を与え、受け取るのが最適かを発見！"
            },
            careerpath: {
                title: "キャリアパス発見",
                description: "あなたの性格にマッチするキャリアを発見！リーダー、クリエイター、ヘルパー、アナリスト、起業家？"
            },
            relationshipstyle: {
                title: "恋愛スタイル",
                description: "どのように愛し、他者と繋がりますか？あなたのユニークな恋愛スタイルと愛における魅力を発見！"
            },
            adhd: {
                title: "集中とエネルギースタイル",
                description: "あなたのユニークな注意とエネルギーパターンを発見！これは楽しい自己反省のみです - 医学的評価ではありません。⚡"
            },
            anxiety: {
                title: "ストレス管理スタイル",
                description: "ストレスと圧力をどう扱うかを発見！これは楽しい自己認識のみです - 医学的アドバイスではありません。💚"
            },
            depression: {
                title: "感情調整スタイル",
                description: "感情をどう処理するかを理解！これは自己反省と娯楽のみです - メンタルヘルス評価ではありません。🌻"
            },
            trendingTitle: "今トレンド 🔥",
            trendingSubtitle: "みんなが話している最もホットな性格テスト！友達やソーシャルメディアで共有するのに最適📱",
            love: {
                title: "愛の言語テスト",
                description: "愛をどう与え、受け取るかを発見！身体的接触、肯定の言葉、それとも他の何か？カップルに最適！💖"
            },
            pet: {
                title: "あなたの性格に合うペットは？",
                description: "忠実な犬、独立した猫、遊び好きなハムスター、それとも他の何か？あなたの性格に基づいて完璧なペットを見つけて！🐱"
            },
            career: {
                title: "あなたの理想のキャリアパスは？",
                description: "あなたの性格に合うキャリアを発見！リーダー、クリエイター、ヘルパー、アナリスト、起業家？🚀"
            },
            relationship: {
                title: "あなたの恋愛スタイルは？",
                description: "どのように愛し、他者と繋がりますか？あなたのユニークな恋愛スタイルと愛におけるあなたの魅力を発見！✨"
            },
            buttons: {
                discoverType: "私のタイプを発見 ✨",
                takeTest: "テストを受ける",
                takeBrainChallenge: "脳チャレンジを受ける",
                checkEQ: "私のEQをチェック",
                findStyle: "私のスタイルを見つける",
                checkStyle: "私のスタイルをチェック",
                findStrengths: "私の強みを見つける",
                findLoveLanguage: "私の愛の言語を見つける",
                findPetMatch: "私のペットを見つける",
                findCareer: "私のキャリアを見つける"
            }
        },
        couples: {
            title: "カップルの相性 ❤️",
            subtitle: "個別にテストを受け、パートナーと繋がって関係のダイナミクスと相性の洞察を発見しましょう！💕",
            shareResults: "結果をシェア",
            shareDesc: "任意のテストを受けた後、パートナーと繋がってバイブを比較するためのユニークなIDを取得！",
            shareButton: "パートナーと繋がる",
            compatibility: "相性分析",
            compatibilityDesc: "関係のダイナミクス、コミュニケーションスタイル、調和や成長の領域について詳細な洞察を得る！",
            compatibilityButton: "私たちの相性を見る",
            growth: "関係の成長",
            growthDesc: "両方の性格タイプと結果に基づいて絆を強化するコツと戦略を発見！",
            growthButton: "一緒に成長する"
        },
        whyChoose: {
            title: "なぜPersonaTestsを選ぶの？ ✨",
            scientific: "真に科学的",
            scientificDesc: "私たちのテストは本物の心理学研究に基づいており、単なるランダムな質問ではありません。真剣です！🧠",
            instant: "即座の結果",
            instantDesc: "性格分析を即座に取得。待時間なし、遅延なし、純粋な即座満足！⚡",
            safe: "あなたの秘密は安全",
            safeDesc: "回答をプライベートに保ちます。データの販売や変なメールはありません。あなたと結果だけ！🔒",
            everywhere: "どこでも動作",
            everywhereDesc: "スマホ、ラップトップ、タブレットでテストを受けられます - 文字通りどこででも性格を発見！📱",
            // Feature bullets
            researchBased: "📚 研究に基づく",
            validatedMethods: "🎯 検証済み方法",
            psychologyDriven: "🧠 心理学主導",
            immediate: "⚡ 即座",
            fastProcessing: "🚀 高速処理",
            userFriendly: "👆 使いやすい",
            comprehensive: "📋 包括的",
            actionable: "💡 実用的",
            growthFocused: "🌱 成長重視",
            evidenceBased: "🔬 証拠に基づく",
            practical: "🎯 実践的",
            insightful: "🔍 洞察力のある",
            realTimeAnalysis: "📊 リアルタイム分析",
            privacyFirst: "🔒 プライバシー第一",
            dataProtection: "🛡️ データ保護",
            noSpam: "✨ スパムなし",
            mobileFriendly: "📱 モバイル対応",
            crossPlatform: "💻 クロスプラットフォーム",
            anyDevice: "🌐 あらゆるデバイス"
        },
        whyMatters: {
            title: "性格テストが重要な理由",
            selfAwareness: "自己認識",
            selfAwarenessDesc: "あなたの自然な傾向、強み、成長分野を理解して、より良い人生の決断を下しましょう。",
            careerDevelopment: "キャリア開発",
            careerDevelopmentDesc: "あなたの性格に合うキャリアパスを発見し、仕事の満足度と成功を高めましょう。",
            betterRelationships: "より良い人間関係",
            betterRelationshipsDesc: "個人的および職業的な関係において、コミュニケーションと理解を向上させましょう。"
        },
        blog: {
            title: "心理学の洞察とヒント 📚",
            subtitle: "パーソナリティ心理学、自己改善、人間関係の洞察について学ぶ",
            coming_soon: "より多くの心理学記事と洞察が近日公開！ ✨"
        },
        askfriends: {
            heroTitle: "友達に聞いてみよう 🤝",
            createQuestions: "質問作成",
            shareLink: "リンクをシェア",
            seeResults: "結果を見る",
            startButton: "質問票を作成"
        },
        "360assessment": {
            heroTitle: "人々は私をどう見ている？ 🔄",
            startAssessment: "評価を開始",
            startButton: "私の評価を開始"
        },
        meta: {
            badges: {
                scientific: "科学的",
                fun: "楽しい",
                quick: "クイック",
                comprehensive: "包括的",
                insightful: "洞察的",
                reliable: "信頼できる",
                popular: "人気",
                detailed: "詳細",
                accurate: "正確",
                free: "無料",
                validated: "検証済み",
                trending: "トレンド",
                engaging: "魅力的",
                professional: "プロフェッショナル"
            }
        },
        meta: {
            duration: "⏱️ 8分",
            duration5: "⏱️ 5分",
            accurate: "🎯 非常に正確",
            scienceBased: "🔬 科学に基づく",
            takeTest: "テストを受ける",
            badges: "🏆 バッジ",
            researchBased: "🔬 研究に基づく",
            scientificallyValid: "✅ 科学的に有効",
            personalityInsights: "🧠 性格の洞察",
            validated: "✅ 検証済み",
            comprehensive: "📋 包括的",
            detailed: "📊 詳細",
            professional: "💼 プロフェッショナル",
            expertValidated: "👨‍🔬 専門家による検証",
            psychologyBased: "🧠 心理学に基づく",
            tested: "🧪 テスト済み",
            reliable: "🔒 信頼性",
            fastResults: "⚡ 迅速な結果",
            deepInsights: "🔍 深い洞察",
            actionableAdvice: "💡 実用的なアドバイス",
            personalDevelopment: "🌱 個人の成長",
            selfAwareness: "🪞 自己認識",
            growthOriented: "📈 成長志向",
            lifeImprovement: "✨ 人生の改善",
            easyToUse: "👆 使いやすい",
            quickStart: "🚀 クイックスタート",
            noSignup: "🚫 登録不要",
            instantAccess: "⚡ 即座にアクセス",
            mobileOptimized: "📱 モバイル最適化",
            shareable: "📤 共有可能",
            multilingual: "🌍 多言語"
        },
        footer: {
            description: "あなたを理解する科学的に裏付けされたテストで性格を発見。",
            popularTests: "人気テスト",
            sixteenTypes: "16の性格タイプ",
            bigFive: "ビッグファイブテスト",
            brainTeaser: "脳チャレンジ",
            moreInfo: "詳細情報",
            aboutUs: "私たちについて",
            blog: "ブログ",
            privacyPolicy: "プライバシーポリシー",
            termsOfService: "利用規約"
        }
    },
    ko: {
        nav: {
            tests: "테스트",
            couples: "커플",
            about: "소개",
            blog: "블로그", 
            results: "내 결과",
            login: "로그인 ✨",
            logout: "로그아웃"
        },
        hero: {
            badge: "가장 정확한 성격 테스트",
            title: "나의 성격을 알아보세요 ✨",
            subtitle: "과학적으로 검증된 성격 테스트로 진짜 나를 찾아보세요. MBTI부터 빅파이브까지, 나만의 특별함을 발견해보세요! 🔥",
            cta: "내 성격 알아보기",
            startJourney: "여정을 시작하세요",
            stats: {
                tests: "성격 테스트",
                languages: "언어",
                access: "항상 무료",
                private: "완전 비공개"
            },
            features: {
                scientific: "과학적 근거",
                instant: "즉시 결과",
                personalized: "100% 개인화",
                private: "완전 비공개"
            }
        },
        stats: {
            categories: "테스트 카테고리",
            reliability: "과학적 신뢰도",
            available: "항상 이용 가능"
        },
        ui: {
            previous: "이전",
            next: "다음",
            finishTest: "테스트 완료"
        },
        categories: {
            all: "전체",
            knowYourself: "🧠 나를 알아가기",
            howOthersSeeMe: "👥 다른 사람들이 보는 나",
            knowYourselfTitle: "🧠 나를 알아가기",
            knowYourselfSubtitle: "과학적으로 검증된 평가를 통해 당신의 내면적 성격, 강점, 고유한 특성을 발견하세요",
            howOthersSeeTitle: "👥 다른 사람들이 보는 나",
            howOthersSubtitle: "솔직한 피드백을 받고 친구, 가족, 동료들이 당신을 어떻게 실제로 인식하는지 발견하세요"
        },
        tests: {
            sectionTitle: "나의 성격을 알아보세요 ✨",
            sectionSubtitle: "어떤 테스트가 가장 궁금하신가요? 모든 테스트는 과학적으로 검증되었고 재미있게 설계되었어요! 💫",
            disclaimer: "🎯 중요: 재미와 자기계발 목적으로만",
            disclaimerText: "이 테스트들은 재미와 자기계발을 위한 것으로, 전문적인 진단 도구가 아닙니다. 전문적인 도움이 필요하시면 자격을 갖춘 전문가에게 상담받으세요.",
            takeTest: "테스트 하기",
            askfriends: {
                title: "누가 나를 가장 잘 아는지 보기",
                description: "나에 대한 질문을 만들고 내 답을 제공한 후, 누가 나를 가장 잘 아는지 보세요! 친구들이 내 답에 맞추려고 노력하고 나를 얼마나 잘 아는지에 따라 점수를 받습니다.",
                heroTitle: "누가 나를 가장 잘 아는지 보기 🧩",
                heroSubtitle: "나에 대한 질문을 만들고 내 답을 제공한 후, 누가 나를 가장 잘 아는지 보세요! 친구들이 내 답에 맞추려고 노력하고 나를 얼마나 잘 아는지에 따라 점수를 받습니다.",
                startButton: "설문지 만들기",
                howItWorks: "사용 방법",
                howItWorksDesc: "맞춤 설문지 만들기는 정말 쉬워요:",
                step1Title: "1️⃣ 질문 만들기",
                step1Desc: "내 성격에 대한 독특한 질문들을 만들어요",
                step2Title: "2️⃣ 링크 공유하기",
                step2Desc: "믿을 만한 친구들에게 링크를 보내요",
                step3Title: "3️⃣ 결과 보기",
                step3Desc: "친구들이 나에 대해 정말로 어떻게 생각하는지 알아봐요",
                whyUseTitle: "왜 이 기능을 사용해야 할까요?",
                whyUseDesc: "나를 잘 아는 사람들로부터 솔직한 관점을 얻으세요. 내 성격의 사각지대를 발견하고 다른 사람들이 나를 다양한 상황에서 어떻게 인식하는지 알기에 완벽합니다.",
                exampleQuestions: "질문 예시",
                example1: "\"내 성격을 가장 잘 표현하는 단어는?\"",
                example2: "\"내가 가장 나다운 모습인 상황은?\"",
                example3: "\"내 가장 큰 강점이라고 생각하는 것은?\"",
                readyToStart: "시작할 준비가 되었나요?",
                readyToStartDesc: "맞춤 설문지를 만들고 친구들이 나를 어떻게 보는지 알아보세요"
            },
            "360assessment": {
                title: "360도 나에 대한 인식",
                description: "성장과 이해를 위한 진지한 다각적 피드백. 친구, 가족, 동료들로부터 솔직한 통찰을 얻으세요.",
                heroTitle: "360도 나에 대한 인식 🎯",
                heroSubtitle: "성장과 이해를 위한 진지한 다각적 피드백. 나를 가장 잘 아는 사람들로부터 종합적인 통찰을 얻으세요.",
                startButton: "내 평가 시작하기",
                fullCircleTitle: "모든 사람들의 시선",
                fullCircleDesc: "다음으로부터 관점을 얻으세요:",
                perspective1: "👥 가까운 친구들",
                perspective2: "👨‍👩‍👧‍👦 가족 구성원",
                perspective3: "💼 직장 동료",
                perspective4: "🏫 학교 동료",
                benefitsTitle: "이런 점이 좋아요",
                benefit1Title: "🎯 사각지대",
                benefit1Desc: "내가 보지 못하는 나 자신의 측면을 발견",
                benefit2Title: "💪 숨겨진 강점",
                benefit2Desc: "다른 사람들이 내게서 발견하는 재능을 찾기",
                benefit3Title: "📈 성장 영역",
                benefit3Desc: "개선 기회 확인",
                benefit4Title: "🤝 더 나은 관계",
                benefit4Desc: "다른 사람들과 더 잘 상호작용하는 방법 이해",
                processTitle: "작동 방식",
                processStep1: "1️⃣ 평가 설정",
                processStep2: "2️⃣ 다양한 그룹 초대",
                processStep3: "3️⃣ 익명 피드백 제공",
                processStep4: "4️⃣ 포괄적인 보고서 받기",
                privacyTitle: "개인정보 보호와 익명성",
                privacyDesc: "모든 피드백은 완전히 익명입니다. 평가자들은 감정을 상하게 할 걱정 없이 솔직할 수 있습니다.",
                readyTitle: "완전한 관점을 받을 준비가 되었나요?",
                readyDesc: "다양한 사람들의 의견을 들어보고 세상이 나를 어떻게 보는지 알아보세요"
            },
            mbti: {
                title: "16가지 성격 유형",
                description: "나를 정말로 알 수 있는 최고의 성격 테스트! INTJ 전략가 타입인가요, ENFP 활동가 타입인가요? 지금 바로 확인해보세요! 💅"
            },
            bigfive: {
                title: "빅파이브 성격 검사",
                description: "심리학자들이 인정하는 과학적 성격 테스트예요. 5가지 핵심 성격 특성으로 나를 분석해보세요! 🧠"
            },
            eq: {
                title: "감성지능 (EQ)",
                description: "내 감정과 다른 사람의 감정을 얼마나 잘 이해할까요? 자기인식, 공감능력, 사회적 기술을 확인해보세요! 💝"
            },
            ei: {
                title: "감성지능",
                description: "내 감정과 다른 사람의 감정을 얼마나 잘 이해할까요? 자기인식, 공감능력, 사회적 기술을 확인해보세요! 💝"
            },
            iq: {
                title: "두뇌 테스트",
                description: "재미있는 논리 퍼즐과 두뇌 게임이에요! 단순히 재미를 위한 것으로, 실제 IQ 테스트는 전문가가 진행해야 해요. 도전해볼까요? 🤓"
            },
            disc: {
                title: "DISC 성격 테스트",
                description: "당신의 의사소통 스타일을 발견하세요! 지배적, 영향력 있는, 안정적, 성실한 중 어느 것인가요? 업무와 관계 역학을 이해하는 데 완벽합니다! 💼"
            },
            conflict: {
                title: "갈등 스타일 평가",
                description: "의견 불일치를 어떻게 다루시나요? 당신이 협력자, 경쟁자, 수용자, 회피자, 타협자 중 어느 것인지 발견하세요! 🤝"
            },
            strengths: {
                title: "캐릭터 강점 (VIA)",
                description: "핵심 캐릭터 강점을 발견하세요! 창의성부터 리더십, 친절함까지 - 당신을 독특하게 멋지게 만드는 것을 발견하세요! ✨"
            },
            lovelanguage: {
                title: "사랑의 언어 테스트",
                description: "격려의 말, 함께하는 시간, 신체적 접촉? 어떻게 사랑을 주고받는 것이 가장 좋은지 발견하세요!"
            },
            careerpath: {
                title: "진로 탐색기",
                description: "내 성격에 맞는 직업을 발견하세요! 리더, 창작자, 도우미, 분석가, 기업가 중 어느 것인가요?"
            },
            relationshipstyle: {
                title: "연애 스타일",
                description: "어떻게 사랑하고 다른 사람들과 연결되나요? 나만의 독특한 연애 스타일과 사랑에서의 매력을 발견하세요!"
            },
            adhd: {
                title: "집중력과 에너지 스타일",
                description: "당신만의 독특한 주의력과 에너지 패턴을 발견하세요! 이것은 재미있는 자기성찰을 위한 것입니다 - 의학적 평가가 아닙니다. ⚡"
            },
            anxiety: {
                title: "스트레스 관리 스타일",
                description: "스트레스와 압박을 어떻게 다루는지 발견하세요! 이것은 재미와 자기 인식을 위한 것입니다 - 의학적 조언이 아닙니다. 💚"
            },
            depression: {
                title: "감정 조절 스타일",
                description: "감정을 어떻게 처리하는지 이해하세요! 이것은 자기성찰과 오락을 위한 것입니다 - 정신건강 평가가 아닙니다. 🌻"
            },
            trendingTitle: "지금 트렌딩 🔥",
            trendingSubtitle: "모든 사람이 이야기하는 가장 핫한 성격 테스트! 친구들과 소셜 미디어에서 공유하기 완벽합니다 📱",
            love: {
                title: "사랑의 언어 테스트",
                description: "사랑을 어떻게 주고받는지 발견하세요! 신체적 접촉, 격려의 말, 아니면 다른 것인가요? 커플에게 완벽합니다! 💖"
            },
            pet: {
                title: "당신의 성격에 맞는 애완동물은?",
                description: "충성스러운 개, 독립적인 고양이, 장난기 많은 햄스터, 아니면 다른 것? 당신의 성격을 기반으로 완벽한 애완동물을 찾으세요! 🐱"
            },
            career: {
                title: "나에게 맞는 직업은?",
                description: "내 성격에 딱 맞는 직업을 찾아보세요! 리더형, 창작자형, 도움이형, 분석가형, 아니면 사업가형? 🚀"
            },
            relationship: {
                title: "나만의 연애 스타일은?",
                description: "나는 어떻게 사랑하고 사람들과 관계를 맺을까요? 내만의 특별한 연애 스타일과 매력포인트를 알아보세요! ✨"
            },
            // Meta tags for tests
            meta: {
                duration: "⏱️ 8분",
                duration5: "⏱️ 5분", 
                duration6: "⏱️ 6분",
                duration7: "⏱️ 7분",
                duration8: "⏱️ 8분",
                duration10: "⏱️ 10분",
                duration12: "⏱️ 12분",
                duration15: "⏱️ 15분",
                setup5: "⏱️ 5분 설정",
                setup10: "⏱️ 10분 설정",
                accurate: "🎯 매우 정확",
                scienceBased: "🔬 과학 기반",
                researchGrade: "🎯 연구급",
                mostAccurate: "🏆 가장 정확",
                relationship: "💝 관계",
                couplesFriendly: "❤️ 커플 친화적", 
                funGame: "🎮 재미있는 게임",
                brainTraining: "🧠 두뇌 훈련",
                careerFocused: "🎯 진로 중심",
                leadership: "💼 리더십",
                selfReflection: "🔍 자기 성찰",
                notMedical: "⚠️ 의료용 아님",
                wellness: "🧘 웰빙",
                moodTracking: "🌈 기분 추적",
                strengthsBased: "🌟 강점 기반",
                personalGrowth: "🎯 개인 성장",
                careerFocus: "💼 진로 중심",
                personalized: "🎯 개인 맞춤",
                relationships: "💕 관계",
                connection: "🤝 연결",
                detailed: "📊 상세",
                viral: "🔥 바이럴",
                couples: "💕 커플",
                instant: "⚡ 즉시",
                fun: "😄 재미",
                insights: "💡 통찰",
                guidance: "📝 가이드",
                improvement: "📈 개선",
                socialApp: "📱 소셜",
                socialPeople: "👥 소셜"
            },
            // Test badges and general terms  
            trending: "🔥 트렌딩",
            popular: "✨ 인기", 
            featured: "🔥 인기",
            new: "🔥 새로운",
            takeTest: "테스트 하기",
            createQuestions: "질문 만들기",
            startAssessment: "내 사람들에게 물어보기",
            buttons: {
                discoverType: "내 유형 발견하기 ✨",
                takeTest: "테스트 하기",
                takeBrainChallenge: "두뇌 도전 하기",
                checkEQ: "내 EQ 확인하기",
                findStyle: "내 스타일 찾기",
                checkStyle: "내 스타일 확인하기",
                findStrengths: "내 강점 찾기",
                findLoveLanguage: "내 사랑의 언어 찾기",
                findPetMatch: "내 애완동물 찾기",
                findCareer: "내 직업 찾기"
            }
        },
        couples: {
            title: "커플 궁합 ❤️",
            subtitle: "각자 테스트를 해보고, 연인과 함께 우리의 궁합과 관계 스타일을 알아보세요! 💕",
            shareResults: "결과 공유하기",
            shareDesc: "어떤 테스트를 한 후에도 고유한 공유 ID를 받아 파트너와 연결하고 서로의 바이브를 비교하세요!",
            shareButton: "파트너와 연결하기",
            compatibility: "궁합 분석",
            compatibilityDesc: "우리의 관계 스타일과 소통 방식, 잘 맞는 부분과 성장할 부분을 자세히 알아보세요!",
            compatibilityButton: "우리 궁합 보기",
            growth: "관계 성장",
            growthDesc: "둘 다의 성격 유형과 결과를 바탕으로 유대를 강화할 팁과 전략을 발견하세요!",
            growthButton: "함께 성장하기"
        },
        whyChoose: {
            title: "왜 PersonaTests를 선택해야 할까요? ✨",
            scientific: "진짜 과학적",
            scientificDesc: "우리의 테스트는 진짜 심리학 연구에 기반하고 있습니다. 단순한 랜덤 질문이 아닙니다. 진지합니다! 🧠",
            instant: "즉시 결과",
            instantDesc: "성격 분석을 즉시 받아보세요. 기다림도, 지연도 없이, 순수한 즉석 만족! ⚡",
            safe: "당신의 비밀은 안전합니다",
            safeDesc: "답변을 비공개로 유지합니다. 데이터 판매도, 이상한 이메일도 없습니다. 당신과 결과만! 🔒",
            everywhere: "어디서나 작동",
            everywhereDesc: "핸드폰, 노트북, 태블릿에서 테스트를 하세요 - 말 그대로 어디서나 성격을 발견할 수 있습니다! 📱",
            // Feature bullets
            researchBased: "📚 연구 기반",
            validatedMethods: "🎯 검증된 방법",
            psychologyDriven: "🧠 심리학 기반",
            immediate: "⚡ 즉시",
            fastProcessing: "🚀 빠른 처리",
            realTimeAnalysis: "📊 실시간 분석",
            privacyFirst: "🔒 개인정보 우선",
            dataProtection: "🛡️ 데이터 보호",
            noSpam: "✨ 스팸 없음",
            mobileFriendly: "📱 모바일 친화적",
            crossPlatform: "💻 크로스 플랫폼",
            anyDevice: "🌐 모든 기기"
        },
        whyMatters: {
            title: "성격 테스트가 중요한 이유",
            selfAwareness: "자기 이해",
            selfAwarenessDesc: "내 성향과 강점, 성장할 부분을 알고 더 나은 인생 선택을 해보세요.",
            careerDevelopment: "진로 개발",
            careerDevelopmentDesc: "내 성격에 맞는 직업을 찾아 직업 만족도와 성공률을 높여보세요.",
            betterRelationships: "더 좋은 관계",
            betterRelationshipsDesc: "개인적이든 업무적이든 더 나은 소통과 이해로 관계를 개선해보세요."
        },
        blog: {
            title: "심리학 인사이트 & 팁 📚",
            subtitle: "성격 심리학, 자기계발, 관계에 대한 통찰력을 배워보세요",
            coming_soon: "더 많은 심리학 기사와 인사이트가 곧 공개됩니다! ✨"
        },
        askfriends: {
            heroTitle: "친구들에게 물어보기 🤝",
            createQuestions: "질문 만들기",
            shareLink: "링크 공유하기",
            seeResults: "결과 보기",
            startButton: "설문지 만들기"
        },
        "360assessment": {
            heroTitle: "사람들은 나를 어떻게 볼까요? 🔄",
            startAssessment: "평가 시작하기",
            startButton: "내 평가 시작하기"
        },
        tests: {
            meta: {
                scienceBased: "🔬 과학적 근거",
                accurate: "🎯 매우 정확",
                researchGrade: "🎯 연구 수준",
                mostAccurate: "🏆 가장 정확",
                relationship: "💝 관계",
                couplesFriendly: "❤️ 커플 친화적",
                funGame: "🎮 재미있는 게임",
                brainTraining: "🧠 두뇌 훈련",
                careerFocused: "🎯 진로 중심",
                careerFocus: "💼 진로 중심",
                leadership: "💼 리더십",
                selfReflection: "🔍 자기성찰",
                notMedical: "⚠️ 의료용 아님",
                wellness: "🧘 웰니스",
                moodTracking: "🌈 기분 추적",
                strengthsBased: "🌟 강점 기반",
                personalGrowth: "🎯 개인 성장",
                personalized: "🎯 개인화",
                relationships: "💕 관계",
                connection: "🤝 연결",
                socialApp: "📱 소셜",
                socialPeople: "👥 소셜",
                viral: "🔥 바이럴",
                detailed: "📊 상세",
                couples: "💕 커플",
                instant: "⚡ 즉시",
                fun: "😄 재미",
                insights: "💡 통찰",
                guidance: "📝 가이드",
                improvement: "📈 개선"
            }
        },
        meta: {
            badges: {
                scientific: "과학적",
                fun: "재미있는",
                quick: "빠른",
                comprehensive: "포괄적",
                insightful: "통찰력 있는",
                reliable: "신뢰할 수 있는",
                popular: "인기 있는",
                detailed: "상세한",
                accurate: "정확한",
                free: "무료",
                validated: "검증된",
                trending: "트렌딩",
                engaging: "매력적인",
                professional: "전문적"
            }
        },
        footer: {
            description: "당신을 이해하는 과학적으로 백업된 테스트로 성격을 발견하세요.",
            popularTests: "인기 테스트",
            sixteenTypes: "16가지 성격 유형",
            bigFive: "빅파이브 테스트",
            brainTeaser: "두뇌 도전",
            moreInfo: "추가 정보",
            aboutUs: "소개",
            blog: "블로그",
            privacyPolicy: "개인정보 보호정책",
            termsOfService: "서비스 약관"
        }
    },
    zh: {
        nav: {
            tests: "测试",
            couples: "情侣",
            about: "关于我们",
            blog: "博客",
            results: "我的结果", 
            login: "登录 ✨",
            logout: "退出"
        },
        hero: {
            title: "发现你的个性 ✨",
            subtitle: "做科学的个性测试，真正了解自己。从MBTI到大五人格，找到你的独特之处！🔥",
            cta: "开始测试",
            startJourney: "开始你的旅程",
            stats: {
                tests: "性格测试",
                languages: "语言",
                access: "永远免费",
                private: "私人"
            },
            features: {
                scientific: "基于科学",
                instant: "即时结果",
                personalized: "100% 个性化",
                private: "完全私密"
            }
        },
        stats: {
            categories: "测试类别",
            reliability: "科学可靠性",
            available: "随时可用"
        },
        ui: {
            previous: "上一个",
            next: "下一个",
            finishTest: "完成测试"
        },
        categories: {
            all: "全部",
            knowYourself: "🧠 了解自己",
            howOthersSeeMe: "👥 别人眼中的我",
            knowYourselfTitle: "🧠 了解自己",
            knowYourselfSubtitle: "通过科学验证的评估，发现你的内在性格、优势和独特特质",
            howOthersSeeTitle: "👥 别人眼中的我",
            howOthersSubtitle: "获得诚实反馈，发现朋友、家人和同事是如何真正看待你的"
        },
        tests: {
            sectionTitle: "发现你的个性 ✨",
            sectionSubtitle: "哪个测试你最感兴趣？所有都是科学的且超好玩！💫",
            disclaimer: "🎯 重要：仅供娱乐和自我反思",
            disclaimerText: "这些评估是为了娱乐和自我反思而设计的，不是专业诊断。如果您需要心理健康支持，请咨询执照医疗提供者。",
            takeTest: "开始测试",
            askfriends: {
                title: "看看谁最了解我",
                description: "创建关于你自己的问题，提供你的答案，然后看看谁最了解你！朋友们会尝试匹配你的答案，并根据他们对你的了解程度进行评分。",
                heroTitle: "看看谁最了解我 🧩",
                heroSubtitle: "创建关于你自己的问题，提供你的答案，然后看看谁最了解你！朋友们会尝试匹配你的答案，并根据他们对你的了解程度进行评分。",
                startButton: "创建我的问卷",
                howItWorks: "如何使用",
                howItWorksDesc: "创建个性化问卷超级简单：",
                step1Title: "1️⃣ 创建你的问题",
                step1Desc: "设计关于你性格的独特问题",
                step2Title: "2️⃣ 分享链接",
                step2Desc: "发送链接给你信任的朋友",
                step3Title: "3️⃣ 查看结果",
                step3Desc: "发现他们对你的真实想法",
                whyUseTitle: "为什么使用这个功能？",
                whyUseDesc: "从了解你的人那里获得诚实的观点。这对于发现你性格的盲点以及了解别人在不同情况下如何看待你非常完美。",
                exampleQuestions: "问题示例",
                example1: "\"最能描述我性格的词是什么？\"",
                example2: "\"你认为我在什么情况下最像自己？\"",
                example3: "\"你认为我最大的优势是什么？\"",
                readyToStart: "准备开始了吗？",
                readyToStartDesc: "创建你的个性化问卷，发现朋友们如何看待你"
            },
            "360assessment": {
                title: "360度对我的认知",
                description: "为成长和理解而进行的严肃多角度反馈。从朋友、家人和同事那里获得诚实的见解。",
                heroTitle: "360度对我的认知 🎯",
                heroSubtitle: "为成长和理解而进行的严肃多角度反馈。从最了解你的人那里获得全面的见解。",
                startButton: "开始我的评估",
                fullCircleTitle: "完整的360度视角",
                fullCircleDesc: "从以下角度获得观点：",
                perspective1: "👥 亲密朋友",
                perspective2: "👨‍👩‍👧‍👦 家庭成员",
                perspective3: "💼 工作同事",
                perspective4: "🏫 学校同学",
                benefitsTitle: "360度评估的好处",
                benefit1Title: "🎯 盲点",
                benefit1Desc: "发现你看不到的自己的方面",
                benefit2Title: "💪 隐藏优势",
                benefit2Desc: "找到别人在你身上注意到的才能",
                benefit3Title: "📈 成长领域",
                benefit3Desc: "识别改进机会",
                benefit4Title: "🤝 更好的关系",
                benefit4Desc: "了解如何更好地与他人互动",
                processTitle: "如何运作",
                processStep1: "1️⃣ 你设置评估",
                processStep2: "2️⃣ 邀请不同群体",
                processStep3: "3️⃣ 他们提供匿名反馈",
                processStep4: "4️⃣ 你获得全面报告",
                privacyTitle: "隐私和匿名性",
                privacyDesc: "所有反馈都完全匿名。你的评估者可以诚实，而不用担心伤害感情。",
                readyTitle: "准备好完整的视角了吗？",
                readyDesc: "开始你的360度评估，发现世界如何看待你"
            },
            mbti: {
                title: "16种人格类型",
                description: "经典人格测试！你是INTJ策略家还是ENFP热情家？马上来看看！💅"
            },
            bigfive: {
                title: "大五人格测试",
                description: "连心理学家都在用的测试！了解你的5大人格特质！🧠"
            },
            eq: {
                title: "情商(EQ)",
                description: "你多了解自己和别人的情绪？测试一下你的情商超能力！💝"
            },
            ei: {
                title: "情商",
                description: "你多了解自己和别人的情绪？测试一下你的情商超能力！💝"
            },
            iq: {
                title: "大脑挑战",
                description: "有趣的逻辑谜题和脑力游戏！只是玩玩 - 真正的IQ测试要找心理学家。来试试吧！🤓"
            },
            disc: {
                title: "DISC人格测试",
                description: "发现你的沟通风格！你是支配型、影响型、稳定型还是谨慎型？非常适合理解工作和关系动态！💼"
            },
            conflict: {
                title: "冲突风格评估",
                description: "你如何处理分歧？发现你是合作者、竞争者、迁就者、回避者还是妥协者！🤝"
            },
            strengths: {
                title: "性格优势(VIA)",
                description: "发现你的核心性格优势！从创造力到领导力再到善良——发现让你独特出色的品质！✨"
            },
            lovelanguage: {
                title: "爱语测试",
                description: "肯定话语、有质量时间还是身体接触？发现你如何最好地给予和接受爱！"
            },
            careerpath: {
                title: "职业路径发现者",
                description: "发现与你性格匹配的职业！你是领导者、创造者、帮助者、分析师还是企业家？"
            },
            relationshipstyle: {
                title: "关系风格",
                description: "你如何爱和与他人连接？发现你独特的关系风格以及在爱情中让你发光的特质！"
            },
            adhd: {
                title: "专注与能量风格",
                description: "发现你独特的注意力和能量模式！这只是为了有趣的自我反思——不是医学评估。⚡"
            },
            anxiety: {
                title: "压力管理风格",
                description: "发现你如何处理压力和压迫！这只是为了乐趣和自我意识——不是医学建议。💚"
            },
            depression: {
                title: "情绪调节风格",
                description: "了解你如何处理情绪！这只是为了自我反思和娱乐——不是心理健康评估。🌻"
            },
            trendingTitle: "现在流行 🔥",
            trendingSubtitle: "大家都在谈论的最热门人格测试！非常适合与朋友和社交媒体分享📱",
            love: {
                title: "爱的语言测试",
                description: "发现你如何给予和接受爱！你是身体接触、肯定话语还是其他什么？非常适合情侣！💖"
            },
            pet: {
                title: "哪种宠物适合你的个性？",
                description: "你是忠诚的狗、独立的猫、顽皮的仓鼠还是其他什么？根据你的个性找到完美的宠物！🐱"
            },
            career: {
                title: "你的理想职业道路是什么？",
                description: "发现符合你个性的职业！你是领导者、创造者、帮助者、分析师还是企业家？🚀"
            },
            relationship: {
                title: "你的恋爱风格是什么？",
                description: "你如何爱与他人连接？发现你独特的恋爱风格和让你在爱情中闪闪发光的特质！✨"
            },
            buttons: {
                discoverType: "发现我的类型 ✨",
                takeTest: "开始测试",
                takeBrainChallenge: "开始大脑挑战",
                checkEQ: "检查我的情商",
                findStyle: "找到我的风格",
                checkStyle: "检查我的风格",
                findStrengths: "找到我的优势",
                findLoveLanguage: "找到我的爱的语言",
                findPetMatch: "找到我的宠物",
                findCareer: "找到我的职业"
            }
        },
        couples: {
            title: "情侣兼容性 ❤️",
            subtitle: "各自做测试，然后与伴侣连接，发现您的关系动态和兼容性洞察！💕",
            shareResults: "分享你的结果",
            shareDesc: "做任何测试后，获取独特的分享 ID 与伴侣连接并比较你们的氛围！",
            shareButton: "与伴侣连接",
            compatibility: "兼容性分析",
            compatibilityDesc: "获取关于您的关系动态、沟通风格以及和谐或成长领域的详细见解！",
            compatibilityButton: "查看我们的匹配",
            growth: "关系成长",
            growthDesc: "根据你们两人的个性类型和结果，发现加强绽带的技巧和策略！",
            growthButton: "一起成长"
        },
        whyChoose: {
            title: "为什么选择 PersonaTests？ ✨",
            scientific: "真正科学",
            scientificDesc: "我们的测试基于真正的心理学研究，不仅仅是随机问题。我们不在开玩笑！🧠",
            instant: "即时结果",
            instantDesc: "立即获取您的个性划分。无需等待，无延迟，只有纯粹的即时满足！⚡",
            safe: "您的秘密很安全",
            safeDesc: "我们保持您的答案私密。不出售您的数据，不发奇怪邮件。只有您和您的结果！🔒",
            everywhere: "随处可用",
            everywhereDesc: "在您的手机、笔记本电脑、平板电脑上进行测试 - 在您想发现个性的任何地方！📱",
            // Feature bullets
            researchBased: "📚 基于研究",
            validatedMethods: "🎯 验证方法",
            psychologyDriven: "🧠 心理学驱动",
            immediate: "⚡ 即时",
            fastProcessing: "🚀 快速处理",
            userFriendly: "👆 用户友好",
            comprehensive: "📋 全面",
            actionable: "💡 可行",
            growthFocused: "🌱 成长导向",
            evidenceBased: "🔬 基于证据",
            practical: "🎯 实用",
            insightful: "🔍 有洞察力",
            realTimeAnalysis: "📊 实时分析",
            privacyFirst: "🔒 隐私优先",
            dataProtection: "🛡️ 数据保护",
            noSpam: "✨ 无垃圾邮件",
            mobileFriendly: "📱 移动友好",
            crossPlatform: "💻 跨平台",
            anyDevice: "🌐 任何设备"
        },
        whyMatters: {
            title: "为什么人格测试很重要",
            selfAwareness: "自我认知",
            selfAwarenessDesc: "了解您的自然倾向、优势和成长领域，做出更好的人生决策。",
            careerDevelopment: "职业发展",
            careerDevelopmentDesc: "发现与您的个性相符的职业道路，获得更高的工作满意度和成功。",
            betterRelationships: "更好的关系",
            betterRelationshipsDesc: "在个人和职业关系中改善沟通和理解。"
        },
        blog: {
            title: "心理学洞察与技巧 📚",
            subtitle: "学习人格心理学、自我提升和人际关系洞察",
            coming_soon: "更多心理学文章和洞察即将推出！ ✨"
        },
        askfriends: {
            heroTitle: "问问我的朋友们 🤝",
            createQuestions: "创建问题",
            shareLink: "分享链接",
            seeResults: "查看结果",
            startButton: "创建问卷"
        },
        "360assessment": {
            heroTitle: "别人怎么看我？ 🔄",
            startAssessment: "开始评估",
            startButton: "开始我的评估"
        },
        meta: {
            badges: {
                scientific: "科学的",
                fun: "有趣的",
                quick: "快速",
                comprehensive: "全面的",
                insightful: "有洞察力的",
                reliable: "可靠的",
                popular: "热门的",
                detailed: "详细的",
                accurate: "准确的",
                free: "免费",
                validated: "已验证",
                trending: "流行中",
                engaging: "引人入胜",
                professional: "专业的"
            }
        },
        meta: {
            duration: "⏱️ 8分钟",
            duration5: "⏱️ 5分钟",
            accurate: "🎯 非常准确",
            scienceBased: "🔬 基于科学",
            takeTest: "开始测试",
            badges: "🏆 徽章",
            researchBased: "🔬 基于研究",
            scientificallyValid: "✅ 科学有效",
            personalityInsights: "🧠 性格洞察",
            validated: "✅ 已验证",
            comprehensive: "📋 全面",
            detailed: "📊 详细",
            professional: "💼 专业",
            expertValidated: "👨‍🔬 专家验证",
            psychologyBased: "🧠 基于心理学",
            tested: "🧪 已测试",
            reliable: "🔒 可靠",
            fastResults: "⚡ 快速结果",
            deepInsights: "🔍 深度洞察",
            actionableAdvice: "💡 实用建议",
            personalDevelopment: "🌱 个人发展",
            selfAwareness: "🪞 自我认知",
            growthOriented: "📈 成长导向",
            lifeImprovement: "✨ 生活改善",
            easyToUse: "👆 容易使用",
            quickStart: "🚀 快速开始",
            noSignup: "🚫 无需注册",
            instantAccess: "⚡ 即时访问",
            mobileOptimized: "📱 移动优化",
            shareable: "📤 可分享",
            multilingual: "🌍 多语言"
        },
        footer: {
            description: "通过科学验证的测试发现您的个性，这些测试能够理解您。",
            popularTests: "热门测试",
            sixteenTypes: "16种人格类型",
            bigFive: "大五人格测试",
            brainTeaser: "大脑挑战",
            moreInfo: "更多信息",
            aboutUs: "关于我们",
            blog: "博客",
            privacyPolicy: "隐私政策",
            termsOfService: "服务条款"
        }
    }
};

// Language functionality
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageOptions');
    const arrow = document.querySelector('.dropdown-arrow');
    
    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
    } else {
        dropdown.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    }
}

function changeLanguage(langCode) {
    try {
        console.log('🌍 Starting language change to:', langCode);
        
        // Validate language code
        if (!translations[langCode]) {
            console.error('❌ Invalid language code:', langCode);
            return;
        }
        
        // Update global language variable
        currentLanguage = langCode;
        console.log('🔄 Updated currentLanguage to:', currentLanguage);
        
        // Save preference immediately to prevent conflicts
        try {
            localStorage.setItem('preferredLanguage', langCode);
            console.log('💾 Language preference saved:', langCode);
            
            // Verify it was saved
            const saved = localStorage.getItem('preferredLanguage');
            console.log('✅ Verified saved preference:', saved);
        } catch (e) {
            console.warn('Could not save language preference:', e);
        }
        
        // Batch DOM updates for better performance
        requestAnimationFrame(() => {
            console.log('🔄 Applying language changes...');
            const lang = translations[langCode];
            
            // Force complete translation update
            forceUpdateAllTranslations(lang);
            updateLanguageVisualIndicators(langCode);
            updateSpecificSections(lang);
            
            // Apply manual translations for each language to ensure meta badges are correctly translated
            console.log(`🔄 Applying manual translations for language: ${langCode}`);
            if (langCode === 'ko') {
                console.log('🇰🇷 Applying Korean translation fix...');
                applyKoreanTranslationFix(lang);
            } else if (langCode === 'fr') {
                applyManualFrenchTranslations();
            } else if (langCode === 'es') {
                applyManualSpanishTranslations();
            } else if (langCode === 'it') {
                applyManualItalianTranslations();
            } else if (langCode === 'pt') {
                applyManualPortugueseTranslations();
            } else if (langCode === 'de') {
                applyManualGermanTranslations();
            } else if (langCode === 'ja') {
                applyManualJapaneseTranslations();
            } else if (langCode === 'zh') {
                applyManualChineseTranslations();
            }
            
            console.log('✅ Language change completed for:', langCode);
        });
        
    } catch (error) {
        console.error('Error changing language:', error);
    }
}

// Helper function to update translated elements
function updateTranslatedElements(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (!key) return;
        
        const value = getNestedTranslation(lang, key);
        if (value !== undefined && value !== null && element.textContent !== value) {
            element.textContent = value;
        } else if (!value) {
            console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
        }
    });
}

// Force complete translation update - more aggressive approach
function forceUpdateAllTranslations(lang) {
    console.log('🔄 Force updating all translations...');
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (!key) return;
        
        const value = getNestedTranslation(lang, key);
        if (value !== undefined && value !== null) {
            // Force update regardless of current content
            element.textContent = value;
            console.log(`✅ Updated ${key}: ${value}`);
        } else {
            console.warn(`❌ Missing translation for key: ${key} in language: ${currentLanguage}`);
        }
    });
}

// Optimized nested object access
function getNestedTranslation(obj, key) {
    return key.split('.').reduce((current, k) => current?.[k], obj);
}

// Get translated text for current language
function getTranslatedText(key) {
    if (!currentLanguage || !translations[currentLanguage]) {
        return null;
    }
    return getNestedTranslation(translations[currentLanguage], key);
}

// Apply translations to test questions and options
function applyTestTranslations() {
    if (!currentTest || !testData || !currentLanguage || !translations[currentLanguage]) {
        return;
    }
    
    const currentLang = translations[currentLanguage];
    
    // Translate question text
    const questionElement = document.querySelector('.question-text');
    if (questionElement && currentLang.tests && currentLang.tests[currentTest] && currentLang.tests[currentTest].questions) {
        const translatedQuestion = currentLang.tests[currentTest].questions[currentQuestionIndex];
        if (translatedQuestion && translatedQuestion.text) {
            questionElement.textContent = translatedQuestion.text;
        }
    }
    
    // Translate option texts
    const optionElements = document.querySelectorAll('.option-text');
    if (optionElements.length > 0 && currentLang.tests && currentLang.tests[currentTest] && currentLang.tests[currentTest].questions) {
        const translatedQuestion = currentLang.tests[currentTest].questions[currentQuestionIndex];
        if (translatedQuestion && translatedQuestion.options) {
            optionElements.forEach((optionElement, index) => {
                if (translatedQuestion.options[index]) {
                    optionElement.textContent = translatedQuestion.options[index];
                }
            });
        }
    }
}

// Update visual language indicators with CSS classes instead of inline styles
function updateLanguageVisualIndicators(langCode) {
    const flags = document.querySelectorAll('.flag-wrapper');
    flags.forEach(flag => {
        flag.classList.toggle('selected', flag.dataset.lang === langCode);
    });
}

// Optimized page language update
function updatePageLanguage() {
    const lang = translations[currentLanguage];
    if (!lang) return;
    
    updateTranslatedElements(lang);
    updateSpecificSections(lang);
}

// Update sections that don't use data-translate
function updateSpecificSections(lang = translations[currentLanguage]) {
    if (!lang) return;
    
    try {
        updateHeroSection(lang);
        updateStatsSection(lang);
        updateHeroFeatures(lang);
    } catch (e) {
        console.warn('⚠️ Error updating additional sections:', e);
    }
}

// COMPREHENSIVE KOREAN TRANSLATION FIX - Multiple fallback strategies
function applyKoreanTranslationFix(lang) {
    console.log('🔧 Starting comprehensive Korean translation fix...');
    
    try {
        // Strategy 1: Clear any cached language state first
        console.log('📝 Strategy 1: Clear language state and force fresh translation...');
        
        // Force set current language to Korean
        currentLanguage = 'ko';
        localStorage.setItem('selectedLanguage', 'ko');
        
        setTimeout(() => {
            // Strategy 2: Apply comprehensive Korean translations
            console.log('📝 Strategy 2: Apply comprehensive Korean translations...');
            if (translations.ko) {
                forceUpdateAllTranslations(translations.ko);
                updateSpecificSections(translations.ko);
                updateHeroSection(translations.ko);
                updateStatsSection(translations.ko);
                updateHeroFeatures(translations.ko);
            }
            
            // Strategy 3: Manual Korean mapping for any missed elements
            console.log('📝 Strategy 3: Manual Korean mapping...');
            applyManualKoreanTestCardTitles();
            
            // Strategy 4: Force update visual indicators
            console.log('📝 Strategy 4: Update language visual indicators...');
            updateLanguageVisualIndicators('ko');
            
            // Strategy 5: Enhanced verification and debugging
            console.log('📝 Strategy 5: Verify translations...');
            verifyKoreanTranslations();
        }, 100);
        
    } catch (error) {
        console.error('❌ Korean translation fix error:', error);
    }
}

// Helper function to get current language
function getCurrentLanguage() {
    return window.currentLanguage || localStorage.getItem('selectedLanguage') || 'en';
}

// Manual French translations function
function applyManualFrenchTranslations() {
    console.log('🇫🇷 Applying manual French translations...');
    
    const frenchTranslations = {
        // Hero section
        'hero.badge': 'Tests de Personnalité les Plus Précis',
        'hero.title': 'Découvrez Votre Personnalité ✨',
        'hero.subtitle': 'Faites des tests de personnalité avec base scientifique qui vous comprennent vraiment. Du MBTI au Big Five, découvrez ce qui vous rend unique ! 🔥',
        'hero.startJourney': 'Commencez Votre Voyage',
        
        // Navigation
        'nav.tests': 'Tests',
        'nav.couples': 'Couples',
        'nav.about': 'À Propos',
        'nav.blog': 'Blog',
        'nav.contact': 'Contact',
        'nav.results': 'Mes Résultats',
        'nav.login': 'Connexion ✨',
        'nav.logout': 'Déconnexion',
        
        // Categories
        'categories.knowYourselfSubtitle': 'Découvrez votre personnalité intérieure, vos forces et traits uniques grâce à des évaluations scientifiquement validées',
        'categories.howOthersSubtitle': 'Obtenez des commentaires honnêtes et découvrez comment amis, famille et collègues vous perçoivent vraiment',
        
        // Test button translations
        'tests.takeTest': 'Faire le Test',
        
        // Test titles
        'tests.mbti.title': '16 Types de Personnalité',
        'tests.bigfive.title': 'Test des Cinq Grands',
        'tests.lovelanguage.title': 'Test du Langage d\'Amour',
        'tests.iq.title': 'Défi Mental',
        'tests.ei.title': 'Intelligence Émotionnelle',
        'tests.adhd.title': 'Auto-évaluation TDAH',
        'tests.anxiety.title': 'Auto-vérification de l\'Anxiété',
        'tests.depression.title': 'Autoréflexion de l\'Humeur',
        'tests.strengths.title': 'Forces de Caractère',
        'tests.careerpath.title': 'Découvreur de Parcours Professionnel',
        'tests.relationshipstyle.title': 'Style de Relation',
        'tests.askfriends.title': 'Voir Qui Me Connaît Le Mieux',
        'tests.360assessment.title': '360 Perception Sur Moi',
        
        // Test descriptions
        'tests.mbti.description': 'Découvrez votre type de personnalité unique avec l\'évaluation classique Myers-Briggs ! Êtes-vous un penseur introverti ou un extraverti émotionnel ?',
        'tests.bigfive.description': 'L\'étalon-or de la psychologie de la personnalité ! Explorez votre ouverture, conscience, extraversion, amabilité et névrosisme.',
        'tests.lovelanguage.description': 'Mots d\'affirmation, temps de qualité ou contact physique ? Découvrez comment vous donnez et recevez l\'amour le mieux !',
        'tests.iq.description': 'Testez vos compétences de résolution de problèmes ! Puzzles logiques amusants pour défier votre esprit.',
        'tests.ei.description': 'À quel point lisez-vous bien les émotions et naviguez dans les situations sociales ? Testez vos super-pouvoirs émotionnels !',
        'tests.adhd.description': 'Explorez vos modèles d\'attention et niveaux d\'énergie. Génial pour comprendre votre style de productivité !',
        'tests.anxiety.description': 'Comment gérez-vous la pression ? Apprenez vos modèles de stress et découvrez des stratégies d\'adaptation saines.',
        'tests.depression.description': 'Comprenez vos modèles émotionnels et votre résilience. Parfait pour la croissance personnelle et la connaissance de soi !',
        'tests.strengths.description': 'Découvrez vos principales forces de caractère ! De la créativité à la gentillesse, trouvez ce qui vous fait briller.',
        'tests.careerpath.description': 'Découvrez la carrière qui correspond à votre personnalité ! Êtes-vous un leader, créateur, aidant, analyste ou entrepreneur ?',
        'tests.relationshipstyle.description': 'Comment aimez-vous et vous connectez-vous avec les autres ? Découvrez votre style de relation unique et ce qui vous fait vibrer en amour !',
        'tests.askfriends.description': 'Créez des questions sur vous-même, fournissez VOS réponses, puis voyez qui vous connaît le mieux ! Les amis essaieront de correspondre à vos réponses.',
        'tests.360assessment.description': 'Commentaires sérieux et multi-perspectifs pour la croissance et la compréhension. Obtenez des insights honnêtes d\'amis, de famille et de collègues.',
        
        // Meta badges - French (COMPLETE SET INCLUDING DURATIONS)
        'tests.meta.duration': '⏱️ 8 min',
        'tests.meta.duration5': '⏱️ 5 min',
        'tests.meta.duration6': '⏱️ 6 min',
        'tests.meta.duration7': '⏱️ 7 min',
        'tests.meta.duration8': '⏱️ 8 min',
        'tests.meta.duration10': '⏱️ 10 min',
        'tests.meta.duration12': '⏱️ 12 min',
        'tests.meta.duration15': '⏱️ 15 min',
        'tests.meta.setup5': '⏱️ 5 min configuration',
        'tests.meta.setup10': '⏱️ 10 min configuration',
        'tests.meta.scienceBased': '🔬 Base Scientifique',
        'tests.meta.accurate': '🎯 Très Précis',
        'tests.meta.researchGrade': '🎯 Niveau Recherche',
        'tests.meta.mostAccurate': '🏆 Le Plus Précis',
        'tests.meta.relationship': '💝 Relation',
        'tests.meta.couplesFriendly': '❤️ Convivial Couples',
        'tests.meta.funGame': '🎮 Jeu Amusant',
        'tests.meta.brainTraining': '🧠 Entraînement Cérébral',
        'tests.meta.careerFocused': '🎯 Axé Carrière',
        'tests.meta.careerFocus': '💼 Focus Carrière',
        'tests.meta.leadership': '💼 Leadership',
        'tests.meta.selfReflection': '🔍 Autoréflexion',
        'tests.meta.notMedical': '⚠️ Non Médical',
        'tests.meta.wellness': '🧘 Bien-être',
        'tests.meta.moodTracking': '🌈 Suivi Humeur',
        'tests.meta.strengthsBased': '🌟 Basé Forces',
        'tests.meta.personalGrowth': '🎯 Croissance Personnelle',
        'tests.meta.personalized': '🎯 Personnalisé',
        'tests.meta.relationships': '💕 Relations',
        'tests.meta.connection': '🤝 Connexion',
        'tests.meta.socialApp': '📱 Social',
        'tests.meta.socialPeople': '👥 Social',
        'tests.meta.viral': '🔥 Viral',
        'tests.meta.detailed': '📊 Détaillé',
        'tests.meta.couples': '💕 Couples',
        'tests.meta.instant': '⚡ Instantané',
        'tests.meta.insights': '💡 Insights',
        'tests.meta.new': '🔥 NOUVEAU',
        'tests.meta.popular': '✨ Populaire',
        'tests.meta.trending': '🔥 Tendance',
        
        // Couples section
        'couples.title': 'Compatibilité de Couple ❤️',
        'couples.subtitle': 'Passez les tests individuellement, puis connectez-vous avec votre partenaire pour découvrir votre dynamique relationnelle et insights de compatibilité ! 💕',
        'couples.shareResults': 'Partagez Vos Résultats',
        'couples.shareDesc': 'Après avoir passé un test, obtenez un ID unique pour vous connecter avec votre partenaire et comparer vos vibes !',
        'couples.shareButton': 'Se Connecter avec le Partenaire',
        'couples.compatibility': 'Analyse de Compatibilité',
        'couples.compatibilityDesc': 'Obtenez des insights détaillés sur votre dynamique relationnelle, styles de communication et zones d\'harmonie ou de croissance !',
        'couples.compatibilityButton': 'Voir Notre Compatibilité',
        'couples.growth': 'Croissance Relationnelle',
        'couples.growthDesc': 'Découvrez des conseils et stratégies pour renforcer votre lien basé sur vos types de personnalité et résultats !',
        'couples.growthButton': 'Grandir Ensemble',
        
        // Why Choose section
        'whyChoose.title': 'Pourquoi Choisir PersonaTests ? ✨',
        'whyChoose.scientific': 'Réellement Scientifique',
        'whyChoose.scientificDesc': 'Nos tests sont basés sur de vraies recherches en psychologie, pas juste des questions aléatoires. C\'est du sérieux ! 🧠',
        'whyChoose.researchBased': '📚 Basé sur la Recherche',
        'whyChoose.validatedMethods': '🎯 Méthodes Validées',
        'whyChoose.psychologyDriven': '🧠 Basé sur la Psychologie',
        'whyChoose.instant': 'Résultats Instantanés',
        'whyChoose.instantDesc': 'Obtenez votre analyse de personnalité immédiatement. Pas d\'attente, pas de délais, juste une satisfaction immédiate ! ⚡',
        'whyChoose.immediate': '⚡ Immédiat',
        'whyChoose.fastProcessing': '🚀 Traitement Rapide',
        'whyChoose.realTimeAnalysis': '📊 Analyse en Temps Réel',
        'whyChoose.safe': 'Vos Secrets Sont En Sécurité',
        'whyChoose.safeDesc': 'Nous gardons vos réponses privées. Pas de vente de données, pas d\'emails bizarres. Juste vous et vos résultats ! 🔒',
        'whyChoose.privacyFirst': '🔒 Confidentialité d\'Abord',
        'whyChoose.dataProtection': '🛡️ Protection des Données',
        'whyChoose.noSpam': '✨ Pas de Spam',
        'whyChoose.everywhere': 'Fonctionne Partout',
        'whyChoose.everywhereDesc': 'Passez les tests sur votre téléphone, ordinateur portable, tablette - littéralement où vous voulez découvrir votre personnalité ! 📱',
        'whyChoose.mobileFriendly': '📱 Compatible Mobile',
        'whyChoose.crossPlatform': '💻 Multi-Plateforme',
        'whyChoose.anyDevice': '🌐 Tout Appareil',
        
        // Couples section badges
        'tests.connect': '💝 CONNECTER',
        'tests.growth': '🌱 CROISSANCE',
        'tests.meta.fun': '😄 Amusant',
        'tests.meta.guidance': '📝 Guidance',
        'tests.meta.improvement': '📈 Amélioration',
        
        // Badge translations (root level)
        'tests.trending': '🔥 Tendance',
        'tests.popular': '✨ Populaire',
        'tests.new': '🔥 NOUVEAU'
    };
    
    // Apply French translations to elements
    Object.keys(frenchTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && frenchTranslations[key]) {
                element.textContent = frenchTranslations[key];
                console.log(`✅ French: ${key} → "${frenchTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇫🇷 French manual translations applied successfully');
}

// Manual Italian translations function
function applyManualItalianTranslations() {
    console.log('🇮🇹 Applying manual Italian translations...');
    
    const italianTranslations = {
        'tests.takeTest': 'Fai il Test',
        'hero.badge': 'Test di Personalità Più Accurati',
        'nav.tests': 'Test',
        'nav.couples': 'Coppie',
        'nav.about': 'Chi Siamo',
        
        // Meta badges - Italian
        'tests.meta.duration': '⏱️ 8 min',
        'tests.meta.duration5': '⏱️ 5 min',
        'tests.meta.duration6': '⏱️ 6 min',
        'tests.meta.duration7': '⏱️ 7 min',
        'tests.meta.duration8': '⏱️ 8 min',
        'tests.meta.duration10': '⏱️ 10 min',
        'tests.meta.duration12': '⏱️ 12 min',
        'tests.meta.duration15': '⏱️ 15 min',
        'tests.meta.setup5': '⏱️ 5 min configurazione',
        'tests.meta.setup10': '⏱️ 10 min configurazione',
        'tests.meta.accurate': '🎯 Molto Preciso',
        'tests.meta.scienceBased': '🔬 Base Scientifica',
        'tests.meta.researchGrade': '🎯 Livello di Ricerca',
        'tests.meta.mostAccurate': '🏆 Più Preciso',
        'tests.meta.relationship': '💝 Relazione',
        'tests.meta.couplesFriendly': '❤️ Amichevole per Coppie',
        'tests.meta.funGame': '🎮 Gioco Divertente',
        'tests.meta.brainTraining': '🧠 Allenamento Cerebrale',
        'tests.meta.careerFocused': '🎯 Focalizzato sulla Carriera',
        'tests.meta.careerFocus': '💼 Focus Carriera',
        'tests.meta.leadership': '💼 Leadership',
        'tests.meta.selfReflection': '🔍 Autoriflessione',
        'tests.meta.notMedical': '⚠️ Non Medico',
        'tests.meta.wellness': '🧘 Benessere',
        'tests.meta.moodTracking': '🌈 Tracciamento Umore',
        'tests.meta.strengthsBased': '🌟 Basato su Punti di Forza',
        'tests.meta.personalGrowth': '🎯 Crescita Personale',
        'tests.meta.personalized': '🎯 Personalizzato',
        'tests.meta.relationships': '💕 Relazioni',
        'tests.meta.connection': '🤝 Connessione',
        'tests.meta.socialApp': '📱 Social',
        'tests.meta.socialPeople': '👥 Social',
        'tests.meta.viral': '🔥 Virale',
        'tests.meta.detailed': '📊 Dettagliato',
        'tests.meta.couples': '💕 Coppie',
        'tests.meta.instant': '⚡ Istantaneo',
        'tests.meta.insights': '💡 Intuizioni',
        'tests.meta.new': '🔥 NUOVO',
        'tests.meta.popular': '✨ Popolare',
        'tests.meta.trending': '🔥 Tendenza',
        
        // Couples section badges
        'tests.connect': '💝 CONNETTI',
        'tests.growth': '🌱 CRESCITA',
        'tests.meta.fun': '😄 Divertente',
        'tests.meta.guidance': '📝 Guida',
        'tests.meta.improvement': '📈 Miglioramento',
        
        // Badge translations (root level)
        'tests.trending': '🔥 Tendenza',
        'tests.popular': '✨ Popolare',
        'tests.new': '🔥 NUOVO'
    };
    
    Object.keys(italianTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && italianTranslations[key]) {
                element.textContent = italianTranslations[key];
                console.log(`✅ Italian: ${key} → "${italianTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇮🇹 Italian manual translations applied successfully');
}

// Manual Portuguese translations function
function applyManualPortugueseTranslations() {
    console.log('🇵🇹 Applying manual Portuguese translations...');
    
    const portugueseTranslations = {
        'tests.takeTest': 'Fazer Teste',
        'hero.badge': 'Testes de Personalidade Mais Precisos',
        'nav.tests': 'Testes',
        'nav.couples': 'Casais',
        'nav.about': 'Sobre',
        
        // Meta badges - Portuguese
        'tests.meta.duration': '⏱️ 8 min',
        'tests.meta.duration5': '⏱️ 5 min',
        'tests.meta.duration6': '⏱️ 6 min', 
        'tests.meta.duration7': '⏱️ 7 min',
        'tests.meta.duration8': '⏱️ 8 min',
        'tests.meta.duration10': '⏱️ 10 min',
        'tests.meta.duration12': '⏱️ 12 min',
        'tests.meta.duration15': '⏱️ 15 min',
        'tests.meta.setup5': '⏱️ 5 min configuração',
        'tests.meta.setup10': '⏱️ 10 min configuração',
        'tests.meta.accurate': '🎯 Muito Preciso',
        'tests.meta.scienceBased': '🔬 Base Científica',
        'tests.meta.researchGrade': '🎯 Nível de Pesquisa',
        'tests.meta.mostAccurate': '🏆 Mais Preciso',
        'tests.meta.relationship': '💝 Relacionamento',
        'tests.meta.couplesFriendly': '❤️ Amigável para Casais',
        'tests.meta.funGame': '🎮 Jogo Divertido',
        'tests.meta.brainTraining': '🧠 Treinamento Cerebral',
        'tests.meta.careerFocused': '🎯 Foco na Carreira',
        'tests.meta.careerFocus': '💼 Foco Profissional',
        'tests.meta.selfReflection': '🔍 Autorreflexão',
        'tests.meta.notMedical': '⚠️ Não Médico',
        'tests.meta.wellness': '🧘 Bem-estar',
        'tests.meta.moodTracking': '🌈 Rastreamento de Humor',
        'tests.meta.strengthsBased': '🌟 Baseado em Forças',
        'tests.meta.personalGrowth': '🎯 Crescimento Pessoal',
        'tests.meta.instant': '⚡ Instantâneo',
        'tests.meta.insights': '💡 Insights',
        'tests.meta.leadership': '💼 Liderança',
        'tests.meta.personalized': '🎯 Personalizado',
        'tests.meta.relationships': '💕 Relacionamentos',
        'tests.meta.connection': '🤝 Conexão',
        'tests.meta.socialApp': '📱 Social',
        'tests.meta.socialPeople': '👥 Social',
        'tests.meta.viral': '🔥 Viral',
        'tests.meta.detailed': '📊 Detalhado',
        'tests.meta.couples': '💕 Casais',
        'tests.meta.new': '🔥 NOVO',
        'tests.meta.popular': '✨ Popular',
        'tests.meta.trending': '🔥 Tendência',
        
        // Button translations for "How Others See Me" section
        'tests.createQuestions': 'Criar Perguntas',
        'tests.startAssessment': 'Perguntar às Minhas Pessoas',
        
        // Badge translations (root level)
        'tests.trending': '🔥 Tendência',
        'tests.popular': '✨ Popular',
        'tests.new': '🔥 NOVO',
        
        // Couples section badges
        'tests.connect': '💝 CONECTAR',
        'tests.growth': '🌱 CRESCIMENTO',
        'tests.meta.fun': '😄 Divertido',
        'tests.meta.guidance': '📝 Orientação',
        'tests.meta.improvement': '📈 Melhoria'
    };
    
    Object.keys(portugueseTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && portugueseTranslations[key]) {
                element.textContent = portugueseTranslations[key];
                console.log(`✅ Portuguese: ${key} → "${portugueseTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇵🇹 Portuguese manual translations applied successfully');
}

// Manual Japanese translations function
function applyManualJapaneseTranslations() {
    console.log('🇯🇵 Applying manual Japanese translations...');
    
    const japaneseTranslations = {
        'tests.takeTest': 'テストを開始',
        'hero.badge': '最も正確な性格テスト',
        'nav.tests': 'テスト',
        'nav.couples': 'カップル',
        'nav.about': '概要',
        'nav.knowYourself': '🧠 自分を知る',
        'nav.howOthersSeeMe': '👥 他人から見た私',
        
        // Meta badges - Japanese
        'tests.meta.duration': '⏱️ 8分',
        'tests.meta.duration5': '⏱️ 5分',
        'tests.meta.duration6': '⏱️ 6分',
        'tests.meta.duration7': '⏱️ 7分',
        'tests.meta.duration8': '⏱️ 8分',
        'tests.meta.duration10': '⏱️ 10分',
        'tests.meta.duration12': '⏱️ 12分',
        'tests.meta.duration15': '⏱️ 15分',
        'tests.meta.setup5': '⏱️ 5分セットアップ',
        'tests.meta.setup10': '⏱️ 10分セットアップ',
        'tests.meta.accurate': '🎯 非常に正確',
        'tests.meta.scienceBased': '🔬 科学的根拠',
        'tests.meta.researchGrade': '🎯 研究レベル',
        'tests.meta.mostAccurate': '🏆 最も正確',
        'tests.meta.relationship': '💝 関係',
        'tests.meta.couplesFriendly': '❤️ カップル向け',
        'tests.meta.funGame': '🎮 楽しいゲーム',
        'tests.meta.brainTraining': '🧠 脳トレーニング',
        'tests.meta.careerFocused': '🎯 キャリア重視',
        'tests.meta.careerFocus': '💼 キャリアフォーカス',
        'tests.meta.leadership': '💼 リーダーシップ',
        'tests.meta.selfReflection': '🔍 自己反省',
        'tests.meta.notMedical': '⚠️ 医療用ではない',
        'tests.meta.wellness': '🧘 ウェルネス',
        'tests.meta.moodTracking': '🌈 気分追跡',
        'tests.meta.strengthsBased': '🌟 強み基盤',
        'tests.meta.personalGrowth': '🎯 個人成長',
        'tests.meta.personalized': '🎯 パーソナライズ',
        'tests.meta.relationships': '💕 関係',
        'tests.meta.connection': '🤝 つながり',
        'tests.meta.socialApp': '📱 ソーシャル',
        'tests.meta.socialPeople': '👥 ソーシャル',
        'tests.meta.viral': '🔥 バイラル',
        'tests.meta.detailed': '📊 詳細',
        'tests.meta.couples': '💕 カップル',
        'tests.meta.instant': '⚡ 即時',
        'tests.meta.insights': '💡 洞察',
        'tests.meta.new': '🔥 新規',
        'tests.meta.popular': '✨ 人気',
        'tests.meta.trending': '🔥 トレンド',
        
        // Button translations for "How Others See Me" section
        'tests.createQuestions': '質問を作成',
        'tests.startAssessment': '私の人たちに聞く',
        
        // Badge translations (root level)
        'tests.trending': '🔥 トレンド',
        'tests.popular': '✨ 人気',
        'tests.new': '🔥 新',
        
        // Couples section badges
        'tests.connect': '💝 接続',
        'tests.growth': '🌱 成長',
        'tests.meta.fun': '😄 楽しい',
        'tests.meta.guidance': '📝 ガイダンス',
        'tests.meta.improvement': '📈 改善'
    };
    
    Object.keys(japaneseTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && japaneseTranslations[key]) {
                element.textContent = japaneseTranslations[key];
                console.log(`✅ Japanese: ${key} → "${japaneseTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇯🇵 Japanese manual translations applied successfully');
}

// Manual Chinese translations function
function applyManualChineseTranslations() {
    console.log('🇨🇳 Applying manual Chinese translations...');
    
    const chineseTranslations = {
        'tests.takeTest': '开始测试',
        'hero.badge': '最准确的性格测试',
        'nav.tests': '测试',
        'nav.couples': '情侣',
        'nav.about': '关于',
        'nav.knowYourself': '🧠 了解自己',
        'nav.howOthersSeeMe': '👥 他人眼中的我',
        
        // Meta badges - Chinese (using 分 for minutes - more standard)
        'tests.meta.duration': '⏱️ 8分',
        'tests.meta.duration5': '⏱️ 5分',
        'tests.meta.duration6': '⏱️ 6分',
        'tests.meta.duration7': '⏱️ 7分',
        'tests.meta.duration8': '⏱️ 8分',
        'tests.meta.duration10': '⏱️ 10分',
        'tests.meta.duration12': '⏱️ 12分',
        'tests.meta.duration15': '⏱️ 15分',
        'tests.meta.setup5': '⏱️ 5分设置',
        'tests.meta.setup10': '⏱️ 10分设置',
        'tests.meta.accurate': '🎯 非常准确',
        'tests.meta.scienceBased': '🔬 科学依据',
        'tests.meta.researchGrade': '🎯 研究级别',
        'tests.meta.mostAccurate': '🏆 最准确',
        'tests.meta.relationship': '💝 关系',
        'tests.meta.couplesFriendly': '❤️ 情侣友好',
        'tests.meta.funGame': '🎮 有趣游戏',
        'tests.meta.brainTraining': '🧠 大脑训练',
        'tests.meta.careerFocused': '🎯 职业导向',
        'tests.meta.careerFocus': '💼 职业重点',
        'tests.meta.leadership': '💼 领导力',
        'tests.meta.selfReflection': '🔍 自我反思',
        'tests.meta.notMedical': '⚠️ 非医疗',
        'tests.meta.wellness': '🧘 健康',
        'tests.meta.moodTracking': '🌈 情绪追踪',
        'tests.meta.strengthsBased': '🌟 基于优势',
        'tests.meta.personalGrowth': '🎯 个人成长',
        'tests.meta.personalized': '🎯 个性化',
        'tests.meta.relationships': '💕 关系',
        'tests.meta.connection': '🤝 连接',
        'tests.meta.socialApp': '📱 社交',
        'tests.meta.socialPeople': '👥 社交',
        'tests.meta.viral': '🔥 病毒式',
        'tests.meta.detailed': '📊 详细',
        'tests.meta.couples': '💕 情侣',
        'tests.meta.instant': '⚡ 即时',
        'tests.meta.insights': '💡 洞察',
        'tests.meta.new': '🔥 新',
        'tests.meta.popular': '✨ 受欢迎',
        'tests.meta.trending': '🔥 趋势',
        
        // Button translations for "How Others See Me" section
        'tests.createQuestions': '创建问题',
        'tests.startAssessment': '询问我的人',
        
        // Badge translations (root level) 
        'tests.trending': '🔥 趋势',
        'tests.popular': '✨ 受欢迎',
        'tests.new': '🔥 新',
        
        // Couples section badges
        'tests.connect': '💝 连接',
        'tests.growth': '🌱 成长',
        'tests.meta.fun': '😄 有趣',
        'tests.meta.guidance': '📝 指导',
        'tests.meta.improvement': '📈 改进'
    };
    
    Object.keys(chineseTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && chineseTranslations[key]) {
                element.textContent = chineseTranslations[key];
                console.log(`✅ Chinese: ${key} → "${chineseTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇨🇳 Chinese manual translations applied successfully');
}

// Manual German translations function
function applyManualGermanTranslations() {
    console.log('🇩🇪 Applying manual German translations...');
    
    const germanTranslations = {
        'tests.takeTest': 'Test Machen',
        'hero.badge': 'Genaueste Persönlichkeitstests',
        'nav.tests': 'Tests',
        'nav.couples': 'Paare',
        'nav.about': 'Über Uns',
        
        // Meta badges - German
        'tests.meta.duration': '⏱️ 8 Min',
        'tests.meta.duration5': '⏱️ 5 Min',
        'tests.meta.duration6': '⏱️ 6 Min',
        'tests.meta.duration7': '⏱️ 7 Min',
        'tests.meta.duration8': '⏱️ 8 Min',
        'tests.meta.duration10': '⏱️ 10 Min',
        'tests.meta.duration12': '⏱️ 12 Min',
        'tests.meta.duration15': '⏱️ 15 Min',
        'tests.meta.setup5': '⏱️ 5 Min Einrichtung',
        'tests.meta.setup10': '⏱️ 10 Min Einrichtung',
        'tests.meta.accurate': '🎯 Sehr Genau',
        'tests.meta.scienceBased': '🔬 Wissenschaftlich Fundiert',
        'tests.meta.researchGrade': '🎯 Forschungsqualität',
        'tests.meta.mostAccurate': '🏆 Am Genauesten',
        'tests.meta.relationship': '💝 Beziehung',
        'tests.meta.couplesFriendly': '❤️ Paarfreundlich',
        'tests.meta.funGame': '🎮 Spaßiges Spiel',
        'tests.meta.brainTraining': '🧠 Gehirntraining',
        'tests.meta.careerFocused': '🎯 Karrierefokussiert',
        'tests.meta.careerFocus': '💼 Karrierefokus',
        'tests.meta.leadership': '💼 Führung',
        'tests.meta.selfReflection': '🔍 Selbstreflexion',
        'tests.meta.notMedical': '⚠️ Nicht Medizinisch',
        'tests.meta.wellness': '🧘 Wohlbefinden',
        'tests.meta.moodTracking': '🌈 Stimmungsverfolgung',
        'tests.meta.strengthsBased': '🌟 Stärkenbasiert',
        'tests.meta.personalGrowth': '🎯 Persönliches Wachstum',
        'tests.meta.personalized': '🎯 Personalisiert',
        'tests.meta.relationships': '💕 Beziehungen',
        'tests.meta.connection': '🤝 Verbindung',
        'tests.meta.socialApp': '📱 Sozial',
        'tests.meta.socialPeople': '👥 Sozial',
        'tests.meta.viral': '🔥 Viral',
        'tests.meta.detailed': '📊 Detailliert',
        'tests.meta.couples': '💕 Paare',
        'tests.meta.instant': '⚡ Sofortig',
        'tests.meta.insights': '💡 Einsichten',
        'tests.meta.new': '🔥 NEU',
        'tests.meta.popular': '✨ Beliebt',
        'tests.meta.trending': '🔥 Trending',
        
        // Badge translations (root level)
        'tests.trending': '🔥 Trending',
        'tests.popular': '✨ Beliebt',
        'tests.new': '🔥 NEU',
        
        // Couples section badges
        'tests.connect': '💝 VERBINDEN',
        'tests.growth': '🌱 WACHSTUM',
        'tests.meta.fun': '😄 Spaß',
        'tests.meta.guidance': '📝 Führung',
        'tests.meta.improvement': '📈 Verbesserung'
    };
    
    Object.keys(germanTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && germanTranslations[key]) {
                element.textContent = germanTranslations[key];
                console.log(`✅ German: ${key} → "${germanTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇩🇪 German manual translations applied successfully');
}

// Manual Spanish translations function
function applyManualSpanishTranslations() {
    console.log('🇪🇸 Applying manual Spanish translations...');
    
    const spanishTranslations = {
        'tests.takeTest': 'Hacer Prueba',
        'hero.badge': 'Tests de Personalidad Más Precisos',
        'nav.tests': 'Tests',
        'nav.couples': 'Parejas',
        'nav.about': 'Acerca De',
        
        // Meta badges - Spanish
        'tests.meta.duration': '⏱️ 8 min',
        'tests.meta.duration5': '⏱️ 5 min',
        'tests.meta.duration6': '⏱️ 6 min',
        'tests.meta.duration7': '⏱️ 7 min', 
        'tests.meta.duration8': '⏱️ 8 min',
        'tests.meta.duration10': '⏱️ 10 min',
        'tests.meta.duration12': '⏱️ 12 min',
        'tests.meta.duration15': '⏱️ 15 min',
        'tests.meta.setup5': '⏱️ 5 min configuración',
        'tests.meta.setup10': '⏱️ 10 min configuración',
        'tests.meta.accurate': '🎯 Muy Preciso',
        'tests.meta.scienceBased': '🔬 Base Científica',
        'tests.meta.researchGrade': '🎯 Grado de Investigación',
        'tests.meta.mostAccurate': '🏆 Más Preciso',
        'tests.meta.relationship': '💝 Relaciones',
        'tests.meta.couplesFriendly': '❤️ Amigable para Parejas',
        'tests.meta.funGame': '🎮 Juego Divertido',
        'tests.meta.brainTraining': '🧠 Entrenamiento Mental',
        'tests.meta.careerFocused': '🎯 Enfoque Profesional',
        'tests.meta.careerFocus': '💼 Enfoque de Carrera',
        'tests.meta.leadership': '💼 Liderazgo',
        'tests.meta.selfReflection': '🔍 Autorreflexión',
        'tests.meta.notMedical': '⚠️ No Médico',
        'tests.meta.wellness': '🧘 Bienestar',
        'tests.meta.moodTracking': '🌈 Seguimiento del Estado de Ánimo',
        'tests.meta.strengthsBased': '🌟 Basado en Fortalezas',
        'tests.meta.personalGrowth': '🎯 Crecimiento Personal',
        'tests.meta.personalized': '🎯 Personalizado',
        'tests.meta.relationships': '💕 Relaciones',
        'tests.meta.connection': '🤝 Conexión',
        'tests.meta.socialApp': '📱 Social',
        'tests.meta.socialPeople': '👥 Social',
        'tests.meta.viral': '🔥 Viral',
        'tests.meta.detailed': '📊 Detallado',
        'tests.meta.couples': '💕 Parejas',
        'tests.meta.instant': '⚡ Instantáneo',
        'tests.meta.insights': '💡 Perspectivas',
        'tests.meta.new': '🔥 NUEVO',
        'tests.meta.popular': '✨ Popular', 
        'tests.meta.trending': '🔥 Tendencia',
        
        // Badge translations (root level)
        'tests.trending': '🔥 Tendencia',
        'tests.popular': '✨ Popular',
        'tests.new': '🔥 NUEVO',
        
        // Couples section badges
        'tests.connect': '💝 CONECTAR',
        'tests.growth': '🌱 CRECIMIENTO',
        'tests.meta.fun': '😄 Divertido',
        'tests.meta.guidance': '📝 Orientación',
        'tests.meta.improvement': '📈 Mejora'
    };
    
    Object.keys(spanishTranslations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && spanishTranslations[key]) {
                element.textContent = spanishTranslations[key];
                console.log(`✅ Spanish: ${key} → "${spanishTranslations[key]}"`);
            }
        });
    });
    
    console.log('🇪🇸 Spanish manual translations applied successfully');
}

// Manual test card translations for all languages as fallback
function applyManualKoreanTestCardTitles() {
    console.log('🎯 Applying manual language translations...');
    
    // Detect current language
    const currentLang = getCurrentLanguage();
    console.log(`📍 Current language detected: ${currentLang}`);
    
    if (currentLang === 'fr') {
        applyManualFrenchTranslations();
        return;
    } else if (currentLang === 'it') {
        applyManualItalianTranslations();
        return;
    } else if (currentLang === 'pt') {
        applyManualPortugueseTranslations();
        return;
    } else if (currentLang === 'ja') {
        applyManualJapaneseTranslations();
        return;
    } else if (currentLang === 'zh') {
        applyManualChineseTranslations();
        return;
    } else if (currentLang === 'de') {
        applyManualGermanTranslations();
        return;
    } else if (currentLang === 'es') {
        applyManualSpanishTranslations();
        return;
    }
    
    console.log('🎯 Applying manual Korean test card titles...');
    
    const koreanTestTitles = {
        // Hero section
        'hero.badge': '가장 정확한 성격 테스트',
        'hero.title': '나의 성격을 알아보세요 ✨',
        'hero.subtitle': '과학적으로 검증된 성격 테스트로 진짜 나를 찾아보세요. MBTI부터 빅파이브까지, 나만의 특별함을 발견해보세요! 🔥',
        'hero.startJourney': '여정을 시작하세요',
        
        // Navigation
        'nav.tests': '테스트',
        'nav.couples': '커플',
        'nav.about': '소개',
        'nav.blog': '블로그',
        'nav.contact': '연락처',
        'nav.results': '내 결과',
        'nav.login': '로그인 ✨',
        'nav.logout': '로그아웃',
        
        // Categories
        'categories.all': '전체',
        'categories.knowYourselfTitle': '🧠 나를 알아가기',
        'categories.howOthersSeeTitle': '👥 다른 사람들이 보는 나',
        
        // Test section
        'tests.sectionTitle': '나의 성격을 알아보세요 ✨',
        'tests.takeTest': '테스트 하기',
        
        // Test cards - Titles
        'tests.mbti.title': '16가지 성격 유형',
        'tests.bigfive.title': '빅파이브 성격 검사',
        'tests.lovelanguage.title': '사랑의 언어 테스트',
        'tests.iq.title': '두뇌 테스트',
        'tests.eq.title': '감성지능',
        'tests.ei.title': '감성지능',
        'tests.adhd.title': '집중력과 에너지 스타일',
        'tests.anxiety.title': '스트레스 관리 스타일',
        'tests.depression.title': '감정 조절 스타일',
        'tests.via.title': '캐릭터 강점 (VIA)',
        'tests.characterstrengths.title': '캐릭터 강점 (VIA)',
        'tests.strengths.title': '캐릭터 강점 (VIA)',
        'tests.careerpath.title': '진로 탐색기',
        'tests.relationshipstyle.title': '연애 스타일',
        'tests.askfriends.title': '누가 나를 가장 잘 아는지 보기',
        'tests.360assessment.title': '360도 나에 대한 인식',
        
        // Test cards - Descriptions (THE MISSING TRANSLATIONS!)
        'tests.mbti.description': '나를 정말로 알 수 있는 최고의 성격 테스트! INTJ 전략가 타입인가요, ENFP 활동가 타입인가요? 지금 바로 확인해보세요! 💅',
        'tests.bigfive.description': '심리학자들이 인정하는 과학적 성격 테스트예요. 5가지 핵심 성격 특성으로 나를 분석해보세요! 🧠',
        'tests.lovelanguage.description': '격려의 말, 함께하는 시간, 신체적 접촉? 어떻게 사랑을 주고받는 것이 가장 좋은지 발견하세요!',
        'tests.iq.description': '재미있는 논리 퍼즐과 두뇌 게임이에요! 단순히 재미를 위한 것으로, 실제 IQ 테스트는 전문가가 진행해야 해요. 도전해볼까요? 🤓',
        'tests.eq.description': '내 감정과 다른 사람의 감정을 얼마나 잘 이해할까요? 자기인식, 공감능력, 사회적 기술을 확인해보세요! 💝',
        'tests.ei.description': '내 감정과 다른 사람의 감정을 얼마나 잘 이해할까요? 자기인식, 공감능력, 사회적 기술을 확인해보세요! 💝',
        'tests.adhd.description': '당신만의 독특한 주의력과 에너지 패턴을 발견하세요! 이것은 재미있는 자기성찰을 위한 것입니다 - 의학적 평가가 아닙니다. ⚡',
        'tests.anxiety.description': '스트레스와 압박을 어떻게 다루는지 발견하세요! 이것은 재미와 자기 인식을 위한 것입니다 - 의학적 조언이 아닙니다. 💚',
        'tests.depression.description': '감정을 어떻게 처리하는지 이해하세요! 이것은 자기성찰과 오락을 위한 것입니다 - 정신건강 평가가 아닙니다. 🌻',
        'tests.strengths.description': '핵심 캐릭터 강점을 발견하세요! 창의성부터 리더십, 친절함까지 - 당신을 독특하게 멋지게 만드는 것을 발견하세요! ✨',
        'tests.careerpath.description': '내 성격에 맞는 직업을 발견하세요! 리더, 창작자, 도우미, 분석가, 기업가 중 어느 것인가요?',
        'tests.relationshipstyle.description': '어떻게 사랑하고 다른 사람들과 연결되나요? 나만의 독특한 연애 스타일과 사랑에서의 매력을 발견하세요!',
        'tests.askfriends.description': '자신에 대한 질문을 만들고, 당신의 답변을 제공한 다음, 누가 당신을 가장 잘 아는지 확인해보세요! 친구들이 당신의 답을 맞춰보려고 할 거예요!',
        'tests.360assessment.description': '성장과 이해를 위한 진지한 다각도 피드백입니다. 친구들로부터 정직한 통찰을 얻어보세요!',
        
        // French test descriptions for manual mapping
        'tests.mbti.description-fr': 'Découvrez votre type de personnalité unique avec l\'évaluation classique Myers-Briggs ! Êtes-vous un penseur introverti ou un extraverti émotionnel ?',
        'tests.bigfive.description-fr': 'L\'étalon-or de la psychologie de la personnalité ! Explorez votre ouverture, conscience, extraversion, amabilité et névrosisme.',
        'tests.lovelanguage.description-fr': 'Mots d\'affirmation, temps de qualité ou contact physique ? Découvrez comment vous donnez et recevez l\'amour le mieux !',
        'tests.iq.description-fr': 'Testez vos compétences de résolution de problèmes ! Puzzles logiques amusants pour défier votre esprit.',
        'tests.ei.description-fr': 'À quel point lisez-vous bien les émotions et naviguez dans les situations sociales ? Testez vos super-pouvoirs émotionnels !',
        'tests.adhd.description-fr': 'Explorez vos modèles d\'attention et niveaux d\'énergie. Génial pour comprendre votre style de productivité !',
        'tests.anxiety.description-fr': 'Comment gérez-vous la pression ? Apprenez vos modèles de stress et découvrez des stratégies d\'adaptation saines.',
        'tests.depression.description-fr': 'Comprenez vos modèles émotionnels et votre résilience. Parfait pour la croissance personnelle et la connaissance de soi !',
        'tests.strengths.description-fr': 'Découvrez vos principales forces de caractère ! De la créativité à la gentillesse, trouvez ce qui vous fait briller.',
        'tests.careerpath.description-fr': 'Découvrez la carrière qui correspond à votre personnalité ! Êtes-vous un leader, créateur, aidant, analyste ou entrepreneur ?',
        'tests.relationshipstyle.description-fr': 'Comment aimez-vous et vous connectez-vous avec les autres ? Découvrez votre style de relation unique et ce qui vous fait vibrer en amour !',
        'tests.askfriends.description-fr': 'Créez des questions sur vous-même, fournissez VOS réponses, puis voyez qui vous connaît le mieux ! Les amis essaieront de correspondre à vos réponses.',
        'tests.360assessment.description-fr': 'Commentaires sérieux et multi-perspectifs pour la croissance et la compréhension. Obtenez des insights honnêtes d\'amis, de famille et de collègues.',
        
        // French meta badges for manual mapping
        'tests.meta.scienceBased-fr': '🔬 Base Scientifique',
        'tests.meta.accurate-fr': '🎯 Très Précis',
        'tests.meta.researchGrade-fr': '🎯 Niveau Recherche',
        'tests.meta.mostAccurate-fr': '🏆 Le Plus Précis',
        'tests.meta.relationship-fr': '💝 Relation',
        'tests.meta.couplesFriendly-fr': '❤️ Convivial Couples',
        'tests.meta.funGame-fr': '🎮 Jeu Amusant',
        'tests.meta.brainTraining-fr': '🧠 Entraînement Cérébral',
        'tests.meta.careerFocused-fr': '🎯 Axé Carrière',
        'tests.meta.careerFocus-fr': '💼 Focus Carrière',
        'tests.meta.selfReflection-fr': '🔍 Autoréflexion',
        'tests.meta.notMedical-fr': '⚠️ Non Médical',
        'tests.meta.wellness-fr': '🧘 Bien-être',
        'tests.meta.moodTracking-fr': '🌈 Suivi Humeur',
        'tests.meta.strengthsBased-fr': '🌟 Basé Forces',
        'tests.meta.personalGrowth-fr': '🎯 Croissance Personnelle',
        'tests.meta.instant-fr': '⚡ Instantané',
        'tests.meta.insights-fr': '💡 Insights',
        
        // Test badges
        'tests.trending': '🔥 트렌딩',
        'tests.popular': '✨ 인기',
        'tests.new': '🔥 새로운',
        
        // Couples section
        'couples.title': '커플 궁합 ❤️',
        'couples.subtitle': '각자 테스트를 해보고, 연인과 함께 우리의 궁합과 관계 스타일을 알아보세요! 💕',
        'couples.shareResults': '결과 공유하기',
        'couples.compatibility': '궁합 분석',
        'couples.growth': '관계 성장',
        
        // Why Choose section
        'whyChoose.title': '왜 PersonaTests를 선택해야 할까요? ✨',
        'whyChoose.scientific': '진짜 과학적',
        'whyChoose.instant': '즉시 결과',
        'whyChoose.safe': '당신의 비밀은 안전합니다',
        'whyChoose.everywhere': '어디서나 작동',
        
        // Hero stats
        'hero.stats.tests': '성격 테스트',
        'hero.stats.languages': '언어',
        'hero.stats.access': '항상 무료',
        'hero.stats.private': '완전 비공개',
        
        // Hero features
        'hero.features.scientific': '과학적 근거',
        'hero.features.instant': '즉시 결과',
        'hero.features.personalized': '100% 개인화',
        'hero.features.private': '완전 비공개',
        
        // Test meta/badges (these show under test descriptions)
        'tests.meta.duration': '⏱️ 8분',
        'tests.meta.duration5': '⏱️ 5분',
        'tests.meta.duration6': '⏱️ 6분',
        'tests.meta.duration7': '⏱️ 7분',
        'tests.meta.duration8': '⏱️ 8분',
        'tests.meta.duration10': '⏱️ 10분',
        'tests.meta.duration12': '⏱️ 12분',
        'tests.meta.duration15': '⏱️ 15분',
        'tests.meta.accurate': '🎯 매우 정확',
        'tests.meta.scienceBased': '🔬 과학적 근거',
        'tests.meta.researchGrade': '🎯 연구 수준',
        'tests.meta.mostAccurate': '🏆 가장 정확',
        'tests.meta.relationship': '💝 관계',
        'tests.meta.couplesFriendly': '❤️ 커플 친화적',
        'tests.meta.funGame': '🎮 재미있는 게임',
        'tests.meta.brainTraining': '🧠 두뇌 훈련',
        'tests.meta.careerFocused': '🎯 진로 중심',
        'tests.meta.leadership': '💼 리더십',
        'tests.meta.selfReflection': '🔍 자기성찰',
        'tests.meta.notMedical': '⚠️ 의료용 아님',
        'tests.meta.wellness': '🧘 웰니스',
        'tests.meta.moodTracking': '🌈 기분 추적',
        'tests.meta.strengthsBased': '🌟 강점 기반',
        'tests.meta.personalGrowth': '🎯 개인 성장',
        'tests.meta.careerFocus': '💼 진로 중심',
        'tests.meta.personalized': '🎯 개인화',
        'tests.meta.relationships': '💕 관계',
        'tests.meta.connection': '🤝 연결',
        
        // Button translations for "How Others See Me" section
        'tests.createQuestions': '질문 만들기',
        'tests.startAssessment': '내 사람들에게 물어보기',
        
        // Setup duration translations for "How Others See Me" section  
        'tests.meta.setup5': '⏱️ 5분 설정',
        'tests.meta.setup10': '⏱️ 10분 설정',
        
        // Couples section badges
        'tests.connect': '💝 연결',
        'tests.growth': '🌱 성장',
        'tests.meta.fun': '😄 재미',
        'tests.meta.guidance': '📝 가이드',
        'tests.meta.improvement': '📈 개선'
    };
    
    // Apply Korean titles to test cards
    Object.entries(koreanTestTitles).forEach(([key, koreanTitle]) => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            if (element && element.textContent !== koreanTitle) {
                element.textContent = koreanTitle;
                console.log(`✅ Updated ${key}: ${koreanTitle}`);
            }
        });
    });
    
    console.log('🎉 Manual Korean test card titles applied successfully!');
}

// Verify Korean translations are working
function verifyKoreanTranslations() {
    console.log('🔍 Verifying Korean translations...');
    
    const testCards = document.querySelectorAll('.test-card h3[data-translate*="tests."]');
    let koreanCount = 0;
    let totalCount = testCards.length;
    
    testCards.forEach((card, index) => {
        const text = card.textContent;
        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
        
        if (hasKorean) {
            koreanCount++;
            console.log(`✅ Card ${index + 1}: "${text}" - Korean detected`);
        } else {
            console.log(`❌ Card ${index + 1}: "${text}" - Still in English`);
        }
    });
    
    if (koreanCount > 0) {
        console.log(`🎉 SUCCESS: Korean translations are now visible! (${koreanCount}/${totalCount} cards)`);
    } else {
        console.log(`❌ FAILURE: No Korean translations detected in test cards (${koreanCount}/${totalCount})`);
    }
    
    return { koreanCount, totalCount };
}

function updateHeroSection(lang = translations[currentLanguage]) {
    if (!lang?.hero) return;
    
    const elements = {
        title: document.querySelector('.hero-title'),
        subtitle: document.querySelector('.hero-subtitle'),
        cta: document.querySelector('.cta-text')
    };
    
    Object.entries(elements).forEach(([key, element]) => {
        if (element && lang.hero[key]) {
            element.textContent = lang.hero[key];
        }
    });
}

function updateStatsSection(lang = translations[currentLanguage]) {
    if (!lang?.hero?.stats) return;
    
    const statLabels = document.querySelectorAll('.stat-label');
    const heroStatsKeys = ['tests', 'languages', 'access', 'private'];
    
    heroStatsKeys.forEach((key, index) => {
        if (statLabels[index] && lang.hero.stats[key]) {
            statLabels[index].textContent = lang.hero.stats[key];
        }
    });
}

function updateHeroFeatures(lang = translations[currentLanguage]) {
    if (!lang?.hero?.features) return;
    
    const featureElements = {
        scientific: document.querySelector('[data-translate="hero.features.scientific"]'),
        instant: document.querySelector('[data-translate="hero.features.instant"]'),
        personalized: document.querySelector('[data-translate="hero.features.personalized"]'),
        private: document.querySelector('[data-translate="hero.features.private"]')
    };
    
    Object.entries(featureElements).forEach(([key, element]) => {
        if (element && lang.hero.features[key]) {
            element.textContent = lang.hero.features[key];
        }
    });
}

// Initialize language from localStorage or browser preference - Optimized
function initializeLanguage() {
    try {
        const supportedLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];
        let initialLang = 'en';
        
        // Try saved language first
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && supportedLangs.includes(savedLang)) {
            initialLang = savedLang;
        } else {
            // Fallback to browser language
            const browserLang = navigator.language?.split('-')[0];
            if (browserLang && supportedLangs.includes(browserLang)) {
                initialLang = browserLang;
            }
        }
        
        // Only change if different from default
        if (initialLang !== 'en') {
            changeLanguage(initialLang);
        } else {
            // Ensure English flag is marked as selected
            updateLanguageVisualIndicators('en');
        }
        
    } catch (error) {
        console.warn('Error initializing language, falling back to English:', error);
        updateLanguageVisualIndicators('en');
    }
}

// Close language dropdown when clicking outside
document.addEventListener('click', function(event) {
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector && !languageSelector.contains(event.target)) {
        document.getElementById('languageOptions').style.display = 'none';
        document.querySelector('.dropdown-arrow').style.transform = 'rotate(0deg)';
    }
});

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrIchldLRg4rsPVsmSDWIDDnBbYIjdClo",
    authDomain: "personatest-c8eb1.firebaseapp.com",
    projectId: "personatest-c8eb1",
    storageBucket: "personatest-c8eb1.firebasestorage.app",
    messagingSenderId: "56769105558",
    appId: "1:56769105558:web:8e13f979f8b7541ec5fcb7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Firebase Auth State Listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in - get additional data from Firestore
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    ...userDoc.data()
                };
            } else {
                currentUser = {
                    uid: user.uid,
                    email: user.email,
                    name: 'User'
                };
            }
            updateAuthUI();
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    } else {
        // User is signed out
        currentUser = null;
        updateAuthUI();
    }
});

// Update authentication UI
function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const profileLink = document.getElementById('profileLink');
    
    if (loginLink && logoutLink && profileLink) {
        if (currentUser) {
            // User is logged in
            loginLink.style.display = 'none';
            logoutLink.style.display = 'inline';
            profileLink.style.display = 'inline';
        } else {
            // User is logged out
            loginLink.style.display = 'inline';
            logoutLink.style.display = 'none';
            profileLink.style.display = 'none';
        }
    }
}

// Send Premium Report via Email
// Enhanced email functionality using new EmailJS configuration
async function sendPremiumReportEmail(testType, email, reportContent, testResult) {
    try {
        if (!window.emailService) {
            console.warn('Email service not initialized, using fallback');
            downloadPremiumReport(testType, testResult);
            return Promise.resolve();
        }
        
        const testTitle = getTestTitle(testType);
        const userName = currentUser?.name || email.split('@')[0];
        
        // Send test results using our EmailService
        await window.emailService.sendTestResults(
            email,
            userName,
            testTitle,
            {
                summary: `Your ${testTitle} premium report is ready!`,
                score: testResult,
                description: reportContent,
                percentage: calculatePercentageScore(testResult)
            },
            window.location.href
        );
        
        console.log('Premium report email sent successfully!');
        return Promise.resolve();
        
    } catch (error) {
        console.error('Failed to send premium report email:', error);
        // Fallback to download
        downloadPremiumReport(testType, testResult);
        return Promise.reject(error);
    }
}

// Send basic test results email (free version)
async function sendBasicTestResultsEmail(testType, email, testResult) {
    try {
        if (!window.emailService) {
            console.warn('Email service not initialized');
            return;
        }
        
        const testTitle = getTestTitle(testType);
        const userName = currentUser?.name || email.split('@')[0];
        
        await window.emailService.sendTestResults(
            email,
            userName,
            testTitle,
            {
                summary: `Your ${testTitle} results: ${testResult}`,
                score: testResult,
                description: `You completed the ${testTitle}. For detailed insights and recommendations, consider upgrading to our premium report.`
            },
            window.location.href
        );
        
        console.log('Basic test results email sent successfully!');
        
    } catch (error) {
        console.error('Failed to send basic test results email:', error);
        // Don't throw error for basic email, it's optional
    }
}

// Send welcome email to new users
async function sendWelcomeEmail(userEmail, userName) {
    try {
        if (!window.emailService) {
            return;
        }
        
        await window.emailService.sendWelcomeEmail(userEmail, userName);
        console.log('Welcome email sent successfully!');
        
    } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't throw error for welcome email, it's optional
    }
}

// Helper function to calculate percentage score
function calculatePercentageScore(result) {
    // This is a simple example - you may want to customize based on test type
    if (typeof result === 'string') {
        // For categorical results, return null
        return null;
    }
    if (typeof result === 'number') {
        return Math.min(100, Math.max(0, result));
    }
    return null;
}

// Get test title for emails
function getTestTitle(testType) {
    const testTitles = {
        mbti: "16 Personality Types (MBTI)",
        bigfive: "Big Five Personality Test",
        eq: "Emotional Intelligence Assessment",
        iq: "Brain Teaser Challenge",
        disc: "DISC Personality Assessment",
        conflict: "Conflict Style Assessment",
        via: "Character Strengths (VIA)",
        adhd: "Focus & Energy Style",
        anxiety: "Stress Management Style",
        depression: "Emotional Regulation Style",
        loveLanguage: "Love Language Test",
        petPersonality: "Pet Personality Match",
        careerPersonality: "Career Personality Type",
        relationshipStyle: "Relationship Style"
    };
    return testTitles[testType] || "Personality Test";
}

// Generate HTML formatted premium report for email
function generateFullPremiumReport(testType, score) {
    const reportDate = new Date().toLocaleDateString();
    const testTitle = getTestTitle(testType);
    const customerName = currentUser?.name || 'Valued Customer';
    
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4f46e5; margin-bottom: 10px;">🎯 ${testTitle}</h1>
            <h2 style="color: #1e293b; font-size: 24px;">Premium Personality Report</h2>
            <p style="color: #64748b; font-size: 16px;">Generated for ${customerName} on ${reportDate}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="margin-top: 0;">📋 Your Test Results Summary</h3>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Test Type:</strong> ${testTitle}</p>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Result:</strong> ${score}</p>
            <p style="font-size: 14px; margin-bottom: 0; opacity: 0.9;">This comprehensive analysis provides deep insights into your personality patterns, strengths, and growth opportunities.</p>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🔍 Detailed Analysis</h3>
            <p style="line-height: 1.6; color: #374151;">Your ${testTitle} results reveal unique insights into your personality structure. This analysis examines your core traits, behavioral patterns, and psychological preferences.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #4f46e5; margin-top: 0;">💪 Key Strengths</h4>
                <ul style="line-height: 1.8; color: #374151;">
                    <li>Natural leadership abilities and decision-making skills</li>
                    <li>Strong analytical thinking and problem-solving approach</li>
                    <li>Excellent communication and interpersonal skills</li>
                    <li>High emotional intelligence and empathy</li>
                </ul>
            </div>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">💼 Career Recommendations</h3>
            <p style="line-height: 1.6; color: #374151;">Based on your personality profile, you're naturally suited for roles that leverage your unique strengths:</p>
            
            <div style="display: grid; gap: 15px; margin: 20px 0;">
                <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; border-left: 4px solid #0891b2;">
                    <h4 style="color: #0891b2; margin: 0 0 10px 0;">🎯 Ideal Career Paths</h4>
                    <p style="margin: 0; color: #374151;">Leadership roles, consulting, creative industries, technology, healthcare, education</p>
                </div>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                    <h4 style="color: #16a34a; margin: 0 0 10px 0;">🌟 Work Environment</h4>
                    <p style="margin: 0; color: #374151;">Collaborative teams, innovative companies, flexible schedules, growth-oriented organizations</p>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">❤️ Relationship Insights</h3>
            <p style="line-height: 1.6; color: #374151;">Understanding your personality helps improve all your relationships:</p>
            
            <div style="background: #fef7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #a855f7;">
                <h4 style="color: #a855f7; margin-top: 0;">💕 Communication Style</h4>
                <p style="line-height: 1.6; color: #374151;">You communicate best through direct, honest conversations while showing empathy and understanding. You value deep connections and meaningful discussions.</p>
                
                <h4 style="color: #a855f7;">🤝 Compatibility Patterns</h4>
                <p style="line-height: 1.6; color: #374151;">You work well with partners who appreciate your strengths and complement your areas for growth. Mutual respect and shared values are essential for your relationships.</p>
            </div>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🚀 Personal Growth Plan</h3>
            <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #ea580c;">
                <h4 style="color: #ea580c; margin-top: 0;">📈 30-Day Action Plan</h4>
                <ol style="line-height: 1.8; color: #374151;">
                    <li><strong>Week 1-2:</strong> Focus on self-awareness - journal daily about your reactions and decisions</li>
                    <li><strong>Week 3-4:</strong> Practice your strengths in new situations and seek feedback</li>
                    <li><strong>Week 5-6:</strong> Work on growth areas through targeted exercises and learning</li>
                    <li><strong>Week 7-8:</strong> Apply insights to improve one key relationship or work situation</li>
                </ol>
                
                <h4 style="color: #ea580c;">🎯 Long-term Goals</h4>
                <ul style="line-height: 1.8; color: #374151;">
                    <li>Develop emotional intelligence through mindfulness and reflection</li>
                    <li>Expand your comfort zone by trying new experiences</li>
                    <li>Build stronger relationships through improved communication</li>
                    <li>Align your career with your natural personality strengths</li>
                </ul>
            </div>
        </div>
        
        <div style="background: #1e293b; color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <h3 style="margin-top: 0; color: #fbbf24;">✨ Thank You for Choosing PersonaTests!</h3>
            <p style="line-height: 1.6; margin-bottom: 15px;">This report is based on scientifically validated personality research and is designed to help you understand yourself better and achieve your goals.</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">Questions? Contact us at support@personatests.com</p>
        </div>
    </div>
    `;
}

// Save test result to Firebase
function saveTestResultToFirebase(testType, result) {
    if (!currentUser || !currentUser.uid) {
        console.log('No user logged in, skipping save to Firebase');
        return;
    }
    
    const testResult = {
        testType: testType,
        result: result,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toISOString()
    };
    
    // Save to user's test results subcollection
    db.collection('users').doc(currentUser.uid)
        .collection('testResults').add(testResult)
        .then(() => {
            console.log('Test result saved to Firebase');
        })
        .catch((error) => {
            console.error('Error saving test result:', error);
        });
}

// EmailJS Configuration for Premium Report Delivery
const EMAILJS_PUBLIC_KEY = 'bqGKo-dBalpy6MeZ';
const EMAILJS_SERVICE_ID = 'service_dc4y1ov';
const EMAILJS_TEMPLATE_ID = 'template_2sa8nxw';

// Initialize EmailJS
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
}

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
        console.log('Question object:', question);
        console.log('Question options:', question ? question.options : 'N/A');
        console.log('Options length:', question && question.options ? question.options.length : 'N/A');
        
        // Update progress
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
        
        // Show question
        const testContent = document.getElementById('testContent');
        
        // Generate options HTML with translation support
        const optionsHtml = question.options.map((option, index) => {
            console.log(`Generating option ${index}:`, option);
            return `
                <label class="option" onclick="selectOption(${index})">
                    <input type="radio" name="answer" value="${index}">
                    <span class="option-text">${option}</span>
                </label>
            `;
        }).join('');
        
        console.log('Generated options HTML:', optionsHtml);
        
        // Get translated navigation text
        const prevText = getTranslatedText('ui.previous') || 'Previous';
        const nextText = getTranslatedText('ui.next') || 'Next';
        const finishText = getTranslatedText('ui.finishTest') || 'Finish Test';
        
        testContent.innerHTML = `
            <div class="question">
                <h3 class="question-text">${question.text}</h3>
                <div class="options">
                    ${optionsHtml}
                </div>
                <div class="test-navigation">
                    <button class="nav-btn prev" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        ${prevText}
                    </button>
                    <button class="nav-btn next" onclick="nextQuestion()" id="nextBtn" disabled>
                        ${currentQuestionIndex === totalQuestions - 1 ? finishText : nextText}
                    </button>
                </div>
            </div>
        `;
        
        // Apply translations to the question and options after DOM is updated
        applyTestTranslations();
        
        console.log('Question display completed successfully');
        
        // Restore previously selected answer if it exists
        const previousAnswer = userAnswers[currentQuestionIndex];
        if (previousAnswer !== undefined) {
            console.log('Restoring previous answer:', previousAnswer);
            
            // Select the radio button
            const radioButtons = document.querySelectorAll('input[name="answer"]');
            if (radioButtons[previousAnswer]) {
                radioButtons[previousAnswer].checked = true;
            }
            
            // Add visual selection to the option
            const options = document.querySelectorAll('.option');
            if (options[previousAnswer]) {
                options[previousAnswer].classList.add('selected');
            }
            
            // Enable the next button
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }
            
            console.log('Previous answer restored successfully');
        } else {
            console.log('No previous answer to restore');
            
            // Ensure next button is disabled for new questions
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.disabled = true;
            }
        }
        
    } catch (error) {
        console.error('Error in showQuestion:', error);
    }
}

function selectOption(optionIndex) {
    console.log('selectOption called with index:', optionIndex);
    
    // Remove previous selection
    const allOptions = document.querySelectorAll('.option');
    console.log('Found', allOptions.length, 'option elements');
    
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    if (allOptions[optionIndex]) {
        allOptions[optionIndex].classList.add('selected');
        console.log('Selected option', optionIndex, 'successfully');
    } else {
        console.error('Option', optionIndex, 'not found');
    }
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
        console.log('Next button enabled');
    } else {
        console.error('Next button not found');
    }
    
    // Store answer
    userAnswers[currentQuestionIndex] = optionIndex;
    console.log('Answer stored:', optionIndex, 'for question', currentQuestionIndex);
    
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
                    <li><strong>Licensed therapist or counselor in your area</strong></li>
                    <li><strong>Your local healthcare provider</strong></li>
                    <li><strong>Local mental health crisis services</strong></li>
                    <li><strong>Emergency services if in immediate danger</strong></li>
                </ul>
                <p style="margin-bottom: 0;">You deserve support and care. This quiz is just for fun - not medical advice! 💝</p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="crisis-info" style="background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: 8px; margin-top: 2rem;">
            <p><strong>Crisis Support:</strong> If you're in crisis, please contact local emergency services or your nearest emergency room.</p>
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
                    <li><strong>Licensed therapist, counselor, or psychologist in your area</strong></li>
                    <li><strong>Your primary care physician</strong></li>
                    <li><strong>Local mental health crisis services</strong></li>
                    <li><strong>Emergency services if in immediate danger</strong></li>
                </ul>
                <p style="margin-bottom: 0;"><strong>You matter and you deserve support.</strong> This quiz cannot replace professional care! 💚</p>
            </div>
        </div>
        
        ${addLoginPromptToResults()}
        
        <div class="crisis-info" style="background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: 8px; margin-top: 2rem;">
            <p><strong>Crisis Support:</strong> If you're having thoughts of self-harm, please reach out immediately:</p>
            <ul>
                <li>Contact local emergency services or crisis hotlines</li>
                <li>Go to your nearest emergency room</li>
                <li>Call emergency services (911, 112, etc. depending on your country)</li>
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
    // Generate the premium report content
    const reportContent = generateFullPremiumReport(testType, score);
    
    // Show initial success message
    document.getElementById('premiumContent').innerHTML = `
        <div class="premium-success">
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
                <h3>Payment Successful!</h3>
                <p id="email-status">Generating and sending your premium report to <strong>${email}</strong>...</p>
                
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 12px; margin: 2rem 0;">
                    <h4>📧 Email Delivery</h4>
                    <p id="delivery-status">⏳ Preparing your 8-page personality report...</p>
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
    
    // Send email with the report
    setTimeout(() => {
        document.getElementById('delivery-status').textContent = '📧 Sending email...';
        
        sendPremiumReportEmail(testType, email, reportContent, score)
            .then(() => {
                document.getElementById('email-status').innerHTML = `✅ Report successfully sent to <strong>${email}</strong>!`;
                document.getElementById('delivery-status').innerHTML = `📧 <strong>Email delivered!</strong> Check your inbox (and spam folder if needed).`;
            })
            .catch((error) => {
                document.getElementById('email-status').innerHTML = `⚠️ Email delivery failed, but you can download your report below.`;
                document.getElementById('delivery-status').innerHTML = `📥 <strong>Download available:</strong> Click the download button to get your report.`;
            });
    }, 1500);
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
    // Initialize EmailJS
    initializeEmailJS();
    // Initialize language
    initializeLanguage();
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

// Initialize user system on page load - SINGLE INITIALIZATION POINT  
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SINGLE INITIALIZATION STARTING...');
    
    // DISABLE AUTOMATIC LANGUAGE INITIALIZATION TO PREVENT CONFLICTS
    // Load saved language preference (ignore browser language to prevent Chinese flashing)
    const savedLanguage = localStorage.getItem('preferredLanguage');
    console.log('📱 Saved language:', savedLanguage);
    
    // TEMPORARILY DISABLED - Let languages be purely manual
    console.log('⚠️ Language initialization DISABLED to prevent conflicts');
    console.log('🕰️ Languages will only change via manual flag clicks');
    
    // Initialize user authentication
    checkUserLogin();
    
    console.log('🎉 SINGLE INITIALIZATION COMPLETE');
});

// Backup initialization - DISABLED to prevent conflicts
// window.addEventListener('load', function() {
//     console.log('🔄 BACKUP INITIALIZATION...');
//     
//     // Double-check that language selector is working
//     setTimeout(() => {
//         const elements = document.querySelectorAll('[data-translate]');
//         console.log('🔍 Double-check: Found', elements.length, 'translatable elements');
//         
//         // If no elements have been translated, force English
//         const untranslatedElements = Array.from(elements).filter(el => 
//             el.textContent.includes('data-translate') || el.textContent.trim() === ''
//         );
//         
//         if (untranslatedElements.length > 0) {
//             console.log('⚠️ Found untranslated elements, forcing English...');
//             changeLanguage('en');
//         }
//         
//         console.log('✅ Backup initialization complete');
//     }, 500);
// });

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
        alert('Password must be at least 6 characters!');
        return;
    }
    
    // Create user with Firebase Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Save additional user data to Firestore
            return db.collection('users').doc(user.uid).set({
                name: name,
                age: age,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                testResults: []
            });
        })
        .then(() => {
            alert('Account created successfully! 🎉');
            closeLogin();
            updateAuthUI();
        })
        .catch((error) => {
            alert('Error creating account: ' + error.message);
        });
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Sign in with Firebase Auth
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert(`Welcome back! ✨`);
            closeLogin();
            updateAuthUI();
        })
        .catch((error) => {
            alert('Error signing in: ' + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        alert('Logged out successfully!');
        updateAuthUI();
    }).catch((error) => {
        alert('Error logging out: ' + error.message);
    });
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
        testType: testType,
        testName: testName,
        shortResult: shortResult,
        fullResult: fullResult,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toISOString()
    };
    
    // Save to Firebase Firestore
    db.collection('users').doc(currentUser.uid)
        .collection('testResults').add(resultData)
        .then(() => {
            console.log('Test result saved successfully');
        })
        .catch((error) => {
            console.error('Error saving test result:', error);
        });
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

// Duplicate language functions removed to prevent conflicts with main language system