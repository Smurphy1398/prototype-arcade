"""Set the Arcade landing's public room default without rebuilding the candidate."""
from pathlib import Path
from urllib.parse import urlparse
import json, sys

endpoint = sys.argv[1] if len(sys.argv) == 2 else ''
url = urlparse(endpoint)
if (url.scheme != 'wss' or not url.hostname or url.path != '/rooms'
        or url.username or url.password or url.query or url.fragment
        or url.hostname in ('localhost', '127.0.0.1', '::1')
        or url.hostname.endswith('.invalid')):
    raise SystemExit('Pass the verified public wss://HOST/rooms endpoint, without credentials.')
repo = Path(__file__).resolve().parents[3]
landing = repo / 'games/astro-racing.html'
text = landing.read_text(encoding='utf-8')
anchor = "const server=new URLSearchParams(location.search).get('server');"
if text.count(anchor) != 1:
    raise SystemExit('Landing already configured or changed; review the existing setting first.')
literal = json.dumps(endpoint).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
text = text.replace(anchor, "const server=new URLSearchParams(location.search).get('server')||" + literal + ';')
landing.write_text(text, encoding='utf-8', newline='\n')
print('Configured landing default:', endpoint)
print('Review the diff, update deployment evidence, and publish. Candidate assets remain unchanged.')
