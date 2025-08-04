# Requirements Document

## Introduction

El objetivo es transformar el juego actual de una sola pantalla en un sistema de tres escenas bien definidas: Menu Principal, Juego y Game Over. Esto mejorará la experiencia del usuario proporcionando una navegación clara entre estados del juego y una mejor organización del código.

## Requirements

### Requirement 1

**User Story:** Como jugador, quiero ver un menú principal al iniciar el juego, para poder comenzar a jugar cuando esté listo.

#### Acceptance Criteria

1. WHEN el juego se carga THEN el sistema SHALL mostrar la escena del menú principal
2. WHEN estoy en el menú principal THEN el sistema SHALL mostrar el título del juego
3. WHEN estoy en el menú principal THEN el sistema SHALL mostrar instrucciones básicas de control
4. WHEN presiono la tecla SPACE en el menú THEN el sistema SHALL cambiar a la escena del juego
5. WHEN estoy en el menú principal THEN el sistema SHALL mostrar un fondo atractivo

### Requirement 2

**User Story:** Como jugador, quiero que el juego funcione igual que antes pero como una escena separada, para mantener la misma experiencia de juego.

#### Acceptance Criteria

1. WHEN cambio del menú al juego THEN el sistema SHALL inicializar todos los elementos del juego (jugador, enemigos, vidas)
2. WHEN estoy jugando THEN el sistema SHALL mantener toda la funcionalidad actual (salto, colisiones, vidas)
3. WHEN pierdo todas las vidas THEN el sistema SHALL cambiar automáticamente a la escena de Game Over
4. WHEN estoy en la escena del juego THEN el sistema SHALL mostrar el contador de vidas
5. WHEN colisiono con un enemigo THEN el sistema SHALL reproducir efectos visuales y sonoros

### Requirement 3

**User Story:** Como jugador, quiero ver una pantalla de Game Over cuando pierdo, para saber que el juego terminó y poder reiniciar.

#### Acceptance Criteria

1. WHEN pierdo todas las vidas THEN el sistema SHALL mostrar la escena de Game Over
2. WHEN estoy en Game Over THEN el sistema SHALL mostrar el mensaje "GAME OVER"
3. WHEN estoy en Game Over THEN el sistema SHALL mostrar instrucciones para reiniciar
4. WHEN presiono R en Game Over THEN el sistema SHALL volver al menú principal
5. WHEN cambio a Game Over THEN el sistema SHALL reproducir el sonido de game over

### Requirement 4

**User Story:** Como desarrollador, quiero que el código esté organizado en escenas separadas, para facilitar el mantenimiento y futuras mejoras.

#### Acceptance Criteria

1. WHEN el sistema se inicializa THEN el código SHALL estar organizado en funciones separadas para cada escena
2. WHEN cambio entre escenas THEN el sistema SHALL limpiar correctamente la escena anterior
3. WHEN defino una escena THEN el sistema SHALL usar la función scene() de Kaboom
4. WHEN cambio de escena THEN el sistema SHALL usar la función go() de Kaboom
5. WHEN el juego se ejecuta THEN el sistema SHALL mantener el estado global necesario entre escenas