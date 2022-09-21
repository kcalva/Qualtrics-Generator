export const ids = {
    X_API_TOKEN: "0MIPFjm0PstWCJgxjqoTiYUZFXqm9Q9f5M73Gqc5", 
    SURVEY_ID: "SV_dbWCSyQMOM1wOoe",
    DEFAULT_DIRECTORY: "POOL_28S50Seuo8J1WU8",
    MAILINGLIST_ID: "CG_1Ejlnzn0SOrUNLQ"
}

export let headers = new Headers()
headers.append("X-API-TOKEN", ids.X_API_TOKEN)
headers.append("Content-Type", "application/json")