# Procesos productores y consumidores

_Referencias:_

[Producer - Consumer Problem in Multi-Threading](https://www.youtube.com/watch?v=l6zkaJFjUbM)

- Codigo
    
    ```c
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>
    #include <pthread.h>
    #include <unistd.h>
    #include <time.h>
    #include <semaphore.h>
    
    #define THREAD_NUM 10
    
    sem_t semEmpty;
    sem_t semFull;
    
    pthread_mutex_t mutexBuffer;
    
    int buffer[10];
    int count = 0;
    
    void* producer(void* args) {
        while (1) {
            // Produce
            int x = rand() % 100;
            sleep(1);
    
            // Add to the buffer
            sem_wait(&semEmpty);
            pthread_mutex_lock(&mutexBuffer);
            buffer[count] = x;
            count++;
            pthread_mutex_unlock(&mutexBuffer);
            sem_post(&semFull);
        }
    }
    
    void* consumer(void* args) {
        while (1) {
            int y;
    
            // Remove from the buffer
            sem_wait(&semFull);
            pthread_mutex_lock(&mutexBuffer);
            y = buffer[count - 1];
            count--;
            pthread_mutex_unlock(&mutexBuffer);
            sem_post(&semEmpty);
    
            // Consume
            printf("Got %d\\n", y);
            sleep(1);
        }
    }
    
    int main(int argc, char* argv[]) {
        srand(time(NULL));
        pthread_t th[THREAD_NUM];
        pthread_mutex_init(&mutexBuffer, NULL);
        sem_init(&semEmpty, 0, 10);
        sem_init(&semFull, 0, 0);
        int i;
        for (i = 0; i < THREAD_NUM; i++) {
            if (i % 2 == 0) {
                if (pthread_create(&th[i], NULL, &producer, NULL) != 0) {
                    perror("Failed to create thread");
                }
            } else {
                if (pthread_create(&th[i], NULL, &consumer, NULL) != 0) {
                    perror("Failed to create thread");
                }
            }
        }
        for (i = 0; i < THREAD_NUM; i++) {
            if (pthread_join(th[i], NULL) != 0) {
                perror("Failed to join thread");
            }
        }
        sem_destroy(&semEmpty);
        sem_destroy(&semFull);
        pthread_mutex_destroy(&mutexBuffer);
        return 0;
    }
    ```
    

# Sincronización de hilos

## _Overview_

En este apunte vamos a describir dos métodos que podemos usar para sincronizar los hilos: mutex y variables de condición.

**Mutex** permite que los hilos sincronicen su uso de un recurso compartido para que, por ejemplo, un thread no intente acceder a una variable compartida al mismo tiempo que otro thread la modifica.

Las **variables de condición** tienen un rol más complementario: permiten que los threads se informen entre sí que una variable compartida (u otro recurso compartido) fue modificada.

# Mutex

Mencionamos en el apunte de [hilos](https://www.notion.so/Hilos-Pthreads-4bad14080ccf4177bc3371bb274564ea?pvs=21) que una de las ventajas de utilizarlos es que podían compartir información a través de variables globales.

Sin embargo, podría ocurrir que varios hilos intenten modificar la misma variable global al mismo tiempo, o que un hilo quiera leer una variable global mientras otro al mismo tiempo la intenta modificar. En resumen, podemos tener problemas de concurrencia en una sección de código donde los hilos comparten recursos.

Nos gustaría lograr que la ejecución de esa sección de código (región crítica) sea atómica para cada hilo, es decir, que el acceso a dicho recurso compartido no sea interrumpido por otro hilo que en el mismo momento quiere hacer uso del mismo. Para esto usamos mutex.

_**Mutex:**_

- Se emplea para obtener acceso exclusivo a recursos compartidos y para “serializar” el acceso a la región critica de manera exclusiva.
- Sólo un hilo puede tener acceso simultáneamente al mutex.
- Mutex tiene dos estados.
    - **lock(m) o _acquire_:**
        - Intenta bloquear el mutex **m.**
        - Si el mutex ya está bloqueado el hilo se suspende.
    - **unlock(m) o _release_:**
        - Desbloquea el mutex **m.**
        - Si existen hilos bloqueados en el mutex se desbloquea a uno.

<aside> 📢 Cuando un thread hace un `lock` del mutex, se convierte en el dueño del mutex. Solamente él puede hacer un `unlock` del mutex.

</aside>

Cada hilo emplea el siguiente protocolo para acceder al recurso compartido:

- El hilo hace un lock del mutex.
- El hilo accede al recurso.
- El hilo hace un unlock del mutex.

Mientras tanto, el hilo que no puede acceder al recurso, espera.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d70fb668-19e8-4797-a955-7bdcb9843b85/Untitled.png)

_Referencias:_

[What is a mutex in C? (pthread_mutex)](https://www.youtube.com/watch?v=oq29KUy29iQ)

## _Mutex estáticos y dinámicos_

Mutex se puede asignar en una variable estática o dinámica.

El mutex es una variable de tipo `pthread_mutex_t` que debe ser inicializada siempre antes de ser utilizada.

Para el caso de que sea una variable estática, debemos hacer lo siguiente:

```c
#include <pthread.h>

pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
```

En el caso de que sea una variable dinámica, luego de hacer un `malloc` podemos hacer:

```c
#include <pthread.h>

// Retorna 0 en caso de exito, cualquier otro valor indica error.
int pthread_mutex_init (pthread_mutex_t *__mutex,
			       const pthread_mutexattr_t *__mutexattr)
```

y luego debemos hacer uso de:

```c
#include <pthread.h>

// Retorna 0 en caso de exito, cualquier otro valor indica error.
int pthread_mutex_destroy(pthread_mutex_t *mutex);
```

## _Lock y unlock de mutex_

No importa si elegimos la opción de asignar el mutex de manera dinámica o estática, este se inicializa _unlocked_. Para hacer un lock o unlock utilizamos las siguientes funciones de la API:

```c
#include <pthread.h>

//Ambas retornan 0 en caso de exito, cualquier otro valor indica error
int pthread_mutex_lock(pthread_mutex_t * mutex);
int pthread_mutex_unlock(pthread_mutex_t * mutex);

```

- Comentarios de estas funciones
    - Si el mutex está bloqueado por otro thread, un llamado a _lock()_ se bloquea hasta que el mutex sea desbloqueado.
    - Si el hilo que ya posee el mutex vuelve a hacer un lock, el hilo entra en un deadlock por default.
    - Si hay muchos hilos esperando a adquirir el mutex, es indeterminado quien será el primero en adquirirlo, no hay una cola de espera.

## _Ejemplo: usando mutex para proteger una variable global_

- Ejempl_o_
    
    La idea de este ejemplo es proteger la variable global _glob_.
    
    ```bash
    # Output
    $ ./thread_incr_mutex 10000000
    glob = 20000000
    ```
    
    ```c
    #include <pthread.h>
    
    static int glob = 0;
    static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
    
    /* Loop 'arg' times incrementing 'glob' */
    static void * threadFunc(void *arg) {
    
    	int loops = *((int *) arg);
    	int loc, j, s;
    
    	for (j = 0; j < loops; j++) {
    		s = pthread_mutex_lock(&mtx);
    		if (s != 0)
    			errExitEN(s, "pthread_mutex_lock");
    		loc = glob;
    		loc++;
    		glob = loc;
    		s = pthread_mutex_unlock(&mtx);
    		if (s != 0)
    			errExitEN(s, "pthread_mutex_unlock");
    	}
    
    	return NULL;
    }
    
    int main(int argc, char *argv[]) {
    	pthread_t t1, t2;
    	int loops, s;
    
    	loops = (argc > 1) ? getInt(argv[1], GN_GT_0, "num-loops") : 10000000;
    
    	s = pthread_create(&t1, NULL, threadFunc, &loops);
    	if (s != 0)
    		errExitEN(s, "pthread_create");
    
    	s = pthread_create(&t2, NULL, threadFunc, &loops);
    	if (s != 0)
    		errExitEN(s, "pthread_create");
    
    	s = pthread_join(t1, NULL);
    	if (s != 0)
    		errExitEN(s, "pthread_join");
    
    	s = pthread_join(t2, NULL);
    	if (s != 0)
    		errExitEN(s, "pthread_join");
    
    	printf("glob = %d\\n", glob);
    	exit(EXIT_SUCCESS);
    }
    ```
    

## _Buenas prácticas_

Hacer uso de:

```c
#include <pthread.h>

// Es equivalente al lock, excepto que, si el lock no esta disponible, 
// no espera, sino que retorna inmediatamente.
int pthread_mutex_trylock(pthread_mutex_t *mutex);

int pthread_mutex_timedlock()
```

Queda como tarea del lector ver que hacen cada una y por qué es una buena práctica hacer uso de ellas.

## _Mutex deadlocks_

A veces, un thread necesita acceder simultáneamente a dos o más recursos compartidos diferentes, cada uno de los cuales se rige por un mutex independiente. Cuando más de un thread está bloqueando el mismo conjunto de mutexes, pueden surgir situaciones de _**deadlock**_.

- Ejemplo de deadlock
    
    Cada thread bloquea con éxito un mutex, y luego intenta bloquear el mutex que el otro thread previamente bloqueó. En consecuencia, ambos hilos permanecerán bloqueados indefinidamente.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d964367d-aadb-4959-9594-86b12ef86728/Untitled.png)
    

¿Cómo podemos evitar el deadlock?

- Formas
    1. La manera más sencilla es definir una jerarquía de mutex. Es decir, los threads pueden bloquear el conjunto de mutexes pero en un cierto orden siempre. Por ejemplo, en el escenario del ejemplo anterior, el deadlock podría evitarse si los dos threads siempre bloquean los mutex en el orden _mutex1_ seguido de _mutex2_. A veces, existe una jerarquía lógicamente obvia de mutexes. Sin embargo, incluso si no lo hay, puede ser posible idear un orden jerárquico arbitrario que todos los hilos deben seguir.
    2. Un thread bloquea el primer mutex usando _thread_mutex_lock()_ y luego bloquea los mutex restantes usando _thread_mutex_trylock()._ Si alguna de las llamadas _pthread_mutex_trylock()_ falla, entonces el subproceso libera todos los mutex y luego vuelve a intentarlo. Este enfoque es menos eficiente que una jerarquía de bloqueo, ya que se pueden requerir varias iteraciones. Por otro lado, puede ser más flexible, ya que no requiere una jerarquía mutex rígida.

# Signaling changes of state: Condition variables

Mutex evita que varios threads accedan a una variable compartida al mismo tiempo. Una _**variable de condición**_ permite que un thread le informe a otros threads sobre los cambios en el estado de una variable compartida (u otro recurso compartido) y permite que un thread duerma (_wait_) hasta que otro thread le notifique que debe hacer algo.

Las variables de condición se asocian con un mutex. Mutex proporciona exclusión mutua para acceder a la variable compartida, mientras que la variable de condición se usa para indicar cambios en el estado de la variable.

<aside> 📌 Variable condition is a mechanism for communicating information about the applications state.

</aside>

_Referencias:_

[Condition variables in C](https://www.youtube.com/watch?v=0sVGnxg6Z3k)

[Signaling for condition variables (pthread_cond_signal vs pthread_cond_broadcast)](https://www.youtube.com/watch?v=RtTlIvnBw10)

## _Variables de condición estáticos y dinámicos_

Las variables de condición se puede asignar en una variable estática o dinámica. Son de tipo `pthread_cond_t` que debe ser inicializada siempre antes de ser utilizada.

Para el caso de que sea una variable estática, debemos hacer lo siguiente:

```c
#include <pthread.h>

pthread_cond_t cond = PTHREAD_COND_INITIALIZER;
```

En el caso de que sea una variable dinámica, luego de hacer un `malloc` podemos hacer:

```c
#include <pthread.h>

// Retorna 0 en caso de exito, cualquier otro valor indica error.
int pthread_cond_init (pthread_cond_t * cond,
			       const pthread_condattr_t * attr)
```

y luego debemos hacer uso de:

```c
#include <pthread.h>

// Retorna 0 en caso de exito, cualquier otro valor indica error.
int pthread_cond_destroy(pthread_cond_t *cond);
```

## _Señalización y espera de variables de condición_

Las principales operaciones con variables de condición son _signal_ y _wait._

```c
#include <pthread.h>

// Todas retornan 0 en caso de exito y un numero positivo si hubo errores
int pthread_cond_signal(pthread_cond_t * cond );
int pthread_cond_broadcast(pthread_cond_t * cond );
int pthread_cond_wait(pthread_cond_t * cond , pthread_mutex_t * mutex );

```

- _**pthread_cond_wait()**_
    - Bloquea el hilo hasta que la variable de condición _cond_ sea señalada.
    - Efectúa las siguientes tareas
        - hace un unlock del _mutex_
        - bloquea al thread que llamo a la función hasta que otro thread señale la variable de condición _cond_
        - hace un lock de _mutex_ para el thread que quedo esperando.
- _**pthread_cond_signal()**_
    - Señala la variable de condición _cond_
    - Si varios threads están bloqueados en _pthread_cond_wait()_ con esta función nos aseguramos de que al menos uno de los threads bloqueados fue despertado. **
    - Es eficiente su uso si necesitamos despertar a un thread (cualquiera de todos los que estaban esperando) para manejar el cambio de estado en la variable.
- _**pthread_cond_broadcast()**_
    - Señala la variable de condición _cond_
    - Si varios threads están bloqueados en _pthread_cond_wait()_ con esta función nos aseguramos de que todos los threads bloqueados se despierten. **
    - Es eficiente su uso si los waiting threads desarrollan diferentes tareas.

<aside> 📌 Si ningún thread está esperando la variable de condición en el momento en que se señala, esta ultima se pierde.

</aside>

## _Variables de condición - ejemplo de productor y consumidor_

Declaramos las siguientes variables globales:

```c
static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

static int avail = 0;
```

Para el productor:

```c
s = pthread_mutex_lock(&mtx);

if (s != 0)
	errExitEN(s, "pthread_mutex_lock");

avail++;  /* Let consumer know another unit is available */

s = pthread_mutex_unlock(&mtx);

if (s != 0)
	errExitEN(s, "pthread_mutex_unlock");

s = pthread_cond_signal(&cond); /* Wake sleeping consumer */

if (s != 0)
	errExitEN(s, "pthread_cond_signal");
```

Para el consumidor:

```c
for (;;) {

	s = pthread_mutex_lock(&mtx);

	if (s != 0)
		errExitEN(s, "pthread_mutex_lock");

	while (avail == 0) { 		/* Wait for something to consume */
		s = pthread_cond_wait(&cond, &mtx);
		if (s != 0)
		errExitEN(s, "pthread_cond_wait");
	}

	while (avail > 0) { 	/* Consume all available units */
			/* Do something with produced unit */
		avail--;
	}

	s = pthread_mutex_unlock(&mtx);
	if (s != 0)
		errExitEN(s, "pthread_mutex_unlock");
	/* Perhaps do other work here that doesn't require mutex lock */
}
```

- ¿Por que un while y no un if?
    
    Cada variable de condición tiene un predicado asociado que involucra una o más variables compartidas. Por ejemplo, en el segmento de código del ejemplo anterior, el predicado asociado con _cond_ es _(avail == 0)_. Al regresar de _thread_cond_wait()_, no hay garantías sobre el estado del predicado, por lo tanto, debemos volver a verificar inmediatamente el predicado y reanudar la espera si no está en el estado deseado la variable compartida.
    
    Por ejemplo, si quisieramos que el consumidor consuma todo cuando haya por lo menos 3 unidades, el predicado deberia haber sido (avail < 3). De esta forma, cuando el productor le notifique al consumidor que producio una pieza, este se despertara. Cuando se despierte verificara si hay 3 piezas para consumir, si no hay tal cantidad de piezas (estado deseado) continuara esperando.
    

_Nota:_ gracias a las variables de condición, podemos implementar un pthread_join() que se asocie directamente a un hilo.
