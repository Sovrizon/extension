api_addr = "http://127.0.0.1:8200"

listener "tcp" {
  address              = "127.0.0.1:8200"
  tls_disable          = 1
  cors_enabled         = true
  cors_allowed_origins = ["*"]
  cors_allowed_headers  = ["*"]
  cors_allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  cors_exposed_headers = ["Content-Length", "Content-Type"]
}

storage "file" {
  path = "/tmp/vault-data"
}

ui                   = true
cors_allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]