import mongoose from 'mongoose';

const dancerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    table: {
        type: Number,
        required: false,
    },
    seat: {
        type: Number,
        required: false,
    },
});

const Dancer = mongoose.model('Dancer', dancerSchema);

export default Dancer;
