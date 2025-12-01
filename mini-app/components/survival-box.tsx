"use client";

import { useState, useEffect } from "react";

const BOX_COUNTS = { 1: 5, 2: 10, 3: 15 };

export default function SurvivalBox() {
  const [level, setLevel] = useState(1);
  const totalBoxes = BOX_COUNTS[level];
  const [trapIndex, setTrapIndex] = useState(() => Math.floor(Math.random() * totalBoxes) + 1);
  const [available, setAvailable] = useState<number[]>(Array.from({ length: totalBoxes }, (_, i) => i + 1));
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Reset game state when level changes
    setTrapIndex(Math.floor(Math.random() * totalBoxes) + 1);
    setAvailable(Array.from({ length: totalBoxes }, (_, i) => i + 1));
    setStatus("");
  }, [level, totalBoxes]);

  const handlePick = (box: number) => {
    if (status.includes("trap")) return;
    if (box === trapIndex) {
      setStatus(`GAME OVER — You chose the trap!`);
      setAvailable([]);
    } else {
      setStatus(`SAFE!`);
      setAvailable(prev => prev.filter(b => b !== box));
    }
  };

  const handleNextLevel = () => {
    if (level < 3) setLevel(level + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <h2 className="text-2xl font-semibold">Level {level}</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map(box => (
          <button
            key={box}
            className="w-12 h-12 rounded-md bg-primary text-primary-foreground hover:bg-primary/80"
            onClick={() => handlePick(box)}
          >
            {box}
          </button>
        ))}
      </div>
      {status && <p className="text-xl font-semibold">{status}</p>}
      {available.length === 0 && !status.includes("trap") && (
        <p className="text-xl font-semibold">Congratulations! All safe boxes opened.</p>
      )}
      {available.length === 0 && !status.includes("trap") && level < 3 && (
        <button
          className="mt-4 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
          onClick={handleNextLevel}
        >
          Next Level
        </button>
      )}
      {level === 3 && available.length === 0 && !status.includes("trap") && (
        <p className="text-xl font-semibold">You have completed all levels! Well done.</p>
      )}
    </div>
  );
}
