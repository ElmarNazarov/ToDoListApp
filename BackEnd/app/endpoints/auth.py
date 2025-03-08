from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.auth import *
from app.schemas import UserCreate, UserResponse
from app.utils.security import get_current_user
from app.crud.users import get_user_by_id


router = APIRouter()

# Эндпоинт для регистрации
@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_data.email, user_data.password)
    access_token = create_access_token({"id": user.id, "sub": user.email})
    return {"access_token": access_token, "user": user}

# Эндпоинт для входа в систему
@router.post("/login")
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    return login_user(db, user_data.email, user_data.password)

# Эндпоинт для получения пользователей из базы данных
@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return get_all_users(db)

# Эндпоинт для получения инфы о пользователе если он залогинен
@router.get("/if_user", response_model=UserResponse)
def get_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = get_user_by_id(db, current_user["id"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    return user