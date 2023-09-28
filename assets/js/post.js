function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var postId = getParameterByName("id");

console.log(postId);

var xhrPost = new XMLHttpRequest();
var apiUrlBlogs = "https://ubyvb6y6u3.microcms.io/api/v1/blogs";

xhrPost.open("GET", apiUrlBlogs, true);
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
      var allPostItems = [...postDataContent];
      console.log(allPostItems);
      var postItem = allPostItems.find(function (item) {
        return item.id === postId;
      });

      console.log(postItem);

      if (postItem) {
        renderPostItems(postItem);
      }
    } else {
      console.error("Error JSON:", xhrPost.status, xhrPost.statusText);
    }
  }
};

xhrPost.send();

function renderPostItems(postItem) {
  const getPostCategory = document.querySelector("#js-postCategory");
  getPostCategory.innerHTML = "";
  const postCategoryList = document.createElement("ul");
  postCategoryList.className = "p-columnPostCategories";
  const postCategoryItem = document.createElement("li");
  postCategoryItem.textContent = postItem.category.name;

  postCategoryList.appendChild(postCategoryItem);
  getPostCategory.appendChild(postCategoryList);

  const getPostTitle = document.querySelector("#js-postTitle");
  getPostTitle.innerHTML = "";
  getPostTitle.textContent = postItem.title;

  const getPublishedDate = document.querySelector("#js-publishedDate");
  getPublishedDate.innerHTML = "";
  getPublishedDate.textContent = formatDateToCustomFormat(postItem.publishedAt);

  const getUpdatedDate = document.querySelector("#js-updatedDate");
  getUpdatedDate.innerHTML = "";
  getUpdatedDate.textContent = formatDateToCustomFormat(postItem.updatedAt);

  const getPostThumbnail = document.querySelector("#js-postThumbnail");
  getPostThumbnail.innerHTML = "";
  const postThumbnailImage = document.createElement("img");
  postThumbnailImage.src = postItem.eyecatch.url;
  postThumbnailImage.alt = postItem.title;
  postThumbnailImage.width = postItem.eyecatch.width;
  postThumbnailImage.height = postItem.eyecatch.height;

  getPostThumbnail.appendChild(postThumbnailImage);

  const getPostContent = document.querySelector("#js-post");
  const getPostContentEditor = getPostContent.querySelector(".c-postEditor");
  getPostContentEditor.innerHTML = "";
  getPostContentEditor.innerHTML = postItem.content;
}
