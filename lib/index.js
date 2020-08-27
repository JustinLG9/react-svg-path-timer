"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SvgPathTimer;

var _react = _interopRequireWildcard(require("react"));

require("./svgpath.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function SvgPathTimer(_ref) {
  let {
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
    strokeWidth = 5,
    strokeLinecap = "butt",
    fill = "none",
    digitalTimer = true,
    digitalTimerStyles,
    infinite = false,
    infiniteReverse = false,
    countUp = false,
    style
  } = _ref,
      props = _objectWithoutProperties(_ref, ["time", "active", "finishCallback", "resetOnChange", "d", "height", "width", "direction", "strokeColor", "pathColor", "strokeWidth", "strokeLinecap", "fill", "digitalTimer", "digitalTimerStyles", "infinite", "infiniteReverse", "countUp", "style"]);

  const [timeLeft, setTimeLeft] = (0, _react.useState)(time);
  const [pathLength, setPathLength] = (0, _react.useState)(0);
  const [directionUpdater, setDirectionUpdater] = (0, _react.useState)(direction);
  const svgId = (0, _react.useRef)(getRandomString()).current;
  const pathId = (0, _react.useRef)(getRandomString()).current;
  const strokeId = (0, _react.useRef)(getRandomString()).current;
  const timerId = (0, _react.useRef)(getRandomString()).current;
  let firstUpdate = (0, _react.useRef)(true);
  let timerInterval = (0, _react.useRef)(null);
  let test = timeLeft; // Center viewbox around provided d path upon mount

  (0, _react.useLayoutEffect)(() => {
    const path = document.getElementById(pathId);
    const svg = document.getElementById(svgId);
    setPathLength(path.getTotalLength());
    const bbox = path.getBBox();
    svg.setAttribute("viewBox", bbox.x - 10 + " " + (bbox.y - 10) + " " + (bbox.width + 20) + " " + (bbox.height + 20));
  }, [pathId, svgId]);

  function getRandomString() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  function formatTimeLeft(displayTime) {
    displayTime = Math.ceil(displayTime); // Handle countUp

    if (countUp) {
      displayTime = time - timeLeft;
      displayTime = Math.floor(displayTime);
    }

    const timeMinusHours = displayTime % 3600;
    const hours = Math.floor(displayTime / 3600);
    let minutes = Math.floor(timeMinusHours / 60);
    let seconds = Math.ceil(timeMinusHours % 60);

    if (seconds < 10) {
      seconds = "0".concat(seconds);
    }

    if (hours && minutes < 10) {
      minutes = "0".concat(minutes);
    }

    if (hours) {
      return "".concat(hours, ":").concat(minutes, ":").concat(seconds);
    } else {
      return "".concat(minutes, ":").concat(seconds);
    }
  }

  function startTimer() {
    timerInterval.current = setInterval(() => {
      if (test > 0) {
        test = (test - 0.05).toFixed(2);
        setTimeLeft(test);
      } else {
        clearInterval(timerInterval.current);
        finishCallback();

        if (infinite) {
          setTimeLeft(time);
        } else if (infiniteReverse) {
          const toggleDirection = directionUpdater === "forwards" ? "backwards" : "forwards";
          setDirectionUpdater(toggleDirection);
          setTimeLeft(time);
        }
      }
    }, 50);
  } // Handle starting/stopping timer


  (0, _react.useEffect)(() => {
    if (active) {
      startTimer();
    }

    return () => clearInterval(timerInterval.current);
  }, [active]);
  (0, _react.useEffect)(() => {
    if (!firstUpdate.current) {
      clearInterval(timerInterval.current);
      setTimeLeft(time);
    }
  }, [resetOnChange]); // Starts timer after reset to full time (from resetOnChange)

  (0, _react.useEffect)(() => {
    if (timeLeft === time && active && !firstUpdate.current) {
      startTimer();
    } else {
      firstUpdate.current = false;
    }
  }, [timeLeft]);
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "svgPathTimerContainer",
    style: (_objectSpread({}, style), {
      height: height,
      width: width
    })
  }, props), /*#__PURE__*/_react.default.createElement("svg", {
    className: "svgPathContainer",
    id: svgId,
    viewBox: "".concat(-strokeWidth / 2, " ").concat(-strokeWidth / 2, " \n          ").concat(100 + strokeWidth, " ").concat(100 + strokeWidth),
    preserveAspectRatio: "xMidYMid meet",
    xmlns: "http://www.w3.org/2000/svg",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/_react.default.createElement("g", {
    fill: fill,
    strokeWidth: strokeWidth,
    strokeLinecap: strokeLinecap
  }, /*#__PURE__*/_react.default.createElement("path", {
    className: "path",
    id: pathId,
    stroke: pathColor,
    d: d
  }), /*#__PURE__*/_react.default.createElement("path", {
    className: "stroke",
    id: strokeId,
    stroke: strokeColor,
    d: d,
    strokeDashoffset: directionUpdater === "backwards" ? "".concat(pathLength * (timeLeft / time)) : "".concat(pathLength - pathLength * (timeLeft / time)),
    strokeDasharray: pathLength
  }))), digitalTimer && /*#__PURE__*/_react.default.createElement("span", {
    style: digitalTimerStyles,
    className: "timer",
    id: timerId
  }, formatTimeLeft(timeLeft)));
}