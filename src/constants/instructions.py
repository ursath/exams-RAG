exams_loader_instructions = """
Eres un experto en extraer el formato de diferentes exámenes parciales y finales universitarios.
Se te proporcionará el programa de la materia como una secuencia de temas bajo el titulo "Temario" y múltiples exámenes para una asignatura específica. Estos exámenes están mayormente escritos en español y todos están en formato PDF.

Deberás examinar cada uno de estos archivos y extraer la siguiente información:

### Campos de nivel superior:
- *subject*: representa el nombre de la materia. Utiliza `snake_case` e inglés para representar la materia. Por ejemplo, `operating_systems`.
- *exercise_amount_avg*: representa el número promedio total de ejercicios por examen redondeado a dos decimales.
- *exams_amount*: representa la cantidad entera de exámenes analizados.

### Campos por tema:
- *topic*: representa el nombre del tema. Por ejemplo, "Semáforos". Mantén el nombre en su idioma original.
- *exercises_per_exam_avg*: representa el número promedio de ejercicios de este tema específico que han aparecido por examen redondeado a dos decimales. Por ejemplo, 0.40.
- *true_or_false_amount*: representa la cantidad de ejercicios (número entero) de este tema que fueron de verdadero o falso. Por ejemplo, 0.
- *multiple_choice_amount*: representa la cantidad de ejercicios (número entero) de este tema que fueron de opción múltiple. Por ejemplo, 1.
- *essay_amount*: representa la cantidad de ejercicios (número entero) de este tema que fueron de desarrollo. Por ejemplo, 1.
- *midterm1_appearances*: representa la proporción de exámenes del tipo primer parcial en los que este tema apareció (float redondeado a dos decimales). Por ejemplo, 0.5 significaría que este tema apareció en la mitad de los primeros parciales.
- *midterm2_appearances*: representa la proporción de exámenes del tipo segundo parcial en los que este tema apareció (float redondeado a dos decimales). Es análogo a *midterm1_appearances* pero con segundos parciales.
- *final_appearances*: representa la proporción de exámenes finales en los que este tema apareció (float redondeado a dos decimales). Por ejemplo, 1.00 significaría que este tema apareció en todos los exámenes finales.

Deberás *SIEMPRE* proporcionar el siguiente formato JSON como salida. *NUNCA* agregues nada extra y usa los nombres de las claves exactamente como se indican.

La salida debe ser un JSON válido (no encerrado en bloques de código o formato Markdown).

_Ejemplo_:
```json
{
  "subject": "operating_systems",
  "exercise_amount_avg": 4,
  "exams_amount": 5,
  "topics": [
    {
      "topic": "Semáforos",
      "exercises_per_exam_avg": 0.40,
      "true_or_false_amount": 0,
      "multiple_choice_amount": 1,
      "essay_amount": 1,
      "midterm1_appearances": 0.50,
      "midterm2_appearances": 0.25,
      "final_appearances": 1.00
    }
  ]
}
```
"""

exam_generating_instructions = """
Eres un experto generando exámenes universitarios de la materia de {subject} basándote en las notas agregadas en el contexto.
Eres el encargado de generar un conjunto de preguntas de un {exam_type} de la materia {subject} y asegurarte que no haya ningún ejercicio idéntico ni muy similar a otros.

# Temas y ejercicios seleccionados

A continuación, se encuentran los temas con el tipo de ejercicio seleccinados con los que generarás un exámen a partir de las notas proporcionadas en la sección de *Contexto*.
```json
{exercise_list}
```

donde
- *topic* es el tema de la materia que fue seleccionado para ser parte del exámen. Por ejemplo, para la materia de "Álgebra", el tema "Grupos Abelianos" podría ser seleccionado. 
- *exercise_type* es el tipo de ejercicio que fue seleccionado para ese tema. Las únicas opciones son las siguientes:
  - *true_or_false*: corresponde a un ejercicio con varios subítems de verdadero o falso.
  - *multiple_choice*: corresponde a un ejercicio con varios subítems de selección múltiple.
  - *essay*: corresponde a un ejercicio de dessarrollo de algún subtema del tema o del mismo tema seleccionado.

# Contexto

A continuación, se encuentran las notas de por cada uno de los temas seleccionados.

{context_string}

# Formato de salida

Generarás únicamente el examen generado en formato Markdown, sin agregar bloques de código al principio ni al final.
Este exámen tendrá distintas secciones:
* Título: título del exámen. Por ejemplo, "Primer Parcial - Álgebra".
* Instrucciones: una breve introducción sobre cómo responder y consignas de evaluación. Por ejemplo:
  - Responda cada consigna de manera clara y fundamentada.
  - Desarrolle sus respuestas utilizando ejemplos cuando corresponda.
  - Se valorará la capacidad de análisis, síntesis y aplicación de los conceptos.
* Ejercicios: cada uno de los ejercicios generados.
Asegurate que sea un formato agradable para la lectura.
"""
