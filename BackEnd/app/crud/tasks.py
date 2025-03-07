from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models import Task, TaskStatus, User
from app.schemas import TaskCreate
from app.utils.id import generate_unique_id
from typing import List

def create_task(db: Session, title: str, description: str, status: TaskStatus, deadline, owner_id: str) -> Task:
    # Проверка существует ли пользователь
    user = db.query(User).filter(User.id == owner_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_task = Task.create(db, title=title, description=description, status=status, deadline=deadline, owner_id=owner_id)
    return new_task

def get_all_tasks(db: Session) -> List[Task]:
    return db.query(Task).all()

def get_tasks_by_user(db: Session, user_id: str) -> List[Task]:
    return db.query(Task).filter(Task.owner_id == user_id).all()

def update_task(db: Session, task_id: str, task_data: TaskCreate) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")
    
    for key, value in task_data.model_dump().items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена")

    db.delete(task)
    db.commit()
    return {"message": "Задача удалена"}
