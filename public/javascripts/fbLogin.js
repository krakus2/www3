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

  let loginStatus;

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   function myFacebookLogin() {
     FB.login(function(){}, {scope: 'publish_actions'});
     FB.api('/me/feed', 'post', {message: 'Other message!'});
   }

   function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }

   function statusChangeCallback(response){
     if(response.status === 'connected'){
       console.log("Logged in")
       loginStatus = true;

     } else{
       console.log('Not authenticated')
       loginStatus = false;
     }
   }
