package ui

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

// ProxyHandler handles displaying the basics of the user interface
type ProxyHandler struct {
	contentCache []byte
}

// NewProxyHandler creates a new proxy handler for the data at the given URL
func NewProxyHandler(proxyURL string, contentReplacements map[string]string) (*ProxyHandler, error) {
	response, err := http.Get(proxyURL)
	if err == nil && response.StatusCode != http.StatusOK {
		err = fmt.Errorf("Error setting up proxy for `%s`: %s", proxyURL, response.Status)
	}
	if err != nil {
		return nil, err
	}

	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	if len(contentReplacements) > 0 {
		strData := string(data)
		for k, v := range contentReplacements {
			strData = strings.Replace(strData, k, v, -1)
		}
		data = []byte(strData)
	}

	return &ProxyHandler{data}, nil
}

func (h ProxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write(h.contentCache)
}
