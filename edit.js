'use strict';
// HTMLドキュメントの読み込みが完了したら、中のコードを実行
document.addEventListener('DOMContentLoaded', function() {

  // 保存データを読み込む
  const savedDataJSON = localStorage.getItem('formInputData');
  let savedData = []; // デフォルトは空配列
  if (savedDataJSON) {
    savedData = JSON.parse(savedDataJSON);
  }
  // フォーム生成とデータ復元を同時に行う
  // HTML側で用意した親コンテナを取得
  const container = document.getElementById('form-container');

  // 作成したいセットの数
  const numberOfSets = 30;

  // 'for'ループを使って、20回処理を繰り返す
  for (let i = 0; i < numberOfSets; i++) {
    // 該当する行の保存データを取得 (なければ空のオブジェクト)
    const data = savedData[i] || {};

    // --- 1セット分の要素を作成 ---

    // (A) 1つ目のメッセージボックス (<input type="text">)
    const input1 = document.createElement('input');
    input1.type = 'text';
    // idを一意にする
    input1.id = `name-${i}`;
    // 文字数上限を設定
    input1.maxLength = '30';
    input1.value = data.name || ''; // 保存された値をセット

    // (B) プルダウン (<select>)
    const select = document.createElement('select');
    // idを一意にする
    select.id = `category-${i}`;

    // (C) プルダウンの中の選択肢 (<option>)
    const option1 = document.createElement('option');
    option1.value = 'space'; // 送信用の値
    option1.textContent = ''; // 表示されるテキスト
    // selectの中にoptionを追加
    select.appendChild(option1);
    // 他の選択肢も、同様に作成してappendChild
    const option2 = document.createElement('option');
    option2.value = 'ondemand';
    option2.textContent = 'オンデマンド科目';
    select.appendChild(option2);
    const option3 = document.createElement('option');
    option3.value = 'live';
    option3.textContent = 'ライブ映像科目';
    select.appendChild(option3);
    const option4 = document.createElement('option');
    option4.value = 'pixiv';
    option4.textContent = 'pixiv提携科目';
    select.appendChild(option4);
    select.value = data.category || 'space'; // 保存された値をセット

    // (D) 2つ目のメッセージボックス (<input type="text">)
    const input2 = document.createElement('input');
    input2.type = 'text';
    // idを一意にする
    input2.id = `submission-${i}`;
    // 文字数上限を設定
    input2.maxLength = '2';
    input2.value = data.submission || ''; // 保存された値をセット

    // --- スタイリングと管理のために、1行をdivでまとめる（推奨）---
    const setWrapper = document.createElement('div');
    setWrapper.className = 'input-set'; // CSSでスタイルを当てるためのクラス名

    // ラッパーに(A)〜(D)の要素を追加
    setWrapper.appendChild(input1);
    setWrapper.appendChild(select);
    setWrapper.appendChild(input2);

    // --- 最後に、完成した1セットを親コンテナに追加 ---
    container.appendChild(setWrapper);
  }
// --- ▼ 編集確定ボタンの処理（ここから追記） ▼ ---
  // 1. HTMLから「編集確定」ボタン要素を取得
  const confirmButton = document.getElementById('confirm');

  // 2. ボタンがクリックされた時のイベントリスナーを設定
  confirmButton.addEventListener('click', function() {
    
    // 3. 確認ダイアログを表示
    // [OK]が押されると isConfirmed は true に、[キャンセル]だと false になる
    const isConfirmed = window.confirm('編集を確定し、データを保存しますか？');

    // 4. [OK] (true) が押された場合のみ、保存処理を実行
    if (isConfirmed) {
      
      const numberOfSets = 20; // 生成したセット数（前回と合わせる）
      const dataToSave = []; // 保存するデータをまとめるための配列

      // 5. 20セット分のデータをループで取得
      for (let i = 0; i < numberOfSets; i++) {
        // 各要素のDOMを取得
        const input1 = document.getElementById(`name-${i}`);
        const select = document.getElementById(`category-${i}`);
        const input2 = document.getElementById(`submission-${i}`);

        // 1セット分のデータをオブジェクトとして作成
        const rowData = {
          id: i, // 何番目の行か分かるようにIDも入れておく（任意）
          name: input1.value,
          category: select.value,
          submission: input2.value
        };

        // 配列にデータを追加
        dataToSave.push(rowData);
      }

      // 6. データをlocalStorageに保存
      try {
        // オブジェクト配列をJSON文字列に変換して保存
        localStorage.setItem('formInputData', JSON.stringify(dataToSave));
        
        // ユーザーに保存完了を通知
        alert('データを保存しました。');

      } catch (error) {
        // (容量オーバーなどで) 保存に失敗した場合
        console.error('localStorageへの保存に失敗しました:', error);
        alert('データの保存に失敗しました。コンソールを確認してください。');
      }
    }
    // 4. (else) キャンセルが押された場合は何もしない
  });
  // --- ▲ 編集確定ボタンの処理（ここまで） ▲ ---
});