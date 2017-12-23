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

    function finished_rendering() {
      console.log("finished rendering plugins");
    }

    FB.Event.subscribe('xfbml.render', () => {
      FB.Event.subscribe('auth.statusChange', () => {
        loginStatus = !loginStatus
      });
      FB.Event.subscribe('auth.statusChange', disable);
      console.log(loginStatus,"hey, i'm loginStatus from FB")
    });
    // In your onload handler
    FB.Event.subscribe('xfbml.render', showMovie);
  };

  let loginStatus;
  let name;
  let userID;
  let fbPicture;

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
       loginStatus = true;
       getData();
       getPicture();
     } else{
       console.log('Not authenticated')
       loginStatus = false;
     }
   }

    function getData(){
      FB.api('/me?fields=name,email,id', function(response){
        if(response && !response.error){
          name = response.name;
          userID = response.id;
          console.log(name, userID)
        }
      })
    }

    function getPicture() {
			FB.api('/me', 'GET', {fields: 'picture.width(50).height(50)'}, function(response) {
				fbPicture = response.picture.data.url;
			});
		}

    function refreshPage(){
      window.location.reload();
    }

    function disable(){
      const submit = document.querySelector("input[type='submit']")
      console.log("dziala", submit, loginStatus)
      if(!loginStatus){
        //console.log(submit, loginStatus)
        submit.setAttribute("disabled", "true")
        submit.setAttribute("title", "Login by Facebook to add film")
      }else{
        submit.removeAttribute("disabled", "true")
        submit.removeAttribute("title", "Login by Facebook to add film")
      }
    }

    function showMovie(){
      let date = Date.now();
      let movieID = sessionStorage.getItem('movieID')
      console.log(movieID, date)
      axios.get('http://www.omdbapi.com?i='+movieID+'&apikey='+'8a68bfda')
      .then((response) => {
        let film = response.data;
        console.log(film)
        let data = ''
        if(film.Poster === "N/A"){
          film.Poster = "https://lh5.googleusercontent.com/LONlbb-klLzFmlALezI1kSQyKEZjVEQykay0sSPkHOlVgpA-GGXojBPJzibEA3Or28kgRqpC6B10CzyuUHGF=w1259-h964"
        }
        if(name === "undefined"){
          name = "Default User"
        }
        if(fbPicture === "undefined"){
          fbPicture = "https://lh5.googleusercontent.com/gDTVdOEsHEFpnLYMuDeMpxRCT_TJbqF5ZUssoOtGt6N1ti8disGJQApkKas7R5fkbqNfqbhfGNtARP3T16kp=w1919-h964"
        }
        data = `
          <img src='${film.Poster}'>
          <div class='column'>
            <div class='row'><h3>${film.Title} (${film.Year})</h3></div>
            <div class='row'><div class='one'>${film.Plot}</div></div>
            <table class='table'>
              <tr>
                <td>Director</th>
                <td>${film.Director}</th>
              </tr>
              <tr>
                <td>Actors</th>
                <td>${film.Actors}</th>
              </tr>
              <tr>
                <td>RunTime</th>
                <td>${film.Runtime}</th>
              </tr>
              <tr>
                <td>Genre</th>
                <td>${film.Genre}</th>
              </tr>
              <tr>
                <td>Country</th>
                <td>${film.Country}</th>
              </tr>
              <tr>
                <td>Score</th>
                <td>${film.imdbRating} from ${film.imdbVotes} Votes</th>
              </tr>
              </table>
                <div class='form'>
                <form class='opinion' method="post" action="/addname">
                  <input type="text" value="${name}" class='displayNone' name='name'>
                  <input type="text" value="${fbPicture}" class='displayNone' name='fbPicture'>
                  <input type="text" value="${date}" class='displayNone' name='date'>
                  <input type="text" value="${film.Title}" class='displayNone' name='filmName'>
                  <input type="text" value="${film.Poster}" class='displayNone' name='poster'>
                  <input type="range" name="myScore" min="0" max="10"><br>
                  <textarea rows="4" cols="50" placeholder='Your Opinion' class='myOpinion' name='myOpinion'></textarea><br>
                  <input type="submit" value="Add Film">
                </form>
              </div>
          </div>
        `
        document.querySelector('.oneFilm').innerHTML = data;
        disable();
      })
      .catch((err) => {
        console.log(err);
      });
    }

    /*  <div class='row'><div class='one'>RunTime</div><div class='two'>${film.Runtime}</div></div>
      <div class='row'><div class='one'>Genre</div><div class='two'>${film.Genre}</div></div>
      <div class='row'><div class='one'>Genre</div><div class='two'>${film.Genre}</div></div>

      <input type="text" value="http://graph.facebook.com/${userID}/picture" class='displayNone' name='fbPicture'>*/
