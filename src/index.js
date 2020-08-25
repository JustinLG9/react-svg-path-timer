import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import "./index.css";

export default function SvgPathTimer({
  time = 30,
  active = true,
  finishCallback = () => {},
  resetOnChange,
  d = "M 0 0 a 50 50 0 1 0 0.001 0 z",
  height = "100%",
  width = "100%",
  direction = "forwards",
  strokeColor = "white",
  pathColor = "grey",
  strokeWidth = 1,
  strokeLinecap = "butt",
  fill = "none",
  digitalTimer = true,
  digitalTimerStyles,
  style,
  ...props
}) {
  const [timeLeft, setTimeLeft] = useState(time);
  const [pathLength, setPathLength] = useState(0);
  const svgId = useRef(getRandomString()).current;
  const pathId = useRef(getRandomString()).current;
  const strokeId = useRef(getRandomString()).current;
  const timerId = useRef(getRandomString()).current;
  let firstUpdate = useRef(true);
  let timerInterval = useRef(null);
  let test = timeLeft;

  // Center viewbox around provided d path upon mount
  useLayoutEffect(() => {
    const path = document.getElementById(pathId);
    const svg = document.getElementById(svgId);
    setPathLength(path.getTotalLength());

    const bbox = path.getBBox();
    svg.setAttribute(
      "viewBox",
      bbox.x -
        10 +
        " " +
        (bbox.y - 10) +
        " " +
        (bbox.width + 20) +
        " " +
        (bbox.height + 20)
    );
  }, [pathId, svgId]);

  function getRandomString() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  function startTimer() {
    timerInterval.current = setInterval(() => {
      if (test > 0) {
        test = (test - 0.05).toFixed(2);
        setTimeLeft(test);
      } else {
        clearInterval(timerInterval.current);
        finishCallback();
      }
    }, 50);
  }

  // Handle starting/stopping timer
  useEffect(() => {
    if (active) {
      startTimer();
    }

    return () => clearInterval(timerInterval.current);
  }, [active]);

  useEffect(() => {
    if (!firstUpdate.current) {
      clearInterval(timerInterval.current);
      setTimeLeft(time);
    }
  }, [resetOnChange]);

  useEffect(() => {
    if (timeLeft === time && active && !firstUpdate.current) {
      startTimer();
    } else {
      firstUpdate.current = false;
    }
  }, [timeLeft]);

  return (
    <div
      className="svgPathTimerContainer"
      style={({ ...style }, { height: height, width: width })}
      {...props}
    >
      <svg
        className="svgPathContainer"
        id={svgId}
        viewBox={`${-strokeWidth / 2} ${-strokeWidth / 2} 
          ${100 + strokeWidth} ${100 + strokeWidth}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <g fill={fill} strokeWidth={strokeWidth} strokeLinecap={strokeLinecap}>
          <path className="path" id={pathId} stroke={pathColor} d={d} />
          <path
            className="stroke"
            id={strokeId}
            stroke={strokeColor}
            d={d}
            strokeDashoffset={
              direction === "backwards"
                ? `${pathLength * (timeLeft / time)}`
                : `${pathLength - pathLength * (timeLeft / time)}`
            }
            strokeDasharray={pathLength}
          />
        </g>
      </svg>
      {digitalTimer && (
        <span style={digitalTimerStyles} className="timer" id={timerId}>
          {formatTimeLeft(timeLeft)}
        </span>
      )}
    </div>
  );
}

function formatTimeLeft(time) {
  time = Math.ceil(time);
  const timeMinusHours = time % 3600;

  const hours = Math.floor(time / 3600);
  let minutes = Math.floor(timeMinusHours / 60);
  let seconds = Math.ceil(timeMinusHours % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (hours && minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}
