const canvas = document.getElementById('musicCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('music');

audio.addEventListener('play', () => {
    // Crear contexto de audio y analizador
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();

    // Conectar la fuente de audio al contexto de audio
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Configurar el analizador
    analyser.fftSize = 256;  // Tamaño del análisis FFT
    const bufferLength = analyser.frequencyBinCount;  // Número de datos de frecuencia
    const dataArray = new Uint8Array(bufferLength);  // Array para almacenar los datos

    // Función para dibujar las barras
    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);  // Obtener los datos de frecuencia

        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // Cambiar el color de las barras según la frecuencia
            const red = barHeight + 25 * (i / bufferLength);
            const green = 250 * (i / bufferLength);
            const blue = 50;

            ctx.fillStyle = `rgb(${red},${green},${blue})`;
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    draw();  // Iniciar la animación
});
