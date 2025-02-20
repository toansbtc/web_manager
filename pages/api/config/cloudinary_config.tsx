import { v2 as cloudinary_config } from "cloudinary"

cloudinary_config.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.API_key,
    api_secret: process.env.API_secret
});

export default cloudinary_config;