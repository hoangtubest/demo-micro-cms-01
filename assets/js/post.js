let postId = getParameterByName("id");
// console.log(postId);

function getPost(limitPost) {
  const apiUrl = "blogs";
  let limit = limitPost;
  let allPostItems;

  function handleSuccess(data) {
    // console.log("-----allPostItems JSON----");
    allPostItems = [...data];
    // console.log(allPostItems);
    let postItem = allPostItems.find(function (item) {
      return item.id === postId;
    });

    // console.log(postItem);

    if (postItem) {
      renderPostItems(postItem);
      renderRelatedPosts(postItem, allPostItems);
    }
  }

  callApi(apiUrl, limit, handleSuccess, handleError);
}

// function renderPostItems(postItem) {
//   const getPostCategory = document.querySelector("#js-postCategory");
//   getPostCategory.innerHTML = "";
//   const postCategoryList = document.createElement("ul");
//   postCategoryList.className = "p-columnPostCategories";
//   const postCategoryItem = document.createElement("li");

//   const postCategoryLink = document.createElement("a");
//   postCategoryLink.href = `./?category=${postItem.category.id}`;
//   postCategoryLink.textContent = postItem.category.name;

//   postCategoryItem.appendChild(postCategoryLink);
//   postCategoryList.appendChild(postCategoryItem);
//   getPostCategory.appendChild(postCategoryList);

//   const getPostTitle = document.querySelector("#js-postTitle");
//   getPostTitle.innerHTML = "";
//   getPostTitle.textContent = postItem.title;

//   const getPublishedDate = document.querySelector("#js-publishedDate");
//   getPublishedDate.innerHTML = "";
//   getPublishedDate.textContent = formatDateToCustomFormat(postItem.publishedAt);

//   const getUpdatedDate = document.querySelector("#js-updatedDate");
//   getUpdatedDate.innerHTML = "";
//   getUpdatedDate.textContent = formatDateToCustomFormat(postItem.updatedAt);

//   const getPostThumbnail = document.querySelector("#js-postThumbnail");
//   getPostThumbnail.innerHTML = "";
//   const postThumbnailImage = document.createElement("img");
//   postThumbnailImage.src = postItem.eyecatch.url;
//   postThumbnailImage.alt = postItem.title;
//   postThumbnailImage.width = postItem.eyecatch.width;
//   postThumbnailImage.height = postItem.eyecatch.height;

//   getPostThumbnail.appendChild(postThumbnailImage);

//   const getPostContent = document.querySelector("#js-post");
//   const getPostContentEditor = document.createElement("div");
//   getPostContentEditor.className = "c-postEditor";
//   getPostContentEditor.innerHTML = postItem.content;
//   getPostContent.appendChild(getPostContentEditor);
// }

function renderPostItems(postItem) {
  const postCategory = document.querySelector("#js-postCategory");
  const postTitle = document.querySelector("#js-postTitle");
  const publishedDate = document.querySelector("#js-publishedDate");
  const updatedDate = document.querySelector("#js-updatedDate");
  const postThumbnail = document.querySelector("#js-postThumbnail");
  const postContent = document.querySelector("#js-post");

  const postCategoryHtml = `<ul class="p-columnPostCategories"><li><a href="./?category=${postItem.category.id}">${postItem.category.name}</a></li></ul>`;
  const postThumbnailHtml = `<img src="${postItem.eyecatch.url}" alt="${postItem.title}" width="${postItem.eyecatch.width}" height="${postItem.eyecatch.height}">`;
  const postContentHtml = `<div class="c-postEditor">${postItem.content}</div>`;

  postCategory.innerHTML = postCategoryHtml;
  postTitle.textContent = postItem.title;
  publishedDate.textContent = formatDateToCustomFormat(postItem.publishedAt);
  updatedDate.textContent = formatDateToCustomFormat(postItem.updatedAt);
  postThumbnail.innerHTML = postThumbnailHtml;
  postContent.innerHTML = postContentHtml;
}

// function renderRelatedPosts(currentPost, allPosts) {
//   let relatedPosts = allPosts.filter(function (post) {
//     return (
//       post.category.id === currentPost.category.id && post.id !== currentPost.id
//     );
//   });

//   // console.log(relatedPosts);

//   const relatedPostList = document.querySelector("#js-relatedPostList");
//   relatedPostList.innerHTML = "";

//   if (relatedPosts.length > 0) {
//     const relatedPostContainer = document.createElement("ul");
//     relatedPostContainer.className = "c-linkList";

//     relatedPosts.forEach(function (post) {
//       const relatedPostItem = document.createElement("li");
//       const relatedPostLink = document.createElement("a");
//       relatedPostLink.href = "./post.html?id=" + post.id;

//       const dl = document.createElement("dl");
//       const dt = document.createElement("dt");
//       const figure = document.createElement("figure");
//       const postRelatedImage = document.createElement("img");
//       postRelatedImage.src = post.eyecatch.url;
//       postRelatedImage.alt = post.title;
//       postRelatedImage.width = post.eyecatch.width;
//       postRelatedImage.height = post.eyecatch.height;
//       const dd = document.createElement("dd");
//       dd.textContent = post.title;

//       figure.appendChild(postRelatedImage);
//       dt.appendChild(figure);
//       dl.appendChild(dt);
//       dl.appendChild(dd);
//       relatedPostLink.appendChild(dl);
//       relatedPostItem.appendChild(relatedPostLink);
//       relatedPostContainer.appendChild(relatedPostItem);
//     });

//     relatedPostList.appendChild(relatedPostContainer);
//   } else {
//     relatedPostList.textContent = "関連する投稿はまだありません";
//   }
// }

function renderRelatedPosts(currentPost, allPosts) {
  const relatedPosts = allPosts.filter(
    (post) =>
      post.category.id === currentPost.category.id && post.id !== currentPost.id
  );

  // console.log(relatedPosts);

  const relatedPostList = document.querySelector("#js-relatedPostList");
  relatedPostList.innerHTML = "";

  if (relatedPosts.length > 0) {
    const relatedPostContainer = document.createElement("ul");
    relatedPostContainer.className = "c-linkList";

    relatedPosts.forEach((post) => {
      const relatedPostItemHtml = `
        <li>
          <a href="./post.html?id=${post.id}">
            <dl>
              <dt>
                <figure>
                  <img src="${post.eyecatch.url}" alt="${post.title}" width="${post.eyecatch.width}" height="${post.eyecatch.height}">
                </figure>
              </dt>
              <dd>${post.title}</dd>
            </dl>
          </a>
        </li>
      `;

      relatedPostContainer.innerHTML += relatedPostItemHtml;
    });

    relatedPostList.appendChild(relatedPostContainer);
  } else {
    relatedPostList.textContent = "関連する投稿はまだありません";
  }
}

getPost();
