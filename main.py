from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

def main():
    print("Hello from hive-backend!")

    API_APP_PORT = int(os.getenv("API_APP_PORT", "8080"))
    # Standalone Runner
    uvicorn.run('main:app', port=API_APP_PORT)


if __name__ == "__main__":
    main()
