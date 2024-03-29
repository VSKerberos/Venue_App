const express = require("express");

const {google} = require("googleapis");

const  app = express();

const { check, validationResult } = require('express-validator');
const { name } = require("ejs");

//const getRows=any[][] | null;

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));


app.get("/",(req,resp)=> {

    resp.render('pages/home');
});



app.get('/home',(req,res)=>{
    res.render('pages/home');

   
});

// DELETE
app.get('/delete/:id', async (req, res) => {
    console.log("DELETE review");
    console.log('id:'+req.params.id);
    const auth = new google.auth.GoogleAuth({
        keyFile:"credentials.json",
        scopes:"https://www.googleapis.com/auth/spreadsheets"
    });
    
      // Create client instance for auth
      const client = await auth.getClient();


      const spreadsheetId ="19BPOLORbAcydXJIBPGdItksC1Tc8WHLBHuXVVm6scw0";
  
      // Instance of Google Sheets API
  
      const googleSheets = google.sheets({ version:"v4", auth: client });
    // Read rows from spreadsheet

  const  getRows = await googleSheets.spreadsheets.values.get({
    auth,

    spreadsheetId,

    range: "Sheet1",

});
  })

app.post("/home",
[
    check('name', 'This username must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('name', 'Email is not valid')
        .notEmpty()
],
async (req,resp) => {

    const {name,surname,phone} = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile:"credentials.json",
        scopes:"https://www.googleapis.com/auth/spreadsheets"
    });


    // Create client instance for auth
    const client = await auth.getClient();


    const spreadsheetId ="19BPOLORbAcydXJIBPGdItksC1Tc8WHLBHuXVVm6scw0";

    // Instance of Google Sheets API

    const googleSheets = google.sheets({ version:"v4", auth: client });

    // Get Metadata about spreadshets

    const metaData = await googleSheets.spreadsheets.get( {
        auth,
        spreadsheetId


    });


    


    // Write row(s) to spreadsheet

 const writeRows =  await googleSheets.spreadsheets.values.append( {
        auth,

        spreadsheetId,

        range:"Sheet1",

        valueInputOption:"USER_ENTERED",

        resource: {
         
            values: [
                [name,surname,phone]
                
            ]
        }


    });
 
    resp.send("Successfully submitted! Thank you!");

});
 

app.get("/list", async (req,resp)=> {

    const auth = new google.auth.GoogleAuth({
        keyFile:"credentials.json",
        scopes:"https://www.googleapis.com/auth/spreadsheets"
    });
    
      // Create client instance for auth
      const client = await auth.getClient();


      const spreadsheetId ="19BPOLORbAcydXJIBPGdItksC1Tc8WHLBHuXVVm6scw0";
  
      // Instance of Google Sheets API
  
      const googleSheets = google.sheets({ version:"v4", auth: client });
    // Read rows from spreadsheet

  const  getRows = await googleSheets.spreadsheets.values.get({
    auth,

    spreadsheetId,

    range: "Sheet1",

});

getRows.data.values
    resp.render("list", {
        name:getRows.data.values
        
        
    });
    console.log(getRows.data.values);
    console.log(getRows.data.range);
});



app.listen(1337, (req,resp) => console.log("running on 1337"));