**¿Que es un file system?**

Es una colección organizada de archivos y directorios que reside en una partición del disco llamada volumen (puede estar en CD-ROMs y discos virtuales).

# Recap - Disco y mounting de un file system

Cuando nosotros utilizamos archivos en nuestra computadora, los visualizamos en una estructura de árbol (directorios) que lo hace fácil de trabajar. Sin embargo, los discos como dispositivos de hardware exponen funcionalidad de más bajo nivel que eso. Sobre esta funcionalidad más simple es que nuestros sistemas operativos implementan los **File Systems**.

El disco se divide de forma parecida a la memoria con paginación, esto es, en bloques numerados típicamente de 4KBs. Vimos que un file system esta dentro de una partición del disco (mas precisamente, en un volumen) y es un conjunto de estos bloques.

Cuando se desea crear un archivo nuevo dentro de un file system, se precisa darle bloques a este archivo. Si el archivo creado precisa solo 10 bytes, quedaran sin usar 4086 bytes del bloque. Por esto si haces click derecho en un archivo o carpeta y ves las propiedades hay una diferencia entre “File size” y “Size on disk”, uno es el tamaño real del archivo mientras el otro es la cantidad de espacio ocupado por sus bloques.

**Ejemplo de esto ultimo basado en lo que veremos mas adelante:**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b30836af-e9d6-4a9c-a22e-39410f2c2ded/Untitled.png)

_Esto es un file system generico dentro del sistema Linux_

Lo mas importante de esta ultima imagen es el _i-node (a.k.a inodo) table_ y los _data blocks_:

- Cada archivo o directorio en el file system tiene una unica entrada en la tabla de inodos. Esta entrada o puntero guarda la información del archivo (sus bloques) o directorio como veremos mas adelante.
- Los data blocks son los que ocupan la mayor cantidad de espacio y se usan para almacenar los datos que conforman un archivo o directorio en el file system.

# “Alojación” de Bloques

Cuando un file system precisa alojar bloques para un archivo, ¿cómo elige que bloques libres usar?

- **Alojación Contigua** se basa en que un archivo tenga todos los bloques que ocupa ordenados y contiguos. Esto simplifica y acelera la lectura del archivo, ya que es fácil calcular “la ubicación del i-ésimo byte del archivo”. Sin embargo, este sistema es muy limitado cuando se trata de extender un archivo (_e.g._ ¿que pasa si el siguiente bloque se le asignó a otro archivo?), y es altamente susceptible a la fragmentación.
    
- **Alojación Vinculada** se basa en que cada bloque de un archivo guarde un puntero al siguiente bloque en el archivo. Esto soluciona problemas de fragmentación ya que un archivo se puede extender y truncar fácilmente, pero esto es a costo de que el acceso a los datos en este sistema es muy ineficiente. Supongamos (caso muy común) que se quiere _appendear_ texto al final de un archivo, ¡para encontrar el final del archivo se precisa recorrer todos los bloques anteriores!
    
- **Alojación Vinculada ((intento 2))** pretende acelerar la búsqueda de contenidos de un archivo juntando los bloques en _clusters_. Un cluster puede ser, por ejemplo, 4 bloques. En vez de que un archivo se aloje de a bloques, se lo hace de a clusters, y cada cluster tiene un puntero al siguiente cluster. Esto alivia el problema de performance de la búsqueda al requerir menos pasos de lectura de bloques, pero no termina de resolver el problema.
    
    <aside> 💡 Con la vinculada, perdemos bytes de información al final del bloque porque se destinan a almacenar el puntero al siguiente bloque de datos. Sin embargo, es muy beneficiosa para el acceso secuencial.
    
    </aside>
    
- **Alojación Indexada** consiste en mantener juntos todos los índices de los bloques que contienen los datos de un archivo. A todos los archivos se le asigna una cantidad de bloques inicial para esta “Index Table”, y todos esos bloques se utilizan para guardar punteros a otros bloques que contienen los datos del archivo. ¿Cuál es el problema? Si hacemos que el tamaño de esta tabla sea un solo bloque, entonces tenemos un límite muy pequeño al tamaño máximo de un archivo. Pero si elegimos un número más grande, como por ejemplo 10 bloques de índice, entonces un archivo de texto que dice “hola” precisará alojar 40KBs de tabla de índices para solo utilizar la primera entrada!
    

# El Sistema FAT

El sistema FAT está basado en un sistema de **alojación vinculada** previamente explicado. Al principio del volumen, se coloca una _File Allocation Table_ que contiene una entrada por cada bloque alojable en el volumen. La entrada _i_ de la tabla contiene el número del bloque siguiente a _i_ en el archivo al que pertenece, o un valor especial “End of file” (distinto de 0) si es el último bloque en el archivo.

Los bloques sin usar se pueden encontrar buscando la tabla hasta encontrar un bloque cuya entrada contiene el número 0.

Este sistema es mejor que el de alojación vinculada previamente descripto, ya que por más que el algoritmo para encontrar los datos de un archivo sea más o menos el mismo, toda la información necesaria se encuentra en la tabla, por ende requiriendo menos accesos y menos movimientos dentro del disco.

Otra alternativa es realizar una **Free list**. Este es un archivo que, de la misma forma que cualquier otro archivo, contiene una lista vinculada de todos los bloques que utiliza. Este archivo especial contiene una lista vinculada de todos los bloques libres en el volumen. De esta forma, encontrar un bloque libre consiste simplemente de tomar el primero de la free list, y borrar un archivo consiste solo en agregar sus bloques a esta free list.

[File Allocation Table](https://www.youtube.com/watch?v=V2Gxqv3bJCk)

[What's Max Size of FAT32 File Limit & How to Break](https://www.diskpart.com/articles/max-size-of-fat32-file-0725.html)

# Alojación de bloques en Linux: Inode

Ya vimos anteriormente el método de alojación de bloques indexado. Se puede observar un _trade-off_ entre performance y eficiencia de espacio dependiendo del tamaño de tabla de índices que se elija.

En nuestras computadoras, generalmente tenemos archivos muy pequeños y al mismo tiempo archivos muy grandes, y precisamos que nuestro file system sea bueno para manejar ambos tipos de archivos; por ende alojación indexada de este modo no es una buena solución.

¿Y si hacemos que la tabla de índices sea una lista vinculada de bloques? Seria interesante, ¡pero caemos en el mismo problema de performance que con alojación vinculada! Para encontrar un punto medio entre estas soluciones, Linux introduce el **Inode**.

Mencionamos que Linux guarda en cada file system una inode table. Cada entrada representa un puntero a un inodo de un archivo o directorio presente en ese file system.

Cada **inode** guarda lo siguiente: toda la metadata del archivo, 10 bloques directos, 1 puntero a bloque indirecto, 1 puntero a bloque indirecto doble, y 1 puntero a bloque indirecto triple.

Los 10 “bloques directos” son 10 punteros a bloques que son contenidos en el mismo bloque que el Inode. Suponiendo que los bloques son de 4KB y los punteros son de 32 bits, podríamos apuntar hasta 40KBs de datos para un archivo, y por ende para archivos menores a 40KBs no se precisan bloques de índice extra. Hasta acá, un archivo estariamos usando $(10^1)$ bloques.

Cuando un archivo crece y ocupó los 10 directos y quiere seguir creciendo, utiliza el _bloque indirecto_ que apunta a un bloque completo donde entran tantos punteros como el tamaño de ese bloque (inode → indirecto1 → bloque de datos). Cada puntero apunta a datos. Permite utilizar otros $(10^3)$ bloques.

Si se queda corto, se utiliza el _bloque indirecto doble_. Esto es un puntero a un bloque que es utilizado plenamente como punteros a otros bloques, que contienen punteros a bloques de datos (inode → indirecto2 → indirecto1 → datos). Esto suma otros $(10^6)$ bloques al archivo.

Extendiendo el concepto, el último puntero es un _bloque indirecto triple_ que suma otros $(10^9)$ bloques al archivo. Si se precisan más bloques que esto, se recomienda tirar la computadora por la ventana.

[Inode Structure](https://www.youtube.com/watch?v=tMVj22EWg6A)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b7b4be73-54b1-443d-aa08-0f56d48d6204/Untitled.png)

<aside> ‼️ **Cosas para tener en cuenta:**

- El tamaño del archivo no puede superar ni la capacidad del inodo, ni la capacidad de la partición.
- Si un proceso necesita utilizar un dato de un archivo y este no está en la cache de disco, el sistema debe buscar en que inodo, de que archivo, de que file system tiene que traer el dato, y cargarlo a la cache de disco.
- Los inodos soportan tamaños de archivos de hasta apenas más de 4TB si los bloques son de 4KB y los punteros de 32bits.
- La FAT y los Indos estan del lado del Kernel y NO del lado del usuario. No lo manejan los procesos sino que los maneja el SO. </aside>

# Confiabilidad

Los file systems van a estar expuestos a todo tipo de mierda. Errores de transferencia, ruido o interferencia, cortes de luz en el medio de una escritura, tormentas solares, o hasta tu hermano jugando con la pelota en tu pieza y pegándole “por accidente” a tu computadora, hay espacio de sobra para que ocurran problemas.

Por esto, es importante que los file systems sean lo más robusto posible. En el caso de utilizar **alojación vinculada** por ejemplo, es un sistema que deja mucho potencial para problemas. En el caso que en el medio de la escritura de un archivo haya un corte de luz, es posible que el “puntero al siguiente bloque” de algún bloque quede con un valor inválido, resultando que si ahora escribís en ese archivo podes estar pisando otros archivos!

# Hard Links

Ambos directorios apuntan al mismo inodo donde están los bloques de datos de A.

- **Ubicación**: Los dos directorios no pueden estar en distintos discos y no pueden estar en dos file system distintos.
    
    Esto ocurre porque el directorio almacena el número de nodo dentro del filesystem. Si queremos que dos directorios apunten al mismo inodo, tienen el mismo número de bloque. Si ese número de bloque pertenece a otro filesystem, entonces apuntan a diferentes inodos.
    
- **Permisos**: Los atributos de los permisos están en el inodo, entonces A y A’ no pueden tener distintos permisos.
    
- **Borrado**: Si alguno de los dos directorios se borrara, no desaparece el otro directorio. El inodo tiene un contador de links que le indica por cuantos directorios esta siendo apuntados.
# Soft Link

Ahora, el directorio A’ apunta al inodo A’ que tiene una ruta al directorio A. El directorio A apunta al inodo A que contiene los datos.

- **Ubicación**: Como podemos guardar un path absoluto, podemos tener a los dos directorios en distintos file system.
- **Permisos**: Como tenemos un nuevo inodo, este puede tener sus propios permisos. Prevalecen los permisos del inodo al que apunta A’ por sobre los permisos del nodo al que apunta A. Esto hace que podamos tener tanto mas como menos permisos
- **Borrado**: Siguiendo el razonamiento del contador, vamos a tener un puntero roto si borramos el inodo A.