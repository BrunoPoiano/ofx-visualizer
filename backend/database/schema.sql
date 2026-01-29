CREATE TABLE IF NOT EXISTS balances (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    statement_id   INTEGER NOT NULL,
    name           TEXT NOT NULL,
    description    TEXT,
    balance_type   TEXT NOT NULL,
    value          REAL NOT NULL,
    FOREIGN KEY (statement_id) REFERENCES Statements(id)
);

CREATE TABLE IF NOT EXISTS banks (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    account_id     TEXT NOT NULL,
    account_type   TEXT NOT NULL,
    f_id           TEXT NOT NULL,
    bank_id        TEXT NOT NULL,
    branch_id      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id     TEXT NOT NULL,
    name           TEXT NOT NULL,
    f_id           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id             STRING PRIMARY KEY,
    source_id      INTEGER NOT NULL,
    date           TEXT NOT NULL,
    value          REAL NOT NULL,
    type           TEXT NOT NULL,
    desc           TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES Source(id)
);
CREATE INDEX IF NOT EXISTS idx_source_id ON transactions (source_id, id);

CREATE TABLE IF NOT EXISTS source (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id        INTEGER,
    bank_id        INTEGER,
    FOREIGN KEY (bank_id) REFERENCES Banks(id),
    FOREIGN KEY (card_id) REFERENCES Cards(id)
);

CREATE TABLE IF NOT EXISTS statements (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id      INTEGER NOT NULL,
    start_date     TEXT NOT NULL,
    end_date       TEXT NOT NULL,
    ledger_balance REAL NOT NULL,
    balance_date   TEXT NOT NULL,
    server_date    TEXT NOT NULL,
    language       TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES Source(id)
);
CREATE INDEX IF NOT EXISTS idx_start_end_date ON statements (source_id, start_date,end_date);
