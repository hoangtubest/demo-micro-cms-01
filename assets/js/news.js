var allItems;
var filteredItems;
// var allItemsBeforeFilter;
var currentTab = "All";
var previousTab = "All";
var xhrNews = new XMLHttpRequest();
var currentURL = window.location.href;

console.log(currentURL);

var limit = currentURL.includes("/news/") ? 100 : 5;

// console.log(limit);

var apiUrl = "https://ubyvb6y6u3.microcms.io/api/v1/news";
apiUrl = apiUrl + "?limit=" + limit;

xhrNews.open("GET", apiUrl, true);
xhrNews.setRequestHeader(
  "X-MICROCMS-API-KEY",
  "dXpmSjPDgVsTH5iN1iKBp5J3Jp0BeHuNyWyp"
);

xhrNews.onreadystatechange = function () {
  if (xhrNews.readyState === 4) {
    if (xhrNews.status === 200) {
      newsData = JSON.parse(xhrNews.responseText);
      // console.log("-----newsData JSON----");
      newsDataContent = newsData.contents;
      allItems = [...newsDataContent];
      console.log(allItems);
      renderItems(allItems);
    } else {
      console.error("Error JSON:", xhrNews.status, xhrNews.statusText);
    }
  }
};

xhrNews.send();

const tabButtons = document.querySelectorAll(".c-tab__item");
tabButtons.forEach((tab) => {
  tab.addEventListener("click", handleTabClick);
});

// document.addEventListener("DOMContentLoaded", function () {});

function handleTabClick(event) {
  tabButtons.forEach((tab) => {
    tab.classList.remove("active");
  });
  event.target.classList.add("active");

  previousTab = currentTab;
  currentTab = event.target.textContent;

  if (previousTab !== currentTab) {
    event.target.classList.add("active");

    if (currentTab === "All") {
      filteredItems = allItems;
    } else if (currentTab === "Notice") {
      filteredItems = allItems.filter((item) => item.news_categories_01);
    } else if (currentTab === "Activities") {
      filteredItems = allItems.filter((item) => item.news_categories_02);
    }

    // console.log(filteredItems);
    renderItems(filteredItems);
  } else {
    event.target.classList.add("active");
  }
}

function renderItems(items) {
  const getNewsList = document.querySelector("#js-getNewsList");
  getNewsList.innerHTML = "";
  const newsList = document.createElement("ol");
  newsList.className = "c-newsList";
  newsList.innerHTML = "";

  items.forEach((newsItem) => {
    const listItem = document.createElement("li");
    listItem.className = "c-newsList__item";

    let contentElement;
    if (newsItem.news_link) {
      const link = document.createElement("a");
      link.className = "c-newsList__contents";
      link.href = newsItem.news_link;

      if (newsItem.news_link_target) {
        link.setAttribute("target", "_blank");
      }

      contentElement = link;
    } else {
      contentElement = document.createElement("div");
      contentElement.className = "c-newsList__contents";
    }

    const dl = document.createElement("dl");

    const dt = document.createElement("dt");
    dt.className = "c-newsList__head";

    const time = document.createElement("time");
    time.datetime = newsItem.news_time;
    time.textContent = formatDateToCustomFormat(newsItem.news_time);

    const labelList = document.createElement("ul");
    labelList.className = "c-newsList__label";

    if (newsItem.news_categories_01) {
      const categoryLi1 = document.createElement("li");
      categoryLi1.textContent = "Notice";
      labelList.appendChild(categoryLi1);
    }

    if (newsItem.news_categories_02) {
      const categoryLi2 = document.createElement("li");
      categoryLi2.textContent = "Activities";
      labelList.appendChild(categoryLi2);
    }

    const dd = document.createElement("dd");
    dd.textContent = newsItem.news_title;

    dt.appendChild(time);
    dt.appendChild(labelList);
    dl.appendChild(dt);
    dl.appendChild(dd);
    contentElement.appendChild(dl);
    listItem.appendChild(contentElement);
    newsList.appendChild(listItem);
  });

  getNewsList.appendChild(newsList);
}

function formatDateToCustomFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
}
