# Control, Gestión y Garantía de Calidad

---

Para un producto software, la calidad es una característica de excelencia y diferenciabilidad para el cliente o el usuario. Según el tipo de producto que se quiere desarrollar, se lo tomará desde el producto final que se entrega y/o del proceso de desarrollo.

## Definición de calidad según ciertos personajes

- La calidad es, según Henry Ford, hacer lo correcto cuando nadie está mirando
    - Lo convierte en una característica inherente al proceso
- Según Steve Jobs, la calidad es un valor diferencial. Le da prestigio al producto
    - Se sale de lo clásico y se lo ve como un agregado
- Según Juran, la capacidad de adecuación del producto al uso
- Según Deming, la conformidad con los requisitos y confiabilidad en el funcionamiento
- Según Crosby, un producto con cero defectos
    - Viene del modelo Toyotista, donde todas las partes del producto funcionan correctamente desde su concepción
    - En los proyectos informáticos, esto es imposible debido al desconocimiento de los requisitos y la falta de especificación al inicio del proyecto
- Según Taguchi, es la pérdida económica que un producto supone para la sociedad desde el momento de su expedición
- Según la ISO 9001, es el grado en el que un conjunto de características inherentes cumplen con los requisitos

## Calidad en software

**La calidad se define como:**

- La suma de todos aquellos aspectos o características de un producto o servicio que influyen en su capacidad para satisfacer las necesidades, explícitas o implícitas.
- Grado con el cual el cliente o usuario percibe que el software satisface sus expectativas

Esto implica que la calidad:

- No es absoluta (dependerá de las necesidades y las expectativas de un usuario)
- Está sujeta a restricciones (al contexto de uso)
- Trata de compromisos aceptables y alcanzables entre ambas partes
- Es multidimensional (no solo depende del desarrollo)
- Los criterios de calidad no son independientes, dependen del proyecto en particular. Para el mismo producto, con dos clientes diferentes, puede tener distintos niveles de calidad.

<aside> 🧠 **Punto de vista del desarrollador ≠ Punto de vista del cliente/usuario**

Todo depende de la perspectiva.

El desarrollador debe marcar el diferencial que le aporte calidad al propio equipo de desarrollo: a través de las herramientas que utilicemos, las reuniones que hagamos, la documentación, la estética de la interfaz, etc.

Es muy difícil que el cliente/usuario esté completamente conforme con el producto finalizado. Esto pasa porque el usuario siempre espera algo que el producto software no le va a dar, ya que la perspectiva es que siempre se puede mejorar.

</aside>

## Ingeniería de Proceso vs Ingeniería de Producto

<aside> 🧠 **Recordar:**

Ingeniería de Proceso define las especificaciones de las actividades del proceso productivo en el campo de aplicación correspondiente.

Ingeniería de Producto especifica las características técnicas de los productos que construye.

</aside>

La calidad que se obtenga en el proceso determinará la calidad del producto.

**Por eso, las iniciativas en mejora de la calidad se centran en PROCESOS.** Si se estandarizan las actividades y se asegura uniformidad en la salida de los procesos, se obtendrá calidad en los productos. La calidad del producto solo es medible una vez que está implementada en el contexto particular y real de uso.

- **Normas de calidad del proceso**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/79443fe9-8457-4e70-b613-f5499e8e7a03/Untitled.png)
    
- **Normas de calidad en el producto**
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/af416ad1-efe8-4b43-8a3e-800df4aaabb1/Untitled.png)
    

Estas normas están pensadas para certificar que nosotros trabajamos con calidad. Es un “sello de calidad”

# Sistema de Calidad

---

Para cualquier industria, la calidad está estructurada en tres ejes:

- Gestión de calidad
- Garantía de calidad
- Control de calidad

## Gestión de calidad

Determinación y aplicación de las políticas, objetivos y directrices de calidad de la organización.

- Especifica como integrar las diferentes tareas en un Modelo de Proceso de Desarrollo Software que sigue la organización o el proyecto.
- Define un Plan que debe identificar los diferentes criterios de calidad que se consideran para cada fase del desarrollo, relativos al producto y al proceso, así como los métodos y recursos que se utilizarán.
- Basar el sistema de gestión de Calidad en un Modelo de Proceso o de Calidad reconocido, que ayude en la selección de propiedades y métricas de calidad a utilizar.
- La Calidad se gestiona a través de “Sistemas de Calidad” que establecen:
    - El tipo y número de actividades de calidad que es necesario adoptar en un proyecto.
    - Las diferentes estrategias, actividades y herramientas de calidad que se deben utilizar.
    - La forma en que deben distribuirse las tareas y responsabilidades de calidad entre las diferentes unidades organizativas del proyecto.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/56631d9e-43a5-4415-b4fe-81b2ca02ba91/Untitled.png)

## Garantía de Calidad

Conjunto de actividades planificadas y sistemáticas necesarias para proporcionar confianza en que el producto software satisfará los requisitos dados de calidad.

Es todo aquello que yo pueda hacer y mostrar hacia afuera para asegurar que lo que yo estoy desarrollando va a tener calidad. Esto abarca todos los estándares anteriormente mencionados.

El trabajo consiste en la planificación, estimación y supervisión de las actividades de desarrollo, que se realizan de forma independiente al equipo de desarrollo, de forma tal que los productos software resultantes cumplen los requisitos establecidos.

## Control de Calidad

Actividades para evaluar la calidad de los productos desarrollados.

Define los puntos de control que se deben pasar a medida que se va desarrollando para asegurar la calidad.

### Principios de los Controles de Calidad

- Un desarrollador debe evitar probar su propio código.
- Inspeccionar objetivamente el resultado de cada prueba.
- Los casos de prueba deben ser escritos tanto para condiciones de entrada válidas inesperadas como para condiciones válidas esperadas.
- No probar con la suposición de que no se van a encontrar defectos.
- Las pruebas constituyen una tarea altamente creativa y son un desafío intelectual.

# Modelos de Calidad (McCall)

---

El concepto de calidad deriva de un conjunto de subconceptos, cada uno de los cuales se evalúa a través de un conjunto de indicadores o métricas.

- _**Factores de calidad:**_ Representan la calidad desde el punto de vista del usuario (atributos de calidad de Inge 2)
    - Se basa en 11 factores de calidad que se organizan en torno a tres ejes:
        - Operación del producto
        - Revisión del producto
        - Transición del producto

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/dc076dc1-7290-4e8f-8109-5652e424cbe9/Untitled.png)

- **Criterios de calidad:** son internos, teniendo en cuenta el punto de vista del desarrollador
    
    - Eligiendo estos criterios podemos ver que factores de calidad tendrá nuestra aplicación
    - Cada uno de los factores se descompone en criterios, dando un total de 23
- **Métricas del producto:** son medidas cuantitativas de ciertas características del producto que indican el grado en que dicho producto posee un determinado atributo de calidad
    
    Se propone un conjunto de métricas, no hay métodos formales que cubran todos los criterios.
    

## Factores de calidad

- Operación del Producto
    - **Corrección**: cuando un software cumple las especificaciones y satisface los objetivos del usuario/cliente. Por ejemplo, si una aplicación debe ser capaz de sumar dos números y en lugar de sumar los multiplica, es un programa incorrecto. Es quizás el factor más importante, aunque puede no servir de nada sin los demás factores.
    - **Fiabilidad**: funcionamiento sin errores de un programa o aplicación. Por ejemplo, si una aplicación suma dos números, pero en un 20% de los casos el resultado que da no es correcto, es poco fiable.
    - **Eficiencia**: cantidad de código y de recursos informáticos (disco, memoria, etc.) que precisa un programa para desempeñar su función. Un software que suma dos números y necesita 1 MB de memoria para funcionar, o que tarda 20 segundos en dar una respuesta, es poco eficiente.
    - **Facilidad de uso:** esfuerzo por parte del usuario de aprender a manejar un producto, realizar la entrada de datos e interpretar la salida del mismo
    - **Integridad**: control de los accesos ilegales a programas o datos. Una aplicación que permite el acceso de personas no autorizadas a ciertos datos es poco íntegro.
- Revisión del Producto
    - **Facilidad de mantenimiento**: simpleza de la aplicación para identificar y corregir defectos que aparecen en el código durante el funcionamiento.
    - **Facilidad de prueba**: simpleza de la aplicación para probar un software por parte de los desarrolladores y comprobar que satisface los requisitos.
    - **Flexibilidad**: esfuerzo de modificación de una aplicación por parte de los desarrolladores cuando cambian las especificaciones
- Transacción del Producto
    - **Facilidad de reutilización**: esfuerzo para implementar un módulo o un componente de código ya desarrollado para un sistema a otra aplicación.
    - **Interoperabilidad**: costo y esfuerzo necesario para hacer que una aplicación pueda operar conjuntamente con otros sistemas o aplicaciones software externos
    - **Portabilidad**: costo de migrar un producto de una configuración hardware o un entorno operativo a otro.

## Criterios de calidad

- Facilidad de uso
    
    - Facilidad de operación
    - Facilidad de comunicación
    - Facilidad de aprendizaje
- Corrección
    
    - Completitud
    - Consistencia (uniformidad)
    - Trazabilidad
- Eficiencia
    
    - Eficiencia en ejecución
    - Eficiencia en mantenimiento
- Facilidad de prueba
    
    - Modularidad
    - Simplificidad
    - Auto descripción
    - Instrumentación
- Reusabilidad
    
    - Auto descripción
    - Generalidad
    - Modularidad
    - Independencia entre sistema y software
    - Independencia del hardware
- Portabilidad
    
    - Modularidad
    - Autodescripcion
    - Independencia entre sistema y software
    - Independencia del hardware
- Integridad
    
    - Control de accesos
    - Facilidad de auditoría
- Fiabilidad
    
    - Precisión
    - Consistencia
    - Tolerancia a fallos
    - Modularidad
    - Simplicidad
- Facilidad de mantenimiento
    
    - Modularidad
    - Simplicidad
    - Consistencia
    - Concisión
    - Auto descripción
- Flexibilidad
    
    - Auto descripción
    - Capacidad de expansión
    - Generalidad
    - Modularidad
- Interoperabilidad
    
    - Modularidad
    - Compatibilidad de comunicaciones
    - Compatibilidad de datos

## Métricas para los Criterios

- _**Métricas de exactitud:**_ intentan aportar información sobre la validez y precisión del software y su estructura, incluyendo la etapa de despliegue, la de pruebas y la función de mantenimiento.
- _**Métricas de usabilidad:**_ ayudan a determinar si la solución cumple con los requisitos del usuario.
- _**Métricas de configuración:**_ mide las limitaciones, el estilo de código y todos los datos relativos al desarrollo y cualidades del producto.
- _**Métricas de eficiencia:**_ mide velocidad de respuesta, capacidad, es un enfoque similar al de la productividad pero con un matiz un poco distinto, que añadido a aquél, aporta una visión mucho más completa de la solución.

### Ejemplos

**Facilidad de Uso:**

**Criterios:**

1. Facilidad de Operación.
2. Facilidad de Aprendizaje.

**Métricas:**

1. Cantidad de clicks en la pantalla al acceder a una funcionalidad.
2. Curva de aprendizaje (Disminución de clicks al realizar una funcionalidad).

**Eficiencia:** **Criterios:**

1. Eficiencia en ejecución

**Métricas:**

1. Tiempos de request a servidores.
2. Tiempos de respuesta de servicios externos.
3. Tiempo de respuesta de bases de datos.

## Dependencia entre los 11 Factores de Calidad

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/34aeb0de-9a0c-4c0c-9a91-8045b19badcb/Untitled.png)

## Costo de los factores de Calidad

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/34d606b7-835a-4bb7-9893-8d59183adb10/Untitled.png)

## Norma ISO 25000

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/68ff58c0-dfb1-451c-a870-1082ec594269/5228b08f-7bab-49ad-9755-e74e7c13aeeb/Untitled.png)

Aborda los estándares de calidad específicos para productos software, asegurando que cumplen con los criterios y requisitos definidos.
