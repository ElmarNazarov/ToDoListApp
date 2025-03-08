from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Используйте PostgreSQL, если не проводите тестирование, в противном случае используйте SQLite
if settings.IS_TESTING:
    DATABASE_URL = "sqlite:///./test.db"  # SQLite
else:
    DATABASE_URL = settings.DATABASE_URL  # PostgreSQL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
