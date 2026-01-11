// -------------------- 
// Translation Helper
// -------------------- 
// Safely calls the global getText function from translations.js
function t(key, defaultText) {
    if (typeof getText === 'function') {
        return getText(key) || defaultText;
    }
    return defaultText;
}

const stressForm = document.getElementById('stressForm');
const sleepHoursInput = document.getElementById('sleepHours');
const moodLevelInput = document.getElementById('moodLevel');
const moodValueDisplay = document.getElementById('moodValue');
const heartRateInput = document.getElementById('heartRate');
const activityLevelSelect = document.getElementById('activityLevel');

const stressCircle = document.getElementById('stressCircle');
const stressPercentage = document.getElementById('stressPercentage');
const stressLevelBadge = document.getElementById('stressLevelBadge');
const stressLevelText = document.getElementById('stressLevelText');
const stressExplanation = document.getElementById('stressExplanation');

const recommendationsSection = document.getElementById('recommendationsSection');
const recommendationsList = document.getElementById('recommendationsList');

const lastCheckTime = document.getElementById('lastCheckTime');
const checksToday = document.getElementById('checksToday');
const avgStress = document.getElementById('avgStress');

const highStressModal = document.getElementById('highStressModal');

// Chart instance
let stressChartInstance = null;

if (moodLevelInput) {
    moodLevelInput.addEventListener('input', (e) => {
        moodValueDisplay.textContent = e.target.value;
    });
}

if (stressForm) {
    stressForm.addEventListener('submit', handleStressCheck);
}

async function handleStressCheck(e) {
    e.preventDefault();
    
    const analyzeText = document.getElementById('analyzeText');
    const analyzeLoader = document.getElementById('analyzeLoader');
    
    if (analyzeText && analyzeLoader) {
        analyzeText.classList.add('hidden');
        analyzeLoader.classList.remove('hidden');
    }
    
    const sleepHours = parseFloat(sleepHoursInput.value);
    const moodLevel = parseInt(moodLevelInput.value);
    const heartRate = parseInt(heartRateInput.value);
    const activityLevel = activityLevelSelect.value;
    
    const stressResult = calculateStressLevel(sleepHours, moodLevel, heartRate, activityLevel);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    displayStressResult(stressResult);
    
    const recommendations = generateRecommendations(stressResult, sleepHours, moodLevel, heartRate, activityLevel);
    displayRecommendations(recommendations);
    
    const stressData = {
        sleepHours,
        moodLevel,
        heartRate,
        activityLevel,
        score: stressResult.score,
        level: stressResult.level,
        explanation: stressResult.explanation
    };
    
    await saveStressCheck(stressData);
    
    updateLocalStats(stressResult.level);
    
    // Refresh history chart and report after new data submission
    await loadStressHistory();
    
    if (stressResult.level === 'high') {
        showHighStressModal();
    }
    
    if (analyzeText && analyzeLoader) {
        analyzeText.classList.remove('hidden');
        analyzeLoader.classList.add('hidden');
    }
    
    // Translate level for toast
    const levelKey = `stress_${stressResult.level}`; // e.g., stress_low
    const translatedLevel = t(levelKey, capitalizeFirst(stressResult.level));
    
    showToast('success', t('toast_analysis_complete', 'Analysis Complete'), `${t('toast_stress_level', 'Stress level')}: ${translatedLevel}`);
}

function calculateStressLevel(sleepHours, moodLevel, heartRate, activityLevel) {
    let stressScore = 0;
    let factors = [];
    
    // Sleep Factors
    if (sleepHours < 4) {
        stressScore += 30;
        factors.push(t('factor_sleep_severe', 'severely inadequate sleep'));
    } else if (sleepHours < 6) {
        stressScore += 20;
        factors.push(t('factor_sleep_low', 'insufficient sleep'));
    } else if (sleepHours < 7) {
        stressScore += 10;
        factors.push(t('factor_sleep_mild', 'slightly low sleep'));
    } else if (sleepHours > 10) {
        stressScore += 10;
        factors.push(t('factor_sleep_excess', 'excessive sleep'));
    }
    
    // Mood Factors
    if (moodLevel <= 2) {
        stressScore += 35;
        factors.push(t('factor_mood_very_low', 'very low mood'));
    } else if (moodLevel <= 4) {
        stressScore += 25;
        factors.push(t('factor_mood_low', 'low mood'));
    } else if (moodLevel <= 5) {
        stressScore += 15;
        factors.push(t('factor_mood_neutral', 'neutral mood'));
    } else if (moodLevel <= 6) {
        stressScore += 5;
    }
    
    // Heart Rate Factors
    if (heartRate < 50) {
        stressScore += 15;
        factors.push(t('factor_hr_low', 'unusually low heart rate'));
    } else if (heartRate > 100) {
        stressScore += 25;
        factors.push(t('factor_hr_high', 'elevated heart rate'));
    } else if (heartRate > 90) {
        stressScore += 15;
        factors.push(t('factor_hr_mild', 'slightly elevated heart rate'));
    } else if (heartRate > 80) {
        stressScore += 5;
    }
    
    // Activity Factors
    switch (activityLevel) {
        case 'none':
            stressScore += 10;
            factors.push(t('factor_activity_none', 'no physical activity'));
            break;
        case 'light':
            break;
        case 'moderate':
            stressScore -= 5;
            break;
        case 'intense':
            stressScore -= 5;
            break;
    }
    
    stressScore = Math.max(0, Math.min(100, stressScore));
    
    let level, explanation;
    
    if (stressScore <= 25) {
        level = 'low';
        explanation = t('expl_low', 'Your vitals and well-being indicators are within optimal range. Keep maintaining your healthy routines!');
    } else if (stressScore <= 55) {
        level = 'medium';
        if (factors.length > 0) {
            const factorString = factors.slice(0, 2).join(', ');
            explanation = t('expl_med_factors', 'Moderate stress detected. Contributing factors: {factors}. Consider taking short breaks.')
                .replace('{factors}', factorString);
        } else {
            explanation = t('expl_med', 'Moderate stress levels detected. Consider incorporating relaxation activities.');
        }
    } else {
        level = 'high';
        if (factors.length > 0) {
            const factorString = factors.slice(0, 3).join(', ');
            explanation = t('expl_high_factors', 'High stress detected! Key concerns: {factors}. Immediate attention recommended.')
                .replace('{factors}', factorString);
        } else {
            explanation = t('expl_high', 'High stress levels detected. Please take immediate steps to relax and consider reaching out for support.');
        }
    }
    
    return {
        score: stressScore,
        level: level,
        factors: factors,
        explanation: explanation
    };
}

function displayStressResult(result) {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (result.score / 100) * circumference;
    
    if (stressCircle) {
        stressCircle.style.strokeDashoffset = offset;
    }
    
    if (stressPercentage) {
        animateNumber(stressPercentage, 0, result.score, 1000);
    }
    
    const gradientStart = document.getElementById('gradientStart');
    const gradientEnd = document.getElementById('gradientEnd');
    
    if (gradientStart && gradientEnd) {
        switch (result.level) {
            case 'low':
                gradientStart.setAttribute('stop-color', '#22c55e');
                gradientEnd.setAttribute('stop-color', '#22d3ee');
                break;
            case 'medium':
                gradientStart.setAttribute('stop-color', '#eab308');
                gradientEnd.setAttribute('stop-color', '#f97316');
                break;
            case 'high':
                gradientStart.setAttribute('stop-color', '#ef4444');
                gradientEnd.setAttribute('stop-color', '#ec4899');
                break;
        }
    }
    
    if (stressLevelBadge) {
        stressLevelBadge.className = `stress-badge stress-badge-${result.level}`;
    }
    
    if (stressLevelText) {
        const levelText = t(`stress_${result.level}`, capitalizeFirst(result.level));
        const stressLabel = t('label_stress', 'Stress');
        stressLevelText.textContent = `${levelText} ${stressLabel}`;
    }
    
    if (stressExplanation) {
        stressExplanation.textContent = result.explanation;
        stressExplanation.classList.add('fade-in');
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function generateRecommendations(stressResult, sleepHours, moodLevel, heartRate, activityLevel) {
    const recommendations = [];
    
    if (stressResult.level === 'high') {
        recommendations.push({
            icon: '🫁',
            iconBg: 'bg-cyan-500/20',
            title: t('rec_breath_title', 'Breathing Exercise'),
            description: t('rec_breath_desc', 'Take 5 minutes for deep breathing. Inhale for 4 seconds, hold for 4, exhale for 6.'),
            action: t('btn_start_now', 'Start Now'),
            link: 'games.html#breathing'
        });
        
        recommendations.push({
            icon: '💬',
            iconBg: 'bg-purple-500/20',
            title: t('rec_chat_title', 'Talk to ASTRA'),
            description: t('rec_chat_desc', 'Share what\'s on your mind. I\'m here to listen and provide support.'),
            action: t('btn_open_chat', 'Open Chat'),
            onclick: 'openChatbot()'
        });
    }
    
    if (sleepHours < 6) {
        recommendations.push({
            icon: '😴',
            iconBg: 'bg-indigo-500/20',
            title: t('rec_rest_title', 'Rest Reminder'),
            description: t('rec_rest_desc', 'You\'ve had only {hours} hours of sleep. Consider scheduling a 20-minute power nap.').replace('{hours}', sleepHours),
            action: t('btn_set_reminder', 'Set Reminder')
        });
    }
    
    if (moodLevel <= 4) {
        recommendations.push({
            icon: '🎮',
            iconBg: 'bg-pink-500/20',
            title: t('rec_game_title', 'Stress-Relief Game'),
            description: t('rec_game_desc', 'Play a calming space game to shift your focus and improve your mood.'),
            action: t('btn_play_now', 'Play Now'),
            link: 'games.html'
        });
    }
    
    if (heartRate > 90) {
        recommendations.push({
            icon: '🧘',
            iconBg: 'bg-green-500/20',
            title: t('rec_relax_title', 'Relaxation Exercise'),
            description: t('rec_relax_desc', 'Your heart rate is elevated. Try progressive muscle relaxation to calm down.'),
            action: t('btn_learn_more', 'Learn More')
        });
    }
    
    if (activityLevel === 'none') {
        recommendations.push({
            icon: '🏃',
            iconBg: 'bg-orange-500/20',
            title: t('rec_activity_title', 'Physical Activity'),
            description: t('rec_activity_desc', 'Light exercise can significantly reduce stress. Try 15 minutes of stretching.'),
            action: t('btn_view_exercises', 'View Exercises')
        });
    }
    
    if (stressResult.level === 'low') {
        recommendations.push({
            icon: '⭐',
            iconBg: 'bg-yellow-500/20',
            title: t('rec_great_title', 'Great Work!'),
            description: t('rec_great_desc', 'Your stress levels are optimal. Keep up your healthy habits!'),
            action: null
        });
    }
    
    if (stressResult.level !== 'low') {
        recommendations.push({
            icon: '👥',
            iconBg: 'bg-blue-500/20',
            title: t('rec_crew_title', 'Connect with Crew'),
            description: t('rec_crew_desc', 'Social connection can help reduce stress. Check in with your crewmates.'),
            action: t('btn_view_crew', 'View Crew'),
            link: 'crew.html'
        });
    }
    
    return recommendations.slice(0, 4);
}

function displayRecommendations(recommendations) {
    if (!recommendationsSection || !recommendationsList) return;
    
    recommendationsSection.classList.remove('hidden');
    
    recommendationsList.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const item = document.createElement('div');
        item.className = 'recommendation-item fade-in';
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.innerHTML = `
            <div class="recommendation-icon ${rec.iconBg}">
                ${rec.icon}
            </div>
            <div class="recommendation-content flex-1">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
            ${rec.action ? `
                <${rec.link ? 'a href="' + rec.link + '"' : 'button' + (rec.onclick ? ' onclick="' + rec.onclick + '"' : '')} 
                    class="btn-secondary text-sm px-3 py-1">
                    ${rec.action}
                </${rec.link ? 'a' : 'button'}>
            ` : ''}
        `;
        
        recommendationsList.appendChild(item);
    });
    
    recommendations.forEach(rec => {
        saveRecommendation({
            title: rec.title,
            description: rec.description
        });
    });
}

function updateLocalStats(level) {
    if (lastCheckTime) {
        const now = new Date();
        lastCheckTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (checksToday) {
        const current = parseInt(checksToday.textContent) || 0;
        checksToday.textContent = current + 1;
    }
    
    if (avgStress) {
        const levelKey = `stress_${level}`;
        avgStress.textContent = t(levelKey, capitalizeFirst(level));
    }
}

// -------------------- 
// Analytics & History
// --------------------

// Load and Render Stress History Graph and Weekly Report
async function loadStressHistory() {
    const chartCanvas = document.getElementById('stressChart');
    if (!chartCanvas) return;

    // Fetch history using function from firebase.js
    // We assume getStressHistory is updated or we pass a larger limit
    const response = await getStressHistory(20); // Get last 20 records
    
    if (!response.success || response.data.length === 0) {
        // Handle empty state if needed
        return;
    }

    // Process data for Chart.js
    // Sort chronological: oldest to newest
    const historyData = response.data.reverse(); 
    
    const labels = historyData.map(entry => {
        const date = entry.timestamp ? (entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp)) : new Date();
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });
    
    const scores = historyData.map(entry => entry.score);

    // Destroy previous chart if exists
    if (stressChartInstance) {
        stressChartInstance.destroy();
    }

    // Render Chart
    const ctx = chartCanvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.5)'); // Cyan
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)'); // Purple transparent

    stressChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: t('label_stress_score', 'Stress Score'),
                data: scores,
                borderColor: '#22d3ee',
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(13, 13, 20, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                }
            }
        }
    });

    // Generate Weekly Report based on this data
    generateWeeklyReport(historyData);
}

function generateWeeklyReport(historyData) {
    const reportContainer = document.getElementById('weeklyReportContent');
    if (!reportContainer) return;

    if (historyData.length === 0) {
        reportContainer.innerHTML = `<p class="text-gray-400 text-sm">${t('report_no_data', 'Not enough data for a weekly report yet.')}</p>`;
        return;
    }

    // Calculate averages
    const totalScore = historyData.reduce((sum, item) => sum + (item.score || 0), 0);
    const avgScore = Math.round(totalScore / historyData.length);
    
    // Determine trend (compare first half vs second half if enough data)
    let trend = 'stable';
    let trendIcon = '➡️';
    let trendColor = 'text-yellow-400';
    
    if (historyData.length >= 2) {
        const recentAvg = historyData.slice(-Math.ceil(historyData.length / 2)).reduce((sum, i) => sum + i.score, 0) / Math.ceil(historyData.length / 2);
        const olderAvg = historyData.slice(0, Math.floor(historyData.length / 2)).reduce((sum, i) => sum + i.score, 0) / Math.floor(historyData.length / 2);
        
        if (recentAvg < olderAvg - 5) {
            trend = 'improving';
            trendIcon = '↘️';
            trendColor = 'text-green-400';
        } else if (recentAvg > olderAvg + 5) {
            trend = 'worsening';
            trendIcon = '↗️';
            trendColor = 'text-red-400';
        }
    }

    // Find primary stressor (simplified analysis)
    let stressors = { sleep: 0, mood: 0, heart: 0 };
    historyData.forEach(item => {
        if (item.sleepHours < 6) stressors.sleep++;
        if (item.moodLevel <= 4) stressors.mood++;
        if (item.heartRate > 90) stressors.heart++;
    });

    // Determine main recommendation based on highest stressor count
    let suggestion = t('suggestion_general', 'Maintain a balanced routine.');
    if (stressors.sleep >= stressors.mood && stressors.sleep >= stressors.heart && stressors.sleep > 0) {
        suggestion = t('suggestion_sleep', 'Focus on improving sleep quality.');
    } else if (stressors.mood >= stressors.sleep && stressors.mood >= stressors.heart && stressors.mood > 0) {
        suggestion = t('suggestion_mood', 'Try relaxation games to boost mood.');
    } else if (stressors.heart >= stressors.sleep && stressors.heart >= stressors.mood && stressors.heart > 0) {
        suggestion = t('suggestion_heart', 'Practice breathing exercises daily.');
    }

    reportContainer.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div>
                <div class="text-sm text-gray-400">${t('label_weekly_avg', 'Average Stress')}</div>
                <div class="font-orbitron text-2xl font-bold ${avgScore > 50 ? 'text-red-400' : 'text-cyan-400'}">${avgScore}/100</div>
            </div>
            <div class="text-right">
                <div class="text-sm text-gray-400">${t('label_trend', 'Trend')}</div>
                <div class="font-bold ${trendColor} flex items-center gap-1 justify-end">
                    ${trendIcon} <span class="capitalize">${t('trend_' + trend, trend)}</span>
                </div>
            </div>
        </div>
        
        <div class="p-3 bg-white/5 rounded-lg border border-white/10">
            <h4 class="font-semibold text-sm mb-1 text-purple-400">💡 ${t('label_suggestion', 'AI Suggestion')}</h4>
            <p class="text-xs text-gray-300">${suggestion}</p>
        </div>
        
        <div class="mt-4 text-xs text-center text-gray-500">
            ${t('report_footer', 'Based on your last {count} check-ins').replace('{count}', historyData.length)}
        </div>
    `;
}

function simulateHeartRate() {
    const baseRate = 72;
    const variation = Math.floor(Math.random() * 30) - 10;
    const simulatedRate = baseRate + variation;
    
    if (heartRateInput) {
        heartRateInput.value = simulatedRate;
        
        heartRateInput.classList.add('border-cyan-500');
        setTimeout(() => {
            heartRateInput.classList.remove('border-cyan-500');
        }, 500);
    }
    
    const msg = t('toast_hr_simulated_msg', '{rate} BPM detected').replace('{rate}', simulatedRate);
    showToast('info', t('toast_hr_simulated', 'Heart Rate Simulated'), msg);
}

function showHighStressModal() {
    if (highStressModal) {
        highStressModal.classList.remove('hidden');
    }
}

function closeHighStressModal() {
    if (highStressModal) {
        highStressModal.classList.add('hidden');
    }
}

function capitalizeFirst(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ASTRA App initialized');
    
    if (lastCheckTime) {
        lastCheckTime.textContent = '--:--';
    }

    // Attempt to load history if user is already logged in or after brief delay
    setTimeout(() => {
        if (typeof currentUser !== 'undefined' && currentUser) {
            loadStressHistory();
        }
    }, 2000);
});

// Also listen for a custom event from firebase.js when login completes
document.addEventListener('userLoggedIn', () => {
    loadStressHistory();
});

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (stressForm) {
            stressForm.dispatchEvent(new Event('submit'));
        }
    }
    
    if (e.key === 'Escape') {
        closeHighStressModal();
    }
});

window.simulateHeartRate = simulateHeartRate;
window.closeHighStressModal = closeHighStressModal;
window.capitalizeFirst = capitalizeFirst;