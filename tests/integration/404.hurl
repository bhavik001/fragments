GET http://localhost:8080/no-such-route

# We should get 404 error response when we request for a non-existing route
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# Assert that the response body contains the string "not found"
jsonpath "$.error.message" == "not found"
# Assert that the response body contains error code 404
jsonpath "$.error.code" == 404
# Assert that the response body contains the status "error"
jsonpath "$.status" == "error"
