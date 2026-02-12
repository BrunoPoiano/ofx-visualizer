CREATE TABLE IF NOT EXISTS banks (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL,
    account_id     TEXT NOT NULL,
    account_type   TEXT NOT NULL,
    f_id           TEXT NOT NULL,
    bank_id        TEXT NOT NULL,
    branch_id      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cards (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id     TEXT NOT NULL,
    name           TEXT NOT NULL,
    f_id           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS source (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id        INTEGER,
    bank_id        INTEGER,
    FOREIGN KEY (bank_id) REFERENCES Banks(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES Cards(id) ON DELETE CASCADE
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
    FOREIGN KEY (source_id) REFERENCES Source(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS balances (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    statement_id   INTEGER NOT NULL,
    name           TEXT NOT NULL,
    description    TEXT,
    balance_type   TEXT NOT NULL,
    value          REAL NOT NULL,
    FOREIGN KEY (statement_id) REFERENCES Statements(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id             TEXT PRIMARY KEY,
    source_id      INTEGER NOT NULL,
    date           TEXT NOT NULL,
    value          REAL NOT NULL,
    type           TEXT NOT NULL,
    desc           TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES Source(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_statements_source_date_range ON statements (source_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_statements_source_id ON statements (source_id);

CREATE INDEX IF NOT EXISTS idx_transactions_source_id ON transactions (source_id);
CREATE INDEX IF NOT EXISTS idx_transactions_source_date ON transactions (source_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_desc_prefix ON transactions (source_id, desc);

CREATE INDEX IF NOT EXISTS idx_balances_statement_id ON balances (statement_id);
CREATE INDEX IF NOT EXISTS idx_balances_name_prefix ON balances (statement_id, name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_balances_identity ON balances (statement_id, name, balance_type);

CREATE INDEX IF NOT EXISTS idx_source_bank_id ON source (bank_id);
CREATE INDEX IF NOT EXISTS idx_source_card_id ON source (card_id);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

CREATE UNIQUE INDEX IF NOT EXISTS idx_banks_identity ON banks (f_id, bank_id, branch_id, account_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_identity ON cards (f_id, account_id);
