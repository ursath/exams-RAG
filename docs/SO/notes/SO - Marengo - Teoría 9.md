# Deadlock

Un conjunto de procesos está bloqueado, en estado de **deadlock**, si cada proceso del conjunto está esperando un evento que sólo puede causar otro proceso del conjunto.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0fcdf20f-c686-4e89-85fc-97da6a0e8ef2/Untitled.png)

# Preemtable and Nonpreemtable Resources

**Recurso**

- Cualquier cosa que puede ser adquirida, usada y liberada.

**Preemtable resource**

- Se le puede quitar a un proceso sin causar problemas.

**Nonpreemtable resource**

- No se le puede quitar a un proceso sin causar problemas → **Vamos a hablar de estos cuando hablemos de deadlock.**

# Condiciones necesarias para que ocurra deadlock

### Condición de exclusión mutua

Un recurso o está asignado a un proceso o está libre (no está asignado a más de un proceso).

### Condición hold-and-wait

Un proceso que actualmente posee un recurso, pueda pedir nuevos recursos.

### Condición no-preemption

Recursos obtenidos previamente no se puede quitar de un proceso “por la fuerza”. Tiene que ser liberado por el proceso que lo tiene.

### Condición espera circular

Tiene que haber una lista circular de dos o más procesos, cada uno está esperando por un recurso mantenido por algún miembro de la lista.

## Modelando el deadlock

- Usando grafos dirigidos podemos modelar ele stado de requerimiento y uso de recursos.
- Cuadrado: Recurso
- Circunferencia: Proceso

![(a) El proceso A tiene el recurso R.         (b) El proceso B pide el recurso S.          (c) Deadlock](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ac07347d-de4f-4ecf-9a9d-8a7c55194971/Untitled.png)

(a) El proceso A tiene el recurso R. (b) El proceso B pide el recurso S. (c) Deadlock

<aside> ❓ ¿En qué orden seguro nunca hay deadlock (scheduling)? → Forma secuencial, pero es ineficiente.

</aside>

# ¿Qué podemos hacer?

## 1. Just ignore the problem

Puede que no pase en gran probabilidad y es mejor enfocarse en otras cosas que si ocurren a menudo.

## 2. Detection and Recovery

### Detección con 1 recurso de cada tipo

Si existen ciclos, los procesos involucrados en el ciclo están en estado de deadlock (podría haber otro proceso pidiendo un recurso del ciclo, y también lo estaría).

### Detección con múltiples recursos de cada tipo

Por ejemplo, múltiples impresoras, lectoras de dvd, etc.

- Tenemos _**n**_ procesos, P1 a Pn.
    
- Tenemos _**m**_ clases de recursos.
    
- _**Ei**_ donde 1 ≤ i ≤ m, representa la cantidad de recursos de la clase i.
    
- _**E**_ es el vector _**(E1, E2, …, Em)**_ → vector de recursos existentes.
    
- _**A**_ es el vector _**(A1, A2, …, Am)**_ → vector de recursos disponibles.
    
- _**C**_ es la matriz de asignación actual.
    
    ![C12: El proceso 1 tiene este valor (el número que iría en esa celda), de recursos de tipo 2](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b70ec56e-4c78-4f87-92a1-67854731e06d/Untitled.png)
    
    C12: El proceso 1 tiene este valor (el número que iría en esa celda), de recursos de tipo 2
    
- _**R**_ es la matriz de requerimientos.
    
    ![R12 es la cantidad de recursos de clase 2, que pide el proceso 1.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9d40e075-5840-4c24-9abe-2ccfbf410063/Untitled.png)
    
    R12 es la cantidad de recursos de clase 2, que pide el proceso 1.
    
- Definimos la relación A≤B, por ejemplo (1,5,3)≤(1,6,4) = Verdadero porque 1≤1, 5≤6, 3≤4.
    
- **Invariante: $\sum{C_{ij}}+A_j = E_j$**
    
- **Algoritmo:**
    

1. Buscar un proceso no marcado Pi, donde la i-ésima fila de R ≤ A → Todos los recursos que está requiriendo ese proceso, hay igual o más cantidad disponibles.
2. Si se encuentra ese proceso, añadimos su i-ésima fila de C en A, marcamos al proceso y volvemos al paso 1.
3. Si no hay procesos tales, el algoritmo termina → deadlock.

### Recuperación

- Quitar el recurso (preempt). Usualmente difícil sino imposible.
- Rollback mediante el uso de checkpoints.
- Matar uno de los procesos involucrados, o uno que tenga un recurso solicitado por algún proceso en estado de deadlock.

## 3. Dynamic avoidance by careful resource allocation

### Trayectoria de recursos

- Eje X: instrucciones ejecutadas por el proceso A.
- Eje Y: instrucciones ejecutadas por el proceso B.
- ///: ambos procesos tienen la impresora (imposible).
- \\\: ambos procesos tienen el plotter (imposible).

![En Azul sería ejecutar A y B de forma secuencial.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/346bda31-8a0b-4223-9fed-8e137c9677f9/Untitled.png)

En Azul sería ejecutar A y B de forma secuencial.

### Estados seguros e inseguros

- Usamos las matrices C y R para detección de deadlock.
- Un estado es seguro si existe una planificación (scheduling) que permita que todos corran sin llegar a deadlock.

![El estado (a) es seguro con la planificación B-C-A.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ff707e1f-955f-4ba6-9747-561484faade2/Untitled.png)

El estado (a) es seguro con la planificación B-C-A.

![El estado (b) no es seguro, si o sí le tengo que dar los 2 libres a B, y luego caigo en deadlock.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6ed77bff-10ff-4d45-b7d2-c8bee4242101/Untitled.png)

El estado (b) no es seguro, si o sí le tengo que dar los 2 libres a B, y luego caigo en deadlock.

## 4. Prevención negando alguna condición necesaria

|**Condición**|**Enfoque**|
|---|---|
|**Exclusión mutua**|‘Spoolear’ todo.|
|**Hold and wait**|Pedir todos los recursos desde el inicio.|
|**No preemption**|Poder quitar recursos.|
|**Espera circular**|Tomar los recursos siempre en el mismo orden.|

**Spool:** manejar el acceso a un recurso por medio de un proceso jefe.

# Tipos de deadlock

Vimos **deadlock de recursos,** problema en la sincronización de competencia. Pero también existe el **deadlock de comunicación** y es un problema de la sincronización de la cooperación. Por ejemplo, supongamos que el proceso A envía un mensaje al proceso B, el cual espera hasta que llegue el mensaje. Si el mensaje se pierde, B esperará por siempre y posiblemente A también si espera una respuesta de B.

- Una solución a esto es poner timeouts de espera.

# Livelock

- Están en estado ready, pero no progresan.
- Más difícil de chequear.