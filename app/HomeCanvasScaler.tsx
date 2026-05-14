"use client";

import { useEffect } from "react";

const BASE_WIDTH = 1672;
const BASE_HEIGHT = 941;

export function HomeCanvasScaler() {
  useEffect(() => {
    const updateScale = () => {
      const horizontal = (window.innerWidth - 36) / BASE_WIDTH;
      const vertical = (window.innerHeight - 28) / BASE_HEIGHT;
      const scale = Math.min(horizontal, vertical, 1);
      document.documentElement.style.setProperty("--home-scale", scale.toFixed(4));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      document.documentElement.style.removeProperty("--home-scale");
    };
  }, []);

  return null;
}
