function formatDateToCustomFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function Effect() {
  function handleScroll() {
    var elements = document.querySelectorAll(".js-effect");

    elements.forEach(function (element) {
      if (isElementInViewport(element)) {
        element.classList.add("is-show");
      } else {
        element.classList.remove("is-show");
      }
    });
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll);
}

function onReady(callback) {
  var loading = document.querySelector("#loading");
  var promises = [];

  function onResourceLoad() {
    loading.classList.add("loaded");
    Promise.all(promises).then(callback);
  }

  if (loading) {
    var images = document.querySelectorAll("img");
    for (var i = 0; i < images.length; i++) {
      var promise = new Promise(function (resolve, reject) {
        var image = images[i];
        if (image.complete) {
          resolve();
        } else {
          image.addEventListener("load", resolve);
          image.addEventListener("error", reject);
        }
      });
      promises.push(promise);
    }
  }

  if (document.readyState === "complete") {
    onResourceLoad();
  } else {
    window.addEventListener("load", onResourceLoad);
  }
}

function setVisible(selector) {
  var element = document.querySelector(selector);
  element.classList.add("loadHidden");
  setTimeout(function () {
    Effect();
    document.body.classList.remove("is-fixed");
  }, 300);
}

if (document.getElementById("loading")) {
  document.body.classList.add("is-fixed");
  onReady(function () {
    setVisible("#loading");
  });
} else {
  setTimeout(function () {
    Effect();
  }, 300);
}

function getNewsList(limit) {
  var allItems;
  var filteredItems;
  var currentTab = "All";
  var previousTab = "All";
  var xhrNews = new XMLHttpRequest();
  var currentURL = window.location.href;

  // console.log(currentURL);

  // var limit = currentURL.includes("/news/") ? 100 : 5;

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
        // console.log(allItems);
        renderNewsItems(allItems);
      } else {
        const getNewsList = document.querySelector("#js-getNewsList");
        getNewsList.innerHTML =
          '<p class="u-text-center">まだお知らせがありません。</p>';
        console.error("Error JSON:", xhrNews.status, xhrNews.statusText);
      }
    }
  };

  xhrNews.send();

  const tabButtons = document.querySelectorAll(".c-tab__item");
  tabButtons.forEach((tab) => {
    tab.addEventListener("click", handleTabClick);
  });

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
      renderNewsItems(filteredItems);
    } else {
      event.target.classList.add("active");
    }
  }

  function renderNewsItems(items) {
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
}

function getColumnList(limit) {
  var allPostItems;
  var filteredPostItems;
  var xhrPost = new XMLHttpRequest();
  var currentURL = window.location.href;

  // console.log(currentURL);

  // var limit = currentURL.includes("/column/") ? 100 : 6;

  var apiUrl = "https://ubyvb6y6u3.microcms.io/api/v1/blogs";
  apiUrl = apiUrl + "?limit=" + limit;

  xhrPost.open("GET", apiUrl, true);
  xhrPost.setRequestHeader(
    "X-MICROCMS-API-KEY",
    "dXpmSjPDgVsTH5iN1iKBp5J3Jp0BeHuNyWyp"
  );

  xhrPost.onreadystatechange = function () {
    if (xhrPost.readyState === 4) {
      if (xhrPost.status === 200) {
        postData = JSON.parse(xhrPost.responseText);
        // console.log("-----postData JSON----");
        postDataContent = postData.contents;
        allPostItems = [...postDataContent];
        console.log(allPostItems);
        renderPostItems(allPostItems);
      } else {
        const getColumnList = document.querySelector("#js-getColumnList");
        getColumnList.innerHTML =
          '<p class="u-text-center">まだお知らせがありません。</p>';
        console.error("Error JSON:", xhrPost.status, xhrPost.statusText);
      }
    }
  };

  xhrPost.send();

  // const tabButtons = document.querySelectorAll(".c-tab__item");
  // tabButtons.forEach((tab) => {
  //   tab.addEventListener("click", handleTabClick);
  // });

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
        filteredPostItems = allPostItems;
      } else if (currentTab === "Notice") {
        filteredPostItems = allPostItems.filter(
          (item) => item.news_categories_01
        );
      } else if (currentTab === "Activities") {
        filteredPostItems = allPostItems.filter(
          (item) => item.news_categories_02
        );
      }

      // console.log(filteredPostItems);
      renderItems(filteredPostItems);
    } else {
      event.target.classList.add("active");
    }
  }

  function renderPostItems(items) {
    const getColumnList = document.querySelector("#js-getColumnList");
    getColumnList.innerHTML = "";
    const columnList = document.createElement("ol");
    columnList.className = "c-columnList";
    columnList.innerHTML = "";

    items.forEach((postItem) => {
      const listItem = document.createElement("li");
      listItem.className = "c-columnList__item";

      const linkCard = document.createElement("a");
      linkCard.className = "c-card";

      let cardUrl = currentURL.includes("/column/")
        ? `./post.html?id=${postItem.id}`
        : `./column/post.html?id=${postItem.id}`;
      linkCard.href = cardUrl;

      const cardInner = document.createElement("div");
      cardInner.className = "c-card__inner";

      const cardTextContents = document.createElement("div");
      cardTextContents.className = "c-card__textContents";

      const cardTitle = document.createElement("h3");
      cardTitle.className = "c-card__title";
      cardTitle.textContent = postItem.title;

      const cardTagList = document.createElement("ul");
      cardTagList.className = "c-card__tagList";

      const cardTag = document.createElement("li");
      cardTag.className = "c-card__tag";
      cardTag.textContent = postItem.category.name;

      const cardFigure = document.createElement("div");
      cardFigure.className = "c-card__image";

      const cardImage = document.createElement("img");
      cardImage.src = postItem.eyecatch.url;
      cardImage.alt = postItem.title;
      cardImage.width = postItem.eyecatch.width;
      cardImage.height = postItem.eyecatch.height;

      cardTextContents.appendChild(cardTitle);
      cardTagList.appendChild(cardTag);
      cardTextContents.appendChild(cardTagList);
      cardInner.appendChild(cardTextContents);
      cardFigure.appendChild(cardImage);
      cardInner.appendChild(cardFigure);
      linkCard.appendChild(cardInner);
      listItem.appendChild(linkCard);
      columnList.appendChild(listItem);
    });

    getColumnList.appendChild(columnList);
  }
}
