import { useEffect, useRef, useState } from "react";
import { useWindowWidth, useWindowHeight } from "@react-hook/window-size";

const { PI, cos, sin, abs, sqrt, pow, round, random, atan2 } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const rand = (n: number) => n * random();

// const pipeCount = 20;
// const pipePropCount = 8;
// const pipePropsLength = pipeCount * pipePropCount;
// const turnCount = 20;
// const turnAmount = (180 / turnCount) * TO_RAD;
// const turnChanceRange = 90;
// const turnChanceModulo = 6;
// const baseSpeed = 0.5;
// const rangeSpeed = 1;
// const baseTTL = 100;
// const rangeTTL = 300;
// const baseWidth = 20;
// const rangeWidth = 40;
// const baseHue = 180;
// const rangeHue = 60;
// const backgroundColor = "hsla(150,80%,1%,1)";

const pipeCount = 42;
const pipePropCount = 8;
const pipePropsLength = pipeCount * pipePropCount;
const turnCount = 8;
const turnAmount = (360 / turnCount) * TO_RAD;
const turnChanceRange = 58;
const turnChanceModulo = 6;
const baseSpeed = 0.5;
const rangeSpeed = 1;
const baseTTL = 100;
const rangeTTL = 300;
const baseWidth = 2;
const rangeWidth = 12;
const baseHue = 245;
const rangeHue = 90;
const backgroundColor = "hsla(150,80%,1%,1)";

export function PipesAnimation() {
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight() - 60;

  const canvasA = useRef<HTMLCanvasElement>(null);
  const canvasB = useRef<HTMLCanvasElement>(null);

  // const [tick, setTick] = useState(0);
  const tick = useRef(0);
  const [pipeProps, setPipeProps] = useState(new Float32Array(pipePropsLength));
  const [center, setCenter] = useState<number[]>([]);

  function initPipes() {
    setPipeProps(new Float32Array(pipePropsLength));

    for (let i = 0; i < pipePropsLength; i += pipePropCount) {
      initPipe(i);
    }
  }

  function initPipe(i: number) {
    const x = rand(windowWidth);
    const y = center[1];
    const direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
    const speed = baseSpeed + rand(rangeSpeed);
    const life = 0;
    const ttl = baseTTL + rand(rangeTTL);
    const width = baseWidth + rand(rangeWidth);

    let hue = 0;
    if (Math.random() > 0.3) {
      hue = baseHue + rand(rangeHue);
    }

    pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
    setPipeProps(pipeProps);
  }

  function updatePipes() {
    if (!canvasA.current || !canvasB.current) {
      return;
    }

    // console.log("tick", tick.current);
    // setTick(tick + 1);
    tick.current = tick.current + 1;

    const contextA = canvasA.current.getContext("2d");

    if (!contextA) {
      return;
    }

    for (let i = 0; i < pipePropsLength; i += pipePropCount) {
      updatePipe(
        contextA,
        pipeProps,
        tick.current,
        initPipe,
        windowHeight,
        windowWidth,
        i
      );
    }
  }

  function draw() {
    updatePipes();

    if (!canvasA.current || !canvasB.current) {
      return;
    }

    const contextA = canvasA.current.getContext("2d");
    const contextB = canvasB.current.getContext("2d");

    if (!contextB || !contextA) {
      return;
    }

    // contextB.clearRect(0, 0, windowWidth, windowHeight);

    render(contextB, canvasA.current);

    window.requestAnimationFrame(draw);
  }

  function resize() {
    if (!canvasA.current || !canvasB.current) {
      // bail out if canvases are not defined yet
      return;
    }

    const contextA = canvasA.current.getContext("2d");
    const contextB = canvasB.current.getContext("2d");

    if (!contextA || !contextB) {
      return;
    }

    contextA.clearRect(
      0,
      0,
      canvasA.current.clientWidth,
      canvasA.current.clientHeight
    );

    contextB.clearRect(
      0,
      0,
      canvasB.current.clientWidth,
      canvasB.current.clientHeight
    );

    canvasA.current.width = windowWidth;
    canvasA.current.height = windowHeight;

    contextA.drawImage(canvasB.current, 0, 0);

    canvasB.current.width = windowWidth;
    canvasB.current.height = windowHeight;

    contextB.drawImage(canvasA.current, 0, 0);

    center[0] = 0.5 * windowWidth;
    center[1] = 0.5 * windowHeight;
  }

  // setup
  useEffect(() => {
    // createCanvas();
    resize();
    initPipes();
    draw();
  }, []);

  // resize
  useEffect(() => {
    resize();
  }, [windowWidth, windowHeight, canvasA.current, canvasB.current]);

  return (
    <>
      <canvas
        ref={canvasA}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasB}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />
    </>
  );
}

function render(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  context.save();
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  context.save();
  context.filter = "blur(12px)";
  context.drawImage(canvas, 0, 0);
  context.restore();

  context.save();
  context.drawImage(canvas, 0, 0);
  context.restore();
}

function updatePipe(
  context: CanvasRenderingContext2D,
  pipeProps: Float32Array,
  tick: number,
  initPipe: Function,
  height: number,
  windowWidth: number,
  i: number
) {
  let i2 = 1 + i,
    i3 = 2 + i,
    i4 = 3 + i,
    i5 = 4 + i,
    i6 = 5 + i,
    i7 = 6 + i,
    i8 = 7 + i;
  let x, y, direction, speed, life, ttl, width, hue, turnChance, turnBias;

  x = pipeProps[i];
  y = pipeProps[i2];
  direction = pipeProps[i3];
  speed = pipeProps[i4];
  life = pipeProps[i5];
  ttl = pipeProps[i6];
  width = pipeProps[i7];
  hue = pipeProps[i8];

  drawPipe(context, x, y, life, ttl, width, hue);

  life++;
  x += cos(direction) * speed;
  y += sin(direction) * speed;
  turnChance =
    !(tick % round(rand(turnChanceRange))) &&
    (!(round(x) % turnChanceModulo) || !(round(y) % turnChanceModulo));
  turnBias = round(rand(1)) ? -1 : 1;
  direction += turnChance ? turnAmount * turnBias : 0;

  pipeProps[i] = x;
  pipeProps[i2] = y;
  pipeProps[i3] = direction;
  pipeProps[i5] = life;

  checkBounds(height, windowWidth, x, y);
  life > ttl && initPipe(i);
}

function drawPipe(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  life: number,
  ttl: number,
  width: number,
  hue: number
) {
  context.save();
  // hsl(291, 47%, 60%)
  if (hue === 0) {
    context.strokeStyle = `hsla(${hue},47%, 0%, 50%)`;
    context.fillStyle = "hsla(150,80%,1%, 20%)";
    context.fill();
  } else {
    context.strokeStyle = `hsla(${hue},47%,63%,${
      fadeInOut(life, ttl) * 0.125
    })`;
  }
  context.beginPath();
  context.arc(x, y, width, 0, TAU);
  context.stroke();
  context.closePath();
  context.restore();
}

// Utility functions

function fadeInOut(t: number, m: number) {
  let hm = 0.5 * m;
  return abs(((t + hm) % m) - hm) / hm;
}

function checkBounds(height: number, width: number, x: number, y: number) {
  if (x > width) x = 0;
  if (x < 0) x = width;
  if (y > height) y = 0;
  if (y < 0) y = height;
}
