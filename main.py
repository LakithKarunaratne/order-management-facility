from fastapi import FastAPI
import uvicorn
import os

from api.core import router as core_api

app = FastAPI(title="Order Management Facility")

app.include_router(core_api)

@app.get("/")
def root():
    return {"detail": "welcome to order-manangement-facility, for docs navigate to `/docs`"}

def main():
    print("Hello from hive-backend!")

    API_APP_PORT = int(os.getenv("API_APP_PORT", "8080"))
    # Standalone Runner
    uvicorn.run('main:app', host='0.0.0.0', port=API_APP_PORT)


if __name__ == "__main__":
    main()
