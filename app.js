const state = {
  stage: 0,
  priority: "",
  moves: new Set(),
  support: "",
};

const stageNames = {
  teaching: "Active learning",
  assessment: "Feedback for learning",
  ai: "Responsible AI practice",
  belonging: "Belonging + engagement",
};

const supportNames = {
  coaching: "Coaching cycle",
  inquiry: "Inquiry huddle",
  showcase: "Practice showcase",
};

const stages = [...document.querySelectorAll(".stage")];
const steps = [...document.querySelectorAll("#steps li")];
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const footerStatus = document.querySelector("#footer-status");
const progressValue = document.querySelector("#progress-value");
const progressRing = document.querySelector(".progress-ring");
const signalScore = document.querySelector("#signal-score");
const signalCopy = document.querySelector("#signal-copy");
const pathwayPreview = document.querySelector("#pathway-preview");
const nameInput = document.querySelector("#badge-name");
const namePreview = document.querySelector("#badge-name-preview");
const badgeButton = document.querySelector("#download-badge");
const linkedinButton = document.querySelector("#linkedin-share");

function readiness() {
  const focus = state.priority ? 22 : 0;
  const moves = state.moves.size * 12;
  const support = state.support ? 18 : 0;
  return Math.min(100, focus + moves + support);
}

function stageReady() {
  if (state.stage === 0) return Boolean(state.priority);
  if (state.stage === 1) return state.moves.size >= 3;
  if (state.stage === 2) return Boolean(state.support);
  return true;
}

function statusForStage() {
  if (state.stage === 0) return state.priority ? "Priority selected. Continue when the learning focus feels specific." : "Choose a practice priority to continue.";
  if (state.stage === 1) return state.moves.size >= 3 ? `${state.moves.size} learning moves selected. Your design has range.` : `Select ${3 - state.moves.size} more learning move${state.moves.size === 2 ? "" : "s"} to continue.`;
  if (state.stage === 2) return state.support ? "Your transfer rhythm is set. See your pathway and claim the badge." : "Choose one support rhythm to complete the pathway.";
  return "Studio complete. Add your name to download and share your badge.";
}

function updatePathway() {
  if (!state.support) return;
  const moveNames = [...state.moves].map((key) => ({
    content: "focused content",
    practice: "active rehearsal",
    collaboration: "peer collaboration",
    feedback: "feedback loops",
    duration: "a sustained rhythm",
  }[key]));
  const sequence = moveNames.length ? moveNames.join(", ") : "evidence-informed learning moves";
  pathwayPreview.innerHTML = `<span>YOUR PATHWAY</span><strong>${stageNames[state.priority]} → ${sequence} → ${supportNames[state.support]}</strong>`;
}

function updateUI() {
  const score = readiness();
  progressValue.textContent = `${score}%`;
  progressRing.style.background = `conic-gradient(var(--orange) ${score * 3.6}deg, rgba(29,94,147,.16) 0deg)`;
  signalScore.textContent = state.stage === 3 ? `${score}` : score ? `${score}%` : "—";
  signalCopy.textContent = score === 0 ? "Complete the studio to reveal your design signal." : score < 65 ? "Your pathway is taking shape. Add more depth and support." : "Focused, active, and supported: ready for a practical discussion.";

  stages.forEach((stage, index) => {
    const visible = index === state.stage;
    stage.hidden = !visible;
    stage.classList.toggle("active", visible);
  });
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === state.stage);
    step.classList.toggle("done", index < state.stage);
  });

  nextButton.disabled = !stageReady();
  backButton.disabled = state.stage === 0;
  nextButton.innerHTML = state.stage === 2 ? "Complete studio <span>→</span>" : state.stage === 3 ? "Studio complete <span>✓</span>" : "Continue <span>→</span>";
  nextButton.style.visibility = state.stage === 3 ? "hidden" : "visible";
  footerStatus.textContent = statusForStage();
  updatePathway();
}

document.querySelectorAll(".single-choice .choice-card").forEach((button) => {
  button.addEventListener("click", () => {
    state.priority = button.dataset.value;
    document.querySelectorAll(".single-choice .choice-card").forEach((card) => card.classList.toggle("selected", card === button));
    updateUI();
  });
});

document.querySelectorAll(".multi-choice .choice-card").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    state.moves.has(value) ? state.moves.delete(value) : state.moves.add(value);
    button.classList.toggle("selected", state.moves.has(value));
    updateUI();
  });
});

document.querySelectorAll(".support-option").forEach((button) => {
  button.addEventListener("click", () => {
    state.support = button.dataset.value;
    document.querySelectorAll(".support-option").forEach((option) => option.classList.toggle("selected", option === button));
    updateUI();
  });
});

nextButton.addEventListener("click", () => {
  if (!stageReady() || state.stage >= 3) return;
  state.stage += 1;
  updateUI();
  document.querySelector("#studio").scrollIntoView({ behavior: "smooth", block: "start" });
});

backButton.addEventListener("click", () => {
  if (state.stage === 0) return;
  state.stage -= 1;
  updateUI();
});

nameInput.addEventListener("input", () => {
  namePreview.textContent = nameInput.value.trim() || "Your Name";
});

function badgeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  const name = nameInput.value.trim() || "Studio Participant";
  const priority = stageNames[state.priority] || "Professional Learning";

  const gradient = ctx.createLinearGradient(0, 0, 1200, 1200);
  gradient.addColorStop(0, "#11243f");
  gradient.addColorStop(1, "#1d5e93");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 1200);
  ctx.strokeStyle = "#a3e1e4";
  ctx.lineWidth = 3;
  ctx.strokeRect(55, 55, 1090, 1090);

  ctx.fillStyle = "#a3e1e4";
  ctx.beginPath();
  ctx.arc(135, 135, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#11243f";
  ctx.font = "700 36px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("PD", 135, 148);

  ctx.fillStyle = "#cceff1";
  ctx.font = "500 30px monospace";
  ctx.textAlign = "right";
  ctx.fillText("DESIGN STUDIO", 1050, 143);
  ctx.fillStyle = "#f3ca78";
  ctx.textAlign = "left";
  ctx.font = "500 30px monospace";
  ctx.fillText("COMPLETED", 125, 395);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 110px Georgia";
  ctx.fillText("Professional", 125, 520);
  ctx.fillText("Learning", 125, 635);
  ctx.fillStyle = "#a3e1e4";
  ctx.font = "italic 600 110px Georgia";
  ctx.fillText("Pathway", 125, 750);

  ctx.fillStyle = "#f3ca78";
  ctx.font = "500 28px monospace";
  ctx.fillText(name.toUpperCase().slice(0, 42), 125, 875);
  ctx.fillStyle = "#cceff1";
  ctx.font = "400 26px Arial";
  ctx.fillText(`Focus: ${priority}`, 125, 935);
  ctx.fillText(`Pathway signal: ${readiness()}/100`, 125, 980);
  ctx.font = "400 24px monospace";
  ctx.fillText("Evidence-informed planning engagement · 2026", 125, 1080);
  return canvas;
}

badgeButton.addEventListener("click", () => {
  const canvas = badgeCanvas();
  const anchor = document.createElement("a");
  anchor.download = `professional-development-design-studio-badge-${(nameInput.value.trim() || "participant").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  anchor.href = canvas.toDataURL("image/png");
  anchor.click();
  footerStatus.textContent = "Badge downloaded. Use the LinkedIn button to open a post draft and attach the image.";
});

linkedinButton.addEventListener("click", () => {
  const priority = stageNames[state.priority] || "professional learning";
  const text = `I completed the Professional Development Design Studio and built an evidence-informed pathway focused on ${priority}. I explored how focused content, active practice, feedback, collaboration, and sustained support can strengthen professional learning. #ProfessionalLearning #FacultyDevelopment #EducationInnovation`;
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  footerStatus.textContent = "A LinkedIn draft has opened. Attach your downloaded badge, personalize the text, and post when ready.";
});

updateUI();
