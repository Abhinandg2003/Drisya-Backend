import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import cmsRouter from './routes/cmsRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()

// middlewares
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/cms',cmsRouter)

app.get('/',(req,res)=>{
    res.send("Drishya Marbles & Tiles CMS API is running")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))

