package types

import "errors"

var (
	ErrorParsingFile       = errors.New("Error parsing file")
	ErrorSavingFileSource  = errors.New("Error saving file source")
	ErrorSavingTransaction = errors.New("Error saving transaction")
	ErrorSavingStatement   = errors.New("Error saving statement")
	ErrorSavingYields      = errors.New("Error saving yields")
	ErrorSavingBank        = errors.New("Error saving bank")

	InvalidOfx         = errors.New("Invalid File format")
	InvalidValue       = errors.New("Invalid value")
	InvalidType        = errors.New("Invalid type")
	InvalidAccountType = errors.New("Invalid AccountType")
	InvalidObject      = errors.New("Invalid object")
)
