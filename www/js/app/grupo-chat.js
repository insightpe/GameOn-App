var UiGrupoChat = {
  isFirstImg: true,
  partido_id: 0,
  chats: [],
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
    $("#btnSend").click(this.send);
    UiGrupoChat.partido_id = app.getUrlVars().partido_id;
    this.load(UiGrupoChat.partido_id);
    setInterval(function(){
      UiGrupoChat.loadMensaje(UiGrupoChat.partido_id);
    }, 5000);
    
    $("#escribir-mensaje").on("keydown", this.onEnterTexto);
  },

  onEnterTexto: function(e){
    if (e.keyCode === 13) {
      e.preventDefault();
      $("#btnSend").click();
    }
  },

  send: function(){
    if($("#escribir-mensaje").val().trim() == ""){
      Toast.fire({
        icon: 'error',
        title: "No puedes enviar un mensaje vacío."
      });
      return;
    }

    var data = {
      "mensaje" : $("#escribir-mensaje").val(),
      "partido_id": UiGrupoChat.partido_id,
      "fecha_hora": new Date().toMysqlFormat()
    };

    $.ajax({
      url: constants.end_point + "/partidoapi/enviar_mensaje",
      type:'POST',
      headers: { 'Authorization': window.localStorage.getItem("token") },
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
          $("#escribir-mensaje").val("");
          UiGrupoChat.loadMensaje(UiGrupoChat.partido_id);
        }
      }
    });
  },

  loadMensaje: function(partido_id){
    app.applyBlockUI = false;
    $.ajax({
      url: constants.end_point + "/partidoapi/list_by_partido_id?partido_id=" + partido_id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          //$("#sec-chat").empty();
          var rowAlt = true;
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            if(UiGrupoChat.chats.includes(row.chat_id)){
              continue;
            }
            UiGrupoChat.chats.push(row.chat_id);
            var campo = $("#tmpl-chat").clone();
            var html = campo.html();
            
            if(row.enviador_es_google_login == 1 || row.enviador_es_facebook_login == 1){
              html = html.replace("[user_img]",  row.enviador_img);
            }else{
              if(row.enviador_img == ""){
                html = html.replace("[user_img]",  "img/cuenta-08.png");
              }else{
                html = html.replace("[user_img]",  constants.assets_external + "/img/users_img/" + row.enviador_img);
              }
            }
            if(app.getUserSession().user_id == row.user_id){
              campo.addClass("mensaje-propio");
            }
            html = html.replace("[nombre]",  row.enviador_nombre);
            html = html.replace("[mensaje]",  row.message);
            
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-chat").append(campo);
            //rowAlt = !rowAlt;

            $('.tarjeta-imagen-usuario').each(function(k,v){
              var cw = $(this).width()+4;
              $(this).css({'height':cw+'px'});
            });

            /*setTimeout(function(){
              $([document.documentElement, document.body]).animate({
                scrollTop: $($(".tarjeta-usuario")[$(".tarjeta-usuario").length-1]).offset().top
              }, 250);
            }, 250);*/
          }
          setTimeout(function(){
            $([document.documentElement, document.body]).animate({
              scrollTop: $($(".tarjeta-usuario")[$(".tarjeta-usuario").length-1]).offset().top
            }, 250);
          }, 250);
        }        
      }
    });
  },

  load: function(partido_id){
    $.ajax({
      url: constants.end_point + "/partidoapi/get?partido_id=" + partido_id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#lblNombreGrupo").text(data.data.nombre);
        }        
      }
    });

    this.loadMensaje(partido_id);
  },
};

UiGrupoChat.initialize();