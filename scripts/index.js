(function() {
  var CLASSES = {
    CELL: 'sea-battle__cell',
    DAMAGE_CELL: 'sea-battle__cell__damage',
    SHIP: 'sea-battle__ship',
    DESTROY_SHIP: 'sea-battle__ship__destroy'
  };

  var SIZE = 10;
  var COUNT_SHIPS_TYPE = 4;
  var Application = {};

  function createMap() {
    var arr = [];
    for (var i = 0; i < SIZE; i++) {
      arr[i] = [];
      for(var j = 0; j < SIZE; j++) {
        arr[i][j] = 0;
      }
    }

    return arr;
  }

  function getDirection() {
    return Math.round(Math.random());
  }

  function hasClass(className) {
    return this.className.indexOf(className) > -1
  }

  Application.Arena = function () {
    this.ships = [];
    this.eventListener = null;
    this.shots = {
      all: 0,
      target: 0
    };
    this.map = createMap();
    this.createField();

    for (var i = COUNT_SHIPS_TYPE; i > 0; i--) {
      for (var j = 0; j < COUNT_SHIPS_TYPE - (i - 1); j++) {
        var ship = new Application.Ship(i);
        this.getPosition(ship);
        this.ships.push(ship);
      }
    }
  };

  Application.Arena.prototype = {
    createField: function () {
      var table = document.getElementById('sea-battle__arena');
      var  tr = document.createElement('tr');
      var  td = document.createElement('td');

      td.className = CLASSES.CELL;

      for (var i = 0; i < SIZE; ++i) {
        var _tr = tr.cloneNode();
        for (var j = 0; j < SIZE; ++j) {
          var _td = td.cloneNode();

          _tr.appendChild(_td);
        }
        table.appendChild(_tr);
      }

      this.eventListener = this.onShot.bind(this);
      table.addEventListener('click', this.eventListener);
    },
    checkBounds: function (left, right) {
      var placed = true;

      for (var curX = left[0]; curX <= right[0]; curX++) {
        for (var curY = left[1]; curY <= right[1]; curY++) {
          if (this.map[curX][curY]) {
            placed = false;
            break;
          }
        }
      }

      return placed;
    },
    getPosition: function (ship) {
      var posX = Math.floor(Math.random() * SIZE);
      var posY = Math.floor(Math.random() * SIZE);
      var direction = getDirection();
      var deckCount = ship.getLives;
      var placed = false;

      if (direction === 0) {
        var maxPosX = posX + deckCount;
        if (maxPosX <= SIZE) {
          placed = this.checkBounds([Math.max(0, posX - 1), Math.max(0, posY - 1)],
            [Math.min(SIZE - 1, maxPosX + 1), Math.min(SIZE - 1, posY + 1)]);

          if (placed) {
            for (var i = posX; i < maxPosX; i++) {
              this.map[i][posY] = ship;
            }
          }
        }

      } else {
        var maxPosY = posY + deckCount;
        if (maxPosY <= SIZE) {
          placed = this.checkBounds([Math.max(0, posX - 1), Math.max(0, posY - 1)],
            [Math.min(SIZE - 1, posX + 1), Math.min(SIZE - 1, maxPosY + 1)]);
          if (placed) {
            for (var i = posY; i < maxPosY; i++) {
              this.map[posX][i] = ship;
            }
          }
        }
      }

      return !placed ? this.getPosition(ship) : placed;
    },
    onShot: function (event) {
      var target = event.target;
      var parentNode = target.parentNode;
      var _hasClass = hasClass.bind(target);

      if (_hasClass(CLASSES.DAMAGE_CELL) || target.tagName.toUpperCase() !== 'TD') {
        return;
      }

      this.shots.all++;
      target.className += ' ' + CLASSES.DAMAGE_CELL;

      var ship = this.map[target.cellIndex][parentNode.rowIndex];

      if (ship) {
        ship.damage();
        this.shots.target++;
        target.className += ' ' + CLASSES.SHIP;

        if (ship.isDestroyed) {
          var table = event.currentTarget;
          var damageCells = table.querySelectorAll('td.' + CLASSES.DAMAGE_CELL + '.' + CLASSES.SHIP + ':not(.' + CLASSES.DESTROY_SHIP + ')');

          for (var i = 0; i < damageCells.length; i++) {
            if (this.map[damageCells[i].cellIndex][damageCells[i].parentNode.rowIndex] === ship) {
              damageCells[i].className += ' ' + CLASSES.DESTROY_SHIP;
            }
          }

          if (this.isGameOver) {
            this.gameOver();
          }
        }
      }
    },
    gameOver: function () {
      var table = document.getElementById('sea-battle__arena');
      var results = document.getElementById('sea-battle__arena__results');
      var total = document.getElementById('sea-battle__arena__total');
      var accuracy = document.getElementById('sea-battle__arena__accuracy');

      table.removeEventListener('click', this.eventListener);
      total.innerHTML = 'Total shots: ' + this.shots.all;
      accuracy.innerHTML = 'Accuracy: ' + Math.floor( (this.shots.target / this.shots.all) * 100 ) + '%';
      results.className = results.className.replace(/\bsea-battle__arena__hidden\b/g, "");
    },
    get isGameOver () {
      return this.ships.reduce(function(result, ship) {
        return result && ship.isDestroyed;
      }, true);
    }
  };

  window.Application = Application;
})();