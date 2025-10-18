### Herramientas
- gcc
- make
- docker
- qemu
- valgrind
- strace/ltrace
- cppcheck
- PVS-studio
- gdb
- git

# Sistema Operativo

### Kernel Mode vs User Mode

En kernel mode se puede ejecutar cualquier instrucción que esté disponible.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1a62716a-5c34-480c-a535-7c3c5e8c75aa/Untitled.png)

Aclaraciónes:

- El administrador es un usuario que corre en User Mode
- La shell no es especial, no tiene privilegios. La shell permite crear nuevos procesos.

### ¿Qué hace?

- Ocultar el hardware y ofrecer una interfaz limpia, elegante y consistente al programador.
- Administrar recursos

### Syscalls

- Se puede ver como una simple llamada a función que además cambia a modo kernel
- El mecanismo para realizar una system call depende de la arquitectura y debe expresarse en assembler.
- Se provee una librería para poder realizarlas desde un lenguaje de alto nivel

**POSIX:**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/31e8528a-8a91-494a-b5de-0d9983867ca7/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ebe01c5-baad-4c4e-98db-b59538ce92b8/Untitled.png)

**…**

### Sobre la syscall read

Devuelve 0 cuando llega al fin del archivo

Devuelve EOF (-1) en caso de error

No confundirse con el EOF del getchar, el getchar usa read y cuando este le devuelve 0 el lo traduce a EOF. También usa EOF en caso de error como read.

El cat se bloquea esperando el read