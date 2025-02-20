// const action = "CREATE" || "UPDATE" || "DELETE" || "GETDATA" || "GETLISTDATA" || "NATIVESQL";

enum action {
    CREATE = "CREATE",
    CREATEMANY = "CREATEMANY",
    UPDATE = "UPDATE",
    UPDATEMANY = "UPDATEMANY",
    DELETE = "DELETE",
    GETDATA = "GETDATA",
    GETLISTDATA = "GETLISTDATA",
    NATIVESQL = "NATIVESQL",
}

export default action;