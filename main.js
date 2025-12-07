'use strict';
const ondemand1st       = new Date('2026-01-07 23:59:59');
const ondemand2nd       = new Date('2026-01-28 23:59:59');
const ondemandFinal     = new Date('2026-02-11 23:59:59');
const pixivFinal        = new Date('2026-02-11 23:59:59');
const liveFinal         = new Date('2026-02-15 23:59:59');
const deadlineMiddle    = document.getElementById('deadline-middle');
const deadlineOndemand  = document.getElementById('deadline-ondemand');
const deadlinePixiv     = document.getElementById('deadline-pixiv');
const deadlineLive      = document.getElementById('deadline-live');
const lastMiddle        = document.getElementById('last-middle');
const lastOndemand      = document.getElementById('last-ondemand');
const lastPixiv         = document.getElementById('last-pixiv');
const lastLive          = document.getElementById('last-live');

document.addEventListener('DOMContentLoaded', function() {
  // --- 1. report-edit.jsで保存したデータを読み込む ---
  const savedDataJSON = localStorage.getItem('formInputData');
  
  // コンテナ要素を先に取得
  const container = document.getElementById('table-container');

  // データがlocalStorageに存在しない場合の処理
  if (!savedDataJSON) {
    console.warn('localStorageに "formInputData" が見つかりません。');
    container.textContent = '科目のデータがありません。「編集画面へ」よりデータを登録してください。';
    return; // 処理を中断
  }

  let savedData = [];
  try {
    // JSON文字列をJavaScriptの配列オブジェクトに変換
    savedData = JSON.parse(savedDataJSON);
  } catch (error) {
    console.error('localStorageデータの解析に失敗しました:', error);
    container.textContent = 'データの読み込みに失敗しました。';
    return;
  }

  // --- 2. テーブル要素を動的に作成 ---
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // 3. テーブルヘッダー（見出し）を作成
  const headerRow = document.createElement('tr');
  // 指定された4つの見出し
  const headers = ['履修科目', '科目区分', '提出数', 'レポート数'];

  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  let remaining1st        = 0;
  let remaining2nd        = 0;
  let remainingOndemand   = 0;
  let remainingPixiv      = 0;
  let remainingLive       = 0;

  // --- 4. データ行を作成 ---
  savedData.forEach(rowData => {
    // rowData の中身例: { id: 0, name: '...', category: '...', submission: '...' }

    // 空行かどうかを判定します
    // (name が空か、submission が空か、category が 'space' か)
    const isNameEmpty = !rowData.name || rowData.name.trim() === '';
    const isCategorySpace = rowData.category === 'space';
    const isSubmissionEmpty = !rowData.submission || rowData.submission.trim() === '';

    // 「科目名」「科目区分(space)」「提出数」がすべて空の場合は、
    // この行の処理をスキップし、テーブルに追加しません。
    if (isNameEmpty && isCategorySpace && isSubmissionEmpty) {
      return; // この行の処理を中断し、次のデータに進む
    }

    const tr = document.createElement('tr');

    // 4-1. 「科目区分」の変換ロジック
    let categoryText = '';
    switch (rowData.category) {
      case 'space':
        categoryText = ''; // 空文字
        break;
      case 'ondemand':
        categoryText = 'オンデマンド科目';
        break;
      case 'live':
        categoryText = 'ライブ映像科目';
        break;
      case 'pixiv':
        categoryText = 'pixiv提携科目';
        break;
      default:
        categoryText = rowData.category || ''; // 不明な値はそのまま表示(または空文字)
    }

    // 4-2. 「レポート数」の変換ロジック
    let reportCount = '';
    if (rowData.category === 'space') {
      reportCount = '';
    } else if (rowData.category === 'pixiv') {
      reportCount = '8';
    } else {
      // 'space' と 'pixiv' 以外 (ondemand, live)
      reportCount = '15';
    }

    // 4-3. 各列のデータを配列にまとめる
    const cellsData = [
      rowData.name || '',       // 科目名
      categoryText,             // 科目区分 (変換後)
      rowData.submission || '', // 提出数
      reportCount               // レポート数 (変換後)
    ];

    // 4-4. <td> を生成して tr に追加
    cellsData.forEach(cellText => {
      const td = document.createElement('td');
      td.textContent = cellText;
      tr.appendChild(td);
    });

    // 4-5. <tbody> に <tr> を追加
    tbody.appendChild(tr);

    // 「提出数」を数値に変換 (空文字や数値でない場合は 0 として扱う)
    const submissionValue = parseInt(rowData.submission, 10) || 0;
    const category = rowData.category;

    // ・科目区分が「オンデマンド科目」かつ「提出数」が5以下
    if (category === 'ondemand' && submissionValue <= 5) {
      remaining1st += (5 - submissionValue);
    }

    // ・科目区分が「オンデマンド科目」かつ「提出数」が10以下
    if (category === 'ondemand' && submissionValue <= 10) {
      remaining2nd += (10 - submissionValue);
    }

    // ・科目区分が「オンデマンド科目」かつ「提出数」が15以下
    if (category === 'ondemand' && submissionValue <= 15) {
      remainingOndemand += (15 - submissionValue);
    }

    // ・科目区分が「pixiv提携科目」かつ「提出数」が8以下
    if (category === 'pixiv' && submissionValue <= 8) {
      remainingPixiv += (8 - submissionValue);
    }

    // ・科目区分が「ライブ映像科目」かつ「提出数」が15以下
    if (category === 'live' && submissionValue <= 15) {
      remainingLive += (15 - submissionValue);
    }
  });

  // --- 5. <table> に <thead> と <tbody> を追加 ---
  table.appendChild(thead);
  table.appendChild(tbody);

  // --- 6. 最後にコンテナに <table> を追加 ---
  container.appendChild(table);

  function msToDays(ms) {
    return ms / (1000 * 60 * 60 * 24);
  }
  const now = new Date();
  const days1st = Math.floor(msToDays(ondemand1st.getTime() - now.getTime()));
  const days2nd = Math.floor(msToDays(ondemand2nd.getTime() - now.getTime()));
  const daysFinal = Math.floor(msToDays(ondemandFinal.getTime() - now.getTime()));
  const pixivDaysFinal = Math.floor(msToDays(pixivFinal.getTime() - now.getTime()));
  const liveDaysFinal = Math.floor(msToDays(liveFinal.getTime() - now.getTime()));
  const around1st = Math.ceil(remaining1st / (Math.floor(days1st) + 1));
  const around2nd = Math.ceil(remaining2nd / (Math.floor(days2nd) + 1));
  const aroundOndemand = Math.ceil(remainingOndemand / (Math.floor(daysFinal) + 1));
  const aroundPixiv = Math.ceil(remainingPixiv / (Math.floor(pixivDaysFinal) + 1));
  const aroundLive = Math.ceil(remainingLive / (Math.floor(liveDaysFinal) + 1));

  if (days1st >= 0) {
    deadlineMiddle.innerText =
      `あと ${days1st} 日（オンデマンド科目 第 1 締切）`;
    lastMiddle.innerText =
      `残り ${remaining1st} 件（第 1 締切分レポート）`;
  } else if (days2nd >= 0) {
    deadlineMiddle.innerText =
      `あと ${days2nd} 日（オンデマンド科目 第 2 締切）`;
    lastMiddle.innerText =
      `残り ${remaining2nd} 件（第 2 締切分レポート）`;
  }
  if (daysFinal >= 0) {
    deadlineOndemand.innerText =
      `あと ${daysFinal} 日（オンデマンド科目 最終締切）`;
    lastOndemand.innerText =
      `残り ${remainingOndemand} 件（オンデマンド科目 レポート）`;
  }
  if (pixivFinal >= 0) {
    deadlinePixiv.innerText =
      `あと ${pixivDaysFinal} 日（pixiv提携科目 最終締切）`;
    lastPixiv.innerText =
      `残り ${remainingPixiv} 件（pixiv提携科目 レポート）`;
  }
  if (liveFinal >= 0) {
    deadlineLive.innerText =
      `あと ${liveDaysFinal} 日（ライブ映像科目 最終締切）`;
    lastLive.innerText =
      `残り ${remainingLive} 件（ライブ映像科目 レポート）`;
  }
  if (days1st >= 0 && remaining1st > 0) {
    lastMiddle.innerText +=
      `
      1 日 ${around1st} 件ペースで ${Math.floor(days1st - remaining1st / around1st)} 日、${around1st + 1} 件ペースで ${Math.floor(days1st - remaining1st / (around1st + 1))} 日余ります`;
  } else if (days2nd >= 0 && remaining2nd > 0) {
    lastMiddle.innerText +=
      `
      1 日 ${around2nd} 件ペースで ${Math.floor(days2nd - remaining2nd / around2nd)} 日、${around2nd + 1} 件ペースで ${Math.floor(days2nd - remaining1st / (around2nd + 1))} 日余ります`;
  }
  if (daysFinal >= 0 && remainingOndemand > 0) {
    lastOndemand.innerText +=
      `
      1 日 ${aroundOndemand} 件ペースで ${Math.floor(daysFinal - remainingOndemand / aroundOndemand)} 日、${aroundOndemand + 1} 件ペースで ${Math.floor(daysFinal - remainingOndemand / (aroundOndemand + 1))} 日余ります`;
  }
  if (pixivDaysFinal >= 0 && remainingPixiv > 0) {
    lastPixiv.innerText +=
      `
      1 日 ${aroundPixiv} 件ペースで ${Math.floor(pixivDaysFinal - remainingPixiv / aroundPixiv)} 日、${aroundPixiv + 1} 件ペースで ${Math.floor(pixivDaysFinal - remainingPixiv / (aroundPixiv + 1))} 日余ります`;
  }

})



