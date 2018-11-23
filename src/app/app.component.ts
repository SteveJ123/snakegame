import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    //   title = 'app';



    board = [];
    pointers = {
        rowsCount: 10, //y
        columnsCount: 10, //x
        head: {
            x: 0,
            y: 0
        },
        tail: {
            x: 0,
            y: 0
        },
        food: {
            x: 0,
            y: 0
        },
        isHorizontal: true,
        backFlag: -1 //1 - forward, -1 backward
    };





    constructor() {




    }


    ngOnInit() {
        var h = document.getElementsByTagName('body')[0].clientHeight;
        var w = document.getElementsByTagName('body')[0].clientWidth;

        this.pointers.rowsCount = Math.floor(h / 20) - 2;    //changed parseInt to Math.floor
        this.pointers.columnsCount = Math.floor(w / 20) - 2;

        var lh = h - this.pointers.rowsCount * 20;
        var lw = w - this.pointers.columnsCount * 20;

        console.log("need to apply margin with lh and lw values");
        this.buildBoard();
        this.buildBoardData();
        this.initializeSnakeBody();
        this.moveSnake();
    }


    // (function () {

    // })();


    keydownHandler(event) {

        //vertical - left and right (in other words up and down do nothing)
        switch (event.keyCode) {
            case 27: //escape
                break;
            case 37: //left
                if (this.pointers.isHorizontal) return;
                this.pointers.isHorizontal = true;
                this.pointers.backFlag = -1;
                break;
            case 38: //up
                if (this.pointers.isHorizontal === false) return;
                this.pointers.isHorizontal = false;
                this.pointers.backFlag = -1;
                break;
            case 39: //right
                if (this.pointers.isHorizontal) return;
                this.pointers.isHorizontal = true;
                this.pointers.backFlag = 1;
                break;
            case 40: //down
                if (this.pointers.isHorizontal === false) return;
                this.pointers.isHorizontal = false;
                this.pointers.backFlag = 1;
                break;
        }
    }


    moveSnake() {

        var nextHeadPosition = this.getNextCell(this.pointers.head);
        var nextTailPosition = this.getNextCell(this.pointers.tail);
        this.board[this.pointers.head.y][this.pointers.head.x] = 1; //making previous as body part
        this.board[nextHeadPosition.y][nextHeadPosition.x] = 2; //making new head
        this.board[this.pointers.tail.y][this.pointers.tail.x] = 0; //taking off last bit of the tail
        this.pointers.head = nextHeadPosition;
        this.pointers.tail = nextTailPosition;
        this.refreshBoard();
        setTimeout(this.moveSnake, 100);
    }

    initializeSnakeBody() {
        var x = this.getRandomIntInclusive(0, this.pointers.columnsCount);
        var y = this.getRandomIntInclusive(0, this.pointers.rowsCount);
        x = 10;
        y = 5;
        this.board[y][x] = 2;
        var point = {
            x: x,
            y: y
        };
        this.pointers.head = point;
        for (var i = 0; i < 5; i++) {
            point = this.getPreviousCell(point);
            this.board[point.y][point.x] = 1;
        }
        this.pointers.tail = point;
    }

    updateAndRefresh() {
        this.updateBoardData();
        this.refreshBoard();
        setTimeout(this.updateAndRefresh, 1000);
    }

    buildBoard() {
        var board$ = document.getElementById('board');
        var row$ = document.createElement('div');
        row$.className = 'row';
        for (var j = 0; j < this.pointers.columnsCount; j++) {
            var cell$ = document.createElement('div');
            cell$.className = 'cell';
            row$.appendChild(cell$);
        }
        board$.appendChild(row$);
        for (var i = 0; i < this.pointers.rowsCount - 1; i++)
            board$.appendChild(row$.cloneNode(true));

    }

    buildBoardData() {
        this.board = new Array(this.pointers.rowsCount);
        for (var i = 0; i < this.pointers.rowsCount; i++) {
            this.board[i] = new Array(this.pointers.columnsCount);
            for (var j = 0; j < this.pointers.columnsCount; j++) {
                this.board[i][j] = 0;
            }
        }

    }

    updateBoardData() {
        for (var i = 0; i < this.pointers.rowsCount; i++) {
            for (var j = 0; j < this.pointers.columnsCount; j++) {
                this.board[i][j] = this.getRandomIntInclusive(0, 3);
            }
        }
    }


    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }


    refreshBoard() {
        var board$ = document.getElementById('board');
        var rows$ = board$.children;

        for (var i = 0; i < this.pointers.rowsCount; i++) {
            var cell$ = rows$[i].children;
            for (var j = 0; j < this.pointers.columnsCount; j++) {
                var css = this.getCssClassName(this.board[i][j]);
                this.applyCssClass(cell$[j], css);
            }
        }
    }



    applyCssClass(element, className) {
        var css = element.className;
        css = css.replace('snake-body', '');
        css = css.replace('snake-head', '');
        css = css.replace('food', '');
        css = css.trim();
        css += ' ' + className;
        element.className = css.trim();
    }


    getCssClassName(val) {
        switch (val) {
            case 1:
                return 'snake-body';
            case 2:
                return 'snake-head';
            case 3:
                return 'food';
        }
    }


    clonePoint(point) {
        return JSON.parse(JSON.stringify(point));
    }

    getNextCell(point) {
        point = this.clonePoint(point);
        if (this.pointers.isHorizontal) {
            point.x = point.x + (1 * this.pointers.backFlag);
            point = this.getCorrectedCoordiantes(point);
        } else {
            point.y = point.y + (1 * this.pointers.backFlag);
            point = this.getCorrectedCoordiantes(point);
        }
        return point;
    }

    getPreviousCell(point) {
        point = this.clonePoint(point);
        if (this.pointers.isHorizontal) {
            point.x = point.x - (1 * this.pointers.backFlag);
            point = this.getCorrectedCoordiantes(point);
        } else {
            point.y = point.y - (1 * this.pointers.backFlag);
            point = this.getCorrectedCoordiantes(point);
        }
        return point;
    }

    getCorrectedCoordiantes(point) {
        point = this.clonePoint(point);
        if (this.pointers.isHorizontal) {
            if (point.x < 0) point.x = this.pointers.columnsCount - 1; //need to refactors
            if (point.x >= this.pointers.columnsCount) point.x = 0; //need to refactors
        } else {
            if (point.y < 0) point.y = this.pointers.rowsCount - 1; //need to refactors
            if (point.y >= this.pointers.rowsCount) point.y = 0; //need to refactors
        }
        return point;
    }







}
