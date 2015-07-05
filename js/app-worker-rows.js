onmessage = function(event) {
	var imagedata = event.data.imageData.data;
	var height = event.data.imageData.height;
	var width = event.data.imageData.width;
    var scale = event.data.scale;
    /*for(i=0;i<height*width*4;i+=8*scale){
        imagedata[i] = 255;
        imagedata[i+1] = 255;
        imagedata[i+2] = 255;
        for(j=i;j<scale*4;j+=4){
            imagedata[j] = 255;
            imagedata[j+1] = 255;
            imagedata[j+2] = 255;
        }
    }*/
    for(i=4;i<height*width*4;i+=8*scale){
        imagedata[i+3]=255;
        for(j=0;j<scale;j++){
            imagedata[i+(j*4)+3] = 255;
        }
    }
    postMessage(event.data.imageData);
};