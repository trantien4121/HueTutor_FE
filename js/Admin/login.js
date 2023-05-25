function checkLoginStatus() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        // Người dùng chưa đăng nhập
        return false;
    }

    // Kiểm tra access token có hợp lệ hay không
    return fetch('http://localhost:8080/api/v1/auth/userinfo', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => {
            if (response.ok) {
                return true;
            } else {
                throw new Error(response.statusText);
            }
        })
        .catch(error => {
            console.error(error);
            return false;
        });
}

console.log(checkLoginStatus());

if (checkLoginStatus()) {

    const accessToken = localStorage.getItem('accessToken');


    console.log("Đã đăng nhập");

    const userInfo = fetch(`http://localhost:8080/api/v1/auth/getUserByAccessToken/${accessToken}`)
        .then(response => {
            return response.json();
        })
        .then(user => {
            var fullname = user.data.fullName;
            if(user.data.admin == true){
                const loginBlog = document.querySelector(".login-block");

            loginBlog.parentElement.innerHTML = `
            <a href="#" class="nav-link login-block d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="http://localhost:8080/api/v1/Users/image/${user.data.userId}" alt="${fullname}"
                width="18" height="18" class="mr-1 rounded-circle">
                <span style="margin-left: 5px">${fullname}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li><a href="" id="logoutBtn" class="dropdown-item">sign out</a></li>
            </ul>
            `;

            const btnLogoutEle = document.querySelector("#logoutBtn");


            btnLogoutEle.addEventListener("click", function () {
                window.location.href = '/login.html';
                localStorage.removeItem('accessToken');
            });
            }
        })
        .catch(error => {
            console.log(error);
            return "";
        });
}
else {
    console.log("chưa đăng nhập");
}





