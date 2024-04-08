const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const repoList = document.getElementById('repoList');

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = searchInput.value.trim();

  if (username) {
    try {
      const userResponse = await fetch(`https://api.github.com/search/users?q=${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const userData = await userResponse.json();
      displayUsers(userData.items);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
});

async function displayUsers(users) {
  searchResults.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px;">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
      <button class="reposBtn" data-username="${user.login}">Show Repos</button>
    `;
    searchResults.appendChild(userElement);
  });

  const reposBtns = document.querySelectorAll('.reposBtn');
  reposBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const username = btn.dataset.username;
      try {
        const repoResponse = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const reposData = await repoResponse.json();
        displayRepos(reposData);
      } catch (error) {
        console.error('Error fetching repos data:', error);
      }
    });
  });
}

function displayRepos(repos) {
  repoList.innerHTML = '';
  const repoListElement = document.createElement('ul');
  repos.forEach(repo => {
    const repoItem = document.createElement('li');
    repoItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>${repo.description}</p>
    `;
    repoListElement.appendChild(repoItem);
  });
  repoList.appendChild(repoListElement);
}
