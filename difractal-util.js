
Difractal.Vector2D = function(x,y){
   return {
     "x" : x,
     "y" : y,
     SetX: function(_x){
       this.x = _x;
     },
     SetY: function(_y){
       this.y = _y;
     },
    SetCoords: function(_x,_y){
      this.x = _x;
      this.y = _y;
    }
   }
}

Difractal.Timer = function() {
	return {
		start: -1,
		end: -1,
		Start: function() {
			if(this.start == -1) {
				this.start = new Date().getTime();
				this.end = -1;
				return this.start;
			}
		   return false;
		},
		Stop: function() {
			if(this.start != -1 && this.end == -1) {
				this.end = new Date().getTime();
				return this.end;
			}
			return false;
		},
		GetElapsedInterval: function() {
			if(this.start != -1 && this.end == -1) { 
				var current = new Date().getTime();
				return current - this.start;
			}
			return -1;
		},
		GetElapsedTime: function() {
			if(this.start != -1 && this.end != -1) {
				return this.end-this.start;
			}
			return -1;
		},

		Reset: function() {
			this.start = -1;
			this.end = -1;
		}
	}
}