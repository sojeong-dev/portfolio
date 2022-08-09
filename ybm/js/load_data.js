// load data JS
$(function() {
  'use strict';
  var completeData = []; // json 데이터 담는 변수
  // console.log(completeData);
  loadDataFn();
  
  // Ajax를 이용하여 json데이터 파싱, 사용 함수
  function loadDataFn() {
    $.ajax({
      url: 'js/data.json', // 서버측 경로
      dataType: 'json', // json 명시
      success: function(result) {
        console.log('data load complete');
        // console.log(result); // json파일이 담김 // {curation: Array(16)}
        completeData = result.curation; //배열 담음
        // console.log(completeData);
  
        init(); // 데이터 셋팅(초기화)
        settingUI(); // UI 셋팅
      }
    });
  }
  
  // UI 셋팅 함수
  function settingUI() {
    setOffset();
    // position offset 리사이즈 이벤트
    $(window).on('resize', function() {
      setOffset();
    });
  
    function setOffset() {
      var $area = $('#curation > .inner'),
          $cardList = $area.find('ul'),
          $card = $cardList.children(), // li
          boxWidth = $cardList.outerWidth(),
          boxHeight = 0,
          cardWidth = $card.outerWidth(),
          cardHeight = $card.outerHeight(true),
          rowNum = 0, // 행
          colNum = 0, // 열
          arrOffsetTop = [],  // 행 좌표
          arrOffsetLeft = [], // 열 좌표
          spaceLeft = 0;  // 사이 간격
      // console.log($area, $cardList, $card),
    
      // 열 개수: 박스(ul) 너비 / 카드(li) 너비
      colNum = Math.floor(boxWidth / cardWidth); // Math.floor(): 소수점 이하 버림
    
      // 행 개수: 카드(li) 개수 / 열 개수 
      rowNum = Math.ceil($card.length / colNum); // Math.ceil(): 소수점 이하 올림
      // console.log('박스 너비:' + boxWidth, '카드 너비:' + cardWidth, '카드 개수:' + $card.length, '행 개수:' + rowNum, '열 개수:' + colNum);
    
      // 카드(li) 행 개수를 이용하여 박스(ul) 높이 설정
      boxHeight = cardHeight * rowNum; // 박스(ul) 높이: 카드(li) 높이 X 행 개수
      // console.log('카드 높이:' + cardHeight, '박스 높이:' + boxHeight); 
    
      // 카드(li)의 행과 열을 좌표처럼 이용하여 카드(li) offset(top, left) 지정
      for(var i = 0; i < rowNum; i++) { // 행
        for(var j = 0; j < colNum; j++) { // 열
          arrOffsetTop.push(i); // 행 좌표 추가
          arrOffsetLeft.push(j); // 열 좌표 추가
        }
      }
      // console.log(arrOffsetTop + '\n' + arrOffsetLeft); 
    
      // style 적용
      $cardList.css({'height': boxHeight + 'px'});
    
      $(window).outerWidth() > mobile ? spaceLeft = 32 : spaceLeft = 10; // 삼항 연산자
      $card.each(function(i) {
        $(this).css({
          'top': (cardHeight * arrOffsetTop[i]) + 'px',
          'left': ((cardWidth + spaceLeft) * arrOffsetLeft[i]) + 'px'
        });
      });
    }
  }
  
  // 데이터 셋팅(초기화) 함수
  function init() {
    // console.log(completeData.length);  // 16
    // $.each(arr, function(index, item) {}): 객체와 배열 모두에서 사용할 수 있는 일반적인 반복함수 > 배열과 유사 배열 객체들을 index를 기준으로 반복
  
    // 최신 등록순: 가장 마지막에 들어온 데이터가 가장 첫번째 위치하게 // 날짜별 내림차순 정렬
    // sortSelectDESC(completeData);
    completeData.sort(function(a, b) {
      a = a.date.replace(/\-/g,''),
      b = b.date.replace(/\-/g,'');

      // if(a < b) return 1;
      // if(a > b) return -1;
      // return 0; // a === b
      return b - a;

    });
    // console.log(completeData);
  
    $.each(completeData, function() {
      // 파싱 작업: 필요한 데이터 뽑아냄
      var innerHTML = '\n';
          innerHTML += '<li>\n';
          innerHTML += '  <a href="#">\n';
          innerHTML += '    <p class="img_box">\n';
          innerHTML += '      <img src="' + this.img + '" alt="" />\n';
          innerHTML += '      <strong class="detail pc">\n';
          innerHTML += '        <span class="txt_center">' + this.detail + '</span>\n';
          innerHTML += '      </strong>\n';
          innerHTML += '    </p>\n';
          innerHTML += '    <p class="txt_box">\n';
          innerHTML += '      <span class="tit">' + this.tit + '</span>\n';
          innerHTML += '      <span class="category">' + this.category + '</span>\n';
          innerHTML += '    </p>\n';
          innerHTML += '  </a>\n';
          innerHTML += '</li>\n';
  
      // html 추가
      $('#curation > .inner > ul').append(innerHTML); 
    });
  
    // 데이터 선택 정렬(내림차순) 함수
    function sortSelectDESC(data) {
      // console.log(data)
      var maxIndex, temp;
  
      // i) 선택 정렬(내림차순)
      // for(var i = 0; i < data.length - 1; i++) {
      //   // 최대값을 갖고 있는 index 찾기(날짜 기준)
      //   for(var j = i + 1; j < data.length; j++) {
      //     // 비교 기준 값 < 비교 대상 값 
      //     if(data[i].date.replace(/\-/g,'') < data[j].date.replace(/\-/g,'')) { // >=: 같은 값이면 먼저들어온 데이터가 뒤로 가게(큰 수로 인식) // sting.replace(/\-/g,'');: replace()함수와 정규식으로 '-' 제거
      //       // 교환
      //       temp = data[i];
      //       data[i] = data[j];
      //       data[j] = temp;
      //     }// j
      //   }
      //   // console.log(data[i].date, data[i].tit);
      // }// i

      // ii) 선택 정렬(내림차순): 최대값을 선택하여 첫번째 자리부터 비교하여 자리교체
      // for(var i = 0; i < data.length; i++) {
      //   maxIndex = i;

      //   // 최대값을 갖고 있는 index 찾기(날짜 기준)
      //   for(var j = i; j < data.length - 1; j++) {
      //     // 최대값 < 비교값 
      //     if(data[maxIndex].date.replace(/\-/g,'') < data[j].date.replace(/\-/g,''))
      //       maxIndex = j;
      //   }// j
      //   temp = data[maxIndex];
      //   data[maxIndex] = data[i];
      //   data[i] = temp;
      //   console.log(data[i].date, data[i].tit);
      // }// i
    }
  }
});