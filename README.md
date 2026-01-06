# Order Management Facility API

To view the OpenAPI spec navigate to `/docs` in url path

## Design descitions

### Backend

- attempted to setup async pg driver, unfortunatley due to some errors and timeconstraints opted away from it
- Psycopg2-binary is used through out the project
- for ease of testing business logic is placed in `api/functions.py`, ideally should be broken to modules,
- depending on complexity modules itself can encapsulate the models and schemas
- you might encounter warnings on your IDE, `api/functions.py` this is due to insufficient type hinting, defining crud functions at class level instead would solve it.
- relying on returned objects and their classes is not stable
- can improve with use of Enums for statuses etc

### UI

- Used ready made components from Radix ui and shadcn templates to save time
- used default tailwindcss for quick styling
- pagination values are hardcoded

#### Site map

Contains the below pages

- HOME
  - Has two buttons to Products and Orders
  - Rounded edge rectangles centered
- Products
  - New Product button
    - Shows Dialog Box with submit button
    - Has three text boxes with labels name, price, stock amount
    - submit points to POST: /api/v1/products/
  - Paginated List of all products
    - points to GET:/api/v1/products/
    - follows the skip, limit convention
  - Home Button at the bottom
- Orders

  - New Order button

    - Shows a dialog box
    - dialog box has drop down to select items from GET: /api/v1/products/
    - next to drop down there's a add button
    - added items are displayed in squence below the drop down
    - Place order button confirms the order with POST : /api/v1/order/
    - Cancel button closes the dialog box

  - Search Box + Search Button
    - points to GET: /api/v1/order/{order_id}
    - Search box will show a dialog box with only show the result item
    - Current status label shows Current status of order via GET: /api/v1/order/{order_id}
    - The dialog box has a drop down with ["Pending", "Shipped", "Cancelled"]
    - Update button points to PATCH: "/api/v1/order/{order_id}/status"
    - Cancel button closes the dialog box
  - Paginated List of all orders
    - points to GET: /api/v1/order/
  - Home Button at the bottom

- ui can be improved
- enums can be used for better consistency
- some values are hardcoded
- better state management can be implemented
- DOM updates aren't realtime

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

Use `uv` for python package management

`uv sync` to install venv

`uv run main.py` to run dev instance

### Frontend

use vite with pnpm for package management

go to `cd order-management-ui`

use `pnpm install` to install dependencies in directory

use `pnpm run dev` to run dev instance

## Testing

Run `uv run pytest` to run unit tests for backend
