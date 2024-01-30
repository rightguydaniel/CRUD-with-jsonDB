import fs from 'fs'
import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import { error } from 'console';

interface organization {
    organization: string;
    createdAt: Date;
    updatedAt: Date;
    products: string[]
    marketValue: string
    address: string
    ceo: string
    country: string
    id: number
    noOfEmployees: number
    employees: string[]
}

const dataBaseFolder = path.join(__dirname, 'database')
const dataBaseFile = path.join(dataBaseFolder, 'database.json')
//To add data to database
export const addData = (req: IncomingMessage, res: ServerResponse)=>{
    try{
        let info = "";

        req.on('data', (chunk)=>{
            info += chunk.toString()
        })

        req.on('end', async()=>{
           let organ:organization = JSON.parse(info)

           if(!fs.existsSync(dataBaseFolder)){
            fs.mkdirSync(dataBaseFolder)
           }
           if(!fs.existsSync(dataBaseFile)){
            fs.writeFileSync(dataBaseFile, "[]", "utf-8")
           }
           
           const dataBaseContent = fs.readFileSync(dataBaseFile, "utf-8")
           const dataBase: organization[] = JSON.parse(dataBaseContent)

           
           //check if data exist
           let dataexist:boolean = false
           for(let i = 0; i < dataBase.length; i++){
            if(dataBase[i].organization === organ.organization){
                dataexist = true
            }
           }
           if(dataexist === true){
                res.writeHead(400, {"content-Type":"application/json"})
                res.end(JSON.stringify({
                message: "Data already exist",
                
                }))
           }else{
                organ.createdAt = new Date()
                organ.updatedAt = new Date()
    
                //for the Ids
                if(dataBase.length === 0){
                organ.id = 1
                }else{
                organ.id = dataBase.length + 1
                }
                //add to dB
                dataBase.push(organ)
                //write databaase to data
                fs.writeFileSync(dataBaseFile, JSON.stringify(dataBase), "utf-8")
                res.writeHead(200, {"content-Type": "application/json"})
                res.end(JSON.stringify({data:organ}))
           }
           
        })
    }catch(err:any){
        console.log(err.message)
    }
}
//Get all data
export const getAllData = async (req: IncomingMessage, res: ServerResponse)=>{
    try{
        //read dB
        const dataBaseContent = fs.readFileSync(dataBaseFile, "utf-8")
        if(dataBaseContent){
            const parsedData = JSON.parse(dataBaseContent)
            res.writeHead(200, {"content-Type":"application/json"})
            res.end(JSON.stringify({
                message: "sucessfully fetched data",
                data: parsedData
            }))
        }else{
            const parsedData = JSON.parse(dataBaseContent)
            res.writeHead(401, {"content-Type":"application/json"})
            res.end(JSON.stringify({
                message: "Data fetch unsuccessful"
            }))
        }
    }catch(err:any){
        console.log(err.message)
    }
}
//edit data
export const editData = (req: IncomingMessage, res: ServerResponse)=>{
    try{
        let info = "";

        req.on('data', (chunk)=>{
            info += chunk.toString()
        })

        req.on('end', async()=>{
            let organ:organization = JSON.parse(info)

            const dataBaseContent = fs.readFileSync(dataBaseFile, "utf-8")
            const dataFetched = JSON.parse(dataBaseContent)

            for(let i=0; i < dataFetched.length; i++){
                if(organ.organization === dataFetched[i].organization){
                    dataFetched[i].updatedAt = new Date()
                    organ.id = dataFetched[i].id
                    dataFetched[i] = organ
                    
                }
            }
            fs.writeFileSync(dataBaseFile, JSON.stringify(dataFetched), "utf-8")
            res.writeHead(200, {"content-Type": "application/json"})
            res.end(JSON.stringify({data:organ}))

        })

    }catch(err:any){
        console.log(err.message)
    }
}
//delete data
export const deleteData = (req: IncomingMessage, res: ServerResponse)=>{
    try{
        let info = "";

        req.on('data', (chunk)=>{
            info += chunk.toString()
        })
        req.on('end', async()=>{
            let organ:organization = JSON.parse(info)

            const dataBaseContent = fs.readFileSync(dataBaseFile, "utf-8")
            const dataFetched = JSON.parse(dataBaseContent)

            for(let i=0; i < dataFetched.length; i++){
                if(organ.organization === dataFetched[i].organization){
                    dataFetched.splice(i, 1)
                }
            }
            for(let i = 0; i < dataFetched.length; i++){
                dataFetched[i].id = i + 1
            }

            fs.writeFileSync(dataBaseFile, JSON.stringify(dataFetched), "utf-8")
            res.writeHead(200, {"content-Type": "application/json"})
            res.end(JSON.stringify({data:organ}))

        })

    }catch(err:any){
        console.log(err.message)
    }
}