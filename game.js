// Inicializa el contexto de Kaboom
kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0.53, 0.81, 0.92, 1],
});

// Define la gravedad para las físicas del juego
setGravity(1600);

// Carga los sprites que usaremos
loadSprite("player", "sprites/bean.png");
// Sprite de enemigo online (sin fondo blanco)
loadSprite("enemigo_sprite", "https://kaboomjs.com/sprites/ghosty.png");

// Sonidos simples usando Web Audio API
function playJumpSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playHitSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playGameOverSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.8);

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
}

// Crear fondo de pantalla (rectángulo que cubre toda la pantalla)
add([
    rect(width(), height()),
    pos(0, 0),
    color(135, 206, 235), // Azul cielo suave
    z(-100), // z-index negativo para que esté detrás de todo
]);

// Sistema de vidas
let lives = 5;
const livesText = add([
    text("Vidas: " + lives),
    pos(20, 20),
    color(255, 255, 255),
    z(100), // z-index alto para que esté encima de todo
]);

// Función para actualizar el display de vidas
function updateLives() {
    livesText.text = "Vidas: " + lives;
}

// Añade el personaje a la pantalla
const player = add([
    sprite("player"),
    pos(80, 40),      // Posición inicial
    area(),           // Le da un área de colisión
    body(),           // Le da un cuerpo físico para que le afecte la gravedad
]);

// Añade una plataforma/suelo
add([
    rect(width(), 30),
    pos(0, height() - 30),
    outline(4),
    area(),
    body({ isStatic: true }), // Es estático, la gravedad no le afecta
    color(64, 64, 64),
]);

// Define el salto del personaje
onKeyPress("space", () => {
    // Solo puede saltar si está sobre una superficie
    if (player.isGrounded()) {
        player.jump();
        // Sonido retro de salto
        playJumpSound();
    }
});
// Función para crear enemigos (trex)
function spawnObstacle() {
    add([
        sprite("enemigo_sprite"),
        area(),
        pos(width(), height() - 30),
        anchor("botleft"),
        // Sin body() - solo detección de colisión, sin física
        move(LEFT, 240),
        opacity(1),
        "enemigo",
    ]);
}

// Crear el primer obstáculo inmediatamente
spawnObstacle();

// Crear un nuevo obstáculo cada 10 segundos
loop(7, () => {
    spawnObstacle();
});

// Colisión con obstáculos
player.onCollide("enemigo", (enemigo) => {
    addKaboom(player.pos);
    shake();

    // Sonido retro de colisión
    playHitSound();

    // Destruir el enemigo para evitar múltiples colisiones
    enemigo.destroy();

    // Reducir vida
    lives--;
    updateLives();

    // Verificar game over
    if (lives <= 0) {
        // Game Over
        add([
            text("GAME OVER", { size: 48 }),
            pos(width() / 2, height() / 2),
            anchor("center"),
            color(255, 0, 0),
            z(200),
        ]);

        add([
            text("Presiona R para reiniciar", { size: 24 }),
            pos(width() / 2, height() / 2 + 60),
            anchor("center"),
            color(255, 255, 255),
            z(200),
        ]);

        // Sonido retro de game over
        playGameOverSound();
    }
});

// Reiniciar juego cuando se presiona R
onKeyPress("r", () => {
    if (lives <= 0) {
        location.reload(); // Recarga la página completamente
    }
});