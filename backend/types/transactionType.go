package types

type TransactionType string

const (
	TransactionTypeCredit      TransactionType = "CREDIT"
	TransactionTypeDebit       TransactionType = "DEBIT"
	TransactionTypeInt         TransactionType = "INT"
	TransactionTypeDiv         TransactionType = "DIV"
	TransactionTypeFee         TransactionType = "FEE"
	TransactionTypeSrvChg      TransactionType = "SRVCHG"
	TransactionTypeDep         TransactionType = "DEP"
	TransactionTypeAtm         TransactionType = "ATM"
	TransactionTypePos         TransactionType = "POS"
	TransactionTypeXfer        TransactionType = "XFER"
	TransactionTypeCheck       TransactionType = "CHECK"
	TransactionTypePayment     TransactionType = "PAYMENT"
	TransactionTypeCash        TransactionType = "CASH"
	TransactionTypeDirectDep   TransactionType = "DIRECTDEP"
	TransactionTypeDirectDebit TransactionType = "DIRECTDEBIT"
	TransactionTypeRepeatPmt   TransactionType = "REPEATPMT"
	TransactionTypeOther       TransactionType = "OTHER"
)

// IsValid checks if the transaction type is one of the valid types
func (t TransactionType) IsValid() bool {
	switch t {
	case TransactionTypeCredit, TransactionTypeDebit, TransactionTypeInt, TransactionTypeDiv,
		TransactionTypeFee, TransactionTypeSrvChg, TransactionTypeDep, TransactionTypeAtm,
		TransactionTypePos, TransactionTypeXfer, TransactionTypeCheck, TransactionTypePayment,
		TransactionTypeCash, TransactionTypeDirectDep, TransactionTypeDirectDebit,
		TransactionTypeRepeatPmt, TransactionTypeOther:
		return true
	default:
		return false
	}
}

// String returns the string representation of the transaction type
func (t TransactionType) String() string {
	return string(t)
}

// String returns the string representation of the transaction type
func (t TransactionType) OrEmpty() TransactionType {
	switch t {
	case TransactionTypeCredit, TransactionTypeDebit, TransactionTypeInt, TransactionTypeDiv,
		TransactionTypeFee, TransactionTypeSrvChg, TransactionTypeDep, TransactionTypeAtm,
		TransactionTypePos, TransactionTypeXfer, TransactionTypeCheck, TransactionTypePayment,
		TransactionTypeCash, TransactionTypeDirectDep, TransactionTypeDirectDebit,
		TransactionTypeRepeatPmt, TransactionTypeOther:
		return t
	default:
		return ""
	}
}
