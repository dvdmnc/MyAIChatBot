import { Avatar, Box, Typography } from "@mui/material"
import { useAuth } from "../../context/AuthContext"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism"

function extractCodeFromString(message:string){
    if(message.includes("```")){
        const blocks = message.split("```")
        return blocks
    }
}

function isCodeBlock(str:string){ //This is an attempt to recognize a block of code
    if(str.includes('{') || str.includes('}') || str.includes('&&') || str.includes("||") || str.includes('==') || str.includes('===') || str.includes("!=") || str.includes("!==") || str.includes('/*') || str.includes("*/") || str.includes("//")){
        return true
    }
    return false
}

function ChatItem({content,role}:{content:string,role:string}) {
    const messageBlocks = extractCodeFromString(content);
    const auth = useAuth()
  return role === "assistant" ? <Box sx={{display:'flex',p:2,bgcolor:"#004d5612",my:2,gap:2}}>
    <Avatar sx={{ml:0}}>
        <img src="/openai.png" alt="openai" width={"30px"} />
    </Avatar>
    <Box>
        {!messageBlocks && (<Typography sx={{fontSize:"20px"}}>{content}</Typography>)}
        {messageBlocks && messageBlocks.length && messageBlocks.map((block,index) => isCodeBlock(block)? <SyntaxHighlighter key={index} style={coldarkDark} language={`${block.split(' ')[0].split('\n')[0]}`} children={block} /> /* language attribute determines the colors of the block. The first word of block gives the language name followed by \n to change line*/ : <><Typography sx={{fontSize:"20px"}} key={index}>{block}</Typography></>)}
    </Box>
  </Box> : <Box sx={{display:'flex',p:2,bgcolor:"#004d56",gap:2, my:2}}>
    <Avatar sx={{ml:0,bgcolor:'black',color:'white'}}>
        {auth?.user?.name[0]}
    </Avatar>
    <Box>
    {!messageBlocks && (<Typography sx={{fontSize:"20px"}}>{content}</Typography>)}
        {messageBlocks && messageBlocks.length && messageBlocks.map((block,index) => isCodeBlock(block)? <SyntaxHighlighter key={index} style={coldarkDark} language={`${block.split(' ')[0].split('\n')[0]}`} children={block} /> /* language attribute determines the colors of the block. The first word of block gives the language name followed by \n to change line*/ : <><Typography sx={{fontSize:"20px"}} key={index}>{block}</Typography></>)}
    </Box>
  </Box>
}

export default ChatItem