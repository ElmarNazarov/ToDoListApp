import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Store user data dynamically
@pytest.fixture(scope="module")
def test_user():
    user_data = {"email": "testuser@example.com", "password": "password123"}
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    return response.json()

def test_login_user(test_user):
    login_data = {"email": "testuser@example.com", "password": "password123"}
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_user_info(test_user):
    # Использует токен из ответа на регистрацию
    headers = {"Authorization": f"Bearer {test_user['access_token']}"}
    response = client.get("/auth/if_user", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@example.com"
