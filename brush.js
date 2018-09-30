var BRUSH_DEFAULTCOLOR = "#000000";
var BRUSH_DEFAULTWIDTH = 1;
function BrushHistoryItem(color, width, points = []) {
    this.points = points;
    this.color = color;
    this.width = width;

    this.Add = function(point) {
        points.push(point);
    };
}

function Brush() {
    this.color = BRUSH_DEFAULTCOLOR;
    this.width = BRUSH_DEFAULTWIDTH;
    this.dirty = true;

    this.drawing = false;

    this.brushHistory = [];
    var currentBrushItem = null;

    this.setNewCurrentBrushItem = function() {
        currentBrushItem = new BrushHistoryItem(this.color, this.width);
        this.brushHistory.push(currentBrushItem);
    }

    this.Stop = function() {
        this.drawing = false;
    };

    this.Clear = function() {
        this.drawing = false;
        this.color = BRUSH_DEFAULTCOLOR;
        this.width = BRUSH_DEFAULTWIDTH;
        this.dirty = true;
    };

    this.Start = function(x, y){
        this.drawing = true;

        this.setNewCurrentBrushItem();
        currentBrushItem.Add(new Point2d(x, y));
    };

    this.Move = function(x, y){
        if (this.drawing) {
            currentBrushItem.Add(new Point2d(x, y));
        }
    };

    this.GetPosition = function(){
        if (this.brushHistory !== null && this.brushHistory.length > 0 && this.brushHistory[0].points !== null && this.brushHistory[0].points.length > 0)
        {
            var point = this.brushHistory[0].points[0];
            return new Point2d(point.x, point.y);
        }

        return new Point2d(0,0);
    };

    this.setColorAndWidth = function(color, width) {
        this.color = color;
        this.width = width;

        if (this.drawing) {
            //If changes while drawing, need to treat as new brush stroke
            this.setNewCurrentBrushItem();
        }
    }

    this.SetColor = function(color){
        this.setColorAndWidth(color, this.width);
    };

    this.SetWidth = function(width){
        this.setColorAndWidth(this.color, width);
    };

    this.PopHistory = function(steps) {
        if (this.brushHistory === null) {
            return;
        }

        var processed = Math.min(steps, this.brushHistory.length);
        while (processed > 0) {
            this.brushHistory.pop();
            processed--;
        }
    }

    this.Reset = function() {
        this.Clear();
        this.brushHistory = [];
    }
}