# Threads

## Justificación

- **Muchas actividades simultáneas, algunas bloqueantes.**
    - Desglosar la solución en hilos secuenciales.
        - Aumenta el uso del CPU.
        - Simplifica la programación.
        - Aprovecha arquitecturas con múltiples CPUs.
- **La misma noción de modelo de procesos.**
    - Abstraer detalles y pensar en procesos secuenciales.
    - Con el agregado de que comparten un espacio de direcciones.
- **Son más “baratos”.**
    - Creación y destrucción.
    - Hasta 10-100 veces más rápido que un proceso.

## Procesos vs Thread

- Un thread está contenido en un proceso.
    - El proceso agrupa recursos.
    - El thread esta orientada a ejecución.
- Campos de typical process-table entry.
    - Algunos son recursos, otros orientados a ejecución (cambian en ejecución).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5dcbe7c4-621e-4310-96be-a183fa63b79c/Untitled.png)

- Tener múltiples threads en un proceso es análogo a tener múltiples proceso en una PC.
    - En un caso se comparte el espacio de direcciones, files, señales, etc.
    - En el otro se comparte la memoria, dispositivos de entrada y salida, etc

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d98dd3bb-6ea2-422d-a736-27a63043752d/Untitled.png)

## POSIX Instructions

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1fc9a440-cc70-440e-b3d1-d9184001de23/Untitled.png)

## Implementación en espacio de usuario

- Indistinguible para el kernel un thread a una función de librería por ejemplo.
- Provee soporte para threads en caso de que el kernel no los provea.
- Se implementan como una libreria.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cea59630-f861-4e4f-9a2d-46bd5006ff6c/Untitled.png)

- Cada proceso necesita su tabla de threads privada.
- Si un thread se bloquea localmente (esperando por otro thread del mismo proceso) se realiza el switch en espacio de usuario.
    - Es un orden (o más) de magnitud más rápido que el switch usual con interrupciones y la intervención del kernel.
    - No es necesario actualizar (flushear) la caché. Queda todo en la memoria del mismo proceso.
- Cada proceso puede tener su propio algoritmo de scheduling de threads.

### Implementación en espacio de usuario: Desventajas

- **Syscall bloqueante:**
    
    - ¿Que se bloquee todo el proceso y listo? (Es lo que queremos evitar xd).
        - Cambiar las syscalls a no boqueantes → modificar el kernel, NO ES PRÁCTICO.
        - Select(2) → polling (pregunta si es bloqueante).
- **Page faults:**
    
    - Un thread causa un page fault -> el kernel bloquea el proceso entero hasta que llega la página.
- **Inanición:**
    
    - Un thread puede correr indefinidamente hasta que voluntariamente libere el CPU. El proceso lo interrupte el timer pero cuando vuelve se vuelve a ejecutar el mismo thread.
        - Se puede solicitar una señal regularmente para cambiar de thread → ineficiente
    
    ## Implementación en espacio de kernel
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5e6fcf0f-e9bb-4bcb-953d-e525631cb56c/Untitled.png)
    
- No es necesario el run-time system ni tabla de threads (en espacio de usuario)
    
- Un thread se bloquea como es usual y el kernel elige otro thread (u otro proceso)
    
- Debido al mayor costo, se pueden reutilizar los threads
    
    ## Implementación híbrida
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e8446693-ce86-40b8-9418-433cb740d77b/Untitled.png)
    
    Si hay threads que se va a bloquear, metelo en kernel.
    
    Si un thread no se bloquea, se lo monta arriba de un thread de kernel.
    
    ## Scheduler activations
    
    Trata el problema de si un user thread se bloquea.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1f640566-3977-420c-90a6-188fc511f416/Untitled.png)
    
    Al bloquearse, se crea un nuevo thread y se notifica al run-time system (thread manager) - upcall (llamada hacia arriba) capturada por un handler dentro de la librería - signal.
    
    Viola la estructura de un sistema de capas.
    
    (El thread manager es la librería de threads que está del lado de usuario)