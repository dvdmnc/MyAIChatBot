import { Box, Typography, Button } from "@mui/material"
import CustomizedInput from "../components/shared/CustomizedInput"
import {IoIosLogIn} from 'react-icons/io'
import { useAuth } from "../context/AuthContext"
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Signup() {
    const navigate = useNavigate()

    const auth = useAuth()

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        try{
            toast.loading("Inscription en cours",{id:'login'})
            await auth?.signup(name,email,password)
            toast.success("Inscrit & Authentifié(e) !",{id:'login'})
        }catch(error){
            toast.error("L'Inscription à échouée, veuillez réessayer plus tard",{id:'login'})
        }
    }

    useEffect(() => {
        if(auth?.user){
            return navigate('/chat')
        }
    })
  return (
    <Box width={'100%'} height={'100%'} display="flex" flex={1}>
        <Box padding={8} mt={8} display={{md:'flex',sm:"none",xs:"none"}}>
            <img src="/airobot.png" alt="Robot" style={{width:"400px"}} />
        </Box>
        <Box display={"flex"} flex={{xs:1,md:0.5}} justifyContent={'center'} alignItems={'center'} padding={2} ml={'auto'} mt={16}>
            <form style={{margin:'auto',padding:'30px',boxShadow:'10px 10px 20px #000', borderRadius:'10px',border:'none'}} onSubmit={handleSubmit}>
                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <Typography variant="h4" textAlign="center" padding={2} fontWeight={600}>
                        Inscription
                    </Typography>
                    <CustomizedInput type="text" name="name" label="Nom" />
                    <CustomizedInput type="email" name="email" label="Email" />
                    <CustomizedInput type="password" name="password" label="Mot de Passe" />
                    <Button type="submit" sx={{px:2,py:1,mt:2,width:'400px',borderRadius:2,bgcolor:"#00fffc",":hover":{
                        bgcolor:'white',color:'black'
                    }}}
                    endIcon={<IoIosLogIn/>}>
                        Créer mon compte
                    </Button>
                </Box>
            </form>
        </Box>
    </Box>
  )
}

export default Signup