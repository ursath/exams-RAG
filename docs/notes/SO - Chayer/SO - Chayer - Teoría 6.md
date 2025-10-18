# Controladores de periféricos

<aside> 🔑

Los controladores de los periféricos interrumpen al procesador. Por ejemplo, presiono una tecla del teclado, el controlador del teclado interrumpe al procesador. El controlador del timer tick también.

</aside>

- Tiempo requerido para acceder a un periférico (acceso a un disco): milisegundos.
- Tiempo en ejecutar una instrucción: nanosegundos.

Por lo tanto, la cantidad de instrucciones que se ejecutan para acceder a un periférico son muchísimas.

¿Es necesario que el procesador esté controlando la operación de entrada salida sabiendo que se tarda bastante tiempo?

Algunas operaciones de `I/O`, como accesos a disco, tardan mucho tiempo en realizarse. Antes, los discos precisaban que el `uP` esté constantemente controlando esta operación, pero hoy en día se usan controladores de discos, que básicamente reciben el comando de qué hacer y avisan al `uP` mediante una interrupción cuando la operación terminó.

Esto es algo que el scheduler tiene que tomar en cuenta. No tiene sentido que mientras un proceso está esperando algo de `I/O` no pueda correr otro proceso.

Entonces, podemos pensar que un proceso está compuesto de ráfagas de `CPU` y hay un tiempo que se dedica a procesos de `I/O`.

Si tenemos 3 procesos: P1, P2 y P3, un único core multiproceso, y suponiendo que el scheduler los corre en orden, el esquema de ejecución no es como uno pensaría:

P1__P2__P3

Se corren de la siguiente forma:

|__ cpu(p1) _||_******e/s******_||_ cpu(p1) _||____ e/s_____||_ cpu(p1)_|

```
                     |__ cpu(p2) _||______e/s______||_ cpu(p2) _| 
```

Aún cuando tengamos un único core necesitamos un controlador que maneje múltiples procesos. No tenemos manera de switchear o darle el procesador a otra tarea.

Si no fuera multiproceso, el procesador quedaría todo en línea:

|__ cpu(p1) _||_******e/s******_||_ cpu(p1) _||____ e/s_____||_ cpu(p2)_||____ e/s_____||_ cpu(p2) _|

# Diagrama de estados

Un proceso en un SO multi-proceso puede estar en distintos estados. Los más simples son: Listo, Ejecución, E/S.

- _**Listo**_ significa que el proceso está listo para poder ser ejecutado, y el scheduler lo puede elegir y darle tiempo de `uP`.
- _**Ejecución**_ significa que el proceso está corriendo. Es ese tiempo en el que tiene su contexto cargado en el `uP` y está corriendo instrucciones de `CPU`.
- _**E/S**_ significa que el proceso está esperando que ocurra alguna operación de `I/O`, como leer un archivo de disco, y precisa que termine esta operación antes de volver a estar listo para ejecutar.

Cuando un proceso hace una `syscall` para leer un archivo, el proceso pasa a estado _E/S_. Una vez que esta operación termina el proceso se marca como _Listo_, permitiendo que el scheduler pueda volver a elegirlo y ponerlo en _Ejecución_. El timer tick también interrumpe el proceso en ejecución y lo pasa a _Listo_.

Es decir, si un proceso quiere realizar una operación de entrada salida, ese proceso queda en standby hasta que esta operación concluya. Cuando concluye, el proceso se vuelve a poner en la cola de listos esperando a ser elegido nuevamente para correr.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8e7932c1-1ac6-414c-b691-41abd1658d46/Untitled.png)

Si un programa tarda, nos interesa saber en cuál de los estados pasa mayor cantidad de tiempo (listo, ejecución o E/S). Una vez que determinemos dónde ocurre eso, tomamos una decisión de qué modificar, etc.

<aside> 📢 En la realidad tenemos un proceso corriendo por core hasta que se ejecute (si existiera) una operación de entrada salida (una syscall) que “congela” el proceso hasta que esta operación concluye, para finalmente encolarse en la cola de listos.

</aside>

# CPU Scheduling

Recordemos lo siguiente:

- Se despachan threads a nivel del kernel y no procesos.
- Se despachan procesos a nivel de usuario y la librería _pthread_ se encarga de administrar los hilos que se van a ejecutar en el tiempo que le permite el timer tick.

## _Overview - de monocore a multicore_

En un sistema con un solo CPU core puede correrse solo un proceso a la vez. Los otros deben esperar hasta que el core esté libre y el scheduler lo elija para poder correr. Como vimos en Arqui, se intercambiaba en cierto instante el proceso que se adueñaba del procesador por otro. Intercambiando la CPU entre los procesos, el sistema operativo hace que el sistema sea más productivo.

<aside> 💡 Lo que se busca es siempre tener algún proceso ejecutándose para maximizar el uso del procesador.

</aside>

**¿En qué consiste la ejecución de un proceso?**

La idea es relativamente simple. Un proceso se ejecuta hasta que debe **esperar**, normalmente para la finalización de alguna solicitud de E/S.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/90c68a67-8d83-4276-9c8b-36b6c27e2cd4/Untitled.png)

Cada vez que un proceso deba **esperar**, otro proceso hará uso de la CPU. Estos procesos que esperan, se mantienen en memoria física dependiendo del bit de presencia de las páginas.

En un sistema con **múltiples CPU cores** la idea es que todos los cores del sistema estén ocupados.

<aside> 💡 Prácticamente todos los recursos de la computadora son administrados por el sistema operativo para su uso. En particular, el de la CPU, es el principal y fundamental recurso a administrar.

</aside>

## _CPU-E/S Burst Cycle_

Como dijimos, la ejecución de un proceso consiste de un ciclo de ejecución de CPU y un ciclo de espera por una operación de E/S .

El proceso comienza con una ráfaga de CPU, que es seguida de una ráfaga de E/S, que a su vez es seguida por una ráfaga de CPU, y así sucesivamente. Eventualmente, la última ráfaga de CPU utilizaría una syscall para terminar la ejecución del proceso.

## _CPU Scheduler_

Como mencionamos, mientras un proceso espera, la idea es seleccionar otro proceso para que se ejecute en el core que se liberó. Esta tarea la lleva a cabo el CPU Scheduler, que selecciona un proceso de los procesos en memoria que están **listos** (cola de listos) para ejecutarse y le asigna el core a dicho proceso.

No necesariamente es una cola de procesos FIFO. Conceptualmente, los procesos que están **listos** esperan su oportunidad de ser elegidos por el algoritmo de scheduling para poder ejecutarse.

En general, cuando corre un proceso, se suelen ejecutar una gran cantidad de ráfagas de CPU cortas y una pequeña cantidad de rafagas de CPU largas. Esto se debe al tipo de programa que corre:

- Un programa I/O-bound típicamente tiene muchas ráfagas de CPU cortas.
- Un programa CPU-bound tiene pocas ráfagas de CPU largas.

Esta distribución puede ser importante al implementar un algoritmo de administración de CPU (multilevel).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/36524fab-2fee-4104-a3a4-bc4dabc07f33/Untitled.png)

## Preemptive and Nonpreemptive Scheduling

> _Preemptive:_ Done to stop somebody taking action, especially action that will be harmful to yourself (a pre-emptive attack/strike on the military base)

_**Nota:**_ En español es similar a decir preventivo pero se maneja el concepto de desalojable.

Los algoritmos de scheduling de CPU intervienen cuando un proceso:

1. Cambia de ejecución a espera (pedido de E/S, _wait_ por el hijo).
2. Cambia de ejecución a estado de listo (interrupción).
3. Cambia de espera a listo (fin E/S).
4. Termina.

Si nuestro scheduler trabaja únicamente en las situaciones 1 y 4, decimos que hace uso de un algoritmo no desalojable o cooperativo. En los algoritmos no desalojables, una vez que la CPU se adjudica a un proceso, este se mantiene en la CPU hasta que la libera o pasa al estado de espera.

El algoritmo desalojable permite que se le asigne a la CPU otro proceso aunque no esté en espera ni haya terminado (así es como funcionan los sistemas operativos modernos como Linux, Windows, macOS y UNIX). Es decir, un agente externo interrumpe al proceso.

### Características de los algoritmos desalojables

La principal desventaja de los algoritmos desalojables es que pueden resultar en condiciones de carrera (Capitulo 6 de Galvin)

- Ejemplo 1
    
    Consideremos el caso de dos procesos que comparten datos. Mientras un proceso está actualizando los datos, se intercambia (context switch) para que el segundo proceso pueda ejecutarse. Luego, el segundo proceso intenta leer los datos, que se encuentran en un estado inconsistente porque el primero no termino de actualizarlos.
    
- Ejemplo 2
    
    Basado en el ejemplo anterior supongamos que el kernel esta ocupado ejecutando una system call en nombre de un proceso. Supongamos que esa operación implica realizar un cambio en los datos importantes que maneja el kernel (cola de E/S). ¿Que pasa si el proceso se adelanta (desaloja la ejecucion de la syscall) mientras estos cambios se están realizando y el kernel (o controlador) necesita leer o modificar la misma estructura que se estaba modificando previamente? Caos.
    

En base a estos ejemplos, notamos que requerimos de mecanismos como locks de mutex para prevenir el acceso de manera concurrente a estructuras del kernel.

Como las interrupciones pueden ocurrir en cualquier momento y algunas no pueden ser ignoradas, el desalojo de un proceso puede ocurrir en cualquier momento tambien (ya que estos algoritmos se manejan por agentes externos que interrumpen). Para evitar las situaciones de los ejemplos cuando ocurre una interrupción de hardware o syscall se deshabilitan todas las interrupciones (cli) inicialmente y luego de correr la rutina correspondiente, la ultima operación es habilitarlas nuevamente (sti).

Interrupcion → SO → cli → Se llama al dispatcher → El dispatcher despacha la syscall → Se corre la rutina → sti

<aside> ⚠️ Un proceso finaliza su ejecución si renuncia voluntariamente a la CPU (si hace un exit antes de que finalice su tiempo de ejecución o queda pausado) o si es interrumpido por un agente externo.

</aside>

### Características de los algoritmos no desalojables

Un algoritmo no desalojable esperará a que se complete una syscall o a que se bloquee un proceso mientras espera que se complete la E/S antes de realizar un cambio de contexto

Este esquema asegura que la estructura del kernel sea simple, ya que el kernel no desalojara un proceso mientras las estructuras de datos del kernel estén en un estado inconsistente.

Desafortunadamente, este modelo de ejecución del kernel es pobre para soportar la computación en tiempo real.

## _Dispatcher_

El dispatcher es el módulo que le da control de un core de CPU al proceso que fue elegido por el scheduler. Esto involucra:

- El cambio de contexto de un proceso a otro.
- El cambio a modo usuario.
- El salto a la correcta dirección de memoria para continuar el programa.

El dispatcher debe ser lo más rápido posible ya que se invoca por cada cambio de contexto. El tiempo que le toma al dispatcher detener un proceso y continuar con otro se conoce como la _latencia del dispatcher_.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/084fee7a-f626-4e73-b40e-b337834d9faf/Untitled.png)

# Criterios de Scheduling

Se tienen en cuenta muchos criterios para comparar los algoritmos de scheduling y poder elegir cual es el más apropiado para un procesador:

- Utilización de la CPU
    
    Queremos mantener a la CPU tan ocupada como sea posible.
    
- Throughput
    
    Cantidad de procesos que terminan su ejecucion por unidad de tiempo.
    
    - Para procesos largos, esta tasa puede ser un proceso cada varios segundos.
    - Para procesos cortos, puede ser decenas de procesos por segundo.
- Turnaround time (tiempo de retorno)
    
    Cantidad de tiempo que lleva ejecutar un proceso particular.
    
    El intervalo de tiempo se mide desde que inicia el proceso hasta que finaliza. Es decir, que es la suma del tiempo en la cola de listos, el tiempo de ejecución y el tiempo realizando operaciones de E/S.
    
- Waiting time
    
    Es la suma de los períodos de espera en la cola de listos.
    
- Response time
    
    Cantidad de tiempo que lleva desde que un pedido es enviado hasta que se obtiene la primera respuesta.
    

Es deseable:

- Maximizar el uso de CPU.
- Maximizar throughput.
- Minimizar el tiempo de finalización.
- Minimizar el tiempo de espera.
- Minimizar el tiempo de respuesta.

# Scheduling Algorithms - Single core

## _First-Come First-Served Scheduling (FCFS)_

Como su nombre lo indica, el primer proceso que hace el request del core se lo queda.

- Se maneja con una cola FIFO.
    
- Es un algoritmo no desalojable. Una vez que la CPU es adjudicada a un proceso, este se mantiene en uso hasta que termine o se lleve acabo una operación de E/S.
    
- El algoritmo FCFS es particularmente problemático para los sistemas interactivos donde es importante que cada proceso pueda hacer uso de la CPU en intervalos de tiempo regulares y lo mas pronto posible para garantizarle al usuario una buena experiencia interactiva. El promedio de espera es bastante grande.
    
- Problema - Average time waiting
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/56224a6d-16bd-4e45-ad0b-d15ae217fca7/Untitled.png)
    
    Suponiendo que los procesos llegan en ese orden:
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b89b698b-d4f9-4ed5-a051-87743bd7463b/Untitled.png)
    
    Si hacemos las cuentas:
    
    - El waiting time para el proceso $P_1$ es 0 (ms).
    - El waiting time para el proceso $P_2$ es 24 (ms).
    - El waiting time para el proceso $P_3$ es 27 (ms).
    - El avarage waiting time es 17 (ms)
    
    Si los procesos llegaran en el orden $P_2$, $P_3$ y $P_1$:
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2cb4de22-1ce3-4d8b-8263-0c96c93788dc/Untitled.png)
    
    Resulta que el avarage waiting time se reduce a 3 ms.
    
    <aside> 🔑
    
    Podemos concluir que el avarage waiting time bajo las políticas FCFS no suelen ser míniales y pueden variar sustancialmente si los procesos tienen un burst time muy grande.
    
    </aside>
    
- Problema - Efecto convoy
    
    Si tenemos un CPU-bound process con un burst muy grande y varios I/O-bound process con burst muy chico en comparación al CPU-bound process lo que ocurre es que en distintos instantes de tiempo la CPU queda inactiva o los I/O devices quedan inactivos. Esto se debe a que los procesos con burst chiquito esperan a que se el proceso con burst grande termine de realizar las operaciones en la CPU o en los I/O devices.
    
    Se llama convoy effect a esta situacion donde todos los procesos esperan por el proceso con mayor burst a que deje libre la CPU.
    
- Ejemplo
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/38e98597-7930-43eb-965f-c90081c6bbb9/Untitled.png)
    
    - Si dos procesos tienen el mismo arrival time, elegimos el de menor Process ID

## _Shortest-Job-First Scheduling_

Este algoritmo asocia con cada proceso la duración de su próxima ráfaga de CPU. Cuando la CPU esta libre, se le asignará el proceso que tenga la menor ráfaga de CPU. Si llegara a haber dos procesos con el mismo burst time que llegan en el mismo instante, se utiliza FCFS entre ambos para romper con ese empate.

> Note that a more appropriate term for this scheduling method would be the _shortest-next-CPU-burst algorithm_, because scheduling depends on the length of the next CPU burst of a process, rather than its total length.

Parecería ser que, con lo descripto hasta el momento, este algoritmo es óptimo ya que siempre ordena a los procesos de tal forma que el tiempo de espera promedio es mínimo para un conjunto cualquiera de procesos. (i.e. si varios procesos llegan al mismo tiempo, los ejecuta en orden de burst time dejando al más largo al final de todo y al más chico al principio).

**Pero, ¿Cómo es posible conocer las ráfagas de CPU del próximo proceso a ejecutar?**

Ese es el principal problema. Es imposible conocer la longitud de la próxima ráfaga de CPU.

<aside> 💡 Although the SJF algorthm is optimal, it cannot be implemented at the level of short-term CPU scheduling.

</aside>

Se intenta hacer una predicción sobre la próxima ráfaga. Se espera que la próxima ráfaga de CPU sea similar en longitud a la anterior.

Por lo tanto, computando una aproximación de la próxima ráfaga, podemos elegir el proceso con la ráfaga de CPU predicha más corta. La próxima ráfaga de CPU generalmente se predice como un _**promedio exponencial**_ de las longitudes medidas de ráfagas de CPU anteriores:

$$ \tau_{n+1} = \alpha \cdot t_n + (1-\alpha) \cdot \tau_n $$

- $t_n$ es la longitud de la enésima ráfaga de CPU (historia reciente).
- $\tau_n$ almacena la historia. Inicialmente, $\tau_o$ se puede definir como una constante o como un promedio general del sistema.
- $\tau_{n+1}$ es el valor que queremos predecir para nuestra próxima ráfaga de CPU.
- $0 \le \alpha \le 1$

El parámetro $\alpha$ controla el peso relativo de la historia reciente y pasada en nuestra predicción:

- Si $\alpha =0$ entonces $\tau_{n+1} = \tau_n$ y la historia reciente no tiene efecto y las consideramos transitorias.
    
- Si $\alpha =1$ entonces $\tau_{n+1}=t_n$ y solo importa la ráfaga de CPU más reciente y se supone que el historial es antiguo e irrelevante.
    
- Se suele tomar un $\alpha = \frac{1}{2}$ para equilibrar el peso entre la historia reciente y la historia pasada.
    
- Ejemplo
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/20617e9f-71ef-442b-9c5b-78cf4d8a31bc/Untitled.png)
    

**¿Es desalojable o no desalojable?**

El cuello de botella esta en cuando llega un nuevo proceso a la cola de listos mientras un proceso aun se esta ejecutando. Puede ocurrir que las ráfagas del nuevo proceso sean mas cortas que el remanente del proceso actualmente en ejecución.

- Un algoritmo SJF desalojable desalojara el proceso en ejecución (Shoretest-Remaining-Time-First)
    
- Un algoritmo SJF no desalojable permitirá continuar al actual proceso en ejecución.
    
- Ejemplo SFJ no desalojable.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/afd5bddb-9c61-49e3-8b3f-537865dc5bff/Untitled.png)
    
    - Aca el waiting time y el turnaround time se calculan igual que FCFS.
- Ejemplo SJF desalojable
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d026a31-04c8-46c7-9b16-dd5982a01218/Untitled.png)
    
    Aca el waiting time se calcula asi:
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ee1944c4-b38f-4ae6-ab9b-7f47607b0769/Untitled.png)
    
    La formula del turnaround time se mantiene.
    

<aside> 💡 Lo que puede determinar un cambio de proceso es: o termina su ráfaga (desalojable y no desalojable) o llega uno nuevo cuya estimación es menor del que esta corriendo ahora (solo para el desalojable).

</aside>

<aside> 💡 SJF es algoritmo que mas procesos ejecuta por unidad de tiempo, ya que siempre prioriza a los procesos de menor CPU burst time.

</aside>

## _Round Robin Scheduling (RR)_

Es parecido a FCFS con la diferencia de que es posible desalojar procesos.

Se define una pequeña cantidad de tiempo de CPU denominada _time quantum_ que por lo general es un múltiplo del timer tick **(10 a 100 ms). Transcurrido ese tiempo, el proceso es desalojado y se lo agrega al final de la cola de listos.

- Relacion Timer tick y Quantum
    
    Supongamos que fijamos un quantum de 4ms y el timer tick interrumpe cada 1ms.
    
    Si un proceso utiliza todo el quantum, entonces el timer tick lo interrumpirá 4 veces.
    
    Recordemos que cuando interrumpe el timer tick (o cualquier otro periferico) lo primero que se hacia era salvar el contexto del proceso para que luego el interrupt handler se haga cargo de atender la interrupcion y correr la rutina.
    
    Finalmente, teniamos que tomar la decision de restaurar el proceso que estaba corriendo o llamar al dispatcher para despachar otro proceso.
    
    Entonces, en los primeros 3 milisegundos de quantum, vamos a elegir restaurar el proceso y en el ultimo milisegundo tomaremos la decision de restaurar o no el proceso segun haya o no otro proceso esperando su turno y si ademas el proceso que recientemente tuvo su quantum no finalizo.
    

La cola de listos se trata como una cola circular FIFO. El scheduler la irá recorriendo y asignando la CPU durante un intervalo de tiempo de hasta un quantum.

<aside> 🔑 The CPU scheduler picks the first process from the ready queue, sets a timer to interrupt after 1 time quantum, and dispatches the process.

</aside>

A ningún proceso se le adjudica la CPU mas de una vez en un ciclo a no ser que sea el único proceso ejecutable.

Bajo estos criterios pueden ocurrir dos cosas:

- Que el proceso tenga un CPU burst menor a 1 quantum.
    
    El proceso libera el core de manera voluntaria. El scheduler procedera a seleccionar el próximo proceso y despacharlo.
    
- Que el proceso tenga un CPU burst mayor a 1 quantum.
    
    El timer interrumpirá al procesador y el sistema operativo se encargará de manejar la interrupción, hacer un context switch y colocar al proceso al final de la cola de listos.
    
    Luego de esto, el scheduler procederá a seleccionar el próximo proceso de la cola de listos.
    

<aside> 🔑 Si el proceso termina de ejecutar antes de que termine el Quantum que le fue asignado, el Scheduler es llamado para asignarle a otro proceso otro Quantum.

</aside>

El waiting time average bajo la política RR es frecuentemente muy grande:

Si existen $n$ procesos en la cola de listos y el _time quantum_ es $q$, cada proceso obtiene $\frac{1}{n}$ del tiempo de CPU en intervalos de hasta $q$ unidades temporales. Cada proceso deberá esperar no más que $(n-1) \cdot q$ unidades de tiempo para volver a ejecutarse.

La performance depende del tamaño del quantum:

- Si $q \rightarrow \infty$ se parece al algoritmo FCFS.
- Si $q$ es muy chico (1 milisegundo), se torna ineficiente por la cantidad de cambios de contexto que se realizan. La idea es que $q$ sea más grande que el tiempo que se tarda en efectuar un context switch (pero no tan grande para que no se parezca a FCFS).

La cantidad de tiempo que lleva ejecutar un proceso particular (Turnaround) depende del tamaño del quantum:

- Se puede mejorar si la mayoría de los procesos finalizan en un solo quantum.
    
- Es deseable que el 80% de las ráfagas de CPU se consuman en un Quantum.
    
- Ejemplo 1
    
    For example, given three processes of 10 time units each and a quantum of 1 time unit, the average turnaround time is 29. If the time quantum is 10, however, the average turnaround time drops to 20. If context-switch time is added in, the average turnaround time increases even more for a smaller time quantum, since more context switches are required.
    
- Ejemplo 2
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8613d9b3-9e29-4d93-921f-7a5355056254/Untitled.png)
    

## _Priority Scheduling_

El algoritmo SJF es un caso especial del algoritmo Priority Scheduling. Se asocia una prioridad a cada proceso, y la CPU se asigna al proceso con la prioridad mas alta.

Los procesos de igual prioridad se programan en orden FCFS y el de menor process ID toma la CPU. Asumimos que los números bajos representan alta prioridad pero puede variar con los ejercicios.

<aside> 💡 Un algoritmo SJF es también un algoritmo de prioridad. La prioridad para ejecutar un proceso es la inversa de la siguiente ráfaga de CPU prevista. Cuanto mayor sea la ráfaga de CPU, menor será la prioridad, y viceversa.

</aside>

**¿Como se definen estas prioridades?**

_Internamente:_

- Se utiliza alguna cantidad o cantidades medibles para calcular la prioridad: límites de tiempo, requisitos de memoria, cantidad de archivos abiertos y la relación entre la ráfaga de E/S promedio y la ráfaga de CPU promedio.

_Externamente:_

- Las prioridades externas se establecen por criterios fuera del sistema operativo, como la importancia del proceso, el tipo y la cantidad de fondos que se pagan por el uso de la computadora, el departamento que patrocina el trabajo y otros factores, a menudo políticos.

**¿Es desalojable o no desalojable?**

Cuando un proceso llega a la cola de listos, su prioridad se compara con la prioridad del proceso que se está ejecutando actualmente.

- Si es desalojable y la prioridad del proceso que llega es mayor (su numero entero es menor), se quita al proceso que estaba ejecutando actualmente y se lo pone a correr al de mayor prioridad.
    
- Si es no desalojable y la prioridad del proceso que llega es mayor (su numero entero es menor), se lo pone primero en la cola de listos.
    
- Ejemplo 1
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1bf28b1d-49ee-4af8-8739-b93b13e476e2/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8cef5429-36c6-4d70-9ff0-dc9e62c74c13/Untitled.png)
    
- Ejemplo 2
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/05d7cad7-e786-45a5-97ca-fbe9ecb3a4ca/Untitled.png)
    

**Problema**

- **Inanicion o bloqueo indenfinido:**

Un algoritmo de este estilo puede dejar algunos procesos de baja prioridad esperando en la cola de listos indefinidamente.

**Soluciones**

- **Aging o envejecimiento:**

El envejecimiento implica aumentar gradualmente la prioridad de los procesos que esperan en el sistema durante mucho tiempo.

Suponiendo que las prioridades van de 127 (baja) a 0 (alta) y que por cada segundo incrementamos la prioridad, los procesos que arranque con prioridad 127 tardaran 2 minutos en poder ejecutarse.

- **Combinar Round Robin y Priority Scheduling:**

El sistema ejecutara el proceso de mayor prioridad y ejecutara procesos con la misma prioridad utilizando la programación por turnos.

## _Priority y Round Robin_

Tenemos una unica cola de listos y el scheduler elige el proceso con mayor prioridad para ejecutarse. Es decir que se despachan todos los procesos de una misma prioridad y se ejecutan usando RR.

Si en una prioridad en particular no hay procesos, no se interrumpe ni cuando se cumple el quantum.

Si llegan nuevos procesos hay que hacer una reevaluación (i.e. fijarse si llegó uno de una prioridad superior).

- Ejemplo
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9e47927b-7d76-4925-b18e-0ebf98bf4111/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/14e5d70d-17a2-46d4-b255-d207d97a3696/Untitled.png)
    

**Problema:**

Encontrar el proceso con mayor prioridad tiene una complejidad temporal de $O(n)$.

## _Multilevel Queue Scheduling_

Para solucionar el problema de una unica cola de listos, aplicamos RR y Priority Scheduling pero con colas multinivel.

Es mas sencillo tener las colas separadas para cada prioridad distinta para que el algoritmo de Priority Scheduling _schedulee_ el proceso que se encuentre en la cola de mayor prioridad. Si hay varios procesos en una cola, se ejecutaran usando el algoritmo de RR.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ca31dc3b-7863-4271-83af-baae6f08c9a6/Untitled.png)

La cola de baja prioridad sólo es atendida cuando las superiores están vacías.

En la forma más general de este enfoque, se asigna permanentemente una prioridad a cada proceso, y un proceso permanece en la misma cola durante su tiempo de ejecución. Esta prioridad esta definida en base a las propiedades del proceso (memory size, etc).

**Las prioridades vienen dadas por los tipos de proceso:**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6545c629-4384-4420-81e6-7ed2c6c73e89/Untitled.png)

- Real-time processes (soft o hard)
    
    > **Real time:** term describing an execution environment in which tasks are guaranteed to complete within an agreed-to time
    
    > **Real-time** describes various operations in computing or other processes that must guarantee response times within a specified time (deadline), usually a relatively short time. A real-time process is generally one that happens in defined time steps of maximum duration and fast enough to affect the environment in which it occurs, such as inputs to a computing system.
    
- System processes
    
    > A service that is provided outside the kernel by system programs that are loaded into memory at boot time and run continuously. In Windows, a process that serves as the container of all internal kernel worker threads and other system threads created by drivers for polling, housekeeping, and other background work.
    
- Foreground (interactive) processes
    
    Requieren interacción con el usuario. Pasan la mayor parte de su tiempo esperando el teclado y/o el mouse. Por lo general tienen una prioridad superior (definida externamente) por sobre los background processes.
    
    Tienen que ser procesos que se ejecuten rápidamente porque sino le podemos dar al usuario una experiencia interactiva muy lenta.
    
- Background (batch) processes
    
    No requieren interaccion con el usuario.
    

Es desalojable. Si un foreground process llega cuando se esta corriendo un batch process, este ultimo se desaloja.

**Problema:**

Normalmente, cuando se utiliza el algoritmo de programación de colas multinivel, los procesos se asignan permanentemente a una cola cuando ingresan al sistema. Si hay colas separadas para procesos en foreground y en background, por ejemplo, los procesos no se mueven de una cola a otra, ya que no cambian su naturaleza. Si bien es mas eficiente, es inflexible.

Puede haber inanición en las colas mas bajas.

## _Multilevel Feedback Queue Scheduling_

Es mas flexible ya que le permite a los procesos moverse entre las colas. La idea es separar los procesos según las características de sus **ráfagas de CPU**.

- Si un proceso utiliza demasiado tiempo la CPU, se mueve a una cola de menor prioridad. Es decir, que los procesos con ráfagas de CPU cortas permanecerán en las colas de alta prioridad (I/O bounds y procesos interactivos).
- Si un proceso espera mucho tiempo en una cola de menor prioridad, se ira moviendo a través de las colas ganando prioridad. De esta forma prevenimos la inanición. Evitamos la inanición.

Es desalojable. Si un foreground process llega cuando se esta corriendo un batch process, este ultimo se desaloja.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2660c357-ffbe-42f2-bbc2-05d3e57671cb/Untitled.png)

### Parámetros de las colas multinivel para su implementacion

- Número de colas o prioridades (ambas mencionadas).
- Algoritmo de cada cola (ambas mencionadas).
    - Se recomienda usar RR para foreground processes y FCFS para background.
- Método usado para promover un proceso a una cola de mayor prioridad (multilevel feedback).
- Método usado para rebajar un proceso a una cola de menor prioridad (multilevel feedback).
- Método usado para decidir la cola inicial en la cual se ubicará un proceso cuando ingresa luego de una syscall (ambas mencionadas)
