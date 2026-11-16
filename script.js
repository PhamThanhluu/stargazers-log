const repositoryList = document.querySelector("#repository-list");

function createStatusMessage(message, role) {
  const item = document.createElement("li");
  item.className = "repository status";
  item.textContent = message;
  item.setAttribute("role", role);
  return item;
}

function isRepository(repository) {
  return repository
    && typeof repository.repository_name === "string"
    && typeof repository.description === "string"
    && typeof repository.html_url === "string"
    && typeof repository.language === "string"
    && Number.isFinite(repository.stargazers_count)
    && repository.stargazers_count >= 0;
}

function renderRepositories(repositories) {
  if (!Array.isArray(repositories) || !repositories.every(isRepository)) {
    throw new Error("events.json contains invalid repository data");
  }

  repositoryList.replaceChildren();

  if (repositories.length === 0) {
    repositoryList.append(createStatusMessage("Chưa có kho lưu trữ nào được đánh dấu sao.", "status"));
    return;
  }

  repositories.forEach((repository) => {
    const item = document.createElement("li");
    item.className = "repository";

    const title = document.createElement("h2");
    const link = document.createElement("a");
    link.href = repository.html_url;
    link.textContent = repository.repository_name;
    title.append(link);

    const description = document.createElement("p");
    description.textContent = repository.description;

    const metadata = document.createElement("div");
    metadata.className = "repository-meta";
    const language = document.createElement("span");
    language.textContent = repository.language;
    const stars = document.createElement("span");
    stars.textContent = `★ ${repository.stargazers_count.toLocaleString()} stars`;
    stars.setAttribute("aria-label", `${repository.stargazers_count.toLocaleString()} stars`);
    metadata.append(language, stars);

    item.append(title, description, metadata);
    repositoryList.append(item);
  });
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load events.json (${response.status})`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    repositoryList.replaceChildren(
      createStatusMessage("Không thể tải danh sách kho lưu trữ đã đánh dấu sao.", "alert"),
    );
    console.error(error);
  }
}

loadRepositories();
