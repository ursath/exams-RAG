# Análisis de Riesgos

---

Los riesgos son algo inherente a la vida. Siempre vamos a tener riesgos, y esos riesgos implican un cambio de situación; por ejemplo que se pueda dañar algo o una persona. Por esto tenemos que tomar decisiones previas; “acciones preventivas”, que tomamos sin certeza de que sea lo correcto o lo más adecuado.

<aside> 💡 El riesgo tiene que ver con una situación que pueda pasar en el futuro. Es algo que “está en el radar”, pero todavía no está ocurriendo.

</aside>

Los riesgos pueden ser obvios, los típicos, o a veces pueden ser riesgos más raros que tienen que ver con el proyecto en sí que estamos desarrollando, algo particular nuestro.

El riesgo implica un cambio de situación inesperado y a la vez, implica una elección y la falta de certeza de que la elección sea correcta. Cada vez que se va a desarrollar software aparecen incertidumbres que se pueden transformar directamente en situaciones de riesgo para el proyecto.

El **análisis de riesgo** consiste en realizar una serie de actividades de control sobre los posibles problemas. El riesgo en sí mismo tiene que ver con el futuro.

Es preciso identificar todos los posibles riesgos “obvios” para el equipo de proyecto.

El _**Análisis de Riesgos**_ afronta dos problemas difíciles de resolver:

1. El tamaño
2. Lo desconocido

### Riesgo vs Problema

- _**Problema:**_ una situación negativa que ya está presente. Por ejemplo, “se me fué el programador estrella”
- _**Riesgo:**_ “mi programador estrella está estresado” o “está buscando otras oportunidades”

## Tamaño

> _“Es todo igual? Es el mismo riesgo que se vaya un programador jr a que se raje mi inversor principal? O que un competidor lance su producto antes que yo?_

El problema del tamaño del riesgo.

Ejemplo: el Coronavirus es un virus que podría haber resultado en:

- Generador de una enfermedad local donde se detectaron los primeros casos
- Generador de una epidemia en una ciudad
- Generador de una epidemia en un país donde se detectaron los primeros casos
- Generador de una Pandemia

El TAMAÑO de cada factor de riesgo puede determinar que se asuma o no ese riesgo

## Desconocido

> _¿Cómo tomar en cuenta aquellos factores de riesgo que nunca imaginas que podrían suceder?_

Cosas que eran una “incógnita desconocida” antes de que sucedan.

Por ejemplo: ¿Deberíamos haber estimado un riesgo de la pandemia del COVID-19 con un 1,00 % de probabilidad de que ocurra en Buenos Aires, en Noviembre de 2019?

El problema de lo “Desconocido”:

- ¿Cómo podrías haber imaginado? Esta pregunta es muy difícil de responder
- ¿Cómo se resuelve? En los contratos de negocios existe el término “Casos de Fuerza Mayor”, que si suceden anulan automáticamente toda responsabilidad sobre el contrato: terremotos, epidemias, derrumbes, inundaciones, inestabilidad política, revoluciones, etc

El corona podría haber sido una enfermedad local, o una epidemia, o una pandemia. En el momento que apareció, no se sabía.

## ¿Cómo se evalúan?

- Tamaño = Impacto del riesgo
- Desconocido = Probabilidad de ocurrencia

$$ Impacto \times Probabilidad $$

Esto me permite rankear los riegos.

Para medir el Riesgo en proyectos se utiliza la Teoría Estadística Bayesiana.

<aside> 💡 Un riesgo puede ser tan grande como para justificar cancelar un proyecto. Es importante medir el riesgo!

</aside>

## Teoría Estadística Bayesiana

Se basa en:

- Identificar diferentes eventos posibles.
- Asociar cada uno con una probabilidad de ocurrencia
- Cuantificar el impacto de cada evento
- Estimar los daños esperados: $\text{impacto} \times \text{probabilidad de ocurrencia}$ de cada factor de riesgo

# Actividades del Análisis de Riesgo

---

1. Identificación del riesgo
2. Estimación o Proyección del riesgo
3. Gestión del riesgo

<aside> 💡 Los riesgos son un aspecto del proyecto que tienen que estar vigilados.

</aside>

## Identificación de Riesgos

**Tipos de Riesgos Generales:**

- **Riesgos genéricos:** son una amenaza potencial para todos los proyectos software de una organización
- **Riesgos específicos:** son una amenaza para el proyecto específico, de acuerdo a las características particulares. Son propios de las características de nuestro proyecto

**Tipos de Riesgos en Proyectos Informáticos:**

⚠⚠ TÍPICO QUE APAREZCA EN EL PARCIAL ⚠⚠

- **Riesgos del Proyecto:** amenazan el plan de proyecto, es decir, nuestro cronograma y fecha de entrega.
    - Presupuesto del proyecto
    - Planificación temporal
    - Recursos Humanos (seniority, disponibilidad)
    - Recursos tecnológicos (falta de acceso, cambios en API, etc)
    - Cliente (falta de especificidad en los requisitos, cambios en el alcance)
    - Requisitos ()

<aside> 💡 En la mayoría de los proyectos, la fecha de entrega debe ser respetada, y hay muchos factores que pueden afectar a esta que deben ser observados.

</aside>

- **Riesgos Técnicos:** amenazan la calidad y la construcción (integra las actividades que se realizan en el desarrollo) del producto.
    - Diseño
    - Desarrollo
    - Interfaz
    - Verificación
    - Implantación en el contexto real
    - Mantenimiento del producto
    - Por ejemplo, que los programadores sean muy junior y no manejen bien la tecnología. Podemos mitigar el riesgo con capacitaciones, o poniendo un supervisor, etc

<aside> 💡 Los proyectos fracasan grandes veces por culpa de las personas; porque se van sea por sea la razón. Tenemos que tener en cuenta al factor humano.

</aside>

- **Riesgos del Negocio:** amenazan la viabilidad del proyecto. Algún evento que a nivel negocio no sea viable o no sea rentable. Cambia el contexto o condiciones de mercado que haga que nuestro proyecto ya no sea atractivo.
    - Mercado
    - Estrategia comercial
    - Políticas de venta
    - Dirección del negocio
    - Presupuesto del negocio

<aside> 💡

Muchas veces en estos casos tengo problemas como “es un producto nuevo, no tengo suficientes subscriptores”. Nuestro producto puede andar fabuloso, lo definimos bien y sacamos a tiempo, pero no agarró en el mercado.

</aside>

## Estimación o Proyección del Riesgo

Se cuantifica cada riesgo según:

- _**Nivel de incertidumbre:**_ la probabilidad de que ocurra el riesgo
- _**Nivel de pérdida:**_ las consecuencias en caso de que ocurra

La tarea consiste en:

1. Establecer una escala de probabilidad percibida de Factores de riesgo
2. Definir las posibilidades de ocurrencia en cada contexto
3. Estimar el impacto de cada factor de riesgo
4. Determinar la proyección de cada riesgo de manera que no haya confusiones (valoración de factores y daños)

Con estos datos se arma una tabla, con una escala discreta

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/a56ddd58-63e3-4078-bd24-8e51a2cc6591/Untitled.png)

<aside> 💡 Una vez que tenemos identificados y evaluados todos nuestros riesgos, podemos hacer algo al respecto, podemos _gestionarlos_. Hacer todo lo posible para que no pase.

</aside>

## Gestión del Riesgo

> _¿Qué vamos a hacer para que esto no me ocurra?_

Una vez que conocemos los riesgos y que tan importantes son, se toman medidas para gestionarlos:

- **Plan de Reducción del Riesgo**: estrategia para reducir la probabilidad de que ocurra.
    - Por ejemplo, tengo un desarrollador muy piola que puede ser que renuncie. Podemos tomar ciertas medidas para que se quiera quedar: flexibilidad horaria, perks.
- **Supervisión del Riesgo:** supervisar los factores que indican si el riesgo se está haciendo más o menos probable.
    - Por ejemplo, tengo un desarrollador muy piola que puede ser que renuncie. Podemos tener reuniones mensuales con el empleado para ver como se siente, y actuar de manera acorde.
- **Plan de Contingencias:** cuando los factores de reducción han fracasado y el riesgo es una realidad. Debe elaborarse un plan que organice los pasos de gestión sobre los efectos o daños del problema.
    - Es un _¿Qué pasa si me ocurrió? ¿Cómo salimos de esta situación? ¿Cómo seguimos operando?_
    - Por ejemplo, tengo un desarrollador muy piola que puede ser que renuncie. Como vimos que era muy probable que se vaya, fuimos capacitando a otro miembro del equipo para que lo remplace.
    - ESTE PLAN SE HACE ANTES, NO CUANDO TE PASÓ EL PROBLEMA!

### Estrategias de abordaje de riesgo

- **Reactivas**: cuando el equipo de desarrollo no hace nada frente a los posibles riesgos y reacciona apenas algo va mal.
- **Proactivas**: comienza antes de las actividades técnicas, se identifican los riesgos potenciales, se valora su probabilidad e impacto, se establece una prioridad según su importancia y se elabora un plan de contingencias.
    - Arrancamos antes con probabilidades para ver por adelantado cuándo arranca ese riesgo.
    - Si tengo una persona con un rol muy crítico y dificil de reemplazar en el equipo, por más que no haya _ahora_ riesgo de que se quiera ir, yo puedo ir promoviendo o capacitando otras personas para poder reemplazar ese rol

## Herramientas para el análisis de riesgo

- Norma Internacional de Evaluación de Riesgos: ISO 31.000 y ISO 31.010
- Técnicas para hacerlo:
    1. Check-lists
        
        1. A medida que se va adquiriendo experiencia, esta lista se hace más rica
    2. SWIFT (Structured What If Technique)
        
        1. Permite identificar los riesgos vinculados a la evaluación técnica de un proyecto.
        2. Se nutre de expertos disponibles
    3. Análisis de árbol de fallas
        
        1. Tiene que ver con fallas de maquinaria, de infraestructura, de herramientas concretas
        2. Asigno probabilidad a cada falla y preveo como actuar en caso de una de ellas
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/54277a05-066d-4716-83d1-468e290f5bbd/Untitled.png)
        
    4. Diagrama causa-efecto
        
        1. Busca, pensando en que ocurrió el problema, cuál o cuales son las causas del problema
        2. Permite conocer la raíz del problema y cuellos de botella en procesos.
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/0e11f010-4ca5-42c1-abc8-aba09b38e60e/Untitled.png)
        
    5. Análisis modal de fallos y efectos (AMFE)
        
        1. Se crean escenarios ficticios de qué pasaría si ocurre alguno de los riesgos.
        2. Es de tipo mocking
    6. Análisis de capas de protección
        
        1. Permite la evaluación de controles, así como su eficacia.

<aside> 🧠 De acuerdo a las características del proyecto, pueden seleccionarse las técnicas y herramientas que resulten más adecuadas.

</aside>
