import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'

function ChatMessage({message, type}){
  return(
    <div className={`flex justify-${type === "send" ? "start" : "end"}`}>
     {type === "send" ? (
      <div className='bg-violet-500 p-2 rounded-b-lg rounded-tr-lg text-white'>
      {message}
      </div>
     ) : (
      <div className='bg-white p-2 rounded-b-lg rounded-tr-lg text-black'>
      {message}
      </div>
     )}
    </div>
  );
}
function App() {
  

  const [socket, setSocket]= useState(null);
  const [input_message , setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    const newSocket = io("http://localhost:8080/");
    setSocket(newSocket);

    newSocket.on("response", (message)=>{
      setMessages([
        ...messages, {
          type : "receive",
          message
        }
      ]);
    });
    return ()=> newSocket.close();
  } , []);

  const sendMessage = ()=>{
    setMessages([
      ...messages, {
        type : "send",
        message: input_message
      }
    ]);
    socket.emit( 'message' , input_message);
    setInputMessage("");
  }

  return (
    <div className='p-5 h-screen bg-black'>
      <div className='container mx-auto bg-gray-900 h-full flex flex-col'>
        <div className='flex-grow p-5 flex flex-row items-end '>
         <div className='w-full'>
          {messages.map((message, index) => (
            <ChatMessage 
              key={index}
              message={message.message}
              type={message.type}
            />
          ))}
         </div>
        </div>
        <div className='h-{100px} p-3 flex justify-center items-center bg-gray-700'>
          <input value={input_message} onChange={(e)=>setInputMessage(e.target.value)} type='text' className='w-full p-2 bg-transparent text-white border-white border-2 rounded-md outline-none' placeholder='Type Something...' />
          <button onClick={sendMessage} className='bg-violet-600 px-3 py-2 rounded-md mx-2 text-white cursor-pointer'>Send</button>
        </div>
      </div>
    </div>
    
  )
}

export default App
