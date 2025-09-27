#!/bin/sh
set -e

CERT_DIR="/app/certs"
CERT_FILE="$CERT_DIR/cert.pem"
KEY_FILE="$CERT_DIR/key.pem"

mkdir -p "$CERT_DIR"

echo "Generating self-signed SSL certificate for frontend..."
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -subj "/C=US/ST=Local/L=Local/O=ReactDev/OU=Dev/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Certificates generated:"

echo "Starting React dev server over HTTPS..."
npm run dev