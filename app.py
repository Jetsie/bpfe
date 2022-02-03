from os import error
from flask import Flask, request, redirect, Response
from urllib.parse import urlencode, urlparse, urlunparse, parse_qs
from base64 import b64decode, b64encode
import requests
from werkzeug.datastructures import Headers
from werkzeug.wsgi import FileWrapper
from bs4 import BeautifulSoup
from io import BytesIO
import re
import logging
import brotli
del brotli

# Disable flask verbose logging
log = logging.getLogger('werkzeug')
log.disabled = True

ourScheme = "https:"
ourNetloc = "https://bpfe.herokuapp.com/"

with open('inject.js', 'r') as f: # Read the inject.js file and set it to the js to inject into the html to fix it.
    injectJS = f.read()

app = Flask(__name__)
# methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
methods = ['GET', 'POST']


@app.route('/', defaults={'path': ''}, methods=methods)
@app.route('/<path:path>', methods=methods)
def garlic(path):
    bpdev = request.args.get('bpdev')
    if not bpdev: # No path was specified, return a homepage.
        return 'Homepage!' # Replace this to make a better homepage
    else:
        # We have been requested to make a request on a users behalf, lets extract the target first
        bpdev = b64decode(bpdev) # Decode bpdev
        bpdev_parsed = urlparse(bpdev)
        
        request_url = urlparse(request.url)

        queries = parse_qs(request_url.query, keep_blank_values=True)
        queries.pop('bpdev', None) # Remove bpdev from the query string
        request_url = request_url._replace(query=urlencode(queries, True))

        # Change the scheme and domain to "bpdev" domain
        new_url = urlunparse(request_url._replace(netloc=bpdev_parsed.netloc.decode("utf-8"), scheme=bpdev_parsed.scheme.decode("utf-8")))
        
        print(f'{str(request.url)} --> {new_url}')
        
        # Re-build the url
        return requester(new_url, request)

def requester(url, request):
    if request.method == 'GET':
        # Change host and orgin header, some sites don't like requests with a non-matching host header
        modHeaders = toHeaders(request.headers)
        urlParsed = urlparse(url)
        modHeaders.set('Host', urlParsed.netloc)
        modHeaders.set('Orgin', f'{urlParsed.scheme}://{urlParsed.netloc}')

        # Make the request
        sent = requests.get(url, headers=modHeaders, allow_redirects=False)
        
        # Fix the urls in the html, then inject the js to fix the rest when loaded in the browser
        try:            
            soup = BeautifulSoup(sent.text, 'html.parser')

            tag = soup.new_tag("script")
            tag.string = injectJS%('bpdev', urlParsed.hostname, urlParsed.scheme)
            
            soup.body.insert_after(tag)

            content = str(soup).encode("utf-8")
        except Exception as e:
            try:
                if 'html' in sent.headers.get('Content-Type'):
                    content = sent.text
                    # for link in re.findall('https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', content):
                    #     content = content.replace(link, toFormattedUrl(link))
                    content = content.encode("utf-8")
                else:
                    content = sent.content
            except:
                content = sent.content
            

        # Return the response
        if sent.status_code >= 300 and sent.status_code < 400:
            # Redirect
            try:
                resp = redirect(toFormattedUrl(sent.headers["Location"]), code=sent.status_code)
            except KeyError:
                # No redirect location specified
                content = b'Requested content sent an invalid redirect.'
                pass

        # Disable user-side compression ***CAN BE BETTER IF WE LEAVE IT ALONE AND JUST SEND THE RECOMPRESSED STUFF***
        h = dict(sent.headers)
        
        print(h)
        
        deleteHeader(h, 'Content-Encoding')
        deleteHeader(h, 'Referer')
        deleteHeader(h, 'Content-Security-Policy')
        deleteHeader(h, 'Content-Security-Policy-Report-Only')
        deleteHeader(h, 'Cross-Origin-Opener-Policy-Report-Only')
        deleteHeader(h, 'Cross-Origin-Resource-Policy')

        # Return the response, set default params if custom response is not found
        if 'resp' in locals():
            pass
        else:
            w = FileWrapper(BytesIO(content))
            resp = Response(w, direct_passthrough=True)
            resp.status = sent.status_code
            h["Content-Length"] = str(len(content))
            resp.headers = toHeaders(h)
        return resp

    elif request.method == 'POST':
        # Change host and orgin header, some sites don't like requests with a non-matching host header
        modHeaders = toHeaders(request.headers)
        urlParsed = urlparse(url)
        modHeaders.set('Host', urlParsed.netloc)
        modHeaders.set('Orgin', f'{urlParsed.scheme}://{urlParsed.netloc}')

        # Make the request
        sent = requests.post(url, data=request.form, headers=toHeaders(request.headers))

        # Disable user-side compression ***CAN BE BETTER IF WE LEAVE IT ALONE AND JUST SEND THE RECOMPRESSED STUFF***
        h = dict(sent.headers)
        deleteHeader(h, 'Content-Encoding')
        deleteHeader(h, 'Referer')

        # Return the response
        if 'resp' in locals():
            pass
        else:
            w = FileWrapper(BytesIO(sent.content))
            resp = Response(w, direct_passthrough=True)
            resp.status = sent.status_code
            resp.headers = toHeaders(sent.headers)
        return resp
    else:
        print(request.method)

# Converts other types of headers to a werkzeug Headers object
def toHeaders(d):
    return Headers(dict(d))

def toFormattedUrl(url):
    parsed = urlparse(url)

    param = {'bpdev': b64encode((parsed.scheme + "://" + parsed.netloc).encode('utf-8'))}
    query = parsed.query
    url_dict = dict(parse_qs(query))
    url_dict.update(param)
    url_new_query = urlencode(url_dict)
    parsed = parsed._replace(query=url_new_query)

    parsed = parsed._replace(scheme=ourScheme)
    parsed = parsed._replace(netloc=ourNetloc)

    return urlunparse(parsed)

def deleteHeader(headers, header):
    if header in headers:
        del headers[header]
    return headers
