# tests/integration/post-fragments-unsupported-type.hurl
# Authenticated POST to /v1/fragments with an unsupported Content-Type
POST http://localhost:8080/v1/fragments
# We're attempting to send a fragment with an unsupported Content-Type
Content-Type: application/octet-stream
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is an unsupported fragment!`

# We expect to get back an HTTP 415 (Unsupported Media Type)
HTTP/1.1 415
[Asserts]
# Verify that the response status is 415
status == 415
# Check for an error message in the response body
jsonpath "$.error" exists
jsonpath "$.error.message" isString
