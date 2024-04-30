
const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;


app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));




const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');
app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});


app.post('/signup', async (req, res) => {
    try {
        const existingUser = await LogInCollection.findOne({ name: req.body.name });
        if (existingUser) {
            return res.send("User details already exist");
        }
        
        const newUser = new LogInCollection({
            name: req.body.name,
            password: req.body.password
        });
        await newUser.save();
        res.status(201).render("home", { naming: req.body.name });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ name: req.body.name });
        if (!user || user.password !== req.body.password) {
            return res.send("Incorrect username or password");
        }
        res.status(201).render("home", { naming: req.body.name });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log('Server is running on port', port);
});
