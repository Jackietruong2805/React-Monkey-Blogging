import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export default function useFirebaseImage(getValues, setValue, imageName = null, cb){
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('');
    if(!getValues ||  !setValue) return;
      const handleUploadImage = (file)=>{
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercent);
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log("Nothing at all");
          }
        }, 
        (error) => {
          console.log('Error: ', error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImage(downloadURL);
            setProgress(0);
          });
        }
      );
      }
      const handleSelectImage = (e) =>{
        const file = e.target.files[0];
        if(!file) return;
        setValue("image_name", file?.name);
        console.log("file", file.name);
        handleUploadImage(file);
      }
      
      const handleDeleteImage = ()=>{
        const storage = getStorage();
        const imageRef = ref(storage, "images/" + (imageName || getValues("image_name").name));
        deleteObject(imageRef).then(() => {
          // File deleted successfully
          setImage("");
          setProgress(0);
          cb && cb();
        }).catch((error) => {
          console.log("error", error)
          // Uh-oh, an error occurred!
        });
      }
      const handleResetUpload = ()=>{
        setImage("");
        setProgress(0);
      }

      return {
        progress,
        image,
        setImage,
        handleResetUpload,
        handleSelectImage,
        handleDeleteImage
      }
}