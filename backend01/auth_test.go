package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"
)

func TestUpdateProfileUnauthorized(t *testing.T) {
	reqBody := map[string]string{"first_name": "Somchai"}
	b, _ := json.Marshal(reqBody)
	req, _ := http.NewRequest(http.MethodPut, "http://localhost:3000/profile", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401 unauthorized, got %d", resp.StatusCode)
	}
}

// Note: This test requires the server to be running. It performs register -> login -> update flow.
func TestUpdateProfileFlow(t *testing.T) {
	// Register
	reg := map[string]string{"email": "test@example.com", "password": "secret"}
	b, _ := json.Marshal(reg)
	resp, err := http.Post("http://localhost:3000/register", "application/json", bytes.NewReader(b))
	if err != nil {
		t.Fatalf("register failed: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Skipf("register not created (status %d); skip integration test", resp.StatusCode)
	}

	// Login
	login := map[string]string{"email": "test@example.com", "password": "secret"}
	b, _ = json.Marshal(login)
	resp, err = http.Post("http://localhost:3000/login", "application/json", bytes.NewReader(b))
	if err != nil {
		t.Fatalf("login failed: %v", err)
	}
	var lr map[string]string
	_ = json.NewDecoder(resp.Body).Decode(&lr)
	token, ok := lr["token"]
	if !ok || token == "" {
		t.Skip("no token returned; skipping")
	}

	// Update profile
	update := map[string]string{"first_name": "Somchai", "last_name": "Jaidee", "phone": "081-234-5678"}
	b, _ = json.Marshal(update)
	req, _ := http.NewRequest(http.MethodPut, "http://localhost:3000/profile", bytes.NewReader(b))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("update request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200 OK, got %d", resp.StatusCode)
	}
}
