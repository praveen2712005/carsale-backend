 import mongoose from 'mongoose'
 export async function connectdb(){
    try {
        let connection = await mongoose.connect('mongodb+srv://admin:123@cluster0.cbvx8ro.mongodb.net/?appName=Cluster0')
        console.log("database successfully connected")
    } catch (error) {
        console.log(error)
    }
}