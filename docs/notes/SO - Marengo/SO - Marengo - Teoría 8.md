# File System

Queremos resolver:

1. Almacenar mucha información, que quizás no entra en el EDV.
2. Persistencia luego de la muerte del proceso.
3. Múltiples procesos accediendo a la misma información.

**De nuevo: Abstracciones**

- Un proceso es una abstracción del CPU.
- El espacio de direcciones es una abstracción de la memoria.
- **Los archivos son una abstracción del disco, de hecho , se pueden ver como un espacio de direcciones.**

Los archivos son administrados por el file system del SO y se encarga de definir cómo serán:

- Estructurados
- Nombrados
- Accedidos
- Usados
- Protegidos
- Implementados
- Administrados

## Una manera en la que se puede organizar el disco

- El primer sector es el **Master Boot Record** que carga el boot block de la partición activa.
- La tabla de particiones indica principio y fin de cada partición y la partición activa.
- Cada partición está compuesta por:
    - **Boot block:** carga el sistema operativo.
    - **Super block:** magic number, número de bloques, etc.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e1987c0c-5b43-429b-ad71-e2e7810934ee/Untitled.png)

<aside> 🔎 **Mapear bloques del disco a archivos → Responsabilidad principal del file system.**

</aside>

# Archivos

## Archivos: Asignación contínua (Allocar)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2cb3f416-b8c0-4e45-8cc3-082b74f34f62/Untitled.png)

**Ventajas:**

- Fácil de implementar (sólo inicio y longitud).
- Excelente rendimiento de disco → Porque sino tendría que girar el disco y mover el cabezal muchas más veces.
    - **Acceso secuencial:** voy leyendo bloque por bloque.
    - **Acceso random:** si quiero acceder al 4to bloque: longitud-inicio+4.
- Poca **fragmentación interna**: en el peor caso es usar sólo un byte de un bloque, asi que sería “tamaño de los bloques - 1” byte.

**Desventajas:**

- **Fragmentación externa**. Si borro un File, dejo ese espacio libre.
- Conocer el tamaño a priori. No me puedo dar el lujo de hacer crecer el archivo.

## Archivos: Asignación con listas enlazadas (en disco)

- La primer palabra de cada bloque es un puntero al siguiente bloque.
- Sólo necesitamos el puntero al primer bloque.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7f3b2e4d-8c15-417f-8d46-a7c215e6aec1/Untitled.png)

**Ventajas:**

- Nula **fragmentación externa**: los bloques pueden estar en cualquier lado. Un puntero puede apuntar a un espacio libre sin problemas.
- Poca **fragmentación interna**: en el peor caso es usar sólo un byte de un bloque, asi que sería “tamaño de los bloques - 1” byte.
- **Acceso secuencial**: es eficiente, voy leyendo bloque por bloque en la lista.

**Desventajas:**

- **Acceso random:** tengo que recorrer toda la lista.
- Al usar una palabra para el puntero, se pierde la oportunidad de la buena programación en términos de todo el espacio de cada bloque.

## Archivos: Asignación con listas enlazadas (en memoria)

- El concepto es el mismo pero la tabla se almacena en memoria.
- Este esquema se conoce como File Allocation Table (FAT).

**Ejemplo:**

- Disco de 1TB.
- Bloques de 1KB.
- → 1G * Tamaño de entrada ocupado para la tabla (**Desventaja**)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/178dc6ef-6497-40f0-b05d-c67e7a180691/Untitled.png)

**Ventajas sobre en disco:**

- Más rápido que en disco al estar en memoria.
- Se pierde la desventaja de usar una palabra para el puntero.

## Archivos: i-nodes (index-node)

- Cada archivo tiene un i-node que contiene atributos (el propietario, permisos, cuándo fue la última vez que fue cambiado, etc.) y la lista de bloques.
- **Sólo está en memoria si el archivo está abierto.**
- Se reserva la última posición para un bloque con más direcciones para poder hacer crecer el archivo tanto como sea necesario.
- Se ocupa cantidad de archivos abiertos * tamaño de la tabla.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c5a21ad5-a825-4652-8ae6-31cc4a47e1b8/Untitled.png)

# Directorios

Ante la búsqueda de un archivo, se utiliza la ruta para localizarlo.

- La entrada de directorio (dirent) posee la información del bloque del archivo.
    - Dirección de todo el archivo → almacenamiento contínuo.
    - Dirección del primer bloque → listas.
    - Número de i-node → index-nodes.
- La principal función del sistema de directorios es mapear nombres de archivo al contenido de los mismos.

![(a) Cada entrada de directorio con sus atributos. (b) Cada entrada de directorio con i-nodes.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e7837cd2-c043-44b8-99db-52ca97778563/Untitled.png)

(a) Cada entrada de directorio con sus atributos. (b) Cada entrada de directorio con i-nodes.

### Nombres de archivos

- Cada sistema impone diferentes límites en la longitud.

2 enfoques para guardar el nombre:

1. **Nombre seguido del encabezado.**
    
    - Problema de fragmentación. También se necesita alineación de memoria.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/303e53e9-7e98-440d-8e02-b28c277f2b94/Untitled.png)
    
2. **Punteros a los nombres**
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/27c9c8e0-374e-4caa-97ab-ca4e59b1b34d/Untitled.png)
    

# Archivos compartidos

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/45fd133b-ead0-44b9-9b33-78a369e463f4/Untitled.png)

- Al aceptar shared files, el directorio se transforma de un árbol a un **grafo acíclico dirigido** (DAG)
- Uno de los archivos de C es accesible a través de un directorio de B mediante un link.

2 enfoques para shared files:

1. Existe un único i-node para este archivo y es apuntado por ambos directorios (**hard link**).
2. Crear un archivo de tipo LINK en el directorio de B con la ruta real del archivo “C/C/C/?” (**symbolic link**).

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e6f69473-b2f7-4c7b-b68c-af44da9e3f7d/Untitled.png)

<aside> ❓ ¿Qué pasa si C borra el archivo compartido?

</aside>

**Hard link:**

- El hard link es inválido y si se reusa el número de i-node, accede a otro archivo.
- Para solucionar esto, se le puede añadir un contador de cúantos están referenciando a ese i-node.

**Symbolic link:**

- Simplemente se borra el i-node y el link se invalida, como un path inválido.

**Observaciones:**

- Acceder a través de un symbolic link es más costoso ya que es necesario obtener el i-node a partir del path.
- Los symbolic links pueden cruzar las fronteras del file system, incluso a otra computadora si se provee la dirección de red + la ruta del archivo.

# Log-structured file system (LFS)

**Escribir mucha información continua** para maximizar el ancho de banda del disco. Esto se debe a que la escritura es muy rápida, pero el movimiento del cabezal y del track no.

- Estructurar el disco como un único log.
- Periódicamente y cuando sea necesario, todas las escrituras pendientes (almacenadas en memoria) son reunidas en un segmento y escritas en una única operación al final del log.
- Al comienzo del segmento hay un resúmen de lo que se puede encontrar en el disco.
- Ese segmento va a tener de todo, mucha información mixta, no es sólo del bloque de un archivo.

**Ventajas:**

- Resultados muestran que es 1 orden de magnitud más rápido que UNIX para escrituras pequeñas y eficiencia comparable o incluso mejor para escrituras grandes.

**Desventajas:**

- La búsqueda de un i-node se realiza mediante una tabla en memoria, pero es rápido al estar en memoria.

# Journaling file systems (JFS)

LFS no es muy compatible con file systems existentes pero podemos aprovechar algo:

Para mejorar la **robustez ante fallas** (lograr atomicidad) ****podemos aprovechar la idea del log:

- Mantener el log con lo que se va a hacer antes de que se haga.
- Si el sistema falla, se consulta el log y se termina el trabajo.

**Ejemplo:** Eliminar un archivo en UNIX

1. Eliminar el archivo del directorio
2. Liberar el i-node (al conjunto de i-nodes libres)
3. Liberar los bloques de disco (al conjunto de bloques libres)

El orden no importa mientras no haya fallas. Si las hay, una amplia variedad de escenarios pueden surgir

- Bloques inaccesibles, entradas de directorios inválidas o apuntando a i-nodes de otros archivos, i-nodes inaccesibles, etc.

Resumen

- Escribimos el log de operaciones (y quizás lo verificamos), luego las empezamos a ejecutar y cuando terminamos borramos el log.

<aside> ❕ **Las operaciones deben ser idempotentes** (si las hago de nuevo no cambian el resultado). Por ejemplo, eliminar el archivo del directorio es idempotente, ya que si lo elimino de vuelta es el mismo resultado.

</aside>

