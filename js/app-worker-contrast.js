onmessage = function(event) {
	var imagedata = event.data.imageData.data;
	var height = event.data.imageData.height;
	var width = event.data.imageData.width;
    var contrast = event.data.contrast/100*255;
    var convertColor = function(r,g,b){
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return (yiq >= contrast) ? [255,255,255] : [240,240,240];
    }
    for(i=0;i<height*width*4;i+=4){
        rgb = convertColor(imagedata[i],imagedata[i+1],imagedata[i+2]);
        imagedata[i] = rgb[0]
        imagedata[i+1] = rgb[1]
        imagedata[i+2] = rgb[2]
    }
    postMessage(event.data.imageData);
};