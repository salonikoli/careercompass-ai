/**
 * Mock AI Prediction Engine
 * Calculates a distraction risk score and provides personalized feedback.
 */

export function calculateDistractionRisk(taskData) {
  const { taskName, complexity, energyLevel, environment, sleepHours } = taskData;
  
  let riskScore = 0;
  
  // Base risk
  riskScore += 20;

  // Complexity logic
  if (complexity === 'High') riskScore += 25;
  else if (complexity === 'Medium') riskScore += 10;
  else riskScore -= 5;

  // Energy logic (1 to 10), lower energy = higher risk
  const energyFactor = 10 - energyLevel; 
  riskScore += (energyFactor * 3.5);

  // Environment logic
  if (environment === 'Noisy') riskScore += 25;
  else if (environment === 'Moderate') riskScore += 10;
  else riskScore -= 10;
  
  // Sleep logic (assuming optimal is 8)
  const sleepDeficit = Math.max(0, 8 - sleepHours);
  riskScore += (sleepDeficit * 5);

  // Cap between 5 and 98
  riskScore = Math.min(98, Math.max(5, riskScore));
  
  return Math.round(riskScore);
}

export function generateAIFeedback(riskScore, taskData) {
  const { complexity, energyLevel, environment, sleepHours } = taskData;
  
  if (riskScore < 30) {
    return {
      message: "Optimal State Detected",
      body: "Your environment and physiological state are perfectly aligned for deep work. You have a very low risk of distraction. Dive in and make the most of this peak focus window!",
      actions: ["Start a 60-minute focused sprint", "Close non-essential tabs"],
      colorCode: "--risk-low" // Referencing CSS var
    };
  } else if (riskScore < 65) {
    return {
      message: "Moderate Distraction Risk",
      body: `You are in a decent state, but there are friction points. ${environment === 'Noisy' ? "Your noisy environment is the biggest threat right now." : ""} ${energyLevel < 6 ? "Your energy is dipping." : ""}`,
      actions: environment === 'Noisy' 
        ? ["Put on noise-canceling headphones", "Listen to Lo-Fi or white noise"]
        : ["Keep a glass of water nearby", "Use the Pomodoro technique (25m work / 5m break)"],
      colorCode: "--risk-med"
    };
  } else {
    // High risk
    let primaryIssue = "general fatigue";
    if (sleepHours < 5) primaryIssue = "severe sleep deficit";
    else if (environment === 'Noisy' && complexity === 'High') primaryIssue = "high cognitive load in a chaotic environment";

    return {
      message: "Critical Distraction Risk",
      body: `Warning: Your current setup has a high failure rate due to ${primaryIssue}. Relying on willpower alone will likely fail. You need to artificially control your environment right now.`,
      actions: [
        "Break the task into tiny 10-minute micro-tasks",
        "Change locations to somewhere completely quiet", 
        "Take a 15-minute power nap or brisk walk before starting"
      ],
      colorCode: "--risk-high"
    };
  }
}
