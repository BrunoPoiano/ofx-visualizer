-- name: GetBalance :one
SELECT * FROM balances
WHERE id = ? LIMIT 1;

-- name: FindBalance :one
SELECT id FROM balances
WHERE statement_id = ? AND name = ? AND value = ?
LIMIT 1;

-- name: ListBalancess :many
SELECT * FROM balances
WHERE
    (
        @statement_id IS NOT 0
        AND statement_id = @statement_id
    )
    OR
    (
        @statement_id IS NULL
        AND (
            @search IS NULL
            OR name LIKE '%' || @search || '%'
        )
    )
ORDER BY
    CASE WHEN @order = 'name' AND @direction = 'asc'  THEN name END ASC,
    CASE WHEN @order = 'name' AND @direction = 'desc' THEN name END DESC,
    CASE WHEN @order = 'description' AND @direction = 'asc'  THEN description END ASC,
    CASE WHEN @order = 'description' AND @direction = 'desc' THEN description END DESC,
    CASE WHEN @order = 'balance_type' AND @direction = 'asc'  THEN balance_type END ASC,
    CASE WHEN @order = 'balance_type' AND @direction = 'desc' THEN balance_type END DESC,
    CASE WHEN @order = 'value' AND @direction = 'asc'  THEN value END ASC,
    CASE WHEN @order = 'value' AND @direction = 'desc' THEN value END DESC,
    CASE WHEN @order = 'statement_id' AND @direction = 'asc'  THEN statement_id END ASC,
    CASE WHEN @order = 'statement_id' AND @direction = 'desc' THEN statement_id END DESC,
    AND (:order IS NULL OR :order IS NOT NULL)
    AND (:direction IS NULL OR :direction IS NOT NULL)
LIMIT @limit OFFSET @offset;


-- name: CountListBalancess :one
SELECT count(id) FROM balances
WHERE
    (
        @statement_id IS NOT NULL
        AND statement_id = @statement_id
    )
    OR
    (
        @statement_id IS NULL
        AND (
            @search IS NULL
            OR name LIKE '%' || @search || '%'
        )
    )
ORDER BY
    CASE WHEN @order = 'name' AND @direction = 'asc'  THEN name END ASC,
    CASE WHEN @order = 'name' AND @direction = 'desc' THEN name END DESC,
    CASE WHEN @order = 'description' AND @direction = 'asc'  THEN description END ASC,
    CASE WHEN @order = 'description' AND @direction = 'desc' THEN description END DESC,
    CASE WHEN @order = 'balance_type' AND @direction = 'asc'  THEN balance_type END ASC,
    CASE WHEN @order = 'balance_type' AND @direction = 'desc' THEN balance_type END DESC,
    CASE WHEN @order = 'value' AND @direction = 'asc'  THEN value END ASC,
    CASE WHEN @order = 'value' AND @direction = 'desc' THEN value END DESC,
    CASE WHEN @order = 'statement_id' AND @direction = 'asc'  THEN statement_id END ASC,
    CASE WHEN @order = 'statement_id' AND @direction = 'desc' THEN statement_id END DESC
LIMIT @limit OFFSET @offset;




-- name: CreateBalance :one
INSERT INTO balances (
statement_id,name,description,balance_type,value
) VALUES (
  ?, ?,?,?,?
)
RETURNING *;

-- name: UpdateBalance :exec
UPDATE balances
set statement_id = ?,name = ?,description = ?,balance_type = ?,value = ?
WHERE id = ?;

-- name: DeleteBalance :exec
DELETE FROM balances
WHERE id = ?;

---------------------- BANKS
-- name: GetBank :one
SELECT * FROM banks
WHERE id = ? LIMIT 1;

-- name: GetBankByAccountId :one
SELECT * FROM banks
WHERE account_id = ? LIMIT 1;

-- name: CountBanks :one
SELECT count(id)
FROM banks
WHERE (
    @query IS NULL
    OR name      LIKE '%' || @query || '%'
    OR account_id  LIKE '%' || @query || '%'
    OR account_type  LIKE '%' || @query || '%'
    OR f_id  LIKE '%' || @query || '%'
    OR bank_id  LIKE '%' || @query || '%'
    OR branch_id  LIKE '%' || @query || '%'
)
ORDER BY id;

-- name: ListBanks :many
SELECT *
FROM banks
WHERE (
    :search IS NULL
    OR name         LIKE '%' || :search || '%'
    OR account_id   LIKE '%' || :search || '%'
    OR account_type LIKE '%' || :search || '%'
    OR f_id         LIKE '%' || :search || '%'
    OR bank_id      LIKE '%' || :search || '%'
    OR branch_id    LIKE '%' || :search || '%'
    AND (:order IS NULL OR :order IS NOT NULL)
    AND (:direction IS NULL OR :direction IS NOT NULL)
)
ORDER BY
    CASE WHEN :order = 'name' AND :direction = 'asc'  THEN name END ASC,
    CASE WHEN :order = 'name' AND :direction = 'desc' THEN name END DESC
LIMIT :limit OFFSET :offset;

-- name: CreateBank :one
INSERT INTO banks (
name,account_id,account_type,f_id,bank_id,branch_id
) VALUES (
  ?, ?,?,?,?,?
)
RETURNING *;

-- name: UpdateBank :exec
UPDATE banks
set name = ?,account_id = ?,account_type = ?,f_id = ?,bank_id = ?,branch_id =?
WHERE id = ?;

-- name: DeleteBank :exec
DELETE FROM banks
WHERE id = ?;


---------------------- Cards

-- name: GetCard :one
SELECT * FROM cards
WHERE id = ? LIMIT 1;

-- name: GetCardByAccountId :one
SELECT id FROM cards
WHERE account_id = ? LIMIT 1;

-- name: ListCards :many
SELECT * FROM cards
ORDER BY name;

-- name: CreateCard :one
INSERT INTO cards (
name,account_id,f_id
) VALUES (
  ?, ?,?
)
RETURNING *;

-- name: UpdateCard :exec
UPDATE cards
set name =?,account_id =?,f_id =?
WHERE id = ?;

-- name: DeleteCard :exec
DELETE FROM cards
WHERE id = ?;


---------------------- Transactions

-- name: GetTransaction :one
SELECT * FROM transactions
WHERE id = ? LIMIT 1;

-- name: ListTransactions :many
SELECT * FROM transactions
ORDER BY date DESC;

-- name: CreateTransaction :one
INSERT INTO transactions (
id,source_id,date,value,type,desc
) VALUES (
  ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateTransaction :exec
UPDATE transactions
SET source_id = ?,date = ?,value = ?,type = ?,desc = ?
WHERE id = ?;

-- name: DeleteTransaction :exec
DELETE FROM transactions
WHERE id = ?;


---------------------- Source

-- name: GetSource :one
SELECT * FROM source
WHERE id = ? LIMIT 1;


-- name: FindSource :one
SELECT id
FROM source
WHERE (bank_id = ?1 AND card_id = 0)
   OR (bank_id = 0 AND card_id = ?2)
LIMIT 1;

-- name: CreateSource :one
INSERT INTO source (
card_id,bank_id
) VALUES (
  ?, ?
)
RETURNING *;

-- name: UpdateSource :exec
UPDATE source
SET card_id = ?,bank_id = ?
WHERE id = ?;

-- name: DeleteSource :exec
DELETE FROM source
WHERE id = ?;


---------------------- Statements

-- name: GetStatement :one
SELECT * FROM statements
WHERE id = ? LIMIT 1;

-- name: ListStatements :many
SELECT * FROM statements
ORDER BY start_date DESC;

-- name: CreateStatement :one
INSERT INTO statements (
source_id,start_date,end_date,ledger_balance,balance_date,server_date,language
) VALUES (
  ?, ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateStatement :exec
UPDATE statements
SET source_id = ?,start_date = ?,end_date = ?,ledger_balance = ?,balance_date = ?,server_date = ?,language = ?
WHERE id = ?;

-- name: DeleteStatement :exec
DELETE FROM statements
WHERE id = ?;
