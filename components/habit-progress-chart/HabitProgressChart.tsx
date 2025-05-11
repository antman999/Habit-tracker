"use client";

import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Target } from "lucide-react";

interface HabitProgressChartProps {
  completedCount: number;
  goalCount: number | null;
  habitName: string;
}

const GRADIENT_ID = "habitGoalProgressGradient";

const chartConfig = {
  progressLow: {
    label: "Low Progress",
    color: "hsl(var(--chart-red))",
    icon: Target,
  },
  progressMid: {
    label: "Good Progress",
    color: "hsl(var(--chart-green))",
    icon: Target,
  },
  progressComplete: {
    label: "Goal Achieved!",
    color: `url(#${GRADIENT_ID})`,
    icon: Target,
  },
  track: {
    label: "Track",
    color: "hsl(var(--muted) / 0.3)",
  },
} satisfies ChartConfig;

export function HabitProgressChart({
  completedCount,
  goalCount,
}: HabitProgressChartProps) {
  if (goalCount === null || goalCount === undefined || goalCount <= 0) {
    return null;
  }

  const actualPercentage = Math.min(
    100,
    Math.round((completedCount / goalCount) * 100)
  );
  const barValue = Math.min(completedCount, goalCount);

  let currentProgressConfigKey: keyof typeof chartConfig = "progressMid";

  let currentTextColor = chartConfig.progressMid.color;

  if (actualPercentage >= 100) {
    currentProgressConfigKey = "progressComplete";
    currentTextColor = chartConfig.progressComplete.color;
  } else if (actualPercentage < 25) {
    currentProgressConfigKey = "progressLow";
    currentTextColor = chartConfig.progressLow.color;
  }

  const chartData = [
    {
      name: "progress",
      value: barValue,
      fill: chartConfig[currentProgressConfigKey].color,
    },
  ];

  const chartDomain: [number, number] = [0, goalCount];

  return (
    <div className="w-full max-w-[250px] mx-auto aspect-square">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <div className="relative w-full h-full">
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <linearGradient
                id={GRADIENT_ID}
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
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={chartData}
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              barSize={22}
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
                background={{ fill: chartConfig.track.color }}
                dataKey="value"
                angleAxisId={0}
                cornerRadius={11}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground"
              >
                <tspan
                  x="50%"
                  y="50%"
                  className="text-3xl font-bold"
                  fill={currentTextColor}
                >
                  {actualPercentage}%
                </tspan>
                <tspan
                  x="50%"
                  dy="1.6em"
                  className="text-xs text-muted-foreground"
                >
                  Completed
                </tspan>
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}
