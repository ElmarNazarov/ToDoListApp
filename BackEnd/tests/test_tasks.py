import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Новый пользователь
@pytest.fixture(scope="module")
def test_user():
    user_data = {"email": "testuser@example.com", "password": "password123"}
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    return response.json()

# Тестовая задача
@pytest.fixture(scope="module")
def test_task(test_user):
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "new",
        "deadline": "2025-03-15T17:03:00",
        "owner_id": test_user["user"]["id"]
    }
    response = client.post("/tasks/", json=task_data, headers=headers)
    assert response.status_code == 200
    return response.json()

# Все задачи
def test_get_tasks(test_user):
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    response = client.get("/tasks/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Задачи по пользователю
def test_get_tasks_by_user(test_user):
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    user_id = test_user["user"]["id"]
    response = client.get(f"/tasks/user/{user_id}", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Обновление задачи
def test_update_task(test_user, test_task):
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    task_data = {
        "title": "Updated Task",
        "description": "Updated description",
        "status": "in_progress",
        "deadline": "2025-03-20T12:00:00",
        "owner_id": test_user["user"]["id"]
    }
    response = client.put(f"/tasks/{test_task['id']}", json=task_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Task"

# Test deleting a task
def test_delete_task(test_user, test_task):
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    response = client.delete(f"/tasks/{test_task['id']}", headers=headers)
    assert response.status_code == 200
