# Mapeo Físico x86

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/53245758-8a83-4fed-b947-a8833def200f/Untitled.png)

**¿Qué memoria real voy a poder a utilizar?**

Depende del arrastre histórico de cada empresa.

Recordemos que los dispositivos de E/S están mapeados en memoria.

Por ejemplo, Intel estaba centrado en la compatibilidad hacia atrás. Entonces siempre se mantendrá ese esquema en memoria RAM.

# Direcciones virtuales Linux

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9649d207-0fa2-4792-a417-a38a9c3f7b8b/Untitled.png)

En memoria virtual (32 bits), el Kernel va a parar en las direcciones más altas hasta una variable que tiene el Kernel que se llama **`CONFIG_PAGE_OFFSET`.**

**Ese el límite que se le pone al Kernel. Si necesito más espacio tengo que sacrificar direcciones de más abajo modificando la variable.**

Para cualquier otro proceso de usuario, deja 3GB.

En mis tablas de paginas esta el Kernel y para acceder tengo que obtener el modo Kernel. Puedo obtener ese permiso cuando por ejemplo se produce una interrupción.

## _Tipos de direcciones virtuales en Linux_

### **Kernel**

- Direcciones lógicas del kernel
    
    Se mapean contiguas en memoria real y no están sujetas a paginación (no paginables). Siempre están presentes en memoria y es imposible que sean robadas (swapped out). Esto las hace ideales para transferencias DMA (direct memory access).
    
    Pueden ser convertidas a o desde direcciones físicas usando las macros
    
    - _pa(x)
    - _va(x)
- Direcciones virtuales del kernel
    
    Son paginables y pueden ser expulsadas de la memoria real.
    
    En estas direcciones se mapean los dispositivos en memoria del kernel.
    

¿Cual es la diferencia entre dirección lógica y virtual?

**Parte** del Kernel va a estar fijo en memoria real. La otra parte es susceptible de paginación por demanda.

A la parte fija y mapeada en memoria la vamos a denominar como direcciones lógicas. Las direcciones virtuales tienen un offset fijo respecto de sus direcciones físicas y están en el espacio del Kernel en memoria virtual y no están presentes en memoria física.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a01fbf45-f4a9-4f3b-b8f0-1b76b4bbadf8/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/599441de-e9e6-4a17-8297-6e3c58092de0/Untitled.png)

Compite el espacio de usuario y ese cachito en celeste de arriba de todo por la RAM.

### **Usuario**

- Direcciones virtuales de usuario
    
    El espacio virtual de usuario no tiene garantía de estar en memoria y cada proceso tiene su espacio de direcciones virtuales.
    
    No se pueden fijar paginas (a no ser que sea root y ejecute una syscall en particular).
    
    Cada proceso tiene su mapeo en memoria física y hacen pleno uso de la MMU.
    
    - Los procesos no están contiguos en memoria RAM y las páginas pueden no llegar a estar contiguas también.
    - Los procesos pueden sufrir de swapped-out
    - El mapeo se cambia como parte del cambio de contexto

## Dato interesante que puede ser util para muchos ejercicios
Linux hace es de hacer _lazy allocations._

# System Model

Un sistema consiste en un numero finito de recursos que se distribuyen en un numero finito de threads que compiten entre si por esos recursos. Los recursos se pueden dividir en **clases** (o tipos de recursos), cada una de las cuales consta de un cierto número de instancias idénticas. Por ejemplo, si nuestro sistema tiene 4 cores de CPU, **decimos que el recurso CPU tiene 4 instancias**.

**¿Como utilizan los recursos los threads?**

- Request
    
    Un thread pide un recurso. Si la request no puede efectuarse porque todas las instancias del recurso estan siendo utilizadas, el thread que pidió el recurso **espera** hasta poder adquirirlo.
    
- Use
    
    El thread opera con la instancia del recurso.
    
- Release
    
    El thread libera la instancia del recurso.
    

Request and release pueden ser:

- System calls (open y close de un file o malloc y free para asignar memoria dinámica)
- Un wait y signal sobre un semáforo o las operaciones correspondientes a un mutex.

**¿Como se sabe si un recurso está siendo utilizado o no?**

El Kernel maneja una tabla donde se registra si las instancias de un recurso están siendo utilizadas o no. Para el caso que un recurso se esta utilizando, adicionalmente se almacena el thread que lo esta utilizando.

# Caracterización de un Deadlock

**¿Que significa que dos o más threads entren en deadlock?**

Un conjunto de threads entran en deadlock cuando cada thread del conjunto **está esperando un evento que solo puede ser causado por otro thread del mismo conjunto**. Con evento nos referimos principalmente a la adquisición y liberación de recursos.

- Ejemplo - Filósofos comensales
    
    En este ejemplo, el recurso son los palillos para comer. Si todos los filósofos tienen hambre en el mismo instante, automáticamente cada uno de ellos intentara toma el palillo de la izquierda primero y luego el de la derecha. Pero si todos toman en el mismo instante el palillo de la izquierda, ninguno de ellos podra tomar el palillo de la derecha. Todos los filosofos se bloquearan esperando a que el palillo de la derecha este disponible.
    

**¿Que características se tienen que cumplir simultáneamente para que un deadlock ocurra?**

- Mutual exclusion
    
    Solamente un proceso a la vez puede usar un recurso. Si otro thread solicita el recurso, debe quedar esperando hasta que este se libere (_i.e_. el recurso **NO** es de uso compartido).
    
- Hold and wait
    
    Todos los threads involucrados tienen algún recurso retenido y a su vez esperan por otro/s recursos/s que esta/n siendo retenido/s por otro/s thread/s.
    
- No preemption
    
    Los recursos sólo pueden ser liberados voluntariamente por el thread que los retiene una vez que finalizen su tarea.
    
- Circular wait
    
    Existe un conjunto de threads bloqueados tal que $T_0$ espera por un recurso que tiene $T_2$ y $T_2$ espera por un recurso que tiene $T_n$ quien a su vez espera por un recurso que tiene $T_1$.
    

Si bien no son independientes las 4 condiciones (circular wait implica hold and wait) conviene considerarlas como independientes y trátalas a cada una por separado.

## _System resource-allocation graph_

Podemos describir con mayor precisión a los deadlocks en términos de un grafo dirigido.

El grafo consiste en un conjunto de vertices $V$ y un conjunto de aristas $E$.

$V$ esta formado por:

- Un conjunto de threads activos $T_i$. Se suelen representar con círculos.
- Un conjunto de todos los recursos del sistema $R_i$. Se suelen representar con rectángulos.

Una arista dirigida $T_i \rightarrow R_j$ significa que el thread $T_i$ solicito una instancia de un recurso $R_j$ y se conoce como _**request edge**_. Una arista dirigida en el sentido inverso, significa que una instancia del recurso $R_j$ fue asignada al proceso $T_i$ y se conoce como _**assignment edge**_.

Cada instancia de un recurso $R_j$ se simboliza con un puntito negro en el interior del rectángulo. Un _request edge_ solamente apunta al rectángulo, mientras que un _assignment edge_ sale desde un puntito negro hacia un thread.

<aside> ‼️ Se puede demostrar que si el grafo no contiene ciclos, no hay deadlock. Si el grafo contiene al menos un ciclo, puede existir la posibilidad de que esté en deadlock el sistema.

</aside>

_**Nota:**_ Para el caso que tengamos una instancia de cada recurso, con tener un ciclo, automáticamente implicamos que hay deadlock.

- Ejemplo 1
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/97141b7a-4522-4492-b06c-8dcba4ab50ab/Untitled.png)
    
    $$ T=\{T_1,T_2,T_3\} \\ R=\{R_1,R_2,R_3,R_4\} \\ E=\{T_1 \rightarrow R_1, T_2 \rightarrow R_3, R_1 \rightarrow T_2, R_2 \rightarrow T_2, R_2 \rightarrow T_1, R_3 \rightarrow T_3\} $$
    
    **Instancias:**
    
    - 1 instancia de $R_1$
    - 2 instancias de $R_2$
    - 1 instancia de $R_3$
    - 3 instancias de $R_4$
    
    **Estados de los threads:**
    
    - $T_1$ contiene una instancia del recurso $R_2$ y esta esperando que la instancia del recurso $R_1$ se libere.
    - $T_2$ contiene una instancia del recurso $R_1$ y una del recurso $R_2$ y esta esperando que la instancia de $R_3$ se libere.
    - $T_3$ contiene una instancia del recurso $R_3$.
- Ejemplo 2
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0a28fc5f-6a00-474e-a96e-70b2763ad8a2/Untitled.png)
    
    Se cumplen las 4 condiciones.
    
    $T_2$ esta esperando por la instancia del recurso $R_3$ que lo tiene $T_3$. $T_3$ esta esperando a que $T_1$ o $T_2$ liberen alguna instancia del recurso $R_2$. $T_1$ esta esperando a que $T_2$ libere la instancia del recurso $R_1$.
    
- Ejemplo 3
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/25b49cfc-fdf4-47f1-ac29-85b65de60f5a/Untitled.png)
    
    Observemos que no hay deadlock. Tanto $T_4$ como $T_2$ pueden liberar su recurso generando que se rompa el ciclo.
    

# Methods for handling deadlocks

Podemos tratar el problema del deadlock de alguna de las siguientes formas:

- Ignorar el problema y pretender que nunca va a ocurrir (Usada por muchos SO incluyendo UNIX porque es mas barato a nivel computacional).
- Podemos hacer uso de un protocolo para prevenir o evitar deadlocks.
    - Deadlock prevention
    - Deadlock avoidance
- Permitir que el sistema ingrese en un estado de abrazo mortal y luego recuperarlo.
    - Deadlock detection
    - Recovery from Deadlock

## _Deadlock prevention_

Este método proporciona un conjunto de algoritmos (estrategias) para garantizar que al menos una de las cuatro condiciones necesarias para que se produzca un deadlock no se cumpla o no se pueda mantener.

- Para romper con la exclusion mutua, podemos utilizar recursos compartidos.

<aside> ‼️ **Problema:** No siempre podemos utilizar recursos compartidos.

</aside>

- Para romper con el hold and wait, debemos garantizar que cuando un thread solicita un recurso, antes de adquirirlo debe liberar cualquier otro recurso que este usando.
    - Un protocolo posible consiste en darle a cada thread todos los recursos que necesita antes de que pueda correr.
    - Otro protocolo posible es permitirle al thread que pida ciertos recursos solamente cuando no tenga ninguno. Es decir, un thread puede hacer un pedido de ciertos recursos pero no puede pedir mas hasta que no libere los que pidió previamente.

<aside> ‼️

**Problemas con ambos protocolos:** posible inanición y baja utilización de recursos.

</aside>

- Para romper con el no preemption, claramente ahora la vamos a permitir.
    - Si un thread tiene ciertos recursos y solicita uno adicional pero este ultimo no esta disponible, automáticamente se liberan todos los recursos que contiene el thread. El thread sera ejecutado nuevamente solamente cuando todos los recursos estén disponibles para que el thread pueda ejecutarse.
    - Si un thread tiene ciertos recursos y solicita uno adicional pero este ultimo no esta disponible, chequeamos si los threads que están usando el recurso que necesita este thread están esperando por otros recursos. En el caso de ser así, le quitamos el recurso a uno de esos procesos y se lo asignamos al que lo solicito. En el caso de estar todos ocupados, el thread debe esperar (y además, puede perder recursos). Un thread puede ejecutarse nuevamente cuando los nuevos recursos solicitados fueron adquiridos y cuando recupere todos los otros recursos que fueron “robados” por los otros threads.

<aside> ‼️ **Problema:** Esta estrategia se aplica a menudo a recursos cuyo estado se puede guardar y restaurar fácilmente más tarde, como registros de CPU y transacciones de bases de datos. Por lo general, no se puede aplicar a recursos tales como mutex y semáforos (que es con lo que podemos ocasionar deadlocks con mayor frecuencia).

</aside>

- Si bien las otras 3 son medio imprácticas para ciertos casos, invalidar la condición de circular wait es la mejor opción como veremos a continuación.
    - Una forma de garantizar que esta condición nunca se mantenga es imponer un orden total de todos los tipos de recursos y exigir que cada thread solicite recursos en un orden de enumeración creciente.

<aside> ‼️ **Conclusion:** con estos algoritmos prevenimos deadlocks limitando como se hacen los requests pero disminuimos el throughput del sistema y hacemos una baja frecuencia de uso de los recursos.

</aside>

## _Deadlock avoidance_

Este método requiere que el sistema operativo reciba información adicional por adelantado sobre los recursos que solicitará (en que orden) y utilizará un _thread_ durante su lifecycle. En base a esto el SO tomara la decision de si el thread debe esperar o no.

El método más simple y útil requiere que cada subproceso declare **el número máximo de recursos de cada tipo que pueda necesitar**. Dada esta información a priori, es posible construir un algoritmo que asegure que el sistema nunca entrará en un estado de deadlock. Un algoritmo de _deadlock avoidance_ examina dinámicamente el estado de asignación de recursos para garantizar que nunca pueda existir una condición de espera circular. El estado de asignación de recursos se define por el número de recursos disponibles y asignados y las demandas máximas de los threads.

### Safe state

Un estado es seguro si el sistema puede asignar recursos a cada thread (hasta su máximo) en algún orden y aún así evitar el deadlock (i.e. si existe una secuencia segura).

Una secuencia de threads **es una secuencia segura para el estado de asignación actual si** para cada $T_i$, los recursos que solicita $T_i$ aún pueden satisfacerse con los recursos disponibles actualmente más los recursos en poder de todos los $T_j$ con $j < i$.

### Banker algorithm

- El thread declara la maxima cantidad de instancias de un recurso que que puede necesitar.
- En base a eso, se busca un caso que sea seguro para repartir las instancias de los recursos sin entrar en deadlock. Si existe al menos una forma de repartir las instancias, el estado es seguro.

[Deadlock Avoidance: Banker's Algorithm with example | Operating System](https://www.youtube.com/watch?v=bYFVbzLLxfY)

[Simulación - Algoritmo del Banquero](https://www.victorvr.com/project/simulacion-algoritmo-del-banquero)

- Ejemplo de Horacio
    
    Un banco con un capital en pesos tiene que prestar a 3 inversores.
    
    El algoritmo del banquero evalúa lo siguiente:
    
    ¿Existe una secuencia en la cual pueda garantizar que los procesos terminen sin deadlock? Sí → entonces existe un estado seguro. Si la respuesta es no, es un estado inseguro.
    
    De esta forma ilustramos el uso de UN solo recurso.
    
    Un banco con un capital en monedas diferentes tiene que prestar a 3 inversores.
    
    Extensión del algoritmo del banquero: ahora tengo más de una moneda.
    
    ¿Existe una secuencia en la cual pueda garantizar que los procesos terminen sin deadlock? Sí → entonces existe un estado seguro. Si la respuesta es no, es un estado inseguro.
    
    De esta forma ilustramos distintos recursos.
    

## _Deadlock detection_

Si un sistema no implementa un deadlock prevention o avoidance algorithm, entonces un deadlock puede ocurrir. El sistema puede proveer:

- Un algoritmo que examina el estado del sistema para determinar si un deadlock ocurrió
- Un algoritmo para recuperarse del deadlock.

Para recuperarse del deadlock hay opciones:

- Matar a todos los threads que estén en estado deadlock
- Matar de a uno a los threads hasta que se rompa el deadlock
- Podemos robar recursos entre threads que estén en deadlock hasta romper el ciclo.