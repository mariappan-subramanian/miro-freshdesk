
function getAllBoards(teamID) {
  var path = '/teams/' + teamID + '/boards?limit=10&offset=0',
    headers = { Authorization: 'Bearer <%= access_token %>' },
    reqData = { headers: headers, isOAuth: true },
    url = 'https://api.miro.com/v1' + path;
  client.request.get(url, reqData)
    .then(function (data) {
      var response = JSON.parse(data.response);
      if (response.length == 0) {
        console.log('No boards in your current connected account');
      } else {
        response.data.map(function (board, index) {
          if (board.type === 'board')
            console.log(index + ' ' + board.id)
          document.getElementById('board').insertAdjacentHTML('beforeend', `<option id=${board.id}>${board.name}</option>`);
        })
      }
    }, function () {
      console.log('Error displaying boards');
    });
}

function getAuthDetails() {
  var path = '/oauth-token',
    headers = { Authorization: 'bearer <%= access_token %>' },
    reqData = { headers: headers, isOAuth: true },
    url = 'https://api.miro.com/v1' + path;
  client.request.get(url, reqData)
    .then(function (data) {
      var response = JSON.parse(data.response);
      console.log('getting auth details', data.response)
      var team = {
        teamID: response.team.id,
        teamName: response.team.name
      }
      storeTeam(team)
      if (response.length == 0) {
        console.log("No boards in your current connected account.");
      } else {
        getAllBoards(team.teamID)
      }
    }, function () {
      console.log("Error displaying boards");
    });

  function storeTeam(team) {
    client.db.set( "team", team).then (
      function(data) {
        console.log('team tracked successfully', data)
      },
      function(error) {
        // failure operation
        console.log('error tracking selected team', error)
      });
  }
}

var start = (app) => {
  app.initialized().then(function (_client) {
    client = _client
    getAuthDetails()
  })
}

document.addEventListener('DOMContentLoaded', start(app))
