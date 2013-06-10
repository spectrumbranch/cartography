Difractal.GameState = function(){
	var entities = [];
	var key = 0;

	return {
		Add: function(entity) {		
			entity.key = "n" + key;
			entities["n" + key] = entity;
			key++;
			this.Sort();
			return entity.key;
		},
		AddRange: function(_entities) {	
		    var entity;
			var length = _entities.length;
			for (var i = 0; i < length; i++) {
			    entity = _entities[i];
				entities["n"+key] = entity;
				entity.key = "n"+key;
				key++;				
			}
			this.Sort();
		},
		Listeners: {}
		,
		Events: function() {
			return false;
		},
		KeyDownEvents: function(e) {
			return false;
		},
		KeyUpEvents: function(e) {
			return false;
		},
		ClickEvents: function(e) {
			clickDetection(e,this,"click");
		},
		MouseDownEvents: function(e) {
			clickDetection(e,this,"mousedown");
			this.mousedown = true;
		},
		MouseUpEvents: function(e) {
			mouseUpDetection(e,this);
			this.mousedown = false;
		},
		MouseMoveEvents: function(e) {
			return false;
		},
		Draw: function(ctx) {
			for (var key in entities) {
				entities[key].draw(ctx);
			}
		},
		GetEntities: function() {
			return entities;
		},
		Remove: function(entity) {
			 delete entities[entity.key];
		},
		RemoveAll: function() {
			entities.length = 0;
		},
		Sort: function() {
			entities.sort(function (obj1, obj2) {
				return obj1.GetZIndex() - obj2.GetZIndex()
			});
		}
	};
}