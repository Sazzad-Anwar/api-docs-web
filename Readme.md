-   Need a JSON of following structure to get the app working.

```json
{
    "baseUrl": "https://jsonplaceholder.typicode.com",
    "routes": [
        {
            "id": "", //set id of that api
            "name": "", // set a proper name of that api
            "description": "", // set a description of that api
            "url": {
                "path": "", // set url of that api
                "variables": {
                    "isRequired": true, // set if the url parameter is required or not
                    "params": {
                        "id": "" // set url parameter
                    }
                }
            },
            "method": "", // set method 'GET','POST','PUT','DELETE'
            "body": {
                "isRequired": false, // set if the request body parameters is required or not
                "params": {} // set request body parameters
            },
            "headers": {
                "isRequired": false, // set if the headers parameter is required or not
                "params": {} // set headers parameters
            },
            "query": {
                "isRequired": false, // set if the query parameter is required or not
                "params": {} // set query parameters
            }
        }
    ]
}
```
