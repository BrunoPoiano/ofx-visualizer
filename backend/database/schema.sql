CREATE TABLE IF NOT EXISTS balances (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    statement_id   INTEGER,
    name           STRING NOT NULL,
    description    TEXT,
    balance_type   STRING NOT NULL,
    value          REAL NOT NULL,
    FOREIGN KEY (statement_id) REFERENCES Statements(id)
);

CREATE TABLE IF NOT EXISTS banks (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           STRING NOT NULL,
    account_id     STRING NOT NULL,
    account_type   STRING NOT NULL,
    f_id           STRING NOT NULL,
    bank_id        STRING NOT NULL,
    branch_id      STRING NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id     STRING NOT NULL,
    name           STRING NOT NULL,
    f_id           STRING NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id             STRING PRIMARY KEY,
    source_id      INTEGER NOT NULL,
    date           STRING NOT NULL,
    value          REAL NOT NULL,
    type           STRING,
    desc           TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES Source(id)
);

CREATE TABLE IF NOT EXISTS source (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id        INTEGER NULLABLE,
    bank_id        INTEGER NULLABLE,
    FOREIGN KEY (bank_id) REFERENCES Banks(id),
    FOREIGN KEY (card_id) REFERENCES Cards(id)
);

CREATE TABLE IF NOT EXISTS statements (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id      INTEGER,
    start_date     STRING NOT NULL,
    end_date       STRING NOT NULL,
    ledger_balance REAL NOT NULL,
    balance_date   STRING NOT NULL,
    server_date    STRING NOT NULL,
    language       STRING NOT NULL,
    FOREIGN KEY (source_id) REFERENCES Source(id)
);
