var currentURL = window.location.href;
let buttonSwitchCategories;
// console.log(currentURL);

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
  var currentTab = "all";
  var previousTab = "all";
  var xhrNews = new XMLHttpRequest();

  const tabConditions = {
    all: () => true,
    notice: (item) => item.news_categories_01,
    activities: (item) => item.news_categories_02,
  };

  // var limit = currentURL.includes("/news/") ? 100 : 5;

  var apiUrlNews = "https://ubyvb6y6u3.microcms.io/api/v1/news";
  apiUrlNews = apiUrlNews + "?limit=" + limit;

  xhrNews.open("GET", apiUrlNews, true);
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
    previousTab = currentTab;
    currentTab = event.target.dataset.tab;

    if (previousTab !== currentTab) {
      tabButtons.forEach((tab) => {
        tab.classList.remove("active");
      });
      event.target.classList.add("active");

      // if (currentTab === "all") {
      //   filteredItems = allItems;
      // } else if (currentTab === "notice") {
      //   filteredItems = allItems.filter((item) => item.news_categories_01);
      // } else if (currentTab === "activities") {
      //   filteredItems = allItems.filter((item) => item.news_categories_02);
      // }

      filteredItems = allItems.filter((item) =>
        tabConditions[currentTab](item)
      );

      // console.log(filteredItems);
      renderNewsItems(filteredItems);
    }
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

function getColumnList(limit) {
  var allColumnItems;
  var filteredColumnItems;
  var xhrColumn = new XMLHttpRequest();

  // var limit = currentURL.includes("/column/") ? 100 : 6;

  var apiUrlBlogs = "https://ubyvb6y6u3.microcms.io/api/v1/blogs";
  apiUrlBlogs = apiUrlBlogs + "?limit=" + limit;

  xhrColumn.open("GET", apiUrlBlogs, true);
  xhrColumn.setRequestHeader(
    "X-MICROCMS-API-KEY",
    "dXpmSjPDgVsTH5iN1iKBp5J3Jp0BeHuNyWyp"
  );

  xhrColumn.onreadystatechange = function () {
    if (xhrColumn.readyState === 4) {
      if (xhrColumn.status === 200) {
        postData = JSON.parse(xhrColumn.responseText);
        // console.log("-----postData JSON----");
        columnDataContent = postData.contents;
        allColumnItems = [...columnDataContent];
        // console.log(allColumnItems);
        renderColumnItems(allColumnItems);
      } else {
        const getColumnList = document.querySelector("#js-getColumnList");
        getColumnList.innerHTML =
          '<p class="u-text-center">まだお知らせがありません。</p>';
        console.error("Error JSON:", xhrColumn.status, xhrColumn.statusText);
      }
    }
  };

  xhrColumn.send();
}

function getCategoryList() {
  var allCategoryItems;
  var filteredCategoryItems;
  var currentCategory = "all";
  var previousCategory = "all";
  var xhrCategory = new XMLHttpRequest();

  // var limit = currentURL.includes("/column/") ? 100 : 6;

  var apiUrl = "https://ubyvb6y6u3.microcms.io/api/v1/categories";

  xhrCategory.open("GET", apiUrl, true);
  xhrCategory.setRequestHeader(
    "X-MICROCMS-API-KEY",
    "dXpmSjPDgVsTH5iN1iKBp5J3Jp0BeHuNyWyp"
  );

  xhrCategory.onreadystatechange = function () {
    if (xhrCategory.readyState === 4) {
      if (xhrCategory.status === 200) {
        categoryData = JSON.parse(xhrCategory.responseText);
        // console.log("-----categoryData JSON----");
        categoryDataContent = categoryData.contents;
        allCategoryItems = [...categoryDataContent];
        // console.log(allCategoryItems);
        renderCategoryItems(allCategoryItems);
        buttonSwitchCategories =
          document.querySelectorAll(".js-switchCategory");

        buttonSwitchCategories.forEach((btn) => {
          btn.addEventListener("click", handleCategoryClick);
        });
      } else {
        console.error(
          "Error JSON:",
          xhrCategory.status,
          xhrCategory.statusText
        );
      }
    }
  };

  xhrCategory.send();

  function handleCategoryClick(event) {
    previousCategory = currentCategory;
    currentCategory = event.target.dataset.category;
    if (previousCategory !== currentCategory) {
      buttonSwitchCategories.forEach((btn) => {
        btn.classList.remove("active");
      });
      event.target.classList.add("active");
      const allPosts = document.querySelectorAll(".c-columnList__item");
      allPosts.forEach(function (post) {
        const postCategory = post.dataset.category;

        if (currentCategory === "all" || postCategory === currentCategory) {
          post.style.display = "block";
        } else {
          post.style.display = "none";
        }
      });
    }
  }
}

function renderColumnItems(items) {
  const getColumnList = document.querySelector("#js-getColumnList");
  getColumnList.innerHTML = "";
  const columnList = document.createElement("ol");
  columnList.className = "c-columnList";
  columnList.innerHTML = "";

  items.forEach((columnItem) => {
    const listItem = document.createElement("li");
    listItem.className = "c-columnList__item";
    listItem.dataset.category = columnItem.category.id;

    const linkCard = document.createElement("a");
    linkCard.className = "c-card";

    let cardUrl = currentURL.includes("/column/")
      ? `./post.html?id=${columnItem.id}`
      : `./column/post.html?id=${columnItem.id}`;
    linkCard.href = cardUrl;

    const cardInner = document.createElement("div");
    cardInner.className = "c-card__inner";

    const cardTextContents = document.createElement("div");
    cardTextContents.className = "c-card__textContents";

    const cardTitle = document.createElement("h3");
    cardTitle.className = "c-card__title";
    cardTitle.textContent = columnItem.title;

    const cardTagList = document.createElement("ul");
    cardTagList.className = "c-card__tagList";

    const cardTag = document.createElement("li");
    cardTag.className = "c-card__tag";
    cardTag.textContent = columnItem.category.name;

    const cardFigure = document.createElement("div");
    cardFigure.className = "c-card__image";

    const cardImage = document.createElement("img");
    cardImage.src = columnItem.eyecatch.url;
    cardImage.alt = columnItem.title;
    cardImage.width = columnItem.eyecatch.width;
    cardImage.height = columnItem.eyecatch.height;

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

function renderCategoryItems(items) {
  const getCategoryList = document.querySelector("#js-getCategoryList");
  const getCategoryListUl = getCategoryList.querySelector(".c-linkList");

  items.forEach((categoryItem) => {
    const listItem = document.createElement("li");

    const categoryButton = document.createElement("button");
    categoryButton.className = `c-linkList__contents js-switchCategory`;
    categoryButton.dataset.category = categoryItem.id;
    categoryButton.textContent = categoryItem.name;

    listItem.appendChild(categoryButton);
    getCategoryListUl.appendChild(listItem);
  });
}

// Fix cache
function addTimestampToURL(url) {
  return url + "?v=" + new Date().getTime();
}

// const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
// cssLinks.forEach(function (link) {
//   link.href = addTimestampToURL(link.href);
// });

// const jsScripts = document.querySelectorAll("script[src]");
// jsScripts.forEach(function (script) {
//   script.src = addTimestampToURL(script.src);
// });
