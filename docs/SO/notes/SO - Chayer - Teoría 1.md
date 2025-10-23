# Proceso en UNIX

Un **proceso** es una instancia de un programa en ejecución.

Un proceso es algo _dinámico_, un **programa** es algo _estático_. Un programa puede crear más de un proceso.

- Cada proceso dentro de su información tiene el código del programa, el área de datos, el program counter, registros, pila e información adicional.
- El sistema operativo debe poder crear un proceso, destruirlo, suspenderlo y retomarlo.
- El sistema operativo debe tener mecanismos para sincronizar procesos y mecanismos de concurrencia de procesos.
- Los procesos tienen una estructura jerárquica tipo árbol.
    - Hay un pedido para abrir un hilo de ejecución que dependerá del estándar según el cuál se maneje el SO.
    - _**POSIX:**_ estándar para hacer llamadas a un sistema operativo (cualquier SO) para levantar procesos, crear archivos o comunicar procesos.

---

_**Algunos comentarios extra:**_

Los procesadores hoy en día tienen múltiples cores, por lo que tendrán “múltiples ojos” para poder correr múltiples procesos. En cada core se despacha un proceso y se pueden realizar múltiples cambios de contextos a la vez (en la misma fracción de segundo).

En caso de ser un mono-procesador, se corre un solo proceso y se cambia de contexto constantemente.

**Cola de listos:** estructura de datos donde se guardan los procesos que están listos para ejecutarse y pueden ser elegidos por Scheduler.

**Contexto de un proceso:** El contexto del proceso es su estado actual. Necesitamos guardar el contexto del proceso (registros como por ejemplo `EIP`, `CS`, etc.) en ejecución para que pueda reanudarse después de que se maneje la interrupción. Tendremos tantos contextos como procesos en ejecución.

El SO no es un proceso. No podemos decir que el SO está corriendo en background. El SO es código, ejecuta, pero no dentro del contexto de un proceso. El SO provee un servicio para manipular los procesos.

# Visualizar procesos desde la línea de comando

### Información de los procesos

```bash
>> ps -ef 
```

_**UID:**_ ID del usuario propietario del proceso.

_**PID:**_ Process identification. Todo proceso en Linux tiene un código. Los procesos 0 y 1 los crea Linux cuando se inicializa.

_**PPID:**_ Parent process ID. Linux organiza los procesos en un árbol jerárquico. El scheduler (pid 0) es el padre de todos. Muchos procesos, sobre todo os de usuario, son hijos de init (pid 1).

_**C:**_ Utilización del pre-procesador de C para la administración de procesos (desuso).

_**STIME:**_ Hora de comienzo.

_**TTY:**_ Terminal de control.

_**TIME:**_ Tiempo acumulado de CPU.

_**CMD:**_ Nombre del comando.

### Identificar usuarios y procesos

```c
#include <sys/types.h>
#include <unistd.h>

pid_t getpid(void);   
pid_t getppid(void);
uid_t getuid(void);  
```

- `pid_t` es un `long int` con el ID del proceso llamante (_getpid_) o del padre del proceso llamante (_getppid_).
- `uid_t` es un `int` con el ID del usuario propietario del proceso llamante. Devuelve -1 en caso de error.

# Overview: fork(), exit(), wait() y execve()

Todas ellas son **system calls** y tienen sus respectivas variantes. Sin embargo, por ahora nos interesa tener una idea de qué hace cada una y cómo usarlas en conjunto.

- `fork`
    
    > The _fork()_ system call allows one process, the parent, to create a new process, the child. This is done by making the new child process an (almost) exact duplicate of the parent: the child obtains copies of the parent’s stack, data, heap, and text segments (Section 6.3). The term fork derives from the fact that we can envisage the parent process as dividing to yield two copies of itself.
    
    Ver [guía de arqui](https://www.notion.so/23abc2046b7f427189d4d926c3505f5a?pvs=21) que hay un ejercicio de fork.
    
- `exit`
    
    > The _exit(status)_ library function terminates a process, making all resources (memory, open file descriptors, and so on) used by the process available for subsequent reallocation by the kernel. The status argument is an integer that determines the termination status for the process. Using the _wait()_ system call, the parent can retrieve this status.
    
- `wait`
    
    > The _wait(&status)_ system call has two purposes. First, if a child of this process has not yet terminated by calling _exit()_, then _wait()_ suspends execution of the process until one of its children has terminated. Second, the termination status of the child is returned in the status argument of _wait()._
    
- `exec`
    
    > The _execve(pathname, argv, envp)_ system call loads a new program (pathname, with argument list _argv_, and environment list _envp_) into a process’s memory. The existing program text is discarded, and the stack, data, and heap segments are freshly created for the new program. This operation is often referred to as _execing_ a new program. Later, we’ll see that several library functions are layered on top of _execve()_, each of which provides a useful variation in the programming interface. Where we don’t care about these interface variations, we follow the common convention of referring to these calls generically as _exec()_, but be aware that there is no system call or library function with this name.
    
    En resumen, mi proceso se elimina de memoria y da paso a otro proceso.
    
    <aside> ‼️ Exec preserva los fd abiertos excepto que tengan seteado el close-on-exec.
    
    </aside>
    

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1474e710-2c48-4a8d-ac75-dcb9de6323bc/Untitled.png)

- Comentarios de Horacio acerca de la imagen.
    
    Todo proceso en UNIX ha sido creado por una instrucción `fork`.
    
    El nuevo proceso que se crea recibe una **copia del contexto de proceso del padre**. Los dos procesos continúan su ejecución en la instrucción siguiente al `fork`. A partir de ese instante de la clonación, cada contexto es independiente del otro porque trabajan como dos zonas de memoria distintas.
    
    `fork` retorna 0 al proceso hijo y al padre el PID del hijo. En caso de error retorna -1.
    
    `wait` espera que el hijo haga un `exit`. El valor de retorno de ese `exit`, lo recoge el padre. Si hay varios hijos, el proceso padre va a tomar el primer hijo que haga `exit`.
    
    Como no sabemos cuando el padre ejecutará un `wait`, se lo deja en “estado zombi” a los procesos hijos que van terminando. En el caso de que el padre no haga un `wait` nunca, esos hijos los hereda `init`. `init`, con alguna frecuencia, hace un `wait` de todos los hijos para ir limpiando el sistema de procesos zombis.
    
    **Proceso zombi:** proceso que terminó pero cuyo valor nadie lo leyó. Linux guarda ese valor de retorno, pero saca de memoria al proceso.
    

# Creación de un proceso con fork()

```c
#include <sys/types.h>
#include <unistd.h>

// In parent: Returns process ID of child on success.
// In successfully created child: Returns 0.
// Error: -1.

pid_t fork(void);
```

Después de un llamado a `fork`, existirán dos procesos y, en cada proceso, la ejecución continúa desde el punto donde retorna `fork`.

Los dos procesos estarán ejecutando el mismo texto de programa pero tienen copias separadas de los segmentos de pila, datos y stack. Los segmentos de pila, datos y stack del hijo son inicialmente duplicados exactos de las partes correspondientes de la memoria del padre. Luego del `fork`, cada proceso puede modificar las variables en sus segmentos de pila, datos y stack sin afectar al otro proceso.

Por lo general, se suele emplear la siguiente estructura cuando se utiliza `fork` :

```c
/* Used in parent after successful fork() to record PID of child */
pid_t childPid;

switch (childPid = fork()) {

		case -1:
						/* fork() failed */
						/* Handle error */
		case 0:
						/* Child of successful fork() comes here */
						/* Perform actions specific to child */
		default:
						/* Parent comes here after successful fork() */
						/* Perform actions specific to parent */
}
```

<aside> 📢 Luego de un `fork` no se puede determinar cuál de los dos procesos será elegido primero por el Scheduler para usar la CPU. En programas mal escritos, esta indeterminación puede conducir a errores conocidos como **condiciones de carrera**.

</aside>

## _Uso de fork()_

```c
#include <stdio.h>

static int idata = 111;            /* Allocated in data segment */

int main(int argc, char *argv[])
{
	int istack = 222;               /* Allocated in stack segment */
	pid_t childPid;
	
	switch (childPid = fork()) {
		case -1:
						errExit("fork");
		case 0:
					idata *= 3;
					istack *= 3;
					break;
	default:
					sleep(3);               /* Give child a chance to execute */
					break;
}

/* Both parent and child come here */
printf("PID=%ld %s idata=%d istack=%d\\n", (long) getpid(), 
						(childPid == 0) ? "(child) " : "(parent)", idata, istack);

exit(EXIT_SUCESS);
```

- Comentarios del ejemplo
    
    ```bash
    # Program output
    $ ./t_fork
    PID=28557 (child) idata=333 istack=666
    PID=28556 (parent) idata=111 istack=222
    ```
    
    El output demuestra que el proceso hijo obtiene su propia copia de la pila y los segmentos de datos en el momento del `fork`, y puede modificar las variables en estos segmentos sin afectar al padre.
    
    El uso de `sleep` en el código ejecutado por el padre permite que el hijo pueda ser elegido por el Scheduler antes que el padre, para que el hijo pueda completar su trabajo y terminar antes de que el padre continúe con la ejecución. Usar `sleep` de esta manera no es un método infalible para garantizar este resultado. Más adelante en el curso veremos mejores formas.
    
    Si no hubiese estado el `sleep` ¿Podrían haberse ejecutado en simultáneo padre e hijo?
    
    - Si tenemos por lo menos dos cores: podrían llegar a correr padre e hijo los dos al mismo tiempo.
    - Si tenemos un solo procesador: Depende del Scheduler. Existen versiones de Linux donde le dan prioridad a uno antes que al otro. No está bueno que nuestro código dependa de uno o el otro porque el comportamiento podría ser distinto en distintos SO. Para eso agregamos el sleep, para intentar lograr que salga el mensaje del hijo primero.

## A_rchivos compartidos entre padre e hijo_

Cuando se realiza un `fork`, el hijo recibe duplicados todos los `fd` del padre. Esta duplicación se realiza a través de la función `dup` , lo que significa que al retornar de `fork`, para todo `fd` correspondiente al padre existe un `fd` que pertenece al proceso hijo que refieren al mismo `fd` abierto.

Como vimos en Arqui, el `fd` abierto contiene el actual file offset y los open file status flags (seteados por _open_ y modificados por _fcntl_) . Entonces, cualquiera de los dos procesos que actualice el file offset lo podrá ver el otro proceso. Esto último lo podemos ver con el siguiente ejemplo:

```c
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/wait.h>

int main(int argc, char *argv[])
{
	int fd, flags;
	char template[] = "/tmp/testXXXXXX";

	setbuf(stdout, NULL);      /* Disable buffering of stdout */

	fd = mkstemp(template);
	if (fd == -1)
			errExit("mkstemp");
	
	printf("File offset before fork(): %lld\\n",
						(long long) lseek(fd, 0, SEEK_CUR));
	
	flags = fcntl(fd, F_GETFL);

	if (flags == -1)
			errExit("fcntl - F_GETFL");
	printf("O_APPEND flag before fork() is: %s\\n",
					(flags & O_APPEND) ? "on" : "off");
	
	switch (fork()) {
		case -1:
						errExit("fork");
		case 0: /* Child: change file offset and status flags */

						if (lseek(fd, 1000, SEEK_SET) == -1)
								errExit("lseek");

						flags = fcntl(fd, F_GETFL); /* Fetch current flags */

						if (flags == -1)
								errExit("fcntl - F_GETFL");
						flags |= O_APPEND; /* Turn O_APPEND on */

						if (fcntl(fd, F_SETFL, flags) == -1)
								errExit("fcntl - F_SETFL");
					
						_exit(EXIT_SUCCESS);

		default: /* Parent: can see file changes made by child */
						if (wait(NULL) == -1)
								errExit("wait"); /* Wait for child exit */
						
						printf("Child has exited\\n");
				
						printf("File offset in parent: %lld\\n",
										(long long) lseek(fd, 0, SEEK_CUR));
						
						flags = fcntl(fd, F_GETFL);
						if (flags == -1)
								errExit("fcntl - F_GETFL");

						printf("O_APPEND flag in parent is: %s\\n",
											(flags & O_APPEND) ? "on" : "off");

						exit(EXIT_SUCCESS);
	}
}
```

- Comentarios del ejemplo
    
    ```bash
    # Output
    $ ./fork_file_sharing 
    File offset before fork(): 0
    O_APPEND flag before fork() is: off
    Child has exited
    File offset in parent: 1000
    O_APPEND flag in parent is: on
    ```
    
    Este programa abre un archivo temporal usando _mkstemp_ y luego llama a `fork` para crear al proceso hijo. El hijo cambia el file offset y los open file status flag del archivo temporal y finalmente hace un exit. Luego, el padre recupera el file offset y flags para verificar que puede ver los cambios realizados por el proceso hijo.
    
    Si bien es útil que dos procesos puedan escribir en un mismo archivo, si no aplicamos técnicas de sincronización, no hay garantías de que el contenido de lo que escribe un proceso no se mezcle con lo que está escribiendo otro. Es conveniente el uso de `wait` para que el padre espere hasta que termine el hijo*.*
    
- Cómo evitar compartir file descriptors entre procesos
    
    Básicamente, luego del `fork` cerrar aquellos `fd` innecesarios.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4154ba56-f588-4ee4-9af2-78e83c8622ea/Untitled.png)
    

## _Semántica de la memoria de fork_

Dijimos que conceptualmente, `fork` clonaba los segmentos de código, dato, pila y heap del proceso padre. Sin embargo, realizar una copia de la memoria virtual del padre en el nuevo proceso hijo sería muy costoso.

- Razón por la cuál sería muy costoso
    
    Una razón esta basada en el hecho de que es muy probable que un `fork` sea seguido inmediatamente por un `exec` . En otras palabras, el hijo suele ejecutar inmediatamente otro programa.
    
    Nos estaríamos deshaciendo de las páginas que copiamos y remplazándolas (creando nuevas páginas) con las del nuevo programa reiniciando los segmentos de código, datos, heap, y pila.
    
    Con esto queremos decir que la copia de las páginas del padre fue innecesaria.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/90a2ff01-a36d-44c2-a239-2f50f0649078/Untitled.png)
    

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/31666db3-579d-49c5-a022-c5400e008430/Untitled.png)

Conceptualmente, `fork` marca como read-only a las páginas del proceso padre y hace que el hijo referencie esas mismas páginas en memoria virtual.

En el momento de querer hacer un `write` en alguna de las páginas compartidas que hacen referencia al segmento de datos, heap o pila se fragmentará la memoria para asignar un espacio con el contenido del padre y otro espacio con el contenido del hijo.

Para eso las páginas deben estar marcadas con un `copy-on-write`(genera una excepción cuando se quiera escribir en una página compartida, pues si un proceso la escribe entonces los dos procesos verán la modificación). Entonces cuando uno desea escribir, se frenan los procesos, se hace la copia en memoria física de esa página, se separa a donde apuntan las páginas virtuales, se quita la marca de `copy-on-write` y se reanudan ambos procesos. Frenar ambos procesos es importante para resolver problemas de concurrencia.

El `copy on write` funciona como una manera de poder reducir el costo a nivel memoria que produciría el `fork`.

_Referencias:_

[https://www.youtube.com/watch?v=ViUwLytKzTY](https://www.youtube.com/watch?v=ViUwLytKzTY)

## Controlar memory footprint de un proceso

Podemos combinar el uso de `fork` y `wait` para controlar memory footprint de un proceso. La memory footprint del proceso es el rango de páginas de memoria virtual utilizadas por el proceso, que se ve afectado por factores tales como el ajuste de la pila a medida que las funciones se llaman y retornan, las llamadas a `exec` y, de particular interés para este ejemplo, la modificación del heap como consecuencia de las llamadas a _malloc()_ y _free()._

```c
#define _BSD_SOURCE
#include <sys/wait.h>
static func(int arg) {
	int j;
	for(j=0; j<0x100; j++){
		if(malloc( 0x8000 == NULL)){
				errExit("malloc");
				printf("Program break in child: %10p\\n",sbrk(0));
		}
	}
	return arg;
}

int main(int argc, char *argv[]){

	int arg = (argc>1)? getInt(argv[1}, 0, "arg") : 0;

	pid_t childPid; 	int status;

	setbuf(stdout, NULL); /* Disable buffering of stdout */

	childPid = fork();

	if (childPid == -1)
		errExit("fork");

	if (childPid == 0) /* Child calls func() and */
		exit(func(arg)); /* uses return value as exit status */

	/* Parent waits for child to terminate. It can determine the
	result of func() by inspecting 'status'. */
	if (wait(&status) == -1)
		errExit("wait");

	printf("Program break in parent: %10p\\n",sbrk(0));	
	printf("Status = %d %d\\n", status, WEXITSTATUS(status));
	exit(EXIT_SUCCESS);
}

```

La memoria que se reserva en la función _func_ no se libera nunca, existen memory leaks por cada llamado a función. Toda la memoria que se reserva, se reserva en el contexto del hijo. Mientras el hijo logre terminar, el proceso padre no se verá afectado.

Después de ejecutar el código de _func_, sabemos que la memory footprint del padre no ha cambiado desde el punto antes de llamar a la función ya que todos los cambios posibles habrán ocurrido en el proceso hijo. Esto trae algunas ventajas:

- Si sabemos que _func_ genera memory leaks o una fragmentación excesiva del heap, esta técnica elimina el problema porque nunca se toca la memoria del padre.
- Supongamos que por algún motivo necesitamos llamar a una función que aloca memoria dinámica pero no la libera. Podríamos codificar una función para realizar las llamadas a free. Sin embargo, en algunos casos, es más simple emplear esta técnica que permite “retroceder” manteniendo la memory footprint original del padre, que es el que necesitaba llamar a la función (`exit` libera los recursos).

# VFork

Al igual que `fork`, `vfork` crea un nuevo proceso secundario. Sin embargo, `vfork` está expresamente diseñado para ser utilizado en programas donde el proceso hijo realiza un `exec` de manera inmediata por cómo esta implementado.

Dos características distinguen a `vfork` de `fork` y la hacen más eficiente:

1. No se realiza ninguna duplicación de páginas de memoria virtual o tablas de páginas para el proceso hijo. En cambio, el hijo comparte la memoria del padre hasta que realiza un `exec` o llama a `_exit` para terminar.
2. La ejecución del proceso padre se suspende hasta que el hijo haya realizado una `exec` o `_exit`.

```c
#include <unistd.h>

/* 
** In parent: returns process ID of child on success 
** –1 on error.
** In successfully created child: always returns 0 
*/
pid_t vfork(void);

```

Dado que proceso hijo está utilizando la memoria del padre (concurrencia), cualquier cambio realizado por el hijo en los segmentos de datos, pila o heap será visible para el elemento padre una vez que se reanude. Además, si el hijo retornara de una función entre el llamado a `vfork` y un `exec` o `_exit` posterior, esto también afectará al padre.

Por ejemplo, si el hijo modifica una variables `static`, el padre también lo nota

- Qué operación podría realizar el hijo sin que afecte al padre.
    
    Hay algunas cosas que el proceso hijo puede hacer entre `vfork` y `exec` sin afectar al padre. Entre estos se encuentran operaciones en `fd` abiertos (pero no stdio file streams). Dado que la tabla de descriptores de archivos para cada proceso se mantiene en kernel space y se duplica durante `vfork`, el hijo puede realizar operaciones con `fd` sin afectar al proceso principal.
    
- Ejemplo
    
    Con el siguiente ejemplo podemos ver como el proceso hijo comparte la memoria del padre, y que el padre se suspende hasta que el hijo termina o llama a `exec`. Cuando ejecutamos este programa, vemos la siguiente salida:
    
    ```bash
    $ ./t_vfork
    Child executing  # Even though child slept, parent was not scheduled
    Parent executing
    istack=666
    ```
    
    Podemos ver que el cambio realizado por el hijo a la variable `istack` se realizó también en la variable del padre.
    
    ```c
    
    int main(int argc, char *argv[])
    {
    	int istack = 222;
    
    	switch (vfork()) {
    
    		case -1:
    						errExit("vfork");
    
    		case 0: /* Child executes first, in parent's memory space */
    
    						sleep(3); /* Even if we sleep for a while,
    													parent still is not scheduled */
    
    						write(STDOUT_FILENO, "Child executing\\n", 16);
    						istack *= 3; /* This change will be seen by parent */
    						_exit(EXIT_SUCCESS);
    
    		default: /* Parent is blocked until child exits */
    						write(STDOUT_FILENO, "Parent executing\\n", 17);
    						printf("istack=%d\\n", istack);
    						exit(EXIT_SUCCESS);
    	}
    }
    ```
    

_Nota:_ Excepto donde la velocidad es absolutamente crítica, los programas deben evitar el uso de `vfork` en favor de `fork`. Esto se debe a que, cuando se implementó `fork` usando semántica de `copy-on-write`, su velocidad se aproximó a la de `vfork` permitiendo evitar los comportamientos excéntricos previamente descriptos.

# Condición de carrera

Después de un `fork`, es indeterminado qué proceso será elegido por Scheduler y tendrá acceso a la CPU. Sin embargo, en un sistema multiprocesador, ambos podrían acceder simultáneamente a un core de la CPU.

Las aplicaciones que se basan implícita o explícitamente en una secuencia particular de ejecución para lograr resultados correctos están sometidas a fallas debido a las **condiciones de carrera**.

Existen versiones de Linux donde le dan prioridad a un proceso antes que al otro. No está bien visto que nuestro código dependa del Scheduler o de un proceso o el otro porque el comportamiento podría ser distinto en distintos SO (i.e. no es portable).

- Ejemplo basado en este último comentario
    
    ```c
    #include <sys/wait.h>
    
    int main(int argc, char *argv[])
    {
    	int numChildren, j;
    	pid_t childPid;
    	if (argc > 1 && strcmp(argv[1], "--help") == 0)
    			usageErr("%s [num-children]\\n", argv[0]);
    
    	numChildren = (argc > 1) ? getInt(argv[1], GN_GT_0, "num-children") : 1;
    
    	setbuf(stdout, NULL); /* Make stdout unbuffered */
    
    	for (j = 0; j < numChildren; j++) {
    		switch (childPid = fork()) {
    			case -1:
    							errExit("fork");
    			case 0:
    							printf("%d child\\n", j);
    							_exit(EXIT_SUCCESS);
    			default:
    							printf("%d parent\\n", j);
    							wait(NULL); /* Wait for child to terminate */
    							break;
    		}
    	}
    	exit(EXIT_SUCCESS);
    }
    ```
    

Concluimos que si necesitamos garantizar un orden en particular, necesitamos usar alguna técnica de sincronización.

## _Evitando la condición de carrera usando señales_

Después de un `fork`, si cualquiera de los procesos necesita esperar a que el otro complete una acción, entonces el proceso activo puede enviar una señal después de haber completado la acción mientras que el otro proceso espera la señal.

Es posible lograr que los procesos se envíen múltiples veces señales para coordinar sus acciones. Sin embargo, esta coordinación es mejor hacerla usando semáforos, file locks, o message passing.

- Ejemplo
    
    Para este ejemplo vamos a asumir que es el padre el que debe esperar a que el hijo termine para poder accionar.
    
    ```bash
    # Output
    $ ./fork_sig_sync
    [17:59:02 5173] Child started - doing some work
    [17:59:02 5172] Parent about to wait for signal
    [17:59:04 5173] Child about to signal parent
    [17:59:04 5172] Parent got signal
    ```
    
    ```c
    #include <signal.h>
    #include "curr_time.h" /* Declaration of currTime() */
    #include "tlpi_hdr.h"
    #define SYNC_SIG SIGUSR1 /* Synchronization signal */
    
    static void /* Signal handler - does nothing but return */
    handler(int sig)
    {
    
    }
    
    int main(int argc, char *argv[])
    {
    	pid_t childPid;
    	sigset_t blockMask, origMask, emptyMask;
    	struct sigaction sa;
    
    	setbuf(stdout, NULL); /* Disable buffering of stdout */
    
    	sigemptyset(&blockMask);
    	sigaddset(&blockMask, SYNC_SIG); /* Block signal */
    
    	if (sigprocmask(SIG_BLOCK, &blockMask, &origMask) == -1)
    			errExit("sigprocmask");
    
    	sigemptyset(&sa.sa_mask);
    	sa.sa_flags = SA_RESTART;
    	sa.sa_handler = handler;
    	if (sigaction(SYNC_SIG, &sa, NULL) == -1)
    			errExit("sigaction");
    
    	switch (childPid = fork()) {
    		case -1:
    						errExit("fork");
    		case 0: /* Child */
    					/* Child does some required action here... */
    					printf("[%s %ld] Child started - doing some work\\n",
    					currTime("%T"), (long) getpid());
    					sleep(2); /* Simulate time spent doing some work */
    										/* And then signals parent that it's done */
    					printf("[%s %ld] Child about to signal parent\\n",
    												currTime("%T"), (long) getpid());
    					
    					if (kill(getppid(), SYNC_SIG) == -1)
    								errExit("kill");
    					/* Now child can do other things... */
    					_exit(EXIT_SUCCESS);
    
    		default: /* Parent */
    		/* Parent may do some work here, and then waits for child to
    		complete the required action */
    		printf("[%s %ld] Parent about to wait for signal\\n",
    							currTime("%T"), (long) getpid());
    
    		sigemptyset(&emptyMask);
    
    		if (sigsuspend(&emptyMask) == -1 && errno != EINTR)
    						errExit("sigsuspend");
    
    		printf("[%s %ld] Parent got signal\\n", currTime("%T"), (long) getpid());
    		
    		/* If required, return signal mask to its original state */
    		if (sigprocmask(SIG_SETMASK, &origMask, NULL) == -1)
    					errExit("sigprocmask");
    
    		/* Parent carries on to do other things... */
    		exit(EXIT_SUCCESS);
    	}
    }
    ```
    

# Terminar un proceso: _exit() y exit()

Hay dos maneras de finalizar un proceso. Uno de ellos es la terminación anormal, provocada por la entrega de una señal cuya acción predeterminada es terminar el proceso. Alternativamente, un proceso puede terminar normalmente, usando la syscall `_exit`.

```c
#include <unistd.h>

void _exit(int status);
```

```c
#include <stdlib.h>

void exit(int status);
```

Los programas no suelen llamar directamente a `_exit` sino que llaman a la función de librería estándar de C `exit`.

> The following actions are performed by _exit_:

- Exit handlers (functions registered with atexit and on_exit) are called, in reverse order of their registration.
- The stdio stream buffers are flushed.
- The _exit system call is invoked, using the value supplied in status.

> As part of both normal and abnormal process termination, the kernel performs various cleanup steps. Terminating a process normally by calling exit additionally causes exit handlers registered using atexit() and on_exit() to be called (in reverse order of registration), and causes stdio buffers to be flushed.

# Orphans and zombies

**¿Quién se convierte en el padre de un _proceso huérfano_?**

El _proceso huérfano_ es adoptado por `init`.

`Init` es el ancestro de todos los procesos y su process ID es 1.

<aside> 📢 Una buena forma de chequear si el padre de un proceso hijo “sigue vivo” es preguntar si _getppid_ devuelve 1.

</aside>

**¿Qué pasa cuando un proceso hijo termina antes que el proceso padre?**

El kernel transforma al proceso hijo en un _proceso zombi_.

Esto significa que la mayoría de los recursos que tiene el proceso hijo se liberan para que otros procesos los reutilicen. La única parte del proceso hijo que queda almacenada es una entrada en la tabla de procesos del kernel que registra (entre otras cosas) el _process ID_ del hijo, el _exit status_ y las estadísticas de uso de recursos.

<aside> 📢

Un proceso zombi no puede recibir una señal de _kill_ para que sea eliminado de la lista de procesos. De esta forma garantizamos que el padre pueda hacer un _wait_ en algún momento.

</aside>

---

Cuando el padre ejecuta el `wait` **el kernel remueve el zombi de la tabla de procesos del kernel retornando el _exit status_ del proceso hijo. Si el padre nunca ejecutara un `wait` y finalizara su ejecución, el hijo queda huérfano y es adoptado por `init` quien automáticamente ejecuta un `wait` para removerlo de la tabla de procesos del kernel.

Si un padre crea un hijo pero la llamada a wait falla, entonces se mantendrá de manera indefinida una entrada en la tabla del procesos del kernel. Si esto ocurriera con varios hijos, tendríamos múltiples hijos zombis que ocuparan muchas entradas en esta tabla impidiendo la creación de nuevos procesos. Como los zombis no se pueden “matar” con una señal, la única forma de eliminar estas entradas es “matando” al padre o esperar a que este haga un
`exit` . De esta forma todos los zombis (ahora huerfanos tambien) serán adoptados por
 `init` quien se encargara de eliminarlos de la tabla.

 