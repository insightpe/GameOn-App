var constants = {
  //end_point:"http://localhost:8080/GameOn-Web/api",
  end_point:"https://gameon.insight.pe/api",
  assets_external:"https://gameon.insight.pe/assets",
  map_api_key: "AIzaSyAFa1mGy6acRxCPL-QTSQ0Q4lk2Lkea7bg",
  google_webClientId: '730705648331-nujauc4d4bra15r3qb8astcme32rp94m.apps.googleusercontent.com',
  deporte_id_default: 1
  //https://gameon.insight.pe/
  //end_point:"http://190.156.243.6:8484",
 // end_point:"http://localhost:49220",
  //end_point_download_concept:"http://190.156.243.6:8383/PDF/",
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  grow: 'fullscreen',
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})