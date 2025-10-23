# Constructive Cost Model (COCOMO)

---

Es un modelo de estimación para calcular el **costo** y la **duración** del desarrollo o mejora del sistema.

<aside> ☝🏼 El costo no incluye cosas como el costo de la oficina, solo el costo del desarrollo del producto en sí

</aside>

El modelo hace uso de datos empíricos que luego se extrapolaron a fórmulas para estimar cualquier proyecto software.

**¿Que se obtiene de COCOMO?**

A partir de él se pueden obtener dos datos:

- _**Esfuerzo (meses/hombre):**_ cuántos meses de un chango me lleva desarrollar ese software.
- _**Tiempo de desarrollo**_ del sistema medido en meses

**Requisitos previos para aplicar COCOMO**

Para la utilización de COCOMO es necesario el número de instrucciones o líneas de código fuente obtenidos a partir de aplicar le método de estimación visto llamado [Puntos de Función](https://www.notion.so/Estimaci-n-de-tama-o-de-producto-y-puntos-de-funcion-f9adf3cce375495392852506bc4dc71c?pvs=21).

Con ese input, nos permite calcular el esfuerzo requerido, y en base al equipo sacar el tiempo que se tardará.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/ee62f0f5-3bd3-44a6-bf1c-400388012b5c/Untitled.png)

**En la evaluación se combinan dos aspectos:**

- El proyecto en sí mismo
- Composición del grupo de desarrolladores

<aside> ☝🏼 COCOMO es un paper público, lo que significa que lo puede usar cualquiera

</aside>

## COCOMO II

COCOMO II es un modelo que permite estimar **costo**, **esfuerzo** y **tiempo** cuando se planifica una nueva actividad de desarrollo y está pensado a partir de los ciclos de vida incrementales o evolutivos.

Este método surgió cuando algunos institutos de tecnología grande analizaron los factores que más afectaban a los proyectos y comparando con su planificación, ajustando COCOMO para mejorar la precisión donde veían que pifiaban.

- Para poder estimar el costo, que puede ser objeto de un contrato
- Para estimar recursos, qué perfiles voy a tener que contratar
- De acuerdo al costo que figuré puedo ver para quién me alcanza y para cuanto tiempo
- Me permite organizar el trabajo para poder ejecutarlo

El tema es que por más que planifiques bien, pueden surgir cosas que te desvíen. Por ejemplo cuando Turrin trabajaba en Flowics y de la nada les dicen de migrar todo a Azure porque Microsoft les dio créditos gratis si migraban.

## **Submodelos de estimación**

COCOMO II proporciona 3 submodelos de estimación que se adecuan a las necesidades de cada sector, cada tipo de información disponible y el grado de avance del proyecto.

- _**Modelo de Composición de Aplicaciones:**_ para más temprano cuando todavía no tenemos una definición muy específica de nuestro producto
- _**Modelo de Diseño Anticipado:**_ tenemos información de requerimientos y puntos de función planteados
- _**Modelo de Post-Arquitectura:**_ A veces tiene sentido volver a estimar cerca del final o al final, para entender qué esfuerzos va a requerir mantener el producto

COCOMO II mide drivers de procesos que incluyen disponibilidad de software reutilizable, grados de composición de arquitecturas y requisitos, ventajas de mercado y diversos grados de fiabilidad del producto. El resultado es un **rango** de valores asociados al grado de definición de las entradas estimadas, que se van ajustando progresivamente a medida que se cuenta con más información.

Qué modelo se va a usar depende de en qué momento del espiral de desarrollo estamos.

### 1. Modelo de Composición de Aplicaciones

Este modelo se aplica al inicio del ciclo de vida del modelo incremental.

Cuando se arranca, se tiene una definición de alto nivel del proyecto. Se conoce muy poco del tamaño del producto a desarrollar, de la naturaleza del stack tecnológico, del personal involucrado y de los datos del proceso.

Este modelo está pensado para proyectos construidos con herramientas generadoras de interfaces o para prototipos.

**Entrada:**

Puntos de Objeto, conformados por la valoración de 3 parámetros básicos:

- Pantallas (interfaces de usuario)
- Informes
- Módulos de lógica en lenguajes de 3era-gen (algo tipo Java, no Assembly)

### 2. Modelo de Diseño Anticipado

Se aplica para las primeras fases de un ciclo de vida en incremental o evolutivo de proyectos software.

Cuando se cuenta con más información y con el proceso de puntos de función hecho, con la arquitectura definida, “tengo clarísimo qué voy a construir”, se puede utilizar este modelo.

Incluye la exploración de arquitecturas alternativas o estrategias de desarrollo incremental.

**Entrada:**

Número de instrucciones obtenidos mediante la técnica de Puntos de Función Sin Ajustar o Líneas de Código.

### 3. Modelo de Post-Arquitectura

Se aplica para etapas de desarrollo y mantenimiento del software.

Permite obtener el costo de un proyecto una vez que se ha desarrollado por completo la arquitectura del software. Se realiza cuando ya se tienen refinadas las user stories y otros aspectos. El riesgo de desvío del tamaño es casi nulo.

**Entrada:**

- Número de instrucciones obtenido mediante la técnica de punto de función o lineas de código, con modificaciones para reutilizaciones y objetos.
- Variables de predicción, lo que hace mas exacta la estimación.

## Parámetros del método

Son valores que se deben tener como entrada del método

- Medidas del desarrollo del software, calculadas por los FP sin ajustar.
- La constante $\text{A}$, se usa para capturar los efectos multiplicativos de esfuerzo en proyectos de tamaño incremental. Provisionalmente se le ha estimado un valor de 2.94.
- El factor de escala, lo calcula asignando ”pesos” a los diferentes factores provenientes del proceso de desarrollo, tales como Cohesión del equipo, Madurez del proceso, etc.

## Realización del cálculo

$$ \text{MM nominal} = \text{A}\times(\text{size})^b $$

- MM nominal es el esfuerzo que se va a calcular
- $\text{A}=2.94$
- $\text{size}=\frac{\text{Lineas de codigo}}{1000}$
- $b$ (factor exponencial) = $0,91 + (0,01 \times \sum \text{Fe})$ donde $\text{Fe}$ se refiere a los factores de escala. Los factores de escala básicamente miden qué tan bueno es mi equipo, y que tan preparados están en caso de que crezca el producto
    - $b < 1.0$ ⇒ el proyecto presenta ahorros de escala. Si el tamaño del producto se dobla, el esfuerzo del proyecto es menor que el doble. La productividad del proyecto aumenta a medida que aumenta el tamaño del producto.
    - $b = 1.0$ ⇒ Los ahorros y gastos de escala están equilibrados
    - $b > 1.0$ ⇒ El proyecto presenta gastos de escala. Esto se debe normalmente a dos factores principales
        - El crecimiento del gasto en comunicaciones
        - El gasto en crecimiento de la integración de un gran sistema.

### Obtener las líneas de código

$$ \text{Lineas de codigo} = \text{FP} \times \text{KLOC} $$

- FP son los puntos de función
- KLOC es un multiplicador según el lenguaje de programación

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/75843094-c701-4eb0-9705-1b254b1778fa/Untitled.png)

### Factores de Escala

Cada uno de estos representa cuanto se incrementa el esfuerzo a medida que se incrementa el tamaño del producto.

- _**Precedencia (PREC):**_ Evalúa variables relacionadas a la **experiencia previa que tiene el equipo** en relación al proyecto que tenemos que realizar.
    - Qué tanto saben del tema del proyecto? Si estamos haciendo una plataforma bancaria y mi equipo son todos tipos que vienen de equipos top en bancos grandes, vamo a polenta 😎
- _**Flexibilidad de desarrollo (FLEX):**_ Evalúa variables relacionadas a requisitos previos, especificaciones de interfaz y tiempos de finalización anticipada.
    - Qué tanta flexibilidad prevemos que vamos a tener, si por ejemplo tengo que hacer un nuevo módulo? Tengo un sistema de manejo de tesorería y lo tengo que hacer hablar con todos los módulos que ya tengo, módulo de ventas, módulo de compras, etc.
    - Voy a tener un montón de cosas que ya están predefinidas y no puedo cambiar, y me tengo que adaptar a lo que hay
    - Pueden haber limitaciones de tecnología, podés estar trabajando con legacy shit
    - Puedo tener requisitos previos, como interfaces o regulaciones que tengo que cumplir
- _**Arquitectura/Resolución de Riesgos (RESL):**_ Pone foco en el nivel detalle del diseño técnico y la gestión de riesgos.
    - Una cosa es tener una arquitectura bien definida con todas las peculiaridades resueltas, y otra cosa es tener ideas a grandes rasgos pero puede ser que después encontras piezas que no encajan u otros temas imprevistos que ocurren por no tener todo bien definido
    - Mientras mayor la definición y la madurez en tu arquitectura, y mayor la capacidad de manejar este tipo de riesgos, menos problemas tenés acá
- _**Cohesión del Equipo (TEAM):**_ Explica las fuentes de turbulencia y entropía del proyecto debido a dificultades en la sincronización de los involucrados en el proyecto, usuarios, clientes, desarrolladores, los que lo mantienen, etc.
    - Que el equipo se lleve bien, que trabajen bien juntos
    - Puede pasar que todos trabajen pero que cada uno haga algo totalmente separado y que luego no se conecte nada
    - De esto se encarga un gerente de proyecto o lider de equipo
- _**Madurez del proceso (PMAT)**:_ El procedimiento para determinar PMAT se obtiene a través del Modelo de Madurez de Capacidad del Instituto de Ingeniería del Software (CMMI). El período de tiempo para medir la madurez del proceso es el momento en el que el proyecto comienza.
    - Qué tan bueno es nuestro equipo ejecutando el proceso de software.
        - Buen peer review
        - Buena prueba unitaria
    - Se definen 5 niveles de madurez:

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/2cb8f004-ef02-470b-96cd-b25937b229fd/Untitled.png)

1. Al principio vos haces lo que podés
2. Luego hay una definición de cómo es y qué pasos se siguen. No hay mucho control de cómo se hace pero por lo menos se entienden
3. _“Bueno, este proyecto lo hacemos así”_. (Te vas a otro proyecto y no lo hacen así)
4. Ya para toda la organización, sin importar qué proyecto, _“todos trabajamos en Jira/Notion, todos estimamos con tal técnica, todos hacemos reportes básicos, etc”_. De esta forma podemos dar información homogénea dentro de la organización
5. Tenemos claro todas las semanas si se cumplen o no los puntos de historias de usuario, y si se cumplen sabemos que estamos cumpliendo en tiempo y forma

---

Cada una de estos factores se puntuan cualitativamente según la siguiente tabla y se le asigna un valor a partir de eso.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/f0fa8892-7406-4d21-8ee1-b9e78d47cd95/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/21bf7abb-ebae-496a-be02-1b571f80f338/Untitled.png)

## Cálculo de los drivers de costo

Una vez obtenido el valor $\text{MM nominal}$, se calculan los drivers de costo que afectan al esfuerzo para completar el proyecto.

- Estos drivers de costo varian de acuerdo al Modelo de COCOMO II que estemos utilizando Diseño Anticipado ó Post-Arquitectura.
- Permiten capturar características del desarrollo del software vinculados al producto, que afectan al esfuerzo para completar el proyecto.
- Se introducen en el cálculo como multiplicadores de esfuerzo ($Me$), y se usan para ajustar el esfuerzo Meses/Hombre nominal.
- Estos valores pueden ir desde Extra Bajo hasta Extra Alto.
- Para el análisis cuantitativo, cada nivel de medida de cada driver de costo tiene un peso asociado, al que denominamos multiplicador de esfuerzo ($Me$).
- La medida asignada a un driver de costo cuyo peso asociado es 1.0, es la que llamamos medida nominal.
- Si un nivel de medida produce más esfuerzo de desarrollo de software, entonces su correspondiente $Me$ está por encima de 1.0.
- Recíprocamente si el nivel de medida reduce el esfuerzo entonces el correspondiente $Me$ es menor que 1.0.

$$ \text{Esfuerzo} = \text{MM nominal} \times \prod \text{Me} $$

Hay 7 multiplicadores de esfuerzo para el Modelo de Diseño Anticipado y 17 para el modelo de Post-Arquitectura. Aquí veremos los Me para Modelos de Diseño Anticipado

### RCPX. Fiabilidad del Producto y Complejidad

Este driver de coste del Diseño Anticipado combina los 4 drivers de costo:

- Fiabilidad Software (RELY)
- Tamaño de la Base de Datos (DATA)
- Complejidad del Producto (CPLX)
- Documentos que necesita el Ciclo de Vida (DOCU).

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/2a90859b-ae54-4454-b3df-3f3d33ced5fb/Untitled.png)

### RUSE. Reutilización Requerida

Explica el esfuerzo adicional necesario para construir componentes pensados para ser reutilizados en proyectos presentes ó futuros.

Este esfuerzo se consume en crear un diseño más genérico del software, documentación más detallada y pruebas más extensas, para asegurar que los componentes están listos para utilizar en otras aplicaciones

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/da84c00b-c4f8-475c-8813-c66510fd4081/Untitled.png)

### PDIF. Dificultad de la Plataforma

Mide qué tan restringidos estamos con la tecnología.

Combina los 3 drivers de coste de Post-Arquitectura:

- Tiempo de Ejecución (TIME)
- Restricciones de Almacenamiento (STOR)
- Volatilidad de la Plataforma (PVOL)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/7c1b5e0e-136e-4c13-99d2-c409560f3673/Untitled.png)

### PERS. Habilidades del Personal

Evalúa las habilidades del analista y del programador.

Combina drivers de costo de Post-Arquitectura:

- Habilidad del Analista (ACAP): atributos principales considerados: habilidad de análisis y diseño, la eficiencia, minuciosidad y la habilidad para comunicar y cooperar.
- Habilidad del Programador (PCAP): La evaluación debe basarse en la capacidad de los programadores como un equipo, más que individualmente.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/89461f82-11eb-40a8-b200-b4e8a50d871b/Untitled.png)

### PREX. Experiencia Personal

Mide la experiencia que tiene el equipo en los lenguajes de programación, herramientas técnicas a utilizar en el proceso de desarrollo del software.

Combina los 3 drivers de coste de Post-Arquitectura:

- Experiencia en aplicación (AEXP)
- Experiencia en la Plataforma (PEXP)
- Experiencia en el Lenguaje y Herramientas (LTEX).

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/403db0b9-ce0e-43b0-b103-55342b197908/Untitled.png)

### FCIL. Facilidades

¿Qué tantas herramientas tenés para apalancar el trabajo? Puede ser que yo tenga todo mi ciclo de trabajo en una herramienta piola, disponible para todos, que todos sepan usar, etc. Sería un caso perfecto!

O talvez tengo un drive y listo y cada uno hace lo que se le canta el orto. No hay nada de soporte de la herramienta.

Este driver de coste de Diseño Anticipado mide las herramientas disponibles para trabajar en el proyecto.

Combina los 2 drivers de coste de Post-Arquitectura:

- Uso de Herramienta Software (TOOL)
- Desarrollo MultiLugar (SITE).

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/7d4e37a3-03d2-4d43-9a09-39dbc37f4a8b/Untitled.png)

### SCED. Planificación Temporal

Si existen restricciones de tiempo respecto del tiempo normal de ejecución. Este driver de coste es el mismo que su homólogo de Post-Arquitectura

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/63b10602-86b2-4b9e-9d47-61a4a7e5477a/Untitled.png)

### Peso de cada multiplicador

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/44762df4-ce89-4218-8a79-bdd18ce628da/Untitled.png)

# Herramienta de cálculo

---

[COCOMO II - Constructive Cost Model](http://softwarecost.org/tools/COCOMO/)

La herramienta no está calibrada para proyectos menores a 2000 líneas de código, con lo cual no es aplicable a proyectos muy pequeño