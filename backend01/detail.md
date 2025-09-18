## System Diagrams for backend01

This document contains system diagrams (sequence and ER diagrams) in Mermaid format describing the main authentication flows and data model for the `backend01` service.

### Sequence Diagram — Register and Login

```mermaid
sequenceDiagram
    participant Browser as User (Browser)
    participant Frontend as Static HTML
    participant Server as backend01 (Go)
    participant Middleware as Auth Middleware
    participant DB as SQLite (auth.db)

    Note over Browser,Frontend: User opens `register.html`
    Browser->>Frontend: GET /register (static file)
    Frontend->>Browser: HTML form (username, password)

    Note over Browser,Server: User submits registration
    Browser->>Server: POST /register {username, password}
    Server->>Middleware: validate request (e.g., content-type, CSRF)
    Middleware->>Server: validated
    Server->>DB: INSERT users (username, password_hash, created_at)
    DB-->>Server: success (id)
    Server-->>Browser: 201 Created / redirect to login

    Note over Browser,Frontend: User opens `login.html`
    Browser->>Frontend: GET /login
    Frontend->>Browser: HTML form (username, password)

    Note over Browser,Server: User submits login
    Browser->>Server: POST /login {username, password}
    Server->>DB: SELECT users WHERE username = ?
    DB-->>Server: user row (id, password_hash)
    Server->>Server: compare password with password_hash
    alt credentials valid
        Server->>DB: INSERT sessions/tokens (user_id, token, expires_at)
        DB-->>Server: success
        Server->>Browser: Set-Cookie session=token HttpOnly
        Browser-->>Server: subsequent requests with cookie
    else invalid
        Server-->>Browser: 401 Unauthorized
    end

    Note over Browser,Server: Accessing protected endpoint
    Browser->>Server: GET /profile (cookie)
    Server->>Middleware: extract session cookie, lookup token
    Middleware->>DB: SELECT sessions WHERE token = ? AND expires_at > now
    DB-->>Middleware: session row (user_id)
    Middleware->>Server: attach user context
    Server-->>Browser: 200 OK with user data
```

### ER Diagram — Data Model

```mermaid
erDiagram
    USERS {
        integer id PK "primary key"
        string username "unique"
        string password_hash
        datetime created_at
    }

    SESSIONS {
        integer id PK
        integer user_id FK
        string token "indexed, HttpOnly cookie value"
        datetime created_at
        datetime expires_at
    }

    USERS ||--o{ SESSIONS : "has"

    %% Optional: if app stores roles or profiles
    ROLES {
        integer id PK
        string name
    }

    USER_ROLES {
        integer user_id FK
        integer role_id FK
    }

    USERS ||--o{ USER_ROLES : "assigned"
    ROLES ||--o{ USER_ROLES : "includes"
```

### Notes and mapping to repository

- Handlers: `auth.go` likely implements `/register` and `/login` endpoints.
- Models: `models.go` defines `User` and possibly `Session` structures.
- Database: `db.go` opens `auth.db` (SQLite) and performs CRUD.
- Middleware: `middleware.go` shows request validation and session extraction.
- Entrypoint: `main.go` wires routes, static files, and middleware.

You can render these diagrams in editors that support Mermaid (GitHub, VS Code with Mermaid preview, or mermaid.live).
