////////////////////////////////////////////////////////////////////////////////////////////
/**
 *@車両をセレクトボックスに動的にセットする
 */
fetch("data/cars_data_agg.json")
    .then(response => {
        return response.json();
    })
    .then(carData => {
        // console.log("carIDs:",carData.CAR_IDs);
        // const result = []; //test用
        for (const element of carData.CAR_IDs) {
            // console.log("element:"element); //確認用
            // result.push(element); //test用
            const selectCarName = document.getElementById("cars"); //select要素を取得する
            const option1 = document.createElement("option"); //option要素を新しく作る
            option1.value = element; //option要素にvalueと表示名を設定
            option1.textContent = "CAR ID - " + element; //セレクトボタンに表示するテキストを設定
            selectCarName.appendChild(option1); //select要素にoption要素を追加する
        }
        // test(result, ["04", "08", "10", "13", "16", "20", "25", "28", "77", "EF"]);
    })
    .catch(error => {
        alert("READ ERROR!");
    });
////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
/**
 *@カレンダーの今日以降の日付を選択出来ないようにする
 */
const notSlectDate = new Date(); //今日の日付を取得する
const YYYY = notSlectDate.getFullYear(); //「年」を取得する
const MM = ('00' + (notSlectDate.getMonth() + 1)).slice(-2); //「月」を取得する
const DD = ('00' + notSlectDate.getDate()).slice(-2); //「日」を取得する
document.getElementById("slectStartDate").max = YYYY + "-" + MM + "-" + DD; // 年月日をYYYY-MM-DDの文字列に変更して、HTMLにidで渡す　str開始日選択　fin終了日選択
document.getElementById("slectfinishDate").max = YYYY + "-" + MM + "-" + DD;
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
/**
 *@セレクトボックスの値変更でカレンダーの日付が入っていたら処理開始
 * variousProcessing(startDate, finishDate)
 */
const selectCars = document.getElementById("cars");

selectCars.addEventListener('change', selectCar); //セレクトボックスの値が変更されたら関数selectCar()を処理する
function selectCar() {
    const startDate = new Date(getStartDate.value); //開始カレンダーの日付を取得しstartDateに代入
    const finishDate = new Date(getFinishDate.value); //終了カレンダーの日付を取得しfinishDateに代入
    // console.log(isNaN(startDate));
    // console.log(isNaN(finishDate));
    if (isNaN(startDate) === false && isNaN(finishDate) === false) {
        createDataProcessing(startDate, finishDate);
    }
}
/////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
/**
 * @カレンダーの開始日終了日が選択されたら選択された日付を取得
 * @variousProcessing関数に引数を設定
 */
const getStartDate = document.getElementById("slectStartDate"); //グローバル変数 HTMLの開始カレンダーを選択する
getStartDate.addEventListener('change', selectStartDate); //カレンダーの日付が変更されたら関数selectStartDate()1を処理する
function selectStartDate() {
    const startDate = new Date(getStartDate.value); //開始カレンダーの日付を取得しstartDateに代入
    const finishDate = new Date(getFinishDate.value); //終了カレンダーの日付を取得しfinishDateに代入
    // console.log("startDate:", startDate);
    // console.log("finishDate:", finishDate);
    createDataProcessing(startDate, finishDate); //createDataProcessing(startDate,finishDate)関数に引数を設定
}

const getFinishDate = document.getElementById("slectfinishDate"); //グローバル変数 HTMLの開始カレンダーを選択する
getFinishDate.addEventListener('change', selectFinishDate); //カレンダーの日付が変更されたら関数selectFinishDate()を処理する
function selectFinishDate() {
    const startDate = new Date(getStartDate.value); //開始カレンダーの日付を取得しstartDateに代入
    const finishDate = new Date(getFinishDate.value); //終了カレンダーの日付を取得しfinishDateに代入
    // console.log("startDate2:", startDate);
    // console.log("finishDate2:", finishDate);
    createDataProcessing(startDate, finishDate); //createDataProcessing(startDate,finishDate)関数に引数を設定
}
///////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
/**
 * @@グローバルスコープ
 */
let sumA1 = 0;
let avePowerConsumption = 0;
let sumA2 = 0;
let addLatitudeLongitude = 0;
let deleteData = [];
let labelData = [];
let dataPowerConsumption = [];
let dataCO2 = [];
let dataRunTime = [];
let dataIdleTime = [];
let dataDrivingDistance = [];
let myLineChart1 = new Chart();
let myLineChart2 = new Chart();
//////////////////////////////////////////////////////////////////////////////////

//JavaScript に同期した delay 関数を実装する/////////////////////////////////////
//処理順序のばらつきをなくすためdelayを入れる==>きくのかな
function syncDelay(milliseconds) {
    let start = new Date().getTime();
    let end = 0;
    while ((end - start) < milliseconds) { //経過時間を計算して待ち時間と比較
        end = new Date().getTime();
    }
}
//////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @メイン処理
 * @車両と日にちが入力されたら処理開始
 */
function createDataProcessing(startDate, finishDate) {
    termDay = (finishDate - startDate) / 86400000; //日数を割り出す
    // console.log(termDay);
    // console.log(isNaN(termDay));
    const table = document.getElementById("targetTable"); //HTML table id="targetTable" の場所をとってくる
    table.innerHTML = ""; //tableの初期化する
    const getCar = document.getElementById("cars").value; //HTML select で選択した号車をvalue filenameで使う

    deleteMarker(deleteData); //deleteMarker関数にdeleteDataを引数として渡す　dereteDataはグローバル変数として上部に記載
    sumA1 = 0;
    avePowerConsumption = 0;
    sumA2 = 0;
    deleteData = [];
    labelData = [];
    dataPowerConsumption = [];
    dataCO2 = [];
    dataRunTime = [];
    dataIdleTime = [];
    dataDrivingDistance = [];
    // console.log("getCar", getCar); //確認用

    // if (isNaN(termDay) === NaN) { //termDayがNaNの時は
    if (termDay === NaN) { //termDayがNaNの時は
        ; //何もしない
    } else if (getCar === "1") { //車両が選択されていない場合はalertを出す
        alert("号車を選択してください");
    } else if (termDay < 0) { //termDayが0より小さい場合はalertを出す
        alert("終了日を開始日より後に設定してください");
    } else {
        for (let i = 0; i <= termDay; i++) { //termDay分　for文を回す

            const fileName = makeFileName(finishDate, i);
            // console.log("fileName", fileName); //確認用

            fetch(fileName)
                .then(response => {
                    return response.json();
                })
                .then(dayData => {
                    // console.log("fetch dayData:", dayData); //確認用
                    let a = new Array(7);
                    a[0] = dayData.last_date;
                    a[1] = dayData.total_power_consumption;
                    a[2] = dayData.total_CO2;
                    a[3] = dayData.total_rumtime;
                    a[4] = dayData.total_idletime;
                    a[5] = dayData.total_driving_distance;
                    a[6] = dayData.last_latitude;
                    a[7] = dayData.last_longitude;
                    // console.log(a[7]);

                    //表示エリアに表示する用
                    const numberA1 = parseFloat(a[1]); //電費 //parseFloat() 関数は、引数を解釈し、浮動小数点値を返す。==>stringをnumberに変換
                    averagePowerConsumption(numberA1, termDay); //numberA1を引数にaveragePowerConsumption関数を呼び出し

                    //表示エリアに表示する用
                    const numberA2 = parseFloat(a[2]); //CO2 //parseFloat() 関数は、引数を解釈し、浮動小数点値を返す。==>stringをnumberに変換
                    totalSumCo2(numberA2); //numberA2を引数にtotalSumCo2関数を呼び出し

                    //表エリアに表を表示する用
                    const dataArray = [a[0], a[1], a[2], a[3], a[4], a[5]];
                    makeTable(dataArray);

                    //MAPエリアに軌跡を表示する用
                    const numberA6 = a[6]; //緯度
                    const numberA7 = a[7]; //経度
                    mekeMarker(numberA6, numberA7); //numberA6, numberA7を引数にmakeMarker関数を呼び出し

                    //グラフ作成用に配列を作成
                    labelData.push(a[0]);
                    dataPowerConsumption.push(a[1]);
                    dataCO2.push(a[2]);
                    dataRunTime.push(a[3]);
                    dataIdleTime.push(a[4]);
                    dataDrivingDistance.push(a[5]);

                    //for分が終わったらsetData関数を呼び出し==>グラフ作成用
                    if (i === termDay) {
                        //console.log("for_ifend:", labelData);
                        setData(labelData, dataPowerConsumption, dataCO2, dataRunTime, dataIdleTime, dataDrivingDistance);
                    }
                })
                .catch(error => {
                    //jsonファイルがなかったら初期化　&　READ ERROR!!!をalertで発砲
                    const dispAve = document.getElementById("denpi");
                    dispAve.innerHTML = "- (Wh/km)";

                    const dispSum = document.getElementById("co2");
                    dispSum.innerHTML = "- (t)";

                    if (myLineChart1) {
                        myLineChart1.destroy();
                    }

                    if (myLineChart2) {
                        myLineChart2.destroy();
                    }

                    alert("READ ERROR!!!");
                });
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @ファイル名を作成する
 * @fileNameを返す
 */
function makeFileName(finishDate, i) {
    const wordCar = document.getElementById("cars").value; //HTML select で選択した号車の値を取得 filenameで使う
    const formatDate = new Date(finishDate); //finishDateの日付を変数に代入する
    formatDate.setDate(formatDate.getDate() - i); //月跨ぎに月を繰り上げる、繰り下げるfinishDateの日付から降順する表を作成
    const YYYY = formatDate.getFullYear(); //「年」を取得する
    const MM = ("00" + (formatDate.getMonth() + 1)).slice(-2); //「月」を取得する
    const DD = ("00" + formatDate.getDate()).slice(-2); //「日」を取得する
    const wordDate = YYYY + "-" + MM + "-" + DD; //YYYY-MM-DDの文字列を代入する filenameで使用
    const fileName = "data/ID-" + wordCar + "_" + wordDate + "(Total).json";
    syncDelay(30); //wordsをjoinするまでに30ms待機状態にする==>ファイルの呼び出される順番がたまにバラバラになるからおまじない的な
    return fileName;
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @電費の平均値を表示する
 * @HTMLのid_dinpiに算出した値を表示
 */
function averagePowerConsumption(numberA1, termDay) { //variousProcessing関数で算出したavePowerConsumptioの引数を渡す
    // console.log(numberA1);
    sumA1 += numberA1; //sumA1にnumberA1を加算
    avePowerConsumption = sumA1 / (termDay + 1); //averageを算出
    const dispAve = document.getElementById("denpi"); //html id="denpi" の場所を変数として定義
    dispAve.textContent = avePowerConsumption.toFixed(1) + " (Wh/km)"; //htmlにavePowerConsumptionを表示 .toFixed(1)は小数点第1まで表示する
    // test(avePowerConsumption.toFixed(1), "5.3"); //test
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @CO2削減量の積算値を表示する
 * @HTMLのid_co2に値を表示
 */
function totalSumCo2(numberA2) { //variousProcessing関数で算出したasumCo2の引数に処理
    // console.log("numberA2:",numberA2) //確認用
    sumA2 += numberA2; //sumCo2にnumberA2を加算
    const dispSum = document.getElementById("co2"); //html id="co2" の場所を変数として定義
    dispSum.textContent = sumA2.toFixed(2) + " (t)"; //htmlにsumCo2を表示 .toFixed(1)は小数点第1まで表示する
    // test(sumA2.toFixed(1), "0.4"); //test
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @表を作成する
 * @HTMLのTableAreaに表を表示
 */
function makeTable(dataArray) {
    // console.log("dataArray:", dataArray) //確認用
    const table = document.getElementById("targetTable"); //HTML table id="targetTable" の場所をとってくる
    const newRow = table.insertRow();
    for (let i = 0; i <= 5; i++) {
        const newCell = newRow.insertCell();
        const newText = document.createTextNode(dataArray[i]);
        newCell.appendChild(newText);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
/**
 * @MAPを表示する
 * @leafret.jsライブラリを使用
 */
let map = L.map("view_map").setView([35.054981, 137.160269], 14); //地図の中心部とズームの値を設定　今はトヨタになってる
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { // OpenStreetMap から地図画像を読み込む記述
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
}).addTo(map);

L.marker([35.054981, 137.160269]).addTo(map); //設定した緯度経度にマーカーを表示する
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
/**
 * @MAPにマーカーを表示
 * @leafret.jsライブラリを使用
 */
function mekeMarker(numberA6, numberA7) { //地図にマーカーを表示する関数
    addLatitudeLongitude = JSON.parse("[" + numberA6 + "," + numberA7 + "]")
    let sampleIcon = L.icon({ //自分で作成したアイコンを使う場合
        iconUrl: "icon/icon.png", //アイコンの場所と使用するファイル
        iconSize: [20, 15], //アイコンの大きさ
    });
    const addMarker = L.marker(addLatitudeLongitude, { icon: sampleIcon }).addTo(map); //地図にマーカーを表示する
    deleteData.push(addMarker); //表示したマーカーをdeleteData(配列)に追加⇒日付変更時に初期化する為
}
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
/**
 * @MAPのマーカーを消去
 * @leafret.jsライブラリを使用
 */
function deleteMarker(deleteData) { //マーカーを初期化する関数
    //console.log(deleteData)
    for (const element of deleteData) { //dereteDataの配列の要素をひとつづつerementに代入
        map.removeLayer(element); //removeLayerでマーカーを消去
    }
}
//////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
/**
 * @グラフを作成用のデータ処理
 */
function setData(labelData, dataPowerConsumption, dataCO2, dataRunTime, dataIdleTime, dataDrivingDistance) {
    let setDataOjt = {}; //新規オブジェクトを作成
    setDataOjt.labels = labelData; //labelDataをreverse()で順番を逆にしてsetDataOjtに格納
    setDataOjt.data1 = dataPowerConsumption; //dataPowerConsumptionをreverse()で順番を逆にしてsetDataOjtに格納
    setDataOjt.data2 = dataCO2; //dataCO2をreverse()で順番を逆にしてsetDataOjtに格納
    setDataOjt.data3 = dataRunTime; //dataRunTimeをreverse()で順番を逆にしてsetDataOjtに格納
    setDataOjt.data4 = dataIdleTime; //dataIdltimeをreverse()で順番を逆にしてsetDataOjtに格納
    setDataOjt.data5 = dataDrivingDistance; //dataDrivingDistanceをreverse()で順番を逆にしてsetDataOjtに格納
    // console.log(setDataOjt); //確認用
    makeGraph1(setDataOjt); //setDataOjtを引数にmakeGraph1関数を呼び出し
    makeGraph2(setDataOjt); //setDataOjtを引数にmakeGraph1関数を呼び出し
}
/////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @グラフ表示 走行距離　走行時間　アイドル時間
 * @Chart.jsライブラリを使用
 */
function makeGraph1(setDataOjt) {
    if (myLineChart1) {
        myLineChart1.destroy();
    }
    let chartDataSet1 = {
        type: "bar",
        data: {
            labels: setDataOjt.labels,
            datasets: [{
                    label: '走行距離',
                    type: "line",
                    fill: false,
                    data: setDataOjt.data5,
                    backgroundColor: 'rgba(255, 153, 0, 0.5)',
                    borderColor: 'rgba(255, 153, 0, 0.5)',
                    yAxisID: "yleft",
                },
                {
                    label: '走行時間',
                    type: "bar",
                    fill: false,
                    data: setDataOjt.data3,
                    backgroundColor: 'rgba(0, 102, 255, 0.5)',
                    borderColor: 'rgba(0, 102, 255, 0.5)',
                    yAxisID: "yrigth",
                },
                {
                    label: 'アイドル時間',
                    type: "bar",
                    fill: false,
                    data: setDataOjt.data4,
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    yAxisID: "yrigth",
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                //凡例
                display: true
            },
            tooltips: {
                //ツールチップ
                enabled: true
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '日付',
                    },
                },
                yleft: {
                    type: "linear",
                    position: "left",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 300,
                    stepSize: 50,
                    autoSkip: true,
                    gridLines: {
                        drawOnChartArea: false,
                        offsetGridLines: true,
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "km",
                    },
                },
                yrigth: {
                    type: "linear",
                    position: "right",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 300,
                    stepSize: 0,
                    autoSkip: true,
                    gridLines: {
                        drawOnChartArea: false,
                        offsetGridLines: true,
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "分",
                    },
                },
            }
        }
    };

    let ctx1 = document.getElementById('graph-area1').getContext('2d');
    myLineChart1 = new Chart(ctx1, chartDataSet1);
};
/////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @グラフ表示　電費　CO2削減量
 * @Chart.jsライブラリを使用
 */
function makeGraph2(setDataOjt) {
    if (myLineChart2) {
        myLineChart2.destroy();
    }
    let chartDataSet2 = {
        type: "bar",
        data: {
            labels: setDataOjt.labels,
            datasets: [{
                    label: '電費',
                    data: setDataOjt.data1,
                    backgroundColor: 'rgba(255, 218, 5, 0.5)',
                    borderColor: 'rgba(255, 218, 5, 0.5)',
                    yAxisID: "yleft",
                },
                {
                    label: 'CO2削減量',
                    data: setDataOjt.data2,
                    backgroundColor: 'rgba(60, 190, 20, 0.5)',
                    borderColor: 'rgba(60, 190, 20, 0.5)',
                    yAxisID: "yrigth",
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                //凡例
                display: true
            },
            tooltips: {
                //ツールチップ
                enabled: true
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '日付',
                    },
                },
                yleft: {
                    type: "linear",
                    position: "left",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 50,
                    stepSize: 20,
                    autoSkip: true,
                    gridLines: {
                        drawOnChartArea: false,
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "Wh/km",
                    },
                },
                yrigth: {
                    type: "linear",
                    position: "right",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 10,
                    stepSize: 2,
                    autoSkip: true,
                    gridLines: {
                        drawOnChartArea: false,
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "t",
                    },
                },
            },
        }
    };

    let ctx2 = document.getElementById('graph-area2').getContext('2d');
    myLineChart2 = new Chart(ctx2, chartDataSet2);
};
/////////////////////////////////////////////////////////////////////////////////////