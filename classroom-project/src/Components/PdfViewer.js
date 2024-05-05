import Layout from './Layout/Layout';
import { MdArrowBack } from "react-icons/md";
const PdfViewer = () => {
    const params = new URLSearchParams(window.location.search);
    const source=params.get('source')
    const goBack = () => {
        window.history.back(); 
    };

  return (
    <>
     
            <div className='viewer'>
            {/* <button onClick={goBack}> <MdArrowBack/></button>  */}
            <object data={`http://localhost:4000/${source}`}type="application/pdf" title="PDF File" width="100%" height="690px"></object>
            </div>
   
    </>

  )
}

export default PdfViewer
