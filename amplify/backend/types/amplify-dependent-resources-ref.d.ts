export type AmplifyDependentResourcesAttributes = {
    "function": {
        "trigger": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "crypto": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}