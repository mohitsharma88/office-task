const { response } = require('express');
var express = require('express');
var router = express.Router();
var userModel = require("../schema/user-table");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/form', function (req, res, next) 
{
  userModel.find(function (err, dbUserArray){
    if(err){
      console.log("Error in Fetch Data " + err);
    } else{
      res.render('registration',{userArray:dbUserArray}); //Render User Array in HTML Table   
    }
  });
});

router.post('/form', function (req, res, next){
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
        var data = userModel(userBodyData)
        console.log("data is "+data);
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
   console.log("Succesfully Data Deleted"+userData);
   res.json({status : "success"});
     
  }catch(e){
    console.log('error in delete'+e);
     res.json({status: "success"});
  } 
 }); 

    //Delete User By ID
    // router.delete('/delete/:id', function (req, res) {
    //   userModel.findByIdAndDelete(req.params.id, function (err, project) {
    //     if (err) {

    //       console.log("Error in Record Delete " + err);
    //       res.redirect('/display');
    //     } else {
    //       console.log(" Record Deleted ");
    //       res.redirect('/display');
    //       res.json()
    //     }
    //   });
    // });

//Display
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


    router.get('/:id', function (req, res) {

      console.log(req.params.id);

      userModel.findById(req.params.id, function (err, dbUserArray) {
        if (err) {
          console.log("Edit Fetch Error " + err);
        } else {
          res.json({userArray: dbUserArray });

        }
      })
    }
    );

    // //Update Record Using Post Method
    // router.post('/edit-user/:id', function (req, res) {

    //   var userFile = req.files.pImg;
    //   var userFileName = req.files.pImg.name;

    //   userFile.mv('public/productphoto/' + userFileName, function (err) {
    //     if (err)
    //       throw err;
    //     //res.send('File uploaded!');
    //   });

    //   console.log("Edit ID is" + req.params.id);

    //   const userBodyData = {
    //     firstName: req.body.firstName,
    //     lasstName: req.body.lastName,
    //     gender: req.body.gender,
    //     address: req.body.address,
    //     hobbies: req.body.hobbies,
    //     pImg: userFileName,
    //     interestArea: req.body.interestArea,
    //   }

    //   userModel.findByIdAndUpdate(req.params.id, userBodyData, function (err, dbUserArray) {
    //     if (err) {
    //       console.log("Error in Record Update");
    //     } else {
    //       console.log("Successfully edit" + dbUserArray)
    //       res.redirect('/display');
    //     }
    //   });
    // });


    module.exports = router;


    