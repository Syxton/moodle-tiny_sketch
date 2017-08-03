var regularShapes = function(lc) {  // take lc as constructor arg
  var self = this;

  return {
    usesSimpleAPI: false,  // DO NOT FORGET THIS!!!
    name: 'regularShapes',
    iconName: 'regularshapes',
    optionsStyle: 'stroke-width',
    strokeWidth: lc.opts.defaultStrokeWidth,

    didBecomeActive: function(lc) {
      $('.horz-toolbar').append('<span id="ls-tool-sides" >\
                                    Sides: \
                                    <input type = "text" \
                                            id = "ls-sides" \
                                            value = "6" />\
                                </span>');
      var centerX,
          centerY,
          sides = 6;

      var setStrokeWidth = function(arg) {
        lc.tool.strokeWidth = arg;
        lc.trigger('toolDidUpdateOptions');
      };

      var onPointerDown = function(pt) {
        var coords = [];
        // Don't allow less than 2 sides.        
        sides = $('#ls-sides').val() > 1 ? $('#ls-sides').val() : 2;
        for (i = 0; i < sides; i++) {
            coords.push(LC.createShape('Point', {x: pt.x, y: pt.y}));
        }
        self.currentShape = LC.createShape('Polygon', {
            strokeColor: lc.getColor('primary'),
            strokeWidth: lc.tool.strokeWidth,
            fillColor: lc.getColor('secondary'),
            points: coords
        });
        
        centerX = pt.x;
        centerY = pt.y;

        lc.setShapesInProgress([self.currentShape]);
        lc.repaintLayer('main');
      };

      var onPointerDrag = function(pt) {
        var a = centerX - pt.x;
        var b = centerY - pt.y;
        var radius = Math.sqrt((a * a) + (b * b));
        var angleRadians = Math.atan2((centerY - pt.y), (centerX - pt.x));
        var points = calc(centerX, centerY, sides, radius, angleRadians);

        for (var i = 0; i < (sides); i++) {
            self.currentShape.points[i].x = points[i].x;
            self.currentShape.points[i].y = points[i].y;
        }

        lc.setShapesInProgress([self.currentShape]);
        lc.repaintLayer('main');
      };

      var onPointerUp = function(pt) {
        lc.setShapesInProgress([]);
        lc.saveShape(self.currentShape);
        lc.repaintLayer('main');
      };

      var onPointerMove = function(pt) {};

      // lc.on() returns a function that unsubscribes us. capture it.
      self.unsubscribeFuncs = [
        lc.on('setStrokeWidth', setStrokeWidth),
        lc.on('lc-pointerdown', onPointerDown),
        lc.on('lc-pointerdrag', onPointerDrag),
        lc.on('lc-pointerup', onPointerUp),
        lc.on('lc-pointermove', onPointerMove),
        function(){ $('#ls-tool-sides').remove(); }
      ];
    },

    willBecomeInactive: function(lc) {
      // call all the unsubscribe functions
      self.unsubscribeFuncs.map(function(f) { f(); });
    }
  }
};

function calc(cx, cy, n, r, startAng) {
    var centerAng = 2 * Math.PI / n;

    var vertex = new Array();
    for(var i = 0 ; i < n ; i++) {
        ang = startAng + (i * centerAng);
        vx = Math.round(cx + r * Math.cos(-ang));
        vy = Math.round(cy - r * Math.sin(-ang)); 
        vertex.push( {x:vx , y:vy} );
    }
    return vertex;
}