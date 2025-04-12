# Backend Tests

This directory contains tests for the CoverLetter AI backend API.

## Test Structure

- `conftest.py`: Contains common fixtures used across tests
- `utils.py`: Contains utility functions for tests
- `test_auth.py`: Tests for authentication endpoints
- `test_experience_api.py`: Tests for experience management endpoints
- `test_skills_api.py`: Tests for skills management endpoints

## Requirements

To run the tests, you need to install the testing dependencies:

```bash
pip install pytest pytest-cov httpx
```

## Running Tests

From the root of the backend directory, run:

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=. --cov-report=term-missing

# Run a specific test file
pytest tests/test_experience_api.py

# Run a specific test function
pytest tests/test_experience_api.py::test_create_experience

# Run with verbose output
pytest -v
```

## Test Database

The tests use an in-memory SQLite database instead of the production database to ensure tests don't affect production data and to make tests faster. This is configured in the `conftest.py` file.

## Authentication Mocking

The tests mock the Firebase authentication to avoid making actual calls to Firebase during testing. This is done using the `monkeypatch` fixture from pytest.

## Adding New Tests

When adding new tests:

1. Create a new test file in the `tests` directory
2. Import necessary fixtures from `conftest.py`
3. Use the utility functions from `utils.py` when possible
4. Follow the naming convention: `test_*.py` for test files and `test_*` for test functions
5. Group related tests in the same file

## Continuous Integration

The tests are automatically run in the CI pipeline when changes are pushed to the repository. This ensures that changes don't break existing functionality. 