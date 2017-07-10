package ui

import "time"

type proxyCacheEntry struct {
	Data        []byte
	ContentType string
	Timestamp   time.Time
	Error       error
}

type proxyCacheMap struct {
	Cache map[string]proxyCacheEntry
	TTL   time.Duration
}

// newProxyCacheMap creates a new proxy cache map
func newProxyCacheMap(ttl time.Duration) *proxyCacheMap {
	return &proxyCacheMap{
		Cache: map[string]proxyCacheEntry{},
		TTL:   ttl,
	}
}

// Set adds a successful value to the cache
func (p proxyCacheMap) Set(key string, value []byte, contentType string) proxyCacheEntry {
	p.Cache[key] = proxyCacheEntry{
		Data:        value,
		ContentType: contentType,
		Timestamp:   time.Now(),
		Error:       nil,
	}
	return p.Cache[key]
}

// Set adds a failed value to the cache
func (p proxyCacheMap) SetError(key string, err error) proxyCacheEntry {
	p.Cache[key] = proxyCacheEntry{
		Data:      []byte{},
		Timestamp: time.Now(),
		Error:     err,
	}
	return p.Cache[key]
}

// Delete removes a value from the cache
func (p proxyCacheMap) Delete(key string) {
	delete(p.Cache, key)
}

// Get retrieves a cache entry
func (p proxyCacheMap) Get(key string) (result proxyCacheEntry, ok bool) {
	entry, ok := p.Cache[key]
	if ok {
		age := time.Now().Sub(entry.Timestamp)
		if age > p.TTL {
			p.Delete(key)
			ok = false
		} else {
			result = entry
		}
	}
	return
}
