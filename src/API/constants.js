export const ids = {
    X_API_TOKEN: "", 
    SURVEY_ID: "",
    DEFAULT_DIRECTORY: "",
    MAILINGLIST_ID: ""
}

export let headers = new Headers()
headers.append("X-API-TOKEN", ids.X_API_TOKEN)
headers.append("Content-Type", "application/json")