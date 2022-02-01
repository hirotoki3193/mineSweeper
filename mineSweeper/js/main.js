// v1.3 テーブル構造体 classに変更
$(function(){

	const rowInput = ':input[name="row"]',
		  colInput = ':input[name="col"]',
		  mineInput = ':input[name="mine"]',
		  tableSelector = $('#contents table');
	// テーブルオブジェクトを生成
	let board = new TableObject(tableSelector,rowInput,colInput);
	// 初回読み込み
	board.updateTable();
	// マインスイーパーを生成
	let ms = new MineSweeper(mineInput,board);




	// input表示切り替え
	$('legend').on('click',function(){
		$(this).toggleClass('active');
	})

	// リセットイベント
	$(':button').on('click',function(){
		board.updateTable();
		ms.reset = ms.inputValue;
		$('.result').removeClass('active');
	});
	// 右クリック時のイベント
	$('#table1').on('contextmenu','td',function(){
		// ゲーム中
		if((ms.start ^ ms.end) && !$(this).hasClass('safe')){
			$(this).toggleClass('flag');
		}
		// メニューを非表示
		return false;
	});

	// 左クリック時のイベント
	$('#table1').on('click','td',function(){
		// フラグがあれば回収
		$(this).removeClass('flag');
		// クリックしたセルから行・列を取得
		let tdId = $(this).attr('id');
		// ゲーム開始前
		if(!ms.start){
			ms.start = tdId;
			if(!ms.start){
				console.log('設置に失敗しました')
				// 終了状態へ移行
				ms.end = true;
				return;
			}
		}
		// ゲーム中
		if(ms.start ^ ms.end){
			let que = ms.queue;

			// bfs
			que.push(ms.getPosition(tdId));
			while(que.length){
				let cell = que.shift();
				ms.checkIsSafe(cell);
			}
			// 地雷を選んだ場合
			if(ms.end){
				$('.result').find('p').text('GAME OVER...');
				$('.result').addClass('active');
			}
			// 開いたマスの数を取得
			setTimeout(function(){
				let mineCount = ms.mineCount;
				let safeCount = $('.safe').length;
				let per = safeCount / (board.tdCount - mineCount);

				// 背景色を変更
				$('#contents').css({'--i':per});

				// 残りが地雷だけなら終了する
				if(safeCount==board.tdCount - mineCount){
					isEnd = true;
					$('.result').find('p').text('congratulations!');
					$('.result').addClass('active');
				}
			},100);
		}
	});
});