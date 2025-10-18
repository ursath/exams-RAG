# Main Memory

## _Background de Arqui_

La memoria es un largo arreglo de bytes, cada slot corresponde a una dirección de memoria. La CPU tomaba de memoria una instrucción de acuerdo al valor de RIP, la instrucción se decodifica para posteriormente ejecutarla.

Los registros de CPU, que son built in, pueden ser accedidos de manera directa en un ciclo de CPU por la misma CPU. En cambio, para acceder a la memoria, si o si tenemos que usar los buses de datos y la operación puede tardar varios ciclos de CPU. Para esos casos, el procesador necesita detenerse, ya que no tiene los datos necesarios para completar lo que la instrucción indica. Como esto es inaceptable en términos de eficiencia (ya que el tiempo de respuesta de la memoria es alto), es que se puso una cache en medio del procesador y la memoria física. Esta tenia mayor velocidad de respuesta que la memoria física.

Sin embargo, el bloqueo de memoria no se soluciona para todos los casos con la cache. La cache almacena los ”bloques mas consultados” para evitar la constante búsqueda en memoria de ciertos datos. ¿Pero si el “bloque de memoria” que solicitamos no esta en la cache? ¿Tenemos el mismo problema, no? Si, es verdad, pero recordemos del apunte anterior que durante un bloqueo de memoria, si llegamos a tener un _multithreaded core_ podemos _switchear_ el _hardware thread_ estancado por otro _hardware thread_.

No solo nos interesa la velocidad relativa para acceder a la memoria física, sino que también su protección. No queremos que un proceso de usuario pueda acceder impunemente al Kernel Space o que un proceso de usuario pueda matar a otro proceso de usuario libremente. ¿Quien puede proveer esta protección? El hardware. Esto se debe a que el sistema operativo no suele intervenir entre la CPU y sus accesos de memoria.

Recordemos también de manera general el mapeo de dirección lógica (o virtual) a dirección física. El usuario nunca programa en direcciones físicas, sino que son direcciones virtuales. Esto ultimo se logra gracias a la MMU y de alguna manera, protege a la memoria de las malas intenciones del usuario. Como nosotros trabajamos siempre en modo flat en procesadores de Intel, podemos resumir la transformación de la siguiente manera:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8a25c55d-1103-48ec-abdb-4fe9e67dcf2d/Untitled.png)

_Otro método de protección de la memoria:_

Cuando el _scheduler_ selecciona un proceso para su ejecución, el dispatcher carga los registros de _relocation_ y _limit_ correspondientes como parte del context switch. Debido a que cada dirección que se esta por ejecutar se compara con estos registros, podemos proteger tanto el sistema operativo como los programas y datos de los otros usuarios de ser modificados por este proceso en ejecución.

# Memory Allocation

## _Variable partition_

Una forma sencilla de asignar memoria a un proceso, es darle pedazos de memoria de tamaño variable. Cada partición o pedazo puede contener exactamente 1 proceso.

El sistema operativo hace uso de una tabla (lista) que contiene la información de las porciones de memoria ocupadas y desocupadas y sus tamaños. Inicialmente, toda la memoria (menos la zona donde se ubico el SO) esta disponible para procesos de usuario.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5eff975-ea3a-4b58-b2e5-4e299680170f/Untitled.png)

Si la zona de memoria que le asigno a un proceso para que corra es muy grande, esta se parte en dos. Una de las dos es asignada al proceso y la otra parte queda libre. Los agujeros contiguos de memoria se transforman en un solo bloque de memoria disponible.

**¿Que hacemos si un proceso no entra? ¿Rechazamos al proceso y listo?**

Es una opción mientras que respondamos con un mensaje de error adecuado. Sin embargo, una alternativa es utilizar una cola donde en cada asignación de un slot de memoria, el SO chequee si el proceso que esta esperando primero en la cola entra en alguno de los slots de memoria libres.

Existen varios algoritmos o estrategias para seleccionar un pedazo de memoria libre de un conjunto de pedazos de memoria libres:

- First Fit
    
    Asigna memoria del primer hueco que encuentre que es suficientemente grande para el proceso. La búsqueda puede comenzar desde el principio del conjunto (lista) de pedazos de memoria libres o desde donde haya terminado la anterior ejecucion del algoritmo. Podemos finalizar la búsqueda cuando hayamos encontrado un pedazo de memoria lo suficientemente grande.
    
- Best Fit
    
    Asigna el pedazo de memoria mas chico que sea suficientemente grande para el proceso. Se busca en toda la lista a no ser que este ordenada por tamaño.
    
- Worst Fit
    
    Asigna el pedazo de memoria mas grande. Se busca en toda la lista a no ser que esta ordenada por tamaño.
    

<aside> ‼️ El mas rápido es first fit.

</aside>

# Fragmentación de la memoria

Tanto _best fit_ como _first fit_ sufren de lo que se llama _external fragmentation_.

- A medida que los procesos se cargan y se eliminan de la memoria, el espacio de memoria libre se divide en pequeños pedazos. En otras palabras, los espacios de memoria libre no son contiguos.
- En el peor caso, podemos tener un bloque de memoria libre (perdida) entre medio de dos procesos. Si todos estos pedacitos libres fueran un solo bloque, podríamos correr procesos mas pesados o incluso mas procesos.

Así como existe la fragmentación externa, existe la fragmentación interna. Esta es memoria asignada a un proceso que sobra, es decir, memoria no utilizada interna a la partición.

**Soluciones a la fragmentación externa**

_Compactación_. La idea es organizar al contenido de la memoria de tal forma que quede la division bien marcada entre memoria ocupada y memoria libre. Solo es posible llevarla acabo si la realocacion es dinámica y se lleva acabo en tiempo de ejecución. Por lo general esta operación tiene una complejidad temporal alta.

_Paginación:_ es mejor que la compactación ya **que permite que el espacio de direcciones físicas de un proceso no sea contiguo en memoria. La paginación se implementa a través de la cooperación entre el sistema operativo y el hardware de la computadora. Es evidente que la paginación no resuelve la fragmentación interna.

# Paginación

## Overview

La RAM se divide en particiones de igual tamaño y se los denomina _marcos_. A la memoria virtual se la divide en _paginas_ de igual tamaño. Ambos típicamente coinciden en su valor. Cuando un proceso se ejecuta, sus paginas se cargan en un marco en memoria RAM.

La direction lógica podia contener subdivisiones, la mas sencilla es un numero de pagina y un offset. La primera division nos sirve como índice para acceder a la tabla de paginas donde obtenemos un puntero a la base del marco. Si a la base del marco le sumamos el offset, obtenemos la posición relativa dentro del marco. La combinación de ambos punteros básicamente nos da como resultado una posición en memoria RAM.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/93a0dc83-c414-47d4-9e39-1b89c3bbc24d/Untitled.png)

_La MMU realiza los siguientes pasos para realizar el mapeo:_

1. Toma de la dirección lógica el numero de pagina y lo usa como un índice en la tabla de paginas
2. Extrae de la tabla de paginas el numero de marco asociado al numero de pagina del paso uno
3. Reemplaza el numero de pagina del item uno por el numero de marco en la dirección lógica

## Hardware Support

En el contexto de cada proceso, además de preservar los registros, flags, etc, también almacenamos un puntero a su tabla de paginas. Luego de un context switch, se restauran los registros y el valor de `PTBR` (_page-table-base register_) con el puntero a la tabla de paginas correspondiente.

El problema de esto ultimo, es que estamos realizando dos accesos a memoria:

- Uno para ir a buscar el numero de marco a la tabla de paginas
- Uno para acceder a la zona de memoria una vez combinados el numero de marco y offset

_**Solución:**_ translation look-aside buffer **(TLB)**

La TLB es una especie de memoria cache que esta del lado del procesador y que es consultada por la MMU previo a hacer un acceso de memoria.

La TLB contiene en sus entradas algunas tablas de paginas. Cuando una dirección lógica llega a la MMU, esta ultima primero chequea si el numero de pagina esta en la TLB. Si esta, el numero de marco se obtiene al instante y se usa para acceder a memoria. Si se produce un _TLB miss_ porque la pagina no esta disponible en la TLB, se procede como en la imagen anterior y además se quita una entrada de la TLB para agregar el numero de marco recientemente accedido (política LRU o RR). La TLB permite que ciertas entradas no puedan ser removidas. Esto ultimo se suele aprovechar para las entradas del Kernel.

La TLB además almacena en sus entradas un _address-space identifier_ (ASIDs). Esto permite identificar unívocamente a un proceso. Entonces, antes de acceder a cualquier marco, la TLB se asegura de que el proceso que está corriendo y pidió dicho marco coincidan en el campo ASID.

<aside> ‼️ Ante un cambio de contexto, debemos borrar toda la TLB. Ver ejercicio de la guia.

</aside>

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4a3111fb-6eed-4081-90ec-ce1deb47a916/Untitled.png)

## _Protección_

Cada marco tiene una serie de bits que permite su protección. Estos bits están presentes en la tabla de páginas.

- Bit de escritura
- Bit de lectura
- Bit de ejecución
- Bit de presencia asociado con Swapping (esto lo setea el SO)
    - Puede ocurrir que un proceso, tenga un número de marco que no esté presente en memoria, eso implica que el bit $P=0$. La MMU, que es parte del procesador, genera una excepción que la maneja el SO para traer de disco dicha página.
- Bit de válido o inválido (esto lo setea el SO)
    - Indica si este marco puede ser accedido por el proceso que esta corriendo. Si es valido, significa que la página pertenece a dicho proceso. Si es inválido es lo contrario.

## _Shared Pages_

Una librería de C puede ser requerida por múltiples procesos. Se conoce como _reentrant code_ a aquella porción de código que no se modifica durante la ejecución. Gracias a esa característica, distintos procesos pueden correr el mismo código sin necesidad de tener que copiarlo en sus direcciones virtuales.

Basta con una copia de la librería en memoria RAM y que todos los procesos que necesiten de dicha librería tengan en su tabla de páginas un puntero a esta copia en RAM.

## _Structure of the page table_

Hablaba de distintas formas de organizar la tabla de páginas, no me parecio importante porque nunca hablamos de nada distinto a lo que vimos en Arqui.

# Swapping

Una página puede pasar de RAM a disco o viceversa. Esto permite confrontar el hecho de que la memoria virtual supere a la memoria RAM en cantidad de direcciones.

**Swap out:** mover un proceso entero a disco (no entra a la cola de listos).

**Swap in:** mueve el proceso de disco a la cola de listos.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/67ddab7f-733d-4166-b300-e8661d56ecf7/Untitled.png)

## _Swapping with pages_

**Page out:** página de memoria a disco.

**Page in:** página de disco a memoria.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e0c5f1a9-ca51-48f3-92f7-e67b7aa4a101/Untitled.png)

Veremos más adelante el costo que tiene mover una página al disco de memoria virtual y como podemos evitar mover páginas a disco de manera innecesaria (bit dirty).

# Introducción

Hasta ahora, introducimos ciertas estrategias de manejo de memoria RAM. Vimos que el objetivo de todas ellas es mantener a los procesos en memoria RAM permitiendo la ejecución concurrente o intercalada de dos o más programas en un solo core. El problema es que todas las estrategias mencionadas tienden a necesitar que todo el proceso debe estar cargado en RAM para comenzar a ejecutar.

Para solucionar esto nace la técnica de la memoria virtual que permite ejecutar procesos que no estén completamente en RAM. La ventaja de esta estrategia es que ahora nuestros programas pueden ser mas grandes que la memoria física. Es decir, el programador se puede abstraer del concepto de memoria RAM pensando que es un arreglo de almacenamiento extremadamente grande y uniforme.

La memoria virtual permite entre otras cosas:

- Que los procesos compartan archivos y librerías
- Que hagan uso de la shared memory
- Provee un mecanismo eficiente para crear procesos

Desventajas:

- Difícil de implementar
- Puede reducir la performance de la PC si se usa descuidadamente

<aside> ‼️ La memoria virtual pensemosla como el disco. Mas adelante veremos que el acceso a este disco tiene un determinado tiempo de acceso.

</aside>

# Background

Los algoritmos que presentamos en el apunte anterior cumplen un propósito indispensable: ubicar instrucciones en memoria RAM para que puedan ser ejecutadas.

Lo que no mencionamos en el apunte anterior es que es algo descabellado ubicar todo el proceso en memoria física para comenzar a correrlo. Pensemos lo siguiente:

- Los programas por lo general tienen handlers de excepciones que casi nunca suelen ser ejecutados
- Análogamente, existen rutinas o funciones que quizás nunca se ejecuten
- Las listas, arreglos y otras estructuras ocupan mas memoria que la que solemos especificarle cuando codeamos

**El punto es el siguiente:** si bien es cierto que estas partes del programa son importantes, lo mas probable es que no se necesite todo al mismo tiempo.

**¿Y si pusiéramos programas de manera parcial en memoria?**

- Un programa no estaría restringido a la cantidad de memoria física en el sistema. Los usuarios podrían tener programas que ocupen muchas direcciones virtuales.
- Como ahora tenemos más espacio ya que estamos ubicando porciones de programas, podemos hacer un mejor uso de la memoria RAM y ubicar mas porciones de otros procesos en ella. Esto aumenta la utilización de la CPU y el throughput.
- Se necesitaría menos tiempo de E/S para cargar o intercambiar partes de programas en la memoria, por lo que cada programa se ejecutaría más rápido

<aside> ‼️ Poner a los programas de manera parcial en memoria beneficia tanto al sistema como al usuario.

</aside>

**¿Que es la memoria virtual?**

La memoria virtual es un mecanismo que permite marcar la separación entre direcciones lógicas y direcciones físicas. Como mencionamos, la idea es proporcionar un espacio de direcciones virtuales (direcciones lógicas) que sea superior (o igual) a los direcciones físicas presentes en el sistema. Con esto podemos lograr que el programador se deje de preocupar de la cantidad de memoria física presente en el sistema y que pueda programar con tranquilidad.

<aside> ‼️ Decimos que cada proceso tiene su espacio o frame de direcciones virtuales o lógicas y están contiguas en memoria virtual.

</aside>

La idea es dividir tanto a la memoria virtual como a la física en paginas de igual tamaño y que la MMU se encargue de hacer el mapeo correspondiente. Recordemos que en memoria física no necesariamente los procesos pueden quedar contiguos si utilizamos el mecanismo de paginacion.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8cc74668-828e-4f46-97d0-b6d9f5297bc8/Untitled.png)

- Proceso en memoria virtual - _Sparse Address Spaces_
    
    Supongamos que tenemos el siguiente proceso en memoria virtual. El heap crece para las direcciones mas altas y el stack en sentido contrario. Ese espacio en azul, corresponde a direcciones virtuales “libres” que pueden ser utilizadas por uno u otro.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ffef1bd9-14fc-4409-8e25-531976647784/Untitled.png)
    
    A los espacios de direcciones virtuales con agujeros se los conoce como _sparse address spaces_. Es beneficioso utilizar estos tipos de espacios virtuales por el hecho de que estamos permitiéndole al proceso añadir direcciones virtuales tanto para stack o heap si quisiéramos. Mas interesante aun, podemos asignar dichas direcciones virtuales al linkeo de librerías (ver shared libraries del apunte anterior) o una shared memory (utilizando _mmap_) durante la ejecución de un programa. Incluso durante un _fork_, las paginas del proceso padre e hijo se comparten inicialmente.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d181d6f-f62a-4e61-a729-b8a8d8fc0856/Untitled.png)
    

# Paginación por demanda

La idea es cargar páginas de memoria virtual a física únicamente cuando sean necesarias. En otras palabras, una página se carga en memoria cuando un programa la demanda mientras se esta ejecutando. La idea es que las páginas que no son accedidas o demandadas, no estarán ocupando espacio en memoria física.

Esta técnica es muy parecida al sistema de paginación con _swapping_ que mencionamos en el apunte anterior donde un proceso reside en un storage secundario (HDD).

## _Conceptos básicos_

Como mencionamos, las páginas que son demandadas durante la ejecución se cargan en memoria y el resto quedan en un storage secundario.

**¿Como hacemos para distinguir de que proceso es cada página? ¿Como sabemos que una página esta en memoria física o en disco?**

Con el bit de valid-invalid, o bit de presencia, que vimos en el apunte anterior.

- Si el bit vale 1, la página asociada es válida y está en memoria RAM.
- Si el bit vale 0, la página puede no ser válida, o quizás es válida pero está en disco.

Con que sea válida o inválida, nos referimos a que pertenece o no a las direcciones virtuales del proceso respectivamente.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/843cb7bc-a0f9-4fb2-a311-bf177f77bc62/Untitled.png)

**¿Que pasa si el proceso intenta acceder a una pagina que no está en memoria?**

El bit de valid-invalid estará en 0 causando una excepción de **page fault**.

**¿Como ocurre este page fault?**

Cuando la MMU quiera traducir la dirección ****a través de la tabla de páginas, observará que el bit V está establecido en 0, lo que provoca una excepción a nivel procesador que despierta al sistema operativo (trap). El sistema operativo reconoce dicho fault y trae la página que se solicita a memoria.

Las interrupciones de paginado son muy costosas de manejar al requerir accesos a disco, pero es una excepción continuable (es decir, luego de que la instrucción falle y se corran los steps que se ven en la imagen, se vuelve a intentar correr la instrucción que genero la excepción).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ff7fe1b7-218f-406d-90b9-d2d8bf682589/Untitled.png)

- Resumen de cada paso
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/316a3948-da91-45e6-9e75-7387714745d8/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/556ef1c1-8e92-457f-8d35-bdba54bb7714/Untitled.png)
    
- Secuencia de pasos en detalle
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/492bc28b-92bf-4d88-995c-3b9cb0a003e8/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3d313ddb-2da5-40f1-b7bf-8ada743bee18/Untitled.png)
    

<aside> ‼️ Para traer la página de memoria secundaria a memoria RAM se ejecuta una operación de E/S

</aside>

Podemos notar que una de las propiedades de la paginación por demanda es la alta cantidad de _page faults_ que pueden ocurrir cuando un proceso comienza su ejecución. Esto se debe a que el proceso quiere ganar localidad en memoria RAM poniendo sus paginas en los distintos marcos.

> _We must solve two major problems to implement demand paging: we must develop a frame-allocation algorithm and a page-replacement algorithm_

# Page replacement algorithms

Si un proceso genera un _page fault_ y el SO se da cuenta que no hay marcos disponibles para traer dicha pagina a RAM, estamos en problemas porque la RAM esta llena.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c6338a3d-f5bd-433e-9250-0cc214817704/Untitled.png)

Terminar al proceso que pidió la página no es una buena opción. Tampoco es una opción hacer un swap out del proceso o un estándar swapping de páginas por lo que conlleva copiar las páginas de memoria RAM a disco y viceversa. La solución es utilizar algoritmos de reemplazo de páginas. Para ello, cuando no hay marcos libres disponibles, se debe elegir una página víctima en memoria RAM y enviarla a disco.

## _Overview - Basic page replacement_

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a7a03113-0791-4a89-97e8-06aa54d7f1ef/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b678fd8c-8d47-4672-a2e9-d863e9450af8/Untitled.png)

Notemos que si todos los frames están ocupados, estaríamos haciendo dos transferencias de página. Esta situación duplicaría el _page fault service time_ que mencionamos antes e incrementaría el tiempo de acceso efectivo.

Podemos evitar esto haciendo uso del **dirty bit** o **modify bit** que el hardware lo prende si una página en memoria física sufrió algún cambio en algún bit. Si una página fue modificada, no será candidata a ser la víctima por la simple razón de que traerla a disco implicaría que escribamos en el los cambios que se produjeron en dicha página. De esta forma estaríamos reduciendo el _page fault service time_ a la mitad si alguna página en memoria no fue modificada.

<aside> ‼️ Es muy costoso sincronizar la escritura en disco. Por eso, solamente tendremos que “bajar a disco” una página si esta fue modificada y debemos sincronizarla con el disco. En el caso de que la página sea de solo lectura, podemos bocharla directamente.

</aside>

## Algoritmos de reemplazo de paginas

- _**Optimal:**_ quita las páginas que mas van a tardar en ser usadas en el futuro (si conociera el futuro, pero se puede predecir)
- _**Random:**_ elige una página al azar
- _**FIFO:**_ saca la primer página que fue cargada en memoria
- _**LRU:**_ elige una página que hace más tiempo que no se usa
- Second chance:

Nuestro objetivo es que ocurren la menor cantidad de interrupciones de paginado

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dc6c6c6f-ea67-471e-9a81-76d83447ce04/Untitled.png)

### Optimal

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/867d7a6c-dd5f-46ee-b1e5-aad08fd19bd2/Untitled.png)

El problema es que no podemos predecir el futuro. Descartamos el algoritmo optimo.

### FIFO

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/108225ba-7112-49c9-a522-f8e86b3e2c71/Untitled.png)

El problema de FIFO es que ignora los patrones repetitivos. **Puede** llegar a ocurrir que tengamos mucha tasa de paginado.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/577bfc2d-9151-459f-a739-65330d8a7f3c/Untitled.png)

**Anomalía de Belady:** para algunas secuencias, a menor cantidad de marcos se logra menor tasa de paginado.

### LRU

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/246add9a-7c9d-420e-a32f-0b6fae1d636c/Untitled.png)

LRU es considerado un buen algoritmo. El problema es implementarlo eficientemente. En la práctica buscaremos una aproximación eficiente a LRU llamado algoritmo de segunda oportunidad **o _clock_.

Todas las páginas de un proceso arrancan con el bit de referencia en 0. Cuando alguna página es referenciada se la marca con 1 (no importa si se referencia multiples veces).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8dec34d2-b619-4e64-b31c-1d135210332b/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7e74c66e-db6b-4f3d-a8ad-b09b31565171/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bc565a9a-6613-4e48-badf-66b40500b4d4/Untitled.png)

- Pregunta del foro
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d0df7de1-ec0e-4e57-80cf-62673d726d47/Untitled.png)
    

# Trashing o hiperpaginación

Definición importante:

> _**Working set:**_ _The set of pages in the most recent page references._

Supongamos que un proceso necesita más páginas que marcos disponibles presentes en memoria. En otras palabras, no se tiene el número mínimo de marcos que necesita para admitir las páginas del working set. Automáticamente se producirá un _page fault_ que buscara reemplazar alguna página. Las páginas del working set son páginas activas que necesita el proceso. Entonces, dado que todas las páginas están en uso activo, se estarán reemplazando una páginas que se necesitarán nuevamente de inmediato. En consecuencia, ocurrirán sucesivos page faults rápidamente una y otra vez, reemplazando por páginas que se deben traer de vuelta de inmediato.

> _A process is thrashing if it is spending more time paging than executing._

Esto conduce a:

- Alta tasa de interrupciones por paginado
    
- Muchas esperas de E/S de disco
    
- Baja utilización de CPU
    
- No hay trabajo util realizado
    

<aside> 💡 Ante un caso de hiperpaginación, un CPU mas rápido no soluciona el problema, al contrario, lo empeora

</aside>

Para identificar el cuello de botella, podemos utilizar un plano en el eje XYZ donde un punto sobre cada eje representa:

- CPU
- E/S
- Memoria

Hay que tener en claro en cual de estos ejes estamos limitados para evaluar una deficiencia.

**¿Como podemos limitar los efectos del thrashing?**

Debemos proporcionarle a un proceso tantos marcos como necesite. Pero, ¿cómo sabemos cuántos marcos necesita? Una estrategia comienza por observar cuántos marcos está utilizando realmente un proceso. Este enfoque define el modelo de localidad de ejecución de procesos.

El modelo de localidad establece que, a medida que se ejecuta un proceso, este se mueve de localidad en localidad. Una localidad es un conjunto de páginas que se utilizan activamente juntas. Un programa en ejecución generalmente se compone de varias localidades diferentes, que pueden superponerse.

- Ejemplo
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4b631a08-6136-41c9-a824-1e5b002ef6a8/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0ab47a17-e867-4b95-9f5d-c15736025544/Untitled.png)
    

> _Suppose we allocate enough frames to a process to accommodate its current locality. It will fault for the pages in its locality until all these pages are in memory; then, it will not fault again until it changes localities. If we do not allocate enough frames to accommodate the size of the current locality, the process will thrash, since it cannot keep in memory all the pages that it is actively using._

# Pre-paginación

La pre-paginación intenta solucionar la gran cantidad de _page faults_ iniciales que provoca la paginación por demanda trayendo a memoria RAM algunas (o todas) las paginas que necesita el proceso de una sola vez.

# Clase Horacio

## Estrategias de paginado

1. Paginación a demanda: Se carga la página como respuesta a la excepción.
    1. El proceso comienzo sin páginas cargadas.
2. Paginación a pedido: el usuario especifica que páginas se necesitan.
    1. Requiere que el usuario maneje la memoria.
3. Prepaginación: Se carga la página antes que sea referenciada. Cuando una página es referenciada, se trae la siguiente.

Working set (localidad): cantidad de páginas que puedo necesitar para una parte de mi código. Cuando tengo una parte de código con buena localidad, mi working set va a ser chico, sino grande.

Si el SO sabe cual es mi working set, puede dármela para que yo proceso no sufra de tantas interrupciones de paginado.