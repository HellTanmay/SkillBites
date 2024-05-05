import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import { toast } from 'react-toastify';

const Certificate = () => {
    const [downloading, setDownloading] = useState(false);
    const {id}=useParams()
    const downloadCertificate = async () => {
      try {
        setDownloading(true);
        const response = await fetch(`http://localhost:4000/certificate/${id}`, {
            method: 'POST',
            credentials: 'include',
          });
          if(response.status>=400){
    const res=await response.json()
   
       toast.info(res.message,{position:'bottom-right',theme:'colored'})
      }
          const blob = await response.blob();
        const filename = `certificate_${id}.pdf`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download',filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log(error)
      } finally {
        setDownloading(false);
      }
    };
  
  return (
    <div className='download'>
      <button className='download-btn'onClick={downloadCertificate} disabled={downloading}>
        <IoMdDownload style={{ fontSize:'30px'}}/> 
      </button>
     <span> {downloading ? 'Downloading...' : 'Download Certificate'}</span>
   
    </div>
  )
}

export default Certificate
