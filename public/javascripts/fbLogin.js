const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://projekt_www:projekt@ds129156.mlab.com:29156/projekt_www";

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

   /*function myFacebookLogin() {
     FB.login(function(){}, {scope: 'publish_actions'});
     console.log("dziala share")
     FB.api('/me/feed', 'post', {message: 'Other message!'});
   }*/

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

   window.addEventListener('load', () => {
     let buttons = document.getElementsByClassName('share');
     let shares = [...buttons]
     shares.forEach((elem, i) => {
       elem.addEventListener('click', function myFacebookLogin(e) {
         let key = e.target.getAttribute("data-key")
         let line1 = document.querySelector(`.shareLine1.x${key}`).textContent
         let line2 = document.querySelector(`.shareLine2.x${key}`).textContent
         //console.log(e.target.parentElement.childNodes[0].textContent)
         FB.login(function(){}, {scope: 'publish_actions'});
         console.log("dziala share")
         FB.api('/me/feed', 'post', {message: `${line1}\n${line2}`});
       })
     })
     MongoClient.connect(url, function(err, db) {
       if (err) throw err;
       var myobj = { name: "Company Inc", address: "Highway 37" };
       db.collection("users").insertOne(myobj, function(err, res) {
         if (err) throw err;
         console.log("1 document inserted");
         db.close();
       });
     });
   })
