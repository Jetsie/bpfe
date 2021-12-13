function format(src) {
    // Check for valid source, if not return unmodified source
    try {
        var url = new URL(src);
        // Not a url we can handle, leave it unmodified
        if (!src.includes(url.hostname)) {
            return src;
        }
    } catch (_) {return src}

    const param = "%s"

    var hostname = url.hostname;
    var protocol = url.protocol;
    if (hostname === window.location.hostname) { 
        hostname = "%s";
        protocol = "%s:";
    }

    if (!url.searchParams.has(param)) {
        url.searchParams.append(param, btoa(protocol + "//" + hostname));

        // Make the url refer to us
        url.hostname = window.location.hostname;
        url.port = window.location.port;
        url.hash = window.location.hash;
        url.protocol = window.location.protocol;
    }
    return url.href;
}
let anchors = document.getElementsByTagName("a");
let images = document.getElementsByTagName("img");
let link = document.getElementsByTagName("link");
let script = document.getElementsByTagName("script");
let applet = document.getElementsByTagName("applet");
let area = document.getElementsByTagName("area");
let audio = document.getElementsByTagName("audio");
let base = document.getElementsByTagName("base");
let blockquote = document.getElementsByTagName("blockquote");
let body = document.getElementsByTagName("body");
let del = document.getElementsByTagName("del");
let form = document.getElementsByTagName("form");
let frame = document.getElementsByTagName("frame");
let head = document.getElementsByTagName("head");
let iframe = document.getElementsByTagName("iframe");
let input = document.getElementsByTagName("input");
let ins = document.getElementsByTagName("ins");
let object = document.getElementsByTagName("object");
let q = document.getElementsByTagName("q");
let button = document.getElementsByTagName("button");

for (var i = 0; i < anchors.length; i++) {
    if (anchors[i].hasAttribute("href")) {anchors[i].href = format(anchors[i].href)}}

for (i = 0; i < images.length; i++) {
    if (images[i].hasAttribute("longdesc")) {images[i].longdesc = format(images[i].longdesc)}
    if (images[i].hasAttribute("src")) {images[i].src = format(images[i].src)}
    if (images[i].hasAttribute("usemap")) {images[i].usemap = format(images[i].usemap)}}

for (var i = 0; i < link.length; i++) {
    if (link[i].hasAttribute("href")) {link[i].href = format(link[i].href)}}

for (var i = 0; i < script.length; i++) {
    if (script[i].hasAttribute("src")) {script[i].src = format(script[i].src)}}

for (var i = 0; i < applet.length; i++) {
    if (applet[i].hasAttribute("codebase")) {applet[i].codebase = format(applet[i].codebase)}}

for (var i = 0; i < area.length; i++) {
    if (area[i].hasAttribute("href")) {area[i].href = format(area[i].href)}}

for (var i = 0; i < audio.length; i++) {
    if (audio[i].hasAttribute("src")) {audio[i].src = format(audio[i].src)}}

for (var i = 0; i < base.length; i++) {
    if (base[i].hasAttribute("href")) {base[i].href = format(base[i].href)}}

for (var i = 0; i < blockquote.length; i++) {
    if (blockquote[i].hasAttribute("cite")) {blockquote[i].cite = format(blockquote[i].cite)}}

for (var i = 0; i < body.length; i++) {
    if (body[i].hasAttribute("background")) {body[i].background = format(body[i].background)}}

for (var i = 0; i < del.length; i++) {
    if (del[i].hasAttribute("cite")) {del[i].cite = format(del[i].cite)}}

for (var i = 0; i < form.length; i++) {
    if (form[i].hasAttribute("action")) {form[i].action = format(form[i].action)}}

for (var i = 0; i < frame.length; i++) {
    if (frame[i].hasAttribute("longdesc")) {frame[i].longdesc = format(frame[i].longdesc)}
    if (frame[i].hasAttribute("src")) {frame[i].src = format(frame[i].src)}}

for (var i = 0; i < head.length; i++) {
    if (head[i].hasAttribute("profile")) {head[i].profile = format(head[i].profile)}}

for (var i = 0; i < iframe.length; i++) {
    if (iframe[i].hasAttribute("longdesc")) {iframe[i].longdesc = format(iframe[i].longdesc)}
    if (iframe[i].hasAttribute("src")) {iframe[i].src = format(iframe[i].src)}}

for (var i = 0; i < input.length; i++) {
    if (input[i].hasAttribute("src")) {input[i].src = format(input[i].src)}
    if (input[i].hasAttribute("usemap")) {input[i].usemap = format(input[i].usemap)}}

for (var i = 0; i < ins.length; i++) {
    if (ins[i].hasAttribute("cite")) {ins[i].cite = format(ins[i].cite)}}

for (var i = 0; i < object.length; i++) {
    if (object[i].hasAttribute("classid")) {object[i].classid = format(object[i].classid)}
    if (object[i].hasAttribute("codebase")) {object[i].codebase = format(object[i].codebase)}
    if (object[i].hasAttribute("data")) {object[i].data = format(object[i].data)}
    if (object[i].hasAttribute("usemap")) {object[i].usemap = format(object[i].usemap)}}

for (var i = 0; i < q.length; i++) {
    if (q[i].hasAttribute("cite")) {q[i].cite = format(q[i].cite)}}

for (var i = 0; i < button.length; i++) {
    if (button[i].hasAttribute("formaction")) {button[i].formaction = format(button[i].formaction)}}

/* List of html elements to change, the following are the tags able to initiate request.

X <a href=url>
X <applet codebase=url>
X <area href=url>
X <audio src=url>
X <base href=url>
X <blockquote cite=url>
X <body background=url>
X <del cite=url>
X <form action=url>
X <frame longdesc=url>
X <frame src=url>
X <head profile=url>
X <iframe longdesc=url>
X <iframe src=url>
X <img longdesc=url>
X <img src=url>
X <img usemap=url>
X <input src=url>
X <input usemap=url>
X <ins cite=url>
X <link href=url>
X <object classid=url>
X <object codebase=url>
X <object data=url>
X <object usemap=url>
X <q cite=url>
X <script src=url>
X <button formaction=url>
<command icon=url>
<embed src=url>
<html manifest=url>
<input formaction=url>
<source src=url>
<track src=url>
<video poster=url>
<video src=url>
<use xlink:href="url"></use>
<img srcset="url1 resolution1, url2 resolution2">
<source srcset="url1 resolution1, url2 resolution2">
<object archive=url> or <object archive="url1 url2 url3">
<applet archive=url> or <applet archive=url1,url2,url3>
<meta http-equiv="refresh" content="seconds; url">
<svg><image href="url" /></svg>
<div style="background: url(image.png)"> */
