const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];

async function loadUsers() {
    loadButton.disabled = true;
    statusMessage.textContent = "Loading users...";
    usersList.replaceChildren();

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error("Failed to load users. Please try again.");
        }

        users = await response.json();

        renderUsers(users);

        statusMessage.textContent = `Successfully loaded ${users.length} users.`;
    } catch (error) {
        users = [];
        usersList.replaceChildren();

        statusMessage.textContent =
            `Error: ${error.message || "Unable to load users. Please try again."}`;
    } finally {
        loadButton.disabled = false;
    }

}

function renderUsers(list) {
    usersList.replaceChildren();

    if (list.length === 0) {
        return;
    }

    list.forEach((user) => {
        const listItem = document.createElement("li");
        const name = document.createElement("h3");
        const email = document.createElement("p");
        const city = document.createElement("p");
        const company = document.createElement("p");

        name.textContent = user.name;
        email.textContent = `Email: ${user.email}`;
        city.textContent = `City: ${user.address.city}`;
        company.textContent = `Company: ${user.company.name}`;

        listItem.append(name, email, city, company);
        usersList.appendChild(listItem);
    });

}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
    const searchText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
    );

    renderUsers(filteredUsers);

    if (users.length > 0 && filteredUsers.length === 0) {
        statusMessage.textContent = "No users match your filter.";
    } else if (users.length > 0) {
        statusMessage.textContent = `Showing ${filteredUsers.length} of ${users.length} users.`;
    }

});