import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType) => {
    try {
        if (!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType || "auto"
        })
        //file has been uploaded successfully
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null
    }
}

const removeOnCloudinary = async (url, resource_type) => {
    try {
        if (!url) return true
        const urlParts = url.split('/')
        const publicIdWithExtension = urlParts[urlParts.length - 1]
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "") // remove extension (.jpg)
        const result = await cloudinary.uploader.destroy(publicId, {resource_type: resource_type || "image"})
        return result
    } catch (error) {
        return null
    }
}

export { uploadOnCloudinary, removeOnCloudinary }