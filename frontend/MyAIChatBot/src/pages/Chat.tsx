import { Avatar, Box, Button, IconButton, Typography } from "@mui/material"
import red from '@mui/material/colors/red'
import { useAuth } from "../context/AuthContext"
import ChatItem from "../components/chat/ChatItem"
import { IoMdSend } from "react-icons/io"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

type Message = {
    role:string,
    content:string
}

function Chat() {
    const navigate = useNavigate()

    const inputRef = useRef<HTMLInputElement | null>(null)
    
    const auth = useAuth()
    
    const [chatMessages,setChatMessages] = useState<Message[]>([])
    
    const handleSubmit = async () => {
        const content = inputRef.current?.value as string;
        if(inputRef && inputRef.current){
            inputRef.current.value = "";
        }
        const newMessage:Message = {role:"user", content}
        setChatMessages((prev) => [...prev,newMessage])
        const chatData = await sendChatRequest(content)
        setChatMessages([...chatData.chats])
    }

    const handleDeleteChats = async () => {
        try{
            toast.loading("Suppression des discussions précédentes",{id : "deleteChats"})
            await deleteUserChats()
            setChatMessages([])
            toast.success("Discussions précédentes effacées", {id : "deleteChats"})
        } catch(err){
            toast.error("Il semble y avoir un problème.. veuillez réessayer plus tard", {id: "deleteChats"})
        }
    }

    useLayoutEffect(() => {
        if(auth?.isLoggedIn && auth.user){
            toast.loading("Chargement des discussions précédentes", {id : "loadchats"})
           getUserChats().then((data) => {
            setChatMessages([...data.chats])
            toast.success("Discussions récupérées !", {id : "loadchats"})
           }).catch(err => {
            toast.error("Il semble y avoir un problème.. veuillez réessayer plus tard", {id:"loadchats"})
           })
        }
    },[auth])

    useEffect(()=> {
        if(!auth?.user){
            return navigate('/login')
        }
    })

  return (
    <Box sx={{display:'flex',flex:1,width:'100%',height:'100%',mt:3,gap:3}}>
        <Box sx={{display:{md:'flex',xs:'none',sm:'none'}, flex:0.2,flexDirection:'column', px:3}}>
            <Box sx={{display:"flex",width:'100%',height:'60vh',bgcolor:'rgb(17,29,39)', borderRadius: 5, flexDirection:'column',mx:3}}>
                <Avatar sx={{mx:'auto',my:2,bgcolor:'white',color:'black',fontWeight:700}}>
                    {auth?.user?.name[0]}
                </Avatar>
                <Typography sx={{mx:'auto',fontFamily:'work sans'}}>
                    Vous parlez à un ChatBot
                </Typography>
                <Typography sx={{mx:'auto',fontFamily:'work sans', my:4, p:3}}>
                Vous pouvez poser des questions relatives à la Science, aux affaires, aux conseils, à l'éducation, à la Philosophie etc. Mais évitez de communiquer des informations personnelles.
                </Typography>
                <Button sx={{width:'200px',my:'auto', color:'white',fontWeight:'700',borderRadius: 3, mx:'auto', bgcolor:red[300], ":hover":{bgcolor:red.A400}}} onClick={handleDeleteChats}>Effacer la discussion</Button>
            </Box>
        </Box>
        <Box sx={{display:"flex",flex:{md:0.8,xs:1,sm:1},flexDirection:'column', px:3}}>
            <Typography sx={{textAlign:'center',fontSize:'40px',color:'white',mb:2, mx:'auto',fontWeight:600}}>
                Modèle GPT-3.5-Turbo
            </Typography>
            <Box sx={{width:'100%', height:'60vh', borderRadius:3,mx:'auto',display:'flex',flexDirection:'column',overflow:'scroll',overflowY:'auto',overflowX:'hidden',scrollBehavior:'smooth'}}>
                {chatMessages.map((chat,index) => 
                <ChatItem content={chat.content} role={chat.role} key={index} />)}
            </Box>
            <div style={{width:'100%',borderRadius:8,backgroundColor:'rgb(17,27,39)',display:'flex',marginRight:'auto'}} >
            <input ref={inputRef} type='text' style={{width:'100%',backgroundColor:'transparent', padding:'30px',border:'none',outline:'none',color:'white',fontSize:'20px'}} />
            <IconButton sx={{ml:"auto",color:'white'}} onClick={handleSubmit}>
                <IoMdSend />
            </IconButton>
            </div>
        </Box>
    </Box>
  )
}

export default Chat