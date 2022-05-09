////////////////////////////////////////////////////////////////////////////////////////////
/**
 *@車両をセレクトボックスに動的にセットする
 */
fetch("data/cars_data_agg.json")
    .then(response => {
        return response.json();
    })
    .then(carData => {
        // console.log(carData.CAR_IDs);
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

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @カレンダーの今日以降の日付を選択出来ないようにする
 * @単独処理
 */
const notSlectDate = new Date(); //今日の日付を取得する
const YYYY = notSlectDate.getFullYear(); //「年」を取得する
const MM = ('00' + (notSlectDate.getMonth() + 1)).slice(-2); //「月」を取得する
const DD = ('00' + notSlectDate.getDate()).slice(-2); //「日」を取得する
document.getElementById("notSelected").max = YYYY + "-" + MM + "-" + DD; // 年月日をYYYY-MM-DDの文字列に変更して、HTMLにidで渡す　str開始日選択　fin終了日選択
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @セレクトボックスの値変更でカレンダーの日付が入っていたら処理開始
 * variousProcessing(days)
 */
const selectCars = document.getElementById("cars");

selectCars.addEventListener('change', selectCar); //カレンダーの日付が変更されたら関数selectCar()を処理する
function selectCar() {
    const days = new Date(getDays.value); //開始カレンダーの日付を取得しdaysに代入
    // console.log(isNaN(days));
    if (isNaN(days) === false) {
        variousProcessing(days);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @カレンダーで選択された日付を取得
 * @variousProcessing関数に引数を設定
 */
const getDays = document.getElementById("notSelected"); //グローバル変数 HTMLの開始カレンダーを選択する
getDays.addEventListener('change', selectDay); //カレンダーの日付が変更されたら関数selectDay()を処理する
function selectDay() {
    const days = new Date(getDays.value); //開始カレンダーの日付を取得しdaysに代入
    // console.log(days); //==>test用==>カレンダーで日付選択でコンソールに表示
    variousProcessing(days); //variousProcessing関数に引数を設定
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @グローバルスコープ
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
let dataIdltime = [];
let dataDrivingDistance = [];
let dataSoc = [];
let myLineChart1 = new Chart();
let myLineChart2 = new Chart();
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @メイン処理
 * @車両と日にちが入力されたら処理開始
 */
function variousProcessing(days) {
    const table = document.getElementById("targetTable"); //HTML table id="targetTable" の場所をとってくる
    //初期化
    table.innerHTML = ""; //tableの初期化する
    deleteMarker(deleteData); //deleteMarker関数にdeleteDataを引数として渡す　dereteDataはグローバルスコープとして上部に記載
    sumA1 = 0;
    avePowerConsumption = 0;
    sumA2 = 0;
    addLatitudeLongitude = 0;
    deleteData = [];
    labelData = [];
    dataPowerConsumption = [];
    dataCO2 = [];
    dataRunTime = [];
    dataIdltime = [];
    dataDrivingDistance = [];
    dataSoc = [];

    const fileName = makeFileName(days);
    // console.log("fileName:", fileName); //確認用
    // test(fileName, "data/ID-08_2022-04-29.json"); //test

    fetch(fileName)
        .then(response => {
            return response.json();
        })
        .then(dayData => {
            // console.log("fetch dayData:", dayData); //確認用
            for (let i = 0; i <= Object.keys(dayData).length - 1; i++) { //Object.keys(dayData).length分　for文を回す
                let a = new Array(8);
                a[0] = dayData[i].time;
                a[1] = dayData[i].power_consumption;
                a[2] = dayData[i].CO2;
                a[3] = dayData[i].rumtime;
                a[4] = dayData[i].idletime;
                a[5] = dayData[i].driving_distance;
                a[6] = dayData[i].latitude;
                a[7] = dayData[i].longitude;
                a[8] = dayData[i].SOC;
                // console.log(a[8])

                //表示エリアに表示する用
                const numberA1 = parseFloat(a[1]); //電費 //parseFloat() 関数は、引数を解釈し、浮動小数点値を返す。==>stringをnumberに変換
                averagePowerConsumption(numberA1, i); //numberA1を引数にaveragePowerConsumption関数を呼び出し

                //表示エリアに表示する用
                const numberA2 = parseFloat(a[2]); //CO2 //parseFloat() 関数は、引数を解釈し、浮動小数点値を返す。==>stringをnumberに変換
                totalSumCo2(numberA2); //numberA2を引数にtotalSumCo2関数を呼び出し

                //表エリアに表を表示する用
                const dataArray = [a[0], a[1], a[2], a[3], a[4], a[5], a[8]];
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
                dataIdltime.push(a[4]);
                dataDrivingDistance.push(a[5]);
                dataSoc.push(a[8]);

                //for分が終わったらsetData関数を呼び出し==>グラフ作成用
                if (i === Object.keys(dayData).length - 1) {
                    // console.log("for_ifend:", dataSoc);
                    setData(labelData, dataPowerConsumption, dataCO2, dataRunTime, dataIdltime, dataDrivingDistance, dataSoc);
                }
            }

        })
        .catch(error => {
            //jsonファイルがなかったら初期化　&　READ ERROR!!!をalertで発砲
            const dispAve = document.getElementById("denpi");
            dispAve.textContent = "- (Wh/km)";

            const dispSum = document.getElementById("co2");
            dispSum.textContent = "- (t)";

            if (myLineChart1) {
                myLineChart1.destroy();
            }

            if (myLineChart2) {
                myLineChart2.destroy();
            }

            alert("READ ERROR!!!");
        });
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @ファイル名を作成する
 * @fileNameを返す
 */
function makeFileName(days) {
    const wordCar = document.getElementById("cars").value; //HTML select で選択した号車の値を取得 filenameで使う
    // console.log(wordCar);
    if (wordCar === "1") { //選択していないと"1"なので1が入っていたらalert発砲!!!
        alert("号車を選択してください");
    } else {
        const YYYY = days.getFullYear(); //「年」を取得する
        const MM = ("00" + (days.getMonth() + 1)).slice(-2); //「月」を取得する
        const DD = ("00" + days.getDate()).slice(-2); //「日」を取得する
        const wordDay = YYYY + "-" + MM + "-" + DD; //YYYY-MM-DDの文字列を代入する filenameで使用
        const fileName = "data/ID-" + wordCar + "_" + wordDay + ".json" //選択した車両Noと日付から読みだすjsonファイルの名前を作成する
        return fileName;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @電費の平均値を表示する
 * @HTMLのid_dinpiに算出した値を表示
 */
function averagePowerConsumption(numberA1, i) { //variousProcessing関数で算出したavePowerConsumptionの引数を渡す
    // console.log(numberA1);
    sumA1 += numberA1; //sumA1にnumberA1を加算
    avePowerConsumption = sumA1 / (i + 1); //averageを算出
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
    // console.log("dataArray:",dataArray) //確認用
    const table = document.getElementById("targetTable"); //HTML table id="targetTable" の場所をとってくる
    const newRow = table.insertRow();
    for (let i = 0; i <= 6; i++) {
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

//////////////////////////////////////////////////////////////////////////////////////////
/**
 * @グラフ作成用のObjectを作成
 */
function setData(labelData, dataPowerConsumption, dataCO2, dataRunTime, dataIdltime, dataDrivingDistance, dataSoc) {
    let setDataOjt = {}; //新規オブジェクトを作成
    setDataOjt.labels = labelData; //labelDataをsetDataOjtに格納
    setDataOjt.dataPowerConsumption = dataPowerConsumption; //dataPowerConsumptionをsetDataOjtに格納
    setDataOjt.dataCO2 = dataCO2; //dataCO2をsetDataOjtに格納
    setDataOjt.dataRunTime = dataRunTime; //dataRunTimeをsetDataOjtに格納
    setDataOjt.dataIdltime = dataIdltime; //dataIdltimeをsetDataOjtに格納
    setDataOjt.dataDrivingDistance = dataDrivingDistance; //dataDrivingDistanceをsetDataOjtに格納
    setDataOjt.dataSoc = dataSoc; //dataSocをsetDataOjtに格納
    // console.log(setDataOjt); //確認用
    makeGraph1(setDataOjt); //setDataOjtを引数にmakeGraph1関数を呼び出し
    makeGraph2(setDataOjt); //setDataOjtを引数にmakeGraph1関数を呼び出し
}
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @グラフ表示 走行距離　走行時間　アイドル時間　SOC
 * @Chart.jsライブラリを使用
 */
function makeGraph1(setDataOjt) {
    if (myLineChart1) { //グラフの初期化　グラフがあれば初期化
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
                    data: setDataOjt.dataDrivingDistance,
                    backgroundColor: 'rgba(255, 153, 0, 0.5)',
                    borderColor: 'rgba(255, 153, 0, 0.5)',
                    yAxisID: "yleft",
                },
                {
                    label: '走行時間',
                    type: "bar",
                    fill: false,
                    data: setDataOjt.dataRunTime,
                    backgroundColor: 'rgba(0, 102, 255, 0.4)',
                    borderColor: 'rgba(0, 102, 255, 0.4)',
                    yAxisID: "yrigth",
                },
                {
                    label: 'アイドル時間',
                    type: "bar",
                    fill: false,
                    data: setDataOjt.dataIdltime,
                    backgroundColor: 'rgba(0, 255, 0, 0.4)',
                    borderColor: 'rgba(0, 255, 0, 0.4)',
                    yAxisID: "yrigth",
                },
                {
                    label: 'SOC',
                    type: "line",
                    fill: false,
                    data: setDataOjt.dataSoc,
                    backgroundColor: 'rgba(0, 100, 0, 0.5)',
                    borderColor: 'rgba(0, 100, 0, 0.5)',
                    yAxisID: "yrigth1",
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
                        text: '時間',
                    },
                },
                yleft: {
                    type: "linear",
                    position: "left",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 10,
                    stepSize: 2,
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
                    suggestedMax: 4,
                    stepSize: 1,
                    autoSkip: true,
                    gridLines: {
                        drawOnChartArea: false,
                        offsetGridLines: false,
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "分",
                    },
                },
                yrigth1: {
                    type: "linear",
                    position: "right",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 100,
                    stepSize: 50,
                    autoSkip: true,
                    gridLines: {
                        drawOnChartArea: false,
                        offsetGridLines: false,
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "SOC(%)",
                    },
                },
            }
        }
    };

    let ctx1 = document.getElementById('graph-area1').getContext('2d');
    myLineChart1 = new Chart(ctx1, chartDataSet1);
};
////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @グラフ表示　電費　CO2削減量
 * @Chart.jsライブラリを使用
 */
function makeGraph2(setDataOjt) {
    if (myLineChart2) { //グラフの初期化　グラフがあれば初期化
        myLineChart2.destroy();
    }
    let chartDataSet2 = {
        type: "bar",
        data: {
            labels: setDataOjt.labels,
            datasets: [{
                    label: '電費',
                    data: setDataOjt.dataPowerConsumption,
                    backgroundColor: 'rgba(255, 218, 5, 0.5)',
                    borderColor: 'rgba(255, 218, 5, 0.5)',
                    yAxisID: "yleft",
                },
                {
                    label: 'CO2削減量',
                    data: setDataOjt.dataCO2,
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
                        text: '時間',
                    },
                },
                yleft: {
                    type: "linear",
                    position: "left",
                    fontColor: "black",
                    beginAtZero: true,
                    min: 0,
                    suggestedMax: 15,
                    stepSize: 5,
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
                    suggestedMax: 0.1,
                    stepSize: 0.02,
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
////////////////////////////////////////////////////////////////////////////////////////////