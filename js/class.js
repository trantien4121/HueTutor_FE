//convert day function
function convertDate(day) {
    const d = new Date(day);
    const postedMonth = d.getMonth();
    const postedDay = d.getDate();
    const postedYear = d.getFullYear();
    return `${postedDay}/${postedMonth + 1}/${postedYear}`;
};

//check status function (để test - sẽ sửa sau (Check dựa vào status))
function checkStatusOfClass(startDay, endDay, numStudent, maxStudent) {
    const d = Date.now();
    const start = new Date(startDay);
    const end = new Date(endDay);

    //đang hoạt động
    if ((d <= end) && (d >= start) && (numStudent <= maxStudent))
        return `<i class="mr-2 bi bi-circle-fill icon-filter icon-filter-green"
                            style="font-size: 8px; color: #16FF00"></i>`;
    //đang chờ
    if ((d < start))
        return `<i class="mr-2 bi bi-circle-fill icon-filter icon-filter-yellow"
                            style="font-size: 8px; color: #FCE22A"></i>`;
    //đã kết thúc                        
    if (d > end)
        return `<i class="mr-2 bi bi-circle-fill icon-filter icon-filter-red"
                            style="font-size: 8px; color: #FF1E00"></i>`;
    else return "";
}

//fetch api and render data
const accessToken = localStorage.getItem('accessToken');
const userInfo = fetch(`http://localhost:8080/api/v1/auth/getUserByAccessToken/${accessToken}`)
    .then(response => {
        return response.json();
    })
    .then(user => {
        const userId = user.data.userId;
        console.log(userId);
        //Nếu User đó có thông tin tutor thì lấy và hiển thị các lớp của tutor và button tạo lớp mới
        const roleInfo = fetch(`http://localhost:8080/api/v1/Tutors/getRole/${userId}`)
            .then(response => {
                return response.json();
            })
            .then(info => {

                /*Hiển thị ra giao diện*/

                //có info.data.tutorId
                //-> getClasses of tutor Id

                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                var currentPage = urlParams.get('pageNo') == null ? Number(1) : Number(urlParams.get('pageNo'));

                function pagination(curPage, totalPage) {
                    const prePageEle = document.querySelector('.home-filter-prePage');
                    const nextPageEle = document.querySelector('.home-filter-nextPage');
                    const currentPageEle = document.querySelector('.home-filter__page-current');
                    const totalPageEle = document.querySelector('.home-filter__page-total');

                    currentPageEle.innerText = curPage;
                    totalPageEle.innerText = totalPage;

                    if (curPage < 2) {
                        prePageEle.classList.add("home-filter__page-btn--disable");
                    } else {
                        prePageEle.classList.remove("home-filter__page-btn--disable");
                        prePageEle.href = `?pageNo=${curPage - 1}`;
                    }

                    if (curPage < totalPage) {
                        nextPageEle.href = `?pageNo=${curPage + 1}`;
                        nextPageEle.classList.remove("home-filter__page-btn--disable");
                    } else {
                        nextPageEle.classList.add("home-filter__page-btn--disable");
                    }
                }


                callApi(`http://localhost:8080/api/v1/Classes/PaginationAndFilter/getClassesOfTutor/${info.data.tutorId}?pageNo=${currentPage - 1}`);

                let btnFilterList = document.querySelectorAll('.home-filter__btn');
                btnFilterList.forEach(btn => btn.addEventListener("click", (e) => {
                    e.preventDefault();

                    document.querySelector(".home-filter__btn.home-filter__btn--active").classList.remove("home-filter__btn--active");
                    btn.classList.add("home-filter__btn--active");

                    function hideElement(statusClassIcon) {
                        var listFilterEle = [];
                        var listChildFilterEle = document.querySelectorAll('.bi-circle-fill.icon-filter');
                        listChildFilterEle.forEach(child => {
                            if (child.classList.contains(statusClassIcon))
                                listFilterEle.push(child.parentElement.parentElement.parentElement.parentElement.parentElement);
                        });

                        for (var i = 0; i < listFilterEle.length; i++) {
                            listFilterEle[i].classList.add("d-none");
                        }
                    }

                    function showElement(statusClassIcon) {
                        var listFilterEle = [];
                        var listChildFilterEle = document.querySelectorAll('.bi-circle-fill.icon-filter');
                        listChildFilterEle.forEach(child => {
                            if (child.classList.contains(statusClassIcon))
                                listFilterEle.push(child.parentElement.parentElement.parentElement.parentElement.parentElement);
                        });

                        for (var i = 0; i < listFilterEle.length; i++) {
                            listFilterEle[i].classList.remove("d-none");
                        }
                    }

                    function ShowFilterOnClick() {

                        // callApi(`http://localhost:8080/api/v1/ClassTeaches/PaginationAndFilter/getAllClassesOfUser/${userId}?pageNo=${currentPage - 1}`);

                        const checkEle = document.querySelector('.home-filter__btn--active');
                        if (checkEle.innerText == "Tất cả") {

                            //hidefirstElementFilterCalled();
                            //không làm gì cả

                            showElement("icon-filer-green");
                            showElement("icon-filter-yellow");
                            showElement("icon-filter-red");

                        }
                        if (checkEle.innerText == "Đang hoạt động") {

                            //hidefirstElementFilterCalled();
                            //ẩn những element có trạng thái không phải là đang hoạt động

                            showElement("icon-filter-green");
                            hideElement("icon-filter-red");
                            hideElement("icon-filter-yellow");

                        }
                        if (checkEle.innerText == "Đang chờ") {

                            //hidefirstElementFilterCalled();
                            //ẩn những element có trạng thái không phải là đang chờ

                            showElement("icon-filter-yellow");
                            hideElement("icon-filter-green");
                            hidedElement("icon-filter-red");
                        }
                        if (checkEle.innerText == "Kết thúc") {

                            //hidefirstElementFilterCalled();
                            //ẩn những element có trạng thái không phải và kết thúc

                            showElement("icon-filter-red");
                            hideElement("icon-filter-green");
                            hideElement("icon-filter-yellow");

                        }
                    };

                    ShowFilterOnClick();
                }));


                function callApi(api) {
                    const classOfTutor = fetch(api)
                        .then(response => {
                            return response.json();
                        })
                        .then(classInfo => {

                            const mainContent = document.querySelector(".row-classes");

                            /* title class of tutor*/
                            const renderTitleContent = document.createElement("div");
                            renderTitleContent.setAttribute("class", "col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 class-of-tutor-title")
                            renderTitleContent.innerHTML = `
                                <div class="mt-3 text-primary" style="margin-left: -10px; margin-bottom: -15px; font-size: 16px; font-weight: 500">
                                    <i class="mr-2 bi bi-card-checklist"></i>Danh sách các lớp dạy
                                </div>
                            `;
                            mainContent.appendChild(renderTitleContent);
                            /*end title*/

                            const renderContent = document.createElement("div");
                            renderContent.setAttribute("class", "filter-content row");

                            //Không tìm thấy lớp học nào của gia sư đó
                            if (classInfo.status == "NumOfPages = 0") {
                            //     const noClassEle = document.createElement("div");
                            //     noClassEle.setAttribute("Class", "col-6 offset-3 pt-5 mt-5 pb-4 mb-4");
                            //     noClassEle.innerHTML = `
                            //     <div class="no-content d-flex justify-content-center">
                            //         <h4 style="color: #ccc">Không tồn tại lớp dạy nào!</h4>
                            //     </div>
                            // `;
                            //     renderContent.appendChild(noClassEle);
                            //     mainContent.appendChild(renderContent);
                            document.querySelector('.class-of-tutor-title').style.display = "none";
                            }
                            else {
                                //Lấy số trang mà Api trả về
                                console.log(classInfo.status);
                                var totalPageStr = classInfo.status;
                                const totalPage = Number(totalPageStr.slice(13, 14))

                                //Xử lý các button phân trang
                                pagination(currentPage, totalPage);

                                //Hiển thị các lớp

                                for (var i = 0; i < classInfo.data.length; i++) {
                                    const colReneder = document.createElement("div");
                                    colReneder.setAttribute("class", "col-lg-4 col-md-6 col-sm-12 mt-4");

                                    const cardClass = document.createElement("div");
                                    cardClass.setAttribute("class", "card card-class-custom");

                                    cardClass.innerHTML = `
                            
                            <div class="card-header align-items-center">
                                        <div class="class-title d-flex justify-content-between">
                                            <div class="class-name">
                                                ${checkStatusOfClass(classInfo.data[i].startDay, classInfo.data[i].endDay, 1, classInfo.data[i].maxStudent)}
                                                ${classInfo.data[i].subjectName} - ${classInfo.data[i].gradeLevel}
                                            </div>
                                            <div class="class-action">
                                                <button class="btn btn-action" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="bi bi-three-dots"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#">Chỉnh sửa</a></li>
                                                    <li><a class="dropdown-item" href="#">Xóa</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="class-tutor mb-4">
                                            <i class="mr-1 bi bi-mortarboard"></i> ${classInfo.data[i].tutor.user.fullName}
                                        </div>
                                    </div>
                                   
                                    <div class="card-body mt-3 mb-3">
                                        <div class="class-time mb-3">
                                            <span><i class="mr-1 bi bi-clock"></i>Thời gian: ${convertDate(classInfo.data[i].startDay)} -
                                                ${convertDate(classInfo.data[i].endDay)}</span>
                                        </div>
                                        <div class="class-numStudent">
                                            <span><i class="mr-1 bi bi-person"></i>Số lượng học viên: 1/${classInfo.data[i].maxStudent}</span>
                                        </div>
                                    </div>
                            `;
                                    colReneder.appendChild(cardClass);

                                    const tag = document.createElement("div");
                                    tag.setAttribute("class", "home-product-item__favourite");


                                    tag.innerHTML = classInfo.data[i].online ? `
                                    <i class="bi bi-wifi-2"></i>
                                    <span>online</span>
                                `:
                                        `<i class="bi bi-reception-4"></i>
                                    <span>trực tiếp</span>
                                `;
                                    colReneder.appendChild(tag);
                                    renderContent.appendChild(colReneder);
                                    mainContent.appendChild(renderContent);
                                }

                            }
                            const addNewEle = document.createElement("div");
                            addNewEle.setAttribute("class", "col-12 d-flex justify-content-center mt-5");
                            addNewEle.innerHTML = `
                            <!-- Button trigger create or join in success-->
                            <button id="btnCreate" type="button" class="btn"
                                data-bs-toggle="modal" data-bs-target="#createNewClassForm">
                                <i class="bi bi-plus"></i>
                                Thêm lớp
                            </button>
                            `;
                            renderContent.appendChild(addNewEle)
                            //mainContent.appendChild(renderContent);

                        })
                        .catch(error => console.log(error));
                }

                //Create new Class if has Role = Tutor

                const putUserTutorApi = `http://localhost:8080/api/v1/Tutors/updateUserAndTutor/${userId}/${info.data.tutorId}`;
                const form = document.getElementById('update-form');
                form.addEventListener('submit', async event => {
                    event.preventDefault();

                    const formData = new FormData(form);

                    const response = await fetch(putUserTutorApi, {
                        method: 'PUT',
                        body: formData
                    });
                    if (!response.ok) {
                        const message = `An error has accured: ${response.status}`;
                        throw new Error(message);
                        console.log(message);
                        // registerFailedMessage.classList.remove('d-none');
                    }
                    const data = await response.json();
                    console.log(data);
                    //alert('update User successfully');

                    const buttnOpenModal = document.getElementById("update-success");
                    buttnOpenModal.click();

                });

            })
            .catch(error => {
                console.log(error);
                //Nếu user đó k phải tutor thì hiển thị thông tin các lớp mà user đó đã đăng ký

                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                var currentPage = urlParams.get('pageNo') == null ? Number(1) : Number(urlParams.get('pageNo'));

                function pagination(curPage, totalPage) {
                    const prePageEle = document.querySelector('.home-filter-prePage');
                    const nextPageEle = document.querySelector('.home-filter-nextPage');
                    const currentPageEle = document.querySelector('.home-filter__page-current');
                    const totalPageEle = document.querySelector('.home-filter__page-total');

                    currentPageEle.innerText = curPage;
                    totalPageEle.innerText = totalPage;

                    if (curPage < 2) {
                        prePageEle.classList.add("home-filter__page-btn--disable");
                    } else {
                        prePageEle.classList.remove("home-filter__page-btn--disable");
                        prePageEle.href = `?pageNo=${curPage - 1}`;
                    }

                    if (curPage < totalPage) {
                        nextPageEle.href = `?pageNo=${curPage + 1}`;
                        nextPageEle.classList.remove("home-filter__page-btn--disable");
                    } else {
                        nextPageEle.classList.add("home-filter__page-btn--disable");
                    }
                }


                callApi(`http://localhost:8080/api/v1/ClassTeaches/PaginationAndFilter/getAllClassesOfUser/${userId}?pageNo=${currentPage - 1}`)

                let btnFilterList = document.querySelectorAll('.home-filter__btn');
                btnFilterList.forEach(btn => btn.addEventListener("click", (e) => {
                    e.preventDefault();

                    document.querySelector(".home-filter__btn.home-filter__btn--active").classList.remove("home-filter__btn--active");
                    btn.classList.add("home-filter__btn--active");

                    function hideElement(statusClassIcon) {
                        var listFilterEle = [];
                        var listChildFilterEle = document.querySelectorAll('.bi-circle-fill.icon-filter');
                        listChildFilterEle.forEach(child => {
                            if (child.classList.contains(statusClassIcon))
                                listFilterEle.push(child.parentElement.parentElement.parentElement.parentElement.parentElement);
                        });

                        for (var i = 0; i < listFilterEle.length; i++) {
                            listFilterEle[i].classList.add("d-none");
                        }
                    }

                    function showElement(statusClassIcon) {
                        var listFilterEle = [];
                        var listChildFilterEle = document.querySelectorAll('.bi-circle-fill.icon-filter');
                        listChildFilterEle.forEach(child => {
                            if (child.classList.contains(statusClassIcon))
                                listFilterEle.push(child.parentElement.parentElement.parentElement.parentElement.parentElement);
                        });

                        for (var i = 0; i < listFilterEle.length; i++) {
                            listFilterEle[i].classList.remove("d-none");
                        }
                    }

                    function ShowFilterOnClick() {

                        // callApi(`http://localhost:8080/api/v1/ClassTeaches/PaginationAndFilter/getAllClassesOfUser/${userId}?pageNo=${currentPage - 1}`);

                        const checkEle = document.querySelector('.home-filter__btn--active');
                        if (checkEle.innerText == "Tất cả") {

                            //hidefirstElementFilterCalled();
                            //không làm gì cả

                            showElement("icon-filer-green");
                            showElement("icon-filter-yellow");
                            showElement("icon-filter-red");

                        }
                        if (checkEle.innerText == "Đang hoạt động") {

                            //hidefirstElementFilterCalled();
                            //ẩn những element có trạng thái không phải là đang hoạt động

                            showElement("icon-filter-green");
                            hideElement("icon-filter-red");
                            hideElement("icon-filter-yellow");

                        }
                        if (checkEle.innerText == "Đang chờ") {

                            //hidefirstElementFilterCalled();
                            //ẩn những element có trạng thái không phải là đang chờ

                            showElement("icon-filter-yellow");
                            hideElement("icon-filter-green");
                            hidedElement("icon-filter-red");
                        }
                        if (checkEle.innerText == "Kết thúc") {

                            //hidefirstElementFilterCalled();
                            //ẩn những element có trạng thái không phải và kết thúc

                            showElement("icon-filter-red");
                            hideElement("icon-filter-green");
                            hideElement("icon-filter-yellow");

                        }
                    };

                    ShowFilterOnClick();
                }));
                function callApi(api) {
                    fetch(api)
                        .then(response => {
                            return response.json();
                        })
                        .then(classInfo => {

                            const mainContent = document.querySelector(".row-classes");

                            
                            /* title class of tutor*/
                            const renderTitleContent = document.createElement("div");
                            renderTitleContent.setAttribute("class", "col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3 class-of-user-title")
                            renderTitleContent.innerHTML = `
                                <div class="mt-3 text-primary" style="margin-left: -10px; margin-bottom: -15px; font-size: 16px; font-weight: 500">
                                    <i class="mr-2 bi bi-card-checklist"></i>Danh sách các lớp học
                                </div>
                            `;
                            mainContent.appendChild(renderTitleContent);
                            /*end title*/

                            const renderContent = document.createElement("div");
                            renderContent.setAttribute("class", "filter-content row");

                            //Không tìm thấy lớp học nào đã đăng ký của người dùng đó đó
                            if (classInfo.status == "NumOfPages = 0") {
                            //     const noClassEle = document.createElement("div");
                            //     noClassEle.setAttribute("Class", "col-12 mt-5 mb-5");
                            //     noClassEle.innerHTML = `
                            //     <div class="no-content">
                                    
                            //         <h4 style="color: #ccc">Không tồn tại lớp học nào của bạn!</h4>
                            //     </div>
                            // `;

                            //     mainContent.appendChild(noClassEle);
                                document.querySelector('.class-of-user-title').style.display = "none";
                            }
                            else {
                                //Lấy số trang mà Api trả về
                                console.log(classInfo.status);
                                var totalPageStr = classInfo.status;
                                const totalPage = Number(totalPageStr.slice(13, 14))

                                //Xử lý các button phân trang
                                pagination(currentPage, totalPage);
                                //Hiển thị các lớp


                                //console.log(classInfo[1].cla.tutor.user.fullName);

                                for (var i = 0; i < classInfo.data.length; i++) {
                                    const colReneder = document.createElement("div");
                                    colReneder.setAttribute("class", "col-lg-4 col-md-6 col-sm-12 mt-4");

                                    const cardClass = document.createElement("div");
                                    cardClass.setAttribute("class", "card card-class-custom");

                                    cardClass.innerHTML = `

                            <div class="card-header align-items-center">
                                        <div class="class-title d-flex justify-content-between">
                                            <div class="class-name">
                                                ${checkStatusOfClass(classInfo.data[i].cla.startDay, classInfo.data[i].cla.endDay, 1, classInfo.data[i].cla.maxStudent)}
                                                ${classInfo.data[i].cla.subjectName} - ${classInfo.data[i].cla.gradeLevel}
                                            </div>
                                            <div class="class-action">
                                                <button class="btn btn-action" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i class="bi bi-three-dots"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#">Rời khỏi</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="class-tutor mb-4">
                                            <i class="mr-1 bi bi-mortarboard"></i> ${classInfo.data[i].cla.tutor.user.fullName}
                                        </div>
                                    </div>

                                    <img src="http://localhost:8080/api/v1/Users/image/${classInfo.data[i].cla.tutor.user.userId}" alt="img"
                                    width="70" height="70" class="mr-1 rounded-circle tutor-image">

                                    <div class="card-body mt-3 mb-3">
                                        <div class="class-time mb-3">
                                            <span><i class="mr-1 bi bi-clock"></i>Thời gian: ${convertDate(classInfo.data[i].cla.startDay)} -
                                                ${convertDate(classInfo.data[i].cla.endDay)}</span>
                                        </div>
                                        <div class="class-numStudent mb-3">
                                            <span><i class="mr-1 bi bi-person"></i>Số lượng học viên: 1/${classInfo.data[i].cla.maxStudent}</span>
                                        </div>
                                        <div class="class-registeredDay">
                                            <span><i class="mr-1 bi bi-clock"></i>Ngày đăng ký: ${convertDate(classInfo.data[i].registeredDay)}</span>
                                        </div>
                                    </div>
                            `;
                                    colReneder.appendChild(cardClass);

                                    const tag = document.createElement("div");
                                    tag.setAttribute("class", "home-product-item__favourite");


                                    tag.innerHTML = classInfo.data[i].cla.online ? `
                                    <i class="bi bi-wifi-2"></i>
                                    <span>online</span>
                                `:
                                        `<i class="bi bi-reception-4"></i>
                                    <span>trực tiếp</span>
                                `;
                                    colReneder.appendChild(tag);
                                    // mainContent.appendChild(colReneder);
                                    renderContent.appendChild(colReneder);
                                    mainContent.appendChild(renderContent);
                                }

                            }
                        })
                        .catch(error => console.log(error));
                }

            });
    })
    .catch(error => {
        console.log(error);
        return "";
    });