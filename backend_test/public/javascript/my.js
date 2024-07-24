document.addEventListener("DOMContentLoaded", function () {
  const daysContainer = document.getElementById("days");
  const monthYear = document.getElementById("monthYear");
  const prevMonthButton = document.getElementById("prevMonth");
  const nextMonthButton = document.getElementById("nextMonth");

  let currentDate = new Date();

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = `${year}년 ${month + 1}월`;

    daysContainer.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      daysContainer.appendChild(emptyDiv);
    }

    for (let i = 1; i <= lastDate; i++) {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = i;
      daysContainer.appendChild(dayDiv);
    }
  }

  prevMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextMonthButton.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);
});

document.addEventListener("DOMContentLoaded", () => {
  const likeIcons = document.querySelectorAll(".like-icon");
  likeIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const likeCountSpan = icon.nextElementSibling;
      let likeCount = parseInt(likeCountSpan.textContent);
      likeCount += 1;
      likeCountSpan.textContent = likeCount;
    });
  });
});

function checkPeople() {
  const nameInput = document.getElementById("name").value;
  const messageDiv = document.getElementById("message");

  if (nameInput === "백현" || nameInput === "엑소 백현") {
    window.location.href =
      "http://127.0.0.1:5500/%EC%98%A4%EB%8A%98%EC%9D%98%20%EC%B5%9C%EC%95%A0/main_%EB%B0%B1%ED%98%84/main_%EB%B0%B1%ED%98%84.html";
  } else {
    messageDiv.innerHTML = "<p>검색어를 다시 입력해주세요.</p>";
  }
}
