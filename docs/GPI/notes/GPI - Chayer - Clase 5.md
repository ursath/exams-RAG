# Estimación

---

Es un proceso que proporciona un valor a un conjunto de variables para realizar un trabajo.

El planificador del proyecto tiene que estimar:

- cuánto durará el proyecto
- cuánto esfuerzo requerirá
- cuánta gente estará implicada

Es importante plantearnos el tamaño de nuestro producto software, para poder inferir estas magnitudes. La idea es que, en cada proyecto que uno encare, debemos saber el dimensionamiento del producto para poder definir parámetros de forma correcta.

<aside> 🧠 TAMAÑO → ESFUERZO → TIEMPO → EQUIPO

</aside>

## Cómo abordarlo

> _Esto se hace en una etapa muy temprana para poder tener una idea del costo, “Yo quiero hacer esto, ¿Cuánto me sale?_

Hay varias opciones para llegar a una estimación:

1. Dejar la estimación para más adelante. Generalmente la estimación de costos ha de ser proporcionada a priori. Se posterga la estimación hasta tener más información. En general esto no ocurre en la vida real, porque no es fisible.
    1. Si tenemos un proyecto pasado parecido, podemos usarlo para ayudar en la estimación
2. Basarse en proyectos similares ya terminados. Muchas veces no sabemos con que estimar y bueno tenemos que realizar una estimación sin argumentos.
3. Utilizar técnicas de descomposición (divide and conquer) relativamente sencillas para generar estimaciones de costo y de esfuerzo de cada una de las partes. La suma me da la del proyecto.
4. Utilizar un modelo empírico para el cálculo de costos y esfuerzo. Son fórmulas con sustento empírico (gente que estudió proyectos conocidos), con lo que fueron extrapolando una formulita)
    1. Usamos datos empíricos para estimar tamaño, costo y esfuerzo

<aside> ☝🏼 Cada una de estas técnicas solo serán buenas si los datos históricos que se utilizan como base de la estimación son buenos.

Si ya tengo un equipo de trabajo funcionando hace dos o tres años, entonces ya conozco el ritmo de trabajo, la cantidad de funciones que pueden entregar por tiempo, etc. Tenemos magnitudes reales del equipo de desarrollo para estimar.

</aside>

## Incertidumbre

> _¿Va a pasar o no va a pasar tal cosa?_

¿Como se genera esta incertidumbre? Por estos factores:

- La _**complejidad**_ del proyecto. Es una medida relativa que se ve afectada por la familiaridad con esfuerzos anteriores.
- El _**tamaño**_ del proyecto puede afectar a la precisión de las estimaciones. Si en un proyecto grande te desviás por 15 días puede no significar nada a nivel tiempo (a nivel costo puede ser). Sin embargo, si el proyecto es corto (2 meses) entonces si significará un desvío importante.
- La **_disponibilidad_ de información histórica** también determina el riesgo de la estimación. Si la tengo pero no es buena o no la tengo genera incertidumbre.
    - El equipo es nuevo y no sabés bien cómo trabajan? ⇒ Tu estimación va a ser más incierta
    - Conoces bien al equipo ⇒ Ya sabés cómo trabajan y tu estimación puede ser mejor!

<aside> 💡 Si tengo un equipo de Juniors tengo más incertidumbre de qué tanto van a poder realizar en comparación con un equipo de Seniors, cuyas capacidades se entienden mejor.

</aside>

# Momentos de estimación de un Proyecto

---

## 1. Macro-Estimación

> *¿Cuándo vale la pena estimar? Al principio, cuando tenemos una idea de los requisitos y las funcionalidades necesitadas, cuando ya hicimos el análisis de ciclo de vida y decidimos qué parte del producto entregar en cada momento. A partir de conocer el alcance funcional, podemos tener una estimación del tamaño de nuestro proyecto.

Esto nos sirve para tener una idea grande de la magnitud, costos, tiempo y esfuerzos.*

Primera estimación contando con algunos parámetros descriptivos y genéricos sobre el proyecto. Permite hacer una primera aproximación al tamaño del proyecto y estudiar su viabilidad.

Esto se hace cuando estamos planteando nuestro proyecto, teniendo una idea de las funcionalidades y su alcance (**una apertura funcional de alto nivel**).

En este punto se puede ver si es realmente viable incursionar el proyecto.

> Si veo que el proyecto me va a tomar 5 años y 48 programadores, tal vez esto no es para mi.

Cuando se hace esta estimación, se aclara:

- el alcance del producto software
- los supuestos, las cosas que debe cumplir y hacer el cliente
- Pre-requisitos del producto software, que son a cargo del cliente
- Costo de lo enunciado anteriormente (con un porcentaje de incertidumbre)

<aside> 💡 No se termina en hacer la cuentita y fin, tenemos que tomar supuestos y prerequisitos: 👉 La estimación es válida en el marco de los supuestos que asumimos que se van a dar 👉 También asumimos que tenemos los pre-requisitos (por ejemplo, acceso a internet) 👉 Debemos estimar de forma preliminar el _orden de magnitud_ del proyecto

</aside>

## 2. Estimación detallada

Otro momento en el que podemos estimar es una vez definidos los requisitos. Se realiza la estimación para la siguiente fase, la de diseño.

<aside> 💡 Al momento de finalizar el diseño, puedo revisar y/o hacer una mejor estimación con lo que aprendí

</aside>

## 3. Estimación de las siguientes fases

> _Supongamos que tenemos tres incrementos y que acabamos de terminar el primero. Con la información que lo que me tomó desarrollar y testear este primer incremento, puedo ajustar mis estimaciones para los siguientes, siempre teniendo en cuenta que los futuros incrementos tendrán que incluir soporte para el producto ya corriendo._

> _Muchas veces en un proyecto grande uno hace una estimación macro, pero a medida que uno va entrando en detalle va puliendo la estimación en las etapas posteriores. Puedo empezar un proyecto grande diciendo que va a tomar 5 meses, tomandome un tiempo para finalizar el diseño y los requisitos a nivel muy específico, y luego volver a analizar si realmente me va a tomar 5 meses._

Conocida la información, una vez finalizado el diseño, se pueden mejorar las estimaciones de las restantes fases.

En este punto, se tiene realmente solucionados los requisitos del proyecto y también el diseño del mismo, entonces las estimaciones pueden mejorarse (darlas de manera más específica). Por ejemplo, en la macro-estimación se dijo que se tardaba 5 meses aproximadamente, en este punto ya se sabe que va a tardar 5 meses y 6 días.

## 4. Estimación de defectos (para proyectos incrementales y evolutivos)

> _Tenés que considerar el esfuerzo que dedicas a mantenimiento. En cada proyecto se define que tanto se aceptan defectos. Podría decir que solo atiendo bugs relacionados a ciertas funcionalidades._

Al finalizar el codeo, pruebas e instalación una parte del producto se pueden obtener datos de rendimiento y calidad para las siguientes fases o para el mantenimiento.

En este punto, el producto está 100% finalizado. Ahora debo seguir implementando los nuevos features, pero también debo estabilizar, monitorear y mantener el producto que ya está en producción.

Esta estimación se realiza con datos reales, como rendimiento, cantidad de usuarios, etc.

# Métricas

---

> Con nuestra estimación obtenemos métricas; “horas de trabajo” por ejemplo.

Las medidas del software y los modelos de medida son útiles para estimar y predecir costos, medir la productividad, la eficacia y la calidad de producto.

Una métrica debe ser:

- Objetivas; debemos llegar todos a (masomenos) la misma estimación
- Sencilla (definible con precisión): algo medible, que el inversor entienda ((así no se raja))
- Fácilmente obtenible. Uno puede afinar la estimacion en varias fases del proyecto, si es eingorrosa esa estimacion, no sirve.
- Válida (adecuada a lo que se propone medir)
- Robusta: que no esté anclado con algo en específico del proceso. En otras palabras, que no la afecten los cambios en el proceso o producto

<aside> 💡 Hay diferentes métricas para el producto y para el proceso.

</aside>

## Métricas de Producto

Ejemplos:

- Cantidad de funcionalidades
- Cantidad de casos de uso: cada caso puede tener asignada una complejidad, luego estos casos se agrupan en “paquetes” cuya complejidad es la suma.

Son medidas del producto software durante cualquier fase de su desarrollo, desde los requisitos hasta la instalación. Pueden medir la complejidad del diseño, la cantidad de funcionalidades, casos de uso, el tamaño de la base de datos, el tamaño de la aplicación (fuente u objeto), el número de páginas de documentación producida.

**Métricas de Tamaño**

1. Líneas de Código (LOC)
2. Especificaciones de Diseño
    1. No te da mucha información, cada especificación de diseño puede tener 80 items, pero sirve de todos modos para analizar
3. Predicción de la longitud
    1. Sabiendo cuantos casos de uso y cuanta complejidad puedo extrapolar “esto va a tener tanta longitud y tantos módulos”
4. Funcionalidad
    1. Estimar tamaño en base a la funcionalidad

**Métricas de Calidad**

1. Corrección: cantidad de fallas o correcciones tuve que tener en el desarrollo
2. Fiabilidad: el producto hace bien las cosas y cuando debe funcionar de tal manera.
3. Mantenibilidad
4. Usabilidad: esto depende del producto.

### Líneas de Código

> _Si lo hizo en Python o en Assembler no es lo mismo. No considera el seniority ni la complejidad del proyecto, ni el lenguaje, etc. Es una medida muy simple._

Mide la longitud del código fuente. Determina el tamaño del producto software. Permite conocer la longitud de una aplicación, pero solo una vez que la programación ha terminado.

Puede utilizarse para estimar a esfuerzo o productividad.

Tiene varios problemas graves:

- No tiene en cuenta el concepto de reutilización.
- No tiene en cuenta el concepto de costos fijos ni tareas que se desarrollan que no son parte del desarrollo.
- No considera el grado de eficiencia del programador

### Especificaciones de Diseño

> *Es dificil medir un documento, salvo que sea muy muy muy específico. Si son todos documentos word que los escribo como me parece, puedo contar pero no me sirve de nada.

Se busca normalizar y buscar especificaciones (puedo por ejemplo hacer tablas) para bajar los diseños a algo concreto que puedo contabilizar.*

Permite medir la longitud de las especificaciones para la estimación del esfuerzo que requieren, aunque resultan difíciles de medir.

Los documentos que se generan en un Diseño incluyen texto, grafos, diagramas matemáticos y símbolos que dependen del método o notación utilizada.

Si existe una sintaxis uniforme y se utilizan objetos o elementos atómicos representativos para los distintos diagramas y símbolos, entonces se pueden medir la longitud del texto, la cantidad de diagramas y el número de páginas para realizar análisis comparativos entre proyectos dentro de una misma organización y con los datos históricos propios.

### Predicción de la longitud

Permite predecir la longitud de la aplicación (NLOC) en la fase de definición de especificaciones y establecer una relación de expansión con la longitud de los documentos de especificaciones o de diseño en proyectos similares, para lo que deben registrarse datos históricos con definición de características y entornos específicos.

Por ej: tamaño de un programa en un lenguaje determinado junto a la cantidad de casos de uso diseñados para esa aplicación.

Sabiendo esto…

- **Un gerente de tecnología podría:**
    - Hacer gestión del portafolios de proyectos de la compañía; ¿Qué puedo comprometer y qué no, y para cuando?
    - Saber dónde poner sus recursos y dónde no
    - Decidir si tercerizar un proyecto (se lo licita al proveedor xd)
- **Un emprendedor podría:**
    - Entender sus costos
    - Conseguir empresas interesadas
- **Un provedoor de software podría:**
    - Determinar el tiempo de un proyecto
    - Organizarse

### Funcionalidad

> _A partir de tener la funcionalidad clara, vamos a poder cuantificar una medida que nos va a decir cuantos puntos de función podemos hacer. Vamos a ir clasificando y distinguiendo la funcionalidad, clasificándo, y en base a eso sacamos puntos de función._

Permite obtener una medida del tamaño del producto a partir de la funcionalidad conocida.

El concepto de funcionalidad se origina a partir de una noción de la cantidad de funciones que proporciona.

Los Puntos de Función (Albrecht) y los Bang (De Marco) miden el tamaño del software en los primeros pasos del desarrollo a partir de las funcionalidades que se establecen en la etapa de especificaciones.

La funcionalidad se mide a través de la definición de requisitos funcionales.

## Métricas de Proceso

> _Tienen que ver con todas las actividades que ejecutamos para tener el producto de software terminado. ¿Cuantas horas me lleva? ¿Un equipo de cuantas personas? ¿Con cuanta experiencia? Es todo lo que se relaciona al desarrollo y no al producto en sí._

Son medidas del proceso de desarrollo del software tales como el tiempo de desarrollo total, el esfuerzo en días/hombre o meses/hombre, tipo de metodología utilizada o nivel medio de experiencia de los programadores.

Evalúan el proceso de fabricación del producto:

- el tiempo de desarrollo total
    - Cómo vas a usar el tiempo? Vas a documentar todo o no vas a “perder tiempo” (😠) documentando?
- el esfuerzo en días/hombre o meses/hombre
- el tipo de metodología utilizada
- el nivel medio de experiencia de los programadores
    - “En mi equipo tengo en promedio 3 años de experiencia!” y viene otro que me dice que tiene en promedio 8 ((el conflicto se resuelve comparando tamaños de pijas))

La obtención de estas métricas sobre el Proceso está asociada directamente a técnicas o modelos de estimación.

# Método de Puntos de Función

---

<aside> 👍 La parte de puntos ajustada está en el paper en los apuntes pero no entra en la materia.

</aside>

Es una métrica del producto que permite medir el tamaño del producto software a desarrollar.

**Una vez que se obtiene este valor se puede utilizar en los procesos de estimación de costo y esfuerzo. Una vez que tenemos el esfuerzo, se trae a la mesa el proceso y con eso se puede saber cuánto equipo y cuánto tiempo requeriremos.**

## Características

- Facilita la información básica del tamaño de la aplicación basándose en el diseño lógico, a partir de la funcionalidad externa.
- Se centra en los valores de dominio de información y no en las funciones del software.
- Una vez que se obtiene este valor se puede utilizar en los procesos de estimación de costo y esfuerzo.
- El planificador del proyecto estima las entradas, salidas, peticiones, archivos e interfaces externas del software y elabora una tabla de cálculo de punto de función.
- Este método permite medir independientemente de la tecnología utilizada.

## El Método

Proporciona el tamaño del sistema medido en Número de Instrucciones o Líneas de Código Fuente:

$$ \text{FPA}=\text{FP}\times \text{AF} $$

### Paso 1: Se desarrolla considerando 5 parámetros

> _Identificar mis elementos funcionales de datos y transaccionales. Meto la lupa en mi proyecto y pienso “¿Qué hay acá adentro?_

**Tipos de función de datos:**

- _**Ficheros Lógicos Internos (ILF):**_ grupo de datos lógicamente relacionados, identificables por los usuarios, mantenidos y utilizados dentro de los límites de la aplicación. Son ficheros habilitados para añadir, cambiar o borrar datos mediante procedimientos estandarizados a través de la aplicación.
    - Los que viven y nosotros mantenemos dentro del sistema de la aplicación
- _**Ficheros Lógicos Externos (ELF):**_ grupo de datos lógicamente relacionados, identificables por los usuarios, utilizados por la aplicación a desarrollar, pero mantenidos por otra aplicación.
    - Los usamos pero los buscamos en otro lado, fuera de la APP, pero son relevantes.

**Tipos de función de transacción:**

- _**Entradas Externas (EI):**_ son datos que se introducen en la aplicación desde fuera de sus límites. Mantienen un fichero lógico interno. Se considera única si los datos son mantenidos en un fichero lógico interno y el formato de entrada es único o la lógica del proceso es única. Cada unidad de mantenimiento de datos por cada entrada externa se considera única, por ejemplo, si en una pantalla se realizan altas, bajas y modificaciones entonces deben considerarse 3 entradas externas. _Ejemplos: Pantallas de entrada que mantienen ficheros lógicos internos. Entradas por lotes de datos. Cada proceso que mantiene un fichero y cada alta, baja o modificación de datos se considera como una unidad. Interfaces de la aplicación que mantienen datos de un fichero lógico interno. Entradas externas duplicadas de distintos procesos solicitados expresamente por el usuario._
    - Entradas de información (input)
    - Por cada tabla fichero externo que tengo, voy a tener entradas externas para alta/baja/modificación (esas son 3)
    - Tranquilamente pueden haber 70
- _**Salidas Externas (EO):**_ “lo que desde nuestro producto, lanzamos al mundo”. Son datos que salen de los límites de la aplicación. Cada salida se considera única si tiene un formato único o el diseño lógico requiere un proceso lógico distinto de otras salidas del mismo formato.
    - Sale de nuestro producto y puede ir a otro entorno (output)
    - Transferencias de datos a otras aplicaciones
    - Informes, por ejemplo si tengo un informe periódico que se hace solo
    - Todo lo que emita mi producto software, sea automatizado, sea por una API, sea por una pantalla pedido por alguien, loquesea
- _**Consultas Externas (EQ):**_ Representan requisitos de información a la aplicación en una combinación de entrada/salida que se obtiene de una búsqueda de datos directa. No actualiza un fichero lógico interno. Si la consulta contiene un proceso de edición o clasificación de información ya no debe considerarse como tal. Para contabilizarlos, se valora la entrada y la salida y se toma el máximo de ellos.
    - Van a ser una entrada y una salida. _“uno pone unos parámetros de entrada, filtros de selección, etc, y salen datos en base a eso”_.
    - Es la combinación de una entrada, el filtro, y una salida, el resultado de la consulta.
    - Yo tengo que indicar los parámetros (una entrada) y obtengo una salida (el resultado de la consulta)

### Paso 2: Valoración de la Complejidad (tabla de complejidad)

La complejidad en EI, EO y EQ se la valora como BAJA, MEDIA o ALTA de acuerdo al número de campos (DET=Data entities) y número de tablas o ficheros que hagan referencia (FTR).

- **Para entradas externas:**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/916120bb-e7c5-447c-8803-dc194ea50e21/Untitled.png)
    
- **Para salidas externas:**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/a7e4d839-f8d0-4997-afda-c8d25a289c5a/Untitled.png)
    

La complejidad en ILF y ELF se la valora como BAJA, MEDIA o ALTA de acuerdo al número de campos (DET) y número de registros que tengan (RET). _”Cuantos campos tiene mi tabla?”_ Agarras ese número y:

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/956343a1-e958-462c-b1f9-33128f897d42/Untitled.png)

Una vez definida la complejidad de cada parámetro se le asocia un Peso Multiplicador

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/770d2eea-c2bc-44b7-b1b0-e9bb10e81fe9/Untitled.png)

Haciendo la sumatoria de todos los anteriores, obtenemos los Puntos de Función Sin Ajustar (FP).

Para transacciones, veo la cantidad de ficheros de los que depende la consulta. ¿Tengo que unir treinta tablas? Uff re complejo.

## Ejemplo

![NICE](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/627ef47f-6889-4bc2-bacb-02e57cb80505/Untitled.png)

_NICE_

## Conclusión

Esta técnica de estimación por puntos de función:

- Es un modelo empírico que nos permite estimar el tamaño de un producto software, punto inicial para la planificación global del proyecto
- Es aplicado una vez que contamos con los requisitos funcionales del producto
- Brinda una métrica de tamaño independiente de la tecnología
- Se complementa con otras técnicas, como COCOMO II para obtener la estimación del esfuerzo, y con técnicas como planning póker, durante la ejecución y seguimiento del proyecto, con estimaciones para cada sprint.

# Método COCOMO

---

Es un modelo de estimación que proporciona una medida del esfuerzo del proyecto tomando como base el tamaño del producto, las variables del equipo de desarrollo y el ámbito en el que se realizará el proyecto. Permite definir la duración del proyecto o mejora del producto.

Este método se realiza después del método de Puntos de Función. Con algunas reglas empíricas y otros parámetros, se convierten los puntos de función en horas/hombre.