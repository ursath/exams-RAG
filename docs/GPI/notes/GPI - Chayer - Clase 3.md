
---

# Modelos del Ciclo de Vida

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/3211dd5f-163e-40c1-8a09-a08e0c59d0a2/Untitled.png)

- El producto software es un ente que va pasando por diferentes estados de madurez hasta llegar a su estado final.
- El ciclo de vida son los estados por los que pasa un producto software.
- El proceso se refiere a las actividades que van a estar relacionadas con el producto software.

> _Los modelos de ciclo de vida representan la transformación del producto software_

## Modelos de Ciclo de Vida según Davis y Alexander

Diferencian 3 niveles de abstracción con los que cada modelo trata el proceso software.

> _El problema, los recursos (mano de obra, know how de tecnologías), tiempo disponible me delimita qué modelo tengo que usar_

### Nivel 3 - De desarrollo

Se puede entregar un producto de software de varias maneras:

- Por fases: aquellos sistemas con muchos módulos se implementan por etapas. Ejemplo: primero contabilidad, después finanzas y finalmente comercial. ERP.
- MVP
- **Prototipos:** si bien se dice que esto es una manera de entregar un producto, es importante recalcar que un prototipo no es un producto, sino una fase anterior del mismo

> _Trazan amplios grupos de productos, adjuntan etiquetas a segmentos de tiempo para caracterizar las actividades del proyecto y dirigen cualquier partición de las necesidades de los usuarios_

_**Ejemplos:**_

- Modelo Convencional
- Modelo Incremental
- Modelo Evolutivo

### Nivel 2 - De actividades

Clasifica según la forma en la que se organizan las actividades

> _Contiene modelos que especifican una serie de actividades a realizar en cada segmento de tiempo, refinan el agrupamiento y las relaciones entre las actividades prescritas y dirigen las diferentes representaciones del producto que se construye_

_**Ejemplos:**_

- Modelo en Cascada
- Espiral
- Espiral Win-Win

### Nivel 1 - De herramientas

Especifican herramientas particulares que me permiten desarrollar. Herramientas metodológicas (como templates o artefactos) o de software (como Jira) y hay que ver cuales son las más adecuadas para el proyecto que se está desarrollando.

_**Ejemplos:**_

- RUP
- SCRUM Artefactos.

### Resumen

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/aafc66fc-66ca-4ebf-bed4-bd788166a146/Untitled.png)

# Nivel 3 - Más en detalle

---

## Modelo Convencional

**Se utiliza para aquellos productos software donde se requiere que la solución se resuelva de una sola vez, es decir, se debe entregar completo de una sola vez (con toda la funcionalidad requerida). Solo lo puedo instalar en el contexto que se va a utilizar cuando está todo desarrollado (el problema está 100% resuelto).**

**Es decir, la necesidad del usuario no se subdivide.** El **desarrollo** del producto se construye completamente y de una sola vez. Este ordenamiento secuencial ha sido aplicado por diversos modelos de Nivel de Actividades que describen cada una de las **actividades** a realizarse en las etapas del desarrollo.

Generalmente, estos tipos de proyectos están relacionados con alguna otra ingeniería (para alguna maquinaria, para un controlador, etc).

_**Ejemplo:**_ cajero automático.

## Modelo Incremental

**Las necesidades las vamos a conocer de antemano, pero la problemática admite que se divida en fases, permitiendo así la entrega de software en partes.**

> _Conozco el objetivo del proyecto (o alcance del problema) y decido conscientemente partirlo en pedazos. Esos pedazos por si mismos los puedo implementar y es funcional (el usuario lo puede usar)._

Se realiza el estudio del problema del usuario y a partir de allí se descompone en sub-problemas que deben ser desarrollados en diferentes etapas de manera progresiva y planificada.

Se define el incremento o feature y su alcance. El incremento se deploya y el siguiente incremento empieza a partir del incremento anterior (i.e. se pasa de una versión del proyecto a otra).

Es importante que la división se realice con criterio y coherencia, pero haciendo el gran “divide y conquistarás”.

Desde el día 0 se delimita la cantidad de fases y su espacio temporal así como también se conoce todo el problema.

_**Ejemplo:**_ ERP, software de turnos médicos.

_**Ejemplo:**_ American Energy tuvo un proyecto para control de procesos internos de tres fases donde cada fase era un año y pico con cientos de participantes. Cada fase incluía al software un nuevo paquete de procesos de la compañía. Se planeó meticulosamente lo que se incluía en cada fase desde el principio.

## Modelo Evolutivo

**Va a ser un desarrollo iterativo, al igual que el modelo incremental. La diferencia es que en este modelo no tengo la información completa del problema. Los avances o desarrollos futuros se van dando a medida que aparece el feedback o comportamiento de como se usa mi producto.**

> _Desconoces el alcance. Lanzamos el MVP. En base a lo que interactúen los usuarios (el uso del MVP) voy a ver que feedback tengo y sobre eso voy a “hacer evolucionar” mi proyecto._

Los productos provisionales se desarrollan antes de que la siguiente subdivisión se determine. Es decir, las evoluciones futuras del sistema NO están previstas a la manera incremental, donde se debe saber qué funcionalidades se añadirán en cada incremento y cuando se llevará a cabo.

La alta incertidumbre dificulta la planificación.

Este modelo es especialmente fiel al MVP.

## Ejemplos

- Ejemplo 1 - App Mascotas
    
    Es posible hacerla de manera incremental. Teniendo en cuenta solamente sabemos los requisitos mínimos pero se pueden agregar un montón de funcionalidades de acuerdo a nuevas necesidades que van apareciendo a medida que los usuarios van usándola.
    
    **Conclusión**: lo propuesto es un MVP y se utilizará el modelo evolutivo para ir mejorando la funcionalidad a lo largo del tiempo.
    
- Ejemplo 2 - Computadora de a bordo
    
    > _Tenemos muchos changos super capos que van a saber todo lo que tienen que hacer_.
    
    Es necesario que todas las partes del producto estén presentes para el lanzamiento y es por eso que es convencional. Luego no se va a actualizar el software: como va asociado al auto, se entrega una única vez.
    
    **Conclusión**: modelo convencional.
    
- Ejemplo 3 - Software para cadena hotelera
    
    Una cadena de hoteles desarrolla su propio software. Tienen un producto de software ya andando que permite hacer la administración y manejo dentro de un hotel. Quieren hacer un software nuevo para reemplazar el existente, que realice las mismas funcionalidades y otras nuevas.
    
    Se puede reemplazar una parte del sistema viejo y luego ir construyendo sobre eso.
    
    **Conclusión**: modelo Incremental
    

# Nivel 2 - Mas en detalle

---

## Modelo Tradicional en Cascada

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/6855b7e9-5b57-489b-a18b-4bf8b47d4fbc/Untitled.png)

La evolución del producto software procede a través de una secuencia ordenada de transiciones de una fase a la siguiente según un orden lineal.

Permite iteraciones durante el desarrollo, dentro de un mismo estado o de un estado hacia otro anterior.

## Modelo en Espiral

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/b04b54c8-c88a-4667-bd40-cff0a3ca7e2e/Untitled.png)

Se comienza con un pequeño proyecto, con prototipos, y se le va agregando complejidad mientras giramos en el espiral.

- El ángulo indica el progreso realizado en cada desarrollo
- El radio incremental indica los costos de desarrollo acumulativos.

## Modelo en Espiral Win-Win

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/605bbaf0-ae3e-4fb9-a90a-ddef8217fae4/Untitled.png)

El espiral es lo mismo que el anterior, pero la diferencia es que se incorpora la visión de los stakeholders que son quienes lo piden o lo usan. Se alinean ideas, requerimientos con los involucrados y quienes lo van a usar para poder definir la próxima iteración.

# Nivel 1 - Mas en detalle

---

## Rational Unified Process (RUP)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/6774ea3f-f65a-43d0-a333-e5dd0c2f0c72/Untitled.png)

El modelo habla de las distintas disciplinas que tienen los proyectos de software. Se marca el esfuerzo necesario para cada rama o actividad del proyecto.

- El eje horizontal representa el tiempo
- El eje vertical representa las disciplinas

# Prototipos

---

Realizar un prototipo para mostrar al usuario permite comprender mejor sus requisitos, tal de no quedarnos con los requisitos mal comprendidos. Puede ser aplicado en cualquiera de los ciclos de vida.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/0a12a3f6-e23e-47cc-b92a-bda54731e26f/Untitled.png)

Hay tres tipos de prototipos:

- _**Desechables:**_ para un chequeo y listo; se utilizan una sola vez
- _**Evolutivos:**_ se mantienen a lo largo de las iteraciones
- _**Maqueta:**_ no es algo funcional, sino algo más visual, presentación, simulación, etc.

En cualquier ciclo de vida, se puede utilizar el prototipo como herramienta. Estos ayudan a comprender los requisitos del usuario y de ese modo contrarrestar el problema de requisitos mal comprendidos. El usuario descubrirá los aspectos o requisitos no captados.

La idea del prototipo es presentárselo al cliente y que nos de su feedback (i.e. que el cliente lo valide)

Cuando finaliza la fase de análisis, se refinan los requisitos de software y se procede al desarrollo real.

## Maqueta

Aporta al usuario ejemplo visual de entradas y salidas.

Utilizan datos simples estáticos.

- El objetivo es implementar el diálogo entre la computadora y el usuario para confirmar las necesidades de este.
- En problemas simples esto puede ser suficiente, pero para problemas complejos el dialogo no es suficiente para comprender los requisitos.

## Desechable

Como es desechable, la finalidad es que el usuario lo utilice y nos diga los puntos débiles del prototipo.

- Se desarrollan sólo aquellos aspectos del sistema que se entienden mal o son desconocidos.
- Todos los elementos del prototipo serán posteriormente desechados.
- Se utilizan datos reales.

Se toma la decisión de si será desechable o no a partir de mi idea de qué tan bien está el prototipo, qué tanto sirve.

## Evolutivo

Desarrollar un producto de forma rápida y parcial del sistema de modo que el usuario lo utilice durante un tiempo y proporcione retroalimentación a los desarrolladores sobre los puntos fuertes del prototipo.

**El primer prototipo muestra la funcionalidad de aquellos aspectos bien comprendidos.**

Proporciona un marco para el resto del desarrollo.

Cada prototipo sucesivo explora una nueva área de necesidades del usuario y refina las funciones del anterior.

**Este tipo de prototipo se centra en la funcionalidad y el contenido.**

# Seleccionando el modelo de ciclo de vida

---

1. Analizar las características del proyecto y evaluar 20 criterios propuestos por el método (ver siguiente subsección).
    
2. A cada criterio asignarle un valor cualitativo (de acuerdo al rango que muestra la Tabla de criterios) justificando por que.
    
3. Pasar los valores asignados a un indicador binario (ver tabla de valores).
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/9cc15189-9c03-4f64-b426-fff80021e45f/Untitled.png)
    
4. Realizar la sumatoria de los valores
    
5. Del resultado, el modelo de ciclo de vida con el índice MAS ALTO es la mejor opción para el proyecto.
    

## Criterios del paso 1

### Sobre el Personal

> Mientras más novatos sean vamos a generar más horas de esfuerzos.

1. Experiencia de los usuarios en el Dominio de la Aplicación: Evalúa el conocimiento de los usuarios sobre el dominio del problema.
2. Habilidad de los usuarios para expresar sus necesidades: Evalúa como los usuarios son capaces de comunicar sus necesidades.
3. Experiencia de los desarrolladores en el Dominio de la Aplicación: Mide el conocimiento de los desarrolladores sobre el dominio del problema. Muchas veces el problema tiene muchas variables y eso aumenta la complejidad de encontrar una persona adecuada para ser parte de este tipo de proyectos. Para evitar eso necesitabas personas capacitadas en un ámbito determinado con muchas variables a tener en cuenta. Ejemplo: Agro.
4. Experiencia de los desarrolladores de Ingeniería de Software: Evalúa la experiencia de los desarrolladores y el conocimiento de las herramientas, métodos, técnicas, y lenguajes necesarios a ser utilizados en el proyecto.

De esos cuatro criterios que tenemos lo que hacemos es tener en cuenta 3 tipos de niveles de personas. Posteriormente se asigna un valor a c/u en base a el modelo de ciclo de vida seleccionado (ver tabla de la seccion anterior).

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/824d1523-4d7e-4f4f-ac5d-199c44988e27/Untitled.png)

### Sobre el Problema

1. Madurez de la aplicación: Evalúa el conocimiento general sobre el problema, si constituye un área de aplicación madura o reciente. Si es una problemática conocida tendremos un buen puntaje, mientras que si es reciente no tendremos tanto conocimiento sobre ella.
2. Complejidad del problema: Mide la complejidad del problema específico que debe ser resuelto.
3. Requisito para funcionalidad parcial: mide la viabilidad y/o necesidad de entregar productos intermedios que proporcionen sólo una parte de la funcionalidad total del producto final.
4. Frecuencia de cambios: Indica la frecuencia con la que cambia el problema. Si es convencional buscamos que sea estático, si es cambiante estamos esperando que sea incremental o evolutiva.
5. Magnitud de cambios: Valora el tamaño relativo de los cambios esperados en el problema.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/caf86f41-18e6-49f9-9a44-9156b7b3e80a/Untitled.png)

### Sobre el Producto

1. Tamaño de producto: Evalúa el tamaño estimado del producto final. Puede ser amplio o bien algo más sencillo. Esto es respecto del tamaño del equipo, entonces un equipo grande para un problema grande está bien.
2. Complejidad de producto: Mide la complejidad del software a desarrollar.
3. Requisitos: Representa los requisitos **no funcionales** que tiene un producto software, como fiabilidad, adaptabilidad, utilización, reutilización y mantenimiento. Quiero que sea posible ampliarlo? Voy a usar este producto como base para otros?
4. Requisitos de interfaz humano: Mide la importancia de la interfaz de usuario. Que tan importante es la usabilidad.

# Modelos de Proceso

---

Un _**proceso software**_ un conjunto de actividades y resultados asociados que conducen a la creación de un producto software.

La necesidad de definir un proceso surge para posibilitar la repetición, facilitar la realización del mismo por diferentes personas, para llevar a cabo mediciones y mejoras.

Define un conjunto ideal de actividades a desarrollar que me permiten definir qué actividades voy a repetir cada vez que empiezo un proyecto y qué herramientas voy a utilizar.

Cualquier modelo de procesos define las actividades básicas de la gestión de proyectos para que dicha gestión se convierta en un checklist.

> _Es el conjunto de actividades que yo voy a llevar a cabo para desarrollar un proyecto informático. **La combinación de el producto y el proceso es lo que define un proyecto informático.**_

## Definición de un Proceso Software

Definir un modelo de procesos provee:

- Guía prescriptiva sobre las Actividades a realizar
- Base para determinar las herramientas, técnicas y metodologías
- Marco para estimar la asignación y consumo de recursos. A partir de las actividades puedo definir los perfiles y las cantidad de recursos que voy a necesitar
- Base para llevar registros empíricos sobre productividad, calidad y costos
- Descripción comparativa sobre los software construidos

Un modelo de proceso, entonces, define:

- Procesos / Actividades / Tareas
- Productos / Artefactos
    - Son los resultados de aplicar procesos, actividades y tareas
    - Se pueden combinar con otros productos o artefactos y, mediante un proceso, generar un producto más grande
- Roles
    - Quienes llevarán a cabo las actividades para construir los productos en particular.
    - Portan el conocimiento para poder desarrollar.
- Buenas Prácticas
    - Los estándares permiten brindar buenas prácticas de seguridad, diseño de arquitecturas, etc.

## Proceso Software y las Iteraciones

- Relevamiento de requisitos
- Análisis
- Diseño
- Desarrollo de aplicación
- Realizar pruebas de aceptación

Necesito realizarlas para poder construir los diferentes productos que básicamente son los estados del ciclo de vida. El ciclo se va repitiendo una y otra vez, y la realización de un ciclo es lo que se conoce como **iteración.**

El producto va adquiriendo estados, pero en sí es un producto de software que se va transformando o evolucionando hasta llegar a su estado final.

El producto, en cualquier estado, sigue siendo un producto y este proceso de iteración se realiza todas las veces que sea necesario.

Para trabajar en la gestión de un proyecto, se requiere un modelo de proceso (un estándar) para obtener todas las actividades que hay que realizar y una metodología de trabajo para obtener cómo llevar a cabo esas actividades.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/41be0f85-da89-4f44-8397-e37330c261f1/Untitled.png)

## Estándares de Proceso

Pensados para proyectos informáticos pensados para proyectos de software.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/5c3df009-11a3-4ed2-a08a-4f70276a4e74/Untitled.png)

# Metodologías Ágiles y No Ágiles

---

## Metodologías Ágiles

- Grupos pequeños (< 12 integrantes) y trabajando en el mismo sitio
- Menos énfasis en la arquitectura
- El cliente es parte del equipo de desarrollo (además in-situ)
- Pequeños cambios en cada versión
- Rol central del equipo de desarrollo
- Desarrollo basado en pruebas
- Diseño y construcción integrados
- Fácilmente adaptable a los cambios

## Metodologías No Ágiles

- Grupos grandes de trabajo
- La arquitectura es esencial
- El cliente interactúa con el equipo de desarrollo mediante reuniones
- Grandes cambios en cada versión
- Rol central del líder de proyecto y diseñadores
- Desarrollo basado en la planificación
- Separación diseño y construcción
- Difícil de adaptar a los cambios

Existen ambas por una razón: sirven para cosas distintas.

- Las metodologías ágiles son más idóneas para trabajos evolutivos o incrementales
    - Son para productos más pequeños, donde no hay mucho en juego (ni vidas humanas ni recursos económicos)
    - Por ejemplo: una app para celular
- Las metodologías no ágiles se usan especialmente en proyectos más grandes y en productos convencionales
    - Se utilizan más en empresas donde el producto software no es la prioridad ni el negocio
    - Por ejemplo: un banco

<aside> 💡

Las metodologías se pueden combinar, dependiendo del grupo de personas.

</aside>

# Niveles de gestión de proyectos informáticos

---

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/06051ea4-2404-4d37-871f-c51975eb083f/Untitled.png)

- Para la Dirección, se utiliza PMBOK a nivel de gestión de a cartera de proyectos
- Para cada proyecto en particular, se tienen los estándares IEEE 1074, ISO 12207, etc
- Para cada equipo dentro del proyecto, se utiliza SCRUM

Por ejemplo, la empresa es el ITBA. El área de dirección de informática se encarga de manejar todos los proyectos informáticos de la institución: SGA, ITBApp, etc. Cada proyecto tiene varios grupos de desarrollo.

## PMBOK (**Project Management Body of Knowledge)**

Es un modelo desarrollado por el PMI (Project Management Institute) y actualizado por la comunidad internacional.

PMBOK define un modelo de referencia para la dirección integrada de proyectos, y desarrolla nueve procesos de gestión que cubren todas las áreas necesarias.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/551d6b79-fa8f-4565-ae82-074b87f638ad/Untitled.png)

Son 9 procesos de gestión a nivel de dirección de distintas áreas del proyecto.

Este modelo sirve para todo proyecto ingenieríl: implementación, servicios, entre otros.

## ISO 12207

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/b7f239ec-ade3-4e33-9942-05aec1c90f4b/Untitled.png)

## Estándar IEEE 1074

Determina el conjunto de actividades esenciales, no ordenadas en el tiempo, que deben ser incorporadas dentro de un modelo de ciclo de vida del producto.

Es un modelo prescriptivo estático que pretende ser una guía de la gestión y desarrollo de un proyecto software.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/4ab86790-77a7-42a9-8ca2-f45058c372b4/Untitled.png)

Lo primero que se deben hacer **si o si** es la selección del modelo de ciclo de vida, teniendo una idea del producto final. Luego, se comienza con el resto de actividades.

Todas las actividades que están dentro de Procesos de Gestión, Procesos Orientados al Desarrollo de Software y Procesos Integrales del Proyecto pueden hacerse en diferente orden. No están fijadas temporalmente.

Cuando empezás a producir el producto tenés que explorar los conceptos principales y después como asignamos eso al sistema. Ejemplo: el sistema de matriculación tiene conceptos nuevos como la correlatividad de las materias, pero el ID de los alumnos y los códigos de las materias provienen desde otro sistema.

El procesos de desarrollo del producto está formado por el proceso de requisitos, proceso de diseño y proceso de implementación.

También tenemos a los procesos de post-desarrollo que están formados por la operación y soporte, proceso de mantenimiento y el proceso de retiro.

Por último, tenemos los procesos integrales del proyecto. Aquí encontramos al proceso de validación y verificación, proceso de gestión de configuración del software, proceso de documentación y proceso de formación.

<aside> 💡 Validar es contra los requisitos, verificar es contra lo funcional.

</aside>

## SCRUM

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/3f393d96-c59b-4e18-ad7b-5dadac7c6464/Untitled.png)

### Gente (Roles)

Son equipos pequeños ⇒ 3 a 12 personas

- _**Product Owner: Responsable del producto**_
    - Visión del negocio.
    - Responsable por el retorno de inversión
    - Integrante del equipo
    - Ubicado cerca del equipo
- _**Scrum Master: facilitador**_
    - Lider servil
    - Ayuda a mantener el foco
    - No forma parte del equipo
    - Debe tender a ser invisible: plantea preguntas y facilita la comunicación. Es una cabeza que piensa pero no se la ve.
- _**Scrum Team: El equipo**_
    - Autoorganizados
    - Habilidades antes que roles
    - Multi funcionales
    - Responsables solidarios por el producto
    - Ubicados en un mismo espacio

### Ceremonias (Actividades)

Son las actividades, se deben hacer **siempre**, de la **misma manera**

- Sprint (iteraciones): deben ser cortos
- Planificación Estratégica
- Planificación Táctica
- Reuniones
    - Reunión de planificación
    - Reunión diaria
    - Revisión de la iteración
    - Retrospectiva de la iteración

Más en detalle:

- _**Sprint Planning:**_ Es una jornada de trabajo antes del inicio de cada Sprint donde se determina el objetivo del Sprint y las Historias a incluir, se estiman las historias y tareas a concretar en el Sprint. Cada Sprint dura entre 1 y 4 semanas y tiene un producto final entregable. Debe participar el Product Owner, esta reunión puede durar media jornada (4 horas).
    - Se define:
        - Objetivo del Sprint
        - Sprint Backlog (Pila de Historias de usuario)
        - Equipo de trabajo y dedicación
        - Fecha de fin de Sprint y de presentación del demo
        - Lugar y hora de las dailies
- _**Daily:**_ Una breve reunión diaria de alrededor de 15 minutos para evaluar la tarea a realizar y definir el trabajo del día. Solo interviene el Scrum Team. Cada miembro del equipo debe responder:
    - Trabajo realizado desde la reunión anterior
    - Trabajo a realizar hasta la próxima daily
    - Problemas que tuvo que le hayan impedido lograr su objetivo
- _**Sprint review:**_ Se realiza al final de cada Sprint. Se revisa el trabajo realizado y el no realizado. Es el momento donde se muestra la demo a los clientes.
    - Cada Sprint debe finalizar con una Demo, lo que se debe mostrar son las caracteristicas funcionales del sistema, no las técnicas
    - No debe durar mas de 4 horas
- _**Sprint Retrospective:**_ Se realiza al finalizar de cada Sprint, es el momento donde los miembros del equipo dan sus impresiones sobre el sprint.
    - Esta es una reunión muy importante que muchos equipos suelen no realizar
    - El objetivo es una mejora continua de todo el proceso
    - En general no debe durar mas de 4 horas
    - Suele hacerse una pizarra con 3 columnas:
    - _**Bien:**_ si hiciéramos el Sprint otra vez, volveríamos a hacer ese punto igual
    - _**Mejorable:**_ si hiciéramos otra vez el diferente. Sprint, haríamos estas cosas de forma diferente
    - _**Mejoras:**_ que cosas específicamente se pueden mejorar en los próximos Sprints

### Artefactos (Producto que salen como resultado de las ceremonias)

- _**Backlog del producto (icebox):**_ Es una lista priorizada de todos requisitos funcionales del sistema, está definida por el cliente, cada requisito es conocido con el nombre de es “elemento de la pila” o “historias de usuario”.
    
    - El “dueño” es el Product Owner y solo él puede modificarla
    - Con los diferentes requisitos se definen Historias de Usuario o User Stories
    - Cuentan con una estimación inicial, medida en _story points_
- _**Backlog de la iteración (sprint backlog):**_ Es la pila de requisitos funcionales o user stories que contendrá el sprint.
    
    - Las historias se dividen en tareas.
    - Las tareas son “NO entregables”; son aspectos que no le preocupan al dueño del producto
    - No pueden modificarse las user stories durante el sprint
    
    <aside> ℹ️ **User Stories / Historias de Usuario**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/c7ffa345-1eb8-4f1d-b767-8062b74d6b5a/Untitled.png)
    
    </aside>
    
- Lista de requerimientos
    

## Integración Estándar IEEE + SCRUM

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/f66f03e3-8b2c-4e9a-ad4b-28ee100e1589/Untitled.png)

SCRUM entra en juego principalmente en los procesos de desarrollo. Se podría a llegar a utilizar en procesos de post-desarrollo pero **nunca** se utilizará en los procesos de gestión ni en los procesos integrales.

# Tecnología de Proceso

---

Se dedica a definir el conjunto de actividades para llevar a cabo un proyecto informático, qué herramientas me sirven y las metodologías a aplicar. También se encarga de definir el perfil o encontrar el perfil de conocimiento.

El producto software es diferente del proceso (actividades) y también es distinto de las metodologías que utilice.

<aside> 🚨 **PRODUCTO ≠ PROCESO ≠ METODOLOGÍA**

</aside>
