var UiUsuario = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    $("#btnCerrarSesion").click(UiUsuario.logout);
    this.load();
  },

  logout: function () {
    event.preventDefault();

    if(window.localStorage.getItem("es_google_login") == "1"){
      window.plugins.googleplus.trySilentLogin(
        {
          'webClientId': constants.google_webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
          'offline': false // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function (obj) {
          window.plugins.googleplus.logout(
            function (msg) {
              window.localStorage.clear();
              window.location = "login.html";
            }
        );
        },
        function (msg) {
          
        }
      );
    }else if(window.localStorage.getItem("es_facebook_login") == "1"){
      facebookConnectPlugin.logout(function(response){
        window.localStorage.clear();
        window.location = "login.html";
      }, function(response){

      })
    }else{
      window.localStorage.clear();
      window.location = "login.html";
    }
  },

  load: function () {
    $.ajax({
      url: constants.end_point + "/userapi/get",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(window.localStorage.getItem("es_google_login") == "1" || window.localStorage.getItem("es_facebook_login") == "1"){
            if(data.data.user_img_profile == ""){
              $(".foto-usuario ").css("background-image", "url(img/cuenta-08.png)");
            }else if(data.data.user_img_profile.indexOf("/") > 0){
              $(".foto-usuario ").css("background-image", "url(" + data.data.user_img_profile + ")");
            }else{
              $(".foto-usuario ").css("background-image", "url(" + constants.assets_external + "/img/users_img/" + data.data.user_img_profile + ")");
            }
          }else
          {
            if(data.data.user_img_profile == ""){
              $(".foto-usuario ").css("background-image", "url(img/cuenta-08.png)");
            }else{
              $(".foto-usuario ").css("background-image", "url(" + constants.assets_external + "/img/users_img/" + data.data.user_img_profile + ")");
            }
          }
          
          $(".nombre-usuario").text(data.data.nombre);
        }        
      }
    });
  },
};

UiUsuario.initialize();