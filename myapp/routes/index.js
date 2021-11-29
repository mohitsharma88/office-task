const { response } = require('express');
const { Parser } = require('json2csv');
const nodemailer = require("nodemailer");
const express = require('express');
var router = express.Router();
var userModel = require("../schema/user-table");
var fs=require("fs");
const fields = ['firstName', 'lastName', 'gender'];
const opts = { fields };
const uri = 'http://localhost:4000/form';
let pageLimit=5;
//let exports = {export : false};
let skip;
const limit=5;
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/form',async function (req, res, next) 
{
  try{
    let totalCount = await userModel.countDocuments();
    let pageNo = totalCount / limit;
    pageNo = Math.ceil(pageNo);
    let userData = await userModel.find().limit(5);
    res.render('registration',{userArray:userData,pageData:pageNo}); //Render User Array in HTML Table  
  }
  catch(error){
    console.log(error);
    res.send(error)
  }
});

router.post('/form',async function (req, res, next){
  try{
    var userFile = req.files.pImg;
    var userFileName = req.files.pImg.name;
    let userBodyData ={
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      address: req.body.address,
      interestArea: req.body.interestArea,
      hobbies: req.body.hobbies,
      pImg: userFileName
    }
    // console.log("userBodyData" + userBodyData.firstName);
    var data =await userModel(userBodyData)
    data.save(function (err, user){
      if (err){
        console.log("Error in Add Record" + err);
      }
      else{
        userFile.mv('public/images/' + userFileName, function (err){
          if (err) throw err;
            res.json({ status: "success" , data:user})
        });                
      }
    });
  }  
  catch (error){
    console.log(error);
    res.json({ status: "error" })
  }
});  
router.delete('/:id',async function(req, res, next){
  try{
   let userId = req.params.id;
   let userData = await userModel.findByIdAndDelete(userId)
   res.json({status : "success"});  
  }catch(e){
    console.log('error in delete'+e);
    res.json({status: "error",userarray : userData});
  } 
}); 

//edit 
  router.get('/:id',async function (req, res) {
   try{
    console.log(req.params.id);
    let userEdit = await userModel.findById(req.params.id);
    res.json({userArray: userEdit});
    }catch(error){
      res.send(error)
    }
  });
  //Update Record Using Put Method
  console.log("outside put")
  router.put('/:id', async function (req, res) {
    try{
      console.log("inside put")
      if(req.files != null)
      {
          var userFile = req.files.pImg;
          var userFileName = req.files.pImg.name;
          console.log("file name is"+userFileName);
          userFile.mv("public/images/" + userFileName, function (err) {
          if (err)
              throw err;
          });
      }
      const userBodyData = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gender: req.body.gender,
          address: req.body.address,
          hobbies: req.body.hobbies,
          pImg: userFileName,
          interestArea: req.body.interestArea,
      }
      await userModel.updateOne({_id:req.params.id }, userBodyData)
      const userData = await userModel.findOne({_id:req.params.id })  
          console.log("Successfully edit" + userData);
      res.json({userArray:userData});
    }catch(error)
    {
      console.log(error);
      res.send(error)
    }
  });
  //sorting searching
  router.post('/',async function (req, res, next){
    try{
       //console.log(req.body);
       console.log(req.body);
        //console.log("page is here",req.body.pagination.page);
        skip=req.body.pagination.page*pageLimit;
        console.log("skip is =",skip);
        let searching = {};
        if(req.body.search.searchString){
          searching= {$or: [{firstName: req.body.search.searchString},
                            {lastName:req.body.search.searchString},
                            {address:req.body.search.searchString}]}
          console.log(searching);
        }
        console.log(req.body.search.gender);
        if(req.body.search.gender== "male" || req.body.search.gender== "female" || req.body.search.gender== "other"){
          searching.gender = req.body.search.gender;
        }
        console.log(searching);
        console.log(req.body.sort.key);
        console.log(req.body.sort.value);
        //accept all record in allData for export purpose
        
        if(req.body.exportValue.export){
             try {
               let allData = await userModel.find(searching);
               const parser = new Parser(opts); //parser is not define
               var csv = parser.parse(allData);
               console.log("csv isss",csv);
               var gmailId = req.body.gmailId
               console.log(JSON.stringify(req.body ,null,2));
               console.log(req.body.exportGmail.exportGmail);
               if(req.body.exportGmail.exportGmail)
               {
                fs.writeFileSync('public/csvFiles/data.csv',csv); 
                exportGmail(gmailId);
               }else{
                 console.log("else me aya",csv);
                res.send({status : "success",exportFile : csv});
               
               }
              } catch (err) {
               console.error(err);
             }
             return;
        }
        // console.log("value is",req.body.sort.value); 
        // if(req.body.sort.value == "asc")
        // {
        //   req.body.sort.value = 1;
        // }else{
        //   req.body.sort.value = -1;
        // }
        let key2 = req.body.sort.key;
        let value2 = req.body.sort.value; 
        console.log("value is",req.body.sort.value);

        let sortTable = await userModel.find(searching).sort({[key2] : value2}).skip(skip).limit(limit);
        console.log("sortTable is",sortTable);
        let totalCount = await userModel.countDocuments(searching);
        let pageNo = totalCount / limit;
        pageNo = Math.ceil(pageNo);
        console.log(sortTable);
        //let sortTable  = await userModel.find().sort({[req.body.sort.key]:value1});
        //res.json({status : "success" , userArray : sortTable ,   });
        res.render('partials/table',{status : "success", userArray:sortTable,totalData :pageNo});
    }catch(error)
    {
      console.log("error is :",error);
      res.json({status : "error"});
    }
  });
 
async function exportGmail(gmailId) {
  try {
    console.log("i am in gmail. funtion");
    if (gmailId == null) {
          console.log("If");
          //res.end("Email not Found");
    }
    else{
          console.log("gmailId",gmailId);
          "use strict";     
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          type: "SSL",
          secure: true, // true for 465, false for other ports
          auth: {
            user: "demo830870@gmail.com", // generated ethereal user
            pass: "Demo@123" // generated ethereal password
          }
          });
          // setup email data with unicode symbols
          let mailOptions = {
            from: "demo830870@gmail.com", // sender address
            to: gmailId, // list of receivers
            subject: "CVS File", // Subject line
            attachments:[{   // file on disk as an attachment
              filename: 'data.csv',
              path: 'public/csvFiles/data.csv' // stream this file
            }]
          };
          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('Message sent: ' + info.message);
                  res.send({});
                  fs.unlinkSync('public/csvFiles/data.csv');
                  //transport.close();
              }
          })

    }  
  } catch (error) {
        console.log("Error in  function");
        throw error;
  }
  
}
module.exports = router;
   
// //Delete User By ID
//     router.delete('/delete/:id', function (req, res) {
//       try{
//         console.log("params",req.params.id);
//         userModel.findByIdAndDelete(req.params.id);
//         res.json({status:"success"});
//       }catch(error){
//         console.log();
//       }
//     });   
   
    
    
// Display/form/:id
// router.get('/display', function (req, res, next) {
//   userModel.find(function (err, dbUserArray) {
//     if (err) {
//       console.log("Error in Fetch Data " + err);
//     } else {
//       //Print Data in Console
//       console.log(dbUserArray);
//       //Render User Array in HTML Table
//       res.render('display', { userArray: dbUserArray });

//     }
//   });
// });
 

// send mail with defined transport object
      //let info = await transporter.sendMail(mailOptions)
      //console.log("Message sent: %s", info);
      //console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      //res.end("Password Sent on your Email");