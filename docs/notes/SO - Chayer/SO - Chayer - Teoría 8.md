En el apunte de [threads](https://www.notion.so/Hilos-Pthreads-4bad14080ccf4177bc3371bb274564ea?pvs=21) mencionamos la existencia de _user-level threads_ y _kernel-level threads_.

Mencionamos que en los sistemas operativos modernos, el SO despacha _kernel-level threads_ y no procesos como creíamos. Los _user-level threads_ son administrados y manejados por una librería de hilos (_pthread_). El Kernel no sabe de la existencia de dicha librería.

Como el kernel despacha _kernel-level threads_, para ejecutar en la CPU, los _user-level threads_ deben estar mapeados a un _kernel level thread_. ¿Cómo hacemos para relacionar _kernel-level_ _threads_ con _user-level_ _threads_?

# Multithreading Models

Existen formas de relacionar _user-level threads_ y _kernel level threads_.

## _Many-to-One Model_

Se mapean muchos user-level threads a un kernel-level thread. El manejo de los threads lo hace la librería, así que es eficiente. Sin embargo, el proceso entero se bloquea si un thread realiza una system call bloqueante.

Como un solo thread de los 4 podrá ser mapeado, es imposible correr en paralelo los 4 threads.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/38f85358-a5d2-4659-b304-adb709011ad4/Untitled.png)

## _One-to-One Model_

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/68bb6519-a824-4b1a-a8b0-63b31500497f/Untitled.png)

Cada _user-level thread_ se mapea con un _kernel-level thread_.

Evita que el proceso quede bloqueado sin poder progresar (correr algún otro hilo) si alguno de los hilos se bloquea, se puede paralelizar la ejecución de los mismos (permite la concurrencia).

La única desventaja es que la creación de un _user-level thread_ requiere la creación de un _kernel-level thread_. Un gran número de _kernel-level threads_ puede sobrecargar el rendimiento de un sistema.

## _Many-to-Many Model_

The many-to-many model multiplexes many user-level threads to a smaller or equal number of kernel threads.

Es muy difícil de implementar y la gran mayoría de los sistemas operativos hacen uso del one-to-one model.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8bac0bf9-83df-4b77-ae3e-711431667e6d/Untitled.png)

# Thread Scheduling

## _Overview_

Como el kernel despacha _kernel-level threads_, para ejecutar en la CPU, los _user-level threads_ deben estar mapeados a un _kernel level thread_. Ya mencionamos como es posible relacionar los threads entre sí pero, ¿Cómo se realiza este mapeo?

Este mapeo por lo general se hace con una estructura de datos auxiliar llamada _lightweight process_ (LWP).

> _Lightweight process:_ A virtual processor-like data structure allowing a user thread to map to a kernel thread. To the user-thread library, the LWP appears to be a virtual processor on which the application can schedule a user thread to run. An application may require any number of LWPs to run efficiently

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b230eec3-1cfa-43b6-9198-5913c72bde39/Untitled.png)

## _Contention Scope_

En los sistemas que implementan los modelos many-to-one y many-to-many, la librería de hilos despacha _user-level threads_ para ejecutarse en un Lightweight Process (LWP) disponible.

Este esquema es conocido como _**Process-Contention Scope (PCS)**_, en el cual la competencia por la CPU tiene lugar entre los hilos pertenecientes al mismo proceso.

Cuando decimos que la librería despacha los hilos ULT en los LWPs, no significa que los hilos estén realmente ejecutando en una CPU ya que todavía requiere que el SO despache el LWPs en una CPU física.

Justamente, el kernel, para decidir que _kernel-level thread_ despachar en una CPU, usa _**System-Contention Scope (SCS)**_. Con lo cual, la competencia por la CPU con SCS tiene lugar entre todos los hilos en el sistema.

Típicamente el despacho PCS se realiza por prioridad:

- El Scheduler de hilos selecciona el hilo ejecutable de mayor prioridad para ejecutar.
- Las prioridades de ULT son:
    - Establecidas por el programador.
    - No ajustadas por la librería de hilos.
- PCS desaloja típicamente en favor de un hilo con mayor prioridad. No hay garantía de tiempo compartido entre hilos de igual prioridad.

# Multi-Processor Scheduling

Hasta el momento, solamente hablamos de scheduling en sistemas de un solo core. Si ahora escalamos a un sistema con múltiples cores, es posible llevar acabo lo que se conoce como _load sharing_ (balanceo de carga)_._

> _Load sharing:_ the ability of a system with multiple CPU cores to schedule threads on those cores.

Bajo este nuevo enfoque, multiples threads pueden correr en paralelo, sin embargo el despacho se torna una tarea mas compleja.

¿Que significa el termino _multiprocessor_?

Inicialmente, se refería a sistemas que proporcionaban múltiples procesadores físicos, donde cada procesador contenía un solo CPU core. Sin embargo, la definición fue evolucionado significativamente, y en los sistemas informáticos modernos, _multiprocessor_ aplica a las siguientes arquitecturas de sistema:

- Multicore CPUs.
- Multithreaded cores.
- NUMA systems.
- Heterogeneous multiprocessing.

<aside> 💡 Los CPU cores pueden tener distintas características en términos de funcionalidad.

</aside>

## Approaches to Multiple-Processor Scheduling

### Asymmetric multiprocessing

Una estrategia es ejecutar el dispatcher, todas las operaciones de E/S y todas las funciones del kernel en un único core mientras que los restantes ejecutan solamente código de usuario.

- Pros
    
    Estrategia simple porque solamente un core accede las estructuras del kernel reduciendo los problemas de concurrencia.
    
- Contras
    
    El proceso “master” se convierte en un posible cuello de botella reduciendo la performance del sistema.
    

### Symmetric multiprocessing (SMP)

Cada procesador es _self-scheduling, e_n otras palabras, el scheduler revisa la cola de listos para cada core y selecciona el proceso a ejecutar. Esto nos evidencia dos posibles estrategias:

- Todos los threads pueden estar en una única cola de listos
    
    Con esta opción presentamos posibles condiciones de carrera sobre la cola de listos compartida, ya que tenemos que asegurarnos que un mismo proceso no se despache en dos procesadores.
    
- Cada core tiene su propia cola de listos privada
    
    - Permite a cada core despachar procesos de su propia cola privada.
    - No sufre de degradación de performance asociada a una cola única de procesos listos.
    - Uso más eficiente de la memoria cache (localidad).
    - Se pueden usar algoritmos de balanceo de carga para ecualizar la carga entre los cores.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7abb60a7-6d4b-4559-a396-4f72a816dfb8/Untitled.png)

<aside> 💡 Todos los sistemas operativos modernos soportan multiprocesamiento SMP incluyendo Windows, Linux, y macOS así como sistemas móviles como Android y iOS.

</aside>

## _Multicore Processors_

Los sistemas SMP han permitido que varios threads se ejecuten en paralelo por proporcionar múltiples procesadores físicos (cada procesador contenía un solo CPU core).

Sin embargo, a medida que el hardware fue evolucionado, la nueva tendencia consistió en ubicar multiples cores en el mismo chip físico ; de ahí surge el concepto de procesador multinúcleo o multicore.

Cada core mantiene su estado y por lo tanto, el sistema operativo los reconoce a todos como si fueran múltiples procesadores fiscus. Los sistemas SMP que aprovechan esto, son más rápidos y consumen menos energía que los sistemas donde cada procesador tiene un único core.

**Problema: _memory stall_**

En Arqui vimos que cuando un proceso necesita acceder a memoria (para este ejemplo, leer de memoria), este pasa una cantidad significativa de tiempo esperando a que los datos estén disponibles (i.e. la operación acceso a memoria es muy costosa). A esto se lo conoce como _memory stall_ (básicamente ocurre cuando queremos acceder a un dato que no está en la cache).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9c068e0c-08d9-486b-885c-0996fde49cc3/Untitled.png)

Si a esto le sumamos el hecho de que el procesador ahora es mucho más rápido para despachar procesos y ejecutarlos, tendremos múltiples procesos que en cierto instante, quizás quieran acceder a memoria y estaríamos perdiendo un tiempo significante esperando a que estas operaciones se lleven acabo.

<aside> 💡 Los procesadores modernos operan a una velocidad muy superior a la de la memoria.

</aside>

**Solución: _Chip multithreading_**

Para remediar esta situación, muchos diseños de hardware recientes han implementado core de procesamiento multihilo (multithreaded processing cores) en los que dos (o más) hardware threads son asignados a cada core.

- Flashbacks de Arqui - Intel _hyper-threading_
    
    Los procesadores Intel utilizan el término _hyper-threading_ para describir la asignación de múltiples threads de hardware a un solo core. Los procesadores Intel contemporáneos, como el i7, admiten dos threads por núcleo, mientras que el procesador Oracle Sparc M7 admite ocho hilos por núcleo, con ocho núcleos por procesador, proporcionando así el funcionamiento sistema con 64 CPU lógicas.
    

> _Hardware threads:_ Threads associated with the processing core. A given CPU core may run multiple hardware threads to optimize core use—e.g., to avoid memory stalls by switching hardware threads if the current thread causes a stall.

De esa manera, si un thread de hardware se detiene a la espera de la memoria, el core puede _switchear_ a otro thread.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f20059f7-13d6-441a-87a1-f9f57b52a562/Untitled.png)

> From an operating system perspective, each hardware thread maintains its architectural state, such as instruction pointer and register set, and thus appears as a logical CPU that is available to run a software thread.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e4b30737-09a6-4f89-bd06-9327d152a17e/Untitled.png)

### _Coarse-grained vs fine-graine_

- Coarse-grained
    - Un thread se ejecuta en un core hasta que se produzca un evento de latencia larga (memory stall) _switcheando_ a la ejecucion de otro thread.
    - El costo de hacer un _context-switch_ entre threads es alto, ya que el pipeline de instrucciones debe vaciarse antes de que el otro thread pueda comenzar la ejecución en el core del procesador. Una vez que este nuevo hilo comienza a ejecutarse, comienza a llenarse el pipeline con sus instrucciones.
- Fine-grained
    - Un thread switchea normalmente en el límite de un ciclo de instrucción.
    - El costo de switchear entre procesos es menor.

### _Niveles de despacho_

Es importante tener en cuenta que los recursos del core (caches y pipeline) deben compartirse entre los threads de hardware y, por lo tanto, un core puede ejecutar un thread de hardware a la vez. En consecuencia, un procesador multiproceso y multinúcleo en realidad requiere dos niveles diferentes de scheduling.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/02440768-200a-49ad-8231-97652efa2952/Untitled.png)

1. El SO decide qué hilo de software se va a correr en una CPU lógica (o hardware thread).
2. Cada core decide qué hilo de hardware ejecutar en el core físico.

Para el primer nivel, la decisión se toma en base a los algoritmos que vimos en [simple core](https://www.notion.so/CPU-Scheduling-Single-Core-8d831ad054ce453db483d98406ecc929?pvs=21).

Para el segundo nivel podemos adoptar el uso de Round Robin o el approach que hicieron con el Intel Itanium.

<aside> 💡 Si el sistema operativo conoce los recursos compartidos del procesador (cantidad de cores físicos y hardware threads) puede realizar operaciones de scheduling más eficientes.

</aside>

## _Load Balancing_

> On SMP systems, it is important to keep the workload balanced among all processors to fully utilize the benefits of having more than one processor. Otherwise, one or more processors may sit idle while other processors have high workloads, along with ready queues of threads awaiting the CPU.

De aquí surge la necesidad del _load balance_ que intenta equilibrar la carga repartida entre los procesadores de un sistema SMP y tiene sentido únicamente en aquellos sistemas donde los cores tienen su propia cola de listos privada.

### _Estrategias_

- _Push migration_
    
    Una tarea específica comprueba periódicamente la carga en cada procesador y, si encuentra un desequilibrio, distribuye uniformemente la carga moviendo (o pusheando) threads de procesadores sobrecargados a procesadores inactivos o menos ocupados.
    
- _Pull migration_
    
    Se produce cuando un procesador inactivo extrae una tarea en espera desde un procesador ocupado.
    

<aside> 💡 No tienen por que implementarse una o la otra, el CFS Scheduler de Linux hace uso de las dos.

</aside>

Sin embargo, el concepto de balance de carga puede tener distintas interpretaciones. A continuación mencionamos algunas:

- Que todas las colas tengan la misma cantidad de threads
- Que haya la misma cantidad de threads de una prioridad particular distribuidos en todas las colas.

## _Processor Afinity_

Cuando un proceso está ejecutándose en un procesador, la caché de ese procesador contiene los accesos a memoria de ese proceso. Decimos que el proceso tiene afinidad por ese procesador (_warm cache_).

Las dos estrategias planteadas en SMP tienen una implicación en la afinidad del procesador al igual que el load balance.

- Si adoptamos una sola cola para todos los procesos, un hilo puede ser seleccionado por cualquier procesador. Esto significa que tendremos que cargar la caché nuevamente con los accesos a memoria que más utiliza dicho proceso (repopular la caché) que termina siendo ineficiente.
- Si adoptados una cola por cada procesador, el thread puede _scheduleado_ en el mismo procesador y, por lo tanto, puede benefíciese del contenido de la cache.

### Políticas

_**Soft affinity:**_ An operating system has a policy of attempting to keep a process running on the same processor but not guaranteeing that it will do so.

Here, the operating system will attempt to keep a process on a single processor, but it is possible for a process to migrate between processors during load balancing.

_**Hard affinity:**_

Allows a process to specify a subset of processors on which it can run.

<aside> 💡 Linux usa _soft affinity_

</aside>

### NUMA and CPU Scheduling

**NUMA:** non uniform memory access.

En la imagen vemos dos _physical processor chips_ distintos. Cada uno con su propia CPU y memoria local. Ambas tiene accesos más rápidos a su propia memoria local que a la memoria local de la otra por más de que entre sí estén interconectadas.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6058a3b1-c71b-423e-95b9-a50e8a4ccf9f/Untitled.png)

> If the operating system’s CPU scheduler and memory-placement algorithms are NUMA-aware and work together, then a thread that has been scheduled onto a particular CPU can be allocated memory closest to where the CPU resides, thus providing the thread the fastest possible memory access.