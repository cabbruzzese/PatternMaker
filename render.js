var c=document.getElementById("drawingCanvas");
var ctx=c.getContext("2d");

var pc=document.getElementById("patternCanvas");
var pctx=pc.getContext("2d");


function RenderDrawingCanvas(brush) {
    ctx.clearRect(0, 0, c.width, c.height);
    var history = brush.brushHistory;
    if (history === null) {
        return;
    }

    for (var i = 0; i < history.length ; i ++) {
        var historyItem = history[i];

        ctx.beginPath();
        ctx.lineWidth = historyItem.width;
        ctx.strokeStyle = historyItem.color;
        ctx.lineCap="round";

        var points = historyItem.points;
        if (points !== null && points.length > 0) {
            for (var j = 0; j < historyItem.points.length; j++) {
                var point = points[j];
                if (j == 0) {
                    ctx.moveTo(point.x, point.y);
                }
                else {
                    ctx.lineTo(point.x, point.y);
                }
            }
        }

        ctx.stroke();
    }
}

function RenderPatternCanvas(pattern) {

    if (pattern.dirty) {
        pc.width = pattern.drawWidth * pattern.width;
        pc.height = pattern.drawHeight * pattern.height;
        pattern.dirty = false;
    }

    pctx.clearRect(0, 0, pc.width, pc.height);
    for (var x = 0; x < pattern.width; x++) {
        for (var y = 0; y < pattern.height; y++) {
            var posX = x * pattern.drawWidth;
            var posY = y * pattern.drawHeight;
            pctx.drawImage(c, posX, posY);//, pattern.drawWidth, pattern.drawHeight);
        }
    }
}

function RenderFrame(brush, pattern) {
    RenderDrawingCanvas(brush);
    RenderPatternCanvas(pattern);
}

function StartRenderLoop (brush, pattern) {
    //Start drawing frame to track brush
    setInterval(RenderFrame, 33, brush, pattern);
}

function GetImageDataFromRenderer() {
    var imageData = pc.toDataURL("image/png");
    return imageData;
}