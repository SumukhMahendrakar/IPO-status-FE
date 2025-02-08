import axios, { HttpStatusCode } from "axios"
import log from "loglevel"
import React, { ChangeEventHandler, MouseEventHandler, useContext, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserInfoResp } from "../common/types";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserInfoResp | null>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [updatedPan, setUpdatedPan] = useState(false)
    
    const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEmail(e.target.value)
    }

    const onPasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value)
    }

    const loginBtnClick: MouseEventHandler<HTMLButtonElement> = async(e) => {
        e.preventDefault()
        try {
            const resp = await axios.post("http://localhost:9000/login", {
                email: email,
                password: password
            })
    
            if(resp.status !== 202) {
                log.error("Bad Request")
                toast.error("Try again", {
                    position: "top-right",
                    autoClose: 3000,
                })
                setEmail("")
                setPassword("")
                return
            }
            setUserData(resp.data as UserInfoResp);
            log.info("The response received: ", resp.data)
            sessionStorage.setItem('userData', JSON.stringify(resp.data.data as UserInfoResp))
            navigate('/ipo-status')
        } catch(e) {
            log.error("Inside catch", e)
            toast.error("Try again", {
                position: "top-right",
                autoClose: 3000,
            })
        }
        
    }

    return (
        <>
            <form className="mx-auto my-auto max-w-md w-full">
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onEmailChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" onChange={onPasswordChange}/>
                </div>
                <button className="btn btn-primary" onClick={loginBtnClick} >Login</button>
            </form>
            
            <ToastContainer/>
        </>
    )
}