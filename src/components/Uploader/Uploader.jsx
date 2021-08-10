import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Uploader.css'
import { UPLOAD_API_URL } from '../../config'

const Uploader = () => {

    const [ file, setFile ] = useState('');
    const [ showMessage, setShowMessage] = useState(false);
    const [ uploadStatus, setUploadStatus ] = useState('');
    const [ uploading, setUploading] = useState(false)
    const [ uploadedFiles, setUploadedFiles ] = useState(JSON.parse(localStorage.getItem('uploadedFiles')) || [])
    const timerRef = useRef(null);
    const successText = "File Uploaded Successfully";
    const failureText = "Unable to Upload File, Please try again"

    useEffect(() => {
        if(showMessage){
            timerRef.current = setTimeout(() => {
                setShowMessage(false)
            }, 1000);
        }
        return () => {
            if(timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [showMessage]);


    useEffect(() => {
        if(uploadedFiles.length!==0){
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles))
        }
    }, [uploadedFiles])


    const onFileUpload = async (e) => {
        e.preventDefault();
        setUploading(true)
        try{
            let requestData = new FormData();
            requestData.set('image', file, `${Date.now()}-${file.name}`);
            axios.post(UPLOAD_API_URL, requestData)
            .then(response =>{
                if(response.status===200){
                    setUploadStatus(true);
                    setShowMessage(true);
                    setUploadedFiles([...uploadedFiles, response.data])
                }
                else{
                    setUploadStatus(false);
                    setShowMessage(true);
                }
                setUploading(false)
            })
        }catch(err){
            setUploadStatus(false);
            setShowMessage(true);
            setUploading(false)
        }
    };

    return(
        <div>
            <div className="upload-Form-Container">
                <form className="upload-Form" onSubmit={(e)=>onFileUpload(e)}>
                        <h1>Upload Image</h1> 
                        {
                            uploading ?
                            <span className="uploadClass">Uploading file...</span>
                            :
                            <span className={!showMessage ? "uploadClass" : 
                                uploadStatus ? "successClass" : "failureClass"}>
                                {
                                    !showMessage ? "Choose your file and Click Upload" :
                                    (uploadStatus ? successText : failureText)
                                }
                            </span>                    
                        }
                        <input type="file" className="file-upload-input" onChange={(e) => setFile(e.target.files[0])}/>
                        <input className="Upload-Button" type="submit"  disabled={file==="" || uploading} value="Upload"/>
                </form>
            </div>
            <div className="uploadedFiles">
                <h1>Your Files</h1> 
                <ul>
                {
                    uploadedFiles.length>0 ?
                        uploadedFiles.map((file, i) => 
                        <li key={i} className="li-item">
                            <a  href={file.fileLocation} target="_blank" rel="noreferrer"> {file.fileName.split("-")[1]} </a>
                        </li>
                        )
                    :
                        <li>You haven't uploaded any files yet</li>
                }
                </ul>
            </div>
        </div>
    )
}

export default Uploader;


// https://condescending-elion-db8712.netlify.app/