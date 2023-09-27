// const { createClient } = microcms;

// const clientNews = createClient({
//   serviceDomain: "ubyvb6y6u3",
//   apiKey: "dXpmSjPDgVsTH5iN1iKBp5J3Jp0BeHuNyWyp",
// });

// function handleAPI() {
//   clientNews
//     .get({
//       endpoint: "news",
//     })
//     .then((res) => {
//       newsData = res;
//       console.log(newsData);
//       renderDataNews();
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// window.addEventListener("load", handleAPI);

var currentPath = window.location.pathname.substring(1);
// console.log(currentPath);

var isNotesPage = /\/notes\//.test(currentPath);

if (!isNotesPage) {
  var xhrNews = new XMLHttpRequest();
  var currentURL = window.location.href;

  var limit = currentURL.includes("/news/") ? 100 : 3;

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
        console.log(newsData);
        renderDataNews();
      } else {
        console.error("Error JSON:", xhrNews.status, xhrNews.statusText);
      }
    }
  };

  xhrNews.send();
}

function formatDateToCustomFormat(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function renderDataNews() {
  const getNewsList = document.querySelector("#js-getNewsList");
  const newsList = document.createElement("ol");
  newsList.className = "c-newsList";

  newsData.contents.forEach((newsItem) => {
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
      categoryLi1.textContent = "お知らせ";
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

  // function renderData() {
  //   if (dataDepartment && dataPosition) {
  //     const departmentList = document.getElementById(
  //       "p-careerPosition-anchor__list"
  //     );
  //     const departmentContent = document.getElementById(
  //       "p-careerPosition__list"
  //     );

  //     if (departmentList && departmentContent) {
  //       dataDepartment.contents.forEach(function (department) {
  //         const departmentListItem = document.createElement("li");
  //         departmentListItem.className = "p-careerPosition-anchor__item";
  //         const departmentLink = document.createElement("a");
  //         departmentLink.className = "p-careerPosition-anchor__link";
  //         departmentLink.href = "#" + department.department_id;
  //         const departmentLinkText = document.createElement("span");
  //         departmentLinkText.textContent = department.name;
  //         departmentLink.appendChild(departmentLinkText);
  //         departmentListItem.appendChild(departmentLink);
  //         departmentList.appendChild(departmentListItem);

  //         const departmentItem = document.createElement("div");
  //         departmentItem.className = "p-careerPosition__item";
  //         const departmentItemInner = document.createElement("div");
  //         departmentItemInner.className = "p-careerPosition-department";
  //         departmentItemInner.id = department.department_id;

  //         const departmentName = document.createElement("h3");
  //         departmentName.className = "p-careerPosition-department__txt";
  //         departmentName.textContent = department.name;
  //         departmentItemInner.appendChild(departmentName);

  //         const departmentBackground = document.createElement("div");
  //         departmentBackground.className = "p-careerPosition-department__bg";
  //         const departmentPcImage = document.createElement("img");
  //         departmentPcImage.className = "u-pc";
  //         departmentPcImage.src = department.image_pc.url;
  //         departmentPcImage.alt = department.name;

  //         const departmentSpImage = document.createElement("img");
  //         departmentSpImage.className = "u-sp";
  //         departmentSpImage.src = department.image_sp.url;
  //         departmentSpImage.alt = department.name;

  //         departmentBackground.appendChild(departmentPcImage);
  //         departmentBackground.appendChild(departmentSpImage);
  //         departmentItemInner.appendChild(departmentBackground);
  //         departmentItem.appendChild(departmentItemInner);

  //         const positionListWrap = document.createElement("div");
  //         positionListWrap.className = "p-careerPosition-position";
  //         const positionList = document.createElement("ul");
  //         positionList.className = "p-careerPosition-position__list";

  //         dataPosition.contents.forEach(function (position) {
  //           if (
  //             position.department.department_id === department.department_id
  //           ) {
  //             const positionItem = document.createElement("li");
  //             positionItem.className = "p-careerPosition-position__item";

  //             const positionLink = document.createElement("a");
  //             positionLink.className = "p-careerPosition-position__link";
  //             positionLink.href = position.link;
  //             positionLink.target = "_blank";

  //             const positionText = document.createElement("div");
  //             positionText.className = "p-careerPosition-position__txt";

  //             const positionTextName = document.createElement("h4");
  //             positionTextName.className = "p-careerPosition-position__name";
  //             positionTextName.textContent = position.name;
  //             const positionTextDescription = document.createElement("p");
  //             positionTextDescription.className =
  //               "p-careerPosition-position__description";
  //             positionTextDescription.textContent = position.description;

  //             positionText.appendChild(positionTextName);
  //             positionText.appendChild(positionTextDescription);

  //             positionLink.appendChild(positionText);
  //             const positionEntry = document.createElement("div");
  //             positionEntry.className = "p-careerPosition-position__entry";
  //             const positionEntryText = document.createElement("span");
  //             positionEntryText.className =
  //               "p-careerPosition-position__entry__txt";
  //             const positionEntryImage = document.createElement("img");
  //             positionEntryImage.src =
  //               "/assets/images/career/position/entry.svg";
  //             positionEntryImage.alt = "ENTRY";
  //             positionEntryText.appendChild(positionEntryImage);
  //             positionEntry.appendChild(positionEntryText);
  //             positionLink.appendChild(positionEntry);
  //             positionItem.appendChild(positionLink);
  //             positionList.appendChild(positionItem);
  //           }
  //         });

  //         positionListWrap.appendChild(positionList);
  //         departmentItem.appendChild(positionListWrap);
  //         departmentContent.appendChild(departmentItem);
  //       });
  //     }
  //   }
  // }
}
