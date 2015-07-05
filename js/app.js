$(function() {
    var data = {
        black : [],
        white : [],
        isShowLink : false,
        isTraning : false,
        currentDisplay : {
            r:0,
            g:0,
            b:0
        },
        svm: null,
        mlp: null,
    }
    var cloneCurrentDisplay = function(){
        return {
            r:data.currentDisplay.r/255.0,
            g:data.currentDisplay.g/255.0,
            b:data.currentDisplay.b/255.0
        }
    }
    var yiqColor = function(r,g,b) {
        var yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return (yiq >= 128) ? -1 : 1;
    }
    var rgbToArray = function(input){
        var output = [];
        for(i=0;i<input.length;i++){
            var e = [];
            e.push(input[i].r);
            e.push(input[i].g);
            e.push(input[i].b);
            output.push(e);
        }
        return output;
    }
    var checkTrainLink = function(){
        if(data.isShowLink==false&&data.black.length+data.white.length>=5&&data.black.length!=0&&data.white.length!=0){
            var defaultHeight = $("#train-link").height();
            $("#train-link").height(0);
            $("#train-link").show();
            $("#train-link").animate({ "height": defaultHeight+"px" }, "fast" )
            data.isShowLink = true;
        }
    }
    var intToBlackWhite = function(input){
        return (input==-1)?'black':'white';
    }
    var nextResultDisplay = function(){
        setNewColor();
        var yiq = yiqColor(data.currentDisplay.r,data.currentDisplay.g,data.currentDisplay.b);
        var predict = data.svm.predict([data.currentDisplay.r/255.0,data.currentDisplay.g/255.0,data.currentDisplay.b/255.0]);
        //console.log("predict : "+predict);
        $("#blackMessage").css('color',intToBlackWhite(predict));
        $("#whiteMessage").css('color',intToBlackWhite(yiq));
    }
    var setNewColor = function(){
        data.currentDisplay.r = Math.floor((Math.random() * 255));
        data.currentDisplay.g = Math.floor((Math.random() * 255));
        data.currentDisplay.b = Math.floor((Math.random() * 255));
        $("#blackDisplay").css('background-color',"rgba("+data.currentDisplay.r+","+data.currentDisplay.g+","+data.currentDisplay.b+",1)");
        $("#whiteDisplay").css('background-color',"rgba("+data.currentDisplay.r+","+data.currentDisplay.g+","+data.currentDisplay.b+",1)");
    }
    $("#blackDisplay").click(function(){
        data.black.push(cloneCurrentDisplay());
        checkTrainLink();
        setNewColor();
    });
    $("#whiteDisplay").click(function(){
        data.white.push(cloneCurrentDisplay());
        checkTrainLink();
        setNewColor();
    });
    $("#train-link").click(function(){
        if(data.isTraning==false){
            //$("#train-link").css('pointer-events','none');
            //$("#train-loading").show();
            $("#train-msg").hide();
            var x = rgbToArray(data.black.concat(data.white));
            var y = [];
            for(i=0;i<data.black.length;i++){
                y.push(-1);
            }
            for(i=0;i<data.white.length;i++){
                y.push(1);
            }
            // More in for mation with machine_learning.min.js see https://github.com/junku901/machine_learning
            data.svm = new ml.SVM({
                x : x,
                y : y
            });
            data.svm.train({
                C : 1.0, // default : 1.0. C in SVM.
                tol : 1e-5, // default : 1e-4. Higher tolerance --> Higher precision
                max_passes : 20, // default : 20. Higher max_passes --> Higher precision
                alpha_tol : 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision
                kernel : { type: "polynomial", c: 1, d: 5}
            });
            
            /*data.mlp = new ml.MLP({
                'input' : x,
                'label' : y,
                'n_ins' : 3,
                'n_outs' : 1,
                'hidden_layer_sizes' : [4,4,5]
            });
            data.mlp.train({
                'lr' : 0.6,
                'epochs' : 20000
            });*/

            
            //$("#train-loading").hide();
            $("#result-msg").show();
            //$("#train-link").css('pointer-events','auto');
            $("#blackMessage").html("Your Training");
            $("#whiteMessage").html("YIQ Formular");
            data.isTraning=true;
            nextResultDisplay();
        }else{
            nextResultDisplay();
        }
    });
    setNewColor();
});