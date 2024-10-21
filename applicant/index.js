const express=require('express');
const router=express.Router();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();
const port=3001;

app.use(bodyParser.json()); //first we need to write this then after only we need to use router
app.use('/api', router);

mongoose.connect('mongodb://0.0.0.0:27017/onlinejobportal')
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log(err));

const applicantSchema=new mongoose.Schema({
    id:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    resume:{type:String,required:true},
    appliedjobs:[{type:Number}] //job ids
});

const Applicant=mongoose.model('Applicant',applicantSchema);

router.post('/apply',async(req,res)=>{
    const{id,name,email,phone,resume,jobs}=req.body;
    const newApplicant=new Applicant({
        id,
        name,
        email,
        phone,
        resume,
        appliedJobs:[jobs]
    });
    try{
        await newApplicant.save();
        res.status(201).json(newApplicant);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
});

router.get('/applicants/jobs/:jobs', async (req, res) => {
    const jobIds = req.params.jobs.split(',').map(Number); // Split and convert to numbers

    try {
        const applicants = await Applicant.find({ appliedjobs: { $in: jobIds } }); // Use $in to match any job ID
        res.json(applicants);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving applicants' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






