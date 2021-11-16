

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
                  console.log("img name is"+data.data.pImg);
                    $('#tableId').append('<tr id="'+data.data._id+'"><td>'+data.data.firstName+'</td><td>'+data.data.lastName+'</td><td>'+data.data.gender+'</td><td>'+data.data.address+
                      '</td><td><img style=width="40px" src="/images/'+data.data.pImg+
                      '"></td><td> <button type="button" id="userEdit2" data-id="'+data.data._id+
                      '"  class="userEdit" >Edit</button>  <button type="button" id="btndelete'+data.data._id+
                      '" class="userDelete" onclick="fndelete(this,2)">Delete</button> </td></tr>'); 
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
        console.log("before edit ajax");
        let userData = $(this).data('id');                
        console.log("mohit"+userData);
        //$("#userUpdate").append("<input style=background-color:orange type=button data-id='" + userData + "' class = update value=Update>");                 
        console.log("userRecord"+userData)
        $.ajax({
            url:'/'+userData,
            type:'GET',
            data : {id: userData},
            success : function(response) {
                //console.log("id is"+id); 
                let userEditData = response.userArray;
                console.log("userEdit data is here"+response.userArray)
                console.log("after edit ajax");
                $('#userUpdate').attr('data-id',userData);
                $("#firstName").val(userEditData.firstName);
                $('#lastName').val(userEditData.lastName);
                $('#address').val(userEditData.address);
                console.log("Gender is"+userEditData.gender)
                $('#'+userEditData.gender).prop('checked',true);
                $('#area').val(userEditData.interestArea);
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
    $('#userReset').click(function(){ //when user click res
      console.log("inside user reset")
      $('#userUpdate').hide();
      $('#userReset').hide();
      $('.pImg').remove();
      $('#userSubmit').show();
    })     
  })
  
  $(document).on('click', '.sort', function (){
      console.log("inside sort");
      console.log($(this).data('key'));
      
      let sort = {
        key : $(this).data('key'),
        value : $(this).data('order')
      }
      console.log(sort);
      console.log(this);
      //let userData = $(this).data('sort');//data=custom attr
      if(sort.value == 'asc')
      {
          console.log("1");
          $(this).data('order','desc');
      }else{
          console.log("-1");
          $(this).data('order','asc');
      }
      console.log(this);
      $.ajax({
        url: '/',
        type: 'post',
        data: sort,
        success: function (data){
          console.log(data);
          
          if (data.status == "success"){
            $('.tableBody').empty();
            
            for (const iCnt of data.userArray) {
              $('#tableId').append('<tr><td>'+iCnt.firstName+'</td><td>'+iCnt.lastName+'</td><td>'+iCnt.gender+'</td><td>'+iCnt.address+
                      '</td><td><img width="90px" src="/images/'+iCnt.pImg+
                      '"></td><td> <button type="button" id="userEdit2" data-id="'+iCnt._id+
                      '"  class="userEdit" >Edit</button>  <button type="button" id="btndelete'+iCnt._id+
                      '" class="userDelete" onclick="fndelete(this,2)">Delete</button> </td></tr>');  
            }
            
          
          }else{
           
          }
          //console.log(data)                     
          return false;
        }
      }); 

    
  })
  
//Delete
  function fndelete(event,flag){  //function call which accept (this) flag 1 for database button and flag 2 for ajax button
    var userId = flag == 1 ? event.path[2].id : event.id.replace('btndelete', ''); //if flag 1 then id replace with 'btndelete' ''
    $.ajax({
      url:'/'+userId+'',
      type:'delete',
      success : function(data){ 
        if(data.status == "success")
           alert("User has been Deleted")
           $('#'+userId).remove();
      }
    });
  }
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
                    console.log("firstname is", userUpdateData.firstName);
                    $("#tableId").html('<td>'+userUpdateData.firstName+'</td><td>'+userUpdateData.lastName+'</td><td>'
                      +userUpdateData.gender+'</td><td>'+userUpdateData.address+'</td><td><img src="/images/'
                      +userUpdateData.pImg+'" height=100></td><td><button type="button" id="userEdit2" data-id='
                      +userUpdateData._id+'  class="userEdit" >Edit</button> | <button type="button" id="btndelete'
                      +userUpdateData._id+' class="userDelete" onclick="fndelete(this,2)">Delete"</button></td>');
                      
                      alert("User Record has been successfully updated.")
                      $('#registration').each(function () 
                      {
                        this.reset(); //for reset formsss
                      });
                      $('.pImg').remove();

                  },                  
                  error: function(err){
                    console.log(err);
                  }
                                    
                });
              });

