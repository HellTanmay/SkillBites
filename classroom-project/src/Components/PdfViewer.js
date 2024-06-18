
const PdfViewer = () => {
    const params = new URLSearchParams(window.location.search);
    const source=params.get('source')
    let BASE_URL="https://skillbites-backend.onrender.com"
    // let BASE_URL="http://localhost:4000"
  return (
    <>
     
            <div className='viewer'>
            {/* <button onClick={goBack}> <MdArrowBack/></button>  */}
            <object data={`${BASE_URL}/${source}`}type="application/pdf" title="PDF File" width="100%" height="690px"></object>
            </div>
   
    </>

  )
}

export default PdfViewer
