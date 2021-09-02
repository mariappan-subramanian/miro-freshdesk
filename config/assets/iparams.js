
function getAllBoards(teamID) {
  var path = '/teams/' + teamID + '/boards?limit=10&offset=0',
    headers = { Authorization: 'bearer <%= access_token %>' },
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

function getTeam() {
  var team = JSON.parse(localStorage.getItem('team'))
  getAllBoards(team.teamID)
}

var start = (app) => {
  app.initialized().then(function (_client) {
    client = _client
    getTeam()
  })
}

document.addEventListener('DOMContentLoaded', start(app))
