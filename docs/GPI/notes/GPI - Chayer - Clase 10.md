
---

# Gestión de Proyectos

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/a70511a8-0947-4542-b205-413bbc135b5c/Untitled.png)

Tengo que tener un tamaño del proyecto y un esfuerzo. Una vez que tengo eso, armo un plan de proyecto y puedo iniciar el proyecto.

La planificación me sirve de mapa de ruta, pero no es inamovible. Para hacer el seguimiento y control la necesito, para saber para donde voy a ir. Sin embargo, será modificada.

Se utilizan las métricas de calidad vistas anteriormente para saber si estoy en buen camino.

Por último, la gestíon de configuración es algo básico para cualquier proyecto informático, que está incrustado dentro de todos los estándares de software.

# Configuración del Software

---

Me permite crear un sistema de seguimiento de cada versión de mi producto, para crear sistemas sólidos y estables mediante el uso de herramientas que gestionan y supervisan automáticamente las actualizaciones.

- Me permite generar estrategias de mantenimiento
- El producto va evolucionando, y dependiendo del ciclo de vida tengo que mantener más o menos
- En el incremental tengo que hacer pase de uno a otro
- En el evolutivo el mantenimiento se hace sobre lo que está, pero como aparecen requisitos nuevos el mantenimiento va a ir cambiando

Es el conjunto de toda la información y productos utilizados o “generados” en un proyecto como resultado del proceso de ingeniería de software.

## Beneficios de la gestión de configuración

- Proporciona procesos y tecnologías para identificar y controlar los elementos en el sistema.
- Permite asegurar la integridad y la calidad del producto durante su desarrollo.
- Permite organizar las partes del sistema, conocer su estado en todo momento, manejar su evolución y asegurar su correcto funcionamiento.
- Se debe realizar a lo largo de todo el ciclo de vida del producto, tanto en el desarrollo como en el mantenimiento hasta su retiro. Permite generar trazabilidad entre todos los procesos y periodos del producto.

<aside> 🧠 La gestión de configuración del software permite identificar:

- **Qué** objeto se modifica (artefacto como requisito, diseño arq., Interfaz, función, código, etc.)
- **Cuándo** se produce el cambio
- **Por qué** se produce el cambio
- **Quién** introduce el cambio </aside>

Se asume que el producto software que estoy construyendo va a cambiar a lo largo del ciclo de vida.

## Objetivos de la gestión de configuración

- Establecer y mantener la integridad de los productos
- Evaluar y controlar los cambios sobre los productos
- Facilitar la visibilidad sobre el producto

---

La gestión de la configuración del software viene a desmentir ciertos mitos:

> “La GCS solo es importante para equipos grandes de desarrollo”

> “La GCS es un proceso muy burocrático que enlentece los proyectos y eleva sus costos”

> “Un control de versiones limitado es suficiente en la mayoría de los proyectos, excepto en proyectos grandes”

Todo esto es falso. Sea un proyecto grande o pequeño, necesito saber qué se está construyendo, por quién y para qué.

---

La gestión de configuración del software quiere solucionar los siguientes problemas:

- **Software perdido**: se genera un activo (código, documento, artefacto) que luego se olvida su paradero.
- **Destrucción de código**: desarrolladores que hacen distintos cambios en el mismo código sobrescribiendo su trabajo.
- **Enlances desaparecidos:** cuando se utilizan componentes o librerías de terceros y un cambio en el código hace perder las dependencias y deja de funcionar.
- **Desestabilización de la línea principal:** los desarrolladores suben sus cambios a la línea de trabajo y se rompe la estabilidad del software.
- **Identificación incorrecta de los elementos:** pérdida de trazabilidad entre las fuentes y el código por errores de identificación.
- **Dificultad para identificar el origen de los errores:** imposibilidad de identificar los cambios exactos que generaron un error.

# Conceptos de Gestión de Configuración del Software

---

Estos dos conceptos me permiten gestionar un producto, ver como va evolucionando.

## Elemento de configuración del software (ECS)

**Cada uno de los componentes / artefactos de la configuración del software.**

Los ECS constituyen la unidad de trabajo.

Cada elemento estará numerado y se establece un modo unívoco de referenciar cada uno de los artefactos.

Ejemplos de elementos de configuración:

- Requisitos funcionales (ARS = Sistema para trackear requisitos funcionales)
- Diseño de la arquitectura (DA)
- Código fuente (CF)

<aside> 🤓 Los elementos de configuración son estos y los tengo que poder ver bien durante el desarrollo. Si yo tengo que hacer cambios al plan, sea al contrato o al equipo, los elementos de configuración son todos los aspectos que hacen al producto que estamos desarrollando.

</aside>

## Línea Base (BL)

> El cliente dice “esta es la versión que está implementada (o se va a implementar) y tiene _estos_ elementos adentro”.

Es un punto de referencia en el proceso de desarrollo del software que queda marcado por la aprobación de uno o varios Elementos de Configuración del Software (ECS), mediante una revisión técnica formal.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/581b4644-c4e5-4dd4-a157-21388bf9302a/Untitled.png)

En este punto, marco todas las versiones de mis elementos de configuración.

Ejemplo:

- Línea base 1: Puedo iniciar el proyecto, establecer la viabilidad, establecer requisitos, generar el plan de trabajo, paso un presupuesto, y en base a eso firmo un contrato.
    - Tiene los requisitos que definí con el cliente y el contrato
    - No es un producto funcionando, pero es una línea base que “yo entrego” y entonces tiene una definición formal
    - Todo lo que hago para concretar esta línea base tiene que estar formalizado
- Línea base 2: Avanzo con el diseño de la arquitectura
    - Voy a tener todos los elementos de la LB_1 más los elementos de configuración nuevos
    - Requisitos funcionales v2 (contiene user stories del módulo de clientes)
    - Diseño de arquitectura v1
    - Algoritmo predictivo para clientes v1
    - Código de módulo de clientes v1

La línea base tiene una lista extensiva de todos los ECSs con su versión en ese punto.

### GCS Agile

Me voy adaptando a los cambios sabiéndo lo que quiere el cliente, lo que tenemos, lo que precisamos modificar, etc. Debemos saber qué tenemos que controlar.

El desarrollo de software debe permitir cambios rápidos e informales sobre un ECS antes de que pase a formar parte de una línea base, pero en el momento en que se establece una línea base se debe aplicar un procedimiento formal para evaluar y verificar cada cambio.

Para las metodologías ágiles, esto permite una rápida adaptación a los cambios.

La gestión de configuración permite soportar:

- Cambios frecuentes en el desarrollo
- Múltiples baselines
- Múltiples espacios de trabajo (individuales, de equipo, de proyecto)

# Actividades de Gestión de Configuración según IEEE 1074

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/d624dc96-5528-42a0-bea3-50a2989d85ad/Untitled.png)

El líder de proyecto o quien lleva adelante la gestión de proyecto es el encargado de llevar adelante estas actividades.

## 1. Identificación de la configuración

Identifica la estructura del producto, componentes y qué tipo de producto son. El objetivo es identificar todos los elementos que conforman el producto software.

Tenemos varias tareas para realizar esto:

### 1.1. Seleccionar los elementos de configuración

Hay que seleccionar un número adecuado de ECS, ni muchos ni pocos.

- Tener demasiados puede provocar un número excesivamente elevado de especificaciones y documentos que al final resulta inmanejable.
- Tener pocos puede hacer que no se obtenga la suficiente visibilidad sobre el producto.

Este número está ligado a la cantidad de personas involucradas, el tamaño del producto, cuánto va a cambiar, etc.

<aside> ☝🏼 Si yo tengo un producto complejo que interactua con otros sistemas y usa diversas tecnologías, voy a tener un equipo grande y la división de los elementos debe ser acorde al equipo grande.

</aside>

**Criterios de selección de ECS**

- Utilización múltiple: Número de elementos de su mismo nivel o niveles superiores van a utilizar este elemento de configuración?
- Criticidad: Gravedad del impacto de un fallo
    - Cuánto de lo que voy a modificar de este elemento impacta (genera cambios) sobre el resto de los elementos?
    - Si yo cambio un aspecto de la arquitectura, va a generar un impacto sobre los componentes ya desarrollados y los que voy a desarrollar a futuro
- Número de personas implicadas en su mantenimiento
    - Si solo una persona está a cargo de este componente… _oy vey_
- Complejidad de su interfaz con otros EC
- Singularidad del componente con respecto al resto
- Reutilización. Si se trata de elementos reutilizados
- Tipo de tecnología: Si el componente incorpora nuevas tecnologías no utilizadas en otros componentes

> _Cuáles son aquellos elementos que precisan ser separados del resto? Cuáles van a sufrir cambios seguidos?_

### 1.2. Establecer una jerarquía preliminar del producto

Se especifica que elementos van a estar vinculados, que elementos dependen de otro elemento, etc.

Se separan los elementos en capas, y se muestra que elementos van a ser afectados en caso de un cambio.

- Ejemplo
    
    Esto es el diseño de cómo va a ser mi producto con todos los componentes que yo voy a tener, en un nivel general abstracto. Con esta estructura básica, identifico “la aplicación va a ser un elemento de configuración”, “entonces voy a necesitar otro que sea un backend”, etc.
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/3d8cbc00-2eec-4d75-aa5a-e71910ebcba2/Untitled.png)
    

### 1.3. Definir las relaciones en la configuración

Lo mismo que el anterior, pero dentro del mismo nivel jerárquico.

A priori se define una primera estructura, pero a medida que va creciendo el producto se agregan más dependencias

Las relaciones se determinan a partir de como se va configurando el producto en las diferentes configuraciones. A partir de identificar esta jerarquía que definí en cada elemento de configuración. De esta forma, el producto se va transformando de versión a versión.

- Ejemplo de notitas postit
    
    Cada postit acá es una tarea. Cada línea azúl es un producto. Lo que voy haciendo es desarrollando las actividades y construyendo distintas versiones de esos elementos.
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/2fd2128c-14f0-4cf3-b476-5ec2a1f03e95/Untitled.png)
    

### 1.4. Definir un esquema de identificación

Se define como ponerle nombre a los ECS y a las BL, cómo identificarlas de manera unícoca

- Ejemplo
    
    Elementos de Configuración de Software Tipo_MOD_Versión_fecha ARS_ModCliente_V2_31052023 DAQ_Sistema_V1_31052023 CF_ModSeg_V3_31052023
    
    Líneas Base Tipo_MOD_Versión_fecha BL1_ModCl_Mod_Seg_23012023 BL2_ModVenta_Mod_Pagos_15032023 BL3_ModIntegracion_31052023
    
    <aside> 🤓 Este esquema lo replico para todos los productos que vaya haciendo. A medida que el cliente me va incorportando el requisito, incremento el número de versión.
    
    </aside>
    

### 1.5. Definir y establecer las líneas base

Se definen los milestones, las versiones, los checkpoints.

Esto se ve muy claro en modelos de ciclo de vida incrementales.

Puedo tener líneas base que sean entrega de un producto, pero una línea base también puede ser algo que no incluya líneas de código, como haber cerrado un contrato o tener el diseño de un algoritmo.

La línea base no se tiene que ver como una entrega de producto, sinó como aspectos que yo necesito definir como un aspecto formala cordado con el cliente.

- Ejemplo
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/05477143-0f75-42c6-acc4-45b6c8834c38/Untitled.png)
    

### 1.6. Definir y establecer bibliotecas de software

Se definen que “bibliotecas” o módulos va a tener nuestro producto software. También se definen las versiones de dependencias de terceros.

Según la complejidad de cada producto voy a tener más o menos librerías de software.

## 2. Control de cambios en la configuración

Arranca el proyecto y cada componente que se vaya construyendo va a caer en uno de estos elementos. Van a surgir también elementos nuevos, y debemos ver a qué elemento incorporarlo.

Controla las versiones y entregas de un producto y los cambios que se producen sobre el mismo. El objetivo es proporcionar un mecanismo riguroso para controlar los cambios, partiendo de la base de que los cambios se van a producir.

Hay dos tipos de cambios:

- Corrección de defectos
- Mejora del sistema

Estos tipos de cambios se deben mirar de manera rigurosa, porque son los que van a impactar sobre el resto de elementos.

Se definen tres niveles de cambio:

- Control de cambios informal (trabajando dentro de un equipo de trabajo, entre líneas base en cada sprint)
- Control de cambios semiformal (dentro de un proyecto, como tener que integrar cosas con otro equipo)
- Control de cambios formal (con el cliente).

<aside> ☝🏼 Yo no puedo hacer cambios a un elemento que tenga una línea base sin hablar con el equipo y con el cliente para definir formalmente ese cambio.

</aside>

Se debe llevar registro de todos los cambios, indistintamente del nivel del cambio.

- **Proceso estándar del control de cambios**
    
    Este es un ejemplo, básico. Si el sistema es más sensible, probablemente haya más niveles. Depende de la estructura y la complejidad del proyecto
    
    - Quién inicia el cambio? Quién lo pide? Cómo se analiza? Quién aprueba o rechaza? Qué análisis se hace? Cómo se evalúa el impacto del cambio?
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/3b414a35-afac-4511-9069-3f272ea08e80/Untitled.png)
    

## 3. Generación de Informes de Estado

Informa sobre el estado de los componentes de un producto y de las solicitudes de cambio, controlando la evolución del mismo. Su objetivo es mantener a los usuarios, los gestores y los desarrolladores informados sobre el estado de la configuración y la evolución del producto software.

## 4. Auditoria de la configuración

Valida la completitud de un producto y la consistencia entre sus componentes.

Una auditoría es una verificación independiente de un trabajo para evaluar su conformidad respecto a las especificaciones, estándares y acuerdos contractuales. Se puede hacer de manera interna al proyecto hasta de manera totalmente externa como que el cliente decida hacerlo ellos o contratar externos.

Permite comprobar que efectivamente el producto que se está construyendo es lo que pretende ser.

Objetivos:

- Verificar que la configuración actual se corresponda con las fases anteriores.
- Validar que la configuración actual satisface la función que se esperaba del producto.
- Valorar si una determinada línea base se puede considerar aceptable o no.

<aside> ☝🏼 Voy monitoreando cómo va avanzando el producto.

</aside>

# Formas de desarrollo

---

Voy trabajando con mis equipos en paralelo y luego se hace integración. Esto se hace por un lider de proyecto, diferente de los líderes de equipo ((esto lo tiende a hacer un ing. informático)).

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/1414b9bd-f87e-4f47-89bb-a7f2d9812e2d/Untitled.png)

Tenemos distintos proyectos y tenemos que gestionar esa cartera de distintos proyectos. Tenemos tres equipos de desarrollo, pero uno hace el front, otro hace el back, y otro hace la evasión de impuestos de AFIP.

## En serie

Implica realizar cambios “bloqueantes”, mientras alguien modifica un artefacto nadie mas puede cambiarlo. Se usa con las herramientas típicas de control de versiones.

## En paralelo

Implica separar tareas por ramas del proyecto, dejando una línea principal y ramas secundarias mas cortas que requieren un “control intermedio” antes de su integración.

## Herramientas

- TortoiseSvn
- RedMine
- Teambox
- PivotalTracket
- Git: Control de versiones de códiog
- Jenkins o Docker: control de versiones del ambiente, CI/CD, cómo voy haciendo las entregas

Estas herramientas se pueden combinar a _gusto e piacere_.