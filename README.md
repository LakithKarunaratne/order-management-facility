# Order Management Facility API

To view the OpenAPI spec navigate to `/docs` in url path

## Setup

create a `.env` file

```
DB_USER=testuser
DB_PASS=testpassword
DB_NAME=orders
DB_PORT=5432
DB_HOST=localhost
API_APP_PORT=8080
```

Use docker to setup and run the file

`docker compose up -d`

## Development

Use `uv` for package management

`uv sync` to install venv

`uv run main.py` to run dev instance 

## Testing 

Run `uv run pytest` to run unit tests 