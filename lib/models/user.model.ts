import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    id: {type: String , required: true},
    username: {type: String, required: true, unique:true},
    name: {type:String, required: true},
    image: String,
    bio: String,
    // Meaning one user can have many references to 
    // threads stored in the DB
    threads : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    // Status if user has been onboarded
    onboarded : {
        type: Boolean,
        default: false,
    },
    // One user can belong to many communities
    //  Community is a type of Objectid and has a ref
    //  to community instance in DB
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ],
    /* User stores results of tests they finish
        Results is an array of objects, each object
        containing a test reference and score
    */
    results : [{
        test : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        },
        score : {
            type: Number,
            default: 0,
        }
    }]

});

// We do it like this because the first time there will be no
// user model, so it will create User based on userSchema. 
// After that it will make based on User model
const User = mongoose.models.User || mongoose.model('User',userSchema);

export default User;