	/*global muxingID, socket */
	function post(event) {

		var messageData = {
			state: event.target.id, 
			socketId: muxingID 
		};

		socket.emit( 'multiplex-statechanged', messageData );

	};

	// Monitor events that trigger a change in state
    document.addEventListener( "impress:stepenter", post , false );