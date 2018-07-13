(function() {
	Application.Ship = function(size) {
		this.lives = size;
		this.destroyed = false
	};

	Application.Ship.prototype = {
		damage: function() {
			this.lives--;

			if (!this.lives) {
				this.destroy();
			}
		},
		destroy: function() {
			this.destroyed = true;
		},
		get isDestroyed() {
			return this.destroyed;
		},
		get getLives() {
			return this.lives;
		}
	};

})();
