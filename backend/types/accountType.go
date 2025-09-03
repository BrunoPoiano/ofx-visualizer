package types

type AccountType string

const (
	AccountTypeChecking   AccountType = "CHECKING"
	AccountTypeSavings    AccountType = "SAVINGS"
	AccountTypeMoneyMrkt  AccountType = "MONEYMRKT"
	AccountTypeCreditLine AccountType = "CREDITLINE"
	AccountTypeCma        AccountType = "CMA"
)

// IsValid checks if the Account type is one of the valid types
func (t AccountType) IsValid() bool {
	switch t {
	case AccountTypeChecking, AccountTypeSavings, AccountTypeMoneyMrkt, AccountTypeCreditLine,
		AccountTypeCma:
		return true
	default:
		return false
	}
}

// String returns the string representation of the Account type
func (t AccountType) String() string {
	return string(t)
}

// String returns the string representation of the Account type
func (t AccountType) OrEmpty() AccountType {
	switch t {
	case AccountTypeChecking, AccountTypeSavings, AccountTypeMoneyMrkt, AccountTypeCreditLine,
		AccountTypeCma:
		return t
	default:
		return ""
	}
}
