from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import User
from app.utils.security import get_password_hash, verify_password, create_access_token
from typing import List

def register_user(db: Session, email: str, password: str) -> User:
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Адрес электронной почты уже зарегистрирован")
    new_user = User.create(db, email=email, hashed_password=get_password_hash(password))
    return new_user

def login_user(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверные учетные данные")

    access_token = create_access_token({"id": user.id, "sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

def get_all_users(db: Session) -> List[User]:
    return db.query(User).all()