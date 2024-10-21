const express = require('express');  // Make sure to require express
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const router = express.Router();


const app = express();
const port = 3000;

// Use body-parser middleware
app.use(bodyParser.json());

// In Order to Connect with the MYSQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass@word1',
    database: 'onlinejobportal'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

router.get('/jobs', async (req, res) => {
    const sql = 'SELECT * FROM jobs_list';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


// In mysql attributes are title, company, location, no_of_applicants
router.post('/addjobs', async (req, res) => {
    const { title, company, location, no_of_applicants } = req.body; // Exclude id
    const sql = 'INSERT INTO jobs_list(title, company, location, no_of_applicants) VALUES(?, ?, ?, ?)';
    db.query(sql, [title, company, location, no_of_applicants], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Job posted successfully' });
    });
});

router.delete('/jobs/:id',async(req,res)=>{
    const id=req.params.id; //extract id from parameter
    const sql='DELETE FROM jobs_list WHERE id=?';
    db.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.json({message:'Job deleted successfully'});
    });
    });

// Add the router to the app
app.use('/api', router); // Make sure to use the router with a base path

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
