"use client";

import { useState, useEffect } from "react";
import {
  Smiley,
  SmileyMeh,
  SmileySad,
  Lightning,
  Wind,
  GameController,
  Cat,
  MusicNotes,
  Timer,
  GifIcon,
  Coffee,
  Pizza,
  Popcorn,
  Play,
  Pause,
  Heart,
  Repeat,
  Sparkle,
  CaretRight,
  FireSimple,
  ArrowCounterClockwise,
  X,
} from "@phosphor-icons/react";

type Mood = "great" | "good" | "okay" | "sad" | "stressed" | null;
type BreathingPhase = "breathe-in" | "hold" | "breathe-out" | "rest";

const phaseConfig = {
  "breathe-in": { duration: 4000, label: "Breathe In", color: "from-blue-500 to-cyan-500" },
  "hold": { duration: 2000, label: "Hold", color: "from-purple-500 to-pink-500" },
  "breathe-out": { duration: 4000, label: "Breathe Out", color: "from-emerald-500 to-teal-500" },
  "rest": { duration: 2000, label: "Rest", color: "from-amber-500 to-orange-500" },
};

const funnyMemes = [
  {
    text: "Me pretending I understand the professor",
    emoji: "🤡",
    category: "relatable",
  },
  {
    text: "When you finish an exam and everyone's discussing answers",
    emoji: "🏃‍♂️",
    category: "exam",
  },
  {
    text: "My bank account after buying textbooks",
    emoji: "💀",
    category: "money",
  },
  {
    text: "Me: I'll start studying early this time. Also me:",
    emoji: "🤝",
    category: "procrastination",
  },
  {
    text: "Coffee: *exists*  College students: Is for me? 👉👈",
    emoji: "☕",
    category: "coffee",
  },
  {
    text: "Due date approaching. My motivation:",
    emoji: "📉",
    category: "procrastination",
  },
];

const musicPlaylists = [
  {
    id: "lofi",
    name: "Lo-fi Beats",
    description: "Chill beats to study/relax to",
    icon: "🎧",
    mood: "chill",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u", // Chill Lofi Study Beats
    songs: ["Jazzy Vibes", "Peaceful Piano", "Study Session", "Midnight Drive"],
  },
  {
    id: "hype",
    name: "Get Hyped",
    description: "Energy boost when you need it",
    icon: "⚡",
    mood: "energetic",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP", // Beast Mode
    songs: ["Level Up", "Beast Mode", "Unstoppable", "Main Character"],
  },
  {
    id: "indie",
    name: "Indie Vibes",
    description: "Chill indie for good moods",
    icon: "🌙",
    mood: "happy",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL", // Feel Good Indie
    songs: ["Sunset Drive", "Golden Hour", "Feel Good", "Summer Nights"],
  },
  {
    id: "sad",
    name: "Sad Boi Hours",
    description: "When you're in your feelings",
    icon: "💙",
    mood: "emotional",
    spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634", // Life Sucks
    songs: ["Rainy Days", "Heartbreak Hotel", "Lonely Nights", "Tears"],
  },
];

const quickGames = [
  {
    id: "2048",
    name: "2048",
    description: "5 min brain break",
    icon: "🎮",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "typing",
    name: "Type Racer",
    description: "Test your speed",
    icon: "⌨️",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Quick memory game",
    icon: "🧠",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "color",
    name: "Color Match",
    description: "React fast!",
    icon: "🎨",
    color: "from-orange-500 to-red-500",
  },
];

const cuteAnimals = [
  { type: "Puppies", emoji: "🐶", description: "Adorable doggo pics" },
  { type: "Kittens", emoji: "🐱", description: "Smol cats being cute" },
  { type: "Bunnies", emoji: "🐰", description: "Fluffy hoppers" },
  { type: "Otters", emoji: "🦦", description: "Wholesome water pups" },
  { type: "Hedgehogs", emoji: "🦔", description: "Spiky cuties" },
  { type: "Red Pandas", emoji: "🦊", description: "Absolute units of cute" },
];

const quickActivities = [
  { text: "Do 10 jumping jacks", emoji: "🤸", points: 5 },
  { text: "Chug some water", emoji: "💧", points: 3 },
  { text: "Text your bestie", emoji: "💬", points: 5 },
  { text: "Stretch your arms above your head", emoji: "🙆", points: 2 },
  { text: "Take a selfie (don't post, just vibe check)", emoji: "🤳", points: 3 },
  { text: "Do a TikTok dance (nobody's watching)", emoji: "💃", points: 10 },
  { text: "Scream into a pillow", emoji: "😱", points: 15 },
  { text: "Make your bed", emoji: "🛏️", points: 8 },
];

export default function MoodBoosterPage() {
  const [currentMood, setCurrentMood] = useState<Mood>(null);
  const [showBreathing, setShowBreathing] = useState(false);
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>("breathe-in");
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<"work" | "break">("work");
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameColors, setGameColors] = useState<string[]>([]);
  const [targetColor, setTargetColor] = useState<string>("");

  // 2048 game state
  const [grid2048, setGrid2048] = useState<number[][]>([]);
  const [score2048, setScore2048] = useState(0);
  const [gameOver2048, setGameOver2048] = useState(false);
  const [newTiles2048, setNewTiles2048] = useState<Set<string>>(new Set());
  const [mergedTiles2048, setMergedTiles2048] = useState<Set<string>>(new Set());

  // Type Racer state
  const [typeText, setTypeText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [typeStartTime, setTypeStartTime] = useState<number | null>(null);
  const [typeWPM, setTypeWPM] = useState(0);
  const [typeAccuracy, setTypeAccuracy] = useState(100);

  // Memory Match state
  const [memoryCards, setMemoryCards] = useState<{id: number, emoji: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryMatched, setMemoryMatched] = useState(0);

  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const totalBreathingCycles = 4;
  const breathingPhases: BreathingPhase[] = ["breathe-in", "hold", "breathe-out", "rest"];

  // Reset breathing when modal closes
  useEffect(() => {
    if (!showBreathing) {
      setIsBreathingRunning(false);
      setBreathingPhase("breathe-in");
      setBreathingCycle(0);
      setBreathingProgress(0);
    }
  }, [showBreathing]);

  // Breathing animation logic
  useEffect(() => {
    if (!isBreathingRunning || !showBreathing) return;

    const phaseData = phaseConfig[breathingPhase];
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / phaseData.duration) * 100, 100);
      setBreathingProgress(newProgress);

      if (elapsed >= phaseData.duration) {
        // Move to next phase
        const currentIndex = breathingPhases.indexOf(breathingPhase);
        const nextIndex = (currentIndex + 1) % breathingPhases.length;

        if (nextIndex === 0) {
          // Completed a full cycle
          const newCycleCount = breathingCycle + 1;
          setBreathingCycle(newCycleCount);

          if (newCycleCount >= totalBreathingCycles) {
            // Exercise complete
            setIsBreathingRunning(false);
            setBreathingProgress(0);
            return;
          }
        }

        setBreathingPhase(breathingPhases[nextIndex]);
        setBreathingProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isBreathingRunning, breathingPhase, breathingCycle, showBreathing]);

  // Pomodoro timer logic
  useEffect(() => {
    if (!pomodoroRunning) return;

    const timer = setInterval(() => {
      if (pomodoroSeconds > 0) {
        setPomodoroSeconds((prev) => prev - 1);
      } else if (pomodoroMinutes > 0) {
        setPomodoroMinutes((prev) => prev - 1);
        setPomodoroSeconds(59);
      } else {
        // Timer complete
        setPomodoroRunning(false);
        if (pomodoroMode === "work") {
          alert("Work session complete! Time for a 5-min break 🎉");
          setPomodoroMode("break");
          setPomodoroMinutes(5);
          setPomodoroSeconds(0);
        } else {
          alert("Break's over! Ready for another work session? 💪");
          setPomodoroMode("work");
          setPomodoroMinutes(25);
          setPomodoroSeconds(0);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroMinutes, pomodoroSeconds, pomodoroMode]);

  // 2048 keyboard controls
  useEffect(() => {
    if (selectedGame !== "2048" || !gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') move2048('up');
        if (e.key === 'ArrowDown') move2048('down');
        if (e.key === 'ArrowLeft') move2048('left');
        if (e.key === 'ArrowRight') move2048('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGame, gameStarted, grid2048, score2048, gameOver2048]);

  const startBreathingExercise = () => {
    setShowBreathing(true);
    setIsBreathingRunning(true);
  };

  const handleBreathingStart = () => {
    setIsBreathingRunning(true);
  };

  const handleBreathingPause = () => {
    setIsBreathingRunning(false);
  };

  const handleBreathingRestart = () => {
    setIsBreathingRunning(false);
    setBreathingPhase("breathe-in");
    setBreathingCycle(0);
    setBreathingProgress(0);
    setTimeout(() => setIsBreathingRunning(true), 100);
  };

  const togglePlaylist = (playlistId: string) => {
    const playlist = musicPlaylists.find((p) => p.id === playlistId);
    if (playlist?.spotifyUrl) {
      // Open Spotify playlist in new tab
      window.open(playlist.spotifyUrl, "_blank");
    }
  };

  const completeActivity = (index: number, points: number) => {
    if (!completedActivities.includes(index)) {
      setCompletedActivities([...completedActivities, index]);
      setTotalPoints(totalPoints + points);
    }
  };

  const handleGameClick = (gameId: string) => {
    setSelectedGame(gameId);
    setShowGameModal(true);
    setGameScore(0);
    setGameStarted(false);
  };

  const startColorGame = () => {
    const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"];
    const shuffled = colors.sort(() => Math.random() - 0.5);
    setGameColors(shuffled);
    setTargetColor(shuffled[Math.floor(Math.random() * shuffled.length)]);
    setGameScore(0);
    setGameStarted(true);
  };

  const handleColorClick = (color: string) => {
    if (color === targetColor) {
      const newScore = gameScore + 1;
      setGameScore(newScore);
      if (newScore > gameHighScore) {
        setGameHighScore(newScore);
      }
      // Next round
      const newTarget = gameColors[Math.floor(Math.random() * gameColors.length)];
      setTargetColor(newTarget);
    } else {
      // Game over
      setGameStarted(false);
      if (gameScore > 0) {
        alert(`Game Over! You scored ${gameScore} points! 🎮`);
      }
    }
  };

  // 2048 Game Functions
  const init2048Grid = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    // Add two starting tiles (without animation tracking)
    addRandom2048Tile(newGrid, false);
    addRandom2048Tile(newGrid, false);
    return newGrid;
  };

  const addRandom2048Tile = (grid: number[][], trackNew = true) => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) emptyCells.push([i, j]);
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4

      if (trackNew) {
        // Mark this tile as new for animation
        setNewTiles2048(new Set([`${row}-${col}`]));
        // Clear the new tile marker after animation
        setTimeout(() => setNewTiles2048(new Set()), 300);
      }
    }
  };

  const start2048Game = () => {
    const newGrid = init2048Grid();
    setGrid2048(newGrid);
    setScore2048(0);
    setGameOver2048(false);
    setGameStarted(true);
  };

  const move2048 = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver2048) return;

    let newGrid = grid2048.map(row => [...row]);
    let moved = false;
    let newScore = score2048;
    const mergedPositions = new Set<string>();

    const slideAndMerge = (line: number[], rowOrCol: number, isRow: boolean) => {
      // Remove zeros
      let newLine = line.filter(cell => cell !== 0);
      // Merge adjacent same values
      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
          newLine[i] *= 2;
          newScore += newLine[i];
          newLine.splice(i + 1, 1);
          // Track merged position
          if (isRow) {
            mergedPositions.add(`${rowOrCol}-${i}`);
          } else {
            mergedPositions.add(`${i}-${rowOrCol}`);
          }
        }
      }
      // Fill with zeros
      while (newLine.length < 4) {
        newLine.push(0);
      }
      return newLine;
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const oldLine = [...newGrid[i]];
        newGrid[i] = slideAndMerge(newGrid[i], i, true);
        if (JSON.stringify(oldLine) !== JSON.stringify(newGrid[i])) moved = true;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const oldLine = [...newGrid[i]];
        newGrid[i] = slideAndMerge([...newGrid[i]].reverse(), i, true).reverse();
        if (JSON.stringify(oldLine) !== JSON.stringify(newGrid[i])) moved = true;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const column = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
        const oldColumn = [...column];
        const newColumn = slideAndMerge(column, j, false);
        for (let i = 0; i < 4; i++) {
          newGrid[i][j] = newColumn[i];
        }
        if (JSON.stringify(oldColumn) !== JSON.stringify(newColumn)) moved = true;
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const column = [newGrid[0][j], newGrid[1][j], newGrid[2][j], newGrid[3][j]];
        const oldColumn = [...column];
        const newColumn = slideAndMerge([...column].reverse(), j, false).reverse();
        for (let i = 0; i < 4; i++) {
          newGrid[i][j] = newColumn[i];
        }
        if (JSON.stringify(oldColumn) !== JSON.stringify(newColumn)) moved = true;
      }
    }

    if (moved) {
      // Set merged tiles for animation
      setMergedTiles2048(mergedPositions);
      setTimeout(() => setMergedTiles2048(new Set()), 300);

      addRandom2048Tile(newGrid);
      setGrid2048(newGrid);
      setScore2048(newScore);

      // Check for game over
      if (!canMove2048(newGrid)) {
        setGameOver2048(true);
        setGameStarted(false);
      }
    }
  };

  const canMove2048 = (grid: number[][]) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return true;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return true;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return true;
      }
    }
    return false;
  };

  // Type Racer Functions
  const challengingTexts = [
    "The quick brown fox jumps over the lazy dog while simultaneously avoiding the precarious pitfalls of procrastination.",
    "Typing swiftly requires rhythmic coordination between neurological synapses and muscular memory patterns.",
    "Phenomenological perspectives perpetuate philosophical paradigms through systematic scholarly scrutiny.",
    "Programming languages facilitate algorithmic implementations through syntactical constructs and semantic interpretations.",
    "Quantum mechanics demonstrates counterintuitive phenomena that challenge classical physics understanding fundamentally.",
  ];

  const startTypeRacer = () => {
    const randomText = challengingTexts[Math.floor(Math.random() * challengingTexts.length)];
    setTypeText(randomText);
    setTypedText("");
    setTypeStartTime(Date.now());
    setTypeWPM(0);
    setTypeAccuracy(100);
    setGameStarted(true);
  };

  const handleTypeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const typed = e.target.value;
    setTypedText(typed);

    if (!typeStartTime) return;

    // Calculate WPM
    const timeElapsed = (Date.now() - typeStartTime) / 1000 / 60; // in minutes
    const wordsTyped = typed.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeElapsed);
    setTypeWPM(wpm);

    // Calculate Accuracy
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === typeText[i]) correct++;
    }
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    setTypeAccuracy(accuracy);

    // Check if complete
    if (typed === typeText) {
      setGameStarted(false);
      alert(`🎉 Complete! WPM: ${wpm}, Accuracy: ${accuracy}%`);
    }
  };

  // Memory Match Functions
  const memoryEmojis = ["🎮", "🎨", "🎵", "⚽", "🍕", "🚀", "💎", "🌟"];

  const startMemoryGame = () => {
    // Create pairs and shuffle
    const pairs = [...memoryEmojis, ...memoryEmojis];
    const shuffled = pairs.sort(() => Math.random() - 0.5).map((emoji, id) => ({
      id,
      emoji,
      flipped: false,
      matched: false,
    }));
    setMemoryCards(shuffled);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMemoryMatched(0);
    setGameStarted(true);
  };

  const handleMemoryCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (memoryCards[index].flipped || memoryCards[index].matched) return;
    if (flippedIndices.includes(index)) return;

    const newCards = [...memoryCards];
    newCards[index].flipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      const [first, second] = newFlipped;

      if (newCards[first].emoji === newCards[second].emoji) {
        // Match!
        newCards[first].matched = true;
        newCards[second].matched = true;
        setMemoryCards(newCards);
        setFlippedIndices([]);

        const matchedCount = memoryMatched + 1;
        setMemoryMatched(matchedCount);

        if (matchedCount === 8) {
          setTimeout(() => {
            setGameStarted(false);
            alert(`🎉 You won! Total moves: ${memoryMoves + 1}`);
          }, 500);
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setMemoryCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroMode("work");
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  const getMoodEmoji = (mood: Mood) => {
    switch (mood) {
      case "great":
        return "🔥";
      case "good":
        return "😊";
      case "okay":
        return "😐";
      case "sad":
        return "😢";
      case "stressed":
        return "😰";
      default:
        return "🤷";
    }
  };

  const getMoodMessage = (mood: Mood) => {
    switch (mood) {
      case "great":
        return "Let's keep that energy going! 🚀";
      case "good":
        return "Solid vibes! Keep it up 💪";
      case "okay":
        return "Meh is valid. Let's make it better 🎯";
      case "sad":
        return "It's okay to not be okay. Let's find something to smile about 💙";
      case "stressed":
        return "Deep breaths. We got this together 🫂";
      default:
        return "How you feeling today?";
    }
  };

  const getMoodColor = (mood: Mood) => {
    switch (mood) {
      case "great":
        return "from-emerald-500 to-teal-500";
      case "good":
        return "from-blue-500 to-cyan-500";
      case "okay":
        return "from-amber-500 to-yellow-500";
      case "sad":
        return "from-purple-500 to-pink-500";
      case "stressed":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 mb-4">
          <Sparkle className="w-8 h-8 text-white" weight="fill" />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Mood Booster
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Take a break and recharge with activities designed to lift your spirits
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Breathing Exercise */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 w-fit mb-4">
            <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="duotone" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Breathing Exercise
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            1-minute guided breathing to calm your mind and reduce stress
          </p>
          <button
            onClick={startBreathingExercise}
            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Start Exercise
          </button>
        </div>

        {/* Quick Games - Spans 2 columns on large screens */}
        <div className="col-span-full md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit mb-4">
            <GameController className="w-6 h-6 text-purple-600 dark:text-purple-400" weight="duotone" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Quick Games
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Take a mental break with fun, challenging games
          </p>
          <div className="space-y-2">
            {quickGames.map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left flex items-center gap-3"
              >
                <span className="text-xl">{game.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {game.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {game.description}
                  </div>
                </div>
                <CaretRight className="w-4 h-4 text-gray-400" weight="bold" />
              </button>
            ))}
          </div>
        </div>

        {/* Pomodoro Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className={`p-3 rounded-xl w-fit mb-4 ${pomodoroMode === "work" ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
            <Timer className={`w-6 h-6 ${pomodoroMode === "work" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} weight="duotone" />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {pomodoroMode === "work" ? "Focus Timer" : "Break Timer"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {pomodoroMode === "work" ? "Stay focused for 25 minutes" : "Relax for 5 minutes"}
            </p>
          </div>
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold mb-2 ${pomodoroMode === "work" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {formatTime(pomodoroMinutes, pomodoroSeconds)}
            </div>
            {pomodoroRunning && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Timer running...
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPomodoroRunning(!pomodoroRunning)}
              className={`flex-1 px-4 py-3 rounded-xl bg-gradient-to-r ${pomodoroMode === "work" ? "from-emerald-500 to-teal-500" : "from-amber-500 to-orange-500"} hover:shadow-lg text-white font-medium transition-all`}
            >
              {pomodoroRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetPomodoro}
              className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick Activities Challenge - Full width */}
        <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 w-fit">
                <FireSimple className="w-6 h-6 text-orange-600 dark:text-orange-400" weight="duotone" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Quick Wins
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold">
              {totalPoints} pts
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Do the thing, get the points 🎯
          </p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {quickActivities.slice(0, 5).map((activity, idx) => (
              <button
                key={idx}
                onClick={() => completeActivity(idx, activity.points)}
                disabled={completedActivities.includes(idx)}
                className={`w-full p-2 rounded-lg text-left flex items-center gap-2 transition-all ${
                  completedActivities.includes(idx)
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <span className="text-xl">{activity.emoji}</span>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {activity.text}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  +{activity.points}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Music Playlists - Full width */}
        <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit mb-4">
            <MusicNotes className="w-6 h-6 text-purple-600 dark:text-purple-400" weight="duotone" />
          </div>
          <div className="mb-5">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
              Study Playlists
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to open in Spotify
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {musicPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => togglePlaylist(playlist.id)}
                className="group p-4 rounded-lg border transition-all duration-300 text-left bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.02]"
              >
                <div className="text-2xl mb-2">{playlist.icon}</div>
                <h4 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {playlist.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {playlist.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <span>Open in Spotify</span>
                  <CaretRight className="w-3 h-3" weight="bold" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showGameModal && selectedGame && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
            onClick={() => setShowGameModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full pointer-events-auto transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowGameModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
                </button>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                  {quickGames.find(g => g.id === selectedGame)?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {gameStarted ? `Score: ${gameScore} | High Score: ${gameHighScore}` : "Quick brain break game"}
                </p>
              </div>

              <div className="p-8">
                {/* Color Match Game */}
                {selectedGame === "color" && (
                  <>
                    {!gameStarted ? (
                      <div className="flex flex-col items-center justify-center py-12">
                          <div className="text-6xl mb-6">🎨</div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Color Match
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                            Click the color name that matches the target! Be fast and accurate. Wrong click = game over!
                          </p>
                          <button
                            onClick={startColorGame}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-lg text-white font-semibold transition-all"
                          >
                            Start Game
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Target Color */}
                          <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Click:</p>
                            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                              {targetColor}
                            </div>
                          </div>

                          {/* Color Buttons */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {gameColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleColorClick(color)}
                                className={`p-6 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 ${
                                  color === "Red" ? "bg-red-500 hover:bg-red-600" :
                                  color === "Blue" ? "bg-blue-500 hover:bg-blue-600" :
                                  color === "Green" ? "bg-green-500 hover:bg-green-600" :
                                  color === "Yellow" ? "bg-yellow-500 hover:bg-yellow-600" :
                                  color === "Purple" ? "bg-purple-500 hover:bg-purple-600" :
                                  "bg-orange-500 hover:bg-orange-600"
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Score: <span className="font-bold text-lg">{gameScore}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* 2048 Game */}
                  {selectedGame === "2048" && (
                    <>
                      {!gameStarted ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="text-6xl mb-6">🎮</div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            2048 Game
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                            Combine tiles to reach 2048! Use arrow keys to move tiles. When two tiles with the same number touch, they merge!
                          </p>
                          <button
                            onClick={start2048Game}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white font-semibold transition-all"
                          >
                            Start Game
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              Score: {score2048}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Use arrow keys to move tiles
                            </p>
                          </div>

                          {/* 2048 Grid */}
                          <div className="bg-gray-300 dark:bg-gray-700 p-3 rounded-xl inline-block mx-auto">
                            <div className="grid grid-cols-4 gap-3">
                              {grid2048.map((row, i) =>
                                row.map((cell, j) => {
                                  const tileKey = `${i}-${j}`;
                                  const isNew = newTiles2048.has(tileKey);
                                  const isMerged = mergedTiles2048.has(tileKey);

                                  return (
                                    <div
                                      key={tileKey}
                                      className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl transition-all duration-200 ${
                                        cell === 0
                                          ? "bg-gray-200 dark:bg-gray-600"
                                          : cell === 2
                                          ? "bg-yellow-200 text-gray-800"
                                          : cell === 4
                                          ? "bg-yellow-300 text-gray-800"
                                          : cell === 8
                                          ? "bg-orange-300 text-white"
                                          : cell === 16
                                          ? "bg-orange-400 text-white"
                                          : cell === 32
                                          ? "bg-red-400 text-white"
                                          : cell === 64
                                          ? "bg-red-500 text-white"
                                          : cell === 128
                                          ? "bg-yellow-400 text-white"
                                          : cell === 256
                                          ? "bg-yellow-500 text-white"
                                          : cell === 512
                                          ? "bg-yellow-600 text-white"
                                          : cell === 1024
                                          ? "bg-yellow-700 text-white"
                                          : "bg-yellow-800 text-white"
                                      } ${
                                        isNew ? "animate-[scale-in_0.2s_ease-out]" : ""
                                      } ${
                                        isMerged ? "animate-[bounce-small_0.3s_ease-out]" : ""
                                      }`}
                                      style={{
                                        animationFillMode: 'backwards'
                                      }}
                                    >
                                      {cell !== 0 && cell}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {gameOver2048 && (
                            <div className="text-center">
                              <p className="text-red-600 dark:text-red-400 font-bold mb-3">
                                Game Over! Final Score: {score2048}
                              </p>
                              <button
                                onClick={start2048Game}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white font-medium transition-all"
                              >
                                Play Again
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Type Racer Game */}
                  {selectedGame === "typing" && (
                    <>
                      {!gameStarted ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="text-6xl mb-6">⌨️</div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Type Racer
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                            Type the sentence as fast and accurately as possible! Your WPM and accuracy will be tracked in real-time.
                          </p>
                          <button
                            onClick={startTypeRacer}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white font-semibold transition-all"
                          >
                            Start Race
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <div className="text-center flex-1">
                              <p className="text-gray-500 dark:text-gray-400">WPM</p>
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {typeWPM}
                              </p>
                            </div>
                            <div className="text-center flex-1">
                              <p className="text-gray-500 dark:text-gray-400">Accuracy</p>
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {typeAccuracy}%
                              </p>
                            </div>
                            <div className="text-center flex-1">
                              <p className="text-gray-500 dark:text-gray-400">Progress</p>
                              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {Math.round((typedText.length / typeText.length) * 100)}%
                              </p>
                            </div>
                          </div>

                          {/* Target Text */}
                          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                            <p className="text-gray-900 dark:text-white font-mono text-sm leading-relaxed">
                              {typeText.split("").map((char, idx) => (
                                <span
                                  key={idx}
                                  className={
                                    idx < typedText.length
                                      ? typedText[idx] === char
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
                                      : idx === typedText.length
                                      ? "bg-blue-300 dark:bg-blue-600"
                                      : ""
                                  }
                                >
                                  {char}
                                </span>
                              ))}
                            </p>
                          </div>

                          {/* Type Input */}
                          <textarea
                            value={typedText}
                            onChange={handleTypeInput}
                            className="w-full h-24 p-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-none"
                            placeholder="Start typing here..."
                            autoFocus
                          />

                          <button
                            onClick={startTypeRacer}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
                          >
                            New Text
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Memory Match Game */}
                  {selectedGame === "memory" && (
                    <>
                      {!gameStarted ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="text-6xl mb-6">🧠</div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Memory Match
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
                            Find all 8 pairs of matching emojis! Click cards to flip them and find matches. Can you do it in the fewest moves?
                          </p>
                          <button
                            onClick={startMemoryGame}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg text-white font-semibold transition-all"
                          >
                            Start Game
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between text-center">
                            <div className="flex-1">
                              <p className="text-gray-500 dark:text-gray-400 text-sm">Moves</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {memoryMoves}
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-500 dark:text-gray-400 text-sm">Matched</p>
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {memoryMatched}/8
                              </p>
                            </div>
                          </div>

                          {/* Memory Cards Grid */}
                          <div className="grid grid-cols-4 gap-3">
                            {memoryCards.map((card, idx) => (
                              <button
                                key={card.id}
                                onClick={() => handleMemoryCardClick(idx)}
                                disabled={card.matched || card.flipped}
                                className={`aspect-square rounded-xl text-4xl font-bold transition-all transform ${
                                  card.flipped || card.matched
                                    ? "bg-white dark:bg-gray-700 scale-100"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-500 hover:scale-105"
                                } ${card.matched ? "opacity-50" : ""}`}
                              >
                                {card.flipped || card.matched ? card.emoji : "?"}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={startMemoryGame}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
                          >
                            New Game
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      {/* Breathing Exercise Modal */}
      {showBreathing && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
              onClick={() => setShowBreathing(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full pointer-events-auto transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowBreathing(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
                  </button>

                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Breathing Thing
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    1-minute guided breathing (but it actually helps tho)
                  </p>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Breathing Animation Circle */}
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative w-64 h-64">
                      {/* Animated Outer Glow */}
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseConfig[breathingPhase].color} transition-all duration-1000 ease-in-out`}
                        style={{
                          transform: breathingPhase === "breathe-in" && isBreathingRunning
                            ? "scale(1)"
                            : breathingPhase === "breathe-out" && isBreathingRunning
                            ? "scale(0.6)"
                            : "scale(0.8)",
                          opacity: 0.3,
                        }}
                      />

                      {/* Inner Circle with Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseConfig[breathingPhase].color} flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 ease-in-out`}
                          style={{
                            transform: breathingPhase === "breathe-in" && isBreathingRunning
                              ? "scale(1.1)"
                              : breathingPhase === "breathe-out" && isBreathingRunning
                              ? "scale(0.7)"
                              : "scale(0.9)",
                          }}
                        >
                          {breathingCycle >= totalBreathingCycles && !isBreathingRunning ? (
                            <>
                              <span className="text-5xl mb-2">✓</span>
                              <span className="text-xl font-semibold">Complete!</span>
                            </>
                          ) : (
                            <>
                              <span className="text-3xl font-display font-bold mb-2">
                                {phaseConfig[breathingPhase].label}
                              </span>
                              <span className="text-sm opacity-80">
                                {Math.ceil((phaseConfig[breathingPhase].duration * (100 - breathingProgress)) / 1000)}s
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Cycle {Math.min(breathingCycle + 1, totalBreathingCycles)} of {totalBreathingCycles}
                    </p>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-300"
                        style={{
                          width: `${((breathingCycle * 4 + breathingPhases.indexOf(breathingPhase)) / (totalBreathingCycles * 4)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    {!isBreathingRunning && breathingCycle < totalBreathingCycles && (
                      <button
                        onClick={handleBreathingStart}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-medium transition-all"
                      >
                        <Play className="w-5 h-5" weight="fill" />
                        {breathingCycle === 0 ? "Start" : "Resume"}
                      </button>
                    )}

                    {isBreathingRunning && (
                      <button
                        onClick={handleBreathingPause}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all"
                      >
                        <Pause className="w-5 h-5" weight="fill" />
                        Pause
                      </button>
                    )}

                    {(breathingCycle > 0 || breathingCycle >= totalBreathingCycles) && (
                      <button
                        onClick={handleBreathingRestart}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all"
                      >
                        <ArrowCounterClockwise className="w-5 h-5" weight="bold" />
                        Restart
                      </button>
                    )}
                  </div>

                  {/* Instructions */}
                  {breathingCycle === 0 && !isBreathingRunning && (
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                        <span className="font-semibold">Tip:</span> Find a comfy spot, close your eyes if you want, and just follow along
                      </p>
                    </div>
                  )}

                  {breathingCycle >= totalBreathingCycles && !isBreathingRunning && (
                    <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-300 text-center">
                        <span className="font-semibold">Nice!</span> You actually did it. Feeling better? 🌟
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
