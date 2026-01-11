/* ========================================
   ASTRA - Internationalization (i18n)
   Language Support: EN, ES, FR, HI
   ======================================== */

const TRANSLATIONS = {
    // =========================================================================
    // ENGLISH (Default)
    // =========================================================================
    en: {
        // Navigation
        nav_stress: "Stress Check",
        nav_crew: "Crew Status",
        nav_relax: "Relaxation",
        nav_login: "Login",
        nav_logout: "Logout",

        // Status & Time
        status_online: "Online",
        status_offline: "Offline",
        status_connected: "Connected",
        status_syncing: "Syncing...",
        time_just_now: "Just now",
        time_m_ago: "{m}m ago",
        time_h_ago: "{h}h ago",
        time_d_ago: "{d}d ago",
        time_never: "Never",

        // Login Page
        login_welcome: "Welcome to ASTRA",
        login_subtitle: "Your AI Wellness Companion for Space Missions",
        tab_login: "Login",
        tab_signup: "Sign Up",
        label_email: "Email Address",
        placeholder_email: "astronaut@space.station",
        label_password: "Password",
        link_forgot_password: "Forgot Password?",
        btn_login: "Launch Into ASTRA",
        label_name: "Astronaut Name",
        placeholder_name: "Commander Nova",
        hint_password_min: "Minimum 6 characters",
        label_confirm_password: "Confirm Password",
        btn_signup: "Create Account",
        text_or_continue: "or continue with",
        btn_guest: "Continue as Guest Astronaut",
        link_back_home: "← Back to Home",
        login_quote: "\"The stars are not meant to be gazed upon alone. ASTRA is here to ensure no astronaut ever feels isolated.\"",
        login_mission_stmt: "— ASTRA Mission Statement",
        modal_reset_title: "Reset Password",
        modal_reset_desc: "Enter your email address and we'll send you a link to reset your password.",
        btn_cancel: "Cancel",
        btn_send_link: "Send Reset Link",

        // Auth Errors & Toasts
        auth_email_in_use: "This email is already registered",
        auth_invalid_email: "Please enter a valid email address",
        auth_operation_not_allowed: "Operation not allowed",
        auth_weak_password: "Password should be at least 6 characters",
        auth_user_disabled: "This account has been disabled",
        auth_user_not_found: "No account found with this email",
        auth_wrong_password: "Incorrect password",
        auth_too_many_requests: "Too many attempts. Please try again later",
        auth_network_error: "Network error. Please check your connection",
        auth_unknown_error: "An error occurred. Please try again",
        toast_welcome: "Welcome!",
        toast_welcome_back: "Welcome back!",
        toast_login_success: "Logged in successfully",
        toast_login_failed: "Login Failed",
        toast_signup_success: "Account created successfully",
        toast_signup_failed: "Sign Up Failed",
        toast_anon_login_success: "Signed in as {name}",
        toast_logged_out: "Logged Out",
        toast_logout_msg: "See you soon, Astronaut!",
        toast_logout_failed: "Failed to logout",
        toast_error: "Error",
        toast_email_sent: "Email Sent",
        toast_reset_msg: "Check your inbox for password reset link",
        
        // Home/Stress Check
        welcome_title: "Welcome, Astronaut",
        welcome_subtitle: "ASTRA monitors your well-being and provides real-time support during your mission. Let's check your current stress levels.",
        stress_card_title: "Stress Detection",
        stress_card_subtitle: "Input your current metrics",
        label_sleep: "Sleep Hours (Last 24h)",
        hint_sleep: "Recommended: 7-9 hours",
        label_mood: "Mood Level:",
        mood_low: "😔 Low",
        mood_neutral: "😐 Neutral",
        mood_great: "😊 Great",
        label_heart_rate: "Heart Rate (BPM)",
        btn_simulate: "Simulate",
        hint_heart_rate: "Normal resting: 60-100 BPM",
        label_activity: "Physical Activity Today",
        activity_none: "No Exercise",
        activity_light: "Light (15-30 min)",
        activity_moderate: "Moderate (30-60 min)",
        activity_intense: "Intense (60+ min)",
        btn_analyze: "Analyze Stress Level",
        
        // Stress Results & Recommendations
        rec_title: "ASTRA Recommendations",
        rec_subtitle: "Personalized support for you",
        result_title: "Current Stress Level",
        result_score_label: "Stress Score",
        result_awaiting: "Awaiting Data",
        result_instruction: "Enter your metrics above and click \"Analyze\" to check your stress level.",
        summary_title: "Today's Summary",
        label_last_check: "Last Check",
        label_checks_today: "Checks Today",
        label_avg_stress: "Avg Stress",
        label_crew_online: "Crew Online",
        alert_title: "Crew Alert",
        alert_msg: "A crew member needs support",
        alert_msg_generated: "{name} is experiencing high stress and may need support.",
        btn_view: "View",
        modal_stress_title: "High Stress Detected",
        modal_stress_msg: "ASTRA has detected elevated stress levels. Your crew has been notified. Please take a moment to relax.",
        btn_play_game: "Play Relaxation Game",
        btn_talk_astra: "Talk to ASTRA",
        btn_dismiss: "Dismiss",
        toast_analysis_complete: "Analysis Complete",
        toast_stress_level: "Stress level",
        toast_hr_simulated: "Heart Rate Simulated",
        toast_hr_simulated_msg: "{rate} BPM detected",

        // Stress Logic Strings
        factor_sleep_severe: "severely inadequate sleep",
        factor_sleep_low: "insufficient sleep",
        factor_sleep_mild: "slightly low sleep",
        factor_sleep_excess: "excessive sleep",
        factor_mood_very_low: "very low mood",
        factor_mood_low: "low mood",
        factor_mood_neutral: "neutral mood",
        factor_hr_low: "unusually low heart rate",
        factor_hr_high: "elevated heart rate",
        factor_hr_mild: "slightly elevated heart rate",
        factor_activity_none: "no physical activity",
        stress_low: "Low",
        stress_medium: "Medium",
        stress_high: "High",
        expl_low: "Your vitals and well-being indicators are within optimal range. Keep maintaining your healthy routines!",
        expl_med_factors: "Moderate stress detected. Contributing factors: {factors}. Consider taking short breaks.",
        expl_med: "Moderate stress levels detected. Consider incorporating relaxation activities.",
        expl_high_factors: "High stress detected! Key concerns: {factors}. Immediate attention recommended.",
        expl_high: "High stress levels detected. Please take immediate steps to relax and consider reaching out for support.",
        label_stress: "Stress",

        // Recommendation Items
        rec_breath_title: "Breathing Exercise",
        rec_breath_desc: "Take 5 minutes for deep breathing. Inhale for 4 seconds, hold for 4, exhale for 6.",
        btn_start_now: "Start Now",
        rec_chat_title: "Talk to ASTRA",
        rec_chat_desc: "Share what's on your mind. I'm here to listen and provide support.",
        btn_open_chat: "Open Chat",
        rec_rest_title: "Rest Reminder",
        rec_rest_desc: "You've had only {hours} hours of sleep. Consider scheduling a 20-minute power nap.",
        btn_set_reminder: "Set Reminder",
        rec_game_title: "Stress-Relief Game",
        rec_game_desc: "Play a calming space game to shift your focus and improve your mood.",
        btn_play_now: "Play Now",
        rec_relax_title: "Relaxation Exercise",
        rec_relax_desc: "Your heart rate is elevated. Try progressive muscle relaxation to calm down.",
        btn_learn_more: "Learn More",
        rec_activity_title: "Physical Activity",
        rec_activity_desc: "Light exercise can significantly reduce stress. Try 15 minutes of stretching.",
        btn_view_exercises: "View Exercises",
        rec_great_title: "Great Work!",
        rec_great_desc: "Your stress levels are optimal. Keep up your healthy habits!",
        rec_crew_title: "Connect with Crew",
        rec_crew_desc: "Social connection can help reduce stress. Check in with your crewmates.",
        btn_view_crew: "View Crew",

        // Analytics & Reports (NEW)
        history_title: "Stress History",
        report_title: "Weekly Report",
        loading_report: "Loading weekly analysis...",
        label_stress_score: "Stress Score",
        report_no_data: "Not enough data for a weekly report yet.",
        label_weekly_avg: "Average Stress",
        label_trend: "Trend",
        trend_stable: "Stable",
        trend_improving: "Improving",
        trend_worsening: "Worsening",
        label_suggestion: "AI Suggestion",
        suggestion_general: "Maintain a balanced routine.",
        suggestion_sleep: "Focus on improving sleep quality.",
        suggestion_mood: "Try relaxation games to boost mood.",
        suggestion_heart: "Practice breathing exercises daily.",
        report_footer: "Based on your last {count} check-ins",

        // Crew Dashboard
        crew_title: "Crew Status Dashboard",
        crew_subtitle: "Real-time monitoring of your crewmates' well-being. Privacy-first: only stress levels are shared.",
        btn_notifications: "Notifications",
        btn_refresh: "Refresh",
        stat_total_crew: "Total Crew",
        stat_online_now: "Online Now",
        stat_active_alerts: "Active Alerts",
        stat_need_support: "Need Support",
        crew_list_title: "Crew Members",
        crew_list_subtitle: "Real-time status updates",
        filter_all: "All",
        filter_online: "Online",
        filter_high_stress: "High Stress",
        loading_crew: "Loading crew data...",
        privacy_title: "Privacy First",
        privacy_msg: "Only stress levels (Low/Medium/High) are shared with the crew. Individual health metrics, sleep data, and personal details remain private.",
        alerts_section_title: "Active Alerts",
        alerts_section_subtitle: "Crew members needing support",
        alerts_all_clear_title: "All Clear",
        alerts_all_clear_msg: "No active alerts. Everyone is doing well!",
        alert_attention_title: "Attention Required",
        alert_attention_msg: "One or more crew members are experiencing high stress levels.",
        qa_title: "Quick Actions",
        qa_check_stress: "Check Your Stress",
        qa_check_stress_sub: "Run a quick analysis",
        qa_games: "Relaxation Games",
        qa_games_sub: "De-stress with mini-games",
        qa_chat: "Talk to ASTRA",
        qa_chat_sub: "Get emotional support",
        connected_mode_title: "Connected Mode",
        connected_mode_sub: "Real-time sync active",
        connected_mode_msg: "ASTRA is synchronized with the crew network. All stress updates and alerts are shared in real-time.",
        last_sync_now: "Last sync: Just now",
        crew_filter_empty: "No crew members match this filter.",
        crew_empty_title: "No Crew Members Found",
        crew_empty_msg: "Crew members will appear here once they log in.",
        unknown_astronaut: "Unknown Astronaut",
        role_astronaut: "Astronaut",
        label_you: "(You)",
        btn_offer_support: "Offer Support",
        label_last_check_card: "Last check",
        mood_low_stress: "Low Stress",
        mood_medium_stress: "Medium Stress",
        mood_high_stress: "High Stress",
        btn_dismiss_alert: "Dismiss alert",
        toast_alert_dismissed: "Alert Dismissed",
        toast_alert_ack: "The alert has been acknowledged",
        error_title: "Error",
        error_dismiss_alert: "Failed to dismiss alert",
        crew_member: "A crew member",
        support_msg: "{name} is checking in on you and offering support.",
        toast_support_sent_msg: "{name} has been notified that you're thinking of them",
        toast_support_sent: "Support Offered",
        error_send_support: "Failed to send support notification",
        toast_crew_alert: "Crew Alert",
        toast_notif_enabled: "Notifications Enabled",
        toast_notif_msg: "You will receive crew alerts",
        toast_data_refreshed: "Data Refreshed",
        toast_data_uptodate: "Crew data is up to date",
        error_connection: "Connection Error",
        error_load_crew: "Unable to load crew data",

        // Games Page
        games_title: "Relaxation Zone",
        games_subtitle: "Take a break and reduce stress with these calming space-themed activities. Your mental health matters, astronaut.",
        tab_breathing: "Breathing Exercise",
        tab_star: "Star Catcher",
        tab_constellation: "Constellation Connect",
        
        // Breathing Game
        breath_title: "Guided Breathing",
        breath_desc: "Follow the expanding and contracting circle to regulate your breathing. This technique helps reduce stress and anxiety.",
        breath_select_cycles: "Select number of cycles:",
        breath_cycles_3: "3 cycles",
        breath_cycles_5: "5 cycles",
        breath_cycles_10: "10 cycles",
        btn_start_breath: "Begin Exercise",
        breath_benefit_1: "Reduces Anxiety",
        breath_benefit_2: "Lowers Heart Rate",
        breath_benefit_3: "Improves Focus",
        breath_progress: "Progress",
        breath_phase_in: "Breathe In...",
        breath_phase_hold: "Hold...",
        breath_phase_out: "Breathe Out...",
        breath_phase_rest: "Rest...",
        breath_cycle_count: "Cycle {current} of {total}",
        btn_stop_breath: "Stop Exercise",
        breath_complete_title: "Exercise Complete!",
        breath_complete_msg: "Great work, astronaut! Take a moment to notice how you feel. Your body and mind thank you.",
        breath_stat_duration: "Duration",
        breath_stat_cycles: "Cycles",
        btn_another_session: "Do Another Session",
        btn_back_dashboard: "Back to Dashboard",
        toast_well_done: "Well Done!",
        toast_breath_complete: "Breathing exercise complete. Feel more relaxed?",

        // Star Catcher Game
        star_title: "Star Catcher",
        star_desc: "Click on the glowing stars before they fade away. Build combos for bonus points! A calming way to focus your mind.",
        btn_start_star: "Start Game",
        label_score: "Score:",
        label_combo: "Combo:",
        label_level: "Level:",
        label_time: "Time:",
        game_over: "Game Over!",
        star_game_over_msg: "Great job catching those stars!",
        star_final_score: "Final Score",
        star_max_combo: "Max Combo",
        btn_play_again: "Play Again",
        btn_back_menu: "Back to Menu",
        star_msg_stellar: "🌟 Stellar Performance! You're a true star catcher!",
        star_msg_great: "✨ Great job! The cosmos is proud of you!",
        star_msg_good: "⭐ Good effort! Keep reaching for the stars!",
        star_msg_nice: "💫 Nice try! Every astronaut starts somewhere!",
        toast_score_msg: "You scored {score} points",
        toast_game_complete: "Game Complete!",

        // Constellation Game
        constellation_title: "Constellation Connect",
        constellation_desc: "Connect the stars to form famous constellations. Click on two stars to draw a line between them. A meditative pattern-matching experience.",
        const_orion: "Orion",
        const_big_dipper: "Big Dipper",
        const_cassiopeia: "Cassiopeia",
        btn_start_connect: "Start Connecting",
        label_constellation: "Constellation:",
        label_progress: "Progress:",
        constellation_instruction: "Click two stars to connect them. Form all the correct connections to complete the constellation.",
        constellation_complete_title: "Constellation Master!",
        constellation_complete_msg: "You've connected all the constellations! The night sky bows to your cosmic knowledge.",
        const_constellations: "Constellations",
        const_connect: "Connect: {name}",
        toast_const_master: "Constellation Master!",

        // Games Footer
        why_games_title: "Why Relaxation Games?",
        why_games_desc: "Studies show that brief, mindful gaming sessions can significantly reduce cortisol levels and improve mood. These activities provide a healthy distraction, helping astronauts maintain mental clarity and emotional balance during long missions.",
        footer_check_stress: "Check Your Stress Level",
        footer_check_stress_sub: "See how relaxation affected you",
        footer_talk_astra: "Talk to ASTRA",
        footer_talk_astra_sub: "Get emotional support anytime",

        // Chatbot
        chat_welcome: "Hello, Astronaut! I'm ASTRA, your AI wellness companion. How can I support you today? 🚀",
        chat_placeholder: "Type a message...",
        chat_safety_block: "I want to help, but I need to be careful with my response. Could you rephrase that? I'm here to support you. 💙",
        
        // Chatbot Fallbacks
        fallback_stress_1: "I hear you, and it's completely normal to feel stressed in space. Let's take a moment together. Try taking 3 deep breaths with me - inhale for 4 counts, hold for 4, exhale for 6. 🌟",
        fallback_stress_2: "Space missions can be overwhelming. Remember, even the brightest stars need darkness to shine. Would you like to try a quick breathing exercise?",
        fallback_stress_3: "Your feelings are valid. Stress in isolation is challenging. Let's focus on what you can control right now. Have you had enough sleep lately? 💫",
        fallback_lonely_1: "Missing Earth and loved ones is one of the hardest parts of space travel. Your feelings matter. Would you like to share a favorite memory from home? 🌍",
        fallback_lonely_2: "You're millions of miles from home, but you're not alone. Your crew is with you, and I'm always here. What's something you're looking forward to when you return?",
        fallback_lonely_3: "The distance can feel immense, but your connections remain. Remember, every star you see has its own story of connection across vast distances. 💫",
        fallback_sleep_1: "Sleep in microgravity can be challenging. Try dimming your lights 30 minutes before rest, and avoid screens. Would you like me to guide you through a relaxation technique? 🌙",
        fallback_sleep_2: "Rest is crucial for your mission and well-being. If you're having trouble sleeping, try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8.",
        fallback_sleep_3: "Your body is adapting to an extraordinary environment. Be patient with yourself. A consistent sleep schedule can help, even in orbit. 😴",
        fallback_positive_1: "That's wonderful to hear! 🚀 Keep riding that positive momentum. What's something that made you feel good today?",
        fallback_positive_2: "Fantastic! Your positive energy is valuable for the whole crew. Remember to store these good feelings - they'll help during tougher times. ⭐",
        fallback_positive_3: "I'm so glad you're doing well! Maintaining positivity in space is an achievement. Keep up the great work, astronaut! 💪",
        fallback_greeting_1: "Hello, astronaut! It's great to hear from you. How are you feeling today? I'm here to support you. 🚀",
        fallback_greeting_2: "Hey there! I hope your mission is going well. Is there anything on your mind you'd like to talk about?",
        fallback_greeting_3: "Hi! I'm always here for you, whether you need to vent, need advice, or just want some company. What's up? ⭐",
        fallback_help_1: "I'm here to help. You can talk to me about stress, sleep issues, loneliness, or anything else on your mind. What would you like to discuss? 💫",
        fallback_help_2: "Of course, I'm here for you. Whether you need emotional support, stress relief techniques, or just someone to listen, I'm ready. What's going on?",
        fallback_help_3: "You've come to the right place. Tell me what's troubling you, and we'll work through it together. 🌟",
        fallback_thank_1: "You're very welcome! Remember, supporting you is my purpose. I'm always here when you need me. 🚀",
        fallback_thank_2: "Anytime, astronaut! Taking care of your mental health is important. Don't hesitate to reach out again. ⭐",
        fallback_thank_3: "I'm glad I could help! Keep being kind to yourself - you're doing amazing work up there. 💫",
        fallback_default_1: "I'm here to listen and support you. Could you tell me more about what's on your mind? 🌟",
        fallback_default_2: "Thank you for sharing. I'm here for you, whether it's about stress, sleep, emotions, or just needing to talk. What would help you most right now?",
        fallback_default_3: "I want to make sure I understand and support you best. Can you tell me a bit more about how you're feeling? 💫",
        fallback_default_4: "Every conversation helps me understand you better. Feel free to share what's on your mind - no topic is too big or small. 🚀"
    },

    // =========================================================================
    // SPANISH (Español)
    // =========================================================================
    es: {
        nav_stress: "Chequeo de Estrés",
        nav_crew: "Estado de Tripulación",
        nav_relax: "Relajación",
        nav_login: "Iniciar Sesión",
        nav_logout: "Cerrar Sesión",
        status_online: "En línea",
        status_offline: "Desconectado",
        status_connected: "Conectado",
        status_syncing: "Sincronizando...",
        time_just_now: "Ahora mismo",
        time_m_ago: "hace {m}m",
        time_h_ago: "hace {h}h",
        time_d_ago: "hace {d}d",
        login_welcome: "Bienvenido a ASTRA",
        login_subtitle: "Tu Compañero de Bienestar para Misiones Espaciales",
        tab_login: "Entrar",
        tab_signup: "Registrarse",
        label_email: "Correo Electrónico",
        placeholder_email: "astronauta@estacion.espacial",
        label_password: "Contraseña",
        btn_login: "Lanzar ASTRA",
        btn_guest: "Continuar como Invitado",
        welcome_title: "Bienvenido, Astronauta",
        welcome_subtitle: "ASTRA monitorea tu bienestar y brinda apoyo en tiempo real. Revisemos tus niveles de estrés.",
        stress_card_title: "Detección de Estrés",
        stress_card_subtitle: "Ingresa tus métricas actuales",
        label_sleep: "Horas de Sueño",
        label_mood: "Nivel de Ánimo:",
        mood_low: "😔 Bajo",
        mood_neutral: "😐 Neutro",
        mood_great: "😊 Genial",
        btn_analyze: "Analizar Nivel de Estrés",
        rec_title: "Recomendaciones ASTRA",
        result_title: "Nivel de Estrés Actual",
        result_score_label: "Puntaje de Estrés",
        alert_msg_generated: "{name} está experimentando mucho estrés y podría necesitar apoyo.",
        modal_stress_title: "Alto Estrés Detectado",
        modal_stress_msg: "ASTRA ha detectado niveles elevados de estrés. Tu tripulación ha sido notificada. Por favor, relájate un momento.",
        btn_play_game: "Jugar Juego de Relajación",
        btn_talk_astra: "Hablar con ASTRA",
        chat_welcome: "¡Hola, Astronauta! Soy ASTRA, tu compañero de bienestar. ¿Cómo puedo apoyarte hoy? 🚀",
        chat_placeholder: "Escribe un mensaje...",
        stress_low: "Bajo",
        stress_medium: "Medio",
        stress_high: "Alto",
        rec_breath_title: "Ejercicio de Respiración",
        rec_breath_desc: "Tómate 5 minutos para respirar profundamente.",
        btn_start_now: "Empezar Ahora",
        games_title: "Zona de Relajación",
        games_subtitle: "Tómate un descanso y reduce el estrés con estas actividades espaciales.",
        tab_breathing: "Respiración",
        tab_star: "Caza Estrellas",
        tab_constellation: "Constelaciones",
        breath_title: "Respiración Guiada",
        breath_phase_in: "Inhala...",
        breath_phase_hold: "Mantén...",
        breath_phase_out: "Exhala...",
        breath_phase_rest: "Descansa...",
        star_title: "Caza Estrellas",
        star_desc: "Haz clic en las estrellas brillantes antes de que desaparezcan.",
        constellation_title: "Conectar Constelaciones",
        constellation_desc: "Conecta las estrellas para formar constelaciones famosas.",
        crew_title: "Panel de Tripulación",
        crew_list_title: "Miembros de la Tripulación",
        privacy_title: "Privacidad Primero",
        privacy_msg: "Solo los niveles de estrés son compartidos con la tripulación.",
        btn_offer_support: "Ofrecer Apoyo",
        toast_support_sent: "Apoyo Enviado",
        toast_crew_alert: "Alerta de Tripulación",
        fallback_default_1: "Estoy aquí para escucharte y apoyarte. ¿Podrías contarme más sobre lo que piensas? 🌟",
        
        // Analytics & Reports (NEW)
        history_title: "Historial de Estrés",
        report_title: "Reporte Semanal",
        loading_report: "Cargando análisis...",
        label_stress_score: "Puntaje de Estrés",
        report_no_data: "No hay suficientes datos aún.",
        label_weekly_avg: "Promedio",
        label_trend: "Tendencia",
        trend_stable: "Estable",
        trend_improving: "Mejorando",
        trend_worsening: "Empeorando",
        label_suggestion: "Sugerencia IA",
        suggestion_general: "Mantén una rutina equilibrada.",
        suggestion_sleep: "Mejora la calidad del sueño.",
        suggestion_mood: "Prueba juegos de relajación.",
        suggestion_heart: "Practica ejercicios de respiración.",
        report_footer: "Basado en tus últimos {count} registros"
    },

    // =========================================================================
    // FRENCH (Français)
    // =========================================================================
    fr: {
        nav_stress: "Bilan Stress",
        nav_crew: "État d'Équipage",
        nav_relax: "Relaxation",
        nav_login: "Connexion",
        nav_logout: "Déconnexion",
        status_online: "En ligne",
        status_offline: "Hors ligne",
        status_connected: "Connecté",
        time_just_now: "À l'instant",
        time_m_ago: "il y a {m}m",
        login_welcome: "Bienvenue sur ASTRA",
        login_subtitle: "Votre Compagnon IA pour les Missions Spatiales",
        label_email: "Adresse Email",
        btn_login: "Lancer ASTRA",
        welcome_title: "Bienvenue, Astronaute",
        welcome_subtitle: "ASTRA surveille votre bien-être. Vérifions votre niveau de stress actuel.",
        stress_card_title: "Détection de Stress",
        label_sleep: "Heures de Sommeil",
        label_mood: "Humeur:",
        mood_low: "😔 Basse",
        mood_neutral: "😐 Neutre",
        mood_great: "😊 Super",
        btn_analyze: "Analyser le Stress",
        rec_title: "Recommandations ASTRA",
        result_title: "Niveau de Stress Actuel",
        alert_msg_generated: "{name} subit un stress élevé et peut avoir besoin de soutien.",
        modal_stress_title: "Stress Élevé Détecté",
        modal_stress_msg: "ASTRA a détecté un stress élevé. Votre équipage a été notifié. Prenez un moment pour vous détendre.",
        btn_play_game: "Jouer à un Jeu",
        btn_talk_astra: "Parler à ASTRA",
        chat_welcome: "Bonjour, Astronaute ! Je suis ASTRA. Comment puis-je vous aider aujourd'hui ? 🚀",
        chat_placeholder: "Écrivez un message...",
        stress_low: "Faible",
        stress_medium: "Moyen",
        stress_high: "Élevé",
        rec_breath_title: "Exercice de Respiration",
        rec_breath_desc: "Prenez 5 minutes pour respirer profondément.",
        games_title: "Zone de Relaxation",
        tab_breathing: "Respiration",
        tab_star: "Attrape Étoiles",
        tab_constellation: "Constellations",
        breath_title: "Respiration Guidée",
        breath_phase_in: "Inspirez...",
        breath_phase_hold: "Retenez...",
        breath_phase_out: "Expirez...",
        star_title: "Attrape Étoiles",
        constellation_title: "Relier les Constellations",
        crew_title: "Tableau de Bord Équipage",
        btn_offer_support: "Offrir du Soutien",
        fallback_default_1: "Je suis là pour vous écouter. Pouvez-vous m'en dire plus ? 🌟",
        
        // Analytics & Reports (NEW)
        history_title: "Historique de Stress",
        report_title: "Rapport Hebdomadaire",
        loading_report: "Chargement de l'analyse...",
        label_stress_score: "Score de Stress",
        report_no_data: "Pas assez de données pour le moment.",
        label_weekly_avg: "Moyenne",
        label_trend: "Tendance",
        trend_stable: "Stable",
        trend_improving: "En amélioration",
        trend_worsening: "En aggravation",
        label_suggestion: "Suggestion IA",
        suggestion_general: "Maintenez une routine équilibrée.",
        suggestion_sleep: "Améliorez la qualité du sommeil.",
        suggestion_mood: "Essayez des jeux de relaxation.",
        suggestion_heart: "Pratiquez la respiration.",
        report_footer: "Basé sur vos {count} derniers contrôles"
    },

    // =========================================================================
    // HINDI (हिन्दी)
    // =========================================================================
    hi: {
        nav_stress: "तनाव जांच",
        nav_crew: "क्रू स्थिति",
        nav_relax: "विश्राम",
        nav_login: "लॉगिन",
        nav_logout: "लॉग आउट",
        status_online: "ऑनलाइन",
        status_offline: "ऑफलाइन",
        status_connected: "कनेक्टेड",
        time_just_now: "अभी",
        time_m_ago: "{m} मिनट पहले",
        login_welcome: "ASTRA में स्वागत है",
        login_subtitle: "अंतरिक्ष मिशन के लिए आपका AI साथी",
        label_email: "ईमेल पता",
        btn_login: "ASTRA लॉन्च करें",
        welcome_title: "स्वागत है, अंतरिक्ष यात्री",
        welcome_subtitle: "ASTRA आपकी भलाई की निगरानी करता है। आइए आपके तनाव के स्तर की जांच करें।",
        stress_card_title: "तनाव का पता लगाना",
        label_sleep: "नींद के घंटे",
        label_mood: "मनोदशा:",
        mood_low: "😔 उदास",
        mood_neutral: "😐 सामान्य",
        mood_great: "😊 खुश",
        btn_analyze: "तनाव का विश्लेषण करें",
        rec_title: "ASTRA सुझाव",
        result_title: "वर्तमान तनाव स्तर",
        alert_msg_generated: "{name} उच्च तनाव का अनुभव कर रहे हैं और उन्हें सहायता की आवश्यकता हो सकती है।",
        modal_stress_title: "उच्च तनाव का पता चला",
        modal_stress_msg: "ASTRA ने उच्च तनाव का पता लगाया है। आपके साथियों को सूचित कर दिया गया है। कृपया आराम करें।",
        btn_play_game: "गेम खेलें",
        btn_talk_astra: "ASTRA से बात करें",
        chat_welcome: "नमस्ते! मैं ASTRA हूँ, आपका AI साथी। मैं आपकी कैसे मदद कर सकता हूँ? 🚀",
        chat_placeholder: "संदेश लिखें...",
        stress_low: "कम",
        stress_medium: "मध्यम",
        stress_high: "उच्च",
        rec_breath_title: "सांस लेने का व्यायाम",
        rec_breath_desc: "गहरी सांस लेने के लिए 5 मिनट निकालें।",
        games_title: "विश्राम क्षेत्र",
        tab_breathing: "सांस",
        tab_star: "तारे पकड़ें",
        tab_constellation: "नक्षत्र",
        breath_title: "निर्देशित श्वास",
        breath_phase_in: "सांस लें...",
        breath_phase_hold: "रोकें...",
        breath_phase_out: "सांस छोड़ें...",
        star_title: "तारे पकड़ें",
        constellation_title: "नक्षत्र जोड़ें",
        crew_title: "क्रू डैशबोर्ड",
        btn_offer_support: "सहयोग दें",
        fallback_default_1: "मैं सुनने के लिए यहाँ हूँ। क्या आप मुझे और बता सकते हैं? 🌟",
        
        // Analytics & Reports (NEW)
        history_title: "तनाव का इतिहास",
        report_title: "साप्ताहिक रिपोर्ट",
        loading_report: "विश्लेषण लोड हो रहा है...",
        label_stress_score: "तनाव स्कोर",
        report_no_data: "अभी पर्याप्त डेटा नहीं है।",
        label_weekly_avg: "औसत तनाव",
        label_trend: "रुझान",
        trend_stable: "स्थिर",
        trend_improving: "सुधर रहा है",
        trend_worsening: "बिगड़ रहा है",
        label_suggestion: "AI सुझाव",
        suggestion_general: "संतुलित दिनचर्या बनाए रखें।",
        suggestion_sleep: "नींद की गुणवत्ता पर ध्यान दें।",
        suggestion_mood: "मूड ठीक करने के लिए गेम खेलें।",
        suggestion_heart: "रोजाना सांस लेने का व्यायाम करें।",
        report_footer: "आपकी पिछली {count} जांचों पर आधारित"
    }
};

// ========================================
// Language State Management
// ========================================
let currentLanguage = localStorage.getItem('astra_language') || 'en';

// Apply language on load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial selector value
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = currentLanguage;
    }
    
    // Apply translations
    updatePageTranslations();
    
    // Also update any mobile selector
    const mobileSelector = document.querySelector('#mobileMenu select');
    if (mobileSelector) {
        mobileSelector.value = currentLanguage;
    }
});

/**
 * Switch language and update page
 * @param {string} lang - Language code ('en', 'es', 'fr', 'hi')
 */
function changeLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    
    currentLanguage = lang;
    localStorage.setItem('astra_language', lang);
    
    // Update selectors to match (sync desktop and mobile)
    const selectors = document.querySelectorAll('select');
    selectors.forEach(sel => {
        if (sel.getAttribute('onchange')?.includes('changeLanguage')) {
            sel.value = lang;
        }
    });
    
    updatePageTranslations();
    
    // Trigger custom event for other scripts
    document.dispatchEvent(new Event('languageChanged'));
}

/**
 * Get translated string by key
 * @param {string} key - The translation key
 * @param {string} defaultText - Fallback text if key not found
 * @returns {string} Translated text
 */
function getText(key) {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
}

/**
 * Update all elements with data-i18n attributes
 */
function updatePageTranslations() {
    // Update text content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getText(key);
        if (translation) {
            el.textContent = translation;
        }
    });
    
    // Update placeholders
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(input => {
        const key = input.getAttribute('data-i18n-placeholder');
        const translation = getText(key);
        if (translation) {
            input.placeholder = translation;
        }
    });
    
    // Special case: update HTML title tag if a specific key exists for the page
    // (Optional enhancement)
}

// Export for global usage
window.getText = getText;
window.changeLanguage = changeLanguage;