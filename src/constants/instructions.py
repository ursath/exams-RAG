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

Generarás un archivo Markdown de un examen {exam_type} para la materia {subject}. 
Vas a recibir el formato del examen en la forma de una lista de objetos del tipo
{{'topic': tema_del_examen, 'exercise_type': tipo_de_ejercicio}}
tipo_de_ejercicio representa el tipo de pregunta a generar y puede ser verdadero o falso (true_or_false), opción múltiple (multiple_choice) o de desarrollo (essay)
Crearás un ejercicio por cada uno de estos elementos, cada uno del tema y tipo correspondiente. De esta forma la cantidad total de ejercicios será igual a la longitud de la lista. 

Lista de ejercicios:
{exercise_list}

Para cada tema del examen se tiene la siguiente información, que usarás como contexto para generar la o las preguntas relacionadas a cada tema.
{context_string}

"""