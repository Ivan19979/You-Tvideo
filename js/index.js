const API_KEY = "AIzaSyBlN4IsKBg3V-cP6HBLeTfLYmj58JQNUHA";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

const videoListItems = document.querySelector(".video-list__items");
const arr = window.location.search;

const fetchTrendingVideos = async () => {
  try {
    const url = new URL(VIDEOS_URL);

    url.searchParams.append("part", "contentDetails,id,snippet");
    url.searchParams.append("chart", "mostPopular");
    url.searchParams.append("regionCode", "RU");
    url.searchParams.append("maxResults", 12);
    url.searchParams.append("key", API_KEY);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.log(err.message);
  }
};

const timeDuration = (duration) => {
  const time = duration
    .split(/\D/)
    .filter((item) => item)
    .reverse();
  return `${time[2] ? `${time[2]}ч` : ""}
  ${time[1] ? `${time[1]}мин` : ""}
  ${time[0] ? `${time[0]}сек` : ""}`;
};

const displayVideo = (videos) => {
  videoListItems.textContent = "";
  const listVideos = videos.items.map((video) => {
    const duration = timeDuration(video.contentDetails.duration);

    const li = document.createElement("li");
    li.classList.add("ideo-list__item");
    li.innerHTML = `
      <li class="video-list__item">
                  <article class="video-card">
                    <a href="/video.html?id=${
                      video.id
                    }" class="video-card__link">
                      <img
                        src="${
                          video.snippet.thumbnails.standard.url ||
                          video.snippet.thumbnails.high.url
                        }"
                        alt=${video.snippet.title}
                        class="video-card__thumbnail"
                      />
                      <h3 class="video-card__title">${video.snippet.title}</h3>
                      <p class="video-card__chanel">${
                        video.snippet.channelTitle
                      }</p>
                      <p class="video-card__duration">${duration}</p>
                    </a>
                    <button
                      class="video-card__favorite"
                      type="button"
                      aria-label=${video.snippet.title}
                    >
                      <svg class="video-card__icon">
                        <use
                          class="star-o"
                          xlink:href="/image/sprite.svg#star-ob"
                        ></use>
                        <use class="star" xlink:href="/image/sprite.svg#star"></use>
                      </svg>
                    </button>
                  </article>
                </li>
    `;
    return li;
  });
  videoListItems.append(...listVideos);
};

fetchTrendingVideos().then(displayVideo);
