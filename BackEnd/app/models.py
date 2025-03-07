import datetime
import enum

from app.database import Base
from app.utils.id import generate_unique_id
from sqlalchemy import Column, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Session, relationship


class TaskStatus(str, enum.Enum):
    new = "new"
    in_progress = "in_progress"
    completed = "completed"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tasks = relationship("Task", back_populates="owner")

    @classmethod
    def create(cls, db: Session, email: str, hashed_password: str):
        new_user = cls(
            id=generate_unique_id(db, "users"),
            email=email,
            hashed_password=hashed_password,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(Enum(TaskStatus), default=TaskStatus.new)
    deadline = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(String, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tasks")

    @classmethod
    def create(cls, db: Session, title: str, description: str, status: TaskStatus, deadline: datetime.datetime, owner_id: str):
        new_task = cls(
            id=generate_unique_id(db, "tasks"),
            title=title,
            description=description,
            status=status,
            deadline=deadline,
            created_at=datetime.datetime.utcnow(),
            owner_id=owner_id,
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task
