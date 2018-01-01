var script = document.createElement('script');

script.src = '//code.jquery.com/jquery-1.11.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

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

    FB.Event.subscribe('xfbml.render', () => {
      FB.Event.subscribe('auth.statusChange', () => {
        //console.log("dziala ten sposob");
        loginStatus = !loginStatus
      });
      FB.Event.subscribe('auth.statusChange', disable)
    });

    FB.Event.subscribe('xfbml.render', getData);
};



  let loginStatus;

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

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

   function getData(){
     if(!loginStatus){
       disable()
       return
     }

     FB.api('/me', 'GET', {fields: 'picture.width(50).height(50), name'}, function(response) {
       const fbPicture = response.picture.data.url;
       const name = response.name

       //console.log(name, fbPicture)

       const name2Node = document.createElement('input')
         name2Node.type = "hidden"
         name2Node.setAttribute("value", name)
         name2Node.name = "name2"
       const fbPicture2Node = document.createElement('input')
         fbPicture2Node.type = "hidden"
         fbPicture2Node.setAttribute("value", fbPicture)
         fbPicture2Node.name = "fbPicture2"
       //console.log(name2Node, fbPicture2Node)

       const comments = document.querySelectorAll('.opinion2')
       const comments2 = Array.from(comments)
       $('.opinion2').append(`<input type="hidden" value='${name}' name="name2"/>`);
       $('.opinion2').append(`<input type="hidden" value='${fbPicture}' name="fbPicture2"/>`);
     });
   }

   function disable(){
     const likes = document.querySelectorAll('input.checkbox');
     const comments = document.querySelectorAll('input.addComment')
     if(!loginStatus){
       likes.forEach(elem => elem.disabled = true)
       comments.forEach(elem => elem.disabled = true)
     }
    else {
      likes.forEach(elem => elem.disabled = false)
      comments.forEach(elem => elem.disabled = false)
    }
   }


   window.addEventListener('load', () => {
    var archive = []
    var keys = Object.keys(localStorage),
        i = 0, key;
    for (; key = keys[i]; i++) {
        archive.push(JSON.parse(localStorage.getItem(key)));
    }
     //const items = localStorage.getItem()
     const buttons = document.getElementsByClassName('share');
     const shares = [...buttons]
     shares.forEach((elem, i) => {
       elem.addEventListener('click', function myFacebookLogin(e) {
         const key = e.target.getAttribute("data-key")
         const line1 = document.querySelector(`.shareLine1.x${key}`).textContent
         const line2 = document.querySelector(`.shareLine2.x${key}`).textContent
         //console.log(e.target.parentElement.childNodes[0].textContent)
         FB.login(function(){}, {scope: 'publish_actions'});
         //console.log("dziala share")
         FB.api('/me/feed', 'post', {message: `${line1}\n${line2}`});
       })
     })
     const checkboxes = document.querySelectorAll('.opinion3')
     checkboxes.forEach(elem => {
       elem.addEventListener('change', (e) => {
         //console.log(e.srcElement.checked)
         let likeObject = {
           number: e.target.dataset.likenumber,
           status: e.srcElement.checked
         }
         localStorage.setItem(`likes${e.target.dataset.likenumber}`, JSON.stringify(likeObject))
         elem.submit()
       })
     })
     //console.log(archive)
     for(let i = 0; i < archive.length; i++){
       //console.log(archive[i].number, archive[i].status)
       let oneCheck = document.querySelector(`[data-likeNumber='${archive[i].number}']`)
       oneCheck.checked = archive[i].status
     }
     let likesCounter = document.querySelectorAll('.likesCounter');
     likesCounter.forEach(elem => {
       //console.log(elem)
     })

     const input = document.querySelectorAll('.addComment');
 		 const span = document.querySelectorAll('span.disapear');

     input.forEach((el, i) => {
 			//console.log(el)
 			//console.log(span[i])
 		   el.addEventListener('focus', function() {
 				span[i].classList.add('move');
 			 })
 			el.addEventListener('blur', function(e) {
 				if(e.target.value.length == 0)
 					span[i].classList.remove('move');
 			})
 		});

    let line3 = document.querySelectorAll('.line3')
    line3.forEach(elem => {
      if(elem.childNodes.length == 2){
        const Node2 = document.createElement('span')
        Node2.setAttribute("class", "likesCounter")
        Node2.textContent = "0"
        elem.appendChild(Node2)

      }
    })
   })
