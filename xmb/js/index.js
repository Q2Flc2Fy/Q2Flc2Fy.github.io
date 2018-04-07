var ICON_SIZE = 100;
var PADDING = 10;
var audio = new Audio('js/sound.mp3');
//todo: pull model from XHR or some
function alertnow() {
	alert ("version 0.2b");
}

var model = {
  cursor: {
    x: 0,
    y: 0
  },
  columns: {
    "settings": {
      index: 0,
      title: "settings",
      selectedIndex: 0,
      active: false,
      icon: "img/Icons.35.png",
      items:[
          {title: "★ Version check", subtitle: 'Display the application version', active: false, icon: "img/Icons.3.png", href: 'javascript:alertnow();'},
	  {title: "Settings", subtitle: 'Change app settings (Coming Soon)', active: false, icon: "img/Icons.3.png", href: 'javascript:alertnow();'}
        ]
    },
    "explore": {
      index: 1,
      title: "★ Package Files",
      selectedIndex: 1,
      active: false,
      icon: "img/Icons.8.png",
      items:[
          {title:"TweakBox",subtitle:"[Homebrew] Mobileconfig file.",active:false,icon:"img/Icons.2.png",href:"https://nyc3.digitaloceanspaces.com/tweakbox/TweakBox.mobileconfig"}
        ]
	}
}

  //add zero position to each column and item
};_.each(model.columns, function (c) {
  c.position = { x: 0, y: 0 };
  _.each(c.items, function (i) {
    i.position = {
      x: 0,
      y: 0
    };
  });
});

var xmbVue = new Vue({
  el: "#xmb",
  data: model,
  methods: {
    handleKey: function handleKey(dir, val) {
      this.cursor[dir] += val;
      var nCols = this.nColumns;

      // wrap x
      this.cursor.x = this.cursor.x % nCols;
      if (this.cursor.x < 0) {
        this.cursor.x = this.cursor.x + nCols;
      }

      //wrap y
      var nRows = this.nRows;
      this.cursor.y = this.cursor.y % nRows;
      if (this.cursor.y < 0) {
        this.cursor.y = this.cursor.y + nRows;
      }

      this.highlightCell(this.cursor.x, this.cursor.y);
    },
    highlightCell: function highlightCell(column, row) {

      console.log(column, row);
      //update position of elements as well
      var xAccum = (-column - 1) * (ICON_SIZE + PADDING);
      if (column == 0) {
        xAccum += ICON_SIZE + PADDING;
      }
      var yAccum;

      _.each(this.columns, function (col, colKey) {
        col.active = false;
        yAccum = -(ICON_SIZE + PADDING) * (row + 1);

        col.position.x = xAccum;
        xAccum += ICON_SIZE + PADDING;
        if (column === col.index || column === col.index + 1) {
          xAccum += ICON_SIZE / 2;
        }

        _.each(col.items, function (item, rowN) {
          if (rowN == row && col.index == column) {
            item.active = true;
            col.active = true;
          } else {
            item.active = false;
          }

          if (rowN == row) {
            yAccum += ICON_SIZE + PADDING;
          }
          yAccum += ICON_SIZE + PADDING;
          item.position.y = yAccum;
        });
      });
      this.cursor.y = row;
      this.cursor.x = column;
    }
  },
  watch: {
    cursor: function cursor(e) {
      console.log('cursor mutated', e);
    }
  },
  computed: {
    nColumns: function nColumns() {
      return Object.keys(this.columns).length;
    },
    nRows: function nRows() {
      //get the row at the current index
      var row = this.columnsArray[this.cursor.x];
      if (!row) {
        console.log('invalid row index: ', this.cursor.x);
        return 0;
      }
      return row.items.length; //todo: number of columns in this row
    },
    columnsArray: function columnsArray() {
      var _this = this;

      //get columns in an array
      var arr = [];
      Object.keys(this.columns).forEach(function (key) {
        arr.push(_this.columns[key]);
      });
      return _.sortBy(arr, 'index');
    }
  },
  created: function created() {
    _.each(this.columns, function (column) {
      _.each(column.items, function (item) {
        item.active = false;
      });
    });
    this.highlightCell(this.cursor.x, this.cursor.y);
  }
});

// handle movement based on keys
$('body').on('keyup', function (e) {
  if (e.key == "ArrowUp") {
  	audio.play();
    xmbVue.handleKey('y', -1);
  } else if (e.key == "ArrowDown") {
  	audio.play();
    xmbVue.handleKey('y', 1);
  } else if (e.key == "ArrowLeft") {
  	audio.play();
    xmbVue.handleKey('x', -1);
  } else if (e.key == "ArrowRight") {
	audio.play();
    xmbVue.handleKey('x', 1);
  } else if (e.key == "Enter") {
	audio.play();
    xmbVue.highlightCell(xmbVue.nColumns, xmbVue.nRows)
  }
});
var myElement = document.body;
var hammertime = new Hammer(myElement);
hammertime.on('swipeleft', function(ev) {
  	audio.play();
	xmbVue.handleKey('x', 1);     
});
hammertime.on('swiperight', function(ev) {
	xmbVue.handleKey('x', -1);     
});
$('body').swipe( {
  swipeUp:function(event, direction, distance, duration) {
    	audio.play();
    xmbVue.handleKey('y', 1);
  },
  swipeDown:function(event, direction, distance, duration) {
    	audio.play();
    xmbVue.handleKey('y', -1); 
  },
  click:function(event, target) { 
  },
  threshold:100,
  allowPageScroll:"vertical"
});
$('body').on("mousewheel", _.throttle(scrollHandler, 10));

function scrollHandler(e) {
  console.log(e);
  if (e.deltaX) {
    xmbVue.handleKey('x', Math.sign(e.deltaX));
	audio.play();
  }
  if (e.deltaY) {
    xmbVue.handleKey('y', Math.sign(e.deltaY));
	audio.play();
  }
}
