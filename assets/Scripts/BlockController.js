let colors = require("Colors");

cc.Class({
    extends: cc.Component,

    properties: {
        titleBlock :{
            default : null,
            type : cc.Label,
        },
    },


    onLoad () {
    },

    setNumber(number){
        if(number === 0){
            this.titleBlock.node.active = false;
            this.node.color = colors[0];
        }
        else{
            this.titleBlock.string = number;
            this.titleBlock.node.active = true;
            if(number in colors){
                this.node.color = colors[number];
            }
        }
    },

    // getRandomTitle(){
    //     let titleNum = null;
    //     Math.random() <= 0.95 ? titleNum = 2 : titleNum = 4;
    //     return this.titleBlock.string = titleNum;
    // }


});
