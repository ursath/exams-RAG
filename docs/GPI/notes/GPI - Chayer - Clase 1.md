
---

# Warm Up

---

**¿Qué es un proyecto?**

Un proyecto es un conjunto de actividades o tareas (objetivos intermedios) para llevar adelante la construcción de una solución que genere un resultado (objetivo final), en un rango de fechas determinado con una cierta asignación de recursos.

En todas las ingenierías se tratan los proyectos de la misma manera. Lo que cambia es el resultado y los pasos intermedios para llegar a ese resultado.

En proyectos informáticos, pensamos la asignación de recursos, infraestructura y tecnología en base a los requerimientos funcionales y no funcionales.

- Diferencia entre producto y proceso
    
    El proyecto es la combinación del producto (único e irrepetible) y el conjunto de actividades (se pueden repetir las actividades) que logran llegar a ese producto. Por lo tanto, es crucial concebir un producto para definir las actividades o procesos, estableciendo así el marco del proyecto (tiempos, etapas, etc.).
    
    <aside> 🗣 **Ejemplo de la papa frita:**
    
    Las actividades son: agarras una papa, lavas, pelas, volver a lavar, cortas, dejas remojar la papa, la escurrís, la hervís y después la freís.
    
    Los estados son papa normal, papa lavada, papa cortada, etc.
    
    _**El producto se va transformado dependiendo las actividades que haga**_
    
    </aside>
    

Los productos pueden ser dependientes de un cliente específico o independientes.

# Etapas de un proyecto

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/fb03e8a1-4695-4886-bc7b-45a119edf09e/Untitled.png)

**Problemas con los proyectos informáticos**

Hay mucha disparidad entre lo que se ideó inicialmente (por el cliente, por ejemplo) y lo que realmente se necesitaba. Desde el principio, el producto no está claramente definido porque el producto no existe.

![Hay muchas formas de entender (o no) el objetivo](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/ae08dea1-38e1-4947-bf5a-3389efa9e092/Untitled.png)

Hay muchas formas de entender (o no) el objetivo

**Partimos del problema a resolver**

1. Entender e identificar el problema con la mayor precision posible _(NO del producto que queremos obtener)_. Esto depende mucho del contexto.
2. Analizar requerimientos (funcionales y no funcionales)
3. Evaluar viabilidad
    - El producto que vamos a hacer, lo que busca obtener el usuario, ¿Es viable en base a mi contexto? (equipo y recursos que dispongo, etc)

**Evaluación del proyecto**

- Partiendo del problema, primero se define el alcance del producto
    
- Luego se piensa el modelo de negocio teniendo en cuenta la organización en la que estoy
    
    El modelo de negocio te da una perspectiva del producto: características técnicas, cómo van a ser las facetas del producto (qué hago ahora y que se va a hacer más adelante), comercialización (nacional, internacional), etc.
    
- Hacemos un análisis de los riesgos
    
- Armamos el plan del proyecto
    

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/88f09c87-ad2e-4ff8-a6f8-7163c5766da0/Untitled.png)

**Planificación del proyecto**

![Este proceso permite armar un plan de gestión](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/5b9b7875-e8c6-4514-a657-6a45fba0cad5/Untitled.png)

Este proceso permite armar un plan de gestión

Realizar una planificación de un proyecto implica tener que estimar varias cosas.

| Debemos estimar…    | ¿De que manera?                                             |
| ------------------- | ----------------------------------------------------------- |
| Tamaño del producto | Se lo puede estimar a partir de los requisitos funcionales: |

- Cantidad de puntos de función
- Casos de uso
- Cantidad de líneas de código o bases de datos

La experiencia no es necesaria para realizar esta estimación, pero sirve para ajustarla. | | Esfuerzo en horas | Calcular la cantidad de meses/hombre que requiero para el desarrollo del proyecto, teniendo en cuenta:

- El tamaño del producto (paso anterior)
- La evaluación del equipo
- Las variables del contexto (financiamiento, equipo, etc).

Con esto, podemos transformar los meses/hombre en horas totales para el proyecto. | | Costo de proyecto | El ******total de horas del proyecto por valor de horas por perfil y cantidad de recursos. | | Tareas (o actividades) y RRHH | Primero, definir lista de tareas según **modelo de proceso**. No se debe reinventar la rueda dado que nos basamos en un proyecto ya existente para poder definir las actividades a realizar. Por ejemplo, podemos definir la siguiente como una lista de tareas:

- Proceso de análisis-educación de requisitos
- Análisis de los usuarios
- Evaluación heurística
- Desarrollo
- Testing funcional

Con esto hecho, debemos definir los recursos humanos. Definimos las personas para diferentes tareas, **metodologías de trabajo**, herramientas de trabajo, y necesidades de formación.

- _**Metodologías de trabajo:**_ de que manera llevo adelante las actividades con mi equipo de trabajo (por ejemplo, SCRUM o XP)
- _**Modelos de proceso:**_ actividades básicas necesarias para llevar a cabo un proyecto (análisis de requisitos, armado de backlog, análisis de usuarios, etc)

En resumen, primero se describe “que” (modelo de proceso) se debe hacer en un proyecto y luego definimos “como” (metodologías agiles) lo vamos a hacer | | Plan de trabajo | Calendarizar.

Distribuir las horas totales por tareas identificadas según RRHH concretos.

Puedo paralelizar actividades si la lógica de las mismas me lo permite y tengo los recursos disponibles para ello. | | Ajuste de costos | Calcular el costo total del proyecto. Este se obtiene luego del paso anterior.

Notar que a esta altura podemos ser precisos ya que contamos con las personas que trabajaran y el tiempo que le dedicarán a las actividades. |

**Gestion del proyecto**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/cf41ef9e-00af-48e9-b54b-1f99c43935ac/Untitled.png)

La gestión del proyecto implica asegurarse de que todo esté en su lugar para que el proyecto se realice según lo planeado (paso anterior)

- _**Gestión de Configuración:**_ Me permite ver la trazabilidad de todo el producto
- _**Gestión de Calidad:**_ Asegura que el producto cumpla con los estándares establecidos, mediante la comparación con criterios de calidad y la toma de medidas correctivas si es necesario

<aside> ☝🏻 Ocurre que las necesidades del usuario están en constante evolución. Según pasa el tiempo y vamos desarrollando nuestro producto, **puede** aumentar las expectativas de funcionalidades que el usuario espera del sistema.

</aside>

# Procesos Software y Ciclo de Vida

---

Las etapas del proyecto que vimos se ocupan del proyecto en su totalidad, el proceso de software y el ciclo de vida del software se centran específicamente en el desarrollo del producto de software dentro de cualquier proyecto informático.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/b8343282-96d1-4fdd-a1f9-7b0bf444050c/Untitled.png)

| Proceso de software | Conjunto de actividades interrelacionadas por diversas estrategias que transforman el producto software                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Ciclo de vida       | Conjunto de estados por los que pasa el producto. Ciclo de transformaciones que el producto sufre a lo largo de su vida |

<aside> ☝🏼 El proceso de construcción de software es único, siempre el mismo, lo que varía es el orden en que se realizan las actividades de acuerdo a los componentes de cada producto.

</aside>

**Respecto de los ciclos de vida**

No existe un único modelo de Ciclo de Vida que defina los estados por los que pasa un producto. Cada proyecto debe seleccionar el Ciclo de Vida que resulte más adecuado para las especifidades del producto.

**Respecto del proceso de software**

Un proceso de software…

- Facilita la comunicación entre equipo de desarrollo y usuarios (SCRUM)
- Permite una mejor comprensión y definición de la gestion (PMI)
- Facilita la reutilización del proceso al definir elementos estándar (ISO/IEEE)
- Permite la evolución y mejora del proceso (TODOS)
- Ayuda a la gestion del proceso y facilita la movilidad de las personas del equipo (TODOS)

# Ingeniería de Productos vs de Procesos

---

En todo tipo de producción industrial, la _**Ingeniería de Producto**_ especifica las características técnicas de los productos que construye. En tanto que la _**Ingeniería de Procesos**_ define las especificaciones de las actividades del proceso productivo en el campo de aplicación correspondiente.

Cada uno sigue estándares, normas, metodologías, modelos de gestión y modelos de madurez.

# Proyectos informáticos

---

Cuando un proyecto informático es independiente del cliente, el producto se diseña para un mercado más amplio, mientras que cuando es dependiente de un cliente específico, se adapta a las necesidades particulares de ese cliente en particular.

Los proyectos se pueden plantear como producto terminado (un paquete) ó por horas hombre (el producto se va transformando y pueden llegar a haber modificaciones en el camino).