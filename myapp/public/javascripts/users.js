//const { response } = require("express");
//const e = require("express");
//const nodemailer = require("nodemailer");
var acceptGmail;
let gmail ={"exportGmail" : false} 
let exports={"export" : false};
let gsort={};//global variable for sorting
let page=0;//for pagination
let previous=0;
  $("document").ready(function (){
    $("#registration").validate({
      rules:{
        firstName:{required: true,minlength: 3},
        lastName: {required: true},
        gender:{required: true},
        address:{required: true,minlength: 5},
        hobbies:{required: true},
        interestArea:{required: true},
        pImg:{required: true}
      },
      messages:{
        firstname: 
        { required: "Please enter your firstname",minlength: "Firstname must be at least 3 characters"},
        lastname:{ required: "Please enter your lastname"},
        gender:{required: "Please select a gender"},
        address: {required: "Please Enter Address",minlength: "Your Address must be at least 5 characters long"},
        hobbies: {required: "Please select a hobbies"},
        interestArea: {required: "Please Choose Ineterested Field"},
        img: {required: "Please select Passport Photo "},
      },  
      submitHandler: function(form){                                           
        let databus = new FormData($(form).get(0));
        $.ajax({
          url: '/form',
          type: 'post',
          data: databus,
          enctype: "multipart/form-data",
          contentType: false,
          cache: false,
          processData: false,
          success: function (data){
            console.log(data,"data");
            if (data.status == "success"){
              console.log("i am in submit handler");
              console.log("img name is"+data.data.pImg);
                $('#tableId').append('<tr id="'+data.data._id+'"><td>'+data.data.firstName+'</td><td>'+data.data.lastName+'</td><td>'+data.data.gender+'</td><td>'+data.data.address+
                  '</td><td><img width="100" height="70" src="/images/'+data.data.pImg+
                  '"></td><td> <button type="button" id="userEdit2" data-id="'+data.data._id+
                  '"  class="userEdit" >Edit</button>  <button type="button" data-id="'+data.data._id+
                  '" class="userDelete"  >Delete</button> </td></tr>'); 
                alert("You have successfully registered.")                       
                $('#registration').each(function () 
                {
                  this.reset(); //for reset formsss
                });
            }else{
              alert("User is not registered.  Please register the user first.")
            }
            //console.log(data)                     
            return false;
          }
        });                             
      },
    });   
    console.log("before defi");
    $(document).on('click','.userEdit',function(){
      console.log("indise edit")
      $('#userUpdate').show();
      $('#userReset').show();
      $('#userSubmit').hide();
      let userData = $(this).data('id');                
      $.ajax({
        url:'/'+userData,
        type:'GET',
        data : {id: userData},
        success : function(response) { 
            let userEditData = response.userArray;
            console.log("userEdit data is here"+response.userArray)
            console.log("after edit ajax");
            $('#userUpdate').attr('data-id',userData);
            $("#firstName").val(userEditData.firstName);
            $('#lastName').val(userEditData.lastName);
            $('#address').val(userEditData.address);
            console.log("Gender is"+userEditData.gender)
            $('#'+userEditData.gender).prop('checked','checked');
            $('#interestArea').val(userEditData.interestArea);
            console.log("hibbie ="+userEditData.hobbies)
            for(let iCnt=0;iCnt<userEditData.hobbies.length;iCnt++){
                console.log("hobbies is"+userEditData.hobbies[iCnt])
                $('#'+userEditData.hobbies[iCnt]).prop('checked',true);
            }                
            console.log("file name is"+userEditData.pImg);
            $('.pImg').html('<img src="/images/'+userEditData.pImg+'"  >');
        },
        error : function(err) {
            console.log(err);
        }
      });
    })
    $('#exportGmail').click(async function() {
        console.log("inside export gmail new");
        if($(this).val() == "exportGmail"){
          exports={"export" : true};
          gmail ={"exportGmail" : true}; 
          console.log("exportGmail click...",gmail,exports);
        } 
        acceptGmail=$('#exportGmailInput').val();
        console.log(acceptGmail);
        $('#exportGmailInput').val('')
    })
    $('#dismiss').click(async function() {
        $('#exportGmailInput').val('')
    })

    $('#userReset').click(function(){ //when user click res
        $('#userUpdate').hide();
        $('#userReset').hide();
        $('.pImg').remove();
        $('#userSubmit').show();
    })     
    $(document).on('click', '.pageTravers'  , function (){
        //page number return 1,2,3,4
        var pageNo = $(this).val();
        page=pageNo-1;  
    })
    $(document).on('click','.currentImg',function(){
      let path="/images/";
      path=$(this).val();
      console.log("path is" , path);
    })
    $(document).on('click', '.sort , .next , .previous , .pageTravers , #export'  , function (){
      if($(this).val() == "export"){
            exports={"export" : true};
            console.log("export click...");
      } 
      // when Next button click
      if($(this).val() == "next"){ 
            //page is ++ 
            page++;
            console.log("page val is "+page);
      }else if($(this).val() == "previous"){
            // when Previous button click
            //page is --
            page--    
      }
      if(page==0)  
      {
            //Disabled True previouse button when page is 0
            $(".previous").attr("disabled", true);
      }
      if(page>0){
            //Disabled False PReviouse button when page is greater than 0
            $('.previous').attr("disabled", false);
      }
       // accept Search String
      let searchValue= $( "#search" ).val()
      //accept Gender value
      let searchGender = $( "select#gender option:checked" ).val();
      //for sorting
      if($(this).data('key') &&  $(this).data('order')){ //when <a> click in User Record
            gsort={                       //globally declare object
                  key : $(this).data('key'),//set key in Object 
                  value : $(this).data('order')//set value in Object           
            }        
            console.log("gsort is",gsort);
      }
      search={ 
             //in value pass gsort object
            "sort":gsort,  
            search : {
                  // pass SearchString
                  "searchString" :searchValue,
                   //pass Gender 
                  "gender": searchGender      
            },
            pagination : {
                  //pass page
                  "page" : page  
            },
            exportValue : exports ,
            exportGmail:gmail,
            gmailId:acceptGmail
      }
      console.log("search is",search);     
      //in search var where "sort" value is "asc"
      
      $.ajax({
        url: '/',
        type: 'post',
        data: JSON.stringify(search),
        dataType:'html',
        contentType: 'application/json',
        success: function(data){
          console.log("inside success:fun",data.status);
          console.log(data);
          if(data.status == "success"){
            console.log(data);
            console.log("inside data.success");
            var totalCount = data.totalData;
            console.log("CSV is",data.exportFile); 
            console.log(data);          
            if(page == data.totalData){ 
                  $('.next').attr("disabled", true);
            }else{
                  $('.next').attr("disabled", false);
            }
            if(page==totalCount-1){
                  $('.next').attr("disabled", true);
            }
            if(data.exportFile){
                  //blob is store large binary data in single entity
                  console.log("data.exportFile",data.exportFile);
                  const blob = new Blob([data.exportFile], {type: 'application/csv'}); 
                  console.log(blob);
                  //URL.createObjectURL(blob)it is doesn't contain the actual data of the object – instead it holds a reference.
                  const csvUrl = URL.createObjectURL(blob);
                  //document.createElement() method creates the HTML element 
                  const a = document.createElement("a");//<a> tag
                  a.href = csvUrl;
                  //xls is file type
                  a.download = "data.csv";
                  //appendChild() insert new child record in parent's data 
                  document.body.appendChild(a);
                  console.log("a",a);
                  a.click(); 
                  return exports={"export" : false};
            }else if(data.exportGmail){
              return gmail={"exportGmail":false}
            }else{
              $('.tableData').html(data);
            } 
            console.log("data is here",data);
            console.log(exports);
            console.log(search);
            if(search.sort.value == 'asc'){
                  console.log(search.sort.value);
                  //change the value "asc" to "desc"
                  //$('.sort').attr('order','desc');
                  $('.sort').data('order','desc');
                  //console.log($(this).val('order'));
                  console.log(search.sort.value); 
            }else{ 
                  console.log("if desc",search.sort.value); 
                  //change the value "desc" to "asc"
                  $('.sort').data('order','asc');
                  console.log("after convert",search.sort.value);  
            }
            console.log(search);
          }         
        }        
      });
    })
  console.log("outside user update");
  $(document).on('click', '#userUpdate', function (form) {
      var id = $(this).data('id')
      console.log("inside user update");
      console.log("user update id is"+id)
      console.log('/' + id)
      let formUserData = new FormData($("#registration").get(0))
      console.log("formusrdata is "+formUserData);
      $.ajax({
          url:'/' + id,
          type: 'put',
          data: formUserData,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function(response){
            let userUpdateData=response.userArray;
            console.log("updated dta is",userUpdateData)
            console.log("firstname is", userUpdateData.firstName);
            $('.'+id).remove();
            $(".tableBody").append('<tr class='+userUpdateData._id+' ><td>'+userUpdateData.firstName+'</td><td>'+userUpdateData.lastName+'</td><td>'
            +userUpdateData.gender+'</td><td>'+userUpdateData.address+'</td><td><img  src="/images/'
            +userUpdateData.pImg+'"></td><td><button type="button" id="userEdit2" data-id='
            +userUpdateData._id+'  class="userEdit" >Edit</button> | <button type="button" data-id="'
            +userUpdateData._id+' class="userDelete" >Delete"</button></td><tr>');
            alert("User Record has been successfully updated.")
            $('#registration').each(function () 
            {
              this.reset(); //for reset forms
            });
            $('.pImg').remove();
          },                  
        error: function(err){
          console.log(err);
        }                        
      });
    });
    //Ajax and jquery for delet User Record
    $(document).on('click','.userDelete',function(){
          console.log("in Delete");
          console.log("gsort = ",gsort)
          let deleteId = $(this).data('id');
          console.log(" Delete id",deleteId);
          $.ajax({
           url:'/'+deleteId,
           type : 'DELETE',
           data: deleteId,
           success : function(data){
           if(data.status == "success"){
               $('.'+deleteId).remove();
               alert('User has been delete data');
           }else{
               alert('Error while user deleting data');
           }
           },
           error : function(err){
              console.log(err);
           }
          })
    })
  })
  //  function fndelete(event,flag){  //function call which accept (this) flag 1 for database button and flag 2 for ajax button
  //   var userId = flag == 1 ? event.path[2].id : event.id.replace('btndelete', ''); //if flag 1 then id replace with 'btndelete' ''
  //   $.ajax({
  //     url:'/'+userId+'',
  //     type:'delete',
  //     success : function(data){ 
  //       if(data.status == "success")
  //          alert("User has been Deleted")
  //          $('#'+userId).remove();
  //     }
  //   });
  // }  


// if (acceptGmail == null) {
//   console.log("If");
//   res.end("Email not Found");
// }
// else{
//   "use strict";     
//     //let account = nodemailer.createTestAccount();
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "demo830870@gmail.com", // generated ethereal user
//         pass: "Demo@123" // generated ethereal password
//       }
//     });
  
//     // setup email data with unicode symbols
//     let mailOptions = {
//       from: "demo830870@gmail.com", // sender address
//       to: acceptGmail, // list of receivers
//       subject: "CVS File", // Subject line
    
//     };
  
//     // send mail with defined transport object
//     let info = await transporter.sendMail(mailOptions)
  
//     console.log("Message sent: %s", info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
//     res.end("File Sent on your Email");
    
//   }

 // $('.exportGmail').click(async function(){
    //   console.log("inside export gmail");
      
    //   if($(this).val() == "exportGmail"){
    //     acceptGmail = prompt("Please Enter Gmail Id");
    //     gmail={"exportGmail":true};
    //     console.log(acceptGmail);
    //   }
    //   console.log("email " + acceptGmail);
    // })

 // $('.tableBody').empty();
            // for (const iCnt of data.userArray) {
            //       $('#tableId').append('<tr><td>'+iCnt.firstName+'</td><td>'+iCnt.lastName+'</td><td>'+iCnt.gender+'</td><td>'+iCnt.address+
            //       '</td><td><img width="100" height="70" src="/images/'+iCnt.pImg+
            //       '"></td><td> <button type="button" id="userEdit2" data-id="'+iCnt._id+
            //       '"  class="userEdit" >Edit</button>  <button type="button" data-id="'+iCnt._id+
            //       '" class="userDelete" >Delete</button> </td></tr>');  
            // }   