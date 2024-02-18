const express = require("express");
const app = express();

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
    credential : admin.credential.cert(credentials)
});


app.use(express.json());

app.use(express.urlencoded({extended : true}));


//CRUD pour utilisateur fih les function dyal l'utilisateur 
////////////////////////////////////////
let lastId = 0;

function getNextId() {
    lastId++;
    return lastId;
}

app.post('/user/create', async (req, res) => {
    try {
        const id = getNextId();
        const userJson = {
            id: id,
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            age: req.body.age
        };
        await db.collection("user").doc(id.toString()).set(userJson);
        res.status(200).send(`User created successfully with ID: ${id}`);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("An error occurred while creating the user");
    }
});


app.get('/user/read/all' , async (req , res) => {
    try {
        const userRef = db.collection("user");
        const response = await userRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    }catch(error){
        res.send(error);
    }
});


app.get('/user/read/:id' , async (req , res)=>{
    try {
        const userRef = db.collection("user").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    }catch(error) {
        res.send(error);
    }
});


app.put('/user/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = db.collection("user").doc(id);
        const updateData = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            age: req.body.age
        };
        await userRef.update(updateData);
        res.status(200).send(`User with ID ${id} updated successfully`);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred while updating the user");
    }
});


app.delete('/user/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = db.collection("user").doc(id);
        await userRef.delete();
        res.status(200).send(`User with ID ${id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("An error occurred while deleting the user");
    }
});

//fonction de budget cruud

app.post('/budget/create', async (req, res) => {
    try {
        const userId = req.body.userId; 
        const budgetId = getNextId(); 
        const budgetJson = {
            id: budgetId,
            userId: userId, 
            amount: req.body.amount,
        };
        await db.collection("budget").doc(budgetId.toString()).set(budgetJson);
        res.status(200).send(`Budget created successfully with ID: ${budgetId}`);
    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).send("An error occurred while creating the budget");
    }
});



const db = admin.firestore();


const PORT = process.env.PORT || 8080 ; 
app.listen(PORT , ()=>{
    console.log(`Server is running on Port ${PORT}.`);
})
