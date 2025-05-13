import http.server
import socketserver
import functools
import os

PORT = 8000
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=PUBLIC_DIR)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Servidor corriendo en http://localhost:{PORT}")
    print("Accede desde otros dispositivos usando la IP local de este equipo en la red WiFi.")
    print(f"Directorio público servido: {PUBLIC_DIR}")
    httpd.serve_forever()
