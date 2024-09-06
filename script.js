const canvas = document.getElementById("musicCanvas");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("music");
const dotPlay = document.getElementById("dotPlay");

let isPlaying = false;

const playMusic = () => {
    if (!isPlaying) {
        isPlaying = true;
        console.log("now playing");
        audio.play(); // Start playing the audio
    const audioCtx = new (window.AudioContext)();
    const analyser = audioCtx.createAnalyser();
  
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    // Array para almacenar tamaños anteriores de las esferas
    // const previousSizes = new Array(bufferLength).fill(0);
  
    function randomValue(min, max) {
      return min + Math.floor(Math.random() * (max - min));
    }
  
    const magikColor = () => {
      let h = randomValue(0, 360);
      let s = randomValue(25, 100);
      let l = randomValue(15, 75);
      return `hsl(${h},${s}%,${l}%)`;
    };
  
    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = oscillationVal;
      ctx.strokeStyle = magikColor();

      let x = 0;
      const spacing = canvas.width / bufferLength;

      for (let i = 0; i < bufferLength - 1; i++) {
        const value = dataArray[i];
        const y = canvas.height - (value / 255) * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const nextX = x + spacing;
          const nextY = canvas.height - (dataArray[i + 1] / 255) * canvas.height;
          ctx.quadraticCurveTo(x, y, nextX, nextY); // Genera una curva suave
        }
        
        x += spacing;
      }

      ctx.stroke();

      // }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
  
      // let x = 0;
      // const spacing = canvas.width / 11; // Espaciamiento entre esferas
  
      // for (let i = 0; i < bufferLength; i++) {
      //   const value = dataArray[i];
  
      //   // Establecer un umbral para el valor de frecuencia
      //   const threshold = 150; // Ajusta este valor según tus necesidades
      //   if (value < threshold) {
      //     x += spacing; // Solo mover 'x' si no se dibuja la esfera
      //     continue; // Saltar al siguiente índice si el valor es menor que el umbral
      //   }

      //   const targetRadius =
      //     (value / 255) * randomValue(3, 21) + randomValue(4, 85); // Radio de la esfera
  
      //   // Interpolación para suavizar el tamaño
      //   previousSizes[i] += (targetRadius - previousSizes[i]) * 0.1; // Suaviza el cambio
  
      //   const color = magikColor();
      //   ctx.fillStyle = color;
      //   ctx.shadowBlur = 72;
      //   ctx.shadowColor = color;
  
      //   ctx.beginPath();
      //   const offsetY = Math.sin(i + Date.now() * 0.01) * oscillationVal;
  
      //   ctx.arc(x, canvas.height / 2 + offsetY, previousSizes[i], 0, Math.PI * 2);        
      //   ctx.fill();
  
      //   x += spacing; // Mover 'x' después de dibujar la esfera
      // }
    }
  
    draw();
    } else {
        isPlaying = false;
        audio.pause(); 
        console.log("now stopped")
    }
    
};

// Define canvas width and height according to window object
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const oscillator = document.getElementById("oscilator");
let oscillationVal = 11;

oscillator.addEventListener("input", () => {
    oscillationVal = oscillator.value;
  console.log(`Oscillator frequency changed to: ${oscillationVal} `);
});

// Attach the event listener after defining the playMusic function
dotPlay.addEventListener('click', playMusic);
