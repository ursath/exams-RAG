- El scheduler **no es un proceso**, no tiene pid, stack propio, fds, etc. **Es una parte del SO**.

### Comportamiento de un proceso

- **I/O:** bloquearse esperando un evento.
- **CPU-Bound:** es que sus ráfagas de CPU son largas. ****
- **I/O-Bound:** es que sus ráfagas de CPU son cortas.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c3b2f995-d5b6-4d0d-8a9e-7943afee1d1a/Untitled.png)

### ¿A quién pongo a correr ahora?

1. **Creación de un proceso:** ¿Al padre o al hijo?
2. **Finalización de un proceso:** ¿Cuál de todos los listos?
    1. ¿Y si no hay ninguno listo? → Iddle process (halt).
3. **Bloqueo de proceso por I/O:** ¿Cuál de todos los listos?
    1. ¿Por qué se bloqueó? → P1 de alta prioridad bloqueado hasta que P2 libera un semáforo. Sería interesante que el Scheduler le de el mando a P2.
4. **Interrupción:**
    1. Interrupción del disco le llega al kernel. Y este sabe que es algo que quería el P5. Entonces se podría ejecutar el P5.
    2. Interrupción del timer 50/60Hz (regular). En cada interrupción o cada _n_ interrupciones ejecutar un proceso _x_.

## Clasificación

1. **Non-preemptive:** elige un proceso y corre hasta que se bloquea o hasta que libera el CPU voluntariamente.
2. **Preemptive:** elige un proceso y corre hasta que se vence un plazo establecido, incluso si está en estado ready.

## Categorías según SO’s

1. **Batch (Mainframes)**
    1. No hay interacción con el usuario.
    2. Hace tareas parecidas o idénticas (ej. mining).
    3. Non-preemptive o preemptive con un quantum largo.
2. **Interactivo**
    1. Preemptive. El tipo de procesos que pueden estar corriendo es muy diverso y pueden tomar el uso del cpu de la manera que quieran
    2. Uso general, programas arbitrarios.
3. **Real time**
    1. Sorpresivamente, a veces no es necesario un scheduler preemptive.
    2. Uso específico, programas específicos.

## Objetivos

1. **All systems**
    1. Fairness: proesos similares → similar servicio.
    2. Política: procesos de seguridad corren tan pronto como están disponibles.
    3. Balance: mantener todas las partes del sistema ocupadas. Métricas por tipo de SO:
2. **Batch**
    1. Throughput: maximizar cantidad de trabajos realizados por hora.
    2. Turnaround time: minimizar el tiempo desde que llega hasta que termina la tarea. (promedio).
    3. CPU Utilization: mantener el CPU ocupado todo el tiempo.

¿**Maximizar throughput minimiza turnaround?** No. Podes darle prioridad a las tareas cortas, por lo que harías más trabajos por hora pero las tareas largas las estarías postergando.

1. **Interactive**
    1. Response time: responder las request rápido.
    2. Proportionality: cumplir con las expectativas de los usuarios. Si apreto una h espero que aparezca inmediatamente esa h.
2. **Real time**
    1. Meeting deadlines: evitar perdidas de datos.
    2. Predictability: evitar degradación de calidad en sistemas multimedia.

## Algoritmos

### Batch: First-Come First-Served

- Cola tradicional.
    
- Non-preemptive.
    
- Bloqueados van al final.
    
- Simple y fácil de programar.
    
- Caso patológico: tengo un proceso CPU-bound que corre por 1s y se bloquea en disco y varios procesos I/O-bound que realizan 1000 accesos a disco cada uno.
    
    {CPU I/O I/O I/O I/O} x 1000
    
    Los I/O Bound van a tener que esperar 1000 veces 1s.
    
    Si se reemplazara por un preemptive de 10ms, los I/O esperarían 1000 veces 10ms.
    

### Batch: Shortest Job First

- Asume que los tiempos de ejecución son conocidos.
- Non-preemptive.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5aedf50-cbec-46a0-8c05-103be839a30f/Untitled.png)

- ¿Turnaround time?
    - (a): (A + A+B + A+B+C + A+B+C+D) / 4 = (4A + 3B + 2C +D) / 4 = 14s
    - (b): (B + B+C + B+C+D + B+C+D+A) / 4 = (4B + 3C + 2D +A) / 4 = 11s

### Batch: Shortest Remaining Time Next

- Versión preemptive de shortest job first.
- Asume que los tiempos de ejecución son conocidos.
- Al llegar un nuevo trabajo se compara su tiempo restante (total) con el restante del trabajo actual.
- Beneficia a tareas cortas entrantes.

### Interactivo: Round-Robin

- Preemptive
- A cada proceso se le asigna el mismo intervalo de tiempo (quantum) para correr
    - Si al finalizar sigue ready, se le quita el CPU de todos modos (a través de una interrupción de hardware, timer)
    - Si se bloquea antes de que venza el quantum (a partir de una syscall), se pasa al siguiente
- Fácil de implementar
    - Lista de procesos ready
- Tamaño del quantum
    - Muy poco → poca eficiencia de la CPU
    - Mucho → se vuelve poco interactivo
    - 20 - 50ms recomendado

### Interactivo: Priority Scheduling

- Round-Robin asume que todos los procesos son igualmente importantes
- Se le asignan prioridades a los procesos y aquellos con la máxima prioridad son elegidos
- Preemptive
- La prioridad necesita ser ajustada periódicamente para evitar **inanición**.
- La prioridad se puede asignar estáticamente o dinámicamente
    - Dependiendo del usuario
    - Dependiendo del comportamiento del proceso
        - Para I/O-bound la prioridad puede ser 1/f, donde f es la proporción del último quantum usado

### Interactivo: Priority scheduling - Multiple queues

- Es conveniente agrupar los procesos por clases usando:
    
    - Priority scheduling entre clases
    - Round-Robin dentro de cada clase
- Con cierta frecuencia se le asigna un quantum grande a los procesos CPU-bound
    
- Cuando un proceso usa todo el quantum (CPU Bound), se le baja la prioridad
    
    - Se le baja la prioridad pero tiene un quantum más largo en una prioridad más baja.
- Los I/O Bound van a estar en la prioridad más alta, casi siempre bloqueados, por lo que veremos si alguno está ready en la prioridad abajo de esa
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a33b4eaf-5984-41d4-b169-812c896cfdc8/Untitled.png)
    

### Interactivo: Shortest Process Next

- Parecido a su contraparte de sistemas batch
    
    - Elegimos el proceso con el tiempo más corto
    - Es más difícil determinar el más corto que en bash
- Se estima con comportamiento previo (bash) -> shortest (estimated) running time
    
- La estimación es T0 y su próxima ejecución es T1
    
- Se puede actualizar la estimación con la siguiente fórmula aT0 + (1 - a)T1
    
- La elección de a puede olvidar ejecuciones previas rápidamente (a pequeño) o recordarlas (a grande)
    
    - Si a = 1/2
    
    ![Esta técnica se conoce como envejecimiento (aging)](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e14e0c65-70ab-4144-936e-93f6bf4a5a87/Untitled.png)
    
    Esta técnica se conoce como envejecimiento (aging)
    

### Interactivo: Guaranteed scheduling (Igualdad)

- Prometamos que si hay n usuarios conectados, cada uno recibirá 1/n del tiempo de CPU
- Alternativamente, si 1 usuario tiene n procesos, cada proceso recibirá 1/n del tiempo de CPU
- Registrar el tiempo de uso de cada usuario / proceso en términos de la proporción usada
- Elegir aquel proceso con la menor proporción de tiempo usado

### Interactivo: Fair-Share Scheduling (Equidad)

- ¿Si tenemos 2 usuarios, pero uno ejecuta 9 procesos y otro ejecuta solo 1 proceso? (Asumir Round-Robin)
- El usuario asociado a un proceso es relevante
- Se le asigna una fracción del tiempo a cada usuario:
    - Usuario 1, procesos A B C D
    - Usuario 2, proceso E
    - Si le asignamos 50% de CPU a cada usuario:
        - A E B E C E D E A E B E C E D E …
    - Si le asignamos el doble de CPU al usuario 1 que al usuario 2:
        - A B E C D E A B E C D E …

### Interactivo: Lottery scheduling

- Cada proceso tiene tickets de “lotería” para diferentes recursos.
    - ¡Vamos a sortear 20ms de CPU 50 veces por segundo (50Hz)!
- ¿Y si asignamos más tickets a algunos procesos? -> poseer una fracción f de los tickets implica obtener una fracción f del recurso
- Procesos que cooperan entre sí pueden compartir tickets
- Resolver problemas complejos con otro algoritmo: servidor de video que provee de stremming a sus clientes con diferentes frame rates -> 10, 20 y 50 FPS