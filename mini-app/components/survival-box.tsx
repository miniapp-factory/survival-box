"use client";

import { useState, useEffect } from "react";

const BOX_COUNTS: Record<number, number> = { 1: 5, 2: 10, 3: 15 };
const BOMB_COUNTS: Record<number, number> = { 1: 1, 2: 1, 3: 2 };

export default function SurvivalBox() {
  const [level, setLevel] = useState(1);
  const totalBoxes = BOX_COUNTS[level];
  const [trapIndex, setTrapIndex] = useState<number[]>(() => {
    const bombs = BOMB_COUNTS[level];
    const indices: number[] = [];
    while (indices.length < bombs) {
      const idx = Math.floor(Math.random() * totalBoxes) + 1;
      if (!indices.includes(idx)) indices.push(idx);
    }
    return indices;
  });
  const [available, setAvailable] = useState<number[]>(Array.from({ length: totalBoxes }, (_, i) => i + 1));
  const [status, setStatus] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);

  // Reset the entire game state to its initial values
  const resetGame = () => {
    setLevel(1);
    const bombs = BOMB_COUNTS[1];
    const indices: number[] = [];
    while (indices.length < bombs) {
      const idx = Math.floor(Math.random() * BOX_COUNTS[1]) + 1;
      if (!indices.includes(idx)) indices.push(idx);
    }
    setTrapIndex(indices);
    setAvailable(Array.from({ length: BOX_COUNTS[1] }, (_, i) => i + 1));
    setStatus("");
    setSelected([]);
  };

  useEffect(() => {
    // Reset game state when level changes
    const bombs = BOMB_COUNTS[level];
    const indices: number[] = [];
    while (indices.length < bombs) {
      const idx = Math.floor(Math.random() * totalBoxes) + 1;
      if (!indices.includes(idx)) indices.push(idx);
    }
    setTrapIndex(indices);
    setAvailable(Array.from({ length: totalBoxes }, (_, i) => i + 1));
    setStatus("");
    setSelected([]);
  }, [level, totalBoxes]);

  useEffect(() => {
    if (level === 1 && selected.length >= 3) {
      const sorted = [...selected].sort((a, b) => a - b);
      for (let i = 0; i <= sorted.length - 3; i++) {
        if (sorted[i + 2] - sorted[i] === 2) {
          setStatus("You win! All three consecutive boxes opened.");
          return;
        }
      }
    } else if (level === 2 && selected.length >= 5) {
      setStatus("You win! Opened 5 safe boxes.");
    } else if (level === 3 && selected.length >= 8) {
      setStatus("You win! Opened 8 safe boxes.");
    }
  }, [selected, level]);

  const handlePick = (box: number) => {
    if (status.includes("trap") || status.includes("win")) return;
    if (trapIndex.includes(box)) {
      setStatus(`GAME OVER — You chose the trap!`);
      setAvailable([]);
    } else {
      setStatus(`SAFE!`);
      setAvailable(prev => prev.filter(b => b !== box));
      setSelected(prev => [...prev, box]);
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
            🗝️
          </button>
        ))}
      </div>
      {status && <p className="text-xl font-semibold">{status}</p>}
      {status.includes("trap") && (
        <button
          className="mt-4 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          onClick={resetGame}
        >
          Restart
        </button>
      )}
      {level > 1 && available.length === 0 && !status.includes("trap") && (
        <p className="text-xl font-semibold">Congratulations! All safe boxes opened.</p>
      )}
      {status.includes("win") && level < 3 && (
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
