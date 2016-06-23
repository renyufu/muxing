	socket.on('' + muxingID, function(data) {
		// ignore data from sockets that aren't ours
		if (data.socketID !== muxingID) { return; }
		if( window.location.host === 'localhost:1947' ) return;

		Reveal.setState(data.state);
	});