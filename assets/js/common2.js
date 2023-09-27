function getColumnList(limit) {
  var allPostItems;
  var filteredPostItems;
  var xhrPost = new XMLHttpRequest();
  var currentURL = window.location.href;

  // console.log(currentURL);

  // var limit = currentURL.includes("/news/") ? 100 : 5;

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
      linkCard.href = `./post.html?id=${postItem.id}`;

      const cardInner = document.createElement("div");
      cardInner.className = "c-card__inner";
      linkCard.href = postItem.id;

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
