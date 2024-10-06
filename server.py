import http.server
import socketserver

PORT = 8080  # Changed from 8000 to 8080 to avoid conflict

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
