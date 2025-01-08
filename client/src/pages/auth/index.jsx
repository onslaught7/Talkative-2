import React from 'react'
import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const Auth = () => {
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
                        <TabsContent className="" value="login"></TabsContent>
                        <TabsContent className="" value="signup"></TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Auth