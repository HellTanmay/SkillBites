
const PdfViewer = () => {
    const params = new URLSearchParams(window.location.search);
    const source=params.get('source')
    
    let BASE_URL=process.env.REACT_APP_API_URL
  
  return (
    <>
            <div className='viewer'>
            <object data={`${BASE_URL}/${source}`}type="application/pdf" title="PDF File" width="100%" height="690px"></object>
            </div>
    </>

  )
}

export default PdfViewer
