import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const Home = ()=>{
    const login = useSelector((state)=> state.login.login)

    if(login)
    {
    return (
        <>
        
 
home
 


        </>
    )
    }
    else{
        return <Navigate to="/login" />
    }
}


export default Home;