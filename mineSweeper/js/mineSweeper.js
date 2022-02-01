// 2次元配列の作成
generate2DArray = (m, n) => {
	return Array.from(new Array(m), _ => new Array(n).fill(0));
};
const	dx = [1,-1,0,0,1,1,-1,-1],
		dy = [0,0,1,-1,1,-1,1,-1];

// マインスイーパーはここから
// TableObject.jsが必要
class MineSweeper{
	constructor(mineInput,tableObject){
		// input要素(地雷の数)
		this._mineInput = mineInput;
		this._table = tableObject;
		// 行・列・地雷
		this._value = this.inputValue;
		this._mineCount = this._value[2];
		// 行・列の幅
		this._width = this._value[0];
		this._height = this._value[1];
		// 地雷設置用の2次元配列
		this._vboard  = generate2DArray(this._value[0],this._value[1]);
		// チェック判定用の2次元配列
		this._checked = generate2DArray(this._value[0],this._value[1]);

		this._isStart = false;
		this._isEnd = false;
		this._queue = new Array;
	}
	get mineCount(){
		return this._mineCount;
	}
	// input要素から取得した値
	get inputValue(){
		let arr = new Array;

		arr[0] = this._table.value[0];
		arr[1] = this._table.value[1];
		arr[2] =  Number($(this._mineInput).val());

		return arr;
	}
	set inputValue(arr){
		console.assert(arr.length == 3,'引数が不正な値です');
		[this._width,this._height,this._mineCount] = arr;
		this._value = arr;
	}
	set reset(inputValArray){
		this.inputValue = inputValArray;
		this._vboard  = generate2DArray(inputValArray[0],inputValArray[1]);
		this._checked = generate2DArray(inputValArray[0],inputValArray[1]);
		this._isStart = false;
		this._isEnd = false;
	}
	get start(){
		return this._isStart;
	}
	// 地雷設置
	set start(tdID){
		let startPosition = this.getPosition(tdID);
		console.assert(startPosition.length == 2,'引数が不正な値です');
		const sX = startPosition[0],
			  sY = startPosition[1];
		
		let mine = this._mineCount;
		if(this._width * this._height - 2 < mine){
			console.log('地雷の数が多いよ！');
			this._isStart = false;
		} else {
			// 初期クリック地点には地雷は設置しない
			this._vboard[sX][sY] = 100;
			$('#x'+(sX+1)+'y'+(sY+1)).addClass('safe');
			let count = 0;
			while(count < mine){
				let x = Math.floor(Math.random() * (this._width));
				let y = Math.floor(Math.random() * (this._height));
				// 設置済みはスルー
				if(this._vboard[x][y] > 0){
						continue;
				}
				// 地雷を設置
				this._vboard[x][y] = 1;
				count++;

				// デバッグ用にクラスを付加:消しても大丈夫
				// let nowId = this.index2id(x,y);
				// $(nowId).addClass('mine');
			}
			this._isStart = true;
		}
	} 
	get end(){
		return this._isEnd;
	}
	set end(bool){
		this._isEnd = bool;
	}
	get queue(){
		return this._queue;
	}
	set addQueue(position){
		this._queue.push(position);
	}
	getPosition(tdID){
		let position = tdID.replace('x','').split('y');
		// 配列用に変換
		return [Number(position[0])-1,Number(position[1])-1];
	}
	// 地雷の位置を配列で取得
	get mines(){
		let arr = [];
		for(let x=0;x<this._width;x++){
			for(let y=0;y<this._height;y++){
				if(this._vboard[x][y]===1){
					arr.push({
						'x':x,
						'y':y
					});
				}
			}
		}
		return arr;
	}
	index2id(x,y){
		return '#x'+(x+1)+'y'+(y+1);
	};

	// 疑似キューでdfsに対応
	checkIsSafe(position){
		console.assert(position.length ==2 ,'引数が不正な値です')		
		const x = position[0],
			  y = position[1];
		let nowId = this.index2id(x,y);
		// チェック済み
		if(this._checked[x][y]){
			return;
		// 地雷を選択した場合
		}else if(this._vboard[x][y] == 1){
			$(nowId).addClass('end');
			let mines = this.mines;
			for(let mine of mines){
				let mineId = this.index2id(mine.x,mine.y);
				$(mineId).addClass('mine');
			}
			console.log('ゲームオーバー...');
			this._isEnd = true;
			return;
		}

		this._checked[x][y] = 1;
		$(nowId).addClass('safe');
		// 周辺の地雷数を調べる
		let count = 0;
		

		for(let i=0;i<dx.length;i++){
			let nx = x + dx[i],
				ny = y + dy[i];
			// 範囲外はカウントしない
			if(nx < 0 || nx >= this._width || ny < 0 || ny >= this._height){
				continue;
			}
			else if(this._vboard[nx][ny] == 1){
				count++;
			}
		}
		if(count == 0){
			for(let i=0;i<4;i++){
				let nx = x + dx[i],
					ny = y + dy[i];
				// 範囲外は探しに行かない
				if(nx < 0 || nx >= this._width || ny < 0 || ny >= this._height){
					continue;
				}
				if(!this._checked[nx][ny]){
					this.addQueue = [nx,ny];
				}
			}
		} else {
			$(nowId).html(count);
		}
	}
};