# Implementation Plan

- [x] 1. Refactor código existente para preparar la estructura de escenas


  - Extraer funciones de audio a utilidades globales reutilizables
  - Definir variables globales de configuración (vidas iniciales, velocidades)
  - Mover la carga de sprites al inicio del archivo antes de definir escenas
  - _Requirements: 4.1, 4.5_



- [ ] 2. Implementar la escena del menú principal
  - Crear la función scene("menu") con fondo azul cielo
  - Añadir título del juego centrado y prominente
  - Implementar instrucciones de control (SPACE para jugar)


  - Configurar detección de input SPACE para transición a "game"
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 3. Refactorizar lógica del juego en escena separada
  - Crear la función scene("game") moviendo toda la lógica actual del juego

  - Implementar inicialización de vidas al entrar a la escena
  - Configurar el sistema de spawn de enemigos dentro de la escena
  - Mantener toda la funcionalidad de salto, colisiones y efectos
  - _Requirements: 2.1, 2.2, 2.4, 2.5_



- [ ] 4. Implementar transición automática a Game Over
  - Modificar la lógica de colisión para usar go("gameover") en lugar de mostrar texto
  - Remover el código actual de game over que se superpone en la pantalla
  - Asegurar que el sonido de game over se reproduzca antes de la transición
  - _Requirements: 2.3_


- [ ] 5. Crear la escena de Game Over
  - Implementar scene("gameover") con mensaje "GAME OVER" centrado
  - Añadir instrucciones para reiniciar (R para volver al menú)
  - Configurar detección de input R para transición a "menu"



  - Reproducir sonido de game over al entrar a la escena
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 6. Configurar flujo inicial del juego
  - Establecer "menu" como escena inicial usando go("menu") al final del archivo
  - Remover todo el código de inicialización automática del juego
  - Verificar que las transiciones entre escenas funcionen correctamente
  - _Requirements: 1.1, 4.2, 4.3, 4.4_

- [ ] 7. Limpiar y optimizar el código
  - Remover código obsoleto (game over inline, inicialización directa)
  - Verificar que no hay memory leaks en las transiciones
  - Asegurar que los event listeners se limpien correctamente
  - Probar el flujo completo: menu → game → gameover → menu
  - _Requirements: 4.1, 4.2_