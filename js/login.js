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


if (checkLoginStatus()) {

  const accessToken = localStorage.getItem('accessToken');
  
  const loginBlogPC = document.querySelector(".login-block");
  const registerBlogPC = document.querySelector(".register-block");
  // Nếu để ử đây thì sẽ hiển thị được trên giao diện pc, không dc trên mobile và ngược lại

  console.log("Đã đăng nhập");

  const userInfo = fetch(`http://localhost:8080/api/v1/auth/getUserByAccessToken/${accessToken}`)
    .then(response => {
      return response.json();
    })
    .then(user => {
      var fullname = user.data.fullName;

      const loginBlog = document.querySelector(".login-block");
      const registerBlog = document.querySelector(".register-block");

          registerBlog.style.display = "none";
          //loginBlog.innerHTML = `<i class="mr-1 bi bi-person"></i>${fullname}</a></li>`;
          loginBlog.parentElement.innerHTML = `<li class="has-children" style="list-style: none">
        <a href="#profile-section" class="nav-link" style="padding: 20px"> <img src="http://localhost:8080/api/v1/Users/image/${user.data.userId}" alt="${fullname}"
        width="24" height="24" class="mr-1 rounded-circle"> ${fullname}</a>
        <ul class="dropdown arrow-top">
          <li><a href="userProfile.html" class="nav-link"><i class="mr-2 bi bi-info-circle"></i>Quản lý thông tin</a></li>
          <li><a href="class.html" class="nav-link"><i class="mr-2 bi bi-clipboard-check"></i>Lớp học</a></li>
          <li><a href="changePassword.html" class="nav-link"><i class=" mr-2 bi bi-key"></i>Đổi mật khẩu</a></li>
          <li><a href="" id="logoutBtn" class="nav-link"><i class="mr-2 bi bi-box-arrow-right"></i>Đăng xuất</a></li>
        </ul>
      </li>`;

      registerBlogPC.style.display = "none";
          //loginBlog.innerHTML = `<i class="mr-1 bi bi-person"></i>${fullname}</a></li>`;
          loginBlogPC.parentElement.innerHTML = `<li class="has-children" style="list-style: none">
        <a href="#profile-section" class="nav-link" style="padding: 20px"> <img src="http://localhost:8080/api/v1/Users/image/${user.data.userId}" alt="${fullname}"
        width="24" height="24" class="mr-1 rounded-circle"> ${fullname}</a>
        <ul class="dropdown arrow-top">
          <li><a href="userProfile.html" class="nav-link"><i class="mr-2 bi bi-info-circle"></i>Quản lý thông tin</a></li>
          <li><a href="class.html" class="nav-link"><i class="mr-2 bi bi-clipboard-check"></i>Lớp học</a></li>
          <li><a href="changePassword.html" class="nav-link"><i class=" mr-2 bi bi-key"></i>Đổi mật khẩu</a></li>
          <li><a href="" id="logoutBtn" class="nav-link"><i class="mr-2 bi bi-box-arrow-right"></i>Đăng xuất</a></li>
        </ul>
      </li>`;

      const listLogoutEle = document.querySelectorAll("#logoutBtn");
      

      const btnLogoutMobile = listLogoutEle[0];
      console.log(btnLogoutMobile);

      const btnLogoutPC = listLogoutEle[1];
      console.log(btnLogoutPC);

      btnLogoutMobile.addEventListener("click", function () {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
      });

      btnLogoutPC.addEventListener("click", function () {
        localStorage.removeItem('accessToken');
        window.location.href = '/index.html';
      });
    })
    .catch(error => {
      console.log(error);
      return "";
    });
}
else {
  console.log("chưa đăng nhập");
}





