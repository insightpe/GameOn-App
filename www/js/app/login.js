var UiLogin = {
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
    if( window.localStorage.getItem("token") != null &&  window.localStorage.getItem("token") != ""){
      window.location = "principal.html";
    }
    $("#btnGoogleLogin").click(UiLogin.googleLogin);
    $("#btnFacebookLogin").click(UiLogin.facebookLogin);
    $("#btnIngresar").click(UiLogin.login);
  },

  facebookLogin: function (){
    if(event != null) event.preventDefault();

    facebookConnectPlugin.api("/me?fields=id,name,email,picture", ["public_profile", "email"], function(response) {
          console.log(response.id + " | " + response.name + " | " + response.email + " | ");
          var partsName = response.name.split(" ");
          var fName = "";
          var lName = "";
          if(partsName.length == 4){
            fName = partsName[0] + " " + partsName[1];
            lName = partsName[2] + " " + partsName[3];
          }else if(partsName.length == 3){
            fName = partsName[0];
            lName = partsName[1] + " " + partsName[2];
          }
          else if(partsName.length == 2){
            fName = partsName[0];
            lName = partsName[1];
          }else if(partsName.length == 1){
            fName = partsName[0];
          }
        var data = {
          "email": response.email,
          "fid": response.id,
          "nombre": fName,
          "apellido": lName,
          "user_img": response.picture.data.url,
        }

        $.ajax({
          url: constants.end_point + "/userapi/registration_facebook",
          type:'POST',
          dataType: "json",
          data: data,
          success: function(data) {
              console.log(data);
            if(!$.isEmptyObject(data.error)){
              Toast.fire({
                icon: 'error',
                title: data.error
              });
            }else{
              window.localStorage.setItem("deporte_id_default", data.deporte_id_default);
              window.localStorage.setItem("user_id", data.user_id);
              window.localStorage.setItem("user_name", data.user_name);
              window.localStorage.setItem("nickname", data.nickname);
              window.localStorage.setItem("user_email", data.user_email);
              window.localStorage.setItem("user_role", data.user_role);
              window.localStorage.setItem("user_img", data.user_img);
              window.localStorage.setItem("es_google_login", data.es_google_login);
              window.localStorage.setItem("es_facebook_login", data.es_facebook_login);
    
              window.localStorage.setItem("token", data.token);
              window.location = "principal.html";
            }
          }
        });
      },
      function(response){
        facebookConnectPlugin.login(["public_profile"], UiLogin.fbLoginSuccess,
          function loginError (error) {
            if(error.errorMessage.includes("[code] 1340031")){
              try{
                Toast.fire({
                  icon: 'error',
                  title: error.errorMessage.substr(error.errorMessage.lastIndexOf("[message]:")+11)
                });
              }catch(ex){
                console.error(ex)
              }
            }else{
              console.error(error)
            }
          }
        );
        console.log(response);
      }
    );
/*
    facebookConnectPlugin.login(["public_profile", "name", "email"], UiLogin.fbLoginSuccess,
      function loginError (error) {
        console.error(error)
      }
    );*/
  },
  
  fbLoginSuccess: function(userData){
    UiLogin.facebookLogin(null);
  },

  googleLogin: function (){
    event.preventDefault();
    window.plugins.googleplus.trySilentLogin(
      {
//        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': constants.google_webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': false // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      },
      function (obj) {
        var data = {
          "email": obj.email,
          "gtoken": obj.accessToken,
          "nombre": obj.givenName,
          "apellido": obj.familyName,
          "user_img": obj.imageUrl,
        }

        $.ajax({
          url: constants.end_point + "/userapi/registration_google",
          type:'POST',
          dataType: "json",
          data: data,
          success: function(data) {
              console.log(data);
            if(!$.isEmptyObject(data.error)){
              Toast.fire({
                icon: 'error',
                title: data.error
              });
            }else{
              window.localStorage.setItem("deporte_id_default", data.deporte_id_default);
              window.localStorage.setItem("user_id", data.user_id);
              window.localStorage.setItem("user_name", data.user_name);
              window.localStorage.setItem("nickname", data.nickname);
              window.localStorage.setItem("user_email", data.user_email);
              window.localStorage.setItem("user_role", data.user_role);
              window.localStorage.setItem("user_img", data.user_img);
              window.localStorage.setItem("es_google_login", data.es_google_login);
              window.localStorage.setItem("es_facebook_login", data.es_facebook_login);
   
              window.localStorage.setItem("token", data.token);
              window.location = "principal.html";
            }
          }
        });
      },
      function (msg) {
        var msgToShow = "";
        switch(msg){
          case "12501":
            msgToShow = "El inicio de sesión con google fue cancelado por favor verificarlo e intentarlo nuevamente.";
            Toast.fire({
              icon: 'error',
              title: msgToShow
            });
            break;
          default:
            UiLogin.googleLoginRetry();
        }
      }
    );
  },

  googleLoginRetry: function (){
    window.plugins.googleplus.login(
      {
//        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': constants.google_webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      },
      function (obj) {
        var data = {
          "email": obj.email,
          "gtoken": obj.accessToken,
          "nombre": obj.givenName,
          "apellido": obj.familyName,
          "user_img": obj.imageUrl,
        }

        $.ajax({
          url: constants.end_point + "/userapi/registration_google",
          type:'POST',
          dataType: "json",
          data: data,
          success: function(data) {
              console.log(data);
            if(!$.isEmptyObject(data.error)){
              Toast.fire({
                icon: 'error',
                title: data.error
              });
            }else{
              window.localStorage.setItem("deporte_id_default", data.deporte_id_default);
              window.localStorage.setItem("user_id", data.user_id);
              window.localStorage.setItem("user_name", data.user_name);
              window.localStorage.setItem("nickname", data.nickname);
              window.localStorage.setItem("user_email", data.user_email);
              window.localStorage.setItem("user_role", data.user_role);
              window.localStorage.setItem("user_img", data.user_img);
              window.localStorage.setItem("es_google_login", data.es_google_login);
              window.localStorage.setItem("es_facebook_login", data.es_facebook_login);
   
              window.localStorage.setItem("token", data.token);
              window.location = "principal.html";
            }
          }
        });
      },
      function (msg) {
        var msgToShow = "";
        switch(msg){
          case "12501":
            msgToShow = "El inicio de sesión con google fue cancelado por favor verificarlo e intentarlo nuevamente.";
            break;
          default:
            msgToShow = "Hubo un problema al iniciar sesión con google por favor volver a intentarlo más tarde."
        }
        Toast.fire({
          icon: 'error',
          title: msgToShow
        });
      }
    );
  },

  login: function () {
    event.preventDefault();
    var data = $("#frmLogin").serializeFormJSON();

    if(UiLogin.validateLogin(data)){
      $.ajax({
        url: constants.end_point + "/authapi/signin",
        type:'POST',
        dataType: "json",
        data: data,
        success: function(data) {
            console.log(data);
          if(!$.isEmptyObject(data.error)){
            Toast.fire({
              icon: 'error',
              title: data.error
            });
          }else{
            
            window.localStorage.setItem("deporte_id_default", data.deporte_id_default);
            window.localStorage.setItem("user_id", data.user_id);
            window.localStorage.setItem("user_name", data.user_name);
            window.localStorage.setItem("nickname", data.nickname);
            window.localStorage.setItem("user_email", data.user_email);
            window.localStorage.setItem("user_role", data.user_role);
            window.localStorage.setItem("user_img", data.user_img);
            window.localStorage.setItem("es_google_login", data.es_google_login);
            window.localStorage.setItem("es_facebook_login", data.es_facebook_login);
 
            window.localStorage.setItem("token", data.token);
            window.location = "principal.html";
          }
        }
      });
    }
  },

  validateLogin: function (login) {
    if (login.usuario == null || login.usuario.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un correo electrónico.'
      });
      return false;
    }

    if (login.contraseña == null || login.contraseña.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar una contraseña.'
      });
      return false;
    }

    return true;
  }
};

UiLogin.initialize();