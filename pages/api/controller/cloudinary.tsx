import { NextApiRequest, NextApiResponse } from "next";
import cloudinary_config from "../config/cloudinary_config";
import fs from "fs/promises";
import { Fields, Files, IncomingForm } from "formidable";
import actionDB from "../DB/actionDB";

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = async (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true, keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function cloudinary(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    const { fields, files } = await parseForm(req);
    const actionData = Array.isArray(fields?.action) ? fields?.action[0] : fields?.action
    if (actionData === actionDB.DELETE) {
      const list_id_image = fields.list_id_image;
      await Promise.all(
        list_id_image.map(id => cloudinary_config.uploader.destroy(`uploads/${id}`)))
      return res.status(200).json({ mesage: "success" })
    }
    else {

      console.log("files")

      if (!files.file) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const fileList = Array.isArray(files.file) ? files.file : [files.file];

      let uploadedUrls = "";

      for (const file of fileList) {
        console.log(`Uploading: ${file.originalFilename}`);

        const result = await cloudinary_config.uploader.upload(file.filepath, {
          folder: "uploads",
        });

        uploadedUrls += result.secure_url + ",";
      }
      console.log(uploadedUrls)

      return res.status(200).json({ urls: uploadedUrls.substring(0, uploadedUrls.length - 1) });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
