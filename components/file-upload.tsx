'use client'

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";

import "@uploadthing/react/styles.css";
import Image from "next/image";

interface FileUploadProps {
    onChange: (url?: string) => void
    value: string
    endpoint: 'messageFile' | 'serverImage'
}
const FileUpload: React.FC<FileUploadProps> = (
    {
        onChange,
        value,
        endpoint
    }
) => {
    const fileType = value?.split('.').pop();
    if (value && (fileType == 'jpg' || fileType == 'png')) {
        return (
            <div className="relative">
                <Image width={200} height={200} src={value} alt="Image" />
                <X className="text-white bg-red-500 rounded-full absolute right-0 top-minus-5 cursor-pointer"
                    onClick={() => onChange('')} />
            </div>
        )
    }
    if (value && fileType == 'pdf') {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400
                hover:underline"
                >
                    {value}
                </a>
                <X className="text-white bg-red-500 rounded-full absolute right-0 top-minus-5 cursor-pointer"
                    onClick={() => onChange('')} />
            </div>
        )
    }
    if (value && fileType == 'mp4') {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <video width="640" height="360" controls className="">
                    <source src={value} type="video/mp4" />
                </video>
                <X className="text-white bg-red-500 rounded-full absolute right-0 top-0 cursor-pointer"
                    onClick={() => onChange('')} />
            </div>
        )
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log(error);

            }}
        />
    )
}

export default FileUpload