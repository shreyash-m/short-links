export  const formatDateTime = (datetime) => {
    var dd = datetime.getDate();
    var mm = datetime.getMonth() + 1;
    var yyyy = datetime.getFullYear();
    var hr = datetime.getHours();
    var min = datetime.getMinutes();
    var sec = datetime.getSeconds();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (hr < 10) {
      hr = "0" + hr;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    datetime = yyyy + "-" + mm + "-" + dd + " " + hr + ":" + min + ":" + sec;
    return datetime;
  };