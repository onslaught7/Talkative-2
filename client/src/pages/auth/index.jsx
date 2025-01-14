import React from 'react'
import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { useState } from 'react'
import { FaGoogle } from "react-icons/fa"
import { toast } from 'sonner'
import { apiClient } from '../../lib/api-client'
import { SIGNUP_ROUTE, LOGIN_ROUTE } from '../../utils/constants.js'


const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    }

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(
                LOGIN_ROUTE,
                { email, password },
                { withCredentials: true }
            );
            console.log({ response });
        }
    }

    const handleSignup = async () => {
        if (validateSignup()) {
            const response = await apiClient.post(
                SIGNUP_ROUTE, 
                {email, password},
                { withCredentials: true }
            );
            console.log({ response });
        }
    }

    const handleGoogleLogin = async () => {}

    const handleGoogleSignup = async () => {}

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 
        shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl 
        grid xl:grid-cols-2">
            <div className="flex flex-col gap-10 items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center">
                        <h1 className="text:5xl font-bold md:text-6xl">Welcome</h1>
                        <img src={Victory} alt="Peace" className="h-[100px]"/>
                    </div>
                    <p className="font-medium text-center">
                        Fill in the details to get started
                    </p>
                </div>
                <div className="flex items-center justify-center w-full">
                    <Tabs defaultValue="account" className="w-3/4">
                        <TabsList className="bg-transparent rounded-none w-full">
                            <TabsTrigger 
                            value="login"
                            className="date-[state=active]:bg-transparent text-black text-opacity-90 border-b-2
                            rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold 
                            data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                            >
                                login
                            </TabsTrigger>
                            <TabsTrigger 
                            value="signup"
                            className="date-[state=active]:bg-transparent text-black text-opacity-90 border-b-2
                            rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold 
                            data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                            >
                                signup
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                            <Input
                            placeholder="Email"
                            type="Email"
                            value={email}
                            className="rounded-full p-6"
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            className="rounded-full p-6"
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                            className="rounded-full p-6"
                            onClick={handleLogin}
                            >
                            Login
                            </Button>
                            <Button
                            className="rounded-full p-6"
                            onClick={handleGoogleLogin}
                            >
                            <FaGoogle /> google
                            </Button>
                        </TabsContent>
                        <TabsContent className="flex flex-col gap-5" value="signup">
                        <Input
                            placeholder="Email"
                            type="Email"
                            value={email}
                            className="rounded-full p-6"
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            className="rounded-full p-6"
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            className="rounded-full p-6"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                            className="rounded-full p-6"
                            onClick={handleSignup}
                            >
                            Signup
                            </Button>
                            <Button
                            className="rounded-full p-6"
                            onClick={handleGoogleSignup}
                            >
                            <FaGoogle /> google
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className="hidden xl:flex justify-center items-center">
                <img className="h-[700px]" src={Background} alt="image"/>
            </div>
        </div>
    </div>
  )
}

export default Auth