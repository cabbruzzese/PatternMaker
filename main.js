var c=document.getElementById("drawingCanvas");
var ctx=c.getContext("2d");

var pc=document.getElementById("patternCanvas");
var pctx=pc.getContext("2d");

var canvasSize = document.getElementById("canvasSize");
var canvasSizeLabel = document.getElementById("canvasSizeLabel");

var colorR = document.getElementById("colorR");
var colorG = document.getElementById("colorG");
var colorB = document.getElementById("colorB");
var colorValueLabel = document.getElementById("colorValueLabel");
var colorPalette = document.getElementById("colorPalette");

var brushSize = document.getElementById("brushSize");
var brushSample = document.getElementById("brushSample");
var brushSizeLabel = document.getElementById("brushSizeLabel");

var drawingClear = document.getElementById("drawingClear");

function GetMouseFromCanvas(canvas, ev) {
    var rectangle = canvas.getBoundingClientRect();
    var x = ev.clientX - rectangle.left;
    var y = ev.clientY - rectangle.top;

    return new Point2d(x, y);
}

function RenderDrawingCanvas() {
    if (drawBrush.drawing)
    {
        if (drawBrush.dirty) {
            ctx.lineWidth = drawBrush.width;
            ctx.strokeStyle = drawBrush.color;
            ctx.lineCap="round";            
            drawBrush.dirty = false;
        }

        ctx.beginPath();
        ctx.moveTo(drawBrush.lastPosition.x, drawBrush.lastPosition.y);
        ctx.lineTo(drawBrush.position.x, drawBrush.position.y);
        ctx.stroke();
    }
}

function RenderPatternCanvas() {

    if (drawPattern.dirty) {
        pc.width = drawPattern.drawWidth * drawPattern.width;
        pc.height = drawPattern.drawHeight * drawPattern.height;
        drawPattern.dirty = false;
    }

    pctx.clearRect(0, 0, pc.width, pc.height);
    for (var x = 0; x < drawPattern.width; x++) {
        for (var y = 0; y < drawPattern.height; y++) {
            var posX = x * drawPattern.drawWidth;
            var posY = y * drawPattern.drawHeight;
            pctx.drawImage(c, posX, posY);//, drawPattern.drawWidth, drawPattern.drawHeight);
        }
    }
}

function RenderFrame() {
    RenderDrawingCanvas();
    RenderPatternCanvas();
}

//Start drawing frame to track brush
setInterval(RenderFrame, 33);

function Point2d (x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

function Pattern(drawHeight, drawWidth) {
    var DEFAULTWIDTH = 10;
    var DEFAULTHEIGHT = 10;

    this.dirty = true;
    this.width = DEFAULTWIDTH;
    this.height = DEFAULTHEIGHT;
    this.drawHeight = drawHeight;
    this.drawWidth = drawWidth;

    this.SetDrawSize = function (width, height) {
        this.drawHeight = width;
        this.drawWidth = height;
        this.dirty = true;
    };
}

function Brush() {
    var DEFAULTCOLOR = "#000000";
    var DEFAULTWIDTH = 1;
    this.color = DEFAULTCOLOR;
    this.width = DEFAULTWIDTH;
    this.dirty = true;

    this.drawing = false;
    this.position = new Point2d();
    this.lastPosition = new Point2d();

    this.Stop = function() {
        this.drawing = false;
    };

    this.Clear = function() {
        this.drawing = false;
        this.color = DEFAULTCOLOR;
        this.width = DEFAULTWIDTH;
        this.dirty = true;
    };

    this.Start = function(x, y){
        this.lastPosition.x = x;
        this.lastPosition.y = y;
        this.position.x = x;
        this.position.y = y;
        this.drawing = true;
    };

    this.Move = function(x, y){
        this.lastPosition.x = this.position.x;
        this.lastPosition.y = this.position.y;
        this.position.x = x;
        this.position.y = y;
    };

    this.GetPosition = function(){
        return new Point2d(this.position.x, this.position.y);
    };

    this.SetColor = function(color){
        this.dirty = true;
        this.color = color;
    };

    this.SetWidth = function(width){
        this.dirty = true;
        this.width = width;
    };
}

var drawPattern = new Pattern(c.width, c.height);
var drawBrush = new Brush();

c.addEventListener("mousedown", function (ev) {
    var point = GetMouseFromCanvas(c, ev);
    drawBrush.Start(point.x, point.y);
});

c.addEventListener("mouseup", function (ev) {
    drawBrush.Stop();
});

c.addEventListener("mouseout", function (ev) {
    drawBrush.Stop();
});

c.addEventListener("mousemove", function (ev) {
    if (drawBrush.drawing) {
        var point = GetMouseFromCanvas(c, ev);
        drawBrush.Move(point.x, point.y);
    }
});

function NumberToHexString(num) {
    var hex = num.toString(16);
    while (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function RGBToHexColor(r, g, b) {
    return "#" + NumberToHexString(r) + NumberToHexString(g) + NumberToHexString(b); 
}

function UpdateColor() {
    var color = RGBToHexColor(Number(colorR.value), Number(colorG.value), Number(colorB.value));
    drawBrush.SetColor(color);
    colorPalette.style.backgroundColor = color;
    colorPalette.style.width = "20px";
    colorPalette.style.height = "20px";
    colorValueLabel.innerHTML = color;
}
colorR.addEventListener("change", function (ev) {
    UpdateColor();
});
colorG.addEventListener("change", function (ev) {
    UpdateColor();
});
colorB.addEventListener("change", function (ev) {
    UpdateColor();
});
UpdateColor();

function UpdateBrushWidth() {
    var width = Number(brushSize.value);
    drawBrush.SetWidth(width);
    brushSample.style.border = "solid " + width / 2 + "px";
    brushSizeLabel.innerHTML = width;
}
brushSize.addEventListener("change", function (ev) {
    UpdateBrushWidth();
});
UpdateBrushWidth();

drawingClear.addEventListener("click", function (ev) {
    ctx.clearRect(0, 0, c.width, c.height);
});

function UpdateCanvasSize() {
    var size = Number(canvasSize.value);
    c.width = size;
    c.height = size;
    drawPattern.SetDrawSize(size, size);
    
    canvasSizeLabel.innerHTML = size;
}
canvasSize.addEventListener("change", function (ev) {
    UpdateCanvasSize();
});
UpdateCanvasSize();