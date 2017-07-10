package ui

import (
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/fsufitch/prez-tweet/prez-tweet-server/util"
	"github.com/gorilla/mux"
)

// ProxyHandler handles displaying the basics of the user interface
type ProxyHandler struct {
	apiHost   string
	targetURL string
	cache     *proxyCacheMap
}

// NewProxyHandler creates a new proxy handler for a given URL target and TTL
func NewProxyHandler(apiHost string, target string, cacheTTL time.Duration) *ProxyHandler {
	return &ProxyHandler{
		apiHost:   apiHost,
		targetURL: target,
		cache:     newProxyCacheMap(cacheTTL),
	}
}

func (h ProxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	filename, _ := mux.Vars(r)["filename"]

	if filename == "" {
		filename = "index.html"
	}

	cacheEntry, cacheHit := h.cache.Get(filename)
	if !cacheHit {
		if data, contentType, err := h.fetchProxiedFile(filename); err == nil {
			cacheEntry = h.cache.Set(filename, data, contentType)
		} else {
			cacheEntry = h.cache.SetError(filename, err)
		}
	}

	if cacheEntry.Error == nil {
		w.Header().Set("Content-Type", cacheEntry.ContentType)
		w.WriteHeader(200)
		w.Write(cacheEntry.Data)
		return
	}

	if cacheEntry.Error == errProxiedFileNotFound {
		util.WriteHTTPErrorResponse(w, 404, "File not found")
		return
	}

	util.WriteHTTPErrorResponse(w, 502, cacheEntry.Error.Error())
}

var errProxiedFileNotFound = errors.New("File not found")

func (h ProxyHandler) fetchProxiedFile(filename string) (data []byte, contentType string, err error) {
	joiner := ""
	if !strings.HasSuffix(h.targetURL, "/") {
		joiner = "/"
	}
	url := h.targetURL + joiner + filename
	var response *http.Response
	done := make(chan bool)

	log.Printf("Fetching proxied file: %s", url)
	go func() {
		response, err = http.Get(url)
		done <- true
	}()

	<-done

	if err != nil {
		return
	}

	switch response.StatusCode {
	case http.StatusOK:
		data, _ = ioutil.ReadAll(response.Body)
		contentType = response.Header.Get("Content-Type")

		data = []byte(strings.Replace(string(data), "__API_HOST__", h.apiHost, -1))
	case http.StatusNotFound:
		err = errProxiedFileNotFound
	default:
		errData, _ := ioutil.ReadAll(response.Body)
		err = fmt.Errorf("Proxy failure, status %d, content: %s", response.StatusCode, string(errData))
	}

	return
}

// ApplyUIProxyRoutes adds the UI file proxy routes to the router
func ApplyUIProxyRoutes(r *mux.Router, apiHost string, uiResURL string, cacheTTL time.Duration) error {
	h := gziphandler.GzipHandler(NewProxyHandler(apiHost, uiResURL, cacheTTL))
	r.Handle("/{filename}", h).Methods("GET")
	r.Handle("/", h).Methods("GET")

	return nil
}
