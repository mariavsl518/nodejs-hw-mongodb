import cloudinary from 'cloudinary'

cloudinary.v2.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

export function uploadCloudinary(file){
    return cloudinary.v2.uploader.upload(file)
}
