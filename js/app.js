$(function() {
	if(!(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase()))){
		$("#holderimage").css("width","100%");
		$("#canvas-display").css("width","100%");
	}
    var imagePath = "";
    $('ul.tabs').tabs();
    $(".upload-button").click(function(){
        $("#file-input").click();
    });
    $("#file-input").change( function(event) {
		var fullPath = $('#file-input').val();
		if(fullPath!=""){
			var fileName = fullPath.split("\\");
			fileName = fileName[fileName.length-1];
			fileName = fileName.split(".")[0];
			$(".choose-image-holder").hide();
			$("#image-tool").show();
            $("#canvas-display").show();
            imagePath = URL.createObjectURL(event.target.files[0]);
            $("#download-btn").attr("download",fileName+"-bar.png");
            canvasUpdate();
        }
    });
    $("#contrast-input").change(function(){
        canvasUpdate();
    });
    $("#rows-input").change(function(){
        canvasUpdate();
    });
    var canvasUpdate = function(){
        if(imagePath==""){
            console.log("return");
            return;
        }
        var image = new Image();
        image.src = imagePath;
		image.onload = function() {
            var self = this;
            $("#canvas-display").attr({
                width:this.width,
                height:this.height
            });
            var canvas = document.getElementById('canvas-display');
            var context = canvas.getContext('2d');
            context.drawImage(self, 0, 0);
            var contrastWorker = new Worker("js/app-worker-contrast.js");
            contrastWorker.onmessage = function(e){
                context.putImageData(e.data, 0, 0);
                var rows = $("#rows-input").val();
                var scale = Math.ceil(self.width/(2*rows+1));
                newImgData = context.createImageData(scale*2*rows+1,1);
                var rowsWorker = new Worker("js/app-worker-rows.js");
                rowsWorker.onmessage = function(e){
                    var newCanvas = document.createElement("canvas");
                    newCanvas.height = e.data.height;
                    newCanvas.width = e.data.width;
                    var newContext = newCanvas.getContext('2d');
                    newContext.putImageData(e.data,0,0)
                    context.drawImage(newCanvas, 0, 0, self.width, self.height );
                    var imgURL = canvas.toDataURL("image/png");
                     $("#download-btn").attr("href",imgURL);
                    
                }
                rowsWorker.postMessage({imageData:newImgData,scale:scale});
            }
            contrastWorker.postMessage({imageData:context.getImageData(0, 0, self.width,self.height),contrast:$("#contrast-input").val()});
        }
    }
});