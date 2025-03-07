import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from main import app
from app.config import settings
import os


# Используйте PostgreSQL, если не проводите тестирование, в противном случае используйте SQLite
if settings.IS_TESTING:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # SQLite
else:
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")  # PostgreSQL

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# зависимость get_db
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Создание таблиц перед тестированием
@pytest.fixture(scope="module", autouse=True)
def create_test_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)