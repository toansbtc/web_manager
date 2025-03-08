import axios from "axios";
import action from "@/pages/api/DB/actionDB";

export default function getDrivePath(id: string) {
    // return `https://drive.google.com/file/d/${id}/view?usp=sharing`
    return `https://drive.google.com/uc?export=view&id=${id}`

    // try {
    //     const gg_drive_api = process.env.GOOGLE_DRIVE_API
    //     const url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${gg_drive_api}`;

    //     const response = await fetch(url);
    //     if (!response.ok) throw new Error("Failed to fetch image");

    //     const contentType = response.headers.get("content-type");
    //     const imageBuffer = await response.arrayBuffer();

    //     res.setHeader("Content-Type", contentType);
    //     res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    //     res.status(200).send(Buffer.from(imageBuffer));
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
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
                // console.log("data result ", result.data);
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