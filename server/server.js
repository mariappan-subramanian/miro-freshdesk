exports = {

  /**
   * @desc - 
   * 
   * This app makes a API request to create a new card in the selected miro board during installation.
   * This app does not have any page to show up in the support portal, it works as a backround service which will
   * do the task creating action in the background whenever a ticket is created in Freshdesk.
   * 
   * Product events with corresponding callback functions to perform an action is registered as follows.
   */

  events: [
    { event: 'onTicketCreate', callback: 'onTicketCreateHandler' }
  ],

  /**
   * In the following event listerner method, workspace_id and project_id have been taken from installation parameters.
   * Subject of the ticket is an attribute of ticket object in the payload from the event trigger.
   */

  onTicketCreateHandler: function (payload) {
    console.log('ticket', payload.data.ticket)
    var ticket = payload.data.ticket
    $request.post('https://api.miro.com/v1/boards/' + payload.iparams.board_details.boardID + '/widgets', {
      headers: {
        'Authorization': 'Bearer <%= access_token %>' // Here, access_token is passed safely which is a secure installation parameter
      },
      isOAuth: true,
      json: { "type": "card", "style": { "backgroundColor": "#228022" }, "title": "<h3>" + ticket.subject + "</h3>", "description": ticket.description, "date": new Date(ticket.created_at).toISOString().slice(0, 10) }
    })

      .then(function (data) {
        console.log('Successfully created card in miro board' + JSON.stringify(data));
      },

        function (err) {
          console.log('Unable to create card in miro' + JSON.stringify(err));
        });
  }
};
