from pydantic import BaseModel, EmailStr, ConfigDict
import datetime
from enum import Enum

class TaskStatus(str, Enum):
    new = "new"
    in_progress = "in_progress"
    completed = "completed"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class TaskCreate(BaseModel):
    title: str
    description: str
    status: TaskStatus = TaskStatus.new
    deadline: datetime.datetime
    owner_id: str

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    status: TaskStatus
    deadline: datetime.datetime
    owner_id: str
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
