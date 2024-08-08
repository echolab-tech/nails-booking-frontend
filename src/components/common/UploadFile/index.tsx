import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface UploadFileProps {
  setFieldValue: any;
  srcDefault: any;
}

const UploadFile = ({ setFieldValue, srcDefault }: UploadFileProps) => {
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilePreview(srcDefault);
  }, [srcDefault]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    if (file) {
      setFieldValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileRemove = () => {
    setFieldValue("avatar", null);
    setFilePreview(srcDefault);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative inline">
        <img
          className="h-[150px] w-[150px] rounded-full object-cover"
          src={filePreview as string}
          alt="Preview"
        />
        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {fileInputRef.current?.value !== "" && (
          <IoCloseCircle
            onClick={handleFileRemove}
            size={30}
            className="absolute left-1 top-0 z-40 cursor-pointer text-red"
          />
        )}
      </div>
      <button
        className="rounded-lg bg-primary px-4 py-2 text-white"
        type="button"
        onClick={handleButtonClick}
      >
        Upload file
      </button>
    </div>
  );
};

export default UploadFile;
