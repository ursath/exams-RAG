# Modelo de Negocios para TI

---

# Repaso de la clase anterior

---

## ¿Qué representan los modelos de ciclos de vida?

Los estados por los que pasa el producto. La lógica del producto es lo que determina cómo vamos a organizar el proyecto (actividades, etc.).

- **Proceso**: conjunto de actividades
- **Producto**: el resultado de la aplicación de esas actividades
- **Proyecto**: implementación del producto, elaborado a partir de una serie de procesos, en un espacio finito de tiempo

## Hipótesis de Trabajo

Gran parte de los proyectos informáticos finalizan sin haber cumplido su misión, debido a defectos de **Dirección/Organización/Conducción**. Lo particular y específico en la Dirección se asienta en las características de la organización (es decir, depende de la organización).

Este problema ocurre porque no se tiene una visión ingenieril del problema. Hay muchos softwares, que se desarrollan de maneras diferentes según el contexto. Por eso existen diferentes modelos de ciclos de vida. La mayoría de los proyectos informáticos no definen esto al inicio, y ese es el error.

## Proceso ≠ Producto

Distinguimos por un lado, las actividades a realizar y las partes individuales del producto (componentes).

Las actividades que yo vaya a llevar a cabo dependerán de las componentes del producto.

**Cada producto es único e irrepetible.**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/d26d0127-f8a5-4dec-9f28-5870bee17bc4/Untitled.png)

## Ingeniería de Procesos

_**Ingeniería de Procesos:**_ especifica las actividades del proceso productivo en el campo de aplicación correspondiente.

Se encarga de definir **qué** hacer y **cómo** hacerlo.

Cada ingeniería tiene una serie de tareas definidas que deben realizar para llegar a un producto. Un ingeniero no inventa el proceso que tiene que hacer, sino que se sigue una serie de guías o estándares determinados para poder iniciar el desarrollo del producto.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/f8bc2d1d-7024-4668-9417-236f8b334b0e/Untitled.png)

Vamos a tomar como estándar de proceso el de IEEE, que fue la madre de todos. Este mismo dicta las actividades base (por ejemplo: analizar el problema, analizar los requerimientos funcionales y no funcionales. Es mas como un checklist) que se deben hacer dentro de un proyecto informático.

Posteriormente se tienen todas las formas de organizar el trabajo. Estas metodologías para desarrollo de software, son metodologías de trabajo, es decir, nos dicen cómo deben trabajar metodológicamente mis equipos.

Modelos de madurez y gestión: es un estándar de gestion/organizativo. Cuando combines una actividad con una metodología de trabajo, y la vayas repitiendo te van saliendo mejor (feedback, etc). Esto sucede porque la repetición de las actividades te permite ir madurando y evolucionando en cada nueva iteración (porque se identifican cosas para mejorar)

Ejemplo de los videojuegos: son convencionales y generalmente si la pegan comercialmente entonces se transforman en evolutivos cuando realizan la entrega de modos nuevos o features nuevas.

<aside> ☝🏼 Entonces:

Un estándar de proceso proporciona directrices y reglas detalladas para la ejecución de un proceso específico dentro de un proyecto y así obtener un certificado de calidad. Una metodología ágil ofrece frameworks de trabajo que se adecua principalmente al equipo y al producto que se quiere llevar a cabo. Las metodologias agiles NO permiten tener una visión global del proyecto.

</aside>

## Ingeniería de Producto

_**Ingeniería de Producto**:_ técnicas, modelos, métodos que utilicé para construir el producto.

La ingeniería de producto trabaja sobre la definición de las características que tiene un producto (por ejemplo: alto nivel de usabilidad). Para eso se tienen que ver los estándares de producto ISO e IEEE, que definen atributos que debe tener un producto para ser “seguro”, “usable”, entre otros.

Los estándares de producto son convenciones internacionales que determinan qué atributos deben tener los productos de cierto tipo. En este caso lo aplicamos al producto TI.

Los servicios de software son aquellos que brindan mantenimiento y aquellos que permiten una personalización de los mismos (SAP, por ejemplo).

Definen el stack tecnológico.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/cf133ee8-fafc-4711-a8c7-c8ad8664e928/Untitled.png)

# Modelos de Proceso Industriales

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/d9e2e39f-0963-4b73-babb-400953c82706/Untitled.png)

## Modelo Artesanal

Software de pequeña a escala, es decir, a pedido teniendo en cuenta lo que quiere el usuario. Este se remonta a la época previo a la revolución industrial. Muchas veces está relacionado con la creación de un producto personalizado, en otras palabras, hecho a medida.

El escalar los proyectos nos permite verlos como una organización. A partir del modelo artesanal surge el modelo Taylorista.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/f169983e-6a44-4a53-aaf3-6ac3dfb414cb/Untitled.png)

## Modelo Taylorista

Surge en la primera revolución industrial. Se centra en el control de tiempos.

Se incorpora el cronometro en el proceso.

De aquí surgen las software factories:

- Pones un montón de gente a desarrollar teniendo en cuenta los tiempos para entregar proyectos en tiempos determinados.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/34cf3e12-dac9-4d9b-bedf-75e59f5a205d/Untitled.png)

## Modelo Fordista

No solamente tengo que tomar los tiempos del progamador, pero lo que hace es imponer una cinta de montaje. Cada uno empieza a trabajar cuando le llegan las piezas necesarias.

Este modelo está presente en las empresas de software que lo hacen a gran escala. Impone un tiempo determinado para las entregas de cada parte del trabajo.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/0ccb3cb9-7082-4004-bc25-8d28aaf94339/Untitled.png)

## Modelo Toyotista / Japonés

Es el que incorpora las metodologías ágiles. Se divide el desarrollo y la construcción en pequeñas unidades funcionales.

Se separa el proceso en distintos equipos, y de esta manera logramos paralelizar tareas.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/23474eea-2fef-4d68-9328-3acd7f105bf6/Untitled.png)

## Industria 4.0

Una organización o industria que incorpora o desarrolla productos de cierto tipo y le dan esa categorización. Sin embargo, es un proceso de transformación, una tendencia. No es que tenés que tener si o si todo para serlo.

La Industria 4.0 refiere a una nueva manera de producir mediante la adopción de tecnologías 4.0, es decir, de soluciones enfocadas en la interconectividad, ciberseguridad, la automatización y los datos en tiempo real.

La industria 4.0 se relaciona con la aplicación de IOT, AI, Machine Learning, Big Data, Blockchain, etc. al desarrollo productivo.

Las empresas ahora están mutando para aplicar estas tecnologías en sus pipelines de trabajo. Para eso requieren digitalizar los datos → **un prerrequisito para la Industria 4.0 es la digitalización de los datos**

El proceso de esta industria todavía no está maduro. Es un proceso que está en marcha.

# Materia Prima de los Proyectos de Informática

---

La gestión de un proyecto necesita asumir que los recursos humanos son la materia prima y son los únicos capaces de manejar las máquinas y herramientas para construir un proyecto. Solamente tenemos que aprender a gestionarlos.

# Modelo de negocio

---

Partimos del alcance del problema, determinamos el ciclo de vida para ese problema y a partir de ahí definimos un modelo de negocio.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/e615aada-0b89-41c2-8db1-62806a249cff/Untitled.png)

El modelo de negocio, permite refinar el ciclo de vida del producto. Esto a su vez permite el refinamiento del modelo de negocios y así sucesivamente.

Es aquel mecanismo que tiene una organización para generar ingresos y subsistir como unidad de negocio a lo largo del tiempo. Es un resumen de cómo una compañía planifica ofrecer a sus clientes los productos/servicios que genera. Implica una definición de una estrategia, tácticas para lograr esa estrategia y logística de implementación.

# Componentes y niveles de la organización

---

- _**El sistema estratégico:**_ formula objetivos y políticas generales y controla su realización.
- _**El sistema táctico:**_ transforma los objetivos en directrices. Integra las actividades.
- _**El sistema operativo:**_ realiza las operaciones.

## Niveles de organización

_**Estratégico:**_ formula objetivos y políticas generales. Controla la realización del proyecto

_**Táctico:**_ transforma los objetivos en actividades. Baja a tierra lo que quiere el sistema estratégico

_**Operativo:**_ ejecución de dichas tácticas

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/018e23f9-4776-474f-8a1f-77a2815e27bf/Untitled.png)

Los tres niveles requieren de capacidad y conocimiento para gestionar.

## Niveles de organización adaptado a TI

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/e36672d6-1eee-4afd-bdec-d0a94c71c424/Untitled.png)

_**Gestion de Cartera de Proyectos Tecnológicos:**_ Portfolio de proyectos para llevar a cabo.

_**Gestion de Proyecto Informático (responsable de proyecto):**_ Gestionar cada uno de los proyectos que tenemos en el portfolio.

_**Líder de Equipo de Proyecto:**_ Se encarga de orquestar los equipos del proyecto. Puede tener varios equipos o uno solo.

### Modelos de gestion

_**PMBOK:**_ Un estándar privado que me permite gestionar cualquier proyecto de TI, es a nivel estratégico de la organización. Es un certificado estándar.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/619da7e3-c528-4f39-9bc8-d911aacc1529/Untitled.png)

# Gestión de proyecto

---

## Tecnología

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/16cfe832-f523-4778-af2d-af187e4b141c/Untitled.png)

> _El producto tiene que permitir la integración de diferentes tipos de producto_

La combinación de todos los conceptos en amarillo y naranja permiten definir una estrategia de gestión de integración de cada una de ellas.

## Procesos

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/bb7d6bf2-4997-4d59-8b68-2414726fb540/Untitled.png)

Son dos formas de verlo. La definición del producto puede ser independiente o dependiente de un cliente específico.

- Si es dependiente, se tiene que crear un vínculo con el cliente, para validar los avances. El cliente se convierte en el stakeholder más importante.
- Si es independiente, yo creo un producto y salgo a venderlo terminado.

Lo que me dan como resultado son un Producto Terminado (independiente) u Horas Hombre (dependiente). Actualmente se usan por separado y combinaciones de ambas.

- Un **Producto Terminado** consiste en definir las condiciones, poner gente a trabajar y cuando llega al objetivo lo entrego. Si es escalable entonces voy haciendo que evolucione y entrego nuevas versiones.
- **Horas Hombres** consiste en vender el trabajo de personas trabajando monitoreando que todo esté avanzando el desarrollo
- La **combinación de ambas** consiste en generar un producto terminado y en base al obtenido avanzamos de acuerdo al modelo de Horas Hombres para ir agregando funcionalidades o personalizándolo de acuerdo a lo que el usuario quiera.

El gran desafío es que para productos independientes de un cliente tengo que hacer una inversión inicial yo.

Empresas grandes, que desarrollan productos para ellos mismos, también tienen estos tipos de disyuntivas, pensando al cliente como la comisión directiva y la empresa de desarrollo como un equipo de trabajo dentro de la empresa.

## Monetización

¿Desarrollamos el software como producto terminado o en base a horas hombre?

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/88b58e15-d9ef-46f4-a910-69c196f7dc0a/Untitled.png)

Depende la organización o el proyecto. El producto en si no te determina el modelo de negocios. Un mismo producto puede ser monetizado como producto terminado, como combinación de horas hombre o combinación de ambas.

Tenemos que de alguna forma ver cómo llevarlo adelante para que al final del proyecto tengamos una solución que le sirva al cliente.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/bf9749c9-d5d6-4c46-843b-4a26f306ac36/Untitled.png)

## Tipos de contratos

### Contratos a precio fijo

- Consisten en definir un precio fijo total por un determinado producto, servicio o resultado a ser entregado.
- La empresa proveedora está obligada a concluir con el producto / servicio comprometido y cobrarlo únicamente al precio acordado, sin importar la cantidad y costo de los recursos utilizados.
- Este tipo de contrataciones conlleva un riesgo financiero por parte de la empresa desarrolladora / proveedora en caso de que haya estimado por debajo el esfuerzo y costos necesarios para completar lo comprometido.
- Es fundamental en estos casos especificar con mucha precision el alcance del producto / servicio adquirido por parte del cliente.
- En cuanto a la gestión, es de vital importancia una correcta identificación de cambios de alcance, los que deben evaluarse y determinar si impactan o no en el precio del contrato.

Todos los riesgos los asume el desarrollador. La complicación está en definir bien el alcance del proyecto.

### Contratos por horas

- En esta categoría de contratos el pago del cliente a la empresa desarrolladora / provedora reconoce los costos incurridos por este ultimo más un margen de ganancia.
- Requiere una estimación aproximada de horas totales y dividirlas por objetivos/entregables.
- Este tipo de contratos permite flexibilidad al Proyecto y la posibilidad de que sea redefinido en cuanto a su alcance y actividades en los casos en que estos aspectos no pueden ser definidos con precision desde un inicio.
- Un ejemplo es una contratación por horas de recursos de Desarrollo, analistas funcionales y otros perfiles técnicos quienes reportan las horas incurridas por mes y se cobra la tarifa (que incluye el costo + margen) por la cantidad de horas. Támbién puede incluir reembolsos por gastos requeridos para brindar el servicio o proveer el producto (ej,: licencias de software, viáticos, etc).

En el contrato definís las cosas que vas a entregar. El riesgo se comparte y el cliente hace un seguimiento del progreso con el desarrollador. El alcance puede ir cambiando, es más flexible.

### Contratos Tiempo y Materiales (Time & Material)

- Es un tipo de contrato híbrido que contiene elementos del contrato de precio fijo y por horas.
- Son habitualmente utilizados para servicio en el cuál se requieren expertos en alguna disciplina técnica para determinadas tareas o entregables cuyo alcance y esfuerzo no puede ser precisado enteramente al momento del contrato.
- Similar a los contratos por hora, dejan un final abierto en cuanto a la cantidad de horas que se incurrirán para la provision del producto o servicio.
- Require realizar una estimación de esfuerzo para poder preveer el costo aproximado del contrato, con un x nivel de precisión determinado, del cuál no se puede exceder. A su vez, pueden definir un marco de tiempo máximo de contratación, para no exceder el límite de presupuesto.
- Es necesario definir un alcance, de mínimo de actividades y entregables para poder estimar el costo del contrato. Sin embargo, el esfuerzo necesario y consecuente costo para realizarlos puede variar, dentro de la precision estipulada.
- Los precios en este tipo de contratos suelen incluir tarifas hora por los recursos técnicos asignados.

# Método Lean Startup

---

Metodología para desarrollar negocios y productos. Pretende minimizar el desperdicio de recursos acortando los ciclos de desarrollo de productos. Para esto, adopta una combinación de experimentación impulsada por hipótesis para medir el progreso con el lanzamientos de productos evolutivos (MVPs) para ganar retroalimentación de los clientes y aprendizaje validado para medir cuánto se ha aprendido.

Esta metodología se utiliza para ciclos de vida evolutivos.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/2318134c-c721-4ae9-b607-471190abc837/Untitled.png)

Lo que me permite este método es plantear una hipótesis de trabajo, construir un MVP del mismo (puede ser un producto software, un simple prototipo, un video). Con ese MVP se realizan pruebas de usuario. Luego se recopilan los datos y se analizan los resultados. Con estos resultados, se refina la hipótesis y se vuelve a empezar hasta que se cumple la condición de “mínimo” y “viable”. El limitante es el respaldo. Se itera de manera continua.

### MVP

Un producto mínimo viable es “la versión de un nuevo producto que permite a un equipo recoger con el mínimo esfuerzo la máxima cantidad de conocimiento validado acerca de los usuarios”.

El objetivo de un MVP es evaluar las hipótesis fundamentales de un negocio (o “actos de fe”) y ayudar a los emprendedores a comenzar el proceso de aprendizaje lo más rápido posible.

Las características del MVP depende de la organización y/o el desarrollador, etc.

# Matriz FODA

---

Permite realizar un diagnóstico sobre una organización en un momento determinado, evaluando sobre el negocio de la organización:

- _**Fortalezas:**_ son los elementos positivos con los que la organización cuenta internamente.
- _**Oportunidades:**_ son aquellos elementos positivos pero externos que le favorecen a la organización para alcanzar sus objetivos o metas.
- _**Debilidades:**_ son aquellos elementos internos y negativos que afectan el logro de sus objetivos o metas.
- _**Amenazas:**_ son los elementos externos negativos que afectan el logro de sus objetivos y metas.

Tenemos dos tipos de factores a analizar:

- _**Factores Internos:**_ se pueden detectar Fortalezas y Debilidades. _Ejemplos: una fortaleza es un equipo experimentado y una debilidad es un equipo no experimentado (no manejan la tecnología, no tienen tanto conocimiento del dominio)._
- _**Factores Externos:**_ se evalúan Oportunidades y Amenazas. _Ejemplos: el boom de una tecnología sería una oportunidad y debo evaluar si tengo las fortalezas para cubrir ese aspecto. Amenaza sería que en el transcurso de mi desarrollo aparezca una empresa que haga lo mismo que yo pero más barato. Si ya existía no lo es. Otro ejemplo de amenazas son las regulaciones estatales, etc._

||Factores Internos|Factores Externos|
|---|---|---|
|Aspectos Positivos|**FORTALEZAS**|**OPORTUNIDADES**|
|Aspectos Negativos|**DEBILIDADES**|**AMENAZAS**|