(function (ns) {

  var Blocks = ns.Holdbacks = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (properties) {
      Blocks.superclass.constructor.call(this, properties);
      this.image = properties.image;
      this.shiftLength = 30;
    },

    count: 0,
    width: 0,
    startY: 0,
    groundY: 0,
    isDead: true,

    createBlock: function () {
      var block = new Hilo.Bitmap({
        id: 'block' + this.count++,
        image: this.image,
        rect: [0, 0, 148, 60],
        boundsArea: [
          {x: 8, y: 0},
          {x: 140, y: 0},
          {x: 140, y: 60},
          {x: 8, y: 60}

        ]
      }).addTo(this);

      this.startFall(block);
    },

    startFall: function (block) {
      block.x = this.width - block.width >> 1;
      block.y = this.startY;

      this.tween = Hilo.Tween.to(block, {y: this.groundY - block.height}, {
        duration: 3000,
        onComplete: function () {
          this.removeListener();
          this.createBlock();
        }.bind(this)
      });
      this.bindListener();
    },

    bindListener: function () {
      this.listener = function (e) {
        var block = this.getChildById('block' + (this.count - 1));
        if (e.keyCode == 37) {
          block.x = block.x >= this.shiftLength ? block.x - this.shiftLength : 0;
        } else if (e.keyCode == 39) {
          block.x += this.shiftLength;
          block.x = block.x >= this.width - this.shiftLength - block.width ? this.width - block.width : block.x + this.shiftLength;
        }
      }.bind(this);
      document.addEventListener('keydown', this.listener);
    },

    removeListener: function () {
      // console.log('remove');
      document.removeEventListener('keydown', this.listener);
    },

    reset: function () {
      this.count = 0;
    },

    getCount: function () {
      return this.count;
    },

    checkCollision: function () {
      if (this.count > 1) {
        var cur = this.getChildById('block' + (this.count - 1));
        for (var i = 0, len = this.children.length - 1; i<len; i++) {
          if (cur.hitTestObject(this.children[i], true) ) {
            this.tween.stop();
            this.removeListener();
            this.createBlock();
            return true;
          }
        }
        return false;
      }
      return true;
    }

  });

})(window.game);