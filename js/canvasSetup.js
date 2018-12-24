let canvas = document.querySelector('canvas');
window.addEventListener("resize", resizeCanvas);
let fpsCounter = document.getElementById('fps');

let fps = 60;

let ctx = canvas.getContext("2d");
let past = Date.now();
let elapsed = 0;
let frameRate = 1000/fps;

let frames = 0;
let firstFrame = Date.now();
let deltaFrame = 0;


function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function setFrameRate(){
  requestAnimationFrame(setFrameRate);

  elapsed = Date.now() - past;

  if(elapsed >= frameRate){
    past = Date.now() - (elapsed%(1000/fps));
    animate();
    frames++;
  }

  deltaFrame = (Date.now() - firstFrame)/1000;
  if(frames === 5){
    fpsCounter.innerText = Math.floor(5/deltaFrame);
    firstFrame = Date.now();
    frames = 0;
  }
}

resizeCanvas();
setFrameRate();
