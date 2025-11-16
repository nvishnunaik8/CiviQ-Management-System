// Upload.jsx
import React, { useState } from "react";

function Upload() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async (e) => {
    const file=e.target.files[0] 
    if(!file) return ;
      if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (jpg, png, jpeg, etc.)");
      return;
    }
    const data=new FormData()
    data.append("file",file)
    data.append("upload_preset","Javeed")
    data.append("cloud_name","djt3vedth")

    const res=await fetch("https://api.cloudinary.com/v1_1/djt3vedth/image/upload",{
        method:"POST",
        body:data
    })

    const uploadImage=await res.json()

  };

  return (
    <div>
        <div>
            <input type="file" className="file-input" onChange={handleUpload}/>
        </div>
    </div>
  );
}

export default Upload;
