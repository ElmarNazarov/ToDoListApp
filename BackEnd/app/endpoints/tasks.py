from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.tasks import create_task, get_all_tasks, get_tasks_by_user, update_task, delete_task
from app.schemas import TaskCreate, TaskResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=TaskResponse)
def create(task_data: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, task_data.title, task_data.description, task_data.status, task_data.deadline, task_data.owner_id)

@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return get_all_tasks(db)

@router.get("/user/{user_id}", response_model=List[TaskResponse])
def get_user_tasks(user_id: str, db: Session = Depends(get_db)):
    return get_tasks_by_user(db, user_id)

@router.put("/{task_id}", response_model=TaskResponse)
def update(task_id: str, task_data: TaskCreate, db: Session = Depends(get_db)):
    return update_task(db, task_id, task_data)

@router.delete("/{task_id}")
def delete(task_id: str, db: Session = Depends(get_db)):
    return delete_task(db, task_id)
