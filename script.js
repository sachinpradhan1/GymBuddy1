// Get all elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const currentRepsElement = document.getElementById("current-reps");
const currentCaloriesElement = document.getElementById("current-calories");
const totalRepsElement = document.getElementById("total-reps");
const totalCaloriesElement = document.getElementById("total-calories");
const formScoreElement = document.getElementById("form-score");
const progressFillElement = document.getElementById("progress-fill");
const progressTextElement = document.getElementById("progress-text");
const feedbackTitleElement = document.getElementById("feedback-title");
const feedbackMessageElement = document.getElementById("feedback-message");
const feedbackIconElement = document.getElementById("feedback-icon");
const startButton = document.getElementById("start-btn");
const stopButton = document.getElementById("stop-btn");
const resetButton = document.getElementById("reset-reps-btn");
const exerciseCards = document.querySelectorAll('.exercise-card');
const demoModal = document.getElementById("demo-modal");
const demoVideo = document.getElementById("demo-video");
const demoTitle = document.getElementById("demo-title");
const closeDemoBtn = document.getElementById("close-demo");
const startAfterDemoBtn = document.getElementById("start-after-demo");
const skipDemoBtn = document.getElementById("skip-demo");
const poseIndicator = document.getElementById("pose-indicator");
const focusModeBtn = document.getElementById("focus-mode-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const muteBtn = document.getElementById("mute-btn");
const historyBtn = document.getElementById("history-btn");
const historyModal = document.getElementById("history-modal");
const closeHistoryBtn = document.getElementById("close-history");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const exportHistoryBtn = document.getElementById("export-history-btn");
const workoutHistoryList = document.getElementById("workout-history-list");
const historyEmpty = document.getElementById("history-empty");
const totalWorkoutsElement = document.getElementById("total-workouts");
const avgDurationElement = document.getElementById("avg-duration");
const favoriteExerciseElement = document.getElementById("favorite-exercise");
const formScoreBadge = document.getElementById("form-score-badge");
const formScoreDisplay = document.getElementById("form-score-display");
const formFeedback = document.getElementById("form-feedback");
const programsBtn = document.getElementById("programs-btn");
const programsModal = document.getElementById("programs-modal");
const closeProgramsBtn = document.getElementById("close-programs");
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const programsGrid = document.getElementById("programs-grid");
const customExercises = document.getElementById("custom-exercises");
const startCustomWorkoutBtn = document.getElementById("start-custom-workout");
const saveCustomWorkoutBtn = document.getElementById("save-custom-workout");
const achievementsBtn = document.getElementById("achievements-btn");
const achievementsModal = document.getElementById("achievements-modal");
const closeAchievementsBtn = document.getElementById("close-achievements");
const achievementBadge = document.getElementById("achievement-badge");
const achievementsGrid = document.getElementById("achievements-grid");
const streakDaysElement = document.getElementById("streak-days");
const levelDisplayElement = document.getElementById("level-display");
const achievementsCountElement = document.getElementById("achievements-count");
const currentLevelElement = document.getElementById("current-level");
const levelTitleElement = document.getElementById("level-title");
const levelFillElement = document.getElementById("level-fill");
const currentXpElement = document.getElementById("current-xp");
const nextLevelXpElement = document.getElementById("next-level-xp");

// Variables for rep counting
let repCount = 0;
let sessionCalories = 0;
let totalReps = 0;
let totalCalories = 0;
let direction = "down";
let camera = null;
let currentExercise = "curl";
let workoutState = 'idle'; // 'idle', 'preparing', 'active', 'paused', 'resuming'
let readyTimeoutId = null;
let pauseTimeoutId = null;
let resumeTimeoutId = null;
let resumeCountdown = 3;
let targetReps = 20;
let formScore = 100;
let isMuted = false;
let plankStartTime = null;
let plankCurrentTime = 0;
let burpeeStage = 'standing'; // 'standing', 'squat', 'plank', 'jump'
let lastLungeTime = 0;
let workoutStartTime = null;
let workoutHistory = [];
let currentWorkoutData = null;
let formFeedbackTimeout = null;
let lastFormTip = null;
let currentProgram = null;
let customWorkoutPlan = [];
let programExerciseIndex = 0;
let isFollowingProgram = false;
let userStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastWorkoutDate: null,
  totalReps: 0,
  totalWorkouts: 0,
  achievements: [],
  totalCalories: 0
};
let pendingAchievements = [];

// Demo video URLs for each exercise
const demoVideos = {
  curl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  squat: "https://www.youtube.com/embed/aclHkVaku9U",
  pushup: "https://www.youtube.com/embed/IODxDxX7oi4",
  shoulderpress: "https://www.youtube.com/embed/qEwKCR5JCog",
  jumpingjack: "https://www.youtube.com/embed/c4DAnQ6DtF8",
  lunge: "https://www.youtube.com/embed/QOVaHwm-Q6U",
  plank: "https://www.youtube.com/embed/ASdvN_XEl_c",
  burpee: "https://www.youtube.com/embed/auBLPXO8Fww"
};

// Exercise names and calorie values
const exerciseData = {
  curl: { name: "bicep curls", calories: 0.5, type: "reps" },
  squat: { name: "squats", calories: 0.8, type: "reps" },
  pushup: { name: "push-ups", calories: 0.7, type: "reps" },
  shoulderpress: { name: "shoulder press", calories: 0.6, type: "reps" },
  jumpingjack: { name: "jumping jacks", calories: 0.9, type: "reps" },
  lunge: { name: "lunges", calories: 0.7, type: "reps" },
  plank: { name: "plank hold", calories: 0.3, type: "time" },
  burpee: { name: "burpees", calories: 1.2, type: "reps" }
};

// Preset workout programs
const workoutPrograms = {
  beginner: {
    name: "Beginner Full Body",
    description: "Perfect for getting started with basic movements and building foundation strength.",
    duration: "15-20 mins",
    exercises: [
      { exercise: "squat", reps: 10 },
      { exercise: "pushup", reps: 8 },
      { exercise: "plank", reps: 30 },
      { exercise: "jumpingjack", reps: 15 }
    ],
    icon: "fas fa-seedling"
  },
  strength: {
    name: "Strength Builder",
    description: "Focus on building muscle strength with compound movements and resistance exercises.",
    duration: "25-30 mins",
    exercises: [
      { exercise: "squat", reps: 20 },
      { exercise: "pushup", reps: 15 },
      { exercise: "curl", reps: 15 },
      { exercise: "shoulderpress", reps: 12 },
      { exercise: "lunge", reps: 16 }
    ],
    icon: "fas fa-dumbbell"
  },
  cardio: {
    name: "Cardio Blast",
    description: "High-intensity cardio workout to burn calories and improve cardiovascular fitness.",
    duration: "20-25 mins",
    exercises: [
      { exercise: "jumpingjack", reps: 30 },
      { exercise: "burpee", reps: 8 },
      { exercise: "squat", reps: 25 },
      { exercise: "pushup", reps: 12 },
      { exercise: "jumpingjack", reps: 40 }
    ],
    icon: "fas fa-bolt"
  },
  core: {
    name: "Core Crusher",
    description: "Target your core muscles with planks and dynamic movements for a strong midsection.",
    duration: "15-18 mins",
    exercises: [
      { exercise: "plank", reps: 45 },
      { exercise: "burpee", reps: 6 },
      { exercise: "plank", reps: 60 },
      { exercise: "squat", reps: 15 },
      { exercise: "plank", reps: 30 }
    ],
    icon: "fas fa-grip-horizontal"
  },
  quick: {
    name: "Quick Burn",
    description: "Short but effective workout when you're pressed for time but want results.",
    duration: "8-12 mins",
    exercises: [
      { exercise: "jumpingjack", reps: 20 },
      { exercise: "pushup", reps: 10 },
      { exercise: "squat", reps: 15 },
      { exercise: "burpee", reps: 5 }
    ],
    icon: "fas fa-clock"
  }
};

// Achievement definitions
const achievements = {
  firstWorkout: {
    id: 'firstWorkout',
    title: 'Getting Started',
    description: 'Complete your first workout',
    icon: 'fas fa-play-circle',
    condition: (stats) => stats.totalWorkouts >= 1,
    xpReward: 50
  },
  rep10: {
    id: 'rep10',
    title: 'Double Digits',
    description: 'Complete 10 reps in a single exercise',
    icon: 'fas fa-plus',
    condition: (stats, sessionData) => sessionData?.reps >= 10,
    xpReward: 25
  },
  streak3: {
    id: 'streak3',
    title: 'On a Roll',
    description: 'Maintain a 3-day workout streak',
    icon: 'fas fa-fire',
    condition: (stats) => stats.streak >= 3,
    xpReward: 100
  },
  streak7: {
    id: 'streak7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: 'fas fa-calendar-week',
    condition: (stats) => stats.streak >= 7,
    xpReward: 250
  },
  totalReps100: {
    id: 'totalReps100',
    title: 'Century Club',
    description: 'Complete 100 total reps across all workouts',
    icon: 'fas fa-hundred-points',
    condition: (stats) => stats.totalReps >= 100,
    xpReward: 150
  },
  totalReps500: {
    id: 'totalReps500',
    title: 'Rep Master',
    description: 'Complete 500 total reps across all workouts',
    icon: 'fas fa-crown',
    condition: (stats) => stats.totalReps >= 500,
    xpReward: 500
  },
  calories100: {
    id: 'calories100',
    title: 'Calorie Crusher',
    description: 'Burn 100 total calories',
    icon: 'fas fa-fire-alt',
    condition: (stats) => stats.totalCalories >= 100,
    xpReward: 200
  },
  perfectForm: {
    id: 'perfectForm',
    title: 'Form Perfect',
    description: 'Maintain 95%+ form score throughout an entire workout',
    icon: 'fas fa-medal',
    condition: (stats, sessionData) => sessionData?.formScore >= 95,
    xpReward: 150
  },
  allExercises: {
    id: 'allExercises',
    title: 'Exercise Explorer',
    description: 'Try all available exercise types',
    icon: 'fas fa-compass',
    condition: (stats, sessionData, allWorkouts) => {
      const exerciseTypes = new Set(allWorkouts.map(w => w.exercise));
      return exerciseTypes.size >= Object.keys(exerciseData).length;
    },
    xpReward: 300
  },
  level5: {
    id: 'level5',
    title: 'Rising Star',
    description: 'Reach fitness level 5',
    icon: 'fas fa-star',
    condition: (stats) => stats.level >= 5,
    xpReward: 0
  },
  level10: {
    id: 'level10',
    title: 'Fitness Athlete',
    description: 'Reach fitness level 10',
    icon: 'fas fa-user-ninja',
    condition: (stats) => stats.level >= 10,
    xpReward: 0
  },
  workouts10: {
    id: 'workouts10',
    title: 'Dedicated Trainee',
    description: 'Complete 10 total workouts',
    icon: 'fas fa-chart-line',
    condition: (stats) => stats.totalWorkouts >= 10,
    xpReward: 200
  },
  workouts50: {
    id: 'workouts50',
    title: 'Fitness Enthusiast',
    description: 'Complete 50 total workouts',
    icon: 'fas fa-trophy',
    condition: (stats) => stats.totalWorkouts >= 50,
    xpReward: 1000
  }
};

// Level system
const levelSystem = {
  1: { title: 'Beginner', xpRequired: 0, nextLevel: 100 },
  2: { title: 'Novice', xpRequired: 100, nextLevel: 250 },
  3: { title: 'Trainee', xpRequired: 250, nextLevel: 450 },
  4: { title: 'Apprentice', xpRequired: 450, nextLevel: 700 },
  5: { title: 'Intermediate', xpRequired: 700, nextLevel: 1000 },
  6: { title: 'Advanced', xpRequired: 1000, nextLevel: 1350 },
  7: { title: 'Expert', xpRequired: 1350, nextLevel: 1750 },
  8: { title: 'Elite', xpRequired: 1750, nextLevel: 2200 },
  9: { title: 'Master', xpRequired: 2200, nextLevel: 2700 },
  10: { title: 'Grandmaster', xpRequired: 2700, nextLevel: 3250 },
  11: { title: 'Legend', xpRequired: 3250, nextLevel: 3850 },
  12: { title: 'Champion', xpRequired: 3850, nextLevel: 4500 },
  13: { title: 'Hero', xpRequired: 4500, nextLevel: 5200 },
  14: { title: 'Superhuman', xpRequired: 5200, nextLevel: 6000 },
  15: { title: 'Fitness God', xpRequired: 6000, nextLevel: null }
};

// Exercise selection
exerciseCards.forEach(card => {
  card.addEventListener('click', () => {
    if (workoutState !== 'idle') return;
    exerciseCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    currentExercise = card.dataset.exercise;
    
    // Set target based on exercise type
    if (currentExercise === 'plank') {
      targetReps = 60; // 60 seconds for plank
    } else {
      targetReps = 20; // 20 reps for other exercises
    }
    
    resetSession();
    const exerciseName = exerciseData[currentExercise].name;
    const targetUnit = currentExercise === 'plank' ? 'seconds' : 'reps';
    updateFeedback("Exercise Selected", `Ready to start ${exerciseName} - Target: ${targetReps} ${targetUnit}`, "fas fa-check-circle");
    speak(`Exercise changed to ${exerciseName}. Let me show you the proper form!`);
  });
});

// Demo modal functions
function showDemoModal() {
  const exerciseName = exerciseData[currentExercise].name;
  demoTitle.textContent = `${exerciseName.charAt(0).toUpperCase() + exerciseName.slice(1)} Demo`;
  demoVideo.src = demoVideos[currentExercise];
  demoModal.classList.add('active');
  speak(`Here's how to perform ${exerciseName} with perfect form. Study the movement carefully!`);
}

function closeDemoModal() {
  demoModal.classList.remove('active');
  demoVideo.src = "";
}

// Demo modal event listeners
closeDemoBtn.addEventListener('click', closeDemoModal);
skipDemoBtn.addEventListener('click', () => {
  closeDemoModal();
  startCamera();
});
startAfterDemoBtn.addEventListener('click', () => {
  closeDemoModal();
  startCamera();
});

// Load MediaPipe Pose model
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

// Enhanced pose detection and drawing
pose.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (results.image) {
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      if (pauseTimeoutId) {
        clearTimeout(pauseTimeoutId);
        pauseTimeoutId = null;
      }

      // Always draw skeleton if landmarks are detected
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: "var(--primary)", lineWidth: 3 });
      drawLandmarks(ctx, results.poseLandmarks, { color: "var(--success)", radius: 4 });

      poseIndicator.style.background = "rgba(16, 185, 129, 0.9)";
      poseIndicator.innerHTML = '<i class="fas fa-user-check"></i>';

      if (workoutState === 'preparing') {
        checkReadyState(results.poseLandmarks);
      } else if (workoutState === 'active') {
        processExercise(results.poseLandmarks);
      } else if (workoutState === 'paused') {
        resumeWorkout();
      }
    } else {
      poseIndicator.style.background = "rgba(239, 68, 68, 0.9)";
      poseIndicator.innerHTML = '<i class="fas fa-user-slash"></i>';

      if (workoutState === 'active' && !pauseTimeoutId) {
        pauseTimeoutId = setTimeout(() => {
          workoutState = 'paused';
          updateFeedback("Workout Paused", "Step back in front of the camera to resume", "fas fa-pause-circle");
          speak("Workout paused.");
        }, 3000); // 3 seconds to pause
      }
    }
  }
});

function resumeWorkout() {
  if (workoutState !== 'paused') return;

  workoutState = 'resuming';
  let countdown = 3;

  const doResumeCountdown = () => {
    if (countdown > 0) {
      updateFeedback("Resuming...", `Get ready to continue in ${countdown}`, "fas fa-play-circle");
      speak(countdown);
      countdown--;
      resumeTimeoutId = setTimeout(doResumeCountdown, 1000);
    } else {
      workoutState = 'active';
      updateFeedback("Workout Resumed", "Let's keep going!", "fas fa-play");
      speak("Let's go!");
    }
  };

  doResumeCountdown();
}

function checkReadyState(landmarks) {
  const lm = landmarks;
  let startPoseCorrect = false;
  let feedbackMessage = "";

  switch (currentExercise) {
    case "curl":
      const curlAngle = calculateAngle(lm[11], lm[13], lm[15]);
      if (curlAngle > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Hold this position to begin.";
      } else {
        feedbackMessage = "Stand straight with arms down to begin.";
      }
      break;
    case "squat":
      const squatAngle = calculateAngle(lm[23], lm[25], lm[27]);
      if (squatAngle > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Hold this position to begin.";
      } else {
        feedbackMessage = "Stand up straight to begin.";
      }
      break;
    case "pushup":
      const bodyAngle = calculateAngle(lm[11], lm[23], lm[25]);
      const armAngle = calculateAngle(lm[11], lm[13], lm[15]);
      if (bodyAngle > 160 && armAngle > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Hold this plank position to begin.";
      } else {
        feedbackMessage = "Get into a straight-arm plank position.";
      }
      break;
    case "shoulderpress":
      const spArmAngle = calculateAngle(lm[11], lm[13], lm[15]);
      if (spArmAngle > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Hold this position with arms down to begin.";
      } else {
        feedbackMessage = "Stand with your arms down to begin.";
      }
      break;
    case "jumpingjack":
      const jjShoulderAngle = calculateAngle(lm[13], lm[11], lm[23]);
      if (jjShoulderAngle < 45) { // Arms down by side
        startPoseCorrect = true;
        feedbackMessage = "Hold this position to begin.";
      } else {
        feedbackMessage = "Stand with your arms down by your sides.";
      }
      break;
    case "lunge":
      const leftKnee = calculateAngle(lm[23], lm[25], lm[27]);
      const rightKnee = calculateAngle(lm[24], lm[26], lm[28]);
      if (leftKnee > 160 && rightKnee > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Stand straight with feet together to begin.";
      } else {
        feedbackMessage = "Stand up straight with feet together.";
      }
      break;
    case "plank":
      const plankBodyAngle = calculateAngle(lm[11], lm[23], lm[25]);
      const plankArmAngle = calculateAngle(lm[11], lm[13], lm[15]);
      if (plankBodyAngle > 160 && plankArmAngle > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Hold this plank position to begin timer.";
      } else {
        feedbackMessage = "Get into a straight plank position.";
      }
      break;
    case "burpee":
      const burpeeStandAngle = calculateAngle(lm[23], lm[25], lm[27]);
      if (burpeeStandAngle > 160) {
        startPoseCorrect = true;
        feedbackMessage = "Stand straight to begin burpees.";
      } else {
        feedbackMessage = "Stand up straight to begin.";
      }
      break;
  }

  if (startPoseCorrect) {
    if (!readyTimeoutId) {
      updateFeedback("Ready!", "Hold this position to start the workout.", "fas fa-check-circle");
      speak("Hold this position to begin.");
      readyTimeoutId = setTimeout(() => {
        workoutState = 'active';
        const exerciseName = exerciseData[currentExercise].name;
        
        // Start workout tracking
        startWorkoutTracking();
        
        if (currentExercise === 'plank') {
          plankStartTime = Date.now();
          updateFeedback("Plank Started!", "Hold that position! Timer started.", "fas fa-play-circle");
        } else {
          updateFeedback("Workout Started!", `Let's go! First rep of ${exerciseName}!`, "fas fa-play-circle");
        }
        speak(`Workout started! Let's go!`);
        readyTimeoutId = null;
      }, 2000); // 2-second hold to start
    }
  } else {
    if (readyTimeoutId) {
      clearTimeout(readyTimeoutId);
      readyTimeoutId = null;
    }
    updateFeedback("Get Ready", feedbackMessage, "fas fa-user-clock");
  }
}

function processExercise(landmarks) {
  const lm = landmarks;
  
  // Get detailed form feedback
  const feedback = getDetailedFormFeedback(currentExercise, landmarks);
  updateFormScore(feedback.score);
  
  // Show form tips occasionally
  if (feedback.tips.length > 0 && Math.random() < 0.3) {
    const randomTip = feedback.tips[Math.floor(Math.random() * feedback.tips.length)];
    showFormTip(randomTip);
  }

  if (currentExercise === "curl") {
    const shoulder = lm[11];
    const elbow = lm[13];
    const wrist = lm[15];
    const angle = calculateAngle(shoulder, elbow, wrist);

    if (angle < 160 && angle > 60) {
      updateFeedback("Performing Curl", `Perfect form! Angle: ${Math.round(angle)}°`, "fas fa-muscle");
    }

    if (angle > 160 && direction === "up") {
      direction = "down";
    }
    if (angle < 60 && direction === "down") {
      direction = "up";
      incrementRep();
      updateFeedback("Excellent Curl!", "Perfect bicep contraction!", "fas fa-check-circle");
    }

  } else if (currentExercise === "squat") {
    const hip = lm[23];
    const knee = lm[25];
    const ankle = lm[27];
    const angle = calculateAngle(hip, knee, ankle);

    if (angle < 160 && angle > 90) {
      updateFeedback("Performing Squat", `Great depth! Angle: ${Math.round(angle)}°`, "fas fa-walking");
    }

    if (angle > 160 && direction === "up") {
      direction = "down";
    }
    if (angle < 90 && direction === "down") {
      direction = "up";
      incrementRep();
      updateFeedback("Perfect Squat!", "Excellent depth and form!", "fas fa-check-circle");
    }

  } else if (currentExercise === "pushup") {
    const shoulder = lm[11];
    const elbow = lm[13];
    const wrist = lm[15];
    const hip = lm[23];

    const elbowAngle = calculateAngle(shoulder, elbow, wrist);
    const bodyAlignment = Math.abs(shoulder.y - hip.y);

    if (elbowAngle < 140 && elbowAngle > 60 && bodyAlignment < 0.2) {
      updateFeedback("Performing Push-up", `Excellent form! Depth: ${Math.round(elbowAngle)}°`, "fas fa-hand-point-up");
    }

    if (elbowAngle > 140 && direction === "up") {
      direction = "down";
    }
    if (elbowAngle < 90 && direction === "down") {
      direction = "up";
      incrementRep();
      updateFeedback("Amazing Push-up!", "Perfect chest engagement!", "fas fa-check-circle");
    }

  } else if (currentExercise === "shoulderpress") {
    const shoulder = lm[11];
    const elbow = lm[13];
    const wrist = lm[15];

    // Calculate angle for shoulder press (elbow to shoulder to hip)
    const hip = lm[23];
    const shoulderAngle = calculateAngle(elbow, shoulder, hip);

    // Also check arm extension (shoulder to elbow to wrist)
    const armAngle = calculateAngle(shoulder, elbow, wrist);

    if (shoulderAngle > 60 && shoulderAngle < 120 && armAngle > 90) {
      updateFeedback("Performing Shoulder Press", `Great form! Extension: ${Math.round(armAngle)}°`, "fas fa-angle-up");
    }

    if (armAngle < 90 && direction === "up") {
      direction = "down";
    }
    if (armAngle > 160 && direction === "down") {
      direction = "up";
      incrementRep();
      updateFeedback("Perfect Press!", "Excellent shoulder strength!", "fas fa-check-circle");
    }
  } else if (currentExercise === "jumpingjack") {
    const leftShoulder = lm[11];
    const rightShoulder = lm[12];
    const leftHip = lm[23];
    const rightHip = lm[24];
    const leftAnkle = lm[27];
    const rightAnkle = lm[28];

    const leftShoulderAngle = calculateAngle(lm[13], leftShoulder, leftHip);
    const rightShoulderAngle = calculateAngle(lm[14], rightShoulder, rightHip);

    const feetDistance = Math.abs(leftAnkle.x - rightAnkle.x);
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);

    // Arms are up and feet are apart
    if (leftShoulderAngle > 130 && rightShoulderAngle > 130 && feetDistance > shoulderWidth * 1.5 && direction === "down") {
      direction = "up"; // "up" state for jumping jacks means arms are up
    }

    // Arms are down and feet are together
    if (leftShoulderAngle < 45 && rightShoulderAngle < 45 && feetDistance < shoulderWidth * 1.2 && direction === "up") {
      direction = "down";
      incrementRep();
      updateFeedback("Great Jack!", "Keep the rhythm!", "fas fa-star");
    }
    
  } else if (currentExercise === "lunge") {
    const leftHip = lm[23];
    const leftKnee = lm[25];
    const leftAnkle = lm[27];
    const rightHip = lm[24];
    const rightKnee = lm[26];
    const rightAnkle = lm[28];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    // Check if in lunge position (one knee bent significantly more than the other)
    const inLungePosition = (leftKneeAngle < 110 && rightKneeAngle > 150) || (rightKneeAngle < 110 && leftKneeAngle > 150);
    const inStandingPosition = leftKneeAngle > 160 && rightKneeAngle > 160;

    if (inLungePosition && direction === "down") {
      updateFeedback("Great Lunge!", "Perfect depth! Push back up!", "fas fa-walking");
      direction = "up";
      formScore = Math.min(100, formScore + 0.5);
    }
    
    if (inStandingPosition && direction === "up") {
      direction = "down";
      incrementRep();
      updateFeedback("Excellent Lunge!", "Great balance and control!", "fas fa-check-circle");
    }
    
  } else if (currentExercise === "plank") {
    const shoulder = lm[11];
    const hip = lm[23];
    const knee = lm[25];
    const elbow = lm[13];
    const wrist = lm[15];
    
    const bodyAngle = calculateAngle(shoulder, hip, knee);
    const armAngle = calculateAngle(shoulder, elbow, wrist);
    
    // Check if maintaining proper plank form
    if (bodyAngle > 160 && armAngle > 160) {
      if (plankStartTime) {
        plankCurrentTime = (Date.now() - plankStartTime) / 1000;
        updateFeedback("Holding Plank", `Great form! Time: ${Math.floor(plankCurrentTime)}s`, "fas fa-grip-horizontal");
        formScore = Math.min(100, formScore + 0.1);
        
        // Add calories every second
        if (Math.floor(plankCurrentTime) > repCount) {
          repCount = Math.floor(plankCurrentTime);
          sessionCalories += exerciseData[currentExercise].calories;
          totalCalories += exerciseData[currentExercise].calories;
          
          // Encouragement every 10 seconds
          if (repCount > 0 && repCount % 10 === 0) {
            speak(`${repCount} seconds! ${getEncouragementMessage()}`);
          }
        }
      }
    } else {
      updateFeedback("Form Check", "Keep body straight like a board!", "fas fa-exclamation");
      formScore = Math.max(60, formScore - 1);
    }
    
  } else if (currentExercise === "burpee") {
    const hip = lm[23];
    const knee = lm[25];
    const ankle = lm[27];
    const shoulder = lm[11];
    const elbow = lm[13];
    
    const kneeAngle = calculateAngle(hip, knee, ankle);
    const bodyHeight = Math.abs(shoulder.y - ankle.y);
    const armAngle = calculateAngle(lm[11], lm[13], lm[15]);
    
    switch (burpeeStage) {
      case 'standing':
        if (kneeAngle < 120) {
          burpeeStage = 'squat';
          updateFeedback("Burpee - Squat", "Good! Now jump back to plank!", "fas fa-arrow-down");
        }
        break;
      case 'squat':
        if (armAngle > 160 && bodyHeight < 0.8) {
          burpeeStage = 'plank';
          updateFeedback("Burpee - Plank", "Perfect! Now jump back up!", "fas fa-grip-horizontal");
        }
        break;
      case 'plank':
        if (kneeAngle < 120 && bodyHeight > 0.8) {
          burpeeStage = 'jump';
          updateFeedback("Burpee - Jump Ready", "Jump up high!", "fas fa-arrow-up");
        }
        break;
      case 'jump':
        if (kneeAngle > 160 && bodyHeight > 1.0) {
          burpeeStage = 'standing';
          incrementRep();
          updateFeedback("Amazing Burpee!", "Full body power!", "fas fa-bolt");
        }
        break;
    }
  }

  updateStats();
}

function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180 / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}

function incrementRep() {
  repCount++;
  totalReps++;
  const caloriesPerRep = exerciseData[currentExercise].calories;
  sessionCalories += caloriesPerRep;
  totalCalories += caloriesPerRep;

  // Add rep animation
  currentRepsElement.parentElement.classList.add('rep-animation');
  setTimeout(() => {
    currentRepsElement.parentElement.classList.remove('rep-animation');
  }, 400);

  // Speak encouragement message every 5 reps
  if (repCount > 0 && repCount % 5 === 0) {
    speak(`${repCount} reps! ${getEncouragementMessage()}`);
  }
}

function getEncouragementMessage() {
  const messages = [
    "Outstanding! Keep that energy up!",
    "Perfect form! You're absolutely crushing it!",
    "Incredible rep! Your hard work shows!",
    "Amazing technique! Push through the burn!",
    "Fantastic! You're getting stronger every rep!",
    "Brilliant execution! Stay focused and strong!",
    "Superb form! You're a natural athlete!",
    "Exceptional work! Feel that muscle activation!",
    "Outstanding dedication! Keep the momentum going!",
    "Perfect! Your consistency is paying off!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function updateStats() {
  if (currentExercise === 'plank') {
    currentRepsElement.textContent = repCount + 's';
    progressTextElement.textContent = `${repCount}s/${targetReps}s`;
  } else {
    currentRepsElement.textContent = repCount;
    progressTextElement.textContent = `${repCount}/${targetReps}`;
  }
  
  currentCaloriesElement.textContent = Math.round(sessionCalories * 10) / 10;
  totalRepsElement.textContent = totalReps;
  totalCaloriesElement.textContent = Math.round(totalCalories * 10) / 10;
  formScoreElement.textContent = Math.round(formScore);

  const progress = Math.min((repCount / targetReps) * 100, 100);
  progressFillElement.style.width = progress + '%';

  if (repCount >= targetReps) {
    const exerciseName = exerciseData[currentExercise].name;
    const unit = currentExercise === 'plank' ? 'seconds' : 'reps';
    updateFeedback("Workout Complete!", `🎉 Amazing! ${targetReps} ${unit} completed!`, "fas fa-trophy");
    speak(`Congratulations! Workout completed! You absolutely dominated those ${targetReps} ${unit} and burned ${Math.round(sessionCalories * 10) / 10} calories! You're a fitness champion!`);
    
    // Save workout to history
    saveWorkoutToHistory();
    
    // Check if following a program
    if (isFollowingProgram && currentProgram) {
      setTimeout(() => {
        nextProgramExercise();
      }, 3000); // 3 seconds before next exercise
    }
  }
}

function startWorkoutTracking() {
  workoutStartTime = Date.now();
  currentWorkoutData = {
    exercise: currentExercise,
    exerciseName: exerciseData[currentExercise].name,
    startTime: workoutStartTime,
    reps: 0,
    calories: 0,
    maxFormScore: formScore,
    date: new Date().toISOString().split('T')[0]
  };
}

function saveWorkoutToHistory() {
  if (!currentWorkoutData || !workoutStartTime) return;
  
  const duration = Math.round((Date.now() - workoutStartTime) / 1000); // seconds
  const completedWorkout = {
    ...currentWorkoutData,
    endTime: Date.now(),
    duration: duration,
    reps: repCount,
    calories: Math.round(sessionCalories * 10) / 10,
    formScore: Math.round(formScore),
    completed: repCount >= targetReps,
    targetReps: targetReps
  };
  
  // Load existing history
  const savedHistory = localStorage.getItem('fittracker-workout-history');
  workoutHistory = savedHistory ? JSON.parse(savedHistory) : [];
  
  // Add new workout
  workoutHistory.unshift(completedWorkout); // Add to beginning
  
  // Keep only last 100 workouts
  if (workoutHistory.length > 100) {
    workoutHistory = workoutHistory.slice(0, 100);
  }
  
  // Save to localStorage
  localStorage.setItem('fittracker-workout-history', JSON.stringify(workoutHistory));
  
  // Update user stats
  userStats.totalWorkouts += 1;
  userStats.totalReps += repCount;
  userStats.totalCalories += completedWorkout.calories;
  updateStreak();
  
  // Add XP for completing workout
  let xpGained = 10; // Base XP
  xpGained += Math.round(repCount * 2); // 2 XP per rep
  xpGained += Math.round(completedWorkout.calories * 3); // 3 XP per calorie
  if (completedWorkout.formScore >= 90) xpGained += 20; // Bonus for good form
  if (completedWorkout.completed) xpGained += 30; // Bonus for completion
  
  addXP(xpGained);
  
  // Check for achievements
  checkAchievements(completedWorkout);
  
  // Reset current workout data
  currentWorkoutData = null;
  workoutStartTime = null;
}

function loadWorkoutHistory() {
  const savedHistory = localStorage.getItem('fittracker-workout-history');
  workoutHistory = savedHistory ? JSON.parse(savedHistory) : [];
}

function displayWorkoutHistory() {
  loadWorkoutHistory();
  
  if (workoutHistory.length === 0) {
    historyEmpty.style.display = 'block';
    updateHistoryStats();
    return;
  }
  
  historyEmpty.style.display = 'none';
  
  // Clear existing items
  const existingItems = workoutHistoryList.querySelectorAll('.history-item');
  existingItems.forEach(item => item.remove());
  
  // Add history items
  workoutHistory.forEach(workout => {
    const historyItem = createHistoryItem(workout);
    workoutHistoryList.appendChild(historyItem);
  });
  
  updateHistoryStats();
}

function createHistoryItem(workout) {
  const item = document.createElement('div');
  item.className = 'history-item';
  
  const date = new Date(workout.startTime);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString();
  
  const duration = formatDuration(workout.duration);
  const unit = workout.exercise === 'plank' ? 's' : ' reps';
  const completedIcon = workout.completed ? '✅' : '⏱️';
  
  item.innerHTML = `
    <div class="history-details">
      <h4>${completedIcon} ${workout.exerciseName}</h4>
      <p>${dateStr} at ${timeStr}</p>
    </div>
    <div class="history-metrics">
      <div class="history-metric">
        <span class="value">${workout.reps}${unit}</span>
        <span class="label">Reps</span>
      </div>
      <div class="history-metric">
        <span class="value">${duration}</span>
        <span class="label">Duration</span>
      </div>
      <div class="history-metric">
        <span class="value">${workout.calories}</span>
        <span class="label">Calories</span>
      </div>
      <div class="history-metric">
        <span class="value">${workout.formScore}%</span>
        <span class="label">Form</span>
      </div>
    </div>
  `;
  
  return item;
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateHistoryStats() {
  const totalWorkouts = workoutHistory.length;
  totalWorkoutsElement.textContent = totalWorkouts;
  
  if (totalWorkouts === 0) {
    avgDurationElement.textContent = '0m';
    favoriteExerciseElement.textContent = '-';
    return;
  }
  
  // Calculate average duration
  const totalDuration = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0);
  const avgDuration = Math.round(totalDuration / totalWorkouts / 60); // in minutes
  avgDurationElement.textContent = `${avgDuration}m`;
  
  // Find favorite exercise
  const exerciseCounts = {};
  workoutHistory.forEach(workout => {
    exerciseCounts[workout.exerciseName] = (exerciseCounts[workout.exerciseName] || 0) + 1;
  });
  
  const favoriteExercise = Object.keys(exerciseCounts).reduce((a, b) => 
    exerciseCounts[a] > exerciseCounts[b] ? a : b, Object.keys(exerciseCounts)[0]
  );
  
  favoriteExerciseElement.textContent = favoriteExercise || '-';
}

function clearWorkoutHistory() {
  if (confirm('Are you sure you want to clear all workout history? This action cannot be undone.')) {
    workoutHistory = [];
    localStorage.removeItem('fittracker-workout-history');
    displayWorkoutHistory();
    speak('Workout history cleared.');
  }
}

function exportWorkoutHistory() {
  loadWorkoutHistory();
  
  if (workoutHistory.length === 0) {
    alert('No workout history to export.');
    return;
  }
  
  // Create CSV content
  const csvHeaders = 'Date,Exercise,Duration (seconds),Reps,Calories,Form Score,Completed,Target Reps\n';
  const csvRows = workoutHistory.map(workout => {
    const date = new Date(workout.startTime).toLocaleDateString();
    return `${date},${workout.exerciseName},${workout.duration},${workout.reps},${workout.calories},${workout.formScore},${workout.completed},${workout.targetReps}`;
  }).join('\n');
  
  const csvContent = csvHeaders + csvRows;
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fittracker-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  speak('Workout history exported successfully.');
}

function loadUserStats() {
  const savedStats = localStorage.getItem('fittracker-user-stats');
  if (savedStats) {
    userStats = { ...userStats, ...JSON.parse(savedStats) };
  }
  updateStreak();
  updateLevel();
}

function saveUserStats() {
  localStorage.setItem('fittracker-user-stats', JSON.stringify(userStats));
}

function updateStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (userStats.lastWorkoutDate === today) {
    // Already worked out today, no change
    return;
  }
  
  if (userStats.lastWorkoutDate === yesterday) {
    // Consecutive day
    userStats.streak += 1;
  } else if (userStats.lastWorkoutDate !== null) {
    // Streak broken
    userStats.streak = 1;
  } else {
    // First workout ever
    userStats.streak = 1;
  }
  
  userStats.lastWorkoutDate = today;
}

function addXP(amount) {
  userStats.xp += amount;
  updateLevel();
  saveUserStats();
}

function updateLevel() {
  let newLevel = userStats.level;
  
  // Check for level up
  while (newLevel < 15 && userStats.xp >= levelSystem[newLevel + 1]?.xpRequired) {
    newLevel++;
  }
  
  if (newLevel > userStats.level) {
    const oldLevel = userStats.level;
    userStats.level = newLevel;
    
    // Level up celebration
    setTimeout(() => {
      updateFeedback("Level Up!", `🎆 Congratulations! You're now level ${newLevel} - ${levelSystem[newLevel].title}!`, "fas fa-star");
      speak(`Level up! You are now level ${newLevel}, ${levelSystem[newLevel].title}! Amazing progress!`);
    }, 2000);
  }
}

function checkAchievements(sessionData = null) {
  loadWorkoutHistory(); // Get latest workout data
  const newAchievements = [];
  
  Object.values(achievements).forEach(achievement => {
    // Skip if already unlocked
    if (userStats.achievements.includes(achievement.id)) return;
    
    // Check condition
    const isUnlocked = achievement.condition(userStats, sessionData, workoutHistory);
    
    if (isUnlocked) {
      userStats.achievements.push(achievement.id);
      newAchievements.push(achievement);
      
      // Add XP reward
      if (achievement.xpReward > 0) {
        addXP(achievement.xpReward);
      }
    }
  });
  
  if (newAchievements.length > 0) {
    pendingAchievements.push(...newAchievements);
    showAchievementNotification();
    saveUserStats();
  }
}

function showAchievementNotification() {
  if (pendingAchievements.length === 0) return;
  
  const achievement = pendingAchievements.shift();
  
  // Show badge notification
  achievementBadge.style.display = 'flex';
  
  // Show achievement popup
  setTimeout(() => {
    updateFeedback("Achievement Unlocked!", `🏆 ${achievement.title}: ${achievement.description}`, "fas fa-trophy");
    speak(`Achievement unlocked! ${achievement.title}. ${achievement.description}`);
    
    // Show next achievement if any
    if (pendingAchievements.length > 0) {
      setTimeout(showAchievementNotification, 4000);
    }
  }, 1500);
}

function displayAchievements() {
  achievementsGrid.innerHTML = '';
  
  Object.values(achievements).forEach(achievement => {
    const isUnlocked = userStats.achievements.includes(achievement.id);
    const achievementCard = createAchievementCard(achievement, isUnlocked);
    achievementsGrid.appendChild(achievementCard);
  });
  
  updateProgressDashboard();
}

function createAchievementCard(achievement, isUnlocked) {
  const card = document.createElement('div');
  card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
  
  const unlockedDate = isUnlocked ? 
    workoutHistory.find(w => {
      // Find the workout where this achievement was likely unlocked
      const tempStats = calculateStatsUpToDate(w.startTime);
      return achievement.condition(tempStats, w, workoutHistory.filter(wh => wh.startTime <= w.startTime));
    })?.startTime : null;
  
  card.innerHTML = `
    <div class="achievement-icon">
      <i class="${achievement.icon}"></i>
    </div>
    <div class="achievement-title">${achievement.title}</div>
    <div class="achievement-description">${achievement.description}</div>
    ${achievement.xpReward > 0 ? `<div class="achievement-progress">+${achievement.xpReward} XP</div>` : ''}
    ${isUnlocked && unlockedDate ? `<div class="achievement-date">${new Date(unlockedDate).toLocaleDateString()}</div>` : ''}
  `;
  
  return card;
}

function calculateStatsUpToDate(date) {
  const workoutsUpToDate = workoutHistory.filter(w => w.startTime <= date);
  return {
    totalWorkouts: workoutsUpToDate.length,
    totalReps: workoutsUpToDate.reduce((sum, w) => sum + w.reps, 0),
    totalCalories: workoutsUpToDate.reduce((sum, w) => sum + w.calories, 0),
    achievements: userStats.achievements, // This would need more complex logic in a real app
    level: userStats.level,
    xp: userStats.xp,
    streak: userStats.streak
  };
}

function updateProgressDashboard() {
  // Update streak
  streakDaysElement.textContent = userStats.streak;
  
  // Update level
  levelDisplayElement.textContent = userStats.level;
  currentLevelElement.textContent = userStats.level;
  levelTitleElement.textContent = levelSystem[userStats.level]?.title || 'Master';
  
  // Update achievements count
  achievementsCountElement.textContent = userStats.achievements.length;
  
  // Update level progress
  const currentLevelInfo = levelSystem[userStats.level];
  const nextLevelInfo = levelSystem[userStats.level + 1];
  
  if (nextLevelInfo) {
    const currentLevelXP = currentLevelInfo.xpRequired;
    const nextLevelXP = nextLevelInfo.xpRequired;
    const progressXP = userStats.xp - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    const progressPercent = (progressXP / requiredXP) * 100;
    
    levelFillElement.style.width = `${Math.min(progressPercent, 100)}%`;
    currentXpElement.textContent = userStats.xp;
    nextLevelXpElement.textContent = nextLevelXP;
  } else {
    // Max level
    levelFillElement.style.width = '100%';
    currentXpElement.textContent = userStats.xp;
    nextLevelXpElement.textContent = 'MAX';
  }
}

function displayWorkoutPrograms() {
  programsGrid.innerHTML = '';
  
  Object.entries(workoutPrograms).forEach(([key, program]) => {
    const programCard = createProgramCard(key, program);
    programsGrid.appendChild(programCard);
  });
  
  setupCustomWorkoutBuilder();
}

function createProgramCard(key, program) {
  const card = document.createElement('div');
  card.className = 'program-card';
  card.dataset.program = key;
  
  const exercisesList = program.exercises.map(ex => {
    const unit = ex.exercise === 'plank' ? 's' : '';
    return `<span class="exercise-tag">${exerciseData[ex.exercise].name}: ${ex.reps}${unit}</span>`;
  }).join('');
  
  card.innerHTML = `
    <div class="program-header">
      <div class="program-icon">
        <i class="${program.icon}"></i>
      </div>
      <div class="program-info">
        <h4>${program.name}</h4>
        <div class="duration">${program.duration}</div>
      </div>
    </div>
    <div class="program-description">
      ${program.description}
    </div>
    <div class="program-exercises">
      ${exercisesList}
    </div>
  `;
  
  card.addEventListener('click', () => {
    selectProgram(key, program);
  });
  
  return card;
}

function selectProgram(key, program) {
  // Remove previous selection
  document.querySelectorAll('.program-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select current program
  document.querySelector(`[data-program="${key}"]`).classList.add('selected');
  
  currentProgram = { key, ...program };
  
  // Show confirmation
  if (confirm(`Start "${program.name}" workout program? This will guide you through ${program.exercises.length} exercises.`)) {
    startProgramWorkout();
    programsModal.classList.remove('active');
  }
}

function startProgramWorkout() {
  if (!currentProgram) return;
  
  isFollowingProgram = true;
  programExerciseIndex = 0;
  
  // Set up first exercise
  const firstExercise = currentProgram.exercises[0];
  currentExercise = firstExercise.exercise;
  targetReps = firstExercise.reps;
  
  // Update UI
  exerciseCards.forEach(c => c.classList.remove('active'));
  const targetCard = document.querySelector(`[data-exercise="${currentExercise}"]`);
  if (targetCard) {
    targetCard.classList.add('active');
  }
  
  resetSession();
  
  const exerciseName = exerciseData[currentExercise].name;
  const unit = currentExercise === 'plank' ? 'seconds' : 'reps';
  updateFeedback("Program Started", `${currentProgram.name} - Exercise 1/${currentProgram.exercises.length}: ${exerciseName} (${targetReps} ${unit})`, "fas fa-play-circle");
  
  speak(`Starting ${currentProgram.name} program! First exercise: ${exerciseName}. Target ${targetReps} ${unit}. Get ready!`);
}

function nextProgramExercise() {
  if (!isFollowingProgram || !currentProgram) return;
  
  programExerciseIndex++;
  
  if (programExerciseIndex >= currentProgram.exercises.length) {
    // Program completed
    isFollowingProgram = false;
    currentProgram = null;
    updateFeedback("Program Complete!", `🎉 Congratulations! You've completed the entire ${currentProgram?.name || 'workout'} program!`, "fas fa-trophy");
    speak(`Outstanding! You've completed the entire workout program! You're absolutely incredible!`);
    return;
  }
  
  // Move to next exercise
  const nextExercise = currentProgram.exercises[programExerciseIndex];
  currentExercise = nextExercise.exercise;
  targetReps = nextExercise.reps;
  
  // Update UI
  exerciseCards.forEach(c => c.classList.remove('active'));
  const targetCard = document.querySelector(`[data-exercise="${currentExercise}"]`);
  if (targetCard) {
    targetCard.classList.add('active');
  }
  
  resetSession();
  
  const exerciseName = exerciseData[currentExercise].name;
  const unit = currentExercise === 'plank' ? 'seconds' : 'reps';
  const progress = `Exercise ${programExerciseIndex + 1}/${currentProgram.exercises.length}`;
  
  updateFeedback("Next Exercise", `${progress}: ${exerciseName} (${targetReps} ${unit})`, "fas fa-arrow-right");
  speak(`Great job! Next exercise: ${exerciseName}. Target ${targetReps} ${unit}. You're doing amazing!`);
  
  // Auto-start next exercise after 3 seconds
  setTimeout(() => {
    if (workoutState === 'idle') {
      startWorkoutFlow();
    }
  }, 3000);
}

function setupCustomWorkoutBuilder() {
  customExercises.innerHTML = '';
  
  Object.entries(exerciseData).forEach(([key, exercise]) => {
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'custom-exercise-item';
    
    const defaultReps = key === 'plank' ? 30 : 15;
    const unit = key === 'plank' ? 's' : '';
    
    exerciseItem.innerHTML = `
      <input type="checkbox" class="custom-exercise-checkbox" data-exercise="${key}">
      <div class="custom-exercise-info">
        <h5>${exercise.name}</h5>
        <div class="custom-exercise-meta">${exercise.calories} cal/rep</div>
      </div>
      <input type="number" class="custom-reps-input" value="${defaultReps}" min="1" max="100" data-reps="${key}">
      <span>${unit}</span>
    `;
    
    customExercises.appendChild(exerciseItem);
  });
}

function startCustomWorkout() {
  const selectedExercises = [];
  
  document.querySelectorAll('.custom-exercise-checkbox:checked').forEach(checkbox => {
    const exercise = checkbox.dataset.exercise;
    const repsInput = document.querySelector(`[data-reps="${exercise}"]`);
    const reps = parseInt(repsInput.value) || 15;
    
    selectedExercises.push({ exercise, reps });
  });
  
  if (selectedExercises.length === 0) {
    alert('Please select at least one exercise for your custom workout.');
    return;
  }
  
  // Create custom program
  currentProgram = {
    key: 'custom',
    name: 'Custom Workout',
    exercises: selectedExercises
  };
  
  programsModal.classList.remove('active');
  startProgramWorkout();
}

function saveCustomWorkout() {
  const selectedExercises = [];
  
  document.querySelectorAll('.custom-exercise-checkbox:checked').forEach(checkbox => {
    const exercise = checkbox.dataset.exercise;
    const repsInput = document.querySelector(`[data-reps="${exercise}"]`);
    const reps = parseInt(repsInput.value) || 15;
    
    selectedExercises.push({ exercise, reps });
  });
  
  if (selectedExercises.length === 0) {
    alert('Please select at least one exercise to save.');
    return;
  }
  
  const programName = prompt('Enter a name for your custom workout program:');
  if (!programName) return;
  
  // Save to localStorage
  const savedPrograms = JSON.parse(localStorage.getItem('fittracker-custom-programs') || '{}');
  savedPrograms[Date.now()] = {
    name: programName,
    exercises: selectedExercises,
    created: new Date().toLocaleDateString()
  };
  
  localStorage.setItem('fittracker-custom-programs', JSON.stringify(savedPrograms));
  
  alert(`Custom workout "${programName}" saved successfully!`);
  speak(`Custom workout program saved!`);
}

function updateFormScore(newScore) {
  formScore = Math.max(0, Math.min(100, newScore));
  formScoreDisplay.textContent = Math.round(formScore);
  
  // Update form score badge color
  formScoreBadge.className = 'form-score-badge';
  if (formScore >= 80) {
    formScoreBadge.classList.add('good');
  } else if (formScore >= 60) {
    formScoreBadge.classList.add('warning');
  } else {
    formScoreBadge.classList.add('poor');
  }
}

function showFormTip(message, type = 'info') {
  // Remove existing tip
  const existingTip = formFeedback.querySelector('.form-tip');
  if (existingTip) {
    existingTip.remove();
  }
  
  // Avoid showing the same tip repeatedly
  if (lastFormTip === message) return;
  lastFormTip = message;
  
  // Create new tip
  const tip = document.createElement('div');
  tip.className = 'form-tip';
  tip.textContent = message;
  formFeedback.appendChild(tip);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (tip.parentNode) {
      tip.remove();
    }
    if (lastFormTip === message) {
      lastFormTip = null;
    }
  }, 3000);
}

function getDetailedFormFeedback(exercise, landmarks) {
  const lm = landmarks;
  let feedback = { score: formScore, tips: [] };
  
  switch (exercise) {
    case "curl":
      const shoulder = lm[11];
      const elbow = lm[13];
      const wrist = lm[15];
      const curvelAngle = calculateAngle(shoulder, elbow, wrist);
      
      // Check elbow stability
      if (elbow.y > shoulder.y - 0.05) {
        feedback.tips.push("Keep your elbow stable!");
        feedback.score -= 2;
      }
      
      // Check full range of motion
      if (curvelAngle < 160 && curvelAngle > 60) {
        feedback.score += 0.5;
      } else if (curvelAngle < 30) {
        feedback.tips.push("Great curl! Full contraction!");
        feedback.score += 1;
      }
      
      // Check posture
      const shoulderAlignment = Math.abs(lm[11].x - lm[12].x);
      if (shoulderAlignment > 0.15) {
        feedback.tips.push("Keep shoulders square!");
        feedback.score -= 1;
      }
      break;
      
    case "squat":
      const hip = lm[23];
      const knee = lm[25];
      const ankle = lm[27];
      const squatAngle = calculateAngle(hip, knee, ankle);
      
      // Check squat depth
      if (squatAngle < 90) {
        feedback.tips.push("Perfect depth!");
        feedback.score += 1;
      } else if (squatAngle > 120) {
        feedback.tips.push("Go deeper for better results!");
        feedback.score -= 1;
      }
      
      // Check knee alignment
      const kneeOverToe = Math.abs(knee.x - ankle.x);
      if (kneeOverToe > 0.1) {
        feedback.tips.push("Keep knees over toes!");
        feedback.score -= 2;
      }
      
      // Check back straight
      const backAngle = calculateAngle(lm[11], lm[23], lm[25]);
      if (backAngle < 160) {
        feedback.tips.push("Keep your back straight!");
        feedback.score -= 2;
      }
      break;
      
    case "pushup":
      const pushupShoulder = lm[11];
      const pushupElbow = lm[13];
      const pushupHip = lm[23];
      
      const elbowAngle = calculateAngle(pushupShoulder, pushupElbow, lm[15]);
      const bodyAlignment = Math.abs(pushupShoulder.y - pushupHip.y);
      
      // Check body alignment
      if (bodyAlignment < 0.1) {
        feedback.tips.push("Perfect plank position!");
        feedback.score += 1;
      } else if (bodyAlignment > 0.2) {
        feedback.tips.push("Keep your body in a straight line!");
        feedback.score -= 2;
      }
      
      // Check push-up depth
      if (elbowAngle < 90) {
        feedback.tips.push("Great depth!");
        feedback.score += 1;
      } else if (elbowAngle > 140) {
        feedback.tips.push("Lower your chest more!");
        feedback.score -= 1;
      }
      break;
      
    case "plank":
      const plankShoulder = lm[11];
      const plankHip = lm[23];
      const plankKnee = lm[25];
      
      const plankBodyAngle = calculateAngle(plankShoulder, plankHip, plankKnee);
      
      if (plankBodyAngle > 170) {
        feedback.tips.push("Perfect plank form!");
        feedback.score += 0.2;
      } else if (plankBodyAngle < 160) {
        feedback.tips.push("Keep your body straight like a board!");
        feedback.score -= 1;
      }
      
      // Check hip height
      if (Math.abs(plankShoulder.y - plankHip.y) > 0.15) {
        feedback.tips.push("Lower your hips!");
        feedback.score -= 1;
      }
      break;
  }
  
  return feedback;
}

function updateFeedback(title, message, iconClass) {
  feedbackTitleElement.textContent = title;
  feedbackMessageElement.textContent = message;
  feedbackIconElement.innerHTML = `<i class="${iconClass}"></i>`;

  // Update icon color based on feedback type
  if (iconClass.includes('check') || iconClass.includes('trophy')) {
    feedbackIconElement.style.background = "linear-gradient(135deg, var(--success), #059669)";
  } else if (iconClass.includes('exclamation')) {
    feedbackIconElement.style.background = "linear-gradient(135deg, var(--warning), #d97706)";
  } else {
    feedbackIconElement.style.background = "linear-gradient(135deg, var(--primary), var(--secondary))";
  }
}

function resetSession() {
  repCount = 0;
  sessionCalories = 0;
  direction = "down";
  formScore = 100;
  plankStartTime = null;
  plankCurrentTime = 0;
  burpeeStage = 'standing';

  clearTimeout(readyTimeoutId);
  clearTimeout(pauseTimeoutId);
  clearTimeout(resumeTimeoutId);
  readyTimeoutId = null;
  pauseTimeoutId = null;
  resumeTimeoutId = null;

  workoutState = camera ? 'preparing' : 'idle';
  
  // Don't reset program if we're following one
  if (!isFollowingProgram) {
    currentProgram = null;
    programExerciseIndex = 0;
  }
  
  updateStats();
  updateFormScore(100);
}

function resetAll() {
  resetSession();
  totalReps = 0;
  totalCalories = 0;
  updateStats();
}

function resetReps() {
    repCount = 0;
    sessionCalories = 0;
    updateStats();
    updateFeedback("Rep Count Reset", "Your reps for this session have been cleared.", "fas fa-undo");
    speak("Rep count reset.");
}

function startWorkoutFlow() {
  showDemoModal();
}

function startCamera() {
  if (camera) return;

  workoutState = 'preparing';
  startButton.disabled = true;
  stopButton.disabled = false;
  resetButton.disabled = false;
  startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Starting...</span>';

  updateFeedback("Initializing Camera", "Getting your workout ready...", "fas fa-camera");

  camera = new Camera(video, {
    onFrame: async () => {
      await pose.send({ image: video });
    },
    width: 640,
    height: 480
  });

  camera.start().then(() => {
    const exerciseName = exerciseData[currentExercise].name;
    updateFeedback("Get Ready", `Prepare for ${exerciseName}.`, "fas fa-user-clock");
    speak(`Camera is ready. Get into position for ${exerciseName}.`);
    startButton.innerHTML = '<i class="fas fa-play"></i><span>Start Workout</span>';
  }).catch((error) => {
    console.error("Failed to acquire camera feed:", error);
    updateFeedback("Camera Error", "Please allow camera access", "fas fa-exclamation-triangle");
    speak("I need camera access to track your workout. Please allow camera permission and try again.");

    workoutState = 'idle';
    startButton.disabled = false;
    stopButton.disabled = true;
    startButton.innerHTML = '<i class="fas fa-play"></i><span>Start Workout</span>';
  });
}

function stopCamera() {
  if (!camera) return;

  workoutState = 'idle';
  clearTimeout(readyTimeoutId);
  clearTimeout(pauseTimeoutId);
  clearTimeout(resumeTimeoutId);
  readyTimeoutId = null;
  pauseTimeoutId = null;
  resumeTimeoutId = null;

  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;

  if (camera.stop) {
    camera.stop();
  }
  camera = null;

  if (video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reset pose indicator
  poseIndicator.style.background = "rgba(107, 114, 128, 0.9)";
  poseIndicator.innerHTML = '<i class="fas fa-user"></i>';

  const exerciseName = exerciseData[currentExercise].name;
  updateFeedback("Workout Ended", `Great session! ${repCount} reps completed`, "fas fa-flag-checkered");
  speak(`Outstanding workout! You completed ${repCount} ${exerciseName} and burned ${Math.round(sessionCalories * 10) / 10} calories! Your dedication is inspiring!`);
}

function speak(text) {
  if (isMuted || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.volume = 0.9;
  utter.rate = 0.85;
  utter.pitch = 1.1;

  // Try to use a more expressive voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice =>
    voice.name.includes('Google') ||
    voice.name.includes('Enhanced') ||
    voice.name.includes('Premium') ||
    voice.name.includes('Neural')
  );
  if (preferredVoice) {
    utter.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utter);
}

// Event listeners
startButton.addEventListener('click', startWorkoutFlow);
stopButton.addEventListener('click', stopCamera);
resetButton.addEventListener('click', resetReps);

focusModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('focus-mode');
  const icon = focusModeBtn.querySelector('i');
  if (document.body.classList.contains('focus-mode')) {
    icon.classList.remove('fa-expand');
    icon.classList.add('fa-compress');
  } else {
    icon.classList.remove('fa-compress');
    icon.classList.add('fa-expand');
  }
});

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  const icon = themeToggleBtn.querySelector('i');
  if (isDarkMode) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
});

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  localStorage.setItem('muted', isMuted ? 'true' : 'false');
  const icon = muteBtn.querySelector('i');
  if (isMuted) {
    icon.classList.remove('fa-volume-up');
    icon.classList.add('fa-volume-mute');
    window.speechSynthesis.cancel();
  } else {
    icon.classList.remove('fa-volume-mute');
    icon.classList.add('fa-volume-up');
  }
});

// History modal event listeners
historyBtn.addEventListener('click', () => {
  historyModal.classList.add('active');
  displayWorkoutHistory();
});

closeHistoryBtn.addEventListener('click', () => {
  historyModal.classList.remove('active');
});

clearHistoryBtn.addEventListener('click', clearWorkoutHistory);
exportHistoryBtn.addEventListener('click', exportWorkoutHistory);

// Close history modal when clicking outside
historyModal.addEventListener('click', (e) => {
  if (e.target === historyModal) {
    historyModal.classList.remove('active');
  }
});

// Programs modal event listeners
programsBtn.addEventListener('click', () => {
  programsModal.classList.add('active');
  displayWorkoutPrograms();
});

closeProgramsBtn.addEventListener('click', () => {
  programsModal.classList.remove('active');
});

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;
    
    // Remove active from all tabs and contents
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Activate current tab
    btn.classList.add('active');
    document.getElementById(`${targetTab}-tab`).classList.add('active');
  });
});

// Custom workout controls
startCustomWorkoutBtn.addEventListener('click', startCustomWorkout);
saveCustomWorkoutBtn.addEventListener('click', saveCustomWorkout);

// Close programs modal when clicking outside
programsModal.addEventListener('click', (e) => {
  if (e.target === programsModal) {
    programsModal.classList.remove('active');
  }
});

// Achievements modal event listeners
achievementsBtn.addEventListener('click', () => {
  achievementsModal.classList.add('active');
  displayAchievements();
  achievementBadge.style.display = 'none'; // Hide notification badge
});

closeAchievementsBtn.addEventListener('click', () => {
  achievementsModal.classList.remove('active');
});

// Close achievements modal when clicking outside
achievementsModal.addEventListener('click', (e) => {
  if (e.target === achievementsModal) {
    achievementsModal.classList.remove('active');
  }
});

// Initialize voices when available
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices are now loaded
  };
}

// Initialize
updateFeedback("Welcome to FitTracker AI", "Choose an exercise and start your journey!", "fas fa-rocket");
speak("Welcome to FitTracker AI! Your personal trainer is ready to help you achieve your fitness goals! Choose an exercise and let's get started!");

// Load workout history
loadWorkoutHistory();

// Load user stats and achievements
loadUserStats();

// Initialize form score display
updateFormScore(100);

// Check for any missed achievements
checkAchievements();

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.querySelector('i').classList.remove('fa-moon');
  themeToggleBtn.querySelector('i').classList.add('fa-sun');
}

// Load saved mute state from localStorage
const savedMuteState = localStorage.getItem('muted');
if (savedMuteState === 'true') {
  isMuted = true;
  muteBtn.querySelector('i').classList.remove('fa-volume-up');
  muteBtn.querySelector('i').classList.add('fa-volume-mute');
}

// Load saved stats from localStorage
const savedStats = localStorage.getItem('fittracker-stats');
if (savedStats) {
  const stats = JSON.parse(savedStats);
  totalReps = stats.totalReps || 0;
  totalCalories = stats.totalCalories || 0;
  updateStats();
}

// Save stats on page unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('fittracker-stats', JSON.stringify({
    totalReps: totalReps,
    totalCalories: totalCalories
  }));
});

console.log("🚀 FitTracker AI loaded and ready!");