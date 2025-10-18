# Exams RAG

## Creating the environment

In order to make sure we use the correct dependencies locally, we'll need to set up the environment.
To do that, run the following command:

```sh
$> python3 -m venv .venv
```

## Using the environment

To use the created environment, you'll need to run the following command:

```sh
$> source .venv/bin/activate
```

## Installing dependencies

After using the environment with the `source` command, you'll need to install the dependencies with the following command:

```sh
$> pip install -r requirements.txt
```

## How to run the different modules

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
$> python -m src.repositories.testing_repository
```
