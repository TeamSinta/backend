# Backend

The backend repo for the sinta app, built on Django and PostgreSQL.

## Requirements

- Python 3.11
- Poetry 1.7>
- Docker

## Installation

1. Create the file `.env.dev` in `api/config/dev`folder and add local environment variables for the "dev" environment. Request this from someone in the team.

2. From the root folder, run:

```bash
# installs the project, pre-commit, builds runs and migrates the environment.
make setup

```

3. While the environment is running, via a separate terminal run:

```bash
# lets you create your local superuser account
make superuser

# (optiona) seed the database with dummy-data.
make seed-dev
```

## Usage

Run local development environment:

```bash
make run-dev
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
