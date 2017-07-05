package db

import (
	"fmt"
	"strings"
)

func stringQueryArgsList(strArgs []string) (query string, iArgs []interface{}) {
	queryFields := []string{}
	for i := range strArgs {
		queryFields = append(queryFields, fmt.Sprintf("$%d", i+1))
	}
	query = strings.Join(queryFields, ", ")

	iArgs = make([]interface{}, len(strArgs)) // https://golang.org/doc/faq#convert_slice_of_interface
	for i, v := range strArgs {
		iArgs[i] = v
	}
	return
}
