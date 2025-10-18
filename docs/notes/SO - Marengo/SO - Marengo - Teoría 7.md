## Algunas definiciones

**Demand paging:** al principio, justo antes de ejecutar un proceso, este no tiene páginas. Cada vez que se acceda a una página que está en disco se va cargando, siempre bajo demanda.

**Locality of reference:** principio que, los procesos suelen referenciar una pequeña fracción de sus páginas.

**Working set:** conjunto de páginas siendo usado actualmente.

- ¿Qué pasa si todo el working set está en memoria?
    - Casi ningún page fault.
- ¿Qué pasa si no tengo tanta memoria para todo el working set?
    - Muchos page fault → **Thrashing**

**Prepaging / Working set model:** usado para evitar el gran número de page faults que ocurren en el comienzo de un programa. Guardar el working set de un proceso y cuando continúe la ejecución, el working set es traído a memoria antes que empiece denuevo su ejecución.

## Algoritmos de reemplazo de páginas

¿Que PF desalojar?

- **Que no esté modificada**: la saco y listo, me ahorro la escritura en disco.

### Algoritmo Óptimo

- Fácil de describir.
- Imposible de implementar.
- Clasificar las páginas de acuerdo a la **cantidad de instrucciones que se ejecutarán hasta que sean referenciadas**.

### Not recently used (NRU)

- Usa los bits R (referenciado, W/R) y M (modificado, W).
- Se resetea (a 0) periódicamente R (cada interrupción del timer tick). Si R está en 1 quiere decir que fue referenciado recientemente (50ms timer tick frente a 3GHz del reloj del procesador)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f26a7915-ae86-4a99-ac2f-f81c74a91570/Untitled.png)

- El algoritmo elije primero si tiene alguna de la clase 0, sino de la clase 1, etc.
- ¿Por qué se elije a la clase 1 sobre la 2 si la clase 1 fue modificada, y es algo pesado bajar a disco algo modificado?
    - Porque así lo dice el algoritmo xd

### First-in First-out (FIFO)

Problema: que la primera página que entró sea muy usada.

### Second chance (SC)

- Modificación simple de FIFO.
- Evita desalojar una página antigua pero muy usada.
- Usa el bit R.
- Periódicamente ese resetea R.
- Si la página candidata es R, se resetea R y se envía al comienzo de la cola como si recién llegara.
- Si la página candidata es $\neg$ R se desaloja.

### Clock (C)

- Second chance es ineficiente modificando la lista constantemente.
- Mantiene las páginas en una lista circular.
- La “manecilla” apunta a la página más vieja.
- Si la página candidata es R, se resetea R y se avanza.
- Si la página candidata es $\neg$ R se desaloja.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e20ce055-fd20-4dcb-9a82-a60249954b77/Untitled.png)

### Least recently used (LRU)

- Las páginas muy usadas recientemente suelen seguir siendo muy usadas.
- Las páginas escasamente usadas recientemente suelen seguir sin ser muy usadas.
- Desalojar a la página que no ha sido usada el mayor tiempo.

2 enfoques:

- Tener una lista de páginas ordenada por tiempo de acceso.
- Tener un registro especial que cuente instrucciones y equipar a cada entrada de la tabla con espacio para este registro.
    - **Problema:** Muy pretencioso, sería un número de 64bits para almacenar el número de instrucción y quizás de overflow al toque.

### Not frequently used (NFU)

- Requerimos de un contador para cada página.
- Periódicamente se suma el bit R de cada página a su contador. Historial de cuántas veces fue referenciada.
- Se desaloja a la página con el contador más chico.
- **Problemas:**
    - Si fue referenciada más de 1 vez entre interrupción, el bit de R igual sigue estando en 1 → NO es preciso.
    - Si usé mucho una en una fase del programa y paso de fase y ya no la uso más, va a tardar un montón en salir.

### Algoritmo Aging: Simular LRU en software

- Pequeña modificación de NFU.
- Los contadores se shiftean a la derecha 1 bit.
- Luego, se suma el bit R, pero a la izquierda

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5e9cec57-9e18-4fdc-a466-629caf8e0505/Untitled.png)

- Se desaloja la página con el contador más chico.

¿Qué pinta tendrá el contador de una página no referenciada durante los últimos 4 ticks?

10000

01000

00100

00010

00001

- **Problemas:**
    - No hay un pasado muy lejano, sólo almaceno 8 bits, uno cada 20ms (interrupción).

### Working set (WS)

- En cualquier instante de tiempo **t** existe el conjunto de páginas referenciadas en las últimas **k** referencias a memoria, este conjunto se expresa como **w(k,t)**.

![Cantidad de páginas referenciadas si tomo las últimas k referencias a memoria.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8040b71e-d900-4426-b000-a885727425f3/Untitled.png)

Cantidad de páginas referenciadas si tomo las últimas k referencias a memoria.

- Se tiende a trabajar mucho con un conjunto de páginas acotado, por eso está función se va “planchando”.

Entonces, ¿cómo puedo aprovechar esto?

- Fijo un k grande, por ejemplo 10 millones de referencias → Mi working set queda determinado.
- Reemplazaremos cualquier página que no esté en ese conjunto. Y si sólo tengo páginas del working set, reemplazo las que fueron accedidas hace más tiempo.

<aside> ❕ Como el costo es alto, reemplazamos las **últimas k referencias** a memoria, ****por las páginas referenciadas en las **últimas t unidades de tiempo (en current virtual time,** es decir, el tiempo del proceso).

</aside>

- Periódicamente se resetea **R.**
- Se asume que durante $t$ ****unidades de tiempo ocurren muchos ticks (para tener más data).
- $age = current \space virtual \space time \space - \space time \space of \space last \space use$
- Examinar todas las páginas en cada tick.
- Orden de reemplazo:
    1. Si $R==0$ y $age > t$: removemos la página.
    2. Si $R==0$ y $age \leq t$: recordamos el tiempo menor.
    3. Si $R==1$: seteamos el último tiempo.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/df926fdf-0813-45bb-9cfd-d8d28ca21635/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/431b7a90-f77f-4c40-99e2-97cf2844b85f/Untitled.png)

Por ejemplo, si t = 200 unidades de tiempo, entonces la página con last use = 1213 tiene age = 2204 - 1213 > 200. Además tiene R = 0 → Segundo caso

- **Problemas:**
    - Recorrer toda la tabla ante cada page fault.

### Working Set Clock (WSC)

1. Si R: se resetea R y se avanza la manecilla.
2. Si $\neg$R y age>t y $\neg$M: se desaloja sin actualizar el disco.
3. Si $\neg$R y age>t y M: se planifica (con un límite) el guardado a disco y se avanza la manecilla.
4. Si no encuentra ninguna del caso 2 (la ideal a reemplazar) hay dos casos:
    1. Se planificó alguna escritura y se continúa girando hasta que aparezca $\neg$M.
    2. No se planificaron escrituras y se desaloja alguna del working set, de nuevo, la más vieja y preferentemente $\neg$M.

**Caso R=1:**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2e2a70b1-4e9c-4c54-b92f-8693fe2da0ef/Untitled.png)

**Caso R=0:**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a6ebf487-7da4-430f-b563-0dad0e739625/Untitled.png)