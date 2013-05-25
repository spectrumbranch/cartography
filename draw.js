(function() {
	var canvas = $('#canvas'),
		context = canvas[0].getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
		//fills to size of parent
		var changeWidthTo = canvas.parent().width();
		var changeHeightTo = canvas.parent().height();
		
		canvas[0].width = changeWidthTo;
		canvas[0].height = changeHeightTo;
	
		//full screen (fills entire window)
		//canvas.width = window.innerWidth;
		//canvas.height = window.innerHeight;

		/**
		 * Your drawings need to be inside this function otherwise they will be reset when 
		 * you resize the browser window and the canvas goes will be cleared.
		 Though, this is not the case for events already in a separate setInterval.
		 */
		drawStuff(); 
    }
    resizeCanvas();

    function drawStuff() {
		// do your drawing stuff here
    }
})();