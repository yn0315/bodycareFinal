//검색시 이름 or 날짜 결정
function changeSelection() {
  const $select = document.getElementById("selectBox");
  const $optionVal = select.options.value;
  console.log($optionVal);
}



// 메뉴 펼치기
function open_menu_event() {
    const $menu_open = document.getElementById('menu_open');
    const $close = document.getElementById('menu');
    const $menu_icon = document.querySelectorAll('#menu_icon');
    const $arrow = document.getElementById('open');

    const $place = document.getElementById('place');
    const $chartSection = document.getElementsByClassName('chart_section');
    


    $close.className = 'menu_open';
   
    $close.style.width = '10vw';
    $arrow.className = 'invisible';

    for (let i = 0; i < $menu_icon.length; i++) {

        $menu_icon.item(i).className = '';
    }

}

//메뉴 닫기
function close_menu_event() {
    const $menu_open = document.getElementById('menu_open');
    const $close = document.getElementById('menu');
    const $menu_icon = document.querySelectorAll('#menu_icon');
    const $arrow = document.getElementById('open');
    const $place = document.getElementById('place');
    const $chartSection = document.getElementsByClassName('chart_section');


    $close.className = 'menu_close';
    $close.style.width = '7vw';
    
    $arrow.className = '';

    for (let i = 0; i < $menu_icon.length; i++) {

        $menu_icon.item(i).className = 'invisible';
    }

}

//내 정보 펼치기
function open_myInfo_menu() {
    const $myInfo = document.getElementById('myInfo');
    const $myInfo_open = document.getElementById('myInfo_open');
    const $myInfo_close = document.getElementById('myInfo_close');
    
    $myInfo.className = "myInfo_Open";
    $myInfo.style.height = "300px";
    $myInfo_open.className = "invisible";
    $myInfo_close.className = "";
    
}

//내 정보 닫기
function close_myInfo_menu() {
  const $myInfo = document.getElementById('myInfo');
  const $myInfo_open = document.getElementById('myInfo_open');
  const $myInfo_close = document.getElementById('myInfo_close');
  
  $myInfo.className = "myInfo_Close";
  $myInfo.style.height = "70px";
  $myInfo_open.className = "";
  $myInfo_close.className = "invisible";
  
}

//촬영버튼 눌렀을 때 입력창 사라지고 sql에 정보 넣기
function readyGo() {
  const $shootBox = document.getElementById('shootBox');
  $shootBox.className = "invisible";
  //sql문 작성

}

function inputNameEvent() {
  const $inputName = document.getElementById('inputName');
  $inputName.style.backgroundColor = white;
  
}

//촬영시 색상조절 바
dragElement(document.getElementById("circle"));

function dragElement(elmnt) {
  let clientX_gab = 0, clientX = 0;
  elmnt.onmousedown = dragMouseDown;
  elmnt.addEventListener('touchstart',dragMouseDown)
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    if (e.changedTouches) {
      e.clientX = e.changedTouches[0].clientX
    }
    clientX = e.clientX;
    document.onmouseup = closeDragElement;
    document.addEventListener('touchend',closeDragElement);
    document.onmousemove = elementDrag;
    document.addEventListener('touchmove',elementDrag);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault(); 
    if (e.changedTouches) {
      e.clientX = e.changedTouches[0].clientX
    }
    clientX_gab = e.clientX - clientX;
    clientX = e.clientX;
    let leftVal = 0;
    let parentElmnt = elmnt.parentNode;
    if (
      (elmnt.offsetLeft + clientX_gab) < 0 ||
      clientX < parentElmnt.offsetLeft) 
      {
      leftVal = 0;
    } else if(
      (elmnt.offsetLeft + clientX_gab) > parentElmnt.clientWidth ||
      clientX > (parentElmnt.offsetLeft+parentElmnt.clientWidth))
      {
      leftVal = parentElmnt.clientWidth;
    } else {
      leftVal = (elmnt.offsetLeft + clientX_gab);
    }
    elmnt.querySelector('span').innerText = Math.round((leftVal /parentElmnt.clientWidth)*100);
    
    elmnt.style.left = leftVal + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.removeEventListener('touchend', closeDragElement);
    document.onmousemove = null;
    document.removeEventListener('touchmove', elementDrag);
  }
}


//뒤로가기
function settingDefault() {
  
}

//막대차트
function drawBarChart() {
    var data = google.visualization.arrayToDataTable([
        ["Element", "Density", { role: "style" } ],
        ["Copper", 8.94, "color: rgb(134,101,183)"],
        ["Silver", 10.49, "#660066"],
        ["Gold", 19.30, "color: rgb(164,152,211)"],
        ["Platinum", 21.45, "color: rgb(134,101,183)"],
        ["Silver", 10.49, "color: rgb(164,152,211)"],
        ["Gold", 19.30, "color: rgb(134,101,183)"],
        ["Platinum", 21.45, "color: #663366"]
      ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "Density of Precious Metals, in g/cm^3",
      width: 600,
      height: 400,
      bar: {groupWidth: "95%"},
      legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);
}


//선차트
function drawLineChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Expenses', { role: "style" }],
      ['2003', 100, "color: rgb(134,101,183)"],
      ['2004', 400, "color: rgb(134,101,183)"],
      ['2005', 800, "color: rgb(134,101,183)"],
      ['2006', 800, "color: rgb(134,101,183)"],
      ['2007', 400, "color: rgb(134,101,183)"],
      ['2008', 100, "color: rgb(134,101,183)"],
    ]);

    var options = {
      title: 'Company Performance',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
  }
  
  //영역차트
  function drawplaceChart() {
    var data = google.visualization.arrayToDataTable([
      ['Year', 'Expenses', { role: "style" }],
      ['2013', 400,"color: rgb(134,101,183)"],
      ['2014', 460,"color: rgb(134,101,183)"],
      ['2015', 1120,"color: rgb(134,101,183)"],
      ['2016', 540,"color: rgb(134,101,183)"]
    ]);

    var options = {
      title: 'Company Performance',
      hAxis: {title: 'Year',  titleTextStyle: {color: 'rgb(0,0,0)'}},
      vAxis: {minValue: 0},
      
  
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }
