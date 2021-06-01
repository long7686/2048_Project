const ROWS = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        bestScoreLabel: cc.Label,
        blockPrefab: cc.Prefab,
        bgBox: cc.Node,
        cellPrefab: cc.Prefab,
        loseLayOut: cc.Node,
        winLayOut: cc.Node,
        _gap: {
            default: 10,
            serializable: false,
        },
        _blockSize: null,
        _data: [],
        _arrBlock: [],
        _posisions: [],
        _score: null,
        _canMove: true,
    },

    onLoad() {
        this._canMove = true;
        this.loseLayOut.active = false;
    },

    start() {
        this._blockSize = (this.bgBox.width - this._gap * 5) / 4;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.blockInit();
        this.init();
    },

    arrInit(x, y) {
        let blockArr = new Array();
        for (let i = 0; i < x; i++) {
            blockArr[i] = new Array();
            for (let j = 0; j < y; j++) {
                blockArr[i][j] = 0;
            }
        }
        return blockArr;
    },

    init() {
        this.updateScore(0);
        this._data = this.arrInit(ROWS, ROWS);
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                this._arrBlock[row][col].getComponent("BlockController").setNumber(0);
                this._data[row][col] = 0;
            }
        };
        this.addBlock();
        this.addBlock();
    },

    blockInit() {
        this._arrBlock = this.arrInit(ROWS, ROWS);

        for (let i = 0; i < ROWS; i++) {
            this._posisions.push([0, 0, 0, 0]);
            for (let j = 0; j < ROWS; j++) {
                let x = -(this.bgBox.width / 2) + (this._gap * (j + 1) + this._blockSize / 2 * (2 * j + 1));
                let y = (this.bgBox.height / 2) - (this._gap * (i + 1) + this._blockSize / 2 * (2 * i + 1));
                let block = cc.instantiate(this.blockPrefab);
                block.parent = this.bgBox;
                block.width = this._blockSize;
                block.height = this._blockSize;
                block.setPosition(cc.v2(x, y));
                this._posisions[i][j] = (cc.v2(x, y));
                block.getComponent("BlockController").setNumber(0);
                this._arrBlock[i][j] = (block);
            }
        }

    },

    getEmptyLocations() {
        let locations = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                if (this._data[row][col] === 0) {
                    locations.push({
                        x: row,
                        y: col,
                    })
                }
            }
        }
        return locations;
    },

    addBlock() {
        let locations = this.getEmptyLocations();
        if (locations.length === 0) return false;

        let location = locations[Math.floor(Math.random() * locations.length)];
        let x = location.x;
        let y = location.y;
        let position = this._posisions[x][y];
        let block = cc.instantiate(this.blockPrefab);
        block.width = this._blockSize;
        block.height = this._blockSize;
        block.parent = this.bgBox;
        block.setPosition(position);

        let number = Math.random() <= 0.95 ? 2 : 4;
        block.getComponent("BlockController").setNumber(number);
        this._arrBlock[x][y] = block;
        this._data[x][y] = number;

        return true;
    },

    updateScore(num) {
        this._score = num;
        this.scoreLabel.string = num;
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                if (this._canMove) {
                    this._canMove = false
                    this.blockMoveRight();
                }
                break;
            case cc.macro.KEY.left:
                if (this._canMove) {
                    this._canMove = false
                    this.blockMoveLeft();
                }
                break;
            case cc.macro.KEY.up:
                if (this._canMove) {
                    this._canMove = false
                    this.blockMoveUp();
                }
                break;
            case cc.macro.KEY.down:
                if (this._canMove) {
                    this._canMove = false
                    this.blockMoveDown();

                }
                break;
        }
    },

    afterMove(hasMoved) {
        this._canMove = true
        if (hasMoved) {
            this.updateScore(this._score + 1);
            this.addBlock();
        }
        else if (this.checkGameOver()) {
            this.gameOver()
        }
    },

    moveBlock(block, position, callback) {
        let action = cc.moveTo(.05, position);
        let finish = cc.callFunc(() => {
            callback && callback();
        })
        block.runAction(cc.sequence(action, finish,));
    },

    combineBlock(b1, b2, num, callback) {
        b1.destroy();
        let scale1 = cc.scaleTo(0.1, 1.1);
        let scale2 = cc.scaleTo(0.1, 1);
        let mid = cc.callFunc(() => {
            b2.getComponent("BlockController").setNumber(num);
        });
        let finish = cc.callFunc(() => {
            callback && callback();
        })
        b2.runAction(cc.sequence(scale1, mid, scale2, finish));
    },

    checkGameOver() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                let n = this._data[i][j];
                if (n === 0) return false;
                if (j > 0 && this._data[i][j - 1] == n) return false;
                if (j < ROWS - 1 && this._data[i][j + 1] == n) return false;
                if (i > 0 && this._data[i - 1][j] == n) return false;
                if (i < ROWS - 1 && this._data[i + 1][j] == n) return false;

            }
        }
        return true;
    },

    blockMoveRight() {
        let hasMoved = false;
        let move = (x, y, callback) => {
            if (y == ROWS + 1 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x][y + 1] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x][y + 1];
                this._arrBlock[x][y + 1] = block;
                this._data[x][y + 1] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x, y + 1, callback);
                });
                hasMoved = true;
            } else if (this._data[x][y + 1] == this._data[x][y]) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x][y + 1];
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
                this._data[x][y + 1] *= 2;
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null
                this.moveBlock(block, position, () => {
                    this.combineBlock(block, this._arrBlock[x][y + 1], this._data[x][y + 1], () => {
                        callback && callback();
                    })
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        }

        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = ROWS - 1; j >= 0; j--) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }
        cc.log(toMove)
        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    blockMoveLeft() {
        let hasMoved = false;
        let move = (x, y, callback) => {
            if (y == 0 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x][y - 1] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x][y - 1];
                this._arrBlock[x][y - 1] = block;
                this._data[x][y - 1] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x, y - 1, callback);
                });
                hasMoved = true;
            } else if (this._data[x][y - 1] == this._data[x][y]) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x][y - 1];

                this._data[x][y - 1] *= 2;
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null
                this.moveBlock(block, position, () => {
                    this.combineBlock(block, this._arrBlock[x][y - 1], this._data[x][y - 1], () => {
                        callback && callback();
                    })
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        }
        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }

        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    blockMoveDown() {
        let hasMoved = false;
        let move = (x, y, callback) => {
            if (x == ROWS - 1 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x + 1][y] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x + 1][y];
                this._arrBlock[x + 1][y] = block;
                this._data[x + 1][y] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x + 1, y, callback);
                });
                hasMoved = true;
            } else if (this._data[x + 1][y] == this._data[x][y]) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x + 1][y];

                this._data[x + 1][y] *= 2;
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null
                this.moveBlock(block, position, () => {
                    this.combineBlock(block, this._arrBlock[x + 1][y], this._data[x + 1][y], () => {
                        callback && callback();
                    })
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        }
        let toMove = [];
        for (let i = ROWS - 1; i >= 0; i--) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }
        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    blockMoveUp() {
        let hasMoved = false;
        let move = (x, y, callback) => {
            if (x == 0 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x - 1][y] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x - 1][y];
                this._arrBlock[x - 1][y] = block;
                this._data[x - 1][y] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x - 1, y, callback);
                });
                hasMoved = true;
            } else if (this._data[x - 1][y] == this._data[x][y]) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x - 1][y];

                this._data[x - 1][y] *= 2;
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null
                this.moveBlock(block, position, () => {
                    this.combineBlock(block, this._arrBlock[x - 1][y], this._data[x - 1][y], () => {
                        callback && callback();
                    })
                });
                hasMoved = true;
            } else {
                callback && callback();
                return;
            }
        }
        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }
        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    gameOver() {
        cc.tween(this.node)
            .to(.5, { opacity: 150 })
            .start()
        this.loseLayOut.active = true;
    },

    gameWin() {
        this._canMove = false;
        cc.tween(this.node)
            .to(.5, { opacity: 150 })
            .start()
        this.winLayOut.active = true;
    },

    onRestartClick() {
        this._canMove = true;
        this.blockInit();
        this.init();
        this.node.opacity = 255;
        this.loseLayOut.active = false
        this.winLayOut.active = false
    },

    onContinueClick() {
        this._canMove = true;
        this.node.opacity = 255;
        this.winLayOut.active = false
    }

});
