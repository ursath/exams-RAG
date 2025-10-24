# Tareas críticas de gestión de proyectos

---

Hay tres tareas críticas en la gestión de un proyecto:

- _**Estimación:**_ predecir recursos, tiempo y costos necesarios.
- _**Planificación:**_ seguimiento del progreso del proyecto.
- _**Seguimiento y control:**_ ajustar la planificación basándose en el monitoreo constante.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/c4edd73f-2607-4c42-b1ff-e9256a3627be/Untitled.png)

# Estimando en un proyecto informático

---

**¿Qué se puede estimar en un proyecto informático?**

Como cada proyecto es único e irrepetible, los datos que tenemos para estimar son limitados. Sin embargo, siempre se puede estimar, solo debemos obtener/buscar la información necesaria. Pensemos que no podríamos gestionar el proyecto si no tuviéramos una mirada global de el.

| Producto | Evaluar tamaño y complejidad del producto software.

¿Cuántas bases de datos? ¿Tipos de usuarios? ¿Requisitos funcionales? ¿Componentes? | | --- | --- | | Esfuerzo | Determinar horas-hombre y recursos humanos necesarios.

¿Cuántas horas-hombre necesito para construir el producto? ¿Cuántos RRHH? | | Costo | Distribuir horas y calcular el costo total del proyecto

¿Cómo distribuir las horas? ¿Cuánto va a costar el Proyecto? |

**Repasando la transición de la estimación a la planificación**

[Gestión Global](https://www.notion.so/Gesti-n-Global-a32203f326c24b08941dfe8ec80671cf?pvs=21)

Generalmente el costo del proyecto es un 10%-15% más bajo del costo final, que se obtiene en la etapa de “Ajuste de Costo”. Esto ocurre por la aparición de la planificación. Si la diferencia es más grande, significa que algo falló en el proceso y debe ser revisado.

Cuanto mejor planifiques, mejor será el manejo de errores o complicaciones a lo largo del proyecto.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/6615e950-f21d-4a4f-9378-baa5ea03b0d0/Untitled.png)

En software siempre se puede estimar asumiendo un cierto nivel de incertidumbre porque ningún producto es igual a otro, por ende ningún proyecto va a ser igual

Se puede estimar a partir de la experiencia, casos similares, tomando métricas objetivas, métricas de la empresa.

# El ciclo de estimación

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/0912b5fc-f9b3-4556-91fc-e2cec94b6476/Untitled.png)

Siempre voy a seguir un ciclo de estimación que es:

- Hacer una estimación sobre los objetos que yo conozco, obteniendo toda la información que pueda
- Una vez que desarrollo, mido y reviso el resultado
- Comparo la estimación, analizo
- Calibro la estimación y repito

<aside> ☝🏼 Este proceso se lleva a cabo independientemente de la técnica de estimación utilizada.

</aside>

La incertidumbre se achica cada vez mas a medida que avanzamos en el tiempo porque conocemos mas el producto, como trabajan mis equipos. O sea, porque voy obteniendo mas información.

# Estimando el tamaño del producto software

---

**¿Qué afecta el tamaño del producto software?**

- Cantidad y complejidad de las funcionalidades
- Cantidad y complejidad de los datos
- Requerimientos no funcionales
- Grado de innovación
- Entorno de programación
- Desarrollo de algoritmos
- Procesamiento distribuido

<aside> ☝🏼 Claramente el tamaño del producto cambia dependiendo si tengo un producto complejo o simple, pequeño o grande.

</aside>

# Estimando el esfuerzo

---

**¿Qué afecta al esfuerzo del proyecto?**

Primero que nada, el tamaño y complejidad del producto software estimado, ya que es proporcional al esfuerzo que hay que insumir para construirlo.

Además afecta:

- **Características internas del proyecto** (cada proyecto es único e irrepetible)
    - Conocimiento del equipo de desarrollo
    - Metodología de gestión del equipo
    - Interacción con los usuarios
- **Características del contexto del proyecto** (donde se va a desarrollar el proyecto)
    - Infraestructura tecnológica
    - Grado de innovación
    - Características del cliente
    - Modelo de negocio

# Métricas

---

Una métrica debe ser

- Objetiva
- Sencilla (definible con precisión)
- Fácilmente obtenible
- Válida (adecuada a lo que se propone medir)
- Robusta (que no la afecten los cambios en el proceso o producto)

# Decisiones de estimación

---

- Podemos no estimar inicialmente, es decir, dejar el calculo de la estimación para mas adelante
- Podemos basarnos en proyectos similares ya terminados, medidos con métricas especificas
- Podemos utilizar técnicas de descomposición relativamente sencillas para generar estimaciones de costo y de esfuerzo del proyecto
- Podemos desarrollar un modelo empírico para el calculo de costos y esfuerzo

# Momentos de estimación de un proyecto

---

1. **Macro estimación**

Primera estimación contando con algunos parámetros descriptivos y genéricos sobre el proyecto.

Permite hacer una primera aproximación del tamaño del proyecto y estudiar su viabilidad.

1. **Estimación detallada**

Una vez definidos los requisitos se realiza la estimación detallada para la siguiente fase de diseño y se puede realizar una planificación detallada

1. **Estimación de las siguientes fases**

Conocida la información una vez finalizado el diseño se puede mejorar las estimaciones de las restantes fases

1. **Estimación de defectos**

Al finalizar la programación, pruebas e instalación de una parte del producto se puede obtener datos de rendimiento y calidad para las siguientes fases o para el mantenimiento

# Clasificación de métodos

---

1. _**Opinión de experto:**_ basada en experiencias personales de gente especializada
    1. Tienen que ser experiencias sistematizadas
    2. Consultorías, expertos en estimación
    3. Conocen el tipo de tecnología, entienden los perfiles que se necesitan, etc
2. _**Analogía:**_ comparación con proyectos anteriores de similares características
3. _**Descomposición:**_ desagregar el producto a partir de las funcionalidades, estimar cada parte, y luego sumar, ajustar y contar el costo de las uniones. O sea, descompongo horas, esfuerzo, etc y calculo por separado para después sumar
4. _**Métodos algorítmicos:**_ usar un algoritmo que toma datos del sistema (por ejemplo, funcionalidades, inputs, etc) y factores de ajuste por complejidad y devuelve una estimación

# Modelos de estimación

---

**Producto**

- Puntos de función (por descomposición)
- Puntos de casos de uso (por descomposición)
- Puntos de objeto (por descomposición)
- Planning poker (por descomposición, descompone en historias de usuario)

**Proceso**

Recordar que para poder realizar una estimación de proceso, antes tengo que tener una estimación del producto y tener un análisis del contexto.

- Método de Wideband Delphi (por analogía) → Se aplica para proyectos grandes
- Modelo Walston y Félix (algorítmico) → Específicos para ciertos proyectos tecnológicos, son muy caros
- Modelo Bailey y Basili (algorítmico) → Fuera de uso
- Modelo Boehm (COCOMO) (compuesto) → Lo vamos a usar
- Método de Clark (por analogía) → Usado por IBM

# Niveles de Gestión

---

- El nivel dirección de proyectos informáticos que está formada por una cartera de proyectos y se analiza la factibilidad (riesgos, análisis FODA) para saber qué proyectos deben realizarse. Gracias a esto podemos definir que proyectos se van a planificar en niveles inferiores. El PMI ofrece certificaciones para realizar tareas relacionadas a este nivel.
- En la gestión de proyectos informáticos, se utilizan estándares para seguir el desarrollo del producto software. Esto es lo que venimos estudiando hace dos meses.
- En el nivel más bajo, tengo a las metodologías ágiles, más que nada para la gestión del proceso desarrollo. Vamos a estimar cada sprint. Cuando un sprint completan un entregable, iteramos.
- Producto software: el que realizamos nosotros
- O sea vamos a estimar de abajo para arriba. A medida que subimos vamos sumando.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/5c1e0ea9-7a0f-43e5-89bf-ed74ea670241/Untitled.png)

> _Nada de esto es una receta. Hay veces que no se puede aplicar cierto método. A medida que el PM tiene más experiencia, darse cuenta de esto y adaptar el modelo al caso particular es más fácil._

# Planning Pocker

---

Es una técnica ágil de estimación y hace uso de descomposición. Toma las historias de usuario del backlog, se ve la complejidad que tiene y se le asigna un puntaje con un numero de Fibonacci. La suma de todas las historias de usuario nos permite evaluar cuantos puntos se intentan quemar en el sprint.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/70d5d7d8-d441-4661-bc55-3525f14acba7/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/7ef2320b-4068-4cb1-97f8-f3160f917fa8/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/10b43df2-fe1a-417c-9118-2ad01e80613f/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/abe6193b-390d-48d4-a01c-619276b327c0/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/515f970d-60a2-47ac-9998-327c90f99612/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/a0d40a1f-dfba-4754-b55d-3b7864674099/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/e5e1409f-b1fa-450e-a49e-c7e610eb3482/Untitled.png)