# Fiber RESTful API Example

This project is a simple RESTful API built with Go Fiber. It exposes a single endpoint:

- `GET /` returns `{ "message": "hello world" }` as JSON.

## How to Run

1. Install dependencies:
   ```bash
   go mod tidy
   ```
2. Start the server:
   ```bash
   go run main.go
   ```

The API will be available at http://localhost:3000/

## Reference
- [Fiber Documentation](https://docs.gofiber.io/)
