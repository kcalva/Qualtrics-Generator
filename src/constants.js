export const ids = {
    X_API_TOKEN: "S6Vip4gGnK5e42fPs6qHPLN1Qy3LCMi7MkFcZUKy",
    SURVEY_ID: "SV_1Tce8uiS6q4MrQO",
    DEFAULT_DIRECTORY: "POOL_28S50Seuo8J1WU8",
    MAILINGLIST_ID: "CG_1IinPnnXNsd3fxT"
}

export let headers = new Headers()
headers.append("X-API-TOKEN", ids.X_API_TOKEN)
headers.append("Content-Type", "application/json")