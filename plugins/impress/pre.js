	/*global muxingID, impress, socket */
	var api = impress();

	socket.on(muxingID, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketId !== muxingID) { return; }
		if( window.location.host === 'localhost:1947' ) return;

		api.goto(data.state);
	});