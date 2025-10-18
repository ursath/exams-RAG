# Pipes

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d5a4d61a-4787-465f-af05-ec6ae8548f11/Untitled.png)

## Dup

The dup() system call allocates a new file descriptor that refers to the same open file description as the descriptor oldfd.

The new file descriptor number is guaranteed to be the lowest-numbered file descriptor that was unused in the calling process.

After a successful return, the old and new file descriptors may be used interchangeably. Since the two file descriptors refer to the same open file description, they share file offset and file status flags

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/51fefa56-f601-4ac9-bfa7-537cb8b1939b/Untitled.png)

```
        → Pipe →
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b8101461-93f3-4996-ba86-43f5360cf3e3/Untitled.png)

Fork x2 →

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a95c3473-fa68-4e65-bf9f-477a6c0692e7/Untitled.png)

Shell: Close(3), Close(4)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/623b874b-7ff7-46e0-a737-c17f0af6b9fd/Untitled.png)

Child1: Close(3), Child2: Close(4)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ac37cc79-0e98-4c53-b70b-7d7e91b46717/Untitled.png)

Pero los procesos leen del 0 y escriben del 1. No leen del 3 y escriben del 4…

Child1: Close(1), Child2: Close(0)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9b0be3b8-c076-4f0a-a947-9b8d38d9776d/Untitled.png)

Child1: Dup(4), Child2: Dup(3)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dbe2155c-66a0-4bc1-a5f1-6b56b68e18c2/Untitled.png)

Child1: Close(4), Child2: Close(3)

# IPC

**Motivación:**

- Compartir información.
- Acelerar computación, aprovechar el hardware.
- Modularidad.
- Conveniencia.

**Dos modelos fundamentales:**

- Memoria compartida.
- Pasaje de mensajes.

## Memoria compartida

- No hace faltan syscalls para acceder a la memoria compartida porque ya tiene acceso a esta (si para pedir más).
- La organización de la información y sincronización es determinada por los procesos.
- Problemas de cache coherency al aumentar los núcleos: cache = copia de la memoria física, si actualiza esa parte de la memoria otro proceso entonces la cache del otro proceso deja de estar actualizada.

**Files:**

Dos procesos pueden compartirse información a partir de archivos en disco.

**Shared memory:**

- Permite que procesos arbitrarios compartan memoria.
- Intervención del kernel para crearla.
- Sin intervención del kernel para usarla R/W.

UNIX:

- shm_open(3), ftruncate(2), mmap(2).
- Consultar shm_overview(7).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/da26f38a-6fdf-4897-ac63-1c8980c2ee1b/Untitled.png)

## Pasaje de mensajes

- Interviene el kernel.
- Más simple en sistemas distribuidos (en máquinas distintas).
- Es necesario un canal de comunicación (memoria, bus, red).

### **Identidad**

Deben tener un mecanismo para referises, identificarse, entre sí:

- **Comunicación directa - simétrica:**
    - send(P, message), receive(Q, message) (P, Q procesos).
    - Cada proceso debe conocer la identidad del otro proceso.
    - El canal de comunicación se hace explícito entre un par de procesos.
    - El canal de comunicación asocia exactamente a 2 procesos.
    - 2 procesos pueden tener un único canal de comunicación.
- **Comunicación directa - asimétrica:**
    - send(P, message), receive(id, message).

La identidad de un proceso naturalmente cambia.

- **Comunicación indirecta:**
    - send(A, message), receive(A, message) (A casilla de correo).
    - Los mensajes se envían a puertos o casillas de correo.
    - El canal de comunicación se establece entre procesos que comparten una casilla.
    - El canal de comunicación puede asociar más de 2 procesos.
    - 2 procesos pueden tener más de 1 canal de comunicación.

### Sincronización

Send y receive pueden ser bloqueantes o no bloqueantes.

- Send bloqueante: hasta que llega a la casilla/proceso.
- Send no bloqueante: resume inmediatamente.
- Receive bloqueante: hasta que hay mensaje disponible.
- Receive no bloqueante: recibe mensaje o null.

### Buffering

Los mensajes residen en un buffer.

- Capacidad 0: no buffering, el send debe ser bloqueante, para sostener el mensaje.
- Capacidad acotada: el send debe ser bloqueante si se agota el espacio.
- Capacidad no acotada: el send no bloquea.

**Pipes:**

Permite que 2 procesos se comuniquen bajo el esquema productor-consumidor.

- Buffering: acotado.
- Sincronización: send bloquea al llenarse el pipe, receive bloquea hasta que haya algo.

UNIX:

- Permite comunicar 2 procesos emparentados.
- Identidad: file descriptors.

**Consideraciones de implementación:**

- Comunicación unidireccional o bidireccional.
- Bidireccional, half duplex: un sólo camino de comunicación, full duplex: ida y vuelta por separado.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/45d2f470-9fb1-4d84-8620-3212bac75f8b/Untitled.png)

**Named Pipes:**

UNIX:

- Permite comunicar 2 procesos arbitrarios.
- FIFOs.
- Se crean con mkfifo(3) y se abren con open(2).
- Identidad: path en el file system.

### **Files vs Pipes**

**Ventajas de los pipes**

- Se eliminan automáticamente (anónimos)
- Cantidad arbitraria de información, no va a disco, va a memoria.
- Ejecución paralela
- Sincronización implícita

## Race condition

Una situación en las que dos o más procesos están leyendo o escribiendo datos compartidos (memoria compartida) y el resultado final depende de quién corre en cada momento.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c91f7a0d-4322-4e39-a6cf-6b5c5506fee4/Untitled.png)

**Región crítica:** parte del programa que accede a la memoria compartida

**Solución: exclusión mutua**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/105e9f7a-22d6-4907-8fb9-fa66d12f5cf1/Untitled.png)

# Semáforos

- Semántica del semáforo:
    
    ACCESO EXCLUSIVO
    
    - semaphore mutex = 1: puede acceder hasta un proceso a la zona crítica
    
    CONTAR
    
    - semaphore empty = N
    - semaphore full = 0

## Deadlock

Un conjunto de procesos está bloqueado (en estado de deadlock) si cada proceso del conjunto está esperando un evento que sólo puede causar otro proceso del conjunto.