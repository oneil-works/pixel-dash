// Pixel Dash DX V3
// Changes:
// - Combined world/theme + level into one stage selector
// - Each stage has its own music and matching theme
// - Escape pauses/resumes
// - Removed red markings on spikes that looked like hitboxes
// - Full-screen game-first layout with menu overlay

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const stageNameEl = document.getElementById("stageName");
const distanceEl = document.getElementById("distance");
const attemptsEl = document.getElementById("attempts");
const stageSelect = document.getElementById("stageSelect");
const modeSelect = document.getElementById("modeSelect");
const startBtn = document.getElementById("startBtn");
const musicBtn = document.getElementById("musicBtn");
const menu = document.getElementById("menu");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");
const mainMenuBtn = document.getElementById("mainMenuBtn");
const deathMenu = document.getElementById("deathMenu");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const deathMenuBtn = document.getElementById("deathMenuBtn");
const practiceControls = document.getElementById("practiceControls");
const placeCheckpointBtn = document.getElementById("placeCheckpointBtn");
const deleteCheckpointBtn = document.getElementById("deleteCheckpointBtn");
const editorBtn = document.getElementById("editorBtn");
const editorMenu = document.getElementById("editorMenu");
const editorStageSelect = document.getElementById("editorStageSelect");
const levelText = document.getElementById("levelText");
const saveLevelBtn = document.getElementById("saveLevelBtn");
const testLevelBtn = document.getElementById("testLevelBtn");
const copyLevelsBtn = document.getElementById("copyLevelsBtn");
const closeEditorBtn = document.getElementById("closeEditorBtn");
const editorToolSelect = document.getElementById("editorToolSelect");
const editorPalette = document.getElementById("editorPalette");
const editorCanvas = document.getElementById("editorCanvas");
const editorCtx = editorCanvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const TILE = 42;
const GROUND_Y = 410;
const CEILING_Y = 96;
const GRAVITY = 1.05;
const JUMP_VELOCITY = -18.4;
const RUN_SPEED = 8.25;
const ROTATION_STEP = Math.PI / 2 / 22;
const JUMP_BUFFER_FRAMES = 3; // lets slightly-early jumps trigger on landing

const themes = {
  mushroomRush: {
    sky: "#57b9ff", far: "#77dc61", far2: "#ffd166", ground: "#a85d2f", groundTop: "#ffe26d",
    player: "#ff3b30", player2: "#ffffff", spike: "#f8f2dc", block: "#d9832e", blockLine: "#57230e",
    accent: "#ffcc33", hazard: "#ff4d4d",
    music: [262, 330, 392, 523, 392, 330, 294, 349, 392, 523, 659, 523]
  },
  forestQuest: {
    sky: "#102f2a", far: "#2f6d3c", far2: "#d8c15c", ground: "#6b4b1f", groundTop: "#d3b45d",
    player: "#36d17d", player2: "#fff4a3", spike: "#f5d76e", block: "#3b7d44", blockLine: "#102314",
    accent: "#d8c15c", hazard: "#ffde59",
    music: [220, 294, 330, 392, 330, 294, 247, 294, 330, 392, 440, 392]
  },
  midnightCastle: {
    sky: "#120d22", far: "#3b285c", far2: "#703a75", ground: "#343040", groundTop: "#8a7bb8",
    player: "#b84dff", player2: "#ffdf6e", spike: "#d9d2ee", block: "#4a4658", blockLine: "#0d0b12",
    accent: "#d083ff", hazard: "#ff4fd8",
    music: [196, 247, 262, 311, 294, 262, 220, 196, 165, 196, 247, 262]
  },
  jungleBlast: {
    sky: "#123729", far: "#227448", far2: "#ff8c1a", ground: "#73522a", groundTop: "#f2994a",
    player: "#ff8c1a", player2: "#222222", spike: "#f2e8bd", block: "#2e8b57", blockLine: "#0b2b17",
    accent: "#ffb000", hazard: "#ff3b30",
    music: [165, 220, 247, 330, 247, 220, 196, 247, 330, 392, 330, 247]
  },
  bubblePop: {
    sky: "#70e2ff", far: "#ff9fd6", far2: "#fff0ff", ground: "#6f54c9", groundTop: "#fff0ff",
    player: "#ff66c4", player2: "#ffffff", spike: "#fff7a1", block: "#67e8f9", blockLine: "#0f5f70",
    accent: "#ff66c4", hazard: "#ffd166",
    music: [392, 440, 523, 659, 523, 440, 392, 330, 392, 494, 587, 659]
  }
};

const stages = [
  {
    name: "1-1 MUSHROOM RUSH",
    theme: "mushroomRush",
    song: {
      tempo: 118,
      lead: [262,330,392,523,659,523,392,330,294,349,440,587,523,392,330,262,330,392,494,659,784,659,494,392,349,440,523,698,659,523,440,349,392,523,659,784,880,784,659,523,392,330,294,330,392,523,392,330],
      bass: [131,131,165,165,196,196,165,165,147,147,175,175,196,196,175,147],
      sfx: "bright"
    },
    map: "..................^......p......^......o......g......^......o......p......g......##......o......^......p......^^......B......o......^......g......o......^......p......g......##......^......"
  },
  {
    name: "2-1 FOREST QUEST",
    theme: "forestQuest",
    song: {
      tempo: 132,
      lead: [220,294,330,392,330,294,247,294,330,392,440,392,330,294,247,220,247,294,370,440,392,330,294,247,220,247,294,330,392,330,294,247,196,247,294,330,392,440,392,330,294,247,220,247,294,330,294,220],
      bass: [110,147,165,147,123,147,165,147,98,123,147,123,110,147,165,147],
      sfx: "quest"
    },
    map: "..................B......o......^......p......g......o......^......p......g......#......p......^......o......##......o......^......g......p......^......o......g......^^......B......"
  },
  {
    name: "3-1 MIDNIGHT CASTLE",
    theme: "midnightCastle",
    song: {
      tempo: 144,
      lead: [196,247,262,311,294,262,220,196,165,196,247,262,311,294,247,196,175,220,262,330,311,262,220,175,196,247,294,349,330,294,247,196,165,196,247,311,392,349,311,247,196,175,165,175,196,247,220,196],
      bass: [98,98,123,123,131,131,123,98,87,87,110,110,123,123,110,87],
      sfx: "castle"
    },
    map: "..................^......o......B......p......g......^......o......^......p......g......##......^......o......p......^^......g......o......^......B......p......g......^......o......^......"
  },
  {
    name: "4-1 JUNGLE BLAST",
    theme: "jungleBlast",
    song: {
      tempo: 108,
      lead: [165,220,247,330,247,220,196,247,330,392,330,247,220,196,165,220,247,330,392,494,392,330,247,220,196,247,330,392,330,247,220,165,165,196,220,247,330,247,220,196,247,330,392,330,247,220,196,165],
      bass: [82,110,82,123,82,110,82,147,98,123,98,147,98,123,98,165],
      sfx: "blast"
    },
    map: "..................p......^......o......g......B......^......o......p......g......^^......#......o......^......p......g......o......##......^......p......g......o......^......"
  },
  {
    name: "5-1 BUBBLE POP",
    theme: "bubblePop",
    song: {
      tempo: 126,
      lead: [392,440,523,659,784,659,523,440,392,494,587,740,659,587,494,392,440,523,659,880,784,659,523,440,392,440,494,587,659,587,494,440,523,659,784,988,880,784,659,523,440,392,440,523,494,440,392,330],
      bass: [196,196,220,220,262,262,220,220,196,247,294,247,220,262,330,262],
      sfx: "pop"
    },
    map: "..................o......^......p......g......o......^......p......g......B......^^......o......p......^......##......g......o......^......p......g......^^......B......o......^......"
  }
];

let activeTheme = themes.mushroomRush;
let stage = stages[0];
let levelTiles = [];
let player;
let cameraX = 0;
let attempts = 1;
let gameState = "menu"; // menu | playing | paused | crashed | won
let showHitboxes = false;
let crashMenuTimer = null;
let objectFlipProgress = 0;
let objectFlipTarget = 0;
let gameMode = "classic"; // classic | turbo | practice
let checkpointX = 0;
let checkpointSpawn = null;
let checkpointMarkers = [];
let particles = [];
let sparks = [];
let shake = 0;
let audioCtx = null;
let musicTimer = null;
let musicOn = true;
let lastTime = 0;
let frame = 0;
let jumpBufferFrames = 0;

const ROBOT_INITIAL_JUMP = -12.5;
const ROBOT_HOLD_BOOST = -0.72;
const ORB_JUMP = -16.5;
const PAD_JUMP = -19.5;
const ROBOT_MAX_HOLD_FRAMES = 18; // caps jump height; tuned around a 5-spike-style maximum
const ROBOT_MAX_RISE = 178;       // hard cap from jump start, in pixels

let jumpHeld = false;
let robotHoldFrames = 0;
let robotJumpStartY = 0;
let robotToneTimer = null;

function applyTheme(themeKey) {
  activeTheme = themes[themeKey];
  document.documentElement.style.setProperty("--accent", activeTheme.accent);
  document.documentElement.style.setProperty("--canvas-border", activeTheme.blockLine);
}

function generateRandomStage(length = 450) {
  const themeKeys = Object.keys(themes);
  const theme = themeKeys[Math.floor(Math.random() * themeKeys.length)];

  let map = ".".repeat(14);
  let cooldown = 0;

  for (let i = 14; i < length; i++) {
    if (cooldown > 0) {
      map += ".";
      cooldown--;
      continue;
    }

    const r = Math.random();

    if (r < 0.15) {
      map += Math.random() < 0.22 ? "^^" : "^";
      if (map.endsWith("^^")) i++;
      cooldown = Math.random() < 0.45 ? 1 : 2;
    } else if (r < 0.21) {
      map += "##";
      i++;
      cooldown = 3;
    } else if (r < 0.245 && i > 28) {
      map += "_";
      cooldown = 4;
    } else {
      map += ".";
    }
  }

  map += ".".repeat(14);
  return {
    name: "?-? RANDOM RUN",
    theme,
    song: {
      tempo: 128 + Math.floor(Math.random() * 32),
      lead: Array.from({ length: 48 }, () => [196, 220, 247, 262, 294, 330, 392, 440, 494, 523][Math.floor(Math.random() * 10)]),
      bass: Array.from({ length: 16 }, () => [98, 110, 123, 131, 147, 165, 196][Math.floor(Math.random() * 7)]),
      sfx: "bright"
    },
    map
  };
}

function parseLevel(map) {
  return [...map].map((symbol, i) => ({ symbol, x: i * TILE }));
}

function buildCheckpointMarkers() {
  checkpointMarkers = [];
}

function placePracticeCheckpoint() {
  if (gameMode !== "practice" || gameState !== "playing" || !player) return;

  const checkpointXWorld = cameraX + player.x;

  checkpointSpawn = {
    cameraX,
    playerX: player.x,
    playerY: player.y,
    vy: player.vy,
    gravityDir: player.gravityDir,
    rotation: player.rotation
  };

  checkpointX = cameraX;

  checkpointMarkers.push({
    x: checkpointXWorld,
    y: player.y + player.h / 2,
    activated: true,
    spawn: { ...checkpointSpawn }
  });

  beep(660, 0.05, "square", 0.04);
  setTimeout(() => beep(880, 0.05, "square", 0.035), 55);
  spawnSparks(player.x, player.y + player.h / 2, 18, -1, 0.8);
}

function deletePracticeCheckpoint() {
  if (gameMode !== "practice") return;

  checkpointMarkers.pop();

  const last = checkpointMarkers[checkpointMarkers.length - 1];
  if (last && last.spawn) {
    checkpointSpawn = { ...last.spawn };
    checkpointX = checkpointSpawn.cameraX;
  } else {
    checkpointX = 0;
    checkpointSpawn = null;
  }

  beep(220, 0.04, "triangle", 0.035);
  setTimeout(() => beep(165, 0.045, "triangle", 0.03), 45);
}

function updatePracticeControls() {
  const show = gameMode === "practice" && gameState !== "menu";
  practiceControls.classList.toggle("hidden", !show);
}

function resetGame(newAttempt = false) {
  if (newAttempt) attempts++;
  player = {
    x: 115,
    y: GROUND_Y - 34,
    w: 34,
    h: 34,
    vy: 0,
    onGround: true,
    rotation: 0,
    trail: [],
    gravityDir: 1,
    lastOrbHit: -1,
    lastPortalHit: -1
  };

  if (gameMode === "practice" && checkpointSpawn) {
    player.x = checkpointSpawn.playerX;
    player.y = checkpointSpawn.playerY;
    player.vy = checkpointSpawn.vy;
    player.gravityDir = checkpointSpawn.gravityDir;
    player.rotation = checkpointSpawn.rotation;
    player.onGround = false;
  }

  cameraX = gameMode === "practice" && checkpointSpawn ? checkpointSpawn.cameraX : 0;
  gameState = "playing";
  particles = [];
  sparks = [];
  shake = 0;
  showHitboxes = false;
  objectFlipProgress = 0;
  objectFlipTarget = 0;
  if (crashMenuTimer) {
    clearTimeout(crashMenuTimer);
    crashMenuTimer = null;
  }
  jumpBufferFrames = 0;
  jumpHeld = false;
  robotHoldFrames = 0;
  robotJumpStartY = 0;
  stopRobotTone();
  attemptsEl.textContent = `ATTEMPT ${attempts}`;
  distanceEl.textContent = "0%";
  stageNameEl.textContent = `${stage.name} · ${gameMode.toUpperCase()}`;
  editorMenu.classList.add("hidden");
  menu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  deathMenu.classList.add("hidden");
  updatePracticeControls();
}

function loadStage(value) {
  attempts = 1;

  if (value === "random") {
    stage = generateRandomStage();
  } else {
    stage = stages[Number(value)];
  }

  applyTheme(stage.theme);
  levelTiles = parseLevel(stage.map);
  buildCheckpointMarkers();
  stageNameEl.textContent = `${stage.name} · ${gameMode.toUpperCase()}`;
  attemptsEl.textContent = "ATTEMPT 1";
  distanceEl.textContent = "0%";

  if (musicOn) startMusic();
}

function sanitizeMapText(text) {
  return text.replace(/\s+/g, "").replace(/[^.\^#_opgB]/g, "");
}

function getEditorMap() {
  return sanitizeMapText(levelText.value);
}

function setEditorTool(tool) {
  editorToolSelect.value = tool;
  editorPalette.querySelectorAll("button").forEach(btn => {
    btn.classList.toggle("active-tool", btn.dataset.tool === tool);
  });
}

function symbolForEditorCell(mapSymbol, row) {
  if (row === 0) {
    if (mapSymbol === "o" || mapSymbol === "g" || mapSymbol === "B") return mapSymbol;
    return ".";
  }

  if (row === 1) {
    if (mapSymbol === "^" || mapSymbol === "#") return mapSymbol;
    return ".";
  }

  if (row === 2) {
    if (mapSymbol === "_" || mapSymbol === "p") return mapSymbol;
    return ".";
  }

  return ".";
}

function applyEditorCell(index, row) {
  let map = getEditorMap().split("");
  while (index >= map.length) map.push(".");
  const tool = editorToolSelect.value;

  if (tool === ".") {
    map[index] = ".";
  } else if (tool === "o" || tool === "g" || tool === "B") {
    map[index] = row === 0 ? tool : map[index];
  } else if (tool === "^" || tool === "#") {
    map[index] = row === 1 ? tool : map[index];
  } else if (tool === "_" || tool === "p") {
    map[index] = row === 2 ? tool : map[index];
  }

  levelText.value = map.join("");
  drawEditorGrid();
}

function drawEditorGrid() {
  if (!editorCtx) return;

  const map = getEditorMap();
  const cols = Math.max(120, map.length + 12);
  const cell = 18;
  const top = 24;
  const rows = 3;

  editorCanvas.width = cols * cell;
  editorCanvas.height = 220;

  editorCtx.fillStyle = "#101020";
  editorCtx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);

  editorCtx.fillStyle = activeTheme.sky || "#202040";
  editorCtx.globalAlpha = 0.55;
  editorCtx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);
  editorCtx.globalAlpha = 1;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = c * cell;
      const y = top + r * cell;

      editorCtx.strokeStyle = "rgba(255,255,255,0.15)";
      editorCtx.lineWidth = 1;
      editorCtx.strokeRect(x, y, cell, cell);
    }

    if (c % 8 === 0) {
      editorCtx.fillStyle = "rgba(0,0,0,0.25)";
      editorCtx.fillRect(c * cell, top, 2, rows * cell);
    }
  }

  // Ground/floor band
  editorCtx.fillStyle = activeTheme.ground || "#6b4b1f";
  editorCtx.fillRect(0, top + 3 * cell + 8, editorCanvas.width, 36);
  editorCtx.fillStyle = activeTheme.groundTop || "#ffe26d";
  editorCtx.fillRect(0, top + 3 * cell + 8, editorCanvas.width, 6);

  for (let i = 0; i < map.length; i++) {
    const symbol = map[i];
    if (symbol === ".") continue;

    let row = 1;
    if (symbol === "o" || symbol === "g" || symbol === "B") row = 0;
    if (symbol === "_" || symbol === "p") row = 2;

    const x = i * cell;
    const y = top + row * cell;

    drawEditorSymbol(symbol, x, y, cell);
  }

  editorCtx.fillStyle = "#fff7c7";
  editorCtx.font = '900 13px "Courier New", monospace';
  editorCtx.fillText("AIR / ORBS / PORTALS / AIR BLOCKS", 8, top - 8);
  editorCtx.fillText("BLOCKS / SPIKES", 8, top + cell + 14);
  editorCtx.fillText("FLOOR / PADS / PITS", 8, top + cell * 2 + 14);
}

function drawEditorSymbol(symbol, x, y, cell) {
  editorCtx.save();

  if (symbol === "^") {
    editorCtx.fillStyle = activeTheme.spike || "#fff";
    editorCtx.beginPath();
    editorCtx.moveTo(x + cell / 2, y + 2);
    editorCtx.lineTo(x + 2, y + cell - 2);
    editorCtx.lineTo(x + cell - 2, y + cell - 2);
    editorCtx.closePath();
    editorCtx.fill();
    editorCtx.strokeStyle = "#05050a";
    editorCtx.lineWidth = 2;
    editorCtx.stroke();
  }

  if (symbol === "#" || symbol === "B") {
    editorCtx.fillStyle = activeTheme.block || "#d9832e";
    editorCtx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
    editorCtx.strokeStyle = "#05050a";
    editorCtx.lineWidth = 2;
    editorCtx.strokeRect(x + 1, y + 1, cell - 2, cell - 2);
  }

  if (symbol === "_") {
    editorCtx.fillStyle = "#05050a";
    editorCtx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
  }

  if (symbol === "o") {
    editorCtx.fillStyle = activeTheme.accent || "#ffcc33";
    editorCtx.fillRect(x + 4, y + 4, cell - 8, cell - 8);
    editorCtx.strokeStyle = "#05050a";
    editorCtx.lineWidth = 2;
    editorCtx.strokeRect(x + 4, y + 4, cell - 8, cell - 8);
  }

  if (symbol === "p") {
    editorCtx.fillStyle = activeTheme.accent || "#ffcc33";
    editorCtx.fillRect(x + 2, y + cell - 7, cell - 4, 6);
    editorCtx.strokeStyle = "#05050a";
    editorCtx.lineWidth = 2;
    editorCtx.strokeRect(x + 2, y + cell - 7, cell - 4, 6);
  }

  if (symbol === "g") {
    editorCtx.strokeStyle = activeTheme.accent || "#ffcc33";
    editorCtx.lineWidth = 3;
    editorCtx.strokeRect(x + 4, y - 2, cell - 8, cell * 3);
    editorCtx.fillStyle = "rgba(255,255,255,0.18)";
    editorCtx.fillRect(x + 6, y + 2, cell - 12, cell * 3 - 8);
  }

  editorCtx.restore();
}


function openLevelEditor() {
  gameState = "menu";
  menu.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  deathMenu.classList.add("hidden");
  editorMenu.classList.remove("hidden");
  practiceControls.classList.add("hidden");

  editorStageSelect.value = stageSelect.value === "random" ? "0" : stageSelect.value;
  levelText.value = stages[Number(editorStageSelect.value)].map;
  setEditorTool(editorToolSelect.value || ".");
  drawEditorGrid();
}

function closeLevelEditor() {
  editorMenu.classList.add("hidden");
  editorMenu.classList.add("hidden");
  editorMenu.classList.add("hidden");
  menu.classList.remove("hidden");
}

function loadEditorStageText() {
  levelText.value = stages[Number(editorStageSelect.value)].map;
  drawEditorGrid();
}

function saveEditorLevel() {
  const index = Number(editorStageSelect.value);
  const cleaned = sanitizeMapText(levelText.value);

  if (cleaned.length < 30) {
    alert("Level is too short. Add more map characters.");
    return false;
  }

  stages[index].map = cleaned;
  levelText.value = cleaned;
  drawEditorGrid();

  beep(660, 0.05, "square", 0.04);
  setTimeout(() => beep(880, 0.05, "square", 0.035), 55);
  return true;
}

function testEditorLevel() {
  if (!saveEditorLevel()) return;

  stageSelect.value = editorStageSelect.value;
  editorMenu.classList.add("hidden");
  menu.classList.add("hidden");

  gameMode = "practice";
  modeSelect.value = "practice";
  checkpointX = 0;
  if (typeof checkpointSpawn !== "undefined") checkpointSpawn = null;
  loadStage(stageSelect.value);
  checkpointMarkers = [];
  resetGame(false);
}

function exportAllLevels() {
  const exportText = stages.map((s, index) => `${index + 1}. ${s.name}\\n${s.map}`).join("\\n\\n");

  navigator.clipboard.writeText(exportText).then(() => {
    alert("Copied all level maps. Paste them back into chat for the final build.");
  }).catch(() => {
    prompt("Copy these level maps:", exportText);
  });
}

function startGame() {
  ensureAudio();
  gameMode = modeSelect.value;
  checkpointX = 0;
  checkpointSpawn = null;
  loadStage(stageSelect.value);
  resetGame(false);
}

function openMainMenu() {
  showHitboxes = false;
  if (crashMenuTimer) {
    clearTimeout(crashMenuTimer);
    crashMenuTimer = null;
  }
  jumpHeld = false;
  robotHoldFrames = 0;
  robotJumpStartY = 0;
  stopRobotTone();
  gameState = "menu";
  menu.classList.remove("hidden");
  pauseMenu.classList.add("hidden");
  deathMenu.classList.add("hidden");
  updatePracticeControls();
}

function togglePause() {
  if (gameState === "playing") {
    gameState = "paused";
    pauseMenu.classList.remove("hidden");
  } else if (gameState === "paused") {
    gameState = "playing";
    pauseMenu.classList.add("hidden");
  }
}

function getRobotHoldRatio() {
  return Math.min(1, robotHoldFrames / ROBOT_MAX_HOLD_FRAMES);
}

function startRobotJump() {
  player.vy = ROBOT_INITIAL_JUMP * player.gravityDir;
  player.onGround = false;
  jumpHeld = true;
  robotHoldFrames = 0;
  robotJumpStartY = player.y;

  spawnSparks(player.x, player.y + player.h, 8, -2, 0.25);
  playJumpSfx(0.25);
  startRobotTone();
}

function jumpPress() {
  if (gameState === "menu" || gameState === "paused") return;

  if (gameState === "won") {
    resetGame(false);
    return;
  }

  if (gameState === "crashed") {
    showHitboxes = false;
    resetGame(true);
    return;
  }

  if (player.onGround) {
    startRobotJump();
  } else {
    if (tryActivateOrb()) return;
    // Jump buffer still helps when pressing just before touching down.
    jumpBufferFrames = JUMP_BUFFER_FRAMES;
    jumpHeld = true;
  }
}

function jumpRelease() {
  jumpHeld = false;
  stopRobotTone();
}

function crash() {
  if (gameState !== "playing") return;

  gameState = "crashed";
  jumpHeld = false;
  robotHoldFrames = 0;
  stopRobotTone();

  shake = 18;
  showHitboxes = true;
  playCrashSfx();

  for (let i = 0; i < 28; i++) {
    particles.push({
      x: cameraX + player.x + player.w / 2,
      y: player.y + player.h / 2,
      vx: (Math.random() - 0.5) * 13,
      vy: (Math.random() - 0.5) * 13,
      size: 4 + Math.random() * 6,
      life: 45
    });
  }

  if (crashMenuTimer) clearTimeout(crashMenuTimer);
  crashMenuTimer = setTimeout(() => {
    if (gameState === "crashed") {
      deathMenu.classList.remove("hidden");
    }
  }, 500);
}

function win() {
  gameState = "won";
  shake = 7;
  beep(660, 0.08, "square", 0.08);
  setTimeout(() => beep(880, 0.1, "square", 0.08), 120);
  setTimeout(() => beep(990, 0.12, "square", 0.08), 240);
}

function spawnSparks(x, y, count = 5, direction = 1, power = 0) {
  for (let i = 0; i < count; i++) {
    sparks.push({
      x: cameraX + x,
      y,
      vx: direction * (1 + Math.random() * (4 + power * 5)),
      vy: -Math.random() * (4 + power * 5),
      size: 4 + Math.floor(power * 4),
      life: 18 + Math.random() * 10 + power * 16
    });
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function getGroundAtWorldX(worldX) {
  const tileIndex = Math.floor(worldX / TILE);
  const tile = levelTiles[tileIndex];

  if (!tile || tile.symbol === "_") {
    return player.gravityDir === 1 ? H + 200 : -200;
  }

  if (player.gravityDir === -1) {
    return CEILING_Y;
  }

  if (tile.symbol === "B") {
    return GROUND_Y - TILE * 3;
  }

  if (tile.symbol === "#") {
    return GROUND_Y - TILE;
  }

  return GROUND_Y;
}


function lerp(a, b, t) {
  return a + (b - a) * t;
}

function flipProgressY(y, h = 0) {
  // Smoothly swaps an object between bottom-side placement and top-side placement.
  // This is a top/bottom gameplay swap, not a camera mirror.
  const flippedY = CEILING_Y + (GROUND_Y - (y + h));
  return lerp(y, flippedY, objectFlipProgress);
}

function objectY(symbol) {
  if (symbol === "B") return GROUND_Y - TILE * 3;
  if (symbol === "o") return GROUND_Y - 108;
  if (symbol === "p") return GROUND_Y - 12;
  if (symbol === "g") return CEILING_Y;
  if (symbol === "^") return GROUND_Y - 34;
  if (symbol === "#") return GROUND_Y - TILE;
  return GROUND_Y;
}

function objectBoxForTile(t) {
  if (t.symbol === "B") {
    const y = flipProgressY(objectY("B"), TILE);
    return { x: t.x, y, w: TILE, h: TILE };
  }

  if (t.symbol === "o") {
    const y = flipProgressY(objectY("o"), TILE - 12);
    return { x: t.x + 6, y, w: TILE - 12, h: TILE - 12 };
  }

  if (t.symbol === "p") {
    const y = flipProgressY(objectY("p"), 12);
    return { x: t.x + 4, y, w: TILE - 8, h: 12 };
  }

  if (t.symbol === "g") {
    return { x: t.x + 6, y: CEILING_Y, w: TILE - 12, h: GROUND_Y - CEILING_Y };
  }

  if (t.symbol === "#") {
    const y = flipProgressY(objectY("#"), TILE);
    return { x: t.x, y, w: TILE, h: TILE };
  }

  if (t.symbol === "^") {
    const y = flipProgressY(objectY("^"), 34);
    return { x: t.x + 8, y, w: TILE - 16, h: 34 };
  }

  return null;
}

function flipGravity(tileIndex) {
  if (player.lastPortalHit === tileIndex) return;
  player.lastPortalHit = tileIndex;

  player.gravityDir *= -1;
  objectFlipTarget = player.gravityDir === -1 ? 1 : 0;

  player.vy = 0;
  player.onGround = false;

  // Move the cube safely to the gravity lane, but keep the camera normal.
  if (player.gravityDir === -1) {
    player.y = CEILING_Y + 6;
  } else {
    player.y = GROUND_Y - player.h - 6;
  }

  cameraX += 18;

  shake = Math.max(shake, 5);
  beep(330, 0.045, "square", 0.05);
  setTimeout(() => beep(660, 0.05, "square", 0.035), 50);
  spawnSparks(player.x + player.w / 2, player.y + player.h / 2, 18, -1, 0.8);
}

function triggerOrb(tileIndex) {
  if (player.lastOrbHit === tileIndex) return;
  player.lastOrbHit = tileIndex;
  player.vy = ORB_JUMP * player.gravityDir;
  player.onGround = false;
  jumpHeld = false;
  robotHoldFrames = 0;
  shake = Math.max(shake, 4);
  beep(740, 0.04, "square", 0.05);
  setTimeout(() => beep(980, 0.05, "triangle", 0.035), 45);
  spawnSparks(player.x + player.w / 2, player.y + player.h / 2, 20, -1, 0.9);
}

function triggerPad() {
  player.vy = PAD_JUMP * player.gravityDir;
  player.onGround = false;
  jumpHeld = false;
  robotHoldFrames = 0;
  shake = Math.max(shake, 5);
  beep(520, 0.04, "square", 0.05);
  setTimeout(() => beep(1040, 0.06, "square", 0.04), 45);
  spawnSparks(player.x + player.w / 2, player.y + player.h / 2, 22, -1, 1);
}

function tryActivateOrb() {
  if (!player || gameState !== "playing") return false;

  const playerWorldX = cameraX + player.x;
  const playerBox = { x: playerWorldX + 6, y: player.y + 6, w: player.w - 12, h: player.h - 12 };

  const start = Math.max(0, Math.floor(cameraX / TILE) - 2);
  const end = Math.min(levelTiles.length, start + 34);

  for (let i = start; i < end; i++) {
    const t = levelTiles[i];
    if (t.symbol !== "o") continue;

    const orbBox = objectBoxForTile(t);
    if (rectsOverlap(playerBox, orbBox)) {
      triggerOrb(i);
      return true;
    }
  }

  return false;
}

function update() {
  frame++;

  objectFlipProgress += (objectFlipTarget - objectFlipProgress) * 0.12;
  if (Math.abs(objectFlipTarget - objectFlipProgress) < 0.002) objectFlipProgress = objectFlipTarget;

  if (gameState === "playing") {
    const modeSpeed = gameMode === "turbo" ? RUN_SPEED * 1.25 : RUN_SPEED;
    cameraX += modeSpeed;

    if (jumpBufferFrames > 0) jumpBufferFrames--;

    if (jumpHeld && !player.onGround && robotHoldFrames < ROBOT_MAX_HOLD_FRAMES) {
      const riseDistance = player.gravityDir === 1 ? robotJumpStartY - player.y : player.y - robotJumpStartY;
      if (riseDistance < ROBOT_MAX_RISE) {
        player.vy += ROBOT_HOLD_BOOST * player.gravityDir;
        robotHoldFrames++;
        if (robotHoldFrames >= ROBOT_MAX_HOLD_FRAMES || riseDistance >= ROBOT_MAX_RISE * 0.92) {
          shake = Math.max(shake, 3);
          spawnSparks(player.x, player.y + player.h, 4 + Math.floor(getRobotHoldRatio() * 8), -2, getRobotHoldRatio());
        }
      }
    }

    player.vy += GRAVITY * player.gravityDir;
    player.y += player.vy;

    const playerWorldX = cameraX + player.x;
    const ground = getGroundAtWorldX(playerWorldX + player.w / 2);

    if (player.gravityDir === 1 && player.y + player.h >= ground) {
      const wasAirborne = !player.onGround;
      player.y = ground - player.h;
      player.vy = 0;
      player.onGround = true;

      const quarter = Math.PI / 2;
      player.rotation = Math.round(player.rotation / quarter) * quarter;

      if (wasAirborne) {
        spawnSparks(player.x + 8, ground, 7, -1);
        playLandSfx();
      }

      if (jumpBufferFrames > 0) {
        startRobotJump();
      }
    } else if (player.gravityDir === -1 && player.y <= ground) {
      const wasAirborne = !player.onGround;
      player.y = ground;
      player.vy = 0;
      player.onGround = true;

      const quarter = Math.PI / 2;
      player.rotation = Math.round(player.rotation / quarter) * quarter;

      if (wasAirborne) {
        spawnSparks(player.x + 8, ground, 7, -1);
        playLandSfx();
      }

      if (jumpBufferFrames > 0) {
        startRobotJump();
      }
    } else {
      player.onGround = false;
    }

    if (!player.onGround) player.rotation += ROTATION_STEP;

    player.trail.push({ x: cameraX + player.x, y: player.y, life: 10 });
    if (player.trail.length > 10) player.trail.shift();

    if (player.y > H + 100 || player.y < -140) crash();

    const playerBox = { x: playerWorldX + 6, y: player.y + 6, w: player.w - 12, h: player.h - 12 };

    const start = Math.max(0, Math.floor(cameraX / TILE) - 2);
    const end = Math.min(levelTiles.length, start + 34);

    for (let i = start; i < end; i++) {
      const t = levelTiles[i];

      if (t.symbol === "^") {
        const spikeBox = objectBoxForTile(t);
        if (rectsOverlap(playerBox, spikeBox)) crash();
      }

      if (t.symbol === "#" || t.symbol === "B") {
        const blockBox = objectBoxForTile(t);
        if (rectsOverlap(playerBox, blockBox)) {
          const standingOnTop = player.gravityDir === 1 && player.y + player.h <= blockBox.y + 14;
          const standingUnder = player.gravityDir === -1 && player.y >= blockBox.y + blockBox.h - 14;
          if (!standingOnTop && !standingUnder) crash();
        }
      }

      if (t.symbol === "p") {
        const padBox = objectBoxForTile(t);
        if (rectsOverlap(playerBox, padBox)) triggerPad();
      }

      if (t.symbol === "g") {
        const portalBox = objectBoxForTile(t);
        if (rectsOverlap(playerBox, portalBox)) flipGravity(i);
      }
    }

    if (player.lastPortalHit >= 0) {
      const portal = levelTiles[player.lastPortalHit];
      if (!portal || cameraX + player.x > portal.x + TILE * 1.5) {
        player.lastPortalHit = -1;
      }
    }

    const percent = Math.min(100, Math.floor((cameraX / ((levelTiles.length - 14) * TILE)) * 100));
    distanceEl.textContent = `${percent}%`;

    if (cameraX > (levelTiles.length - 10) * TILE) win();
  }

  if (gameState !== "paused" && gameState !== "menu") {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);

    sparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.22;
      s.life--;
    });
    sparks = sparks.filter(s => s.life > 0);
  }

  if (shake > 0) shake *= 0.82;
}

function drawPixelText(text, x, y, size = 16, color = activeTheme.accent) {
  ctx.fillStyle = "#05050a";
  ctx.font = `900 ${size}px "Courier New", monospace`;
  ctx.fillText(text, x + 3, y + 3);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawThemeBackgroundDetails() {
  const themeName = stage.theme;

  if (themeName === "forestQuest") {
    for (let i = -2; i < 12; i++) {
      const x = Math.floor(i * 118 - (cameraX * 0.20) % 118);
      const base = 330 + (i % 3) * 8;

      ctx.fillStyle = "#4a2f1a";
      ctx.fillRect(x + 48, base - 78, 16, 78);

      ctx.fillStyle = "#174f2b";
      ctx.fillRect(x + 18, base - 132, 76, 28);
      ctx.fillRect(x + 8, base - 106, 96, 34);
      ctx.fillRect(x + 24, base - 78, 64, 28);

      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(x + 28, base - 124, 22, 6);
    }
  }

  if (themeName === "midnightCastle") {
    const moonX = 780 - Math.floor((cameraX * 0.05) % 980);
    ctx.fillStyle = "rgba(240,230,255,0.86)";
    ctx.fillRect(moonX, 76, 54, 54);
    ctx.fillStyle = activeTheme.sky;
    ctx.fillRect(moonX + 24, 70, 40, 42);

    for (let i = -1; i < 6; i++) {
      const x = Math.floor(i * 260 - (cameraX * 0.16) % 260);
      const y = 238;

      ctx.fillStyle = "#100819";
      ctx.fillRect(x + 48, y - 78, 44, 110);
      ctx.fillRect(x + 92, y - 118, 54, 150);
      ctx.fillRect(x + 146, y - 88, 44, 120);
      ctx.fillRect(x + 54, y - 94, 32, 16);
      ctx.fillRect(x + 100, y - 136, 38, 18);
      ctx.fillRect(x + 152, y - 104, 32, 16);

      ctx.fillStyle = activeTheme.accent;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(x + 108, y - 88, 8, 14);
      ctx.fillRect(x + 126, y - 58, 8, 14);
      ctx.fillRect(x + 64, y - 45, 8, 14);
      ctx.globalAlpha = 1;
    }
  }

  if (themeName === "mushroomRush") {
    for (let i = -1; i < 9; i++) {
      const x = Math.floor(i * 170 - (cameraX * 0.18) % 170);
      ctx.fillStyle = "#4fbf5a";
      ctx.fillRect(x + 24, 292, 84, 36);
      ctx.fillRect(x + 42, 266, 48, 28);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(x + 48, 274, 12, 8);
    }
  }

  if (themeName === "jungleBlast") {
    for (let i = -2; i < 12; i++) {
      const x = Math.floor(i * 96 - (cameraX * 0.22) % 96);
      ctx.fillStyle = "#0b3f24";
      ctx.fillRect(x + 24, 190, 18, 150);
      ctx.fillStyle = "#1d7a3f";
      ctx.fillRect(x + 6, 178, 54, 18);
      ctx.fillRect(x, 204, 70, 24);
      ctx.fillStyle = activeTheme.far2;
      ctx.fillRect(x + 42, 190, 6, 88);
    }
  }

  if (themeName === "bubblePop") {
    for (let i = -1; i < 10; i++) {
      const x = Math.floor(i * 128 - (cameraX * 0.19) % 128);
      const y = 105 + ((i * 47) % 170);
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 32, y, 34, 34);
      ctx.strokeRect(x + 48, y + 12, 18, 18);
    }
  }
}

function drawBackground() {
  ctx.fillStyle = activeTheme.sky;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = activeTheme.far2;
  for (let i = -1; i < 8; i++) {
    const x = Math.floor(i * 190 - (cameraX * 0.13) % 190);
    ctx.fillRect(x + 20, 250, 42, 78);
    ctx.fillRect(x + 62, 220, 54, 108);
    ctx.fillRect(x + 116, 270, 62, 58);
  }

  drawThemeBackgroundDetails();

  ctx.fillStyle = activeTheme.far;
  for (let i = -1; i < 9; i++) {
    const x = Math.floor(i * 160 - (cameraX * 0.28) % 160);
    ctx.fillRect(x, 312, 140, 30);
    ctx.fillRect(x + 24, 282, 86, 32);
    ctx.fillRect(x + 56, 254, 40, 28);
  }

  ctx.globalAlpha = 0.26;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 34; i++) {
    const x = Math.floor((i * 91 - cameraX * 0.55) % (W + 40)) - 20;
    const y = 42 + ((i * 47) % 210);
    const blink = (frame + i * 7) % 52 < 26;
    if (blink) ctx.fillRect(x, y, 4, 4);
  }
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ffffff";
  for (let y = 70; y < 350; y += 52) {
    const x = Math.floor(W - ((cameraX * 2 + y * 5) % (W + 160)));
    ctx.fillRect(x, y, 72, 4);
  }
  ctx.globalAlpha = 1;
}

function drawCeilingLane() {
  ctx.fillStyle = activeTheme.ground;
  ctx.fillRect(0, 0, W, CEILING_Y);

  ctx.fillStyle = activeTheme.groundTop;
  ctx.fillRect(0, CEILING_Y, W, 10);

  for (let x = -((cameraX) % TILE); x < W; x += TILE) {
    ctx.strokeStyle = "rgba(0,0,0,0.24)";
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.floor(x), CEILING_Y - TILE, TILE, TILE);
  }
}

function drawGround() {
  ctx.fillStyle = activeTheme.ground;
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

  ctx.fillStyle = activeTheme.groundTop;
  ctx.fillRect(0, GROUND_Y, W, 12);

  for (let x = -((cameraX) % TILE); x < W; x += TILE) {
    ctx.strokeStyle = "rgba(0,0,0,0.34)";
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.floor(x), GROUND_Y, TILE, TILE);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(Math.floor(x) + 5, GROUND_Y + 8, 14, 5);
  }
}

function drawLevel() {
  const start = Math.max(0, Math.floor(cameraX / TILE) - 2);
  const end = Math.min(levelTiles.length, start + 34);

  for (let i = start; i < end; i++) {
    const t = levelTiles[i];
    const sx = Math.round(t.x - cameraX);

    if (t.symbol === "_") {
      ctx.fillStyle = "#05050a";
      ctx.fillRect(sx, GROUND_Y, TILE, H - GROUND_Y);
      continue;
    }

    if (t.symbol === "^") {
      const spikeY = flipProgressY(objectY("^"), 34);
      const flipped = objectFlipProgress > 0.5;

      ctx.fillStyle = activeTheme.spike;
      ctx.beginPath();

      if (flipped) {
        ctx.moveTo(sx + TILE / 2, spikeY + 34);
        ctx.lineTo(sx + 5, spikeY);
        ctx.lineTo(sx + TILE - 5, spikeY);
      } else {
        ctx.moveTo(sx + TILE / 2, spikeY);
        ctx.lineTo(sx + 5, spikeY + 34);
        ctx.lineTo(sx + TILE - 5, spikeY + 34);
      }

      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = activeTheme.blockLine;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    if (t.symbol === "#" || t.symbol === "B") {
      const baseY = t.symbol === "B" ? objectY("B") : objectY("#");
      const blockY = flipProgressY(baseY, TILE);
      ctx.fillStyle = activeTheme.block;
      ctx.fillRect(sx, blockY, TILE, TILE);
      ctx.strokeStyle = activeTheme.blockLine;
      ctx.lineWidth = 4;
      ctx.strokeRect(sx, blockY, TILE, TILE);

      ctx.fillStyle = "rgba(255,255,255,0.20)";
      ctx.fillRect(sx + 6, blockY + 6, TILE - 12, 6);
      ctx.fillStyle = "rgba(0,0,0,0.20)";
      ctx.fillRect(sx + 7, blockY + TILE - 12, TILE - 14, 5);
    }

    if (t.symbol === "o") {
      const cy = flipProgressY(objectY("o"), TILE - 12) + Math.sin((frame + i * 7) * 0.08) * 5;
      ctx.fillStyle = activeTheme.accent;
      ctx.fillRect(sx + 10, cy, TILE - 20, TILE - 20);
      ctx.strokeStyle = "#05050a";
      ctx.lineWidth = 4;
      ctx.strokeRect(sx + 10, cy, TILE - 20, TILE - 20);
      ctx.fillStyle = activeTheme.player2;
      ctx.fillRect(sx + 18, cy + 8, 10, 10);
    }

    if (t.symbol === "p") {
      const padY = flipProgressY(objectY("p"), 12);
      ctx.fillStyle = activeTheme.accent;
      ctx.fillRect(sx + 4, padY, TILE - 8, 12);
      ctx.strokeStyle = "#05050a";
      ctx.lineWidth = 4;
      ctx.strokeRect(sx + 4, padY, TILE - 8, 12);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillRect(sx + 10, padY + 3, TILE - 20, 4);
    }

    if (t.symbol === "g") {
      const py = CEILING_Y;
      const ph = GROUND_Y - CEILING_Y;
      ctx.strokeStyle = activeTheme.accent;
      ctx.lineWidth = 6;
      ctx.strokeRect(sx + 6, py, TILE - 12, ph);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(sx + 14, py + 16, TILE - 28, ph - 32);
      ctx.fillStyle = activeTheme.accent;
      ctx.fillRect(sx + 18, py + 34, TILE - 36, 8);
      ctx.fillRect(sx + 18, py + ph - 42, TILE - 36, 8);
    }
  }
}

function drawCheckpointMarkers() {
  if (gameMode !== "practice") return;

  checkpointMarkers.forEach((marker, index) => {
    const sx = Math.round(marker.x - cameraX);
    if (sx < -80 || sx > W + 80) return;

    const floatY = marker.y + Math.sin((frame + index * 17) * 0.08) * 8;
    const size = 22;

    ctx.save();
    ctx.translate(sx, floatY);

    ctx.globalAlpha = 0.95;
    ctx.fillStyle = activeTheme.accent;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    ctx.strokeStyle = "#05050a";
    ctx.lineWidth = 4;
    ctx.strokeRect(-size / 2, -size / 2, size, size);

    ctx.fillStyle = activeTheme.player2;
    ctx.fillRect(-6, -6, 4, 4);
    ctx.fillRect(3, -6, 4, 4);
    ctx.fillRect(-6, 5, 14, 3);

    ctx.globalAlpha = 0.28;
    ctx.fillStyle = activeTheme.accent;
    ctx.fillRect(-18, size / 2 + 8, 36, 4);
    ctx.globalAlpha = 1;

    ctx.restore();
  });
}

function drawPlayerTrail() {
  if (!player) return;
  player.trail.forEach((t) => {
    ctx.globalAlpha = t.life / 22;
    ctx.fillStyle = activeTheme.accent;
    ctx.fillRect(Math.floor(t.x - cameraX + 5), Math.floor(t.y + 5), player.w - 10, player.h - 10);
  });
  ctx.globalAlpha = 1;
}

function drawPlayer() {
  if (!player || gameState === "crashed" || gameState === "menu") return;

  drawPlayerTrail();

  const hold = jumpHeld && !player.onGround ? getRobotHoldRatio() : 0;
  const squashX = 1 - hold * 0.08;
  const squashY = 1 + hold * 0.12;
  const bob = hold ? Math.sin(frame * 0.85) * hold * 2 : 0;

  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2 + bob);
  ctx.rotate(player.rotation + (player.gravityDir === -1 ? Math.PI : 0));
  ctx.scale(squashX, squashY);

  ctx.fillStyle = activeTheme.player;
  ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);

  ctx.strokeStyle = "#05050a";
  ctx.lineWidth = 5;
  ctx.strokeRect(-player.w / 2, -player.h / 2, player.w, player.h);

  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(-player.w / 2 + 5, -player.h / 2 + 5, player.w - 10, 6);

  ctx.fillStyle = activeTheme.player2;
  ctx.fillRect(-9, -9, 7, 7);
  ctx.fillRect(4, -9, 7, 7);
  ctx.fillRect(-9, 7, 21, 5);

  ctx.restore();

  if (jumpHeld && !player.onGround) {
    ctx.globalAlpha = 0.28 + hold * 0.32;
    ctx.fillStyle = activeTheme.accent;
    ctx.fillRect(player.x - 6, player.y + player.h + 8, Math.floor(46 * hold), 5);
    ctx.globalAlpha = 1;
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life / 45);
    ctx.fillStyle = activeTheme.player;
    ctx.fillRect(Math.floor(p.x - cameraX), Math.floor(p.y), p.size, p.size);
  });

  sparks.forEach(s => {
    ctx.globalAlpha = Math.max(0, s.life / 28);
    ctx.fillStyle = activeTheme.accent;
    ctx.fillRect(Math.floor(s.x - cameraX), Math.floor(s.y), s.size || 5, s.size || 5);
  });
  ctx.globalAlpha = 1;
}

function drawHitboxes() {
  if (!showHitboxes) return;

  ctx.save();
  ctx.globalAlpha = 0.58;
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ff3030";
  ctx.fillStyle = "rgba(255, 48, 48, 0.18)";

  if (player) {
    const playerBox = { x: player.x + 6, y: player.y + 6, w: player.w - 12, h: player.h - 12 };
    ctx.fillRect(playerBox.x, playerBox.y, playerBox.w, playerBox.h);
    ctx.strokeRect(playerBox.x, playerBox.y, playerBox.w, playerBox.h);
  }

  const start = Math.max(0, Math.floor(cameraX / TILE) - 2);
  const end = Math.min(levelTiles.length, start + 34);

  for (let i = start; i < end; i++) {
    const t = levelTiles[i];
    const sx = Math.round(t.x - cameraX);

    if (t.symbol === "^") {
      const worldBox = objectBoxForTile(t);
      const box = { x: worldBox.x - cameraX, y: worldBox.y, w: worldBox.w, h: worldBox.h };
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    }

    if (t.symbol === "#" || t.symbol === "B") {
      const worldBox = objectBoxForTile(t);
      const box = { x: worldBox.x - cameraX, y: worldBox.y, w: worldBox.w, h: worldBox.h };
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    }
  }

  ctx.restore();
}

function drawOverlay() {
  if (gameState === "won") {
    ctx.fillStyle = "rgba(0,0,0,0.50)";
    ctx.fillRect(0, 0, W, H);
    drawPixelText("STAGE CLEAR!", W / 2 - 160, H / 2 - 18, 34, activeTheme.accent);
    drawPixelText("JUMP TO REPLAY", W / 2 - 126, H / 2 + 28, 20, "#fff7c7");
  }
}

function draw() {
  ctx.save();

  if (shake > 0.5) {
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }

  ctx.clearRect(0, 0, W, H);

  drawBackground();
  drawCeilingLane();
  drawGround();
  drawLevel();
  drawCheckpointMarkers();
  drawPlayer();
  drawParticles();
  drawHitboxes();
  drawOverlay();

  ctx.restore();
}

function loop(ts) {
  const dt = ts - lastTime;
  lastTime = ts;
  if (dt < 80) update();
  draw();
  requestAnimationFrame(loop);
}

// ----- Audio -----

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function beep(freq = 440, duration = 0.08, type = "square", volume = 0.04) {
  if (!audioCtx || !musicOn && volume < 0.05) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();

  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
}


function noise(duration = 0.05, volume = 0.025) {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
}

function currentSfxStyle() {
  return (stage.song && stage.song.sfx) || "bright";
}

function startRobotTone() {
  if (!audioCtx || robotToneTimer) return;

  robotToneTimer = setInterval(() => {
    if (!jumpHeld || gameState !== "playing" || player.onGround) {
      stopRobotTone();
      return;
    }

    const t = getRobotHoldRatio();
    beep(260 + t * 420, 0.025, "square", 0.010 + t * 0.012);
  }, 70);
}

function stopRobotTone() {
  if (robotToneTimer) {
    clearInterval(robotToneTimer);
    robotToneTimer = null;
  }
}

function playJumpSfx(power = 0.25) {
  const style = currentSfxStyle();
  const lift = 1 + power * 0.55;

  if (style === "quest") {
    beep(494 * lift, 0.035, "triangle", 0.05);
    setTimeout(() => beep(659 * lift, 0.04, "square", 0.035), 35);
  } else if (style === "castle") {
    beep(330 * lift, 0.04, "triangle", 0.045);
    setTimeout(() => beep(247 * lift, 0.05, "square", 0.035), 35);
  } else if (style === "blast") {
    beep(220 * lift, 0.025, "square", 0.045);
    noise(0.035 + power * 0.02, 0.018 + power * 0.018);
    setTimeout(() => beep(440 * lift, 0.035, "square", 0.035), 35);
  } else if (style === "pop") {
    beep(659 * lift, 0.025, "square", 0.04);
    setTimeout(() => beep(880 * lift, 0.035, "triangle", 0.035), 35);
  } else {
    beep(560 * lift, 0.03, "square", 0.055);
    setTimeout(() => beep(840 * lift, 0.035, "square", 0.035), 30);
  }
}

function playLandSfx() {
  const style = currentSfxStyle();
  if (style === "castle") beep(130, 0.04, "triangle", 0.025);
  else if (style === "pop") beep(520, 0.02, "square", 0.018);
  else beep(190, 0.03, "square", 0.02);
}

function playCrashSfx() {
  const style = currentSfxStyle();
  if (style === "blast") {
    noise(0.12, 0.07);
    beep(90, 0.16, "sawtooth", 0.08);
  } else if (style === "castle") {
    beep(196, 0.08, "sawtooth", 0.05);
    setTimeout(() => beep(98, 0.14, "sawtooth", 0.07), 70);
  } else if (style === "pop") {
    beep(740, 0.04, "square", 0.04);
    setTimeout(() => beep(370, 0.08, "triangle", 0.04), 45);
  } else {
    beep(90, 0.18, "sawtooth", 0.09);
  }
}

function startMusic() {
  ensureAudio();
  if (musicTimer) clearInterval(musicTimer);

  let step = 0;
  const song = stage.song || { tempo: 132, lead: activeTheme.music, bass: activeTheme.music.map(n => n / 2) };
  const interval = Math.max(90, Math.floor(song.tempo));

  musicTimer = setInterval(() => {
    if (!musicOn || !audioCtx || gameState === "paused" || gameState === "menu" || gameState === "crashed") return;

    const lead = song.lead;
    const bass = song.bass;
    const freq = lead[step % lead.length];
    const bassFreq = bass[Math.floor(step / 2) % bass.length];

    // Lead melody: longer 48-note phrases per level, so it feels more like a tiny song.
    beep(freq, 0.075, step % 8 === 7 ? "triangle" : "square", 0.026);

    // Bass pulse.
    if (step % 2 === 0) beep(bassFreq, 0.12, "triangle", 0.018);

    // Simple 8-bit percussion/noise accents.
    if (step % 4 === 2) noise(0.018, 0.010);
    if (step % 8 === 0) beep(70, 0.028, "square", 0.014);

    // Tiny harmony blips.
    if (step % 16 === 14) beep(freq * 1.5, 0.035, "square", 0.010);

    step++;
  }, interval);
}

function toggleMusic() {
  ensureAudio();
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? "MUSIC ON" : "MUSIC OFF";
  if (musicOn) startMusic();
}

// ----- Events -----

// PRESS
// PRESS
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    ensureAudio();
    jumpPress();
  }

  if (e.key.toLowerCase() === "r") {
    if (gameState !== "menu") resetGame(true);
  }

  if (e.key.toLowerCase() === "x") {
    placePracticeCheckpoint();
  }

  if (e.key.toLowerCase() === "z") {
    deletePracticeCheckpoint();
  }

  if (e.key === "Escape") {
    if (gameState !== "menu") openMainMenu();
  }
});

// RELEASE
window.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    jumpRelease();
  }
});

canvas.addEventListener("pointerdown", () => {
  ensureAudio();
  jumpPress();
});

canvas.addEventListener("pointerup", () => {
  jumpRelease();
});

canvas.addEventListener("pointercancel", () => {
  jumpRelease();
});

startBtn.addEventListener("click", startGame);
resumeBtn.addEventListener("click", togglePause);
restartBtn.addEventListener("click", () => resetGame(true));
mainMenuBtn.addEventListener("click", openMainMenu);
tryAgainBtn.addEventListener("click", () => resetGame(true));
deathMenuBtn.addEventListener("click", openMainMenu);
placeCheckpointBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  placePracticeCheckpoint();
});
deleteCheckpointBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  deletePracticeCheckpoint();
});

editorBtn.addEventListener("click", openLevelEditor);
editorStageSelect.addEventListener("change", loadEditorStageText);
saveLevelBtn.addEventListener("click", saveEditorLevel);
testLevelBtn.addEventListener("click", testEditorLevel);
copyLevelsBtn.addEventListener("click", exportAllLevels);
closeEditorBtn.addEventListener("click", closeLevelEditor);

editorToolSelect.addEventListener("change", () => setEditorTool(editorToolSelect.value));

editorPalette.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tool]");
  if (!btn) return;
  setEditorTool(btn.dataset.tool);
});

levelText.addEventListener("input", drawEditorGrid);

editorCanvas.addEventListener("pointerdown", (e) => {
  const rect = editorCanvas.getBoundingClientRect();
  const scaleX = editorCanvas.width / rect.width;
  const scaleY = editorCanvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const cell = 18;
  const top = 24;
  const col = Math.floor(x / cell);
  const row = Math.floor((y - top) / cell);

  if (row >= 0 && row <= 2 && col >= 0) {
    applyEditorCell(col, row);
  }
});
stageNameEl.addEventListener("click", openMainMenu);
musicBtn.addEventListener("click", toggleMusic);

stageSelect.addEventListener("change", () => {
  loadStage(stageSelect.value);
});

modeSelect.addEventListener("change", () => {
  gameMode = modeSelect.value;
  stageNameEl.textContent = `${stage.name} · ${gameMode.toUpperCase()}`;
  updatePracticeControls();
});

// Start on menu, but draw a nice scene behind it
loadStage(stageSelect.value);
resetGame(false);
gameState = "menu";
menu.classList.remove("hidden");
updatePracticeControls();
requestAnimationFrame(loop);
