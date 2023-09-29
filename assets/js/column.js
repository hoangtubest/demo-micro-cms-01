var categoryId = getParameterByName("category");

function getCategoryList() {
  var allCategoryItems;
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
}

function renderCategoryItems(items) {
  const getCategoryList = document.querySelector("#js-getCategoryList");
  const getCategoryListUl = getCategoryList.querySelector(".c-linkList");
  getCategoryListUl.innerHTML = "";

  const listItemFirst = document.createElement("li");
  const categoryLinkFirst = document.createElement("a");
  categoryLinkFirst.className = `c-linkList__contents js-switchCategory`;
  categoryLinkFirst.href = `?category=all`;
  categoryLinkFirst.dataset.category = "all";
  categoryLinkFirst.textContent = "すべて";
  listItemFirst.appendChild(categoryLinkFirst);
  getCategoryListUl.appendChild(listItemFirst);

  items.forEach((categoryItem) => {
    const listItem = document.createElement("li");

    const categoryLink = document.createElement("a");
    categoryLink.className = `c-linkList__contents js-switchCategory`;
    categoryLink.href = `?category=${categoryItem.id}`;
    categoryLink.dataset.category = categoryItem.id;
    categoryLink.textContent = categoryItem.name;

    listItem.appendChild(categoryLink);
    getCategoryListUl.appendChild(listItem);
  });

  // console.log(`category.id: ${categoryId}`);
  const switchCategoryItems = document.querySelectorAll(".js-switchCategory");
  switchCategoryItems.forEach((item) => {
    const dataCategory = item.getAttribute("data-category");

    if (
      (categoryId === null || categoryId === "all") &&
      dataCategory === "all"
    ) {
      item.classList.add("active");
    } else if (dataCategory === categoryId) {
      item.classList.add("active");
    }
  });
}

getCategoryList();
getColumnList(100);
