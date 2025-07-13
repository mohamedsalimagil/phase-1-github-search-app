document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const input = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  // Handle search form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = input.value.trim();
    if (query !== "") {
      searchGithubUsers(query);
    }
  });

  // Fetch matching users from GitHub
  function searchGithubUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    })
      .then(res => res.json())
      .then(data => {
        displayUsers(data.items);
      })
      .catch(err => console.error("Error fetching users:", err));
  }

  // Display user results
  function displayUsers(users) {
    userList.innerHTML = "";
    reposList.innerHTML = ""; // clear any previous repo results

    users.forEach(user => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="${user.avatar_url}" width="60" style="vertical-align: middle;"/>
        <strong>${user.login}</strong>
        <a href="${user.html_url}" target="_blank">View Profile</a>
      `;

      // Click to fetch that user's repos
      li.addEventListener("click", () => {
        fetchUserRepos(user.login);
      });

      userList.appendChild(li);
    });
  }

  // Fetch repos for a user
  function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      }
    })
      .then(res => res.json())
      .then(repos => {
        displayRepos(repos, username);
      })
      .catch(err => console.error("Error fetching repos:", err));
  }

  // Display repos under the repos list
  function displayRepos(repos, username) {
    reposList.innerHTML = `<h3>Public Repos for ${username}:</h3>`;

    if (repos.length === 0) {
      reposList.innerHTML += "<li>No public repos found.</li>";
      return;
    }

    repos.forEach(repo => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      reposList.appendChild(li);
    });
  }
});
