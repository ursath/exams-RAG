# Procesos
## Manejo de procesos

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c9fa10a8-36be-4e70-b7ab-c8ba1d07d673/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/208a100f-38c2-4733-8c11-766b15399516/Untitled.png)

## Modelo de procesos

Todo software ejecutable se organiza en procesos (secuenciales).

**Proceso:** abstracción de programa en ejecución.

**Programa:** almacenado en disco, no hace nada

### Tres miradas al modelo

1. Multiprogramming four programs (Situación real).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/72bed0d9-8337-421e-b399-f29413f78d08/Untitled.png)

1. **Conceptual** model of four independent, sequential processes (Concepto).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6b8ed4d8-ae78-48a1-af59-31aff0244f7e/Untitled.png)

1. Only one program is active at once (Situación real).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8d26f11f-ac37-4e20-89b5-c4eb3570253e/Untitled.png)

## Creación de procesos

Casos que lo requieren:

- Daemons, procesos en segundo plano cuando se inicia un sistema operativo.
- Un proceso solicita la creación de otro proceso
- Un usuario solicita crear un nuevo proceso, terminal o GUI.
- Inicio de un trabajo por lotes (en mainframes, o sea las computadoras grandes, servidores).

Todos estos casos un proceso ejecuta otro proceso mediante una syscall.

- **fork:** crea un clon exacto del caller. Luego de fork, los dos procesos tienen la misma memoria, las mismas variables de ambiente y los mismos archivos abiertos.
- **execve:** cambia completamente la imagen del proceso. Esto incluye memoria (heap, stack, código), registros (de propósito general y especiales). Pero preserva archivos abiertos entre otras cosas.

### ¿Cómo se crea el primer proceso?

El sistema operativo crea las estructuras que necesita el primer proceso, por ejemplo reservar espacio para su stack, o su process control block, para subir su código, heap, inicializar los registros de este cpu privado del proceso

## Terminación de procesos

- Salida normal (voluntaria)
    - exit(0) / return 0;
    - _start() (llama al main, si el main hace un return el _start termina haciendo el exit)
- Salida por error (voluntaria)
    - exit(!=0) / return!=0
    - colores zsh
- Error fatal (involuntario)
    - instrucciones inválidas, división por 0, memoria inexistente
    - señales
- Muerto por otro proceso (involuntario)
    - kill
    - permisos → usuarios

## Jerarquia de procesos

### Grupo de procesos - UNIX

- Un padre y sus descendientes forman un grupo de procesos.
- Recepción de señales por grupo, por ejemplo el teclado.
- Init es la raíz de este árbol

### WIN32

- No existe una jerarquía de procesos
- El padre recibe un handle para manejar al proceso
- El handle se puede transferir a otro proceso

## Estados de procesos

- Running (usando el CPU)
- Ready (ejecutable, detenido temporalmente para dejar que se ejecute otro)
- Blocked (no se puede ejecutar hasta que ocurra algún evento externo)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e018e6a7-098a-4862-90cf-b13d9d508e21/Untitled.png)

```
PROCESS STATE CODES
       Here are the different values that the s, stat and state output
       specifiers (header "STAT" or "S") will display to describe the state of
       a process.
       D    Uninterruptible sleep (usually IO)
       R    Running or runnable (on run queue)
       S    Interruptible sleep (waiting for an event to complete)
       T    Stopped, either by a job control signal or because it is being
            traced.
       W    paging (not valid since the 2.6.xx kernel)
       X    dead (should never be seen)
       Z    Defunct ("zombie") process, terminated but not reaped by its
            parent.
```

## Zombie vs Huérfano

En [sistemas operativos](https://es.wikipedia.org/wiki/Sistema_operativo) [Unix](https://es.wikipedia.org/wiki/Unix), un **proceso zombi** o "defunct" (difunto) es un proceso que ha completado su ejecución pero aún tiene una entrada en la tabla de procesos[1](https://es.wikipedia.org/wiki/Proceso_zombie#cite_note-1), lo que permite al proceso que lo ha creado leer el estado de su salida. Metafóricamente, el proceso hijo ha muerto pero su "alma" aún no ha sido recogida.

Cuando un proceso acaba, toda la memoria y recursos asociados se desreferencian, para que puedan ser usados por otros procesos. De todas formas, la entrada del proceso en la tabla de procesos aún permanece. Al padre se le envía una señal SIGCHLD indicando que el proceso ha muerto; el manejador para esta señal será típicamente ejecutar la llamada al sistema wait, que lee el estado de salida y borra al zombi. El ID del proceso zombi y la entrada en la tabla de procesos pueden volver a usarse.

Un proceso zombi no es lo mismo que un proceso huérfano. Los procesos huérfanos no se convierten en procesos zombis, sino que son adoptados por init (ID del proceso = 1), que espera a su hijo.