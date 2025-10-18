Se desea que la memoria sea:

- Privada
- Infinitamente grande
- Infinitamente rápida
- No volátil
- Barata

Como no se puede, se hace una jerarquía de memoria que cumple con alguno de los requisitos

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/124d63c0-eb92-4588-b034-307ac98f412c/Untitled.png)

# Memory Manager

- ¿Qué parte de la memoria está en uso?
- Reservar memoria
- Liberar memoria

# Memoria sin abstracciones

- Para sistemas que conozco todos los procesos, un microondas por ejemplo.
- Al cargar el programa se corrigen todas las direcciones.
- Direcciones absolutas → static realocation
- **Costo** al cargar el programa.

# Memoria con abstracciones

## Espacio de direcciones

- El espacio de direcciones es el conjunto de direcciones que un proceso puede utilizar para direccionar memoria y es independiente del de otros procesos.
- El espacio de direcciones es una abstracción de la memoria.
- Tenemos dos problemas a resolver: **protección** y **reubicación.**

**Primer solución:**

- El hardware se equipa con 2 registros especiales: **base** y **limit**.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/01e0aa2a-eede-48dd-a178-f8a1df898d50/Untitled.png)

- Se cargan los programas de forma consecutiva.
- **base** = dirección física donde se carga
- **limit** = tamaño del programa
- Dynamic reallocation: A cada acceso a memoria se le suma **base** y se chequea que no supere **limit**.
- Las comparaciones son rápidas pero las sumas no tanto, salvo que se use hardware especial.
- **Costo** en acceso de memoria.

<aside> ❓ Qué pasa si no entran todos los programas en memoria simultáneamente?

</aside>

- **Swapping**: Guardar toda la memoria del proceso en disco y restaurarla cuando vuelva a ejecutar.
- **Memoria virtual:** Permitir a un proceso ejecutar incluso estando parcialmente en memoria.

## Swapping

![Swapping a lo largo del tiempo](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/28ec6947-2c95-43b4-bdee-332607773e20/Untitled.png)

Swapping a lo largo del tiempo

![Bajo la razonable expectativa de que un proceso crezca durante su ejecución, se le asigna más memoria.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f63e1bf1-24ca-4fda-ae34-7f5ea6829492/Untitled.png)

Bajo la razonable expectativa de que un proceso crezca durante su ejecución, se le asigna más memoria.

### Administrar la memoria libre

2 Enfoques:

- **Bitmap:** se divide la memoria en bloques y cada bit representa su estado. Si divido en pequeños bloques estonces voy a tener una tabla más grande ya que cada bloque represena un bit en la tabla.
- **Free list:** cada proceso y espacio libre tiene un nodo con inicio, longitud y el puntero al siguiente. La P quiere decir que hay un proceso, ocupado. La H (Hole) que es memoria libre.
    - Es necesario fusionar bloques libres adyacentes.
    - Doblemente encadenada facilita este trabajo.
    - El orden en la lista es relevante.

![Para una misma memoria dividida en bloques, bitmap y free list.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/44eaefe9-68cc-4484-8aaa-e5b356d3035b/Untitled.png)

Para una misma memoria dividida en bloques, bitmap y free list.

**¿Cómo buscar un bloque libre?**

Buscar un bloque libre, luego se parte en 2, lo necesario y lo que sobra (si sobra).

- **First fit:** comenzando desde el principio, el primer bloque suficientemente grande → más velocidad.
- **Next fit:** comenzando desde donde quedamos, el primer bloque suficientemente grande → más velocidad.
- **Best fit:** recorre toda la lista y elige el bloque más pequeño, pero suficientemente grande → tiende a dejar muchos bloques chiquitos sobrantes → más fragmentación (anti-intuitivo).
- **Worst fit:** recorre toda la lista y elige el bloque más grande → no resuelve mucho el problema.

<aside> ❕ ¡Momento!

</aside>

- **Free list mejorado:** se pueden separar las listas entre ocupados y libres.
    - Liberar y asignar un bloque consiste en moverlo de listas
    - Puedo ordenar la lista de bloques libres por tamaño (de menor a mayor).
    - Puedo utilizar la misma memoria libre para almacenar la información de su longitud y el puntero a los siguientes bloques de memoria libre. Total nadie la está usando! → No tengo que hacer una segunda lista.
    - **First fit** y **Best fit** se vuelven equivalentes si está ordenada de menor a mayor.
    - **Next fit** no tiene sentido
- También podemos clasificar los bloques libres por tamaño frecuentemente solicitado.
    - 4 free lists de bloques de 4KB, 8KB, 12KB y 16KB respectivamente.
    - **Quick fit:** el primer bloque de la lista correspondiente.

## Memoria Virtual

- Cada proceso tiene su espacio de direcciones.
- Este espacio está dividido en bloques llamados **páginas**.
- Cada página es un conjunto contiguo de direcciones.
- Cada página es mapeada a memoria física, pero no todas deben estar mapeadas simultáneamente.
    - Si la página está en memoria física se mapea _on the fly_.
    - Si no está, se carga en memoria y se re-ejecuta la instrucción. El proceso pasa a estado bloqueado hasta que la página pase a memoria.
- Sin **limit** (todas las páginas son iguales)
- **Base** para cada página en lugar de todo el programa.

## Paginación

Ejemplo:

- Se generan direcciones de 16 bits [0, 2^16-1] = 64KB
- Pero la computadora tiene 32KB de memoria
- Cada página son 4KB (Virtuales y Físicas)
- Tengo 16 páginas (Virtuales) y 8 page frames (Físicas)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e7db0a61-d482-4354-b6c4-06b2d4ef21dc/Untitled.png)

- MOV REG = 0 → MMU(0) = 8192
- MOV REG, 8192 → MMU(8192) = 24576
- MOV REG, 32780 → MMU(32780) ?
    - Esta página está marcada como ausente (”X”)
    - Esta instrucción genera un **page fault.**
    - El SO busca un page frame libre o desaloja uno existente y trae el page frame que contiene la dirección buscada.
    - Si desaloja un page frame, deberá marcar con “X” la página virtual correspondiente que estaba mapeada al desalojado.
    - Deberá actualizar la “X” con el número de page frame.

### Tabla de páginas

La dirección virtual se divide en 2 partes

- Bits más significativos: número de página.
- Bits menos significativos: offset dentro de la página.

Para una dirección de 16 bits y páginas de 4KB, los 4 bits más significativos indican la página y os 12 bits restantes el offset dentro de la página.

![MMU con 16 páginas de 4KB](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4010aabf-811c-41f5-b037-10b86d6b93a5/Untitled.png)

MMU con 16 páginas de 4KB

### Entradas en la tabla de páginas

- 32 bits es un tamaño común, pero puede variar entre arquitecturas.

![Una entrada en la tabla de páginas típica](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/40e4c5bd-1042-4407-a291-6ec104551453/Untitled.png)

Una entrada en la tabla de páginas típica

- **Page frame number:** fundamental para traducir.
- **Present/Absent:** presente o no en memoria física.
- **Protection:** 1 bit: read o read/write. 3 bits RWX.
- **Modified:** si la página fue modificada (dirty bit), al llevar a disco la página, si esta no fue modificada entonces no hace falta actualizarla en disco.
- **Referenced:** si la página fue referenciada (lectura o escritura)
- **Caching disabled:** habilitar o no la cache en esta página.

### Translation Lookaside buffers

Is a memory [cache](https://en.wikipedia.org/wiki/CPU_cache) that stores the recent translations of [virtual memory](https://en.wikipedia.org/wiki/Virtual_memory) to [physical memory](https://en.wikipedia.org/wiki/Physical_memory). It is used to reduce the time taken to access a user memory location.

- Usualmente dentro de la MMU, es un pequeño hardware.
- Tiene pocas entradas, no más de 256 entradas. Comparado con las 2^32/2^^12 = 2^20 entradas de una arquitectura de 32 bits.
- Se hacen muchas referencias a un conjunto pequeño de páginas. Ya que 4KB (una página) para el stack es bastante.
- Cada proceso tiene una TLB. Los page frame sí o sí son distintos entre procesos.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9196bacb-87e5-411e-915d-bf9c3e7b3527/Untitled.png)

¿**Cómo funciona?**

1. Al llegar una Dirección Virtual se compara paralelamente con todas las entradas del TLB (hardware especial).
    1. Si la encuentra y no viola la protección → listo.
    2. Si viola la protección → protection fault.
    3. Si no la encuentra (miss) se recorre la tabla de páginas (memoria) y se reemplaza con alguna de las entradas de la TLB.
        1. ¿Qué hacemos con la entrada de la TLB que desalojamos?
            1. Actualizamos el bit de Modified en la tabla de páginas si es que fue modificada.

### ¿Qué pasa si el Espacio de Direcciones Virtuales (EDV) es muy grande?

**2 enfoques:**

- **Tablas de páginas multinivel.**
    - **La idea de tablas multinivel es evitar tener toda la tabla en memoria.**
    - En el ejemplo sólo necesito la top-level page table, la tabla del stack, del data y del text. Total = 16KB (4KB por cada tabla)

**Ejemplo:**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e80f8cad-79eb-42ca-bd24-606a742a10ee/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1865b2d1-b933-4b76-9ee7-7c5e81079792/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ac9256a8-0241-4cb0-88e3-ce96dd3f7922/Untitled.png)

- **Tablas de páginas invertidas.**
    
    - Tenemos una entrada por cada page frame, en lugar de por cada virtual page.
    - Cada entrada registra qué proceso y VP está ubicado en el PF.
    - Se ahorra mucho espacio cuando el EDV es mucho más grande que el EDF, pero…
    - La traducción de DV a DF es mucho más compleja. Si el proceso n referencia la VP **p**, **p** ya no sirve como índice en la tabla y es necesario buscar la tabla entera en busca de la entrada **(n,p)** en **cada** referencia a memoria.
    - Para esto se puede aprovechar la TLB, pero un **miss** requiere recorrer la tabla completa en memoria.
    - Para agilizar esta búsqueda se puede tener una tabla de VP hasheadas y todas las VP con el mismo hash se ubican en una lista. Al encontrar el par (VP, PF) se carga en el TLB.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0caa5747-663d-49c9-89b6-0acad621d6d7/Untitled.png)
    

## Fragmentación interna y externa

**Interna:** aquel espacio desperdiciado dentro de la unidad en la que se divide la memoria. Un programa pesa 50MB y 10 bytes. Las páginas son de 1MB. Entonces desperdiciará 1MB-10bytes.
**Externa**: un programa pide 50MB. Después deja libres esos 50MB. Si viene un programa de 100MB no los va a poder usar. Van a quedar inutilizados hasta que venga un programa de menos de 50MB.

### Condiciones necesarias

1. Dos procesos no pueden estar simultáneamente dentro de sus regiones críticas.
2. No se puede asumir velocidad y número de CPUs.
3. Ningún proceso corriendo afuera de su región crítica puede bloquear ningún proceso.
4. Ningún proceso debería esperar para siempre a entrar a su región crítica (Inanición).

## Soluciones

### 1. Desabilitar las interrupciones

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b374f809-0f68-4e00-a044-b74c9d8a4789/Untitled.png)

- No se le puede dar a procesos arbitrarios estos permisos.
- Si al entrar en la región crítica, el programa finaliza, dejaría deshabilitadas las interrupciones.

### 2. Lock variables

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1403c1c3-7ecd-4c20-be56-3b42c9d80566/Untitled.png)

- Existe race condition, por ejemplo si hay una interrupción cuando justo pasa el while(lock).
- **Spin Lock:** un lock que usa busy waiting. Busy waiting es continuamente testear una variable hasta que algun valor aparezca. Se debe evitar, salvo en casos que el tiempo de espera se sepa que es corto.
- **Big Kernel Lock:** cuando tenes muchos cores, que uno solo simultáneamente pueda acceder al kernel. Algo viejo que se usaba en Linux.

### 3. Alternación estricta

Proceso 1

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e4f3dd8b-47ed-41f9-b556-0cbc8512a66a/Untitled.png)

Proceso 2

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fd2583de-3d7a-46cd-84ce-b6c7be465939/Untitled.png)

- Si noncritical_region_2() es muy lenta, entonces el proceso 1 tardaría mucho en volver a ejecutar su critical_region_1().
- Con más procesos, el proceso 1 debería esperar a todos los otros procesos si los hubiera. No maximiza el paralelismo.
- Viola “3. Ningún proceso corriendo afuera de su región crítica puede bloquear ningún proceso.”

### 4. Solución de Peterson

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a35c9b4d-af0f-4f6b-a2f7-7ebfdcac5dfd/Untitled.png)

- Soluciona race condition.
- Sigue teniendo Busy Waiting.
- Implementado desde el lado de usuario.

### 5. Instrucción TSL (Test and Set Lock)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7d285f86-600a-46f8-ae3a-88b5ec31a1e1/Untitled.png)

Ejecuta estos 2 pasos de forma atómica, bloqueando el acceso al bus de memoria.

La diferencia con CLI es que CLi desactiva las interrupciones para un sólo nucleo, pero bloquear el acceso al bus de memoria lo hace para todos los cores ya que todos comparten el mismo bus.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3c717edc-e853-4938-b02c-ad8f8439e0ff/Untitled.png)

Luego:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/296547be-5312-4dc1-882c-67085067a046/Untitled.png)

Sigue teniendo Busy Waiting.

### 6. Instrucción XCHG (Exchange)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a4628d30-8de0-49d1-bbb1-b8860674354c/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d6aa2ee3-a1b2-430e-af92-cfbef53bd1bd/Untitled.png)

Ejecuta un swap atómico, bloqueando el acceso al bus de memoria.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/93f46ca0-04f8-4b28-a58b-cb66ec487348/Untitled.png)

Luego:

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/eb5f0ab6-61ef-4bdb-b1f0-e54917983228/Untitled.png)

Sigue teniendo Busy Waiting.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/78bac330-4824-4239-98a1-331047f7cdaf/Untitled.png)

<aside> ❕ Entonces, en vez de usar el Busy Waiting de JNE enter_region, se puede hacer un int 20h y cambiar el estado del proceso a blocked, para que luego pueda reintentar el enter_region.

</aside>