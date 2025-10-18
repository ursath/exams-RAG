# Linux

Distingue procesos:

- Real time (soft o hard)
    - _**Hard real time:**_ el tiempo de ejecución es absolutamente crítico (sistemas delicados que cumplen una dicha función).
    - _**Soft real time:**_ El tiempo de respuesta es deseable pero no crítico (aplicaciones de audio y video).
- Normales
    - Interactivos.
    - Batch.

Cuando un proceso se considera real time, siempre permanecerá en esa categoría.

Un proceso puede actuar un tiempo como interactivo y luego convertirse en uno batch. Linux emplea una lógica compleja en base al comportamiento histórico si un proceso debe considerarse batch o interactivo.

## _Historia de los schedulers de Linux_

_**Algoritmos de orden N:**_ El tiempo que le consume al dispatcher hacer su elección crece a medida que hay más procesos. Recorre toda la lista de procesos, calcula prioridades y selecciona el proceso a ejecutar.

_**Algoritmos de orden 1:**_ El tiempo de selección del dispatcher es independiente de la cantidad de procesos que hay. Hay varias colas de prioridades.

- Las prioridades 0 a 99 se usan para procesos real time.
- La prioridad máxima para un proceso normal es 100 y la más baja es 139.
- La prioridad base por default es 120.

_**CFS (completely fair scheduler):**_ es justo con todas las categorías de procesos.

## _Scheduling de procesos normales - Orden (1)_

_**Nota:**_ Se van a trabajar con estos procesos cuando no haya nadie esperando en las colas de más alto nivel (real time).

Cada cola tiene 40 clases de prioridades donde 100 es la más alta y 139 la más baja. En cada procesador hay dos colas de listos.

El scheduler agarra un proceso de la cola activa de la prioridad más alta, lo ejecuta y luego de un quantum de tiempo, lo pasa a una cola de expirados. Así con todos los procesos de una prioridad. Baja a la próxima prioridad y hace lo mismo con todos los procesos hasta que los pasa al estado de expirados.

Una vez que el scheduler expira todos los procesos de todas las colas, los vuelve a poner en la cola de activos y empieza de nuevo.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/74f8d462-7640-40b0-961a-cba5e4f3301f/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/de2954ee-d0e9-432e-8a4f-9b7ec74c5da1/Untitled.png)

Cuando llega un nuevo proceso (por default se lo inserta en la prioridad 120), dependiendo su comportamiento, puede subir o bajar en las prioridades.

**¿Cómo hacemos para calcular en que cola de ejecución se coloca cada proceso?**

Se calcula una prioridad de manera dinámica. Se utiliza un “bono” que cambia de acuerdo a una heurística (tiempo promedio de inactividad).

$$ prioridad \; dinamica=MAX (100, MIN(prioridad \; estática - bono + 5, 139)) $$

**¿Como calculamos la prioridad estática?**

El nice es un valor que representa la prioridad de un proceso para linux.

Los valores de _nice_ oscilan entre −20 y +19, donde un valor de nice numéricamente más bajo indica una prioridad relativa más alta. Las tareas con _nice_ más bajos reciben una mayor proporción del tiempo de procesamiento de la CPU que las tareas con valores más altos.

Para calcular la prioridad estática hacemos:

$$ prioridad \; estatica = nice + 120 $$

No importa el valor de nice que tenga un proceso. El valor de la prioridad dinámica se vera influenciada tambien por el bono que se le asigne al proceso. De esta forma, evitamos la inanición ya que los procesos no solo están influenciados por la prioridad de linux, sino por el tiempo de CPU que consumen.

Podemos forzar el valor de nice de un proceso con el comando _nice_ de Linux.

El valor nice predeterminado es 0.

- ¿Por qué se lo llama nice?
    
    El término nice proviene de la idea de que si una tarea aumenta su valor nice de, digamos, 0 a +10, está siendo amable con otras tareas del sistema al reducir su prioridad relativa. En otros palabras, ¡buenos procesos terminan en último lugar!
    

**¿Cómo hacemos para distinguir entre batch y interactive processes?**

El bono es un valor entre 0 y 10:

- Si el valor es menor a 5 implica menor interacción con el usuario, entonces es un proceso CPU-Bound. La prioridad decrementa hacia 139.
- Si el valor es mayor a 5, implica más interacción con el usuario. La prioridad dinámica se incrementa hacia 100.

Entonces, gracias al bono podemos distinguir entre procesos batch e interactivos ya que está basado en el tiempo promedio de inactividad.

- Un proceso I/O bound tendrá mayores tiempos de inactividad, con lo cual logrará mayor prioridad.
- Un proceso CPU bound tendrá menores tiempos de inactividad, con lo cual tendrá menor prioridad.

Cada vez que un proceso pasa de activo a expirado, se recalcula su bono y por ende su prioridad.

### Estableciendo un quantum

El quantum de tiempo es establecido en base a la prioridad dinámica.

Los procesos interactivos tienen mayor prioridad y se les asigna el mayor quantum para asegurarse que completen su ráfaga sin interrupción.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4c5f2903-f22e-49f5-9982-7d95b24086fb/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/73a4d30f-a7da-4324-a950-c79c1655bd1a/Untitled.png)

**Problema**

- Los procesos tienen un cambio en el valor de quantum muy brusco a medida que pierden prioridad (ver tabla).
- Heurística muy compleja para distinguir procesos batch de procesos interactivos.
- Hay una fuerte dependencia entre el quantum y la prioridad.

## _Completely Fair Scheduling_

Idealmente, se busca dividir el tiempo del procesador entre los procesos de manera equitativa. Si hay $n$ procesos en el sistema, cada uno debería obtener $\frac{t}{n}$ tiempo del procesador siendo $t$ el _sched_latency_.

No hay prioridades, ni distinciones de los procesos, ni heurísticas. Es preemptive.

Se calcula un _**virtual runtime:**_ el tiempo acumulado que el procesador le lleva dedicado a cada proceso. Es un valor que en cada ráfaga de CPU incrementa su valor con un quantum que se calcula dinámicamente.

Cuando el dispatcher debe elegir un proceso:

1. Toma el proceso con el menor _vruntime_.
2. Calcula el quantum dinámicamente (se divide el _sched_latency_ por la cantidad de procesos corriendo $\frac{t}{n}$).
3. Programa el timer con ese quantum.

El proceso comienza a ejecutarse y cuando llega una interrupción, se realiza un cambio de contexto si hay un proceso con menor _vruntime_.

Por cada timer tick que interrumpa en un cierto quantum determinado, se recalcula la prioridad de cada proceso.

### Seleccionando el próximo proceso a ejecutarse

CFS usa un Red Black Tree donde cada nodo representa una tarea ejecutable. Los nodos se ordenan en ese árbol según su _vruntime_.

En un RBT, los nodos del subárbol izquierdo tienen menor _vruntime_ comparados con los del subárbol derecho. Por lo tanto, el nodo de más abajo a la izquierda tiene menor runtime.

![download.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57646701-dc11-4aaf-bc7a-c1e86a8d560c/download.png)

Durante un cambio de contexto, se busca el nodo de más a la izquierda. Para ello es importante tener apuntado con un puntero dicho nodo (_rb_leftmost_). De esta forma el algoritmo tiene complejidad $O(1)$.

Si el proceso es ejecutable (es decir, esta listo y no bloqueado), se lo inserta en el con su _vruntime_ con complejidad $O(\log n)$.

Las tareas se van ejecutando de izquierda a derecha evitando así la inacción.

**¿Por qué un RBT?**

- Se autobalancea garantizando que todas las operaciones sean $O(\log n)$.
- Ningún camino del árbol será más del doble de largo que cualquier otro camino del árbol.

### Ajustar el _vruntime_

Se utiliza el valor de _nice_ para ajustar el _vruntime_. La prioridad de acuerdo al valor de nice se usa para ajustar el vruntime.

Si un proceso se ejecutó durante $t$ mseg:

$$ vruntime\; += t*(peso \; de \; acuerdo \; a \; su \; valor \; de \; nice). $$

Una menor prioridad implica que el tiempo se mueve más rápido que para un proceso de mayor prioridad.

Los procesos de I/O bound tienden a estar más a la izquierda que los CPU bounds porque tienen ráfagas más pequeñas.

### Inserción de nuevos procesos

Los nuevos procesos son agregados al RBT con un valor _min_vruntime_ para asegurarse que sean ejecutados rápidamente y alcancen al resto.
