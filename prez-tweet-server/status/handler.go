package status

import (
	"encoding/json"
	"net/http"
	"time"
)

// Handler provides handling for a /status API call
type Handler struct {
	APIHost   string
	UIResURL  string
	startTime time.Time
}

type statusResponse struct {
	API    string  `json:"api"`
	UI     string  `json:"ui"`
	Uptime float64 `json:"uptime_sec"`
}

// NewHandler creates a new handler and its state
func NewHandler(host string, js string) *Handler {
	return &Handler{
		APIHost:   host,
		UIResURL:  js,
		startTime: time.Now(),
	}
}

func (h Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	uptime := time.Now().Sub(h.startTime).Seconds()
	response := statusResponse{
		API:    h.APIHost,
		UI:     h.UIResURL,
		Uptime: uptime,
	}
	data, _ := json.Marshal(response)

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
