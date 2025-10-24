Antes, el sistema operativo no estaba capacitado para manejar hilos. Cuando surgió el concepto de hilos, se creo una librería, `pthread`, que permitió administrar los hilos a nivel de usuario. Es decir, que cuando se despachaban procesos de usuario y el SO les daba un tiempo para que corran, por atrás esta librería (manejada por el usuario) se encargaba de asignarle un slot de tiempo a un hilo (o varios si los anteriores finalizan) dentro del tiempo que le asigno el SO a dicho proceso.

Mas adelante, el sistema operativo empezó a poder administrar los hilos y podia asignarles un slot de tiempo en el cual tenían la oportunidad de ejecutarse (en vez de asignárselo a un proceso para que ejecute un hilo con ayuda de la librería `pthread`).

En resumen, en los sistemas operativos modernos, cuando tenemos hilos a nivel de kernel, el kernel le asigna los slot de tiempo a los hilos (i.e. se despachan hilos). Cuando tenemos hilos a nivel de usuario, el kernel le asigna un tiempo al proceso para que luego la librería le asigne el tiempo a un hilo (i.e. se despachan procesos).

¿Como es la diferencia en la asignación de tiempos en cada uno de los casos?

Cuando tenemos hilos a nivel de kernel, como el kernel le asigna los tiempos directamente a los hilos, es mas probable que la distribución de tiempos entre hilos se mas equitativa.

Un proceso que tiene muchos hilos va a tener mas slots de tiempo asignado que un proceso que tenga menos hilos (porque el tiempo se le asigna a los hilos directamente).

En cambio, a nivel de usuario, como el tiempo se le asigna directamente al proceso, todos los procesos van a correr la misma unidad de tiempo independientemente de la cantidad de hilos que ejecuten cada uno. Si tenemos 5 hilos en un proceso, en vez de tener en la cola de listos 5 hilos distribuidos para correr, estamos despachando un proceso al que se le dará el turno para correr quizás al menos un hilo.

Por lo tanto, la distribución de tiempos a nivel kernel es injusta respecto de la de usuarios porque se pueden despachar muchos mas hilos a nivel de kernel que a nivel de usuario.

# Introducción

Existen aplicaciones como web servers que reciben requerimientos de varios clientes y deben dar una respuestas a todos ellos. Esta respuesta se traduce en la creación de un hijo para que se ocupe de dar la respuesta. Esto permite una mayor escalabilidad del servidor.

En resumen, es un ejemplo de una aplicación que crea millones de hijos.

La creación de procesos con `fork` es relativamente costosa. Incluso con la técnica de `copy-on-write`, la necesidad de duplicar varios atributos de proceso, como tablas de páginas y tablas descriptores de archivos significa que una llamada a `fork` consume mucho tiempo y espacio.

Otro de los problemas que trae `fork` es que es difícil compartir información entre procesos dado que el padre y el hijo no comparten la memoria.

¿Existirá alguna alternativa?

# Hilos (Threads)

## _Overview_

Al igual que los procesos, los **hilos** son un mecanismo que permite a una aplicación llevar a cabo varias tareas al mismo tiempo.

Un proceso puede contener múltiples hilos en ejecución (y no al revés). Todos estos hilos ejecutan el mismo programa de manera independiente y todos comparten la misma memoria global, incluidos los datos inicializados, los datos no inicializados y el segmento de heap.

Si no existe una dependencia entre los hilos, decimos que podemos “paralelizar el trabajo”.

<aside> 🔑 Los hilos no tienen una relación jerárquica a diferencia de los procesos (ver _pthread_join_).

</aside>

![Esta imagen corresponde a hilos a nivel de usuario, donde la librería pthread se encarga de manejar y asignar slots de tiempo para cada hilo dentro de un proceso.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5da4d5d7-b8f5-4dcb-95c3-b3af2e44e2ac/Untitled.png)

Esta imagen corresponde a hilos a nivel de usuario, donde la librería pthread se encarga de manejar y asignar slots de tiempo para cada hilo dentro de un proceso.

¿Cómo pueden solucionar los threads los dos problemas mencionados al inicio?

> Sharing information between threads is easy and fast. It is just a matter of copying data into shared (global or heap memory) variables. However, in order to avoid the problems that can occur when multiple threads try to update the same information, we must employ the synchronization techniques described in Chapter 30.

> Thread creation is faster than process creation, typically, ten times faster or better. On Linux, threads are implemented using the `clone` system call. Thread creation is faster because many of the attributes that must be duplicated in a child created by `fork` are instead shared between threads. In particular, `copy-on-write` duplication of pages of memory is not required, nor is duplication of page tables.

- _**Lista de atributos que comparten los hilos**_
    
    - Process ID and parent process ID.
    - Process group ID and session ID.
    - Controlling terminal.
    - Process credentials (user and group IDs).
    - Open file descriptors.
    - Record locks created using _fcntl()._
    - Signal dispositions.
    - File system–related information: umask, current working directory, and root directory.
    - Interval timers (_setitimer()_) and POSIX timers (_timer_create()_).
    - Resource limits.
    - CPU time consumed (as returned by _times()_).
    - Resources consumed (as returned by _getrusage()_).
    - Nice value (set by _setpriority()_ and _nice()_).
    
    _Los más importantes son:_
    
    - Mapa de memoria (sección de código, sección de datos, shmem).
    - Ficheros abiertos.
    - Señales, semáforos y temporizadores.
    - Process ID and parent process ID.
    - Process group ID and session ID.
- _**Lista de atributos que no comparten**_
    
    - Thread ID.
    - Contador de programa.
    - Conjunto de registros.
    - Stack.
    - Signal mask.
    - errno.
- _**Beneficios de los hilos**_
    
    - _Capacidad de respuesta:_ mayor interactividad al separar las interacciones con el usuario de las tareas de procesamientos en distintos threads.
    - _Recursos compartidos:_ los threads comparten la mayor parte de los recursos de forma automática.
    - _Economía de recursos:_ crear un proceso consume mucho más tiempo que crear un thread.
    - _Utilización sobre arquitecturas multiprocesador:_ al asignar distintos threads a distintos procesadores obtenemos un mayor nivel de concurrencia.

---

_Threads library:_ permite el manejo de hilos dentro de un proceso. Se utilizó en las primeras implementaciones de hilos, en las que el SO no estaba preparado para manejar hilos (ULT). Luego, los SO paso a reconocer los hilos (KLT).

→ _ULT:_ User level threads.

→ KLT: Kernel level thread.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/67c83c52-0dc3-49e2-99b0-6eb66a7dfc63/Untitled.png)

# Pthread API

En Linux la librería para los _ULT_ se llama _**pthread**_.

Todos los programas que usen esta API deben compilarse con el siguiente flag:

```bash
-pthread
```

- Las funciones de la API que no son `void` retornan 0 en caso de éxito, sino retornan un numero positivo.
- Cada hilo maneja su propio valor de errno.

## _Pthread data types_

La API define una serie de tipos de datos, algunos de ellos son:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a3af4d87-d4c5-4a67-8d69-6682128f1185/Untitled.png)

## _Creación de un hilo_

Cuando se inicia un programa, el proceso resultante consiste en un solo _thread_, llamado _initial thread_ o _initial._ A partir de él se crean otros hilos con la siguiente función.

```c
#include <pthread.h>

// Returns 0 on success, or a positive error number on error
int pthread_create(pthread_t * thread , const pthread_attr_t * attr ,
											void *(* start )(void *), void * arg );
```

- El nuevo hilo comienza su ejecución llamando a la función que se pasa en _**start**_ mientras que el hilo que llamo a _pthread_create_ continua con su ejecución.
- _**arg**_ corresponde a los argumentos de la función _**start**_. Por lo general es un puntero a una estructura que contiene los argumentos de interés separados en campos.
- _**thread**_ apunta a un búfer de tipo _pthread_t_ en el que se copia el identificador único para este nuevo hilo antes de que _pthread_create_ retorne.
- _**attr**_ es un puntero a una estructura de tipo _pthread_attr_t_ que especifica varios atributos del nuevo hilo. Si fuera NULL, por default se seleccionan ciertos atributos.

<aside> 📌 Luego de un llamado a _pthread_create_ no hay garantías de que hilo será el próximo en ejecutarse.

</aside>

- Ejemplo de uso con _**attr**_
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bf652e9e-9f42-4139-b7b4-2b9710c76d90/Untitled.png)
    

## _Finalización de un hilo_

La ejecución de un hilo finaliza de alguna de las siguientes formas:

- La función _start_ del thread creado **retorna un valor especifico.
- El thread creado llama a _pthread_exit._
- El thread es cancelado, llama a _pthread_cancel._
- El thread creado hace un _exit_ o el main thread hace un _exit_ provocando que todos los hilos del proceso terminen.

```c
#include <pthread.h>

void pthread_exit(void * retval);
```

- _**retval**_ especifica el valor de retorno para el thread. Este valor no se debe alojar en el stack del thread porque el contenido de ese stack es indefinido cuando este termine.

Llamar a _pthread_exit_ en la funcion _start_ es equivalente a hacer un return. La diferencia es que _pthread_exit_ puede llegar a ser llamada desde alguna función que hayamos invocado en start.

<aside> 💡 Si el _main thread_ llama a _pthread_exit_ en vez de llamar a _exit_ o hacer un _return_, los otros threads continúan ejecutándose.

</aside>

## _Threads IDs_

Dijimos que un proceso puede contener múltiples hilos en ejecución.

Cada uno de esos threads del proceso se identifica con un único **thread ID**. Este ID se retorna al que llame a la funcion _pthread_create_. Un thread puede conocer su ID llamando a:

```c
#include <pthread.h>

// Retorna el thread ID de aquel thread que invoque dicha funcion
pthread_t pthread_self(void);
```

¿Por qué es útil el thread ID?

- Varias funciones de Pthread utilizan el thread ID para identificar el hilo sobre el cual quieren actuar. Por ejemplo, para hacer un join, detach, cancel o kill.
- Puede ser útil para taggear estructuras de datos. De esta forma podemos marcar que dicha estructura de datos pertenece a un hilo, o bien que un hilo particular debe hacer algo con dicha estructura de datos.

Podemos chequear si dos thread IDs son iguales con la siguiente función:

```c
#include <pthread.h>

// Retorna 0 si los IDs son iguales. Sino retorna un valor distinto de cero.
int pthread_equal(pthread_t t1, pthread_t t2);
```

Esta función es necesaria porque el tipo de dato _pthread_t_ debe tratarse como [_opaque data_](https://duckduckgo.com/?q=opaque+data&t=brave&ia=web). En Linux, _pthread_t_ se define como un _unsigned int_, pero en otras implementaciones, podría ser un puntero o una estructura, etc.

## _Joining with a terminated thread_

La función _pthread_join_ espera que finalice la ejecución de un thread en particular. En el caso de que el hilo hubiera finalizado antes de que se llamara a la funcion, _pthread_join_ retorna de inmediato.

```c
#include <pthread.h>

// Retorna 0 en caso de exito y valores positivos en caso de error.
int pthread_join(pthread_t thread, void **retval);
```

- _**thread**_ representa el thread ID.
- Si _**retval**_ no es un puntero a null, entonces recibe una copia del valor de retorno del thread cuando este finalizó su ejecución luego de llamar a _pthread_exit_ o hacer un return.

Si a un thread no se le hace un _detach_, entonces **sí o sí debemos hacerle un _join_. En el caso de no hacerlo, estaríamos generando el equivalente a un proceso zombi.

<aside> 💡 No llamar a _phtread_join_ para un hilo al que ya se le hizo un _join,_ pues el resultado de hacer esto es impredecible.

</aside>

- **Extra:** _pthread_join_ vs _waitpid_
    
    La tarea que lleva a cabo la función _pthread_join_ para los hilos es similar a la de _waitpid_ para los procesos. Sin embargo existen algunas diferencias:
    
    1. Los threads son pares a diferencia de los procesos que poseen una relación jerárquica. Si un thread A crea un thread B que a su vez crea el thread C, el thread A puede hacer un _join_ con el thread C o viceversa. Esto no es posible con los procesos ya que el único que puede hacer el _wait_ es el padre.
    2. No hay forma de decirle a un thread que se una con cualquier thread a diferencia de los procesos donde podíamos ejecutar _waitpid ;_ tampoco hay forma de ejecutar un _nonblocking join_ (_waitpid_ y `WHOHANG` flag). Sin embargo. es posible obtener un comportamiento similar usando variables de condición.

## _Ejemplo de creación y join de un thread_

- Ejemplo
    
    El siguiente programa crea otro hilo para luego hacer un join.
    
    ```c
    #include <pthread.h>
    
    static void * threadFunc(void *arg) {
    	 char *s = (char *) arg;
    	 printf("%s", s);
    	 return (void *) strlen(s);
    }
    
    int main(int argc, char *argv[]) {
    	 pthread_t t1;
    	 void *res;
    	 int s;
    
    	 s = pthread_create(&t1, NULL, threadFunc, "Hello world\\n");
    
    	 if (s != 0)
    		 errExitEN(s, "pthread_create");
    
    	 printf("Message from main()\\n");
    	 s = pthread_join(t1, &res);
    	 if (s != 0)
    		 errExitEN(s, "pthread_join");
    
    	 printf("Thread returned %ld\\n", (long) res);
    
    	 exit(EXIT_SUCCESS);
    }
    ```
    
    El output de este programa puede variar dependiendo del scheduler.
    
    ```bash
    $ ./simple_thread
    Message from main()
    Hello world
    Thread returned 12
    ```
    

## _Separar hilos (detach)_

Por default, un thread es _joinable._ Es decir, que cuando termina, otro thread puede obtener su valor de retorno usando _pthread_join._

Sin embargo, no siempre nos importa saber el valor de retorno de un thread. En este caso, podemos marcar a un thread como _detached_ llamando a la siguiente función:

```c
#include <pthread.h>

// Retorna 0 en caso de éxito y valores positivos en caso de error
int pthread_detach(pthread_t thread);
```

Un thread se puede auto marcar como _deteched_ usando la siguiente sentencia:

```c
pthread_detach(pthread_self());
```

Una vez que un thread fue separado (fue marcado como detached), el thread ya no posee más el atributo de _joinable_ y no se puede hacer uso de la función _pthread_join_.

<aside> ‼️ Separar un hilo no lo hace inmune a una llamada a _exit_ en otro hilo o a un retorno en el hilo principal. En tal caso, todos los threads del proceso finalizan inmediatamente, independientemente de si se pueden unir (_joinable_) o separar (_detach_). Para decirlo de otra manera, _pthread_detach_ simplemente controla lo que sucede después de que un hilo termina, no cómo o cuándo termina.

</aside>

# Hilos vs Procesos

Ventajas de un enfoque multithread:

- Los datos se pueden compartir fácilmente. En cambio, compartir datos entre procesos requiere un poco más de trabajo (shared memory segment o pipes).
- La creación de los hilos es más rápida que la creación de los procesos. El tiempo que tarda en efectuarse un context-switch puede ser más bajo en los hilos que en los procesos.

Desventajas de utilizar hilos en vez de procesos:

- Cuando programamos con threads, nos tenemos que asegurar que las funciones que llamemos sean _threads-safe_ o que sean llamadas de una manera segura. En cambio, para los procesos, solamente tenemos que hacer ciertas validaciones.
    
    - Ejemplo de una función no _thread-safe_
        
        La función no es thread safe porque se usa una variable global que se actualiza concurrentemente. Para esto vamos a ver _mutex_ y _context variables_.
        
        ```c
        #include <pthread.h>
        
        static int glob=0;
        pthread_t tld[2];
        
        void* doSomeThing(void * arg) {
        
        	unsigned long int l = 0;
        	pthread_t ld = pthread_self();
        	
        	if (pthread_equal(ld, tld[0]))) {
        		printf("\\n First thread processing \\n");
        	}
        	else {
        		printf("\\n Second thread processing \\n");
        	}
        	
        	int loc, j;
        	int loops = 1000000;
        	
        	for (j = 0 ; j < loops ; j++) {
        		loc = glob;
        		loc++;
        		glob = loc;
        	}
        	
        	for (l = 0 ; l<(0xFFFFFFF) ; l++);
        	
        	printf("\\n Thread ended \\n");
        	return NULL;
        }
        
        int main(void){
        	int i=0;
        	int err;
        
        	while(i < 2){
        		err = pthread_create( &(tld[i]), NULL, &doSomeThing, NULL);
        		if(err != 0)
        			printf("\\n Can't create thread: [%s]", strerror(err));
        		else
        			printf("\\n Thread created successfully");
        
        		i++;
        	}
        
        	sleep(10);
        	printf("Glob = %i", glob);
        	return 0;
        }
        ```
        
- Un bug en un thread puede dañar a todos los threads del proceso ya que todos comparten el mismo espacio de direcciones y otros atributos. Por el contrario, los procesos están mas aislados unos de otros.
    
- Cada thread compite por el uso del espacio finito de direcciones virtuales del proceso host. En particular, el stack de cada thread y su almacenamiento local consume direcciones virtuales del proceso que no estarán disponibles para otros threads. Si bien el espacio de direcciones virtuales disponible es grande, este factor puede ser una limitación significativa para los procesos que emplean una gran cantidad de threads o threads que requieren grandes cantidades de memoria. Por el contrario, cada uno de los procesos separados puede utilizar la memoria virtual disponible (sujeto a las limitaciones de RAM y _swap_ _space_).
    

Puntos que pueden influir en nuestra elección de threads vs procesos:

- Lidiar con señales en aplicaciones multithread es muy complicado, por lo general se evita usar señales para programas multithread.
- En una aplicación multithread, todos los threads deben estar corriendo el mismo programa. En una aplicación multiproceso, diferentes procesos pueden correr diferentes programas.
- Aparte de los datos, los hilos comparten otra información (file descriptors, signal dispositions, current working directory y user and group IDs). Esto puede ser una ventaja o desventaja dependiendo de la aplicación.
