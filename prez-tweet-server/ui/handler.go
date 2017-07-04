package ui

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

// ProxyHandler handles displaying the basics of the user interface
type ProxyHandler struct {
	contentCache []byte
}

// NewProxyHandler creates a new proxy handler for the data at the given URL
func NewProxyHandler(proxyURL string) (*ProxyHandler, error) {
	response, err := http.Get(proxyURL)
	if response.StatusCode != http.StatusOK {
		err = fmt.Errorf("Error setting up proxy for `%s`: %s", proxyURL, response.Status)
	}
	if err != nil {
		return nil, err
	}

	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return &ProxyHandler{data}, nil
}

func (h ProxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write(h.contentCache)
}
