const { response } = require('express');
var express = require('express');
var router = express.Router();
var userModel = require("../schema/user-table");
const uri = 'http://localhost:4000/form';
var sort;
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/form',async function (req, res, next) 
{
  try{
    console.log("******");
    console.log(req.body);
    let userData = await userModel.find();
    res.render('registration',{userArray:userData}); //Render User Array in HTML Table  
  }
  catch(error)
  {
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
     res.json({status: "error",userarray : userData});
  } 
 }); 

//edit 
  router.get('/:id',async function (req, res) {
   try{
    console.log(req.params.id);
    let userEdit = await userModel.findById(req.params.id);
    res.json({userArray: userEdit});
  }catch(error)
   {
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
      
      console.log("Edit ID is" + req.params.id);
      
      const userBodyData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        address: req.body.address,
        hobbies: req.body.hobbies,
        pImg: userFileName,
        interestArea: req.body.interestArea,
      }
      console.log(userBodyData);
      await userModel.updateOne({_id:req.params.id }, userBodyData)
      const userData = await userModel.findOne({_id:req.params.id })  
         console.log("Successfully edit" + userData);
      res.json({userArray:userData});
    }catch(error)
    {
      console.log("---------------------------------");
      console.log(error);
      res.send(error)
    }
  });

  router.post('/',async function (req, res, next){
    try{
        console.log(req.body);
        let value1= req.body.value 
        console.log("value is"+value1);
        if(value1 == "asc")
        {
          value1 = 1;
        }else{
          value1 = -1;
        }
        console.log("value is"+value1);
        const sort= {[req.body.key]:value1};
              //sort={[value]:req.body.value};  
        let sortTable  = await userModel.find().sort({[req.body.key]:value1});
        res.json({status : "success" , userArray : sortTable})
        console.log(sort);

    }catch(error)
    {
      console.log("error is :",error);
      res.json({status : "error"});
    }
  });

module.exports = router;
   
   
   
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
 