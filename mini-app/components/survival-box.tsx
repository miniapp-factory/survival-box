"use client";

import { useState } from "react";

export default function SurvivalBox() {
  const totalBoxes = 10;
  const [trapIndex] = useState(() => Math.floor(Math.random() * totalBoxes) + 1);
  const [available, setAvailable] = useState<number[]>(Array.from({ length: totalBoxes }, (_, i) => i + 1));
  const [status, setStatus] = useState<string>("");

  const handlePick = (box: number) => {
    if (box === trapIndex) {
      setStatus(`GAME OVER — You chose the trap!`);
      setAvailable([]);
    } else {
      setStatus(`SAFE!`);
      setAvailable(prev => prev.filter(b => b !== box));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
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
    </div>
  );
}
