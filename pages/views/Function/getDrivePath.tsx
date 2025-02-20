import axios from "axios";
import action from "@/pages/api/DB/actionDB";

export default function getDrivePath(id: string) {
    return `https://drive.google.com/file/d/${id}`
}

export async function createDriveImage(imageFile, folder) {
    try {
        let fileID = ""
        const formDataImage = new FormData();
        formDataImage.append("fileImage", imageFile);
        formDataImage.append("folderName", folder);
        formDataImage.append("action", action.CREATE);
        await axios.post("/api/controller/gg_drive", formDataImage).then((result) => {
            if (result.data) {
                console.log("data result ", result.data);
                fileID = result.data.fileId;
            }
        })
        return fileID
    } catch (error) {
        console.log("error when create file from drive", error)
    }

}

export async function deleteDriveImage(imageID) {
    try {
        const formDataImage = new FormData();
        formDataImage.append("fileID", imageID);
        formDataImage.append("action", action.DELETE);
        await axios.post("/api/controller/gg_drive", formDataImage).then((result) => {
            if (result.status === 200)
                return "delete success"
            else
                return "fail to delete image with id:" + imageID
        })
    } catch (error) {
        console.log("error when delete file from drive", error)
    }
}