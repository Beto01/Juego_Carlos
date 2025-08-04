// Inicializa el contexto de Kaboom
kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0.53, 0.81, 0.92, 1],
});

// Define la gravedad para las físicas del juego
setGravity(1000);

// Carga los sprites que usaremos
loadSprite("player", "sprites/bean.png");
// Sprite de enemigo online (sin fondo blanco)
loadSprite("enemigo_sprite", "sprites/trex51.png");
// Sprite de corazón para las vidas
loadSprite("heart", "sprites/corazon3.png");

// ===== CONFIGURACIÓN GLOBAL =====
// Variables que se usan en todo el juego
const INITIAL_LIVES = 5;
const ENEMY_SPEED = 240;
const SPAWN_INTERVAL = 6;

// ===== FUNCIÓN DE VOZ PARA EL NIÑO =====
function speakNumber(number) {
    // Verificar si el navegador soporta síntesis de voz
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(number.toString());
        utterance.lang = 'es-ES'; // Español
        utterance.rate = 0.8; // Velocidad más lenta para niños
        utterance.pitch = 1.2; // Tono más agudo y alegre
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// ===== FUNCIÓN PARA CREAR CORAZONES =====
function createHeart(x, y) {
    // Crear un corazón usando el sprite
    const heart = add([
        sprite("heart"),
        pos(x, y),
        anchor("center"),
        scale(0.8), // Ajustar tamaño si es necesario
        opacity(1), // Agregar componente opacity explícitamente
        z(100),
    ]);

    return heart;
}

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

// ===== AQUÍ IRÁN LAS ESCENAS =====
// Todo el código del juego se organizará en escenas separadas

// ESCENA DEL MENÚ PRINCIPAL
scene("menu", () => {
    // Fondo degradado del cielo (de azul claro a azul más oscuro)
    add([
        rect(width(), height()),
        pos(0, 0),
        color(135, 206, 250), // Azul cielo más brillante
        z(-100),
    ]);

    // Agregar "nubes" decorativas con círculos blancos
    for (let i = 0; i < 6; i++) {
        const cloudX = rand(50, width() - 50);
        const cloudY = rand(50, 200);

        // Nube principal (círculo grande)
        add([
            circle(25),
            pos(cloudX, cloudY),
            color(255, 255, 255),
            opacity(0.8),
            z(-50),
        ]);

        // Círculos adicionales para hacer la nube más realista
        add([
            circle(18),
            pos(cloudX - 20, cloudY + 5),
            color(255, 255, 255),
            opacity(0.8),
            z(-50),
        ]);

        add([
            circle(20),
            pos(cloudX + 20, cloudY + 3),
            color(255, 255, 255),
            opacity(0.8),
            z(-50),
        ]);
    }

    // Sol decorativo en la esquina
    add([
        circle(40),
        pos(width() - 80, 80),
        color(255, 255, 0), // Amarillo brillante
        z(-50),
    ]);

    // Rayos del sol
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const rayLength = 25;
        add([
            rect(4, rayLength),
            pos(width() - 80 + Math.cos(angle) * 50, 80 + Math.sin(angle) * 50),
            anchor("center"),
            rotate(angle * 180 / Math.PI),
            color(255, 255, 0),
            z(-50),
        ]);
    }

    // Sombra del título (efecto de profundidad)
    add([
        text("¡SALTA Y ESQUIVA!", { size: 48 }),
        pos(width() / 2 + 3, height() / 2 - 97),
        anchor("center"),
        color(0, 0, 0), // Negro para la sombra
        opacity(0.3),
        z(10),
    ]);

    // Título grande y colorido del juego
    add([
        text("¡SALTA Y ESQUIVA!", { size: 48 }),
        pos(width() / 2, height() / 2 - 100),
        anchor("center"),
        color(255, 100, 100), // Rosa/rojo más suave
        z(11),
    ]);

    // Fondo colorido para las instrucciones
    add([
        rect(400, 50),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
        opacity(0.9),
        z(9),
    ]);

    // Instrucciones simples para el niño
    add([
        text("ESPACIO o TOCA para jugar", { size: 24 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(50, 50, 200), // Azul oscuro
        z(10),
    ]);

    // Fondo para instrucciones de control
    add([
        rect(350, 40),
        pos(width() / 2, height() / 2 + 60),
        anchor("center"),
        color(100, 255, 100), // Verde claro
        opacity(0.8),
        z(9),
    ]);

    // Instrucciones de control
    add([
        text("ESPACIO o TOCA = Saltar", { size: 20 }),
        pos(width() / 2, height() / 2 + 60),
        anchor("center"),
        color(0, 100, 0), // Verde oscuro
        z(10),
    ]);

    // Fondo para información educativa
    add([
        rect(350, 35),
        pos(width() / 2, height() / 2 + 100),
        anchor("center"),
        color(255, 255, 100), // Amarillo claro
        opacity(0.9),
        z(9),
    ]);

    // Información sobre el contador para padres/cuidadores
    add([
        text("¡Aprende a contar del 1 al 10!", { size: 18 }),
        pos(width() / 2, height() / 2 + 100),
        anchor("center"),
        color(200, 100, 0), // Naranja
        z(10),
    ]);

    // Cuando presiona ESPACIO, va al juego
    onKeyPress("space", () => {
        go("game");
    });

    // Cuando toca la pantalla, va al juego (para móviles)
    onClick(() => {
        go("game");
    });
});

// ESCENA DEL JUEGO
scene("game", () => {
    // Variables de la escena del juego
    let lives = INITIAL_LIVES;
    let successfulJumps = 0; // Contador de saltos exitosos

    // Crear fondo de pantalla con gradiente
    add([
        rect(width(), height()),
        pos(0, 0),
        color(135, 206, 250), // Azul cielo más brillante
        z(-100),
    ]);

    // Agregar nubes móviles en el fondo
    for (let i = 0; i < 4; i++) {
        const cloud = add([
            circle(20),
            pos(rand(0, width()), rand(50, 150)),
            color(255, 255, 255),
            opacity(0.6),
            z(-50),
            move(LEFT, 20), // Nubes se mueven lentamente
        ]);

        // Círculos adicionales para la nube
        add([
            circle(15),
            pos(cloud.pos.x - 15, cloud.pos.y + 3),
            color(255, 255, 255),
            opacity(0.6),
            z(-50),
            move(LEFT, 20),
        ]);

        add([
            circle(17),
            pos(cloud.pos.x + 15, cloud.pos.y + 2),
            color(255, 255, 255),
            opacity(0.6),
            z(-50),
            move(LEFT, 20),
        ]);
    }

    // Sol en la esquina superior derecha
    add([
        circle(35),
        pos(width() - 70, 70),
        color(255, 255, 0),
        z(-50),
    ]);

    // Fondo para el sistema de vidas (más pequeño para corazones)
    add([
        rect(200, 40),
        pos(15, 15),
        color(255, 200, 200), // Rosa más claro para corazones
        opacity(0.9),
        z(99),
    ]);

    // Sistema de vidas con corazones
    let heartObjects = []; // Array para guardar los corazones

    // Crear los 5 corazones iniciales
    for (let i = 0; i < INITIAL_LIVES; i++) {
        const heartX = 35 + (i * 30); // Espaciado entre corazones
        const heartY = 35;
        const heart = createHeart(heartX, heartY);
        heartObjects.push(heart);
    }

    // Fondo circular para el contador (como una medalla)
    add([
        circle(60),
        pos(width() / 2, 100),
        color(255, 200, 0), // Dorado
        z(98),
    ]);

    // Borde del círculo
    add([
        circle(55),
        pos(width() / 2, 100),
        color(255, 255, 100), // Amarillo más claro
        z(99),
    ]);

    // Contador de saltos exitosos en el centro (grande para el niño)
    const jumpCounterText = add([
        text(successfulJumps.toString(), { size: 80 }),
        pos(width() / 2, 100),
        anchor("center"),
        color(200, 50, 50), // Rojo oscuro para contraste
        z(100),
    ]);

    // Función para actualizar el display de vidas (quitar corazones)
    function updateLives() {
        // Encontrar el índice del corazón a quitar (el último que queda)
        const heartIndex = lives; // lives ya se redujo, así que es el índice correcto

        if (heartIndex >= 0 && heartIndex < heartObjects.length) {
            const heart = heartObjects[heartIndex];

            // Verificar que el corazón existe y no ha sido destruido
            if (heart && heart.exists()) {
                // Efecto visual: hacer el corazón más grande y luego desvanecerlo
                // Usamos una variable temporal para el scale
                let currentScale = 0.8;
                tween(currentScale, 1.5, 0.2, (val) => {
                    if (heart.exists()) {
                        heart.scale = val;
                    }
                }, () => {
                    // Después de crecer, desvanecerlo
                    if (heart.exists()) {
                        let currentOpacity = 1;
                        tween(currentOpacity, 0, 0.3, (val) => {
                            if (heart.exists()) {
                                heart.opacity = val;
                            }
                        }, () => {
                            if (heart.exists()) {
                                heart.destroy();
                            }
                        });
                    }
                });
            }
        }
    }

    // Función para actualizar el contador de saltos
    function updateJumpCounter() {
        jumpCounterText.text = successfulJumps.toString();
        // Efecto visual: hacer el número más grande temporalmente
        jumpCounterText.scale = 1.5;
        tween(jumpCounterText.scale, 1, 0.3, (val) => jumpCounterText.scale = val);
    }

    // Añade el personaje a la pantalla
    const player = add([
        sprite("player"),
        pos(80, 40),
        area(),
        body(),
    ]);

    // Añade una plataforma/suelo que parece césped
    add([
        rect(width(), 30),
        pos(0, height() - 30),
        area(),
        body({ isStatic: true }),
        color(50, 200, 50), // Verde césped
        z(-10),
    ]);

    // Agregar "flores" decorativas en el suelo
    for (let i = 0; i < 8; i++) {
        const flowerX = rand(50, width() - 50);

        // Tallo de la flor
        add([
            rect(2, 8),
            pos(flowerX, height() - 25),
            color(0, 150, 0), // Verde oscuro
            z(-5),
        ]);

        // Flor (círculo pequeño colorido)
        const flowerColors = [
            [255, 100, 100], // Rosa
            [100, 100, 255], // Azul
            [255, 255, 100], // Amarillo
            [255, 150, 100], // Naranja
            [200, 100, 255], // Morado
        ];
        const randomColor = flowerColors[Math.floor(rand(0, flowerColors.length))];

        add([
            circle(4),
            pos(flowerX, height() - 30),
            color(randomColor[0], randomColor[1], randomColor[2]),
            z(-5),
        ]);
    }

    // Función para hacer saltar al personaje (reutilizable)
    function makePlayerJump() {
        if (player.isGrounded()) {
            player.jump();
            playJumpSound();

            // Efectos de partículas cuando salta (como polvo)
            for (let i = 0; i < 6; i++) {
                const particle = add([
                    circle(3),
                    pos(player.pos.x + rand(-10, 10), player.pos.y + 20),
                    color(200, 150, 100), // Color tierra/polvo
                    z(50),
                ]);

                // Hacer que las partículas se muevan y desaparezcan
                particle.onUpdate(() => {
                    particle.pos.x += rand(-2, 2);
                    particle.pos.y += rand(1, 3);
                    particle.opacity -= 0.02;

                    if (particle.opacity <= 0) {
                        particle.destroy();
                    }
                });
            }
        }
    }

    // Define el salto del personaje con teclado
    onKeyPress("space", () => {
        makePlayerJump();
    });

    // Define el salto del personaje con toque (para móviles)
    onClick(() => {
        makePlayerJump();
    });

    // Función para crear enemigos
    function spawnObstacle() {
        const enemy = add([
            sprite("enemigo_sprite"),
            area(),
            pos(width(), height() - 30),
            anchor("botleft"),
            move(LEFT, ENEMY_SPEED),
            opacity(1),
            "enemigo",
        ]);

        // Detectar cuando el enemigo sale de la pantalla (salto exitoso)
        enemy.onUpdate(() => {
            if (enemy.pos.x < -50) { // Salió de la pantalla por la izquierda
                // ¡Salto exitoso! El niño esquivó al enemigo
                successfulJumps++;

                // Solo contar hasta 10 para no abrumar al niño
                if (successfulJumps <= 10) {
                    updateJumpCounter();
                    speakNumber(successfulJumps);

                    // Mensaje especial cuando llega a 10
                    if (successfulJumps === 10) {
                        // Mostrar mensaje de felicitación
                        const congratsText = add([
                            text("¡MUY BIEN!", { size: 36 }),
                            pos(width() / 2, 200),
                            anchor("center"),
                            color(0, 255, 0), // Verde
                            z(150),
                        ]);

                        // Hacer que el mensaje desaparezca después de 3 segundos
                        wait(3, () => {
                            congratsText.destroy();
                        });

                        // Decir felicitaciones con voz
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance("¡Muy bien! ¡Llegaste a diez!");
                            utterance.lang = 'es-ES';
                            utterance.rate = 0.8;
                            utterance.pitch = 1.3;
                            speechSynthesis.speak(utterance);
                        }
                    }
                }

                // Destruir el enemigo para evitar que se acumulen
                enemy.destroy();
            }
        });
    }

    // Crear un nuevo obstáculo cada cierto tiempo
    // El primer enemigo aparecerá después del intervalo inicial
    loop(SPAWN_INTERVAL, () => {
        spawnObstacle();
    });

    // Colisión con obstáculos
    player.onCollide("enemigo", (enemigo) => {
        addKaboom(player.pos);
        shake();
        playHitSound();
        enemigo.destroy();

        lives--;
        updateLives();

        // Verificar game over
        if (lives <= 0) {
            playGameOverSound();
            go("gameover");
        }
    });
});

// ESCENA DE GAME OVER
scene("gameover", () => {
    // Fondo degradado más suave
    add([
        rect(width(), height()),
        pos(0, 0),
        color(150, 150, 250), // Azul más suave
        z(-100),
    ]);

    // Agregar algunas estrellas decorativas
    for (let i = 0; i < 12; i++) {
        const star = add([
            circle(4),
            pos(rand(50, width() - 50), rand(50, height() - 100)),
            color(255, 255, 100), // Amarillo
            z(-50),
        ]);

        // Hacer que las estrellas brillen
        star.onUpdate(() => {
            star.opacity = 0.5 + Math.sin(time() * 3 + i) * 0.3;
        });
    }

    // Fondo para el mensaje de Game Over
    add([
        rect(400, 80),
        pos(width() / 2, height() / 2 - 50),
        anchor("center"),
        color(255, 100, 100), // Rosa suave
        opacity(0.9),
        z(9),
    ]);

    // Sombra del mensaje Game Over
    add([
        text("GAME OVER", { size: 48 }),
        pos(width() / 2 + 2, height() / 2 - 48),
        anchor("center"),
        color(0, 0, 0), // Negro para sombra
        opacity(0.3),
        z(10),
    ]);

    // Mensaje de Game Over grande y rojo
    add([
        text("GAME OVER", { size: 48 }),
        pos(width() / 2, height() / 2 - 50),
        anchor("center"),
        color(255, 255, 255), // Blanco para mejor contraste
        z(11),
    ]);

    // Fondo para mensaje motivador
    add([
        rect(350, 50),
        pos(width() / 2, height() / 2 + 20),
        anchor("center"),
        color(100, 255, 100), // Verde claro
        opacity(0.9),
        z(9),
    ]);

    // Mensaje motivador para el niño
    add([
        text("¡Inténtalo otra vez!", { size: 32 }),
        pos(width() / 2, height() / 2 + 20),
        anchor("center"),
        color(0, 150, 0), // Verde oscuro
        z(10),
    ]);

    // Fondo para instrucciones
    add([
        rect(450, 40),
        pos(width() / 2, height() / 2 + 80),
        anchor("center"),
        color(255, 255, 100), // Amarillo claro
        opacity(0.9),
        z(9),
    ]);

    // Instrucciones para reiniciar
    add([
        text("Presiona R o TOCA para volver al menú", { size: 22 }),
        pos(width() / 2, height() / 2 + 80),
        anchor("center"),
        color(150, 100, 0), // Marrón/naranja
        z(10),
    ]);

    // Reproducir sonido de game over al entrar
    playGameOverSound();

    // Cuando presiona R, vuelve al menú
    onKeyPress("r", () => {
        go("menu");
    });

    // Cuando toca la pantalla, vuelve al menú (para móviles)
    onClick(() => {
        go("menu");
    });
});

// Iniciar el juego en la escena del menú
go("menu");