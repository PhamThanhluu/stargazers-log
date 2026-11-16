const repositoryList = document.querySelector("#repository-list");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();

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
    metadata.innerHTML = `
      <span>${repository.language}</span>
      <span aria-label="${repository.stargazers_count} stars">
        ★ ${repository.stargazers_count.toLocaleString()} stars
      </span>
    `;

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
    repositoryList.innerHTML = `<li class="repository status">Unable to load starred repositories.</li>`;
    console.error(error);
  }
}

loadRepositories();
