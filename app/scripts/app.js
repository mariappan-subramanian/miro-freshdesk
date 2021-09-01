document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};

var boardDetails, teamID

function showModal(boardID) {
  client.interface.trigger('showModal', {
    title: 'Share your miro board',
    data: { board: boardID, teamID: teamID },
    template: 'views/modal.html'
  })
    .then(
      function (data) {
        console.log('Parent:InterfaceAPI:showModal', data);
      },
      function (error) {
        console.log('Parent:InterfaceAPI:showModal', error);
      }
    );
}

function onAppActivate() {
  getAuthDetails(getBoards)
  function getAuthDetails(callback) {
    var path = '/oauth-token',
      headers = { Authorization: 'bearer <%= access_token %>' },
      reqData = { headers: headers, isOAuth: true },
      url = 'https://api.miro.com/v1' + path;
    client.request.get(url, reqData)
      .then(function (data) {
        var response = JSON.parse(data.response);
        teamID = response.team.id
        var teamName = response.team.name
        if (response.length == 0) {
          document.querySelector('#boards').innerHTML += "<div class='alert alert-warning'>No boards in your current connected account.</div>";
        } else {
          document.getElementById('title').innerHTML += "<span class='text-primary'>" + teamName + '</span> boards'
          callback(teamID)
        }
      }, function () {
        document.querySelector('#boards').innerHTML += "<div class='alert alert-danger'>Error displaying boards</div>";
      });
  }
  
  function getBoards(teamID) {
    var html = '';
    var path = '/teams/' + teamID + '/boards?limit=10&offset=0',
      headers = { Authorization: 'bearer <%= access_token %>' },
      reqData = { headers: headers, isOAuth: true },
      url = 'https://api.miro.com/v1' + path;
    client.request.get(url, reqData)
      .then(function (data) {
        var response = JSON.parse(data.response);
        if (response.length == 0) {
          document.querySelector('#boards').innerHTML += "<div class='alert alert-warning'>No boards in your current connected account.</div>";
        } else {
          response.data.map(function (board, index) {
            if (board.type === 'board')
              html = "<div class='miro-div'><div class='miro-board-icon'></div><a target='_blank' href=" + board.viewLink + ">" + board.name + "</a><fw-button class='btn-share' color='secondary' size='small'><fw-icon name='open-new-tab' color='black'></fw-icon></fw-button></div>";
            document.querySelector('#boards').insertAdjacentHTML('beforeend', html);
            document.querySelectorAll('.btn-share')[index].addEventListener('click', () => showModal(board.id))
          })
        }
      }, function () {
        document.querySelector('#boards').innerHTML += "<div class='alert alert-danger'>Error displaying boards</div>";
      });
  }
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}
