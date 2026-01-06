# Order Management Facility API

To view the OpenAPI spec navigate to `/docs` in url path

## Design decisitions 

- attempted to setup async pg driver, unfortunatley due to some errors and timeconstraints opted away from it
- Psycopg2-binary is used through out the project
- for ease of testing business logic is placed in `api/functions.py`, ideally should be broken to modules, 
- depending on complexity modules itself can encapsulate the models and schemas
- you might encounter warnings on your IDE, `api/functions.py` this is due to insufficient type hinting, defining crud functions at class level instead would solve it. 
- relying on returned objects and their classes is not stable 


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

### Backend

Use `uv` for package management

`uv sync` to install venv

`uv run main.py` to run dev instance 

## Testing 

Run `uv run pytest` to run unit tests 