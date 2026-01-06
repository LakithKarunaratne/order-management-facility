FROM python:3.11-slim AS build

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir uv
RUN uv sync --frozen

FROM build

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "uv run alembic upgrade head && uv run python main.py"]