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

   function statusChangeCallback(response){
     if(response.status === 'connected'){
       //console.log("Logged in")
       loginStatus = true;
       testApi();
     } else{
       //console.log('Not authenticated')
       loginStatus = false;
     }
   }

   function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }

    function testApi(){
      FB.api('/me?fields=name,email', function(response){
        if(response && !response.error){
          //console.log(response.name)
        }
      })
    }

    document.addEventListener('DOMContentLoaded', () => {
      //console.log("lol3", loginStatus)
      const fbButton = document.querySelectorAll(".fb-login-button");
      fbButton.forEach( element => element.addEventListener('click', () => {
        //console.log("cokolwiek")
      }));
    });


    document.addEventListener('DOMContentLoaded', () => {
      const searchForm = document.getElementById('searchForm')
      searchForm.addEventListener('submit', (e) => {
        const searchBar = document.getElementById('searchBar')
        let film = searchBar.value;
        getMovies(film);
        e.preventDefault();
      })
    });

    function getMovies(film){
      axios.get('http://www.omdbapi.com?s='+film+'&apikey='+'8a68bfda')
      .then((response) => {
        let films = response.data.Search;
        //console.log(films)
        let data = ''
        films.forEach( (elem, index) => {
          if(elem.Type === 'movie'){
            if(elem.Poster === "N/A"){
              elem.Poster = "https://www.eou.edu/theatre/files/2016/08/NO-POSTER-AVAILABLE.jpg"
            }
            data += `
              <div class='eachMovie'>
                <img src='${elem.Poster}'>
                <div class='hide'><h4>${elem.Title}</h4></div>
                <a onclick="addSelected('${elem.imdbID}')" class='moreButton' href='#'>More</a>
              </div>
            `
          }
        });
        document.querySelector('.films').innerHTML = data;
      })
      .catch((err) => {
        console.log(err);
      });
    }

    function addSelected(id){
      sessionStorage.setItem('movieID', id);
      window.location = 'movie';
      getMovie()
      return false;
    }

    function getMovie(){
      let movieID = sessionStorage.getItem('movieID')
      //console.log(movieID)
    }

    const input = document.querySelectorAll('.field');
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
