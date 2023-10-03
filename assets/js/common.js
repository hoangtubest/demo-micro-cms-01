let currentURL = window.location.href;
// console.log(currentURL);

let allColumnItems = [];
let columnOfCategoryItems = [];
let itemsPerPage = 6;
let currentPage = 1;
let previousPage = 1;
let totalPages = 1;

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function applyScrollEffects() {
  function handleScroll() {
    const elements = document.querySelectorAll(".js-effect");

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

function onLoad(callback) {
  const loadingElement = document.querySelector("#loading");
  let imagePromises = [];

  // if (loadingElement) {
  //   const images = document.querySelectorAll("img");
  //   for (let i = 0; i < images.length; i++) {
  //     let promise = new Promise(function (resolve, reject) {
  //       const image = images[i];
  //       if (image.complete) {
  //         resolve();
  //       } else {
  //         image.addEventListener("load", resolve);
  //         image.addEventListener("error", reject);
  //       }
  //     });
  //     imagePromises.push(promise);
  //   }
  // }

  function onImageLoad(image) {
    return new Promise(function (resolve, reject) {
      if (image.complete) {
        resolve();
      } else {
        image.addEventListener("load", resolve);
        image.addEventListener("error", reject);
      }
    });
  }

  if (loadingElement) {
    const images = document.querySelectorAll("img");
    images.forEach(function (image) {
      imagePromises.push(onImageLoad(image));
    });
  }

  function onAllImagesLoaded() {
    if (loadingElement) {
      loadingElement.classList.add("loaded");
    }
    Promise.all(imagePromises).then(callback);
  }

  if (document.readyState === "complete") {
    onAllImagesLoaded();
  } else {
    window.addEventListener("load", onAllImagesLoaded);
  }
}

function hideLoadingScreen(selector) {
  const element = document.querySelector(selector);
  element.classList.add("loadHidden");
  setTimeout(function () {
    applyScrollEffects();
    document.body.classList.remove("is-fixed");
  }, 300);
}

if (document.getElementById("loading")) {
  document.body.classList.add("is-fixed");
  onLoad(function () {
    hideLoadingScreen("#loading");
  });
} else {
  setTimeout(function () {
    applyScrollEffects();
  }, 300);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatDateToCustomFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function callApi(apiUrl, limit = 100, successCallback, errorCallback) {
  const xhr = new XMLHttpRequest();
  apiUrl =
    "https://ubyvb6y6u3.microcms.io/api/v1/" + apiUrl + "?limit=" + limit;
  const apiKey = "dXpmSjPDgVsTH5iN1iKBp5J3Jp0BeHuNyWyp";

  // console.log(apiUrl);

  xhr.open("GET", apiUrl, true);
  xhr.setRequestHeader("X-MICROCMS-API-KEY", apiKey);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        successCallback(responseData.contents);
      } else {
        errorCallback(xhr.status, xhr.statusText);
      }
    }
  };

  xhr.send();
}

function handleError(status, statusText) {
  console.error("Error JSON:", status, statusText);
}

function getNewsList(limitNews) {
  const apiUrl = "news";
  let limit = limitNews;
  let newsDataAll;
  let filteredItems;
  let currentTab = "all";
  let previousTab = "all";

  const tabConditions = {
    all: () => true,
    notice: (item) => item.news_categories_01,
    activities: (item) => item.news_categories_02,
  };

  function handleSuccess(data) {
    // console.log("-----newsDataAll JSON----");
    newsDataAll = [...data];
    // console.log(newsDataAll);
    renderNewsItems(newsDataAll);
  }

  function handleError(status, statusText) {
    const getColumnList = document.querySelector("#js-getNewsList");
    getColumnList.innerHTML =
      '<p class="u-text-center">まだお知らせがありません。</p>';
    console.error("Error JSON:", status, statusText);
  }

  callApi(apiUrl, limit, handleSuccess, handleError);

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
      //   filteredItems = newsDataAll;
      // } else if (currentTab === "notice") {
      //   filteredItems = newsDataAll.filter((item) => item.news_categories_01);
      // } else if (currentTab === "activities") {
      //   filteredItems = newsDataAll.filter((item) => item.news_categories_02);
      // }

      filteredItems = newsDataAll.filter((item) =>
        tabConditions[currentTab](item)
      );

      // console.log(filteredItems);
      renderNewsItems(filteredItems);
    }
  }
}

// function renderNewsItems(items) {
//   const getNewsList = document.querySelector("#js-getNewsList");
//   getNewsList.innerHTML = "";
//   const newsList = document.createElement("ol");
//   newsList.className = "c-newsList";
//   newsList.innerHTML = "";

//   items.forEach((newsItem) => {
//     const listItem = document.createElement("li");
//     listItem.className = "c-newsList__item";

//     let contentElement;
//     if (newsItem.news_link) {
//       const link = document.createElement("a");
//       link.className = "c-newsList__contents";
//       link.href = newsItem.news_link;

//       if (newsItem.news_link_target) {
//         link.setAttribute("target", "_blank");
//       }

//       contentElement = link;
//     } else {
//       contentElement = document.createElement("div");
//       contentElement.className = "c-newsList__contents";
//     }

//     const dl = document.createElement("dl");

//     const dt = document.createElement("dt");
//     dt.className = "c-newsList__head";

//     const time = document.createElement("time");
//     time.datetime = newsItem.news_time;
//     time.textContent = formatDateToCustomFormat(newsItem.news_time);

//     const labelList = document.createElement("ul");
//     labelList.className = "c-newsList__label";

//     if (newsItem.news_categories_01) {
//       const categoryLi1 = document.createElement("li");
//       categoryLi1.textContent = "Notice";
//       labelList.appendChild(categoryLi1);
//     }

//     if (newsItem.news_categories_02) {
//       const categoryLi2 = document.createElement("li");
//       categoryLi2.textContent = "Activities";
//       labelList.appendChild(categoryLi2);
//     }

//     const dd = document.createElement("dd");
//     dd.textContent = newsItem.news_title;

//     dt.appendChild(time);
//     dt.appendChild(labelList);
//     dl.appendChild(dt);
//     dl.appendChild(dd);
//     contentElement.appendChild(dl);
//     listItem.appendChild(contentElement);
//     newsList.appendChild(listItem);
//   });

//   getNewsList.appendChild(newsList);
// }

function renderNewsItems(items) {
  const getNewsList = document.querySelector("#js-getNewsList");
  getNewsList.innerHTML = "";

  const newsListHtml = `
    <ol class="c-newsList">
      ${items
        .map((newsItem) => {
          const contentElement = newsItem.news_link
            ? `<a href="${newsItem.news_link}" class="c-newsList__contents" ${
                newsItem.news_link_target ? 'target="_blank"' : ""
              }>`
            : `<div class="c-newsList__contents">`;

          const labelListHtml = `
          <ul class="c-newsList__label">
            ${newsItem.news_categories_01 ? "<li>Notice</li>" : ""}
            ${newsItem.news_categories_02 ? "<li>Activities</li>" : ""}
          </ul>
        `;

          return `
          <li class="c-newsList__item">
            ${contentElement}
              <dl>
                <dt class="c-newsList__head">
                  <time datetime="${
                    newsItem.news_time
                  }">${formatDateToCustomFormat(newsItem.news_time)}</time>
                  ${labelListHtml}
                </dt>
                <dd>${newsItem.news_title}</dd>
              </dl>
            ${newsItem.news_link ? "</a>" : "</div>"}
          </li>
        `;
        })
        .join("")}
    </ol>
  `;

  getNewsList.innerHTML = newsListHtml;
}

function getColumnList(limitColumn) {
  const apiUrl = "blogs";
  let limit = limitColumn;
  let columnDataAll;

  function handleSuccess(data) {
    // console.log("-----columnDataAll JSON----");
    columnDataAll = [...data];
    // console.log(columnDataAll);
    if (currentURL.includes("/column/")) {
      columnOfCategoryItems = columnDataAll.filter(function (item) {
        if (categoryId === null || categoryId === "all") {
          return true;
        } else {
          return item.category.id === categoryId;
        }
      });

      if (columnOfCategoryItems) {
        totalPages = Math.ceil(columnOfCategoryItems.length / itemsPerPage);
        renderPagination();
      }
    } else {
      renderColumnItems(columnDataAll);
    }
  }

  function handleError(status, statusText) {
    const getColumnList = document.querySelector("#js-getColumnList");
    getColumnList.innerHTML =
      '<p class="u-text-center">まだお知らせがありません。</p>';
    console.error("Error JSON:", status, statusText);
  }

  callApi(apiUrl, limit, handleSuccess, handleError);
}

// function renderColumnItems(items) {
//   const getColumnList = document.querySelector("#js-getColumnList");
//   getColumnList.innerHTML = "";
//   const columnList = document.createElement("ol");
//   columnList.className = "c-columnList";
//   columnList.innerHTML = "";

//   items.forEach((columnItem) => {
//     const listItem = document.createElement("li");
//     listItem.className = "c-columnList__item";
//     listItem.dataset.category = columnItem.category.id;

//     const linkCard = document.createElement("a");
//     linkCard.className = "c-card";

//     let cardUrl = currentURL.includes("/column/")
//       ? `./post.html?id=${columnItem.id}`
//       : `./column/post.html?id=${columnItem.id}`;
//     linkCard.href = cardUrl;

//     const cardInner = document.createElement("div");
//     cardInner.className = "c-card__inner";

//     const cardTextContents = document.createElement("div");
//     cardTextContents.className = "c-card__textContents";

//     const cardTitle = document.createElement("h3");
//     cardTitle.className = "c-card__title";
//     cardTitle.textContent = columnItem.title;

//     const cardTagList = document.createElement("ul");
//     cardTagList.className = "c-card__tagList";

//     const cardTag = document.createElement("li");
//     cardTag.className = "c-card__tag";
//     cardTag.textContent = columnItem.category.name;

//     const cardFigure = document.createElement("div");
//     cardFigure.className = "c-card__image";

//     const cardImage = document.createElement("img");
//     cardImage.src = columnItem.eyecatch.url;
//     cardImage.alt = columnItem.title;
//     cardImage.width = columnItem.eyecatch.width;
//     cardImage.height = columnItem.eyecatch.height;

//     cardTextContents.appendChild(cardTitle);
//     cardTagList.appendChild(cardTag);
//     cardTextContents.appendChild(cardTagList);
//     cardInner.appendChild(cardTextContents);
//     cardFigure.appendChild(cardImage);
//     cardInner.appendChild(cardFigure);
//     linkCard.appendChild(cardInner);
//     listItem.appendChild(linkCard);
//     columnList.appendChild(listItem);
//   });

//   getColumnList.appendChild(columnList);
// }

function renderColumnItems(items) {
  const getColumnList = document.querySelector("#js-getColumnList");
  getColumnList.innerHTML = "";

  const columnListHtml = `
    <ol class="c-columnList">
      ${items
        .map(
          (columnItem) => `
        <li class="c-columnList__item" data-category="${
          columnItem.category.id
        }">
          <a href="${
            currentURL.includes("/column/")
              ? `./post.html?id=${columnItem.id}`
              : `./column/post.html?id=${columnItem.id}`
          }" class="c-card">
            <div class="c-card__inner">
              <div class="c-card__textContents">
                <h3 class="c-card__title">${columnItem.title}</h3>
                <ul class="c-card__tagList">
                  <li class="c-card__tag">${columnItem.category.name}</li>
                </ul>
              </div>
              <div class="c-card__image">
                <img src="${columnItem.eyecatch.url}" alt="${
            columnItem.title
          }" width="${columnItem.eyecatch.width}" height="${
            columnItem.eyecatch.height
          }">
              </div>
            </div>
          </a>
        </li>
      `
        )
        .join("")}
    </ol>
  `;

  getColumnList.innerHTML = columnListHtml;
}

function displayItemsOnPage(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsOnPage = columnOfCategoryItems.slice(startIndex, endIndex);
  renderColumnItems(itemsOnPage);
}

function renderPagination() {
  displayItemsOnPage(currentPage);
  const paginationColumn = document.querySelector("#pagination-column");

  if (paginationColumn) {
    paginationColumn.innerHTML = "";

    if (columnOfCategoryItems.length <= itemsPerPage) {
      paginationColumn.style.display = "none";
    } else {
      const hasPrev = currentPage > 1;
      const hasNext = currentPage < totalPages;

      // const paginationButtonsHtml = `
      //   <button class="pagination-column__item pagination-column__item--prev" style="display: ${
      //     hasPrev ? "block" : "none"
      //   }" data-page="${currentPage - 1}">Prev</button>
      //   ${Array.from(
      //     { length: totalPages },
      //     (_, i) => `
      //     <button class="pagination-column__item ${
      //       i + 1 === currentPage ? "active" : ""
      //     }" data-page="${i + 1}">${i + 1}</button>
      //   `
      //   ).join("")}
      //   <button class="pagination-column__item pagination-column__item--next" style="display: ${
      //     hasNext ? "block" : "none"
      //   }" data-page="${currentPage + 1}">Next</button>
      // `;

      // paginationColumn.innerHTML = paginationButtonsHtml;

      const prevButton = document.createElement("button");
      prevButton.classList =
        "pagination-column__item pagination-column__item--prev";
      prevButton.innerText = "Prev";
      prevButton.dataset.page = currentPage - 1;

      paginationColumn.appendChild(prevButton);

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.classList = "pagination-column__item";
        button.innerText = i;
        button.dataset.page = i;

        if (i === currentPage) {
          button.classList.add("active");
        }

        paginationColumn.appendChild(button);
      }

      const nextButton = document.createElement("button");
      nextButton.classList =
        "pagination-column__item pagination-column__item--next";
      nextButton.innerText = "Next";
      nextButton.dataset.page = currentPage + 1;

      paginationColumn.appendChild(nextButton);

      const paginationButtons = document.querySelectorAll(
        "#pagination-column button"
      );

      paginationButtons.forEach((button) => {
        button.addEventListener("click", () => {
          previousPage = currentPage;
          currentPage = parseInt(button.dataset.page);
          let currentPageName = parseInt(button.textContent);

          if (previousPage !== currentPage) {
            displayItemsOnPage(currentPage);

            paginationButtons.forEach((btn) => {
              btn.classList.remove("active");
            });

            if (!isNaN(currentPageName)) {
              button.classList.add("active");
            }

            const newHasPrev = currentPage > 1;
            const newHasNext = currentPage < totalPages;

            if (newHasPrev) {
              prevButton.style.display = "block";
              prevButton.dataset.page = currentPage - 1;
            } else {
              prevButton.style.display = "none";
            }

            if (newHasNext) {
              nextButton.style.display = "block";
              nextButton.dataset.page = currentPage + 1;
            } else {
              nextButton.style.display = "none";
            }

            paginationButtons.forEach((btn) => {
              if (btn.dataset.page === currentPage.toString()) {
                btn.classList.add("active");
              }
            });

            const columnSectionId = document.querySelector("#column");

            if (columnSectionId) {
              columnSectionId.scrollIntoView({
                behavior: "smooth",
              });
            }
          }
        });
      });

      if (hasPrev) {
        prevButton.style.display = "block";
      } else {
        prevButton.style.display = "none";
      }

      if (hasNext) {
        nextButton.style.display = "block";
      } else {
        nextButton.style.display = "none";
      }
    }
  }
}
