"use client";
import { useState, useEffect } from "react";

const FONTS = [
  { family: "'Instrument Serif', serif", style: "italic", weight: "400" },
  { family: "var(--font-oi), serif", style: "normal", weight: "400" },
  { family: "var(--font-rubik-spray), sans-serif", style: "normal", weight: "400" },
  { family: "var(--font-barriecito), cursive", style: "normal", weight: "400" },
  { family: "var(--font-rubik-iso), sans-serif", style: "normal", weight: "400" },
  { family: "var(--font-vast-shadow), serif", style: "normal", weight: "400" },
  { family: "var(--font-uncial), serif", style: "normal", weight: "400" },
  { family: "var(--font-honk), sans-serif", style: "normal", weight: "400" },
  { family: "var(--font-danfo), serif", style: "normal", weight: "400" },
  { family: "var(--font-hachi), cursive", style: "normal", weight: "400" },
  { family: "var(--font-silkscreen), monospace", style: "normal", weight: "400" },
];

export default function AIWordCycler() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % FONTS.length);
        setVisible(true);
      }, 200);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const font = FONTS[index];

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        width: "1.8em",
        height: "1em",
        verticalAlign: "middle",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: font.family,
          fontStyle: font.style,
          fontWeight: font.weight,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          whiteSpace: "nowrap",
          fontSize: "1em",
          lineHeight: 1,
        }}
      >
        AI
      </span>
    </span>
  );
}