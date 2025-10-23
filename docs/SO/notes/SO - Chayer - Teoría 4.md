# POSIX Shared memory en procesos

## _Overview_

POSIX definió una API de memoria compartida llamada _POSIX shared memory_. Básicamente, es una region de memoria compartida que sirve para comunicar procesos relacionados y no relacionados.

> POSIX talks about shared memory _objects_

Linux usa un sistema de archivos _tmpfs_ montado en el directorio _/dev/shm_. Este sistema de archivos tiene persistencia en el kernel, es decir, los objetos de memoria compartida que contiene el kernel persistirán incluso si ningún proceso los tiene abiertos actualmente, pero se perderán si se apaga el sistema.

La cantidad total de memoria en todas las regiones de memoria compartida en el sistema está limitada por el tamaño del sistema de archivos _tmpfs_. Esta tiene un valor por default que se setea al bootear Linux. Sin embargo, un superusuario podría cambiar su tamaño.

Para hacer uso de un _POSIX shared memory object_ tenemos que seguir estos dos pasos:

1. Usar la función _shm_open_ para abrir un objeto con un nombre especifico. Esta función es análoga a la system call _open_: o bien crea una nueva shared memory object o la abre si existe. La función retorna un file descriptor que hace referencia al objeto.
2. Pasarle el file descriptor obtenido en el paso anterior a la funcion _mmap_ que se encargara de mapear el objeto de memoria compartida en el espacio de direcciones virtuales del proceso. Una vez que hemos mapeado el objeto, es una buena practica cerrar el file descriptor de manera inmediata si no lo utilizamos. Esto no afecta al mapeo.

<aside> 💡 Dado que se hace referencia a un objeto de memoria compartida mediante un file descriptor, podemos hacer uso de varias system calls ya definidas en el sistema UNIX.

</aside>

En un proceso relacionado, si hacemos que el hijo herede dicha shared memory, a pesar de que tanto el proceso padre como el proceso hijo comparten la misma dirección de memoria física, la memoria virtual es diferente. Por eso, si intentamos imprimir el puntero con la dirección de memoria, el resultado puede diferir.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dca3ce0d-a5d0-4c38-b499-ece7962b20e4/Untitled.png)

## _Creación de un objeto de memoria compartida_

Como mencionamos, la funcion _shm_open_ crea y abre un nuevo objeto de memoria compartida o abre un objeto ya existente. Observemos que sus argumentos son los mismos que _open_.

```c
#include <fcntl.h> /* Defines O_* constants */
#include <sys/stat.h> /* Defines mode constants */
#include <sys/mman.h>

// Retorna un file descriptor en caso de existo, -1 en caso de error.
int shm_open(const char *name, int oflag, mode_t mode);
```

- _**name**_ es el identificador del objeto.
    
- _**oflag**_ representa la mascara de bits que modifica el comportamiento de la funcion.
    
- _**mode**_ representa una mascara de bits que setea los permisos para dicho objeto.
    
- _oflag_ bit values
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4946bf1d-057f-4a40-973d-69dd196866dd/Untitled.png)
    
- _mode_ bit values
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8a3133ea-1228-4231-a52e-fcd2f464ff9e/Untitled.png)
    

Algunos comentarios de esta función:

- A diferencia de _open_, el argumento _mode_ siempre es necesario al hacer una llamada a _shm_open_. Si no estamos creando un nuevo objeto, este argumento debe ser un 0.
- El file descriptor que retorna la función tiene seteado el `close-on-exec` flag para que se cierre automáticamente si el proceso hace un _exec_.
- Cuando se crea un nuevo objeto de memoria compartida, inicialmente tiene tamaño 0. Es decir que luego de crearla, debemos hacer uso de _ftruncate_ para setear el tamaño del objeto antes de llamar a _mmap_.
- Cuando se amplía un objeto de memoria compartida, los bytes recién agregados se inicializan automáticamente a 0
- Con el file descriptor obtenido, podemos hacer uso de _fstat_ para obtener una estructura _stat_ cuyos campos contienen información sobre el objeto de memoria compartida, incluido su tamaño (_st_size_), permisos (_st_mode_), propietario (_st_uid_) y grupo (_st_gid_)

<aside> 💡 Cuando se crea un nuevo objeto de memoria compartida, su _ownership_ y _group ownership_ se toman de los ID de _user_ y _group_ del proceso que llama a _shm_open_. Los permisos y el _ownership_ del objeto de memoria compartida se pueden modificar haciendo uso de _fchmod_ y _fchown_ respectivamente.

</aside>

## _Ejemplo de uso de shm_open, ftruncate y mmap_

- Ejemplo 1
    
    Este programa crea un objeto de memoria compartida cuyo tamaño se especifica mediante linea de comando y asigna el objeto al espacio de direcciones virtuales del proceso (este ultimo paso es redundante pues no hacemos nada con la memoria compartida, simplemente queremos ver un caso de uso).
    
    En el siguiente ejemplo, usamos este programa para crear un objeto de memoria compartida de 10.000 bytes y luego usamos `ls` para mostrar este objeto en `/dev/shm`:
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/22004c13-f2f3-4a30-9618-86c1f3384ec4/Untitled.png)
    
    ```c
    #include <sys/stat.h>
    #include <fcntl.h>
    #include <sys/mman.h>
    
    static void usageError(const char *progName) {
    	fprintf(stderr, "Usage: %s [-cx] name size [octal-perms]\\n", progName);
    	fprintf(stderr, " -c Create shared memory (O_CREAT)\\n");
    	fprintf(stderr, " -x Create exclusively (O_EXCL)\\n");
    	exit(EXIT_FAILURE);
    }
    
    int main(int argc, char *argv[]) {
    	int flags, opt, fd;
    	mode_t perms;
    	size_t size;
    	void *addr;
    
    	flags = O_RDWR;
    	while ((opt = getopt(argc, argv, "cx")) != -1) {
    		switch (opt) {
    			case 'c': flags |= O_CREAT; break;
    			case 'x': flags |= O_EXCL; break;
    			default: usageError(argv[0]);
    		}
    	}
    
    	if (optind + 1 >= argc)
    		usageError(argv[0]);
    
    	size = getLong(argv[optind + 1], GN_ANY_BASE, "size");
    	perms = (argc <= optind + 2) ? (S_IRUSR | S_IWUSR) :
    									getLong(argv[optind + 2], GN_BASE_8, "octal-perms");
    
    	/* Create shared memory object and set its size */
    	fd = shm_open(argv[optind], flags, perms);
    	if (fd == -1)
    		errExit("shm_open");
    
    	if (ftruncate(fd, size) == -1)
    		errExit("ftruncate");
    
    	/* Map shared memory object */
    	addr = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    	if (addr == MAP_FAILED)
    		errExit("mmap");
    
    	exit(EXIT_SUCCESS);
    }
    
    ```
    

## _Usando objetos de memoria compartida_

Veamos ahora dos ejemplos de uso de objetos de memoria compartida para transferir datos de un proceso a otro. Estos dos programas necesitan que primero se cree el objeto de memoria compartida del ejemplo anterior.

- Ejemplo 2
    
    En este ejemplo, el programa copia el string que se pasa por linea de comando (argv[2]) a la shared memory identificada por un argumento de linea de comando (argv[1]).
    
    Observar como antes de hacer el mapeo del objeto y hacer la copia, el programa usa _ftruncate_ para hacer un resize de la memoria compartida para que sea del mismo tamaño del string que se esta a punto de copiar.
    
    ```c
    #include <fcntl.h>
    #include <sys/mman.h>
    
    int main(int argc, char *argv[]) {
    	int fd;
    	size_t len; /* Size of shared memory object */
    	char *addr;
    
    	if (argc != 3 || strcmp(argv[1], "--help") == 0)
    		usageErr("%s shm-name string\\n", argv[0]);
    
    	fd = shm_open(argv[1], O_RDWR, 0); /* Open existing object */
    	if (fd == -1)
    		errExit("shm_open");
    
    	len = strlen(argv[2]);
    	if (ftruncate(fd, len) == -1) /* Resize object to hold string */
    		errExit("ftruncate");
    	printf("Resized to %ld bytes\\n", (long) len);
    
    	addr = mmap(NULL, len, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    	if (addr == MAP_FAILED)
    		errExit("mmap");
    
    	if (close(fd) == -1)
    		errExit("close"); /* 'fd' is no longer needed */
    
    	printf("copying %ld bytes\\n", (long) len);
    	memcpy(addr, argv[2], len); /* Copy string to shared memory */
    	exit(EXIT_SUCCESS);
    }
    ```
    
- Ejemplo 3
    
    Este programa muestra el string que fue copiado en memoria compartida existente (identificado por un argumento de linea de comando). Después de llamar a _shm_open_, el programa usa _fstat_ para determinar el tamaño de la memoria compartida y usa ese tamaño en la llamada a _mmap_ que mapea el objeto y en la llamada a _write_ imprime string.
    
    ```c
    #include <fcntl.h>
    #include <sys/mman.h>
    #include <sys/stat.h>
    
    int main(int argc, char *argv[]) {
    	int fd;
    	char *addr;
    	struct stat sb;
    
    	if (argc != 2 || strcmp(argv[1], "--help") == 0)
    		usageErr("%s shm-name\\n", argv[0]);
    
    	fd = shm_open(argv[1], O_RDONLY, 0); /* Open existing object */
    
    	if (fd == -1)
    		errExit("shm_open");
    
    	/* Use shared memory object size as length argument for mmap()
    	and as number of bytes to write() */
    	if (fstat(fd, &sb) == -1)
    		errExit("fstat");
    
    	addr = mmap(NULL, sb.st_size, PROT_READ, MAP_SHARED, fd, 0);
    	if (addr == MAP_FAILED)
    		errExit("mmap");
    
    	if (close(fd) == -1); /* 'fd' is no longer needed */
    		errExit("close");
    
    	write(STDOUT_FILENO, addr, sb.st_size);
    	printf("\\n");
    	exit(EXIT_SUCCESS);
    }
    ```
    
- Combinación de los 3 ejemplos
    
    Primero creamos una zero length shared memory object usando el primer programa:
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/619e5673-6e1d-4f20-b725-2c47ca7bd263/Untitled.png)
    
    Después usamos el ejemplo 2 para copiar el string en la shared memory:
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/14bb9bc2-ecf5-43d4-84a4-83c145e9a22d/Untitled.png)
    
    Finalmente, usamos el ultimo ejemplo para mostrar en pantalla el string que estaba en la shared memory
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/48427977-893e-482b-9f3f-1547d398bc44/Untitled.png)
    

_**Nota:**_ Si bien acá el mecanismo de sincronización fue que el usuario ejecutara dichos scripts, la mejor manera de sincronizar el acceso a una shared memory es con semáforos.

## _Eliminando objetos de memoria compartida_

Como dijimos, los objetos de memoria compartida persisten en el kernel hasta que explícitamente sean removidos o se haga un reboot del sistema.

La manera explicita de eliminar un objeto de memoria compartida es a traves de la siguiente función:

```c
#include <sys/mman.h>

// Retorna cero en caso de exito, -1 en caso de error
int shm_unlink(const char *name);
```

La eliminación de un objeto de memoria compartida no afecta los mapeos existentes del objeto. Es decir, todos los _mmap_ de dicho objeto permanecerán vigentes hasta que los procesos correspondientes llamen a _munmap_ o finalicen. Sin embargo, _shm_unlink_ evita que futuras llamadas a _shm_open_ abran el objeto. Una vez que todos los procesos hayan desasignado el objeto, el objeto se elimina del sistema y su contenido se pierde.

---

# Notas de la clase de Horacio

## _Condiciones de carrera usando shared memory_

![El valor de counter debería ser 5, pero puede llegar a ser 4 o 6.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/38fc7cda-3649-4d01-b441-532ae79d9fe3/Untitled.png)

El valor de counter debería ser 5, pero puede llegar a ser 4 o 6.

A esta situación se la llama condición de carrera. El resultado es aleatorio y depende del orden en el cual se accede.

A esta región donde nos podemos mandar macanas si se hacen ejecuciones concurrentes, se la llama _zona critica_. Tenemos más probabilidad de que ocurra en procesadores multiple core.

El `Kernel` no interviene en el uso de esta memoria compartida, por lo que es necesario algún mecanismo para sincronizar el uso de esa memoria, para evitar, por ejemplo, que un proceso lea memoria mientras otro la esta actualizando como vimos en el ejemplo anterior.

¿Cómo podemos solucionar este problema de sincronización en la región critica?

_**Exclusión mutua:**_ No más de un proceso en la región crítica a la vez.

_**Progreso:**_ Cuando no hay nadie en la región crítica cualquier proceso que quiere ingresar en la región crítica debe ser admitido sin demora.

**_No inanición_:** Debe haber un límite superior en la cantidad de veces que un proceso ingresa en la región crítica mientras otro proceso está esperando.

## _Locks y unlocks_

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5c05ced5-e21d-4009-a7b2-2c7a17e50f89/Untitled.png)

La idea es implementar una variable de tipo compartida. Para poder entrar a dicha región critica debe adquirir la llave y devolverla cuando termine. Un **semáforo** es una forma de implementación de **locks**.

_Para este ejemplo:_

- `lock(L)` Adquiere el lock en forma exclusiva. Solamente el proceso con L puede acceder a la región crítica.
- `unlock(L)` libre el acceso exclusivo sobre el lock. Permitiendo que otros procesos esperando accedan a la región crítica.

En este ejemplo, el lock no es suficiente. Puede que ambos procesos intenten ejecutar el lock al mismo tiempo, lo que llevaría a un error. Para evitar este problema, se hace que las funciones lock y unlock sean syscalls, para que el kernel se encargue de asegurar que solo un proceso pueda ejecutarlas a la vez.

¿Cuándo usar?

Cuando hay múltiples instrucciones que las queremos hacer atómicas en forma explicita. Cada pieza del SO debe ser revisada por si necesita ser atómica. La idea es convertir múltiples instrucciones en una instrucción atómica.

No ejemplos de implementaciones de locks vía software

<aside> 💡 Todas las soluciones de software deben involucrar una espera activa por el otro proceso. La única forma de implementarlo con espera no activa es con el uso de syscalls.

</aside>

Caso 1: deshabilitando interrupciones

Al deshabilitar interrupciones no hay context switch (pues podemos caer en inanición). Hay que tener en cuenta sin embargo, que se requieren privilegios para hacer esto pues los procesos de usuario no pueden deshabilitar interrupciones, únicamente mediante syscalls.

No es adecuado para sistemas multicore ya que sino habría problemas de concurrencia (ambos cores continúan su ejecución). En otras palabras, en multiple core, no se garantiza la exclusión mutua.

Caso 2: con una variable global

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ee24826b-c04a-498e-8266-0be05e4badd9/Untitled.png)

- Esta solución cumple la condición de exclusión mutua. Turno vale 1 o bien vale 2.
- Se produce una espera activa. Todas las soluciones por código tienen el problema de la espera activa. El kernel es el único que puede suspender a un proceso y volver a despertarlo, por ende lo necesitamos si queremos evitar la espera activa
- Tiene el problema de **no progreso,** pues requiere ejecución alternativa en la región critica. Además, requiere que arranque sí o sí primero la ejecución del proceso 1 ya que si llegara a arrancar el proceso 2, nunca podría entrar a la sección critica.

El otro problema es que tiene una variable común de turno modificada por los dos procesos por lo cual los procesos se deben alternar. Una posible solución es tener dos variables (una para cada proceso).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3e91a4c2-5e9b-4fa7-bc31-f308d60743c3/Untitled.png)

Sí cumple con la exclusión mutua.

Caso 3: dos flags

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7e1fa954-88c0-434a-982c-747a3f339aff/Untitled.png)

No requiere ejecución alternada pero no garantiza exclusión mutua. Pueden llegar a entrar a la región crítica simultáneamente.

Tampoco se garantiza exclusión mutua, pues ambos pueden llegar entrar en la región critica simultáneamente.

Caso 4: dos flags

![Faltan los punto y coma al lado de cada while.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b9598036-366a-4e48-b7eb-4b6acb5585b3/Untitled.png)

Faltan los punto y coma al lado de cada while.

Para este caso, puede quedar en `deadlock` porque pueden quedar en la espera activa del corte del while (loop indefinido).

Sí se puede lograr exclusión mutua.

Soluciones de implementaciones de locks vía software

Algoritmo de Peterson

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd923680-ead0-4748-b10c-a8ca99f5dab7/Untitled.png)

Se rompe el abrazo mortal (deadlock) con un proceso favorecido, pues favorecido solo puede ser 1 o 2 (solo un proceso puede entrar a la región critica para dos procesos).

Cumple con las 3 condiciones, pero solo es válido para 2 procesos.

Algoritmo de Bakery

Sincronización entre más de dos procesos.

Los procesos se numeran de 0 a N-1.

Num es un arreglo de N enteros inicializados en 0.

No ejemplos de implementaciones de locks vía hardware

Caso 1: instrucción atómica (del procesador)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5b8be832-14d4-4ad0-802c-ffbeb60dce17/Untitled.png)

Si hacemos que `lock = 1` sea una operación atómica, podemos garantizar la exclusión mutua.

La instrucción atómica sería `set_and_test`. Lee memoria, lleva su resultado a su procesador para luego volver a memoria.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/96c5c0dd-c501-4c7a-94c3-7e586bf476f6/Untitled.png)

El único problema es que cuando el procesador ejecuta una instrucción `set_and_test`, tiene que frenar a todos los otros cores (serialización) para evitar la posibilidad de que en otros cores se ejecute una instrucción atómica. De esto se asegura el controlador de los multiplecores.

- Ley de Amdahl
    
    El rendimiento teórico (potencia de procesamiento) no crece de manera lineal como uno esperaría a medida que tiene más cores en la compu.
    

La instrucción atómica `xchg` intercambia dos posiciones de memoria. Si dos CPUs ejecutan la instrucción `xchg` al mismo tiempo el Hw se asegura de serializarlas.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b833cb93-dc68-46bd-87a2-b2b1c4b991cf/Untitled.png)

En base a esta instrucción se construyen herramientas de mayor nivel.

Ejemplos de implementaciones de locks vía hardware

En base a la instrucción atómica `xchg` se construyen estas herramientas de mayor nivel:

- Spinlocks → espera activa, cuando el SO sabe que la espera va a ser corta.
- Mutex → manejo de hilos.
- Semáforos → manejo de procesos.

# Semáforos

## _Breve introducción_

Los **semáforos** permiten que los procesos o hilos sincronicen sus acciones

Un uso común de un semáforo es sincronizar el acceso a una shared memory (definida como una **región critica**), para evitar que un proceso acceda a la memoria compartida al mismo tiempo que otro proceso la está actualizando (ver más abajo).

<aside> 📢 Los semáforos no se utilizan para transferir datos entre procesos.

</aside>

Podemos pensar un semáforo como un entero mayor o igual a cero mantenido por el kernel.

Se pueden aplicar ciertas operaciones sobre los semáforos:

- Podemos setear el semáforo en cierto valor absoluto.
- Podemos sumar un valor al current value del semáforo.
- Podemos restar un valor al current value del semáforo.
- Podemos esperar a que el valor del semáforo sea 0.

Las últimas tres pueden bloquear al _calling_ _process_. El kernel siempre estará chequeando que ese valor no caiga por debajo de cero y, por otro lado, esperará a que el valor del entero almacenado en el kernel sea 0 en el caso de ejecutar la última operación. En resumen, el _calling process_ se mantendrá bloqueado hasta que algún otro proceso altere el valor del semáforo a un valor que le permita operar (el kernel despertará al proceso bloqueado).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3a8f8656-be67-4543-8649-103ec0b76a8f/Untitled.png)

## _Overview_

Existen dos tipos de semáforos POSIX:

- _Named semaphores_
    
    Este tipo de semáforo es identificado por un nombre. Procesos no relacionados pueden acceder al mismo semáforo usando su identificador como argumento de la función _sem_open_.
    
- _Unnamed semaphores_
    
    Este tipo de semáforo no tiene nombre y reside en memoria. Este tipo de semáforos se puede compartir entre procesos o entre un grupo de threads. Cuando se comparte entre procesos, el semáforo debe estar almacenado en la shared memory. Cuando se comparte entre threads, el semáforo puede estar almacenado en una zona de memoria compartida por los threads (heap o variable global).
    

# Named semaphores

Para trabajar con _named semaphores_, utilizamos las siguientes funciones:

- _sem_open_
    
    Esta función abre o crea un semáforo, inicializa el semáforo si lo crea la llamada y devuelve un identificador para usar en llamadas posteriores.
    
- _sem_post_
    
    Recibe un semáforo como argumento.
    
    Incrementa el valor del semáforo en una unidad.
    
    Opera con un semaforo a la vez.
    
- _sem_wait_
    
    Recibe un semáforo como argumento.
    
    Decrementa el valor del semaforo en una unidad.
    
    Opera con un semaforo a la vez.
    
- _sem_getvalue_
    
    Recupera el valor actual de un semáforo.
    
- _sem_close_
    
    Elimina la asociación del _calling process_ con un semáforo que abrió previamente.
    
- _sem_unlink_
    
    Elimina un nombre de semáforo y marca el semáforo para su eliminación cuando todos los procesos lo han cerrado.
    

En Linux, estos semáforos se crean como pequeños objetos de memoria compartida POSIX con nombres de la forma [sem.name](http://sem.name/), en un sistema de archivos _tmpfs_ montado en el directorio `/dev/shm`. Recordemos que este sistema de archivos tiene persistencia del kernel, es decir, que los semáforos que contiene persistirán, incluso si ningún proceso los tiene abiertos actualmente, pero se perderán si se apaga el sistema.

## _Abriendo un named semaphore_

Cuando se crea un hijo a través de la syscall `fork`, este hereda referencias de todos los _named semaphores_ que están abiertos en el padre. El padre y el hijo pueden usar estos semáforos para sincronizar sus acciones.

```c
#include <fcntl.h> /* Defines O_* constants */
#include <sys/stat.h> /* Defines mode constants */
#include <semaphore.h>

// Retorna un puntero al semaforo en caso de exito o SEM_FAILED en caso de error.
sem_t * sem_open(const char *name, int oflag, mode_t mode, unsigned int value);
sem_t * sem_open(const char *name, int oflag);
```

- _name_ identifica al semáforo.
- El argumento _oflag_ es una máscara de bits que determina si estamos abriendo un semáforo existente o creando y abriendo un nuevo semáforo.
    - Si _oflag_ especifica tanto `O_CREAT` como `O_EXCL`, y ya existe un semáforo con mismo _name_, entonces _sem_open_ falla.
    - Si _oflag_ es 0, estamos indicando que queremos acceder a un semáforo que ya existía y podemos hacer uso de la segunda función de sem_open.
    - Si se especifica `O_CREAT` en _oflag_, se crea un nuevo semáforo si no existe uno con el mismo _name_. Para cuando usemos este flag, si o si necesitamos _mode_ y _value_.
        - _Mode:_ es una máscara de bits que especifica los permisos que se colocarán en el nuevo semáforo. Los valores de bits son los mismos que para los archivos.
        - _Value:_ especifica el valor inicial que se asignará al nuevo semáforo. La creación e inicialización del semáforo se realizan de forma atómica.

<aside> 💡 Linux asume un _mode_ `O_RDWR` al abrir un semáforo, ya que la mayoría de las aplicaciones que usan semáforos hacen uso de _sem_post_ como _sem_wait_, lo que implica leer y modificar el valor de un semáforo. Esto significa que debemos asegurarnos de que se concedan permisos de lectura y escritura necesarios.

</aside>

- Extra - Clase de Horacio
    - Los semáforos nombrados poseen:
        - Nombre.
        - Identificador de usuario.
        - Identificador de grupo.
        - Permisos de acceso.
    - El nombre de un semáforo es una cadena de caracteres (con las mismas restricciones de un nombre de fichero). Además:
        - si el nombre (ruta) es relativa, solo puede acceder al semáforo el proceso que los crea y sus hijos.
        - si el nombre comienza por “/”, el semáforo puede ser compartido por cualquier proceso.

---

**Importante:**

El siguiente uso de `sem2` no está permitido (_shallow copy_):

```c
sem_t * sp, sem2
sp = sem_open(...);
sem2 = *sp;      // Copy of the semt_t variable pointed by sp.
sem_wait(&sem2);
```

## _Cerrando un named semaphore_

La función _sem_close_ finaliza la asociación semaforo-proceso (es decir, cierra el semáforo), libera cualquier recurso que el sistema haya asociado con el semáforo para este proceso y disminuye la cantidad de procesos que hacen referencia al semáforo.

Los _open named semaphores_ se cierran automáticamente al finalizar el proceso o si el proceso ejecuta un _exec_.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito, 1 en caso de error.
int sem_close(sem_t *sem);
```

<aside> 💡 Cerrar un semáforo no lo elimina. Para eliminarlo, necesitamos usar _sem_unlink_.

</aside>

## _Eliminar un named semaphore_

La función _sem_unlink_ elimina el semáforo identificado por _name_ y lo “marca” para que se destruya de manera inmediata una vez que todos los procesos dejen de usarlo.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito o -1 en caso de error.
int sem_unlink(const char *name);
```

# Operaciones con _named semaphores_

## _Wait_

La función _sem_wait_ decrementa en una unidad el valor del semáforo _sem._

```c
#include <semaphore.h>

// Retorna 0 en caso de exito, -1 en caso de error.
int sem_wait(sem_t * sem);
```

En el caso de que el valor del semáforo sea cero, _sem_wait_ se bloquea hasta que el valor del semaforo sea mayor a 0. En ese momento, el semáforo se decrementa y _sem_wait_ retorna de manera inmediata.

- _**Extra:**_ interrupcion de un _sem_wait_ bloqueado.
    
    Si una llamada _sem_wait_ bloqueada es interrumpida por un signal handler, esta falla con el error `EINTR`, independientemente de si se usó el flag `SA_RESTART` al establecer el signal handler con _sigaction_.
    

## _Trywait_

La función _sem_trywait_ es una versión sin bloqueo de _sem_wait_.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito y -1 en caso de error.
int sem_trywait(sem_t * sem);
```

Si no es posible decrementar, la función falla con error `EAGAIN`.

## _Post_

La función _sem_post_ incrementa en una unidad el valor del semáforo _sem_.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito y -1 en caso de error.
int sem_post(sem_t * sem);
```

Si el valor del semáforo era 0 antes de la llamada a _sem_post_ y algún otro proceso (o thread) esta bloqueado a la espera de disminuir el semáforo, entonces dicho proceso se “despierta” y su llamada a _sem_wait_ procede a decrementar el semáforo.

Si multiples procesos (o threads) están bloqueados por un llamado a _sem_wait_ y además fueron programados (scheduled) bajo la política predeterminada de tiempo compartido por turnos, es indeterminado cual se despertara y se le permitirá disminuir el semáforo.

<aside> 💡 Incrementar un semáforo se asocia con liberar algún recurso compartido para que lo use otro proceso o thread.

</aside>

## _Getvalue_

La función _sem_getvalue_ retorna el _current value_ del semáforo al que hace referencia _sem_ en el `int` al que apunta _sval_.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito, -1 en caso de error.
int sem_getvalue(sem_t *sem, int *sval);
```

Si uno o mas procesos (o threads) están bloqueados esperando a decrementar el valor del semáforo, el valor retornado en _sval_ en Linux es 0.

# Unnamed semaphores

Los _unnamed semaphores_ (conocidos como _memory-based semaphores_) son variables de tipo _sem_t_ que se almacenan en la memoria y este es asignado a dicho lugar por la aplicación.

La manera de utilizar el mismo semáforo para todos los procesos o threads es ubicarlo en una zona de memoria que compartan entre si (_shared memory_).

Las operaciones en los _unnamed semaphores_ son las mismas que las mencionadas en named semaphores (_sem_wait_, _sem_post_, _sem_getvalue_, _sem_trywait_).

Lo único que cambia, son las funciones para inicializar y destruir un semáforo.

## _Inicializar un unnamed semaphore_

La función _sem_init_ inicializa el unnamed semaphore apuntado por _sem_ y se inicializa con el valor especificado por _value_.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito y -1 en caso de error.
int sem_init(sem_t * sem, int pshared, unsigned int value);
```

El argumento _pshared_ indica si el semáforo se compartirá entre threads o procesos.

- Si _pshared_ es 0, entonces el semáforo se compartirá entre threads del _calling process_. En este caso, típicamente se especifica a _sem_ como la dirección de una variable global o una variable en el heap. Un semáforo compartido por threads tiene persistencia de proceso, es decir, se destruye cuando termina el proceso.
- Si _pshared_ no es cero, entonces el semáforo se compartirá entre procesos. En este caso, _sem_ debe ser la dirección de una ubicación en una shared memory. Este semáforo persiste siempre y cuando la shared memory no se destruya. Dado que los hijos (generados por un fork) heredan los memory mapping del padre, los semáforos compartidos por procesos los heredan los hijos. Con esto, el padre y el hijo podrán sincronizar sus acciones.

_Algunas notas:_

- No hay permisos asociados (mode) con unnamed semaphores. El acceso a un _unnamed semaphore_ se rige por los permisos que se otorgan al proceso para la región de memoria compartida subyacente
- Inicializar un unnamed semaphore previamente inicializado puede derivar en un comportamiento indefinido.
- No podemos hacer un shallow copy de la variable _sem_t_ pues el comportamiento es indefinido.

## _Destruir un unnamed semaphore_

La funcion _sem_destroy_ destruye el semáforo _sem_. _sem_ debe ser un unnamed semaphore. Es seguro destruir un semáforo solo si ningún proceso o hilo esta esperando por el.

```c
#include <semaphore.h>

// Retorna 0 en caso de exito y -1 en caso de error.
int sem_destroy(sem_t * sem);
```

Un semáforo destruido, puede ser reinicializado usando _sem_init_.

Si el semaforo reside en una POSIX shared memory, entonces debe ser destruido despues de que todos los procesos dejen de haber usado el semaforo y antes de hacer un _shm_unlink_ de la shared memory.

<aside> 📌 No llamar a _sem_destroy_ puede resultar en resource leaks

</aside>

## _Usando un unnamed semaphore para proteger el acceso a una variable global con threads_

- Ejemplo
    
    A continuación, presentamos un programa que usa un semáforo para proteger una region critica (acceso a una variable global). Por cada iteración definida en la variable loop, los thread incrementaran una vez cada uno la variable global. Por lo que el resultado obtenido debería ser 2 veces loop.
    
    ```c
    #include <semaphore.h>
    #include <pthread.h>
    
    static int glob = 0;
    static sem_t sem;
    
    static void * threadFunc(void *arg) { // Loop 'arg' times incrementing 'glob'
    
    	int loops = *((int *) arg);
    	int loc, j;
    	for (j = 0; j < loops; j++) {
    
    	if (sem_wait(&sem) == -1)
    		errExit("sem_wait");
    
    		loc = glob;
    		loc++;
    		glob = loc;
    
    		if (sem_post(&sem) == -1)
    			errExit("sem_post");
    	}
    
    	return NULL;
    }
    
    int main(int argc, char *argv[]) {
    	pthread_t t1, t2;
    	int loops, s;
    
    	loops = (argc > 1) ? getInt(argv[1], GN_GT_0, "num-loops") : 10000000;
    
    	/* Initialize a thread-shared mutex with the value 1 */
    
    	if (sem_init(&sem, 0, 1) == -1)
    		errExit("sem_init");
    
    	/* Create two threads that increment 'glob' */
    
    	s = pthread_create(&t1, NULL, threadFunc, &loops);
    	if (s != 0)
    		errExitEN(s, "pthread_create");
    
    	s = pthread_create(&t2, NULL, threadFunc, &loops);
    	if (s != 0)
    		errExitEN(s, "pthread_create");
    
    	/* Wait for threads to terminate */
    
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
    

## _Secuenciación de tareas en procesos_

- Crear dos procesos (padre e hijo).
- El proceso padre debe mostrar los números impares del 1 al 20.
- El proceso hijo debe mostrar los números pares del 1 al 20.
- Sincronizar la ejecución concurrente de padre e hijo para que se impriman los números del 1 al 20 de forma correlativa.

Solución:

- Asociaremos un semáforo a cada proceso.
    
- En la sección de entrada cada proceso realizará una operación P(S) (bloqueo) sobre su semáforo.
    
- En la sección de salida cada proceso liberará V(S) el semáforo del otro proceso.
    
- El padre iniciará la ejecución mientras el hijo está suspendido (esto se consigue inicializando los semáforos de forma correcta).
    
- Código
    
    ```c
    #include <stdio.h>
    #include <stdlib.h>
    #include <unistd.h>
    #include <errno.h>
    #include <fcntl.h>
    #include <semaphore.h>
    
    sem_t * sem_1, * sem_2 // puntero para el identificador de los semaforos
    
    int main(void) {
    		int i;
    		pid_t hijo;
    		int val;
    		
    		printf("creando semaforos\\n");
    
    		// Comprueba si ya existe el semaforo y sino lo crea desbloqueado con el valor 1 
    		sem_1=sem_open("/sem_1", O_CREAT, 0644, 1);
    		if(sem_1==(sem_t *) -1){
    			perror("Error creando semaforo 1");
    		}
    		
    		// Comprueba si ya existe el semaforo y sino lo crea bloqueadocon el valor 0
    		sem_2=sem_open("/sem_2", O_CREAT, 0644, 0);
    		if(sem_2==(sem_t *) -1){
    			perror("Error creando semaforo 2");
    		}
    		
    		printf("creando proceso hijo \\n");
    		hijo=fork();
    		switch(hijo) {
    				case -1:
    								printf("error creando proceso hijo\\n");
    								exit(0);
    				case 0: // estamos en el hijo, valores pares 
    								printf("Soy el hijo con PID: %d\\n", getpid());
    								for(i=2; i<=20; i+=2) {
    										sem_wait(sem_2); // Espera a que el padre libere el semaforo 
    										printf("hijo valor:%d\\n", i);
    										sleep(1);
    										sem_post(sem_1); // Activa al padre
    								}
    								// Libero semaforos
    								sem_close(sem_1);
    								sem_close(sem_2);
    								printf("Soy el hijo y termino\\n");
    								break;
    				default: // Estamos en el padre, valores impares
    									printf("Soy el padre con PID:%d\\n", getpid());
    										
    									for(i=2; i<=20; i+=2) {
    										sem_wait(sem_1); // Espera a que el hijo libere el semaforo 
    										printf("padre valor:%d\\n", i);
    										sleep(1);
    										sem_post(sem_2); // Activa al hijo
    									}
    
    									// Libero semaforos
    									sem_close(sem_1);
    									sem_close(sem_2);
    									printf("Soy el padre y espero a que termine el hijo\\n");
    									wait(0); // Esperar que acabe el hijo
    
    									printf("Soy el padre destruyo los semaforos y termino\\n");
    									sem_unlink("/sem_2");
    									sem_unlink("/sem_1");
    									
    		}
    		exit(0);
    }
    ```
    

## _Ejemplo: seccion critica y procesos_

- Ejemplo
    
    - El Padre crea un semáforo no nombrado y n-1 procesos.
    - Cada proceso (padre e hijos) muestra una cadena carácter a carácter liberando la CPU entre cada carácter (`sched_yield()`).
    - La sección crítica es el uso de la salida por pantalla para mostrar la cadena.
    - El proceso padre espera la terminación de los hijos y libera el semáforo.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d6d6004a-7d84-47ea-8a9a-adf78f238009/Untitled.png)
    
    ```c
    #include <stdio.h>
    #include <stdlib.h>
    #include <unistd.h>
    #include <semaphore.h>
    #include <sched.h>
    #include <fcntl.h>
    
    #define BUFFER_SIZE 500
    #define NUM_PROCESOS 10
    
    char buffer[BUFFER_SIZE];
    
    int main(int argc, char * argv[]){
    	char *c;
    	int i;
    	int n = NUM_PROCESOS;
    	pid_t hijo;
    	sem_t *semaforo;
    	int sem_cont;
    
    	//Crea el semaforo nombrado
    	if((sem_cont = sem_open("/semaforo", O_CREAT, 0644, 1)) ==(sem_t *)-1){
    		perror("No se puede crear el semaforo");
    		exit(1);
    	}
    
    	//Crea los procesos
    	//i actua como identificador del proceoso en el padre i==n
    	for(i=1; i<n; ++i){
    		hijo = fork();
    		if(hijo == -1){
    			perror("No se puede crear el proceso");
    			exit(-1);
    		} else if(hijo == 0){
    				break; //Si es un hijo salir del for (solo el padre crea procesos)
    		}
    	}
    
    	sprint(buffer,"i.%d proceso ID:%d padre ID:%d\\n", i, getpid(), getppid());
    
    	c = buffer;
    
    	//Seccion de entrada
    	if(sem_wait(semaforo) == -1){
    		perror("Semaforo no valido");
    		exit(1);
    	}
    	
    	//Principio de la seccion critica
    	while(*c ≠ “\\0”){
    		fputc(*c, stderr);
    		ffllush(stderr);
    		c++;
    		sched_yield();     //Libera la CPU
    	}
    	//Fin de la seccion critica
    
    	//Seccion de salida
    	if(sem_post(semaforo) == -1){
    		perror(”Semaforo no valido”);
    		exit(1);
    	}
    	//Seccion Restante
    
    	sem_close(&semaforo);
    	//El padre espera que terminen los hijos
    	if(i == n){
    		printf(”Soy el Padre [PID:%d] y voy a esperar a los hijos\\n”, getpid());
    		for(i=1; i<n; i++){
    			wait(0);
    		}
    		sem_unlink(”/semaforo”);
    	}
    	exit(0);
    }
    ```
    

# Unnamed vs named semaphores

```c
#include <semaphore.h>

sem_t * semaphore; // nombrados
sem_t semaphore; // no nombrados
```

Usar un unnamed semaphore nos permite evitar crear un nombre para el semáforo. Esto puede ser util por las siguientes razones:

- Un semáforo que se comparte entre threads, no necesita un nombre. Simplemente con hacerlo unnamed, una variable compartida (global o heap) es automáticamente accesible para todos los hilos.
- Un semáforo que se comparte entre procesos relacionados no necesita un nombre. Si el padre asigna un semáforo en una shared memory y luego hace un _fork_, el hijo automáticamente hereda el mapeo a esta shared memory y en consecuencia, el semáforo.
- Si estamos construyendo una estructura de datos dinámica como un binary tree, donde cada uno de los elementos requiere un semáforo asociado, entonces el enfoque más simple es asignar un semáforo sin nombre dentro de cada elemento. Si lo hiciéramos con _named semaphores_ entonces para cada elemento deberíamos diseñar una convención para generar un único nombre de semáforo.

# Deadlock

Si no se manejan bien los semáforos, podemos llegar a un estado de _**deadlock**_ donde ambos hilos o procesos se encuentran esperando un semáforo y ninguno ejecuta la región crítica:

```c
// H1 o P1

wait(A)
wait(B)

/*
	Region critica
*/

post(B)
post(A)
```

```c
// H2 o P2

wait(B)
wait(A)

/*
	Region critica
*/

post(A)
post(B)
```

# Introducción

Es una solución al problema de la sección critica. No hace uso de métodos de sincronización como semáforos, mutex o variables de condición.

Si bien puede no funcionar correctamente en arquitecturas modernas, ilustra la complejidad de diseñar software que garantice los requerimientos de exclusión mutua, progreso y espera limitada.

Estos 3 requerimientos mencionados, son requisitos indispensables para garantizar una correcta solución al problema de la sección critica.

# Algoritmo de Peterson

## _Overview_

El algoritmo de Peterson esta restringido a dos procesos que alternan su ejecución entre sus tramos críticos y los tramos restantes. Llamémoslos a los procesos $P0$ y $P1$.

## _Requisitos_

El algoritmo requiere de que ambos procesos compartan los siguientes datos:

```c
int turn;
```

```c
boolean flag[2]
```

Indica de quien es el turno para entrar a la sección critica.

Indica si un proceso esta listo para entrar a su sección critica.

## _Algoritmo_

```c
// Structure of process P0

do {

	flag[0] = true;
	turn = 1;                    // Be humble, give the turn to P1
	while(flag[1] && turn == 1); // Stuck until P1 finishes running critical section

	// Run critical section now that
	// P1 already finished running its critical section.
	
	// P0 has completed its critical section
	flag[0] = false;

	// Run remainder section
} while(true);
```

```c
// Structure of process P1

do {

	flag[1] = true;
	turn = 0;                    // Be humble, give the turn to P0
	while(flag[0] && turn == 0); // Stuck until P0 finishes running critical section

	// Run critical section now that
	// P0 already finished running its critical section.
	
	// P1 has completed its critical section
	flag[1] = false;

	// Run remainder section
} while(true);
```

_**Algunas notas:**_

- Lo importante de este algoritmo es la variable **`turn`**. Si corren en paralelo, al **`turn`** ser una variable compartida si o si uno de los dos lograra entrar a la sección critica.
- El **`while`** permite que el proceso quede estancado hasta que el otro proceso termine de ejecutar la sección critica.

## _¿Cumple con los requisitos?_

_**Mutual exclusion:**_ _If process $P_i$ is executing in its critical section, then no processes can be executing in their critical sections._ ✅

_**Progreso:**_ _If no process is executing in its critical section and some processes wish to enter their critical sections, then only those processes that are not executing in their remainder sections can participate in the decision on which will enter its critical section next, and this selection cannot be postponed indefinitely._ ✅

***Bounded waiting**: There exists a bound or limit on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter its critical section and before that request is granted.* ✅
