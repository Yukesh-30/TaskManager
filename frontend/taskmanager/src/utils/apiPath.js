const BASE_URL = "http://localhost:8000"
const API_PATHS = {
    AUTH : {
        REGISTER :"/api/auth/register",
        LOGIN : "/api/auth/login",
        GET_PROFILE : "/api/auth/getprofile"
    },
    USER : {
        GET_ALL_USER : "/api/user",
        GET_USER_BY_ID : (userId) => `/api/user/${userId}`,
        CREATE_USER : "/api/user",
        UPDATE_USER : (userId) =>`/api/user/${userId}`,
        DELETE_USER : (userId) =>`/api/user/${userId}`
    },
    TASKS : {
        GET_DASHBOARD_DATA : "/api/task/dashboard",
        GET_USER_DAASHBOARD : "/api/task/userdashboard",
        GET_ALL_TASKS : "/api/task",
        GET_TASK_BY_ID : (userId) =>`/api/task/${userId}`,
        CREATE_TASK : "/api/task",
        UPDATE_TASK : (userId) =>`/api/task/${userId}`,
        DELETE_TASK : (userId) =>`/api/task/${userId}`,
        UPDATE_TASK_STATUS : (userId) =>`/api/task/${userId}/status`,
        UPDATE_TASK_TODO : (userId) =>`/api/task/${userId}/todo`
    },

    REPORT : {
        EXPORT_TASK : "/api/reports/export/task",
        EXPORT_USER : "/api/reports/export/user"
    },
    IMAGE : {
        UPLOAD_IMAGE : "/api/auth/uploadimage"
    }

}

export {BASE_URL,API_PATHS}