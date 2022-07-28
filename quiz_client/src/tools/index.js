function encodeUrl(url) {
  return url
    .replace(/\%/g, "%25")
    .replace(/\ /g, "%20")
    .replace(/\+/g, "%2B")
    .replace(/\//g, "%2F")
    .replace(/\?/g, "%3F")
    .replace(/\&/g, "%26")
    .replace(/\=/g, "%3D")
    .replace(/\#/g, "%23");
}

function decodeUrl(url) {  
  return url
    .replace(/\%25/g, "%")
    .replace(/\%20/g, " ")
    .replace(/\%2B/g, "+")
    .replace(/\%2F/g, "/")
    .replace(/\%3F/g, "?")
    .replace(/\%26/g, "&")
    .replace(/\%3D/g, "=")
    .replace(/\%23/g, "#");
}

export { encodeUrl, decodeUrl};
