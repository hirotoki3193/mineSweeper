
// 整数判定
function isNumber(val){
	const pattern = /^\d*$/;
	return pattern.test(val);
};

// 整数以外は空文字へ
function clearInvaildText(arr){
	console.assert(arr.length == 2,'引数が不正な値です');
	for(let i=0;i<2;i++){
		// 整数以外は空文字
		if(Number(arr[i]) < 1 || isNumber(arr[i])===false){
			arr[i] = "";
		}
	}
	return arr;	
};
// テーブルオブジェクト(構造体)？はここから
class TableObject{

	constructor(tableSelector,rowInput,colInput){
		// テーブル作成場所を設定
		this._tableSelector = tableSelector;
		// inputタグのセレクタを設定
		this._input = [rowInput,colInput];
		// inputの値を取得
		this._val = this.inputValue;
		// 行と列の最大値を設定
		this._maxVal = Number($(rowInput).attr('max'));
		this._minVal = Number($(rowInput).attr('min'));
	};


	get value(){
		return this._val;
	};
	set value(arr){
		console.assert(arr.length == 2,'引数が不正な値です');
		[this._val[0],this._val[1]] = arr;
	}

	// input要素から取得
	get inputValue(){
		let arr = new Array(2);
		for(let i=0;i<2;i++){
			arr[i] = Number($(this._input[i]).val());
		}
		return arr;
	};
	set inputValue(arr){
		console.assert(arr.length == 2,'引数が不正な値です');
		for(let i=0;i<2;i++){
			$(this._input[i]).val(arr[i]);
		}
	};
	// tdの合計数
	get tdCount(){
		return this._val[0] * this._val[1];
	}




	//最大値・最小値判定
	compMinMaxval(arr){
		console.assert(arr.length == 2,'引数が不正な値です');
		for(let i=0;i<2;i++){
			arr[i] = Math.min(this._maxVal,Math.max(Number(arr[i]),this._minVal));
		}
		return arr;
	}


	updateValue(){
		let arr = this.inputValue;
		clearInvaildText(arr);
		arr = this.compMinMaxval(arr);
		this.inputValue = arr;
		this.value = arr;
	}

	addTableText(arr){
		console.assert(arr.length == 2,'引数が不正な値です');
		const row = arr[0],
			  col = arr[1];
		
		// テーブルをクリア
		$(this._tableSelector).empty();
		
		// 大きなボードの場合はチャンク処理を実行
		const CHUNK_SIZE = 50; // 一度に処理する行数
		const renderChunk = (startRow) => {
			const endRow = Math.min(startRow + CHUNK_SIZE, row);
			
			const fragment = document.createDocumentFragment();
			
			for(let i = startRow; i < endRow; i++){
				const tr = document.createElement('tr');
				
				for(let j = 1; j <= col; j++){
					const td = document.createElement('td');
					// セル内の文字列
					const cellID = 'x' + j + 'y' + (i+1);
					td.id = cellID;
					tr.appendChild(td);
				}
				
				fragment.appendChild(tr);
			}
			
			$(this._tableSelector).append(fragment);
			
			// まだ描画する行が残っていれば、次のチャンクを描画
			if (endRow < row) {
				// タイマーを使って残りのチャンクを非同期で描画
				// これによりブラウザがフリーズする問題を防ぐ
				setTimeout(() => renderChunk(endRow), 0);
			}
		};
		
		// 最初のチャンクから描画開始
		renderChunk(0);
		
		return 0;
	};

	updateTable(){
		this.updateValue();
		// 値が正常(空文字など)なら更新
		if(Math.min(this._val[0],this._val[1]) > 0){
			// 大きなテーブルの場合はローディング表示
			if(this._val[0] * this._val[1] > 2500) { // 50x50以上の場合
				$(this._tableSelector).parent().addClass('loading');
			}
			
			this.addTableText(this._val);
			
			// ローディング表示を終了
			setTimeout(() => {
				$(this._tableSelector).parent().removeClass('loading');
			}, 100);
			
			return 0;
		}
		return 1;
	};
};
// テーブルオブジェクト(構造体)？はここまで
