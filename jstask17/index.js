/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};
//key是日期值是降水量
// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
}
var wrap = document.getElementsByClassName('aqi-chart-wrap')[0];
/**
 * 渲染图表
 */
function renderChart() {  
  var color = '';
  var text = '';
  for(item in chartData){
    color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    // text += '<div title="'+item+':'+chartData[item]+'"style="height:'+chartData[item]+'px;background-color:'+color+'"></div>'
    text += '<div title="'+item+":"+chartData[item]+'" style="height:'+chartData[item]+'px; background-color:'+color+'"></div>';
  }
  wrap.innerHTML = text;
  
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(value) {
  // 确定是否选项发生了变化 
  if(pageState.nowGraTime == value){
    return
  }else{
    pageState.nowGraTime = value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if(pageState.nowSelectCity == this.value){
    return
  }else{
    pageState.nowSelectCity = this.value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var field = document.getElementById('form-gra-time');
  field.addEventListener('click',function(e){
    if(e.target){
      graTimeChange(e.target.value);
    }
  })
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citylist = '';
  for( i in aqiSourceData){
    citylist += '<option>'+i+'</option>';
  }
  var cityselect = document.getElementById('city-select');
  cityselect.innerHTML = citylist;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  cityselect.addEventListener('change',citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var nowCityDate = aqiSourceData[pageState.nowSelectCity];
  if(pageState.nowGraTime == 'day'){
    chartData = nowCityDate;
  }
  if(pageState.nowGraTime == 'week'){
    chartData = {};
    var week = 0, sumday = 0, sumcount = 0;
    for( item in nowCityDate){
      sumday ++;
      sumcount += nowCityDate[item];
      if((new Date(item)).getDay() == 6){
        week++;
        chartData['第'+week+'周'] = Math.floor(sumcount/sumday);
      }
    }
    if (sumday!=0) {
      week ++;
      chartData['第'+week+'周'] = Math.floor(sumcount/sumday);
    }//保证最后一周若不满也能算一周!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }
  if(pageState.nowGraTime == 'month'){
    chartData = {};
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();