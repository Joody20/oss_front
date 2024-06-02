// const host = "http://127.0.0.1:8002"; // 내 백엔드 서버 연 포트 번호 : 8002
const host = "http://44.223.119.42:8000"; // docker 백엔드 서버 포트 번호 : 8080



// 맨 위로 이동 버튼
let moveToTop = function () {
  document.body.scrollIntoView({ behavior: "smooth" });
};

// 타이핑 효과
const $txt = document.querySelector(".txt-title");
const content = "안녕하세요 :)\n광운대학교 정보융합학부\n주다영 입니다 !";
let contentIndex = 0;

let typing = function () {
  $txt.innerHTML += content[contentIndex];
  contentIndex++;
  if (content[contentIndex] === "\n") {
    $txt.innerHTML += "<br />";
    contentIndex++;
  }
  if (contentIndex > content.length) {
    $txt.textContent = "";
    contentIndex = 0;
  }
};

setInterval(typing, 250);


//타이핑 효과 멈추기
// const $txt = document.querySelector(".txt-title");
// const content = "안녕하세요 :)\n개발꿈나무 주다영입니다.\n잘 부탁드립니다.";
// let contentIndex = 0;
// let typingInterval;

// let typing = function () {
//   $txt.innerHTML += content[contentIndex];
//   contentIndex++;
//   if (content[contentIndex] === "\n") { 
//     $txt.innerHTML += "<br />";
//     contentIndex++;
//   }
//   if (contentIndex >= content.length) {
//     clearInterval(typingInterval); // typing이 끝나면 setInterval 멈추기
//   }
// };

// typingInterval = setInterval(typing, 200);


// 내 이미지 슬라이드
let imgIndex = 0;
let position = 0;
const IMG_WIDTH = 438;
const $btnPrev = document.querySelector(".btn-prev");
const $btnNext = document.querySelector(".btn-next");
const $slideImgs = document.querySelector(".slide-images");

let prev = function () {
  if (imgIndex > 0) {
    $btnNext.removeAttribute("disabled");
    position += IMG_WIDTH;
    $slideImgs.style.transform = `translateX(${position}px)`;
    imgIndex = imgIndex - 1;
  }
  if (imgIndex == 0) {
    $btnPrev.setAttribute("disabled", "true");
  }
};

let next = function () {
  if (imgIndex < 4) {
    $btnPrev.removeAttribute("disabled");
    position -= IMG_WIDTH;
    $slideImgs.style.transform = `translateX(${position}px)`;
    $slideImgs.style.transition = "transform .5s ease-out";
    imgIndex = imgIndex + 1;
  }
  if (imgIndex == 4) {
    $btnNext.setAttribute("disabled", "true");
  }
};

let init = function () {
  $btnPrev.setAttribute("disabled", "true");
  $btnPrev.addEventListener("click", prev);
  $btnNext.addEventListener("click", next);
};

init();





// 방명록

const guestbookEntries = document.getElementById('guestbookEntries');

function getUsers(){
  axios.get(`${host}/user`)
  .then(response => {
    console.log(response.data);
    if (response.data && response.data.Users) {
      renderUsers(response.data.Users);
    } else {
      console.error('Invalid response structure', response.data);
    }
  })
  .catch(error =>{
    console.error('Error fetching Contents: ', error);
  });
}

function renderUsers(users){
  guestbookEntries.innerHTML='';  // guestbookEntries 초기화
  users.forEach(user => {
      const entry = document.createElement('div');
      entry.classList.add('guestbook-entry');

      // console.log(user.created_at);
      // // const options = { timeZone: 'Asia/Seoul' };
      // const timestamp = new Date(user.created_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
      // console.log(timestamp);

       // Log the raw `created_at` value
      // console.log("Raw created_at:", user.created_at);

      const seoulDate = moment.utc(user.created_at).tz('Asia/Seoul').format('YYYY. M. D. A h:mm:ss');
      // Log the formatted timestamp
      // console.log("Formatted Timestamp:", seoulDate);


      entry.innerHTML = `
          <strong class="name" style="margin-bottom: 5px; font-weight: bold; font-size:12px; line-height: 2px;"> ${user.name}</strong>
          <span class="created-at" style="display: block; float:right; font-size:11px;"> (${seoulDate})</span><br>
          <span class="message" style=" display: inline-block; margin-top:7px; font-size: 13px;"> ${user.content} </span>
          <button class="delete-button">삭제</button>
      `;
      guestbookEntries.appendChild(entry);

      // 삭제 버튼 생성 및 이벤트 처리
      const deleteButton = entry.querySelector('.delete-button');
      deleteButton.addEventListener('click', function() {
          deleteUser(user.id);
      });

      // entry에 삭제 버튼 추가
      entry.appendChild(deleteButton);
    });
}

window.addEventListener('DOMContentLoaded', function () {
  getUsers();
});

const guestbookForm = document.getElementById('guestbookForm');

guestbookForm.addEventListener('keypress', function(event){
  if(event.key === 'Enter'){
    addUser();
    
  }
});

function addUser(){
  const name = document.getElementById('nameInput').value.trim();
  const message = document.getElementById('messageInput').value;
  const timestamp = new Date().toISOString(); // Get current time in ISO format
  let UserData = {
    id: 0,
    name: name,
    content: message,
    created_at : timestamp
  };
  if(name === '' || message === '') {
    console.error('Name or message is empty');
    return;
  }

  axios.post(`${host}/user`, UserData)
      .then(response => {
        guestbookForm.reset();  // 폼 초기화
        getUsers();
      })
      .catch(error => {
        console.error('Error adding content: ', error);
      });
}

function deleteUser(id){
  axios.delete(`${host}/user/${id}`)
      .then(response => {
        getUsers();
      })
      .catch(
        error => {
          console.error('Error deleting User: ', error);
        });
}



// 모달
const $modalBg = document.getElementsByClassName("modal-background");
const $btnOpen = document.getElementsByClassName("btn-open");
const $btnClose = document.getElementsByClassName("btn-close");

function closeModal(num) {
  $modalBg[num].style.display = "none";
  document.body.style.overflow = "unset";
}


function modal(num) {
  $btnOpen[num].addEventListener("click", () => {
    $modalBg[num].style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  //close 버튼 누르면 모달 닫기
  $btnClose[num].addEventListener("click", () => {
    closeModal(num);
  });

  // ESC 키를 누르면 모달 닫기
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(num);
    }
  });
}

for (let i = 0; i < $btnOpen.length; i++) {
  modal(i);
}

// 스크롤바
let scrollTop = 0;
let bar = document.getElementsByClassName("bar-ing")[0];

window.addEventListener(
  "scroll",
  () => {
    scrollTop = document.documentElement.scrollTop;
    let per = Math.ceil(
      (scrollTop / (document.body.scrollHeight - window.outerHeight)) * 100
    );
    bar.style.width = per + "%";
  },
  false
);
