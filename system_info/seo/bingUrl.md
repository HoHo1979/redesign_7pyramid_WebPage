Request
POST /IndexNow HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: api.indexnow.org
{
"host": "www.example.org",
"key": "b20a643ab1fe4bdaa68c3ec63cc1dc5b",
"keyLocation": "https://www.example.org/7cb4e285f65244298ee4cd71c922ebca.txt",
"urlList": [
"https://www.example.org/url1",
"https://www.example.org/folder/url2",
"https://www.example.org/url3"
]
}
