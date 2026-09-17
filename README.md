# Expense Ledger & Payment Service

A production-ready microservice engineered with FastAPI and SQLite. Provides row-level tenant isolation, retry-safe write operations, actionable validation feedback, and automated test coverage.

**Live Service URL:** https://expense-ledger-service.vercel.app  
**Interactive Documentation:** https://expense-ledger-service.vercel.app/docs

---

## Data Model & Architecture

### Payments Table

```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipient TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, idempotency_key)
);
```

**Purpose:** Append-only ledger for all transactions  
**user_id:** Maps to tenant credentials (token_user_1, token_user_2, etc.)  
**Relationships:** 1-to-many between tenant and transaction history

---

## Constraints & System Invariants

| Constraint | Type | Prevention |
|:---|:---|:---|
| `UNIQUE(user_id, idempotency_key)` | Composite Unique Constraint | Prevents duplicate mutations from retries or double-submissions |
| `user_id NOT NULL` | Column Invariant | Prevents orphan records without tenant ownership |
| `id PRIMARY KEY AUTOINCREMENT` | Primary Key | Guarantees sequential identity across transactions |
| `PRAGMA foreign_keys = ON;` | Database Integrity | Ensures relational consistency |

---

## Query Optimization

### Recommended Index

```sql
CREATE INDEX idx_payments_user_id_id_desc ON payments(user_id, id DESC);
```

### High-Load Query

```sql
SELECT id, recipient, amount, currency, idempotency_key, created_at 
FROM payments 
WHERE user_id = ? 
ORDER BY id DESC;
```

**Without Index:** Full table scan + in-memory sort  
**With Index:** `O(log N + K)` indexed search

---

## Scalability at 10x Traffic

### Bottlenecks & Solutions

**Unbounded List Query**
- Problem: Memory exhaustion, network latency
- Solution: Enforce cursor-based pagination (limit=50, starting_after=<id>)

**File Lock Contention**
- Problem: SQLite file-level locking during writes blocks concurrent requests
- Solution: Migrate to PostgreSQL with PgBouncer connection pooling

---

## API Endpoints

| Method | Endpoint | Auth | Headers | Status Codes | Description |
|:---|:---|:---|:---|:---|:---|
| GET | / | No | None | 200 OK | Service status ping |
| GET | /health | No | None | 200 OK | Health check |
| POST | /payments | Yes | Authorization, Idempotency-Key | 201 Created, 200 OK, 400 Bad Request, 401 Unauthorized | Create payment or return existing |
| GET | /payments | Yes | Authorization | 200 OK, 401 Unauthorized | Retrieve all user payments |
| GET | /payments/{id} | Yes | Authorization | 200 OK, 401 Unauthorized, 404 Not Found | Retrieve specific payment |

---

## Test Credentials

```
User 1: Authorization: Bearer token_user_1
User 2: Authorization: Bearer token_user_2
```

**Supported Currencies:** USD, EUR, GBP, PKR

---

## Local Development & Testing

### Clone Repository

```bash
git clone https://github.com/abdullah-ali-338/expense-ledger-service.git
cd expense-ledger-service
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Automated Tests

```bash
python -m pytest test_service.py
```

### Run Local Development Server

```bash
python -m uvicorn main:app --reload --port 8000
```

---

## Example Requests

### Create Payment

```bash
curl -X POST https://expense-ledger-service.vercel.app/payments \
  -H "Authorization: Bearer token_user_1" \
  -H "Idempotency-Key: unique-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "john@example.com",
    "amount": 50.00,
    "currency": "USD"
  }'
```

### Get All Payments

```bash
curl -X GET https://expense-ledger-service.vercel.app/payments \
  -H "Authorization: Bearer token_user_1"
```

### Get Specific Payment

```bash
curl -X GET https://expense-ledger-service.vercel.app/payments/1 \
  -H "Authorization: Bearer token_user_1"
```
