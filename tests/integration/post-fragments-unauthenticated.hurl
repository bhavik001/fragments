# tests/integration/post-fragments-unauthenticated-type.hurl
POST http://localhost:8080/v1/fragments
# We're sending a text/plain fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials wrong
[BasicAuth]
user1@email.com:password123
# Body of the request goes in `...` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 401 unauthorised response
HTTP/1.1 401
# We have various assertions about the response that we want to check
[Asserts]
# Assert that the response body contains the string "Unauthorized"
jsonpath "$.error.message" == "Unauthorized"
# Assert that the response body contains status error
jsonpath "$.status" == "error"
