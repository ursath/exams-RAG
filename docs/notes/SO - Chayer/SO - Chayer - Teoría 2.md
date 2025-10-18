<aside> 🚨 Si bien los ejemplos son a modo ilustrativo, las aplicaciones de la vida real nunca deben hacer uso de las _stdio_ functions en un _signal handler_ (capitulo 21.1.2).

</aside>

# Señales

## _Overview_

Una **señal** es una notificación a un proceso de que ocurrió un evento. Al igual que las interrupciones de hardware, interrumpen el flujo normal de ejecución de un programa y no podemos predecir cuando pueden llegar a ocurrir.

Un proceso, si tiene ciertos permisos, puede enviar ciertas señales a otros procesos o incluso a él mismo. Usualmente las señales se utilizan como mecanismo de sincronización de procesos y una forma primitiva de comunicar a los procesos.

<aside> 💡 El mayor emisor de señales a los procesos, es el Kernel.

</aside>

¿Cuánto tarda en entregarse una señal a un proceso?

Dijimos que una señal es generada por cierto evento. Una vez generada, esta se entrega al proceso que luego toma alguna acción en respuesta a la señal. En ese tiempo que se genera la señal y se entrega al proceso, decimos que una señal está en estado pendiente. Normalmente, una señal pendiente se entrega a un proceso tan pronto como el scheduler lo elija, o inmediatamente si el proceso se está ejecutando.

¿Se puede impedir que una señal interrumpa mi proceso?

Sí. Para hacer esto, podemos agregar una señal a la máscara de señales del proceso. Si se genera una señal mientras está bloqueada, esta permanece pendiente hasta que se desbloquea (se elimina de la máscara).

Existen varias system calls que nos permiten hacer esto.

¿Qué efectos predeterminados puede tener una señal sobre mi proceso?

- La señal puede ser ignorada por el proceso
- El proceso puede finalizar su ejecución.
- El proceso puede pausarse.
- El proceso puede reanudarse (si previamente fue pausado)
- Se puede generar un _core dump file_ para luego finalizar la ejecución del proceso.
    - Un _core dump file_ permite debuggear la memoria virtual del proceso para determinar el estado del mismo una vez que finalizó.

Es posible modificar el comportamiento default que tienen las señales a través de un handler o haciendo que su comportamiento default sea ignorado.

# Tipos de señales y acciones por default

Hay dos categorías de señales, las _standar signals_ y las _realtime signals_. Para obtener la descripcion de todas ellas ejecutar la siguiente linea en la terminal de Linux:

```bash
>> man 7 signal
```

Mencionamos que cuando un proceso recibe una señal este puede:

- _Ejecutar_ la acción por default o predeterminada.
- _Capture:_ capturarla con un handler para modificar su comportamiento o para volver a un estado anterior o al punto donde se produjo la interrupción.
- _Blocked:_ enmascarar.
- _Ignore:_ ignorar la señal.

Para saber si una señal es capturable, si puede ser ignorada o bloqueada consultar el manual. A continuacion dejamos una tabla que puede ser util.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4530cbfa-4f3f-4c96-a613-2ec1a9e2c029/Untitled.png)

Los distintos tipos de acciones son:

- **A:** la acción por defecto es terminar el proceso.
- **B:** la acción por defecto es ignorar la señal.
- **C:** la acción por defecto es terminar el proceso y hacer core dump (vuelco de memoria del contexto del proceso a la carpeta del proceso, para poder ver con un programa de depuración, como, por ejemplo: GDB, SDB o ADB).
- **D:** la acción por defecto es parar la ejecución del proceso.
- **E:** la señal no puede ser capturada por el programa (manipulada).
- **F:** la señal no puede ser ignorada ni capturada ni se puede sobrescribir su comportamiento default.

## _Redefiniendo la funcion default_

Para que un programa redefina la función default de una señal, podemos usar:

```c
#include <signal.h>
typedef void (*sighandler_t)(int);

// Returns the previous value of the signal handler, or SIG_ERR on error
sighandler_t signal(int signum, sighandler_t handler);
```

- _sig_ identifica la señal cuya disposicion queremos modificar.
- _handler_ representa la direccion de la funcion que debemos llamar cuando esta señal es entregada al proceso. Esta funcion no retorna nada (`void`) y toma un como unico parametro un entero.

### ¿Que es un signal handler?

Es una funcion que es llamada cuando una señal especifica es entregada a un proceso.

La invocación de un _signal handler_ puede interrumpir el flujo del programa principal en cualquier momento. Lo que ocurre es que el kernel llama al handler en nombre del proceso, y cuando el handler regresa, la ejecución del programa se reanuda en el punto donde el handler lo interrumpió.

Los handlers deben ser diseñados lo mas simple posible.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/66fae4b5-9642-4759-9186-d70250f8a750/Untitled.png)

Cuando el kernel invoca al signal handler, le pasa el número de la señal que provocó la invocación como un `int` al handler (seria el argumento _sig_ de los handlers de los ejemplos).

- Ejemplo 1
    
    ```c
    void contar_segundos(int sig){
    	static int segundos = 0; // static para conservar el valor entre llamados.
    	segundos++;
    	printf("pasaron %d segundos", segundos);
    }
    
    int main() {
    	signal(SIGALARM, contar_segundos);
    	while(1) {
    		// Establecemos una alarma para dentro de un segundo.
    		// Vamos a recibir una SIGALARM en 1 segundo que ejecutará contar_segundos.
    		alarm(1);
    		// Pausamos la ejecución del programa hasta que se reciba una señal.	
    		pause();
    	}
    }
    ```
    
- Ejemplo 2
    
    ```c
    static void sigHandler(int sig) {
    	static int count = 0;
    	if (sig == SIGINT) {
    		count++;
    		printf("Caught SIGINT (%d)\\n", count);
    		return;  /* Resume execution at point of interruption */
    	}
    	/* Must be SIGQUIT - print a message and terminate the process */
    	printf("Caught SIGQUIT - that's all folks!\\n");
    	exit(EXIT_SUCCESS);
    }
    
    int main(int argc, char *argv[]) {
    
    	/* Establish same handler for SIGINT and SIGQUIT */
    
    	if (signal(SIGINT, sigHandler) == SIG_ERR)
    		errExit("signal");
    	if (signal(SIGQUIT, sigHandler) == SIG_ERR)
    		errExit("signal");
    
    	for (;;)
    		pause();
    	/* Loop forever, waiting for signals */
    	/* Block until a signal is caught */
    }
    
    ```
    

## Enviando señales

Un proceso puede enviarle una señal a otro proceso. Supongamos que un proceso quiere matar a otro proceso.

¿Cómo le envio señales a un proceso desde la terminal?

```bash
>> kill -signal <pid>
```

Hacer esto, es exactamente analogo a usar la system call _kill_

```c
#include <signal.h>

// Retorna 0 en caso de exito y -1 en caso de error
int kill(pid_t pid , int sig );
```

Sin embargo, no todo proceso puede matar a otro. Necesita permisos apropiados.

- Reglas
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e01eea39-32d6-45a0-9a48-cc39dae75ff8/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8d6111b2-4bda-40a8-ad81-0712a7e291b0/Untitled.png)
    

<aside> 🔑 Un proceso necesita los permisos apropiados para poder enviar una señal a otro proceso.

</aside>

# ¿Como podemos chequear la existencia de un proceso?

La system call kill nos puede servir para otro proposito. Si el argumento _sig_ se especifica como 0 (conocida como la _null signal_), entonces ninguna señal se envia al proceso. En cambio, _kill_ simplemente realiza comprobación de errores para ver si el proceso se puede señalar. En otras palabras, podemos usar la null signal para testear si un proceso con un process ID especifico existe.

- Si no existe, _kill_ retorna `ESRCH` .
- Si existe pero no tenemos permisos para enviarle una señal, _kill_ retorna `EPERM` .

Sin embargo, esta tecnica no tiene en cuenta el hecho de que un programa en particular aún se esté ejecutando. Debido a que el kernel recicla los process ID a medida que los procesos nacen y mueren, el mismo ID de proceso puede, con el tiempo, referirse a un proceso diferente.

Es por eso que sugerimos las siguientes tecnicas que no se ven afectadas por el reciclado del Process ID:

- Usar _wait_ para chequear la existencia y monitorear los procesos hijos de una aplicacion que forkea hijos.
- _Semaforos y file locks exclusivos:_ Si el proceso que se está monitoreando continuamente tiene un semáforo o un file lock, entonces, si podemos adquirir el semáforo o el lock, sabemos que el proceso ha terminado.
- Canales IPC como pipes y FIFOs: Configuramos el proceso monitoreado para que mantenga un `fd` abierto para escribir en el canal mientras esté activo. Mientras tanto, el proceso de monitoreo mantiene abierto un `fd` de lectura para el canal y sabe que el proceso monitoreado ha terminado cuando se cierra el extremo de escritura del canal (porque ve el `EOF`).

---

Me dio paja seguir, pero el capitulo 20 cubre otras cosas que Horacio menciono muy por arriba.

# Bit of pipes - Introducción y breve resumen

Para Linux, _todo_ es un archivo (i.e todo se representa con un “file descriptor”).

Un **Pipe** es un arreglo de dos file descriptors. Uno permite inyectar bytes (escribir) en un extremo del pipe y otro permite leer del otro extremo del pipe. Los pipes son siempre unidireccionales. Si precisaramos un pipe bidireccional hay que hacer dos pipes (uno en un sentido y otro en el otro sentido). La lectura de un pipe vacío provoca un bloqueo hasta que haya algo disponible en ese pipe.

Los “Unnamed Pipes” solo pueden usarse por un mismo proceso, o una familia jerárquica de procesos. En cambio, en los “Named Pipes” se le da un nombre al objeto y permite la comunicacion entre varios procesos (relacionados y no relacionados).

Este apunte trata unicamente los unnamed pipes.

# Overview

Habiendo creado dos procesos para ejecutar diferentes programas (comandos), ¿Cómo puede la `shell` permitir que la salida producida por un proceso se use como entrada para otro proceso?

Como ejemplo de esta pregunta, pensemos en el comando:

```bash
>> ls | wc -l # Cuenta el numero de archivos en un directorio
```

Por lo que vimos en la parte de procesos, sabemos que para ejecutar el comando de arriba, la `shell` crea dos procesos ejecutando `ls` y `wc` respectivamente mediante el uso de `fork` y `exec.`

Los pipes se pueden pensar como una vía (tubería) que permite que los datos se transmitan de un proceso a otro en una sola dirección. Los dos procesos están conectados al pipe de modo que el proceso de escritura (`ls`) tiene su salida estándar (`fd` 1) unida al extremo de escritura del pipe, mientras que el proceso de lectura (`wc`) tiene su entrada estándar (`fd` 0) unida al extremo de lectura del pipe.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b1b856a2-16c1-4b9e-a4dc-a6dfd2fb34be/Untitled.png)

Es importante recalcar que estos dos procesos desconocen la existencia de pipe. Simplemente leen y escriben en los standard `fd`.

La idea es entender el trabajo que debe hacer la `shell` para configurar las cosas de esta manera, y entender las ventajas de usar este método de comunicación entre procesos.

# Características de los pipes

- Un pipe es un flujo de bytes
    
    El proceso de lectura de bytes de un pipe se hace a través de bloques de tamaños distintos que son transmitidos de manera secuencial por el proceso de escritura.
    
    No es posible acceder de manera aleatoria a los datos en un pipe.
    
- Lectura de datos de un pipe
    
    Cuando el proceso unido extremo de escritura del pipe se cierra, el proceso unido al extremo de lectura del pipe leerá un `end-of-file` (valor 0) cuando haya leído toda la data que fue inyectada en el pipe (recordemos que la transmisión de los datos en el pipe es secuencial). Con el end-of-file se cierra el pipe.
    
    Cualquier intento de leer de un pipe vacío será impedido hasta que al menos un byte se inyecte en el pipe.
    
- Los pipes son unidireccionales
    
    Los datos viajan en un solo sentido a través del pipe. Un extremo es para inyectar (escribir) y el otro para leer.
    
- Se garantiza que las escrituras de hasta `PIPE_BUF` bytes sean atómicas
    
    El límite `PIPE_BUF` afecta cuando se transfieren los datos a la tubería.
    
    Al inyectar bytes hasta llegar al limite `PIPE_BUF`, `write` se bloqueará hasta que haya suficiente espacio disponible en el pipe para que se pueda completar la operación de forma atómica.
    
    Cuando se escriben más de `PIPE_BUF` bytes, `write` transfiere tantos datos como sea posible para llenar el pipe y luego se bloquea hasta que los datos se eliminan del pipe mediante algún proceso de lectura del pipe.
    
    Si un `write` bloqueado es interrumpido por un signal handler, entonces la llamada se desbloquea y devuelve un recuento de la cantidad de bytes transferidos con éxito, que será menor que la solicitada. A esto se lo llama escritura parcial.
    
    <aside> 📌 La operación escritura en un pipe es atómica a no ser que sea interrumpida por un signal handler.
    
    </aside>
    
- Los pipes tienen una capacidad limitada
    
    Un pipe es un buffer que se mantiene en la memoria del kernel.
    
    Como se mencionó, si el pipe está lleno, se bloquea la operación `write` hasta que ocurra alguna operación de lectura.
    
    Si queremos evitar esto, claramente la solución es comenzar a leer datos del pipe apenas estén disponibles.
    
    La razón por la cual los pipes deberían ser grandes es por una cuestión de eficiencia:
    
    Cada vez que un `write` llena el pipe, el Kernel debe realizar un cambio de contexto para permitir que el scheduler elija al proceso de lectura para que pueda vaciar algunos datos del pipe. Emplear un tamaño de buffer más grande, significa que se requieren menos cambios de contexto.
    
- Permiten la comunicación entre procesos relacionados
    
    Los pipes se pueden usar para la comunicación entre dos (o más) **procesos relacionados**, siempre que el pipe haya sido creado por un ancestro común (por eso relacionados) antes de la serie de llamadas a `fork()` que llevaron a la existencia de los procesos.
    
    Por ejemplo, un pipe podría usarse para la comunicación entre un proceso y su nieto. El primer proceso crea el pipe y luego forkea un hijo que a su vez forkea para producir el nieto. Un escenario común es que un pipe se use para la comunicación entre dos hermanos: su padre crea el pipe y luego crea los dos hijos. Esto es lo que hace la `shell` cuando construye el pipeline.
    

<aside> 📌 La lectura en un pipe NO es atómica.

</aside>

<aside> 📌 Un pipe es un buffer en memoria RAM.

</aside>

# Creación y uso de pipes

Un pipe es un buffer en memoria ram.

La _**system call**_ para crear un pipe es la siguiente:

```c
#include <unistd.h>

// Retorna 0 si puedo crear correctamente el pipe, -1 en caso contrario.
int pipe(int fieldes[2]);
```

Si la función no falla, retorna dos `fd` abiertos en el arreglo _fieldes._ Uno corresponde al extremo de lectura del pipe (_filedes[0]_) y otro para el extremo de escritura (_filedes[1]_).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6e5fc38-a1ed-4b0a-89ef-d71719a8cd1c/Untitled.png)

Al igual que con cualquier `fd`, podemos usar las syscalls `read()` y `write()` para realizar operaciones de E/S en el pipe.

Una vez que se escribió algo en el extremo de escritura de un pipe, los datos están inmediatamente disponibles para ser leídos desde el extremo de lectura.

Sin embargo, no tiene muchas aplicaciones que el `pipe` lo use solamente el _calling process._ Generalmente queremos comunicar procesos entre si con el pipe para transmitir datos. Es por eso que luego de hacer un `pipe()` hacemos un llamado a `fork()`.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/58b4287c-a305-42b8-b7f8-456c87f0a113/Untitled.png)

El problema es que al hacer `fork()`, el proceso hijo hereda copias de los `fds` de su padre permitiendo que sea posible para ambos procesos leer y escribir en el pipe. Es por eso que inmediatamente después de hacer el `fork`, uno de los dos procesos debe cerrar el extremo de escritura y el otro el extremo de lectura.

- Ejemplo
    
    ```c
    int main(void) {	
    	
    		int filedes[2];
    		
    		if (pipe(filedes) == -1) /* Create the pipe */
    				errExit("pipe");
    		
    		switch (fork()) { /* Create a child process */
    				case -1:
    								errExit("fork");
    				case 0: /* Child */
    								if (close(filedes[1]) == -1) /* Close unused write end */
    										errExit("close");
    								/* Child now reads from pipe */
    								break;
    				default: /* Parent */
    								if (close(filedes[0]) == -1) /* Close unused read end */
    										errExit("close");
    								/* Parent now writes to pipe */
    								break;
    		}
    }
    ```
    

## _Files descriptors_

Primero discutiremos algunas cuestiones que tienen que ver con el cerrado de los `fd` entre procesos y luego entenderemos el problema que conlleva no cerrar aquellos `fd` inutilizados.

¿Por qué no es usual permitir que los procesos mantengan abiertos los fd como se muestra en la última imagen a la izquierda (a) ?

- Una razón por la cual no es usual permitir que el padre y el hijo puedan leer del pipe al mismo tiempo es porque si intentan leer simultáneamente del pipe, no podríamos estar seguros cual de los dos lo lograría primero (condición de carrera).
- Otra razón es la siguiente: si bien es posible tener múltiples procesos escribiendo en un pipe, es típico que solamente un proceso sea el que escribe.

¿Por qué es necesario cerrar los file descriptors inutilizados?

Para asegurar el correcto funcionamiento del pipe. Veamos los siguientes casos.

_**Problema con el end-of-file:**_

Dijimos que el proceso que lee del pipe cierra el extremo de escritura del pipe de modo que cuando el otro proceso termina de inyectar los datos y cierra el extremo de escritura, el lector ve el `end-of-file` (una vez que ha leído los datos pendientes en la tubería).

Si el proceso de lectura no cierra el extremo de escritura del pipe, luego de que el otro proceso cierre su descriptor de escritura, el lector no verá el end-of-file, incluso después de haber leído todos los datos del pipe.

En este caso un `read()` podría quedar bloqueado esperando datos ya que el Kernel sabe que hay otro proceso que puede escribir en el pipe. Una forma de solucionar esto es interrumpiendo con un signal handler.

_**Problemas para identificar el estado del pipe:**_

El proceso de escritura cierra su read-end del pipe por una razón diferente.

Cuando un proceso intenta escribir en un pipe para el cual ningún proceso tiene un descriptor de lectura abierto, el kernel envía la señal `SIGPIPE` al proceso de escritura. Por defecto, esta señal mata un proceso. El proceso podría capturar o ignorar esta señal. En base a esto, la escritura en el pipe fallaría con error `EPIPE` (pipe roto).

Recibir la señal `SIGPIPE` u obtener el error `EPIPE` es una indicación útil sobre el estado del pipe, y es por eso que los descriptores de lectura no utilizados del pipe deben cerrarse.

_**Bloqueo en la operación de escritura**_

Si el proceso de escritura no cierra el extremo de lectura del pipe incluso después de que el otro proceso cierre el extremo de lectura, el proceso de escritura aún podrá escribir en la tubería. Eventualmente, el proceso de escritura podría llenar el pipe y un nuevo intento de escritura se bloqueará indefinidamente.

_**Problemas para destruir el pipe:**_

Solamente después de que se cierran todos los `fd` en todos los procesos que se refieren a un pipe, el mismo se destruye y sus recursos se liberan para que otros procesos los reutilicen.

# Comunicación entre procesos relacionados

Veamos un ejemplo donde se muestra como comunicar dos procesos relacionados.

- Ejemplo
    
    > The main program calls `pipe()` to create a pipe (1), and then calls `fork()` to create a child (2). After the `fork()`, the parent process closes its file descriptor for the read end of the pipe (8), and writes the string given as the programs command-line argument to the write end of the pipe (9). The parent then closes the read end of the pipe (10), and calls `wait()` to wait for the child to terminate (11). After closing its file descriptor for the write end of the pipe (3), the child process enters a loop where it reads (4) blocks of data (of up to `BUF_SIZE` bytes) from the pipe and writes (6) them to standard output. When the child encounters `end-of-file` on the pipe (5), it exits the loop (7), writes a trailing newline character, closes its descriptor for the read end of the pipe, and terminates.
    
    ```c
    #include <sys/wait.h>
    #define BUF_SIZE 10
    
    int main(int argc, char *argv[])
    {
    	int pfd[2]; /* Pipe file descriptors */
    	char buf[BUF_SIZE];
    	size_t numRead;
    
    	if (argc != 2 || strcmp(argv[1], "--help") == 0)
    		usageErr("%s string\\n", argv[0]);
    
    	if (pipe(pfd) == -1) /* Create the pipe (1)*/
    		errExit("pipe");
    	
    	switch (fork()) { // (2)
    
    		case -1:
    						errExit("fork");
    
    		case 0: /* Child - reads from pipe */
    
    					if (close(pfd[1]) == -1) /* Write end is unused (3) */
    							errExit("close - child");
    
    					for (;;) { /* Read data from pipe, echo on stdout */
    							numRead = read(pfd[0], buf, BUF_SIZE); // (4)
    
    							if (numRead == -1)
    									errExit("read");
    
    							if (numRead == 0) // (5)
    									break; /* End-of-file */
    
    							if (write(STDOUT_FILENO, buf, numRead) != numRead) // (6)
    									fatal("child - partial/failed write");
    					}
    
    					write(STDOUT_FILENO, "\\n", 1); // (7)
    
    					if (close(pfd[0]) == -1) // (8)
    							errExit("close");
    
    					_exit(EXIT_SUCCESS);
    
    		default: /* Parent - writes to pipe */
    
    					if (close(pfd[0]) == -1) /* Read end is unused */
    							errExit("close - parent");
    					
    					if (write(pfd[1], argv[1], strlen(argv[1])) != strlen(argv[1])) // (9)
    							fatal("parent - partial/failed write");
    
    					if (close(pfd[1]) == -1) /* Child will see EOF (10) */
    							errExit("close");
    
    					wait(NULL); /* Wait for child to finish (11) */
    
    					exit(EXIT_SUCCESS);
    		}
    }
    
    ```
    

# Pipes como método de sincronización de procesos

Vimos que las señales podían usarse como un método de sincronización de acciones entre procesos para evitar condiciones de carrera. Con el siguiente ejemplo, podemos ver como un pipe puede cumplir la misma funcionalidad.

- Ejemplo
    
    En este ejemplo un proceso crea multiples procesos distintos. El padre espera a que todos los procesos hijos terminen sus acciones.
    
    Observar como los hijos no escriben en el pipe, simplemente, al utilizar el read-end del pipe, el ultimo hijo en forkearse y terminar de ejecutarse es el que le enviara el EOF al padre.
    
    > To perform the synchronization, the parent builds a pipe (1) before creating the child processes (2). Each child inherits a file descriptor for the write end of the pipe and closes this descriptor once it has completed its action (3). After all of the children have closed their file descriptors for the write end of the pipe, the parents `read()` (5) from the pipe will complete, returning `end-of-file`. At this point, the parent is free to carry on to do other work. (Note that closing the unused write end of the pipe in the parent (4) is essential to the correct operation of this technique; otherwise, the parent would block forever when trying to read from the pipe.)
    
    ```c
    #include "curr_time.h" /* Declaration of currTime() */
    
    int main(int argc, char *argv[])
    {
    	int pfd[2]; /* Process synchronization pipe */
    	int j, dummy;
    
    	if (argc < 2 || strcmp(argv[1], "--help") == 0)
    			usageErr("%s sleep-time...\\n", argv[0]);
    
    	setbuf(stdout, NULL); /* Make stdout unbuffered, since we 
    																	terminate child with _exit() */
    
    	printf("%s Parent started\\n", currTime("%T"));
    
    	if (pipe(pfd) == -1) // (1)
    			errExit("pipe");
    
    	for (j = 1; j < argc; j++) {
    
    			switch (fork()) {
    
    				case -1:
    								errExit("fork %d", j);
    
    				case 0: /* Child */
    
    								if (close(pfd[0]) == -1) /* Read end is unused */
    										errExit("close");
    
    								/* Child does some work, and lets parent know it's done */
    								sleep(getInt(argv[j], GN_NONNEG, "sleep-time"));
    
    								/* Simulate processing */
    								printf("%s Child %d (PID=%ld) closing pipe\\n",
    								currTime("%T"), j, (long) getpid());
    
    								if (close(pfd[1]) == -1) // (3)
    										errExit("close");
    								
    								/* Child now carries on to do other things... */
    								_exit(EXIT_SUCCESS);
    
    				default: /* Parent loops to create next child */
    								break;
    			}
    	}
    	/* Parent comes here; close write end of pipe so we can see EOF */
    	
    	if (close(pfd[1]) == -1) /* Write end is unused (4) */
    			errExit("close");
    	
    	/* Parent may do other work, then synchronizes with children */
    	if (read(pfd[0], &dummy, 1) != 0) // (5)
    			fatal("parent didn't get EOF");
    	
    	printf("%s Parent ready to go\\n", currTime("%T"));
    	
    	/* Parent can now carry on to do other things... */
    
    	exit(EXIT_SUCCESS);
    	}
    
    ```
    

# Usar pipes para conectar filters

Cuando se crea un pipe, los fd utilizados para los dos extremos del pipe son aquellos con el número más bajo disponible. En circunstancias normales, los descriptores 0, 1 y 2 ya están en uso como para asignárselo a los extremos del pipe, por lo que se asignarán descriptores con números más altos que estos.

¿Cómo generamos la situación que se muestra en la primer imagen de este apunte, donde dos **filters** (es decir, programas que leen desde la entrada estándar y escriben en la salida estándar) se conectan mediante un pipe, de modo que la salida estándar de un programa se dirige al pipe y la entrada estándar del otro se toma del pipe si los file descriptors 0 y 1 estan ocupados?

¿Cómo podemos hacer esto sin modificar el código de los propios filters?

La respuesta es, duplicando file descriptors.

Prestemos atención al siguiente código:

```c
int main(void) {
	
	int pfd[2];

	pipe(pfd); // Allocates (say) file descriptors 3 and 4 for pipe.

	// Other steps here like fork, etc.

	if(pfd[1]!= STDOUT_FILENO){
		dup2(pfd[1], STDOUT_FILENO); /* Close descriptor 1, and reopen bound to 
																	 write end of pipe */
		close(pfd[1]);
	}

	return 0;
}

```

Nosotros queremos que `ls` escriba en el extremo de escritura del pipe y que no escriba en `STDOUT` (1) como suele hacer.

Supongamos que antes de entrar al `if` tenemos la siguiente lista de file descriptors asignados:

|File descriptor|Points to|
|---|---|
|0|STDIN|
|1|STDOUT|
|2|STDERR|
|3|Read end of pipe|
|4|Write end of pipe|
|5|...|

`dup2` permite que hagamos una copia del file descriptor de la izquierda diciendo explícitamente con qué entero queremos asociarlo. Si ese entero estaba asociado a un open `fd`, este se cerrara.

Entonces, la lista que teníamos en un principio resulta:

|File descriptor|Points to|
|---|---|
|0|STDIN|
|1|Write end of pipe|
|2|STDERR|
|3|Read end of pipe|
|4|Write end of pipe|
|5|...|

Después de duplicar _pfd[1]_ tenemos dos `fd` que se refieren al extremo de escritura del pipe: el descriptor 1 y _pfd[1]_. Dado que los descriptores de utilizados deben cerrarse, después de la llamada a `dup2()`, cerramos el descriptor sobrante, por lo que el 4 quedara como un `fd` libre.

Recordemos que todo esto lo hicimos para que `ls` que usa el `fd` 1, inyecte código en el extremo de escritura del pipe.

- Ejemplo completo: usar un pipe para conectar `ls` y `wc`
    
    En este ejemplo, luego de crear el pipe, el programa crea dos hijos. El primero de ellos une `STDOUT` con el extremo de escritura del pipe y luego ejecuta `ls` . El segundo hijo, une `STDIN` con el extremo de lectura del pipe y luego ejecuta `wc` .
    
    ```c
    #include <sys/wait.h>
    
    int main(int argc, char *argv[])
    {
    	int pfd[2]; /* Pipe file descriptors */
    	
    	if (pipe(pfd) == -1) /* Create pipe */
    			errExit("pipe");
    
    	switch (fork()) {
    		case -1:
    						errExit("fork");
    
    		case 0: /* First child: exec 'ls' to write to pipe */
    
    						if (close(pfd[0]) == -1) /* Read end is unused */
    								errExit("close 1");
    
    						/* Duplicate stdout on write end of pipe; close duplicated descriptor */
    						if (pfd[1] != STDOUT_FILENO) { /* Defensive check */
    								if (dup2(pfd[1], STDOUT_FILENO) == -1)
    										errExit("dup2 1");
    
    								if (close(pfd[1]) == -1)
    										errExit("close 2");
    						}
    
    						execlp("ls", "ls", (char *) NULL); /* Writes to pipe */
    
    						errExit("execlp ls");
    
    	default: /* Parent falls through to create next child */
    					break;
    	}
    
    	switch (fork()) {
    		case -1:
    						errExit("fork");
    		case 0: /* Second child: exec 'wc' to read from pipe */
    
    					if (close(pfd[1]) == -1) /* Write end is unused */
    							errExit("close 3");
    
    					/* Duplicate stdin on read end of pipe; close duplicated descriptor */
    					if (pfd[0] != STDIN_FILENO) { /* Defensive check */
    							if (dup2(pfd[0], STDIN_FILENO) == -1)
    								errExit("dup2 2");
    
    							if (close(pfd[0]) == -1)
    								errExit("close 4");
    					}
    
    					execlp("wc", "wc", "-l", (char *) NULL); /* Reads from pipe */
    
    					errExit("execlp wc");
    		default: /* Parent falls through */
    						break;
    	}
    
    	/* Parent closes unused file descriptors for pipe, and waits for children */
    	if (close(pfd[0]) == -1)
    			errExit("close 5");
    
    	if (close(pfd[1]) == -1)
    			errExit("close 6");
    
    	if (wait(NULL) == -1)
    			errExit("wait 1");
    
    	if (wait(NULL) == -1)
    			errExit("wait 2");
    
    	exit(EXIT_SUCCESS);
    }
    ```
    
    _Importante_
    
    > The _execlp_, _execvp_, and _execvpe_ functions duplicate the actions of the shell in searching for an executable file if the specified filename does not contain a slash (/) character. The file is sought in the colon-separated list of directory pathnames specified in the PATH environment variable. If this variable isn't defined, the path list defaults to the current directory followed by the list of directories returned by confstr(_CS_PATH). (This confstr(3) call typically returns the value "/bin:/usr/bin".)
    
    `execv` solo busca en el current working directory
	