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
var drawingUndo = document.getElementById("drawingUndo");

var imageDownloadDiv = document.getElementById("imageDownloadDiv");
var downloadImageButton = document.getElementById("downloadImageButton");

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
    drawBrush.Reset();
});

drawingUndo.addEventListener("click", function (ev) {
    drawBrush.PopHistory(1);
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

function downloadImage(){
    var link = document.createElement('a');
    link.download = 'pattern.png';
    link.href = GetImageDataFromRenderer();
    link.click();
}
downloadImageButton.addEventListener("click", function (ev) {
    downloadImage();
});

StartRenderLoop(drawBrush, drawPattern);