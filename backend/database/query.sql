-- Balances
-- name: FindBalance :one
SELECT id FROM balances
WHERE statement_id = ? AND name = ? AND value = ?
LIMIT 1;

-- name: ListBalancesByStatementId :many
SELECT * FROM balances
WHERE statement_id = :statement_id;

-- name: CountBalances :one
SELECT count(id) FROM balances
WHERE
    (
        :statement_id IS NOT NULL
        AND statement_id = :statement_id
    )
    OR
    (
        :statement_id IS NULL
        AND (
            :search IS NULL
            OR name LIKE '%' || :search || '%'
        )
    );

-- name: CreateBalance :one
INSERT INTO balances (
    statement_id, name, description, balance_type, value
) VALUES (
    ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateBalance :exec
UPDATE balances
SET statement_id = ?, name = ?, description = ?, balance_type = ?, value = ?
WHERE id = ?;

-- name: DeleteBalance :exec
DELETE FROM balances
WHERE id = ?;

-- Banks
-- name: GetBank :one
SELECT * FROM banks
WHERE id = ? LIMIT 1;

-- name: GetBankIdByAccountId :one
SELECT id FROM banks
WHERE account_id = ? LIMIT 1;

-- name: CountBanks :one
SELECT count(id)
FROM banks
WHERE (
    :search IS NULL
    OR name LIKE '%' || :search || '%'
    OR account_id LIKE '%' || :search || '%'
    OR account_type LIKE '%' || :search || '%'
    OR f_id LIKE '%' || :search || '%'
    OR bank_id LIKE '%' || :search || '%'
    OR branch_id LIKE '%' || :search || '%'
);

-- name: ListBanks :many
SELECT *
FROM banks
WHERE (
    :search IS NULL
    OR name LIKE '%' || :search || '%'
    OR account_id LIKE '%' || :search || '%'
    OR account_type LIKE '%' || :search || '%'
    OR f_id LIKE '%' || :search || '%'
    OR bank_id LIKE '%' || :search || '%'
    OR branch_id LIKE '%' || :search || '%'
)
ORDER BY id DESC
LIMIT :limit OFFSET :offset;

-- name: CreateBank :one
INSERT INTO banks (
    name, account_id, account_type, f_id, bank_id, branch_id
) VALUES (
    ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateBankName :exec
UPDATE banks
SET name = ?
WHERE id = ?;

-- name: DeleteBank :exec
DELETE FROM banks
WHERE id = ?;

-- Cards
-- name: GetCard :one
SELECT * FROM cards
WHERE id = ? LIMIT 1;

-- name: GetCardIdByAccountId :one
SELECT id FROM cards
WHERE account_id = :account_id LIMIT 1;

-- name: CreateCard :one
INSERT INTO cards (
    name, account_id, f_id
) VALUES (
    ?, ?, ?
)
RETURNING *;

-- name: UpdateCard :exec
UPDATE cards
SET name = ?, account_id = ?, f_id = ?
WHERE id = ?;

-- name: DeleteCard :exec
DELETE FROM cards
WHERE id = ?;

-- Transactions
-- name: GetTransaction :one
SELECT * FROM transactions
WHERE id = :id LIMIT 1;

-- name: CheckTransaction :one
SELECT count(id) FROM transactions
WHERE id = :id LIMIT 1;

-- name: ListTransactions :many
SELECT *
FROM transactions
WHERE source_id = :source_id
AND (
    :search IS NULL
    OR date LIKE '%' || :search || '%'
    OR "desc" LIKE '%' || :search || '%'
)
AND (
    :searchType IS NULL
    OR type LIKE '%' || :searchType || '%'
)
AND (
    :searchMaxValue IS NULL
    OR value <= :searchMaxValue
)
AND (
    :searchMinValue IS NULL
    OR value >= :searchMinValue
)
AND (
    :searchFrom IS NULL
    OR date >= :searchFrom
)
AND (
    :searchTo IS NULL
    OR date <= :searchTo
)
ORDER BY date DESC
LIMIT :limit OFFSET :offset;

-- name: CountTransactions :one
SELECT count(id)
FROM transactions
WHERE source_id = :source_id
AND (
    :search IS NULL
    OR date LIKE '%' || :search || '%'
    OR "desc" LIKE '%' || :search || '%'
)
AND (
    :searchType IS NULL
    OR type LIKE '%' || :searchType || '%'
)
AND (
    :searchMaxValue IS NULL
    OR value <= :searchMaxValue
)
AND (
    :searchMinValue IS NULL
    OR value >= :searchMinValue
)
AND (
    :searchFrom IS NULL
    OR date >= :searchFrom
)
AND (
    :searchTo IS NULL
    OR date <= :searchTo
);

-- name: TransactionsInfo :one
SELECT
    COALESCE(SUM(CASE WHEN value > ? THEN value ELSE 0 END), 0) AS positive,
    COALESCE(SUM(CASE WHEN value < ? THEN value ELSE 0 END), 0) AS negative,
    COALESCE(SUM(value), 0) AS value
FROM transactions
WHERE source_id = ?
LIMIT 1;

-- name: CreateTransaction :one
INSERT INTO transactions (
    id, source_id, date, value, type, desc
) VALUES (
    ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateTransaction :exec
UPDATE transactions
SET source_id = ?, date = ?, value = ?, type = ?, desc = ?
WHERE id = ?;

-- name: DeleteTransaction :exec
DELETE FROM transactions
WHERE id = ?;

-- Source
-- name: GetSources :many
SELECT source.id, cards.name
FROM source
JOIN cards ON cards.id = source.card_id
UNION ALL
SELECT source.id, banks.name
FROM source
JOIN banks ON banks.id = source.bank_id;

-- name: FindSource :one
SELECT id
FROM source
WHERE (bank_id = :bank_id AND card_id IS NULL)
   OR (bank_id IS NULL AND card_id = :card_id)
LIMIT 1;

-- name: GetSource :one
SELECT *
FROM source
WHERE id = :id
LIMIT 1;

-- name: CreateSource :one
INSERT INTO source (
    card_id, bank_id
) VALUES (
    ?, ?
)
RETURNING *;

-- name: UpdateSource :exec
UPDATE source
SET bank_id = ?, card_id = ?
WHERE id = ?;

-- name: DeleteSource :exec
DELETE FROM source
WHERE id = ?;

-- Statements
-- name: GetStatement :one
SELECT id FROM statements
WHERE start_date = ? AND end_date = ? AND ledger_balance = ?
LIMIT 1;

-- name: CheckStatement :one
SELECT count(id) FROM statements
WHERE id = :id LIMIT 1;

-- name: ListStatements :many
SELECT * FROM statements
WHERE source_id = :source_id
AND (
    :search IS NULL
    OR balance_date LIKE '%' || :search || '%'
    OR server_date LIKE '%' || :search || '%'
    OR language LIKE '%' || :search || '%'
)
AND (
    :searchMaxValue IS NULL
    OR ledger_balance <= :searchMaxValue
)
AND (
    :searchMinValue IS NULL
    OR ledger_balance >= :searchMinValue
)
AND (
    :searchFrom IS NULL
    OR start_date >= :searchFrom
)
AND (
    :searchTo IS NULL
    OR start_date <= :searchTo
)
ORDER BY start_date DESC
LIMIT :limit OFFSET :offset;

-- name: CountStatements :one
SELECT count(id) FROM statements
WHERE source_id = :source_id
AND (
    :search IS NULL
    OR balance_date LIKE '%' || :search || '%'
    OR server_date LIKE '%' || :search || '%'
    OR language LIKE '%' || :search || '%'
)
AND (
    :searchMaxValue IS NULL
    OR ledger_balance <= :searchMaxValue
)
AND (
    :searchMinValue IS NULL
    OR ledger_balance >= :searchMinValue
)
AND (
    :searchFrom IS NULL
    OR start_date >= :searchFrom
)
AND (
    :searchTo IS NULL
    OR start_date <= :searchTo
);

-- name: GetLargestBalanceQuery :one
SELECT *
FROM statements
WHERE source_id = ?
ORDER BY ledger_balance DESC
LIMIT 1;

-- name: GetCurrentBalanceQuery :one
SELECT *
FROM statements
WHERE source_id = ?
ORDER BY balance_date DESC
LIMIT 1;

-- name: CreateStatement :one
INSERT INTO statements (
    source_id, start_date, end_date, ledger_balance, balance_date, server_date, language
) VALUES (
    ?, ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateStatement :exec
UPDATE statements
SET source_id = ?, start_date = ?, end_date = ?, ledger_balance = ?, balance_date = ?, server_date = ?, language = ?
WHERE id = ?;

-- name: DeleteStatement :exec
DELETE FROM statements
WHERE id = ?;
