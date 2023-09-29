var postId = getParameterByName("id");
// console.log(postId);

var xhrPost = new XMLHttpRequest();
var apiUrlBlogs = "https://ubyvb6y6u3.microcms.io/api/v1/blogs/?limit=100";

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
      // console.log(allPostItems);
      var postItem = allPostItems.find(function (item) {
        return item.id === postId;
      });

      // console.log(postItem);

      if (postItem) {
        renderPostItems(postItem);
        renderRelatedPosts(postItem, postDataContent);
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

  const postCategoryLink = document.createElement("a");
  postCategoryLink.href = `./?category=${postItem.category.id}`;
  postCategoryLink.textContent = postItem.category.name;

  postCategoryItem.appendChild(postCategoryLink);
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
  const getPostContentEditor = document.createElement("div");
  getPostContentEditor.className = "c-postEditor";
  getPostContentEditor.innerHTML = postItem.content;
  getPostContent.appendChild(getPostContentEditor);
}

function renderRelatedPosts(currentPost, allPosts) {
  var relatedPosts = allPosts.filter(function (post) {
    return (
      post.category.id === currentPost.category.id && post.id !== currentPost.id
    );
  });

  // console.log(relatedPosts);

  var relatedPostList = document.querySelector("#js-relatedPostList");
  relatedPostList.innerHTML = "";

  if (relatedPosts.length > 0) {
    var relatedPostContainer = document.createElement("ul");
    relatedPostContainer.className = "c-linkList";

    relatedPosts.forEach(function (post) {
      var relatedPostItem = document.createElement("li");
      var relatedPostLink = document.createElement("a");
      relatedPostLink.href = "./post.html?id=" + post.id;

      var dl = document.createElement("dl");
      var dt = document.createElement("dt");
      var figure = document.createElement("figure");
      const postRelatedImage = document.createElement("img");
      postRelatedImage.src = post.eyecatch.url;
      postRelatedImage.alt = post.title;
      postRelatedImage.width = post.eyecatch.width;
      postRelatedImage.height = post.eyecatch.height;
      var dd = document.createElement("dd");
      dd.textContent = post.title;

      figure.appendChild(postRelatedImage);
      dt.appendChild(figure);
      dl.appendChild(dt);
      dl.appendChild(dd);
      relatedPostLink.appendChild(dl);
      relatedPostItem.appendChild(relatedPostLink);
      relatedPostContainer.appendChild(relatedPostItem);
    });

    relatedPostList.appendChild(relatedPostContainer);
  } else {
    relatedPostList.textContent = "関連する投稿はまだありません";
  }
}
