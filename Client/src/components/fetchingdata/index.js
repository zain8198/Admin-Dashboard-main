import axios from "axios"

export const fetchingdata=async(URL)=>{
             const jsondata= await fetch(URL)
                  const result=await jsondata.json()
                        return result
}