const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'duumkzqwx',
  api_key: '582181163874144',
  api_secret: 'F90ksfH8lQrEYqFV_EPa3wTdVvs',
});

// Cloudinary Upload Image
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};
// Cloudinary removeImg Image
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.upload(imagePublicId);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
};
