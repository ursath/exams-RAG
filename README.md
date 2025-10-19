# Exams RAG

## Pre-processing

### Exams Loader

The `exams_loader.py` file is used to retrieve the exams and the syllabus for a specific subject.
To run this module, use the following command

```sh
(.venv) $> python -m src/loaders/exams_loader.py --subject_dir={subject_dir}
```

where `{subject_dir}` is the directory where the exams and syllabus are located with the following structure:

```
{subject_dir}
├── exams
│   ├── {subject}-{ISO Date}.pdf
│   ├── ...
└── syllabus.txt
```

## FAQ

### How do I create a local environment?

In order to make sure we use the correct dependencies locally, we'll need to set up the environment.
To do that, run the following command:

```sh
$> python3 -m venv .venv
```

### How do I use the environment?

To use the created environment, you'll need to run the following command:

```sh
$> source .venv/bin/activate
```

### How do I install the dependencies on my local environment?

After using the environment with the `source` command, you'll need to install the dependencies with the following command:

```sh
(.venv) $> pip install -r requirements.txt
```

### How do I run the different modules?

In order to run the different python modules, you'll need to do the following steps:

1. Make sure that module has an `__init__.py` file inside of it. This file can be empty.
2. Run the file with the `-m` flag.

Here's an example:

1. The module I'd like to create is located at `src/repositories`, so I'd create an `__init__.py` file running something like this:

```sh
$> touch src/repositories/__init__.py
```

2. Imagine we have a Python file called `testing_repository.py` inside the `src/repositories` directory. Then, we'd run the following command:

```sh
(.venv) $> python -m src.repositories.testing_repository
```
