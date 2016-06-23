	//if ( window.location.search.match( /receiver/gi ) ) { return; }

	function post() {

		var messageData = {
			state: Reveal.getState(),
			socketID: muxingID
		};

		socket.emit( 'multiplex-statechanged', messageData );

	};

	// Monitor events that trigger a change in state
	Reveal.addEventListener( 'slidechanged', post );
	Reveal.addEventListener( 'fragmentshown', post );
	Reveal.addEventListener( 'fragmenthidden', post );
	Reveal.addEventListener( 'overviewhidden', post );
	Reveal.addEventListener( 'overviewshown', post );
	Reveal.addEventListener( 'paused', post );
	Reveal.addEventListener( 'resumed', post );
