"use client";

import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!isSpinning) {
      const rows = grid;
      const cols = [0, 1, 2].map((i) => [grid[0][i], grid[1][i], grid[2][i]]);
      const hasRowWin = rows.some((r) => r[0] === r[1] && r[1] === r[2]);
      const hasColWin = cols.some((c) => c[0] === c[1] && c[1] === c[2]);
      setWin(hasRowWin || hasColWin);
    }
  }, [grid, isSpinning]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col) => [...col]); // copy columns
        for (let i = 2; i > 0; i--) {
          newGrid[i] = newGrid[i - 1];
        }
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <img
              key={`${colIdx}-${rowIdx}`}
              src={`/${fruit.toLowerCase()}.png`}
              alt={fruit}
              width={64}
              height={64}
            />
          ))
        )}
      </div>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
        onClick={spin}
        disabled={isSpinning}
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
      {win && !isSpinning && (
        <div className="text-green-600 font-bold">
          <p>Congratulations! You won!</p>
          <Share text={`I won the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
