import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable'
import fs from 'fs'
import path from 'path';
import action from "../DB/actionDB"


export const config = {
    api: {
        bodyParser: false, // Disable default body parser
    },
};

const IDFolderFather = "1GVDJLe_OeCV52grlVBKbio41b1-eT1Mr";
const IDFolderActive = "";
const IDFolderYoung = "";


export default async function gg_drive(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res.status(405).json({ message: 'method not allowed' });

    try {
        const form = formidable({
            keepExtensions: true,
            multiples: false
        })
        form.parse(req, async function (err, fields, files) {

            if (err)
                console.log(err)

            const actionData = Array.isArray(fields.action) ? fields.action[0] : fields.action


            const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: credentials.client_email,
                    private_key: credentials.private_key.replace(/\\n/g, "\n"),
                },
                // keyFile: path.join(process.cwd(), process.env.GOOGLE_DRIVE_KEY_PATH),
                scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/drive.file']
            });


            const driveService = google.drive({ version: 'v3', auth })

            switch (actionData) {
                case action.CREATE:

                    const file = Array.isArray(files.fileImage) ? files.fileImage[0] : files.fileImage
                    const folderName = Array.isArray(fields.folderName) ? fields.folderName[0] : fields.folderName
                    const fileStream = fs.createReadStream(file.filepath);

                    console.log("come to create file in gg drive")
                    const response = await driveService.files.create({
                        requestBody: {
                            name: file.originalFilename,
                            mimeType: file.mimetype,
                            parents: [folderName === "Father" ? IDFolderFather : ""]
                        },
                        media: {
                            mimeType: file.mimetype,
                            body: fileStream
                        },
                    });

                    // const oauth2 = google.oauth2({
                    //     auth: auth,
                    //     version: 'v2',
                    // });

                    // const userInfo = await oauth2.userinfo.get();
                    // console.log('Authenticated User:', userInfo.data.id);

                    res.status(200).json({ message: 'File uploaded successfully', fileId: response.data.id });
                    break;
                case action.DELETE:

                    try {
                        const fileID = Array.isArray(fields.fileID) ? fields.fileID[0] : fields.fileID
                        await driveService.files.delete({
                            fileId: fileID
                        });
                        res.status(200).json({ message: 'File delete successfully' });
                    }
                    catch (error) {
                        console.error(`Error deleting file: ${error.message}`);
                    }
                    break;

                default:
                    break;
            }
        })

    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }

}
