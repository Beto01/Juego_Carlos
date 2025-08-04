# Design Document

## Overview

El diseño implementa un sistema de tres escenas usando el framework Kaboom.js. La arquitectura se basa en el patrón de máquina de estados donde cada escena representa un estado del juego con transiciones claras entre ellos.

## Architecture

### Scene Management
- Utiliza `scene()` de Kaboom para definir cada escena
- Utiliza `go()` para transiciones entre escenas
- Cada escena es completamente independiente y se limpia automáticamente al cambiar

### State Flow
```
Menu Principal → Juego → Game Over → Menu Principal
     ↑                                    ↓
     ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### Global State
- Variables globales para configuración (vidas iniciales, velocidades)
- Funciones de audio reutilizables entre escenas
- Sprites cargados una sola vez al inicio

## Components and Interfaces

### Menu Scene ("menu")
**Purpose:** Pantalla inicial que presenta el juego al usuario

**Components:**
- Fondo decorativo con color azul cielo
- Título del juego centrado y prominente
- Instrucciones de control (SPACE para jugar)
- Detección de input para iniciar el juego

**Interface:**
- Input: Tecla SPACE
- Output: Transición a escena "game"

### Game Scene ("game")
**Purpose:** Escena principal del juego con toda la lógica de gameplay**Compo
nents:**
- Player sprite con física y controles
- Sistema de enemigos con spawn automático
- Sistema de vidas con UI
- Plataforma/suelo estático
- Sistema de colisiones
- Efectos visuales y sonoros

**Interface:**
- Input: Tecla SPACE (salto)
- Output: Transición a escena "gameover" cuando vidas = 0

### Game Over Scene ("gameover")
**Purpose:** Pantalla final que informa el resultado y permite reiniciar

**Components:**
- Mensaje "GAME OVER" prominente
- Instrucciones para reiniciar (R para volver al menú)
- Sonido de game over
- Detección de input para reiniciar

**Interface:**
- Input: Tecla R
- Output: Transición a escena "menu"

## Data Models

### Game State
```javascript
// Variables globales compartidas
let initialLives = 5;
let enemySpeed = 240;
let spawnInterval = 7;
```

### Player State (dentro de game scene)
```javascript
let lives = initialLives;
let player = null; // Referencia al objeto player
let livesText = null; // Referencia al texto de vidas
```

## Error Handling

### Audio Context
- Manejo de compatibilidad con webkitAudioContext
- Verificación de disponibilidad de Web Audio API
- Fallback silencioso si el audio falla

### Scene Transitions
- Verificación de existencia de escenas antes de go()
- Limpieza automática de objetos al cambiar escenas
- Prevención de múltiples transiciones simultáneas#
## Input Handling
- Prevención de inputs duplicados
- Verificación de estado de escena antes de procesar inputs
- Limpieza de event listeners al cambiar escenas

## Testing Strategy

### Manual Testing
1. **Scene Transitions:** Verificar que todas las transiciones funcionen correctamente
2. **Game Logic:** Confirmar que la lógica del juego se mantiene intacta
3. **Audio:** Probar todos los efectos de sonido en diferentes navegadores
4. **Input Response:** Verificar que todos los controles respondan apropiadamente

### Integration Testing
1. **State Persistence:** Verificar que las variables globales se mantengan correctamente
2. **Memory Management:** Confirmar que no hay memory leaks al cambiar escenas
3. **Performance:** Asegurar que el rendimiento se mantiene estable

### Browser Compatibility
1. **Audio Context:** Probar en Chrome, Firefox, Safari
2. **Keyboard Events:** Verificar compatibilidad de teclas
3. **Canvas Rendering:** Confirmar que Kaboom funciona correctamente

## Implementation Notes

### Code Organization
- Mantener funciones de audio como utilidades globales
- Separar lógica de cada escena en funciones dedicadas
- Usar nombres descriptivos para escenas ("menu", "game", "gameover")

### Performance Considerations
- Reutilizar sprites cargados
- Limpiar timers y loops al cambiar escenas
- Minimizar creación de objetos en el game loop

### Future Extensibility
- Estructura permite agregar fácilmente nuevas escenas
- Sistema de estado global facilita agregar configuraciones
- Separación clara permite modificar escenas independientemente