const portNum = 8002;

let redirect = (fileName) => {
    let currentUrl = window.location.href;
    let baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    let newUrl = baseUrl + fileName+ '.html';
    window.location.href = newUrl;
}

let checkState = (callback) => {
    fetch(`http://127.0.0.1:${portNum}/status`)
    .then(response => response.json())
    .then(data => {
        callback(data.printer.state);
    })
    .catch(error => {
        callback("IDLE");
    });
}

let updateInterval = 2000;

/// MAIN LOOP ///
setInterval(() => {
  checkState((state) => {
    if (state == 'PRINTING') {
      redirect('dashboard');
    }
  });
}, updateInterval);