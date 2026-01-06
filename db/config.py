import os
import dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import warnings

dotenv.load_dotenv()


DB_HOST: str = os.getenv("DB_HOST","")
DB_PORT: str = os.getenv("DB_PORT","")
DB_NAME: str = os.getenv("DB_NAME","")
DB_USER: str = os.getenv("DB_USER","")
DB_PASS: str = os.getenv("DB_PASS","")

DB_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"



engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()
print("DB Connection String Loaded")


def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as db_exception:
        # if we fail somehow rollback the connection
        warnings.warn("Failed in a DB operation and auto-rollback...")
        db.rollback()
        print(db_exception)
        raise
    finally:
        db.close()
    pass
