import  { useRef } from 'react'

const Discussion = () => {
    const inputRef = useRef(null);
  return (
   <div className='discussion'>
    <h1>Discussion</h1>
    <p onClick={()=>inputRef.current.style.display='block'}>Ask questions</p>
    <input ref={inputRef}type='text' />
    <div className='chat'>
    <div className='chat-profile'>
      <div className='image'>
        <img src='/Assets/BGpic.jpg' alt='profile'width='50px'height='55px'/>
        </div>
        <p>hello wefknknf</p>
        <div className='chat-content'>
        </div>
        </div>
    </div>
   </div>
  )
}

export default Discussion
