import uuid
from sqlalchemy import text
from sqlalchemy.orm import Session

# Создание уникальных ID для баз данных
def generate_unique_id(db: Session, table_name: str, id_length: int = 10) -> str:
    while True:
        new_id = uuid.uuid4().hex[:id_length]
        query = text(f"SELECT id FROM {table_name} WHERE id = :id")
        result = db.execute(query, {"id": new_id}).fetchone()
        if not result:
            return new_id