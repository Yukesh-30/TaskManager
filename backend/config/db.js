import { connect } from 'mongoose';

const connectDB = async () =>{
    
    try { 
        await connect("mongodb+srv://yukesh:yukesh@task.no6fmzn.mongodb.net/?retryWrites=true&w=majority&appName=task");
        console.log("DB connected");
    } catch (error) {
        console.log("Error in connecting the database");
        process.exit(1);
    }
}

export default connectDB