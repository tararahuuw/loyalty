import React, {useRef} from 'react'
import { PiPlus } from 'react-icons/pi'

const UploadImageBox = ({UploadImage}) => {

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!validTypes.includes(file.type)) {
            alert("Only JPG, JPEG, and PNG files are allowed.");
            return;
        }
        UploadImage(file);
    };
    return (
        <div className='flex w-16 h-16'>
            <input
                type="file"
                accept=".jpg,.jpeg,.png"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            <div className="bg-white rounded-lg border-2 border-primary500 cursor-pointer w-full h-full" onClick={handleUploadClick}>
                <div className="w-full flex h-full items-center justify-center">
                    <PiPlus className="text-primary500" size={20} />
                </div>
            </div>
        </div>
    )
}

export default UploadImageBox