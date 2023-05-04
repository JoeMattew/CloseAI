import React, { useEffect } from 'react'
import  { useState, useReact} from 'react'
const App = () => {

  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

 

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try{
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      
      setMessage(data.choices[0].message)
      

     
    } catch(error) {
      console.error(error)
    }
    
  }

    useEffect(() => {
      console.log(currentTitle, value, message)
      if(!currentTitle && value && message){
        setCurrentTitle(value)
        // setValue("")
      }
      if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "Young Padawan",
            content: value
        }, 
        {
          title: currentTitle,
          role: "Some random master",
          content: message.content
        }
      ]
      ))
      // setValue("")
      }
    }, [message, currentTitle])

    

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  .map(title => ({ title, chats: previousChats.filter(chat => chat.title === title) }));
    

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat </button>
        
        <ul className="history">
        {uniqueTitles.map(({ title }) => (
          <li key={title} onClick={() => handleClick(title)}>
            {title}
          </li>
        ))}
      </ul>
        <nav>
          <p>Made by JoeDevMatt</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>YodaGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index} className='dialogue'>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
          
          <input name="message" id="message-input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') getMessages()}} />
          

            <div id="submit" onClick={getMessages}>➢</div>
            
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
