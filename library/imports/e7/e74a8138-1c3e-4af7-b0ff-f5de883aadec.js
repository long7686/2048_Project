"use strict";
cc._RF.push(module, 'e74a8E4HD5K97D/9d6IOq3s', 'BlockController');
// Scripts/BlockController.js

"use strict";

var colors = require("Colors");

cc.Class({
    extends: cc.Component,

    properties: {
        titleBlock: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function onLoad() {},
    setNumber: function setNumber(number) {
        if (number === 0) {
            this.titleBlock.node.active = false;
            this.node.color = colors[0];
        } else {
            this.titleBlock.string = number;
            this.titleBlock.node.active = true;
            if (number in colors) {
                this.node.color = colors[number];
            }
        }
    }
}

// getRandomTitle(){
//     let titleNum = null;
//     Math.random() <= 0.95 ? titleNum = 2 : titleNum = 4;
//     return this.titleBlock.string = titleNum;
// }


);

cc._RF.pop();