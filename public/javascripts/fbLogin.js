window.fbAsyncInit = function() {
    FB.init({
      appId      : '129768334367976',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.11'
    });

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  let loginStatus = 6;

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   function statusChangeCallback(response){
     if(response.status === 'connected'){
       console.log("Logged in")
       //lol1(true)
       loginStatus = true;

     } else{
       console.log('Not authenticated')
       loginStatus = false;
       //lol2(false)
     }
   }

   function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }

  /*  function lol1(stat){
      if(stat){
        console.log("lol1", loginStatus)
        loginStatus = true;
        console.log("lol12", loginStatus)
      }
    }

    function lol2(stat){
      if(!stat){
        console.log("lol2", loginStatus)
        loginStatus = false;
        console.log("lol22", loginStatus)
      }
    }*/

    setTimeout(function(){
      console.log("lol3", loginStatus)
      const fbButton = document.querySelectorAll(".fb-login-button");
      console.log(fbButton)
      fbButton.forEach(element => element.addEventListener('click', () => {
        console.log("cokolwiek")
      }));
    }, 1000);
