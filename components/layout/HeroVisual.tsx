"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Sparkle } from "lucide-react";

const HERO_RING_GRADIENT_ID = "heroRingGradient";
const HERO_TEXT_GRADIENT_ID = "heroTextGradient";

const chartConfig = {
  progressGreen: {
    color: "hsl(var(--chart-green))",
  },
  progressComplete: {
    color: `url(#${HERO_RING_GRADIENT_ID})`,
  },
  textGreen: {
    color: "hsl(var(--chart-green))",
  },
  textComplete: {
    color: `url(#${HERO_TEXT_GRADIENT_ID})`,
  },
  track: {
    lightColor: "hsl(220 13% 91% / 0.5)",
    darkColor: "hsl(215 20% 65% / 0.3)",
  },
};

const SparkleParticle = ({
  delay,
  x,
  y,
  size,
}: {
  delay: string;
  x: string;
  y: string;
  size: number;
}) => (
  <Sparkle
    className="absolute text-yellow-400 animate-heroSparkle opacity-0"
    style={{
      animationDelay: delay,
      left: x,
      top: y,
      width: size,
      height: size,
    }}
  />
);

export function HeroVisual() {
  const [progress, setProgress] = useState(0);
  const [currentFill, setCurrentFill] = useState(
    chartConfig.progressGreen.color
  );
  const [currentTextFill, setCurrentTextFill] = useState(
    chartConfig.textGreen.color
  );
  const [trackColor, setTrackColor] = useState(chartConfig.track.lightColor);
  const [showSparkles, setShowSparkles] = useState(false);

  const animationFrameId = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const sparkleTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const completionRanRef = useRef<boolean>(false);

  const animationDuration = 1200;
  const initialDelay = 300;

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTrackColor(
      currentTheme === "dark"
        ? chartConfig.track.darkColor
        : chartConfig.track.lightColor
    );

    const animate = (timestamp: number) => {
      if (startTimestampRef.current === null) {
        startTimestampRef.current = timestamp;
      }

      const elapsedTime = timestamp - startTimestampRef.current;
      const calculatedProgress = Math.min(
        100,
        (elapsedTime / animationDuration) * 100
      );
      const roundedProgress = Math.round(calculatedProgress);

      setProgress((prevProgress) => {
        if (roundedProgress !== prevProgress) {
          if (roundedProgress >= 100) {
            setCurrentFill(chartConfig.progressComplete.color);
            setCurrentTextFill(chartConfig.textComplete.color);
          } else {
            setCurrentFill(chartConfig.progressGreen.color);
            setCurrentTextFill(chartConfig.textGreen.color);
          }
          return roundedProgress;
        }
        return prevProgress;
      });

      if (calculatedProgress >= 100 && !completionRanRef.current) {
        completionRanRef.current = true;
        setProgress(100);
        setCurrentFill(chartConfig.progressComplete.color);
        setCurrentTextFill(chartConfig.textComplete.color);
        setShowSparkles(true);
        if (sparkleTimeoutIdRef.current) {
          clearTimeout(sparkleTimeoutIdRef.current);
        }
        sparkleTimeoutIdRef.current = setTimeout(() => {
          setShowSparkles(false);
          sparkleTimeoutIdRef.current = null;
        }, 1500);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
        startTimestampRef.current = null;
        return;
      }

      if (elapsedTime < animationDuration) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else if (!completionRanRef.current) {
        completionRanRef.current = true;
        setProgress(100);
        setCurrentFill(chartConfig.progressComplete.color);
        setCurrentTextFill(chartConfig.textComplete.color);
        setShowSparkles(true);
        if (sparkleTimeoutIdRef.current)
          clearTimeout(sparkleTimeoutIdRef.current);
        sparkleTimeoutIdRef.current = setTimeout(() => {
          setShowSparkles(false);
          sparkleTimeoutIdRef.current = null;
        }, 1500);
        startTimestampRef.current = null;
      }
    };

    const startTimer = setTimeout(() => {
      setProgress(0);
      setCurrentFill(chartConfig.progressGreen.color);
      setCurrentTextFill(chartConfig.textGreen.color);
      setShowSparkles(false);
      startTimestampRef.current = null;
      completionRanRef.current = false;
      if (sparkleTimeoutIdRef.current) {
        clearTimeout(sparkleTimeoutIdRef.current);
        sparkleTimeoutIdRef.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    }, initialDelay);

    return () => {
      clearTimeout(startTimer);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      if (sparkleTimeoutIdRef.current) {
        clearTimeout(sparkleTimeoutIdRef.current);
        sparkleTimeoutIdRef.current = null;
      }
      startTimestampRef.current = null;
      completionRanRef.current = false;
    };
  }, []);

  const chartData = [{ name: "progress", value: progress, fill: currentFill }];
  const chartDomain: [number, number] = [0, 100];

  const sparklePositions = [
    { x: "45%", y: "5%", delay: "0s", size: 20 },
    { x: "85%", y: "30%", delay: "0.1s", size: 16 },
    { x: "80%", y: "75%", delay: "0.2s", size: 22 },
    { x: "20%", y: "80%", delay: "0.05s", size: 18 },
    { x: "5%", y: "40%", delay: "0.15s", size: 20 },
    { x: "60%", y: "90%", delay: "0.25s", size: 16 },
  ];

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square mx-auto">
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs>
          <linearGradient
            id={HERO_RING_GRADIENT_ID}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="hsl(var(--brand-purple))" />
            <stop offset="100%" stopColor="hsl(var(--brand-fuchsia))" />
          </linearGradient>
          <linearGradient
            id={HERO_TEXT_GRADIENT_ID}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="hsl(var(--brand-purple))" />
            <stop offset="100%" stopColor="hsl(var(--brand-fuchsia))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative w-full h-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            innerRadius="70%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            barSize={24}
            cx="50%"
            cy="50%"
          >
            <PolarAngleAxis
              type="number"
              domain={chartDomain}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: trackColor }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={12}
              isAnimationActive={false}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
            >
              <tspan
                x="50%"
                y="50%"
                className="text-4xl sm:text-5xl font-bold transition-colors duration-300 ease-in-out"
                fill={currentTextFill}
              >
                {progress}%
              </tspan>

              <tspan
                x="50%"
                dy="2em"
                fill={currentTextFill}
                className="text-lg sm:text-lg font-bold"
              >
                Achieved
              </tspan>
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {sparklePositions.map((sparkle, index) => (
            <SparkleParticle key={index} {...sparkle} />
          ))}
        </div>
      )}
    </div>
  );
}
