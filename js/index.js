const API_KEY = "AIzaSyBlN4IsKBg3V-cP6HBLeTfLYmj58JQNUHA";
const VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

const router = new Navigo("/", { hash: true });

const main = document.querySelector("main");

const favoriteIds = JSON.parse(localStorage.getItem("favoriteYT")) || [];

// const videoListItems = document.querySelector(".video-list__items");

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

const fetchSearchVideos = async (searchQuery, page) => {
  try {
    const url = new URL(SEARCH_URL);
    url.searchParams.append("part", "snippet");
    url.searchParams.append(
      "q",
      searchQuery
        .split(" ")
        .filter((el) => el.length > 3)
        .join(" | ")
    );
    url.searchParams.append("maxResults", 12);
    // url.searchParams.append("regionCode", "RU");
    url.searchParams.append("type", "video");
    url.searchParams.append("key", API_KEY);

    if (page) {
      url.searchParams.append("pageToken", page);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.log(err.message);
  }
};

const fetchFavoriteVideos = async () => {
  try {
    if (favoriteIds.length === 0) {
      return { items: [] };
    }
    const url = new URL(VIDEOS_URL);

    url.searchParams.append("part", "contentDetails,id,snippet");
    url.searchParams.append("maxResults", 12);
    url.searchParams.append("id", favoriteIds.join(","));
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

const fetchVideoData = async (id) => {
  try {
    if (favoriteIds.length === 0) {
      return { items: [] };
    }
    const url = new URL(VIDEOS_URL);

    url.searchParams.append("part", "contentDetails,id,snippet, statistics");
    url.searchParams.append("maxResults", 12);
    url.searchParams.append("id", id);
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
  const hoursArr = duration.match(/(\d+)H/);
  const minutesArr = duration.match(/(\d+)M/);
  const secondsArr = duration.match(/(\d+)S/);

  const hours = hoursArr ? parseInt(hoursArr[1]) : 0;
  const minutes = minutesArr ? parseInt(minutesArr[1]) : 0;
  const seconds = secondsArr ? parseInt(secondsArr[1]) : 0;

  let result = "";

  if (hours > 0) {
    result += `${hours}ч `;
  }
  if (minutes > 0) {
    result += `${minutes}мин `;
  }
  if (hours > 0) {
    result += `${seconds}с`;
  }
  return result.trim();
};

const formatDate = (isoString) => {
  const date = isoString
    .slice(2)
    .replace("H", " час ")
    .replace("M", " мин ")
    .replace("S", " сек");
  return date.trim();
};

const createListVideo = (videos, titleText, pagination) => {
  // const urlSearchParams = new URLSearchParams(location.search);
  // const videoId = urlSearchParams.get("id");

  // videoListItems.textContent = "";
  const videoListSection = document.createElement("section");
  videoListSection.classList.add("video_list");

  const title = document.createElement("h2");
  title.classList.add("video-list__title");
  title.textContent = titleText;

  const container = document.createElement("div");
  container.classList.add("container");

  const videoListItems = document.createElement("ul");
  videoListItems.classList.add("video-list__items");

  const listVideos = videos.items
    // .filter((el) => el.id !== videoId)
    .map((video) => {
      // const duration = formatDate(video.contentDetails.duration);

      const li = document.createElement("li");
      li.classList.add("ideo-list__item");
      li.innerHTML = `
      <li class="video-list__item">
                  <article class="video-card">
                    <a href="#/video/${
                      video.id.videoId || video.id
                    }" class="video-card__link">
                      <img
                        src="${
                          video.snippet.thumbnails.standard?.url ||
                          video.snippet.thumbnails.high?.url
                        }"
                        alt=${video.snippet.title}
                        class="video-card__thumbnail"
                      />
                      <h3 class="video-card__title">${video.snippet.title}</h3>
                      <p class="video-card__chanel">${
                        video.snippet.channelTitle
                      }</p>
                      ${
                        video.contentDetails
                          ? `<p class="video-card__duration">${formatDate(
                              video.contentDetails.duration
                            )}</p>`
                          : ""
                      }
                    </a>
                    <button
                      class="video-card__favorite favorite ${
                        favoriteIds.includes(video.id) ? "active" : ""
                      }"
                      type="button"
                      aria-label=${video.snippet.title}
                      data-video-id='${video.id}'
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

  videoListSection.append(container);
  container.append(title, videoListItems);
  videoListItems.append(...listVideos);

  if (pagination) {
    const paginationElem = document.createElement("div");
    paginationElem.classList.add("pagination");

    if (pagination.prev) {
      const arrowPrev = document.createElement("a");
      arrowPrev.classList.add("pagination__arrow");
      arrowNext.textContent = "Предыдущая";
      arrowPrev.href = `#/search?q=${pagination.searchQuery}&page=${pagination.prev}`;
      paginationElem.append(arrowPrev);
    }

    if (pagination.next) {
      const arrowNext = document.createElement("a");
      arrowNext.classList.add("pagination__arrow");
      arrowNext.textContent = "Следующая";
      arrowNext.href = `#/search?q=${pagination.searchQuery}&page=${pagination.next}`;
      paginationElem.append(arrowNext);
    }

    videoListSection.append(paginationElem);
  }

  return videoListSection;
};

const createVideo = (video) => {
  const videoSection = document.createElement("section");
  videoSection.classList.add("video");

  videoSection.innerHTML = `
  <div class="container">
          <div class="video__player">
            <iframe
              class="video__iframe"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/${video.id}"
              title="${video.snippet.title}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <div class="video__content">
            <div class="video-container">
              <h2 class="video__title">${video.snippet.title}</h2>
              <button class="video__favorite favorite ${
                favoriteIds.includes(video.id) ? "active" : ""
              }" 
              data-video-id='${video.id}'
              >
                <span class="video__no-active">Избранное</span>
                <span class="video__active">В избранном</span>
                <svg class="header__icon">
                  <use
                    class="star-o"
                    xlink:href="/image/sprite.svg#star-ob"
                  ></use>
                  <use class="star" xlink:href="/image/sprite.svg#star"></use>
                </svg>
              </button>
            </div>
          </div>
          <p class="video__channel">${video.snippet.channelTitle}</p>
          <p class="video__info">
            <span class="video__view">${parseInt(
              video.statistics.viewCount
            ).toLocaleString()} просмотров</span>
            <div class="video__date">Дата премьеры: ${formatDate(
              video.snippet.publishedAt
            )}</div>
          </p>
          <hr>
          <p class="video__description">
            ${video.snippet.description}
          </p>
        </div>
  `;

  return videoSection;
};

const createHero = () => {
  const heroSection = document.createElement("section");
  heroSection.className = "hero";
  heroSection.innerHTML = `
        <div class="container">
          <div class="hero__container">
            <a href="#/favorite" class="hero__link">
              <span>Избранное</span>
              <svg class="hero__icon">
                <use xlink:href="/image/sprite.svg#star-ow"></use>
              </svg>
            </a>
            <svg
              class="hero__logo"
              viewBox="0 0 360 48"
              role="img"
              aria-label="Logo service You-Tvideo"
            >
              <use xlink:href="/image/sprite.svg#logo-white" />
            </svg>

            <h1 class="hero__title">Смотри. Загружай. Создавай</h1>
            <p class="hero__tagline">Удобный видеохостинг для тебя</p>
          </div>
        </div>
  `;
  return heroSection;
};

const createSearch = () => {
  const searchSection = document.createElement("section");
  searchSection.className = "search";

  const container = document.createElement("div");
  container.className = "container";

  const title = document.createElement("h2");
  title.className = "visually-hidden";
  title.textContent = "Search";

  const form = document.createElement("form");
  form.className = "search__form";

  searchSection.append(container);
  container.append(title, form);

  form.innerHTML = `
  <input
              type="search"
              class="search__input"
              placeholder="Найти видео..."
              name='search'
              required
            />
            <button class="search__btn" type="submit">
              <span>поиск</span>
              <svg class="search__icon">
                <use xlink:href="/image/sprite.svg#search"></use>
              </svg>
            </button>
  `;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form.search.value.trim())
      router.navigate(`/search?q=${form.search.value}`);
  });

  return searchSection;
};

const createHeader = () => {
  const header = document.body.querySelector("header") || "";
  if (header) {
    return header;
  }
  const headerElem = document.createElement("header");
  headerElem.classList.add("header");
  headerElem.innerHTML = `
  <div class="container header__container">
  <a class="header__link" href="#">
    <svg
      class="header__logo"
      viewBox="0 0 240 32"
      role="img"
      aria-label="Logo service You-Tvideo"
    >
      <use xlink:href="/image/sprite.svg#logo-orange" />
    </svg>
  </a>

  <a href="#/favorite" class="header__link header__link_favorite">
    <span>Избранное</span>
    <svg class="header__icon">
      <use xlink:href="/image/sprite.svg#star-ob"></use>
    </svg>
  </a>
</div>
  `;

  return headerElem;
};

const indexRoute = async () => {
  const header = document.querySelector("header");
  if (header) {
    header.remove();
  }
  main.innerHTML = "<img alt='Loader' src='../image/loader.gif'/>";
  const hero = createHero();
  const search = createSearch();
  const videos = await fetchTrendingVideos();
  const listVideo = createListVideo(videos, "В тренде");
  main.innerHTML = "";
  main.append(hero, search, listVideo);
};

const videoRoute = async (context) => {
  const id = context.data.id;
  main.innerHTML = "<img alt='Loader' src='../image/loader.gif'/>";

  document.body.prepend(createHeader());
  const search = createSearch();
  const data = await fetchVideoData(id);
  const video = data.items[0];
  const videoSection = createVideo(video);

  const searchQuery = video.snippet.title;
  const videos = await fetchSearchVideos(searchQuery, 2);
  const listVideo = createListVideo(videos, "Похожие видео");
  main.innerHTML = "";
  main.append(search, videoSection, listVideo);
};

const favoriteRoute = async () => {
  document.body.prepend(createHeader());
  main.textContent = "";
  main.innerHTML = "<img alt='Loader' src='../image/loader.gif'/>";
  const search = createSearch();
  const videos = await fetchFavoriteVideos();
  const listVideo = createListVideo(videos, "Избранное");
  main.innerHTML = "";
  main.append(search, listVideo);
};

const searchRoute = async (context) => {
  const searchQuery = context.params.q;
  const page = context.params.page;
  if (searchQuery) {
    document.body.prepend(createHeader());
    main.textContent = "";
    const search = createSearch();
    const videos = await fetchSearchVideos(searchQuery, page);
    const listVideo = createListVideo(videos, "Найденные видео");
    main.innerHTML = "";
    main.append(search, listVideo);
  }
};

const init = () => {
  router
    .on({
      "/": indexRoute,
      "/video/:id": videoRoute,
      "/favorite": favoriteRoute,
      "/search": searchRoute,
    })
    .resolve();

  // const currentPage = location.pathname.split("/").pop();

  // const urlSearchParams = new URLSearchParams(location.search);
  // const videoId = urlSearchParams.get("id");
  // const searchQuery = urlSearchParams.get("q");

  // if (currentPage === "index.html" || currentPage === "") {
  //   fetchTrendingVideos().then(displayListVideo);
  // } else if (currentPage === "video.html" && videoId) {
  //   fetchVideoData(videoId).then(displayVideo);
  //   fetchTrendingVideos().then(displayListVideo);
  // } else if (currentPage === "favorite.html") {
  //   fetchFavoriteVideos().then(displayListVideo);
  // } else if (currentPage === "search.html" && searchQuery) {
  // }

  document.body.addEventListener("click", ({ target }) => {
    const itemFavorite = target.closest(".favorite");
    if (itemFavorite) {
      const videoId = itemFavorite.dataset.videoId;
      if (favoriteIds.includes(videoId)) {
        favoriteIds.splice(favoriteIds.indexOf(videoId), 1);
        localStorage.setItem("favoriteYT", JSON.stringify(favoriteIds));
        itemFavorite.classList.remove("active");
      } else {
        favoriteIds.push(videoId);
        localStorage.setItem("favoriteYT", JSON.stringify(favoriteIds));
        itemFavorite.classList.add("active");
      }
    }
  });
};

init();
