var ffFlyItems = function (container, svgArrPaths) {
    var ff = this;

    ff.parentContainer = document.getElementById(container);
    if( ff.parentContainer){
        var cvs = document.createElement("canvas");
        cvs.setAttribute("id", "ffFlyItem-cvs");
        ff.parentContainer.appendChild(cvs);
    } else {
        return console.log('wrong container ID');
    }

    ff.frame = 0;
    ff.count = 0;
    ff.winWidth = window.innerWidth;
    ff.Animations = new Instruction();
    ff.svgArr = [];
    ff.cvsArr = [];
    ff.optionSpeed = 1;
    ff.speed = {
        x: 1,
        y: 1
    };

    ff.canvas = new fabric.Canvas('ffFlyItem-cvs');
    ff.canvas.setHeight(ff.parentContainer.offsetHeight);
    ff.canvas.setWidth(ff.parentContainer.offsetWidth);
    ff.canvas.selection = false;
    ff.canvas.hoverCursor = 'default';

    ff.loadsvg = function (path, cb) {

        if(ff.count < svgArrPaths.length){

            fabric.loadSVGFromURL(path, function(objects,options){

                var obj = fabric.util.groupSVGElements(objects, options);

                obj.set({
                    left: -ff.canvas.width,
                    top: -ff.canvas.height,
                    lockMovementX : true,
                    lockMovementY : true,
                    lockScalingX : true,
                    lockScalingY : true,
                    hasBorders: false,
                    hasControls: false,
                    originX: 'center',
                    originY: 'center'
                });

                //############ change color and width svg lines ##############
                for(i in objects) {
                    objects[i].set({
                        // strokeWidth: 8,
                        stroke: '#00ffff'
                    });
                }

                ff.canvas.add(obj);

                ff.svgArr.push(obj);
                ff.count++;


                if(cb) cb(svgArrPaths[ff.count],  cb);
            });

        } else {
            ff.init();
        }
    };


    ff.randomizer = function (min1, max1, min2, max2) {
        var randArr = [];

        var rand1 = Math.floor(Math.random() * (max1 - min1)) + min1;
        var rand2= Math.floor(Math.random() * (max2 - min2)) + min2;

        randArr.push(rand1);
        randArr.push(rand2);

        return randArr[Math.floor(Math.random() * randArr.length)];

    };


    ff.animateSvg = function(){

        ff.canvas.forEachObject(function(obj) {

            obj.angle += obj.rotationData;
            if(obj.angle > 360 && obj.angle < 361){
                obj.angle = 1;
            }

            obj.setCoords();


            if(ff.frame%6 == 0){

                if (obj.left > ff.widthAreaMax){
                    obj.startPos.x = -ff.speed.x;
                    obj.left += obj.startPos.x;
                    obj.top += obj.startPos.y;
                } else if (obj.left < ff.widthAreaMin){
                    obj.startPos.x = ff.speed.x;
                    obj.left += obj.startPos.x;
                    obj.top += obj.startPos.y;
                }

                if (obj.top > ff.heightAreaMax ) {
                    obj.startPos.y = -ff.speed.y;
                    obj.left += obj.startPos.x;
                    obj.top += obj.startPos.y;
                } else if (obj.top < ff.heightAreaMin ) {
                    obj.startPos.y = ff.speed.y;
                    obj.left += obj.startPos.x;
                    obj.top += obj.startPos.y;
                }



                ff.canvas.forEachObject(function(obj2) {
                    if (obj === obj2) return;

                    if(obj2.intersectsWithObject(obj)){

                        var left = Math.abs(obj.left - obj2.left);
                        var top = Math.abs(obj.top - obj2.top);

                        if(left > top){

                            if(obj.left > obj2.left){
                                obj.startPos.x = ff.speed.x;
                                obj2.startPos.x = -ff.speed.x;
                            } else {
                                obj.startPos.x = -ff.speed.x;
                                obj2.startPos.x = ff.speed.x;
                            }

                        } else {

                            if(obj.top > obj2.top){
                                obj.startPos.y = ff.speed.y;
                                obj2.startPos.y = -ff.speed.y;
                            } else {
                                obj.startPos.y = -ff.speed.y;
                                obj2.startPos.y = ff.speed.y;
                            }

                        }

                        obj.left += obj.startPos.x ;
                        obj.top += obj.startPos.y ;

                    }
                });

            }

            obj.left += obj.startPos.x;
            obj.top += obj.startPos.y;


        });


        ff.canvas.renderAll();
    };


    ff.resize = function (){
        if(ff.canvas.width != ff.parentContainer.offsetWidth){
            var speedY, speedX, scaleMultiplierX, scaleMultiplierY, scale;

            scaleMultiplierX = ff.parentContainer.offsetWidth / ff.canvas.width;
            scaleMultiplierY = ff.parentContainer.offsetHeight / ff.canvas.height;

            ff.canvas.setHeight(ff.parentContainer.offsetHeight);
            ff.canvas.setWidth(ff.parentContainer.offsetWidth);

            if(ff.parentContainer.offsetHeight > ff.parentContainer.offsetWidth){
                scale = speedY = ( ff.canvas.height / ff.svgArr[0].height)/7;
                speedX = ( ff.canvas.width / ff.svgArr[0].width)/7;
            } else {
                scale = speedX = (ff.canvas.width / ff.svgArr[0].width)/7;
                speedY = ( ff.canvas.height / ff.svgArr[0].height)/7;
            }

            ff.widthAreaMin = -0.5*ff.svgArr[0].width * scale;
            ff.widthAreaMax = ff.canvas.width + 0.5*ff.svgArr[0].width * scale;
            ff.heightAreaMin = -0.5*ff.svgArr[0].height * scale;
            ff.heightAreaMax = ff.canvas.height + 0.5*ff.svgArr[0].height * scale;

            ff.canvas.forEachObject(function(obj) {

                obj.left = obj.left * scaleMultiplierX;
                obj.top = obj.top * scaleMultiplierY;

                obj.startPos.x = (obj.startPos.x / Math.abs(obj.startPos.x)) * ff.speed.x * scale;
                obj.startPos.y = (obj.startPos.y / Math.abs(obj.startPos.y)) * ff.speed.y * scale;

                obj.scale(scale);
                obj.setCoords();

            });

            ff.speed.x = ff.optionSpeed * speedX;
            ff.speed.y = ff.optionSpeed * speedY;

        }

    };


    ff.init = function () {
        var speedY, speedX, scale;

        if(window.innerHeight > window.innerWidth){
            scale = speedY = ( ff.canvas.height / ff.svgArr[0].height)/7;
            speedX = ( ff.canvas.width / ff.svgArr[0].width)/7;
        } else {
            scale = speedX = (ff.canvas.width / ff.svgArr[0].width)/7;
            speedY = ( ff.canvas.height / ff.svgArr[0].height)/7;
        }

        ff.widthAreaMin = -0.5*ff.svgArr[0].width * scale;
        ff.widthAreaMax = ff.canvas.width + 0.5*ff.svgArr[0].width * scale;
        ff.heightAreaMin = -0.5*ff.svgArr[0].height * scale;
        ff.heightAreaMax = ff.canvas.height + 0.5*ff.svgArr[0].height * scale;

        ff.speed.x = ff.optionSpeed * speedX;
        ff.speed.y = ff.optionSpeed * speedY;

        var randObjArr = [];
        var tempI = 0;

        //############### random svg on scene #######################


        // (function objOnSceneToStart() {
        //     var temp = Math.floor(Math.random()*svgArrPaths.length);
        //     if(randObjArr.length === 0){
        //         randObjArr.push(temp);
        //     } else {
        //         if(randObjArr.indexOf(temp) === -1)randObjArr.push(temp);
        //     }
        //     if(randObjArr.length < 3){
        //         objOnSceneToStart();
        //     }
        // })();

        ff.canvas.forEachObject(function(obj) {
            obj.scale(scale);

            if(randObjArr.indexOf(tempI) !== -1){
                obj.set({
                    left: Math.random() * ff.canvas.width,
                    top: Math.random() * ff.canvas.height
                });
            } else {
                obj.set({
                    left: Math.floor(Math.random() * ff.canvas.width),
                    top: Math.floor(Math.random() * ff.canvas.height)
                    //#########################  all elements generate random places around scene #######################

                    // left: ff.randomizer((-obj.width * scale), (0 - 0.5 * obj.width * scale), (ff.canvas.width + 0.5 * obj.width * scale), (ff.canvas.width + obj.width * scale)),
                    // top: ff.randomizer((-obj.height * scale), (0 - 0.5 * obj.height * scale), (ff.canvas.height + 0.5 * obj.height * scale), (ff.canvas.height + obj.height * scale))
                });
            }

            var tempMinus = Math.random() - Math.random();
            tempMinus = tempMinus/(Math.abs(tempMinus));

            obj.rotationData = (Math.floor(Math.random() * (1.5 - 0.3)) + 0.3) * tempMinus;

            obj.startPos = {
                x: ff.speed.x * tempMinus,
                y: ff.speed.y * tempMinus
            };

            tempI++;
        });

        ff.Animations.add(ff.animateSvg);

        //###################  resize func ################
        //angular 2 has own resize, just use ( new ffFlyItems() ).resize() in event listener

        // window.addEventListener('resize', ff.resize);

    };



    ff.loadsvg(svgArrPaths[ff.count], ff.loadsvg);

    (ff.Animate = function(){
        ff.frame++;
        ff.Animations.run();
        requestAnimationFrame( ff.Animate );
    })(ff.Animate);

};



