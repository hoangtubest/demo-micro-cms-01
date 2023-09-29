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

function renderCategoryItems(items) {
  const getCategoryList = document.querySelector("#js-getCategoryList");
  const getCategoryListUl = getCategoryList.querySelector(".c-linkList");
  getCategoryListUl.innerHTML = "";

  const listItemFirst = document.createElement("li");
  const categoryLinkFirst = document.createElement("a");
  categoryLinkFirst.className = `c-linkList__contents js-switchCategory active`;
  categoryLinkFirst.href = `?category=all`;
  categoryLinkFirst.textContent = "すべて";
  listItemFirst.appendChild(categoryLinkFirst);
  getCategoryListUl.appendChild(listItemFirst);

  items.forEach((categoryItem) => {
    const listItem = document.createElement("li");

    const categoryLink = document.createElement("a");
    categoryLink.className = `c-linkList__contents js-switchCategory`;
    categoryLink.href = `?category=${categoryItem.id}`;
    categoryLink.textContent = categoryItem.name;

    listItem.appendChild(categoryLink);
    getCategoryListUl.appendChild(listItem);
  });
}

getCategoryList();
getColumnList(100);
