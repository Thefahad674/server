import mongoose, { connect, mongo } from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log("DB Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/luxora-rentals`)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB