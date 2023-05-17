const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var currentPage = urlParams.get('pageNo') == null ? Number(1) : Number(urlParams.get('pageNo'));
const tutorId = urlParams.get("ID");

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
        prePageEle.href = `?ID=${tutorId}&pageNo=${curPage - 1}`;
    }

    if (curPage < totalPage) {
        nextPageEle.href = `?ID=${tutorId}&pageNo=${curPage + 1}`;
        nextPageEle.classList.remove("home-filter__page-btn--disable");
    } else {
        nextPageEle.classList.add("home-filter__page-btn--disable");
    }
}


callApi(`http://localhost:8080/api/v1/Classes/PaginationAndFilter/getClassesOfTutor/${tutorId}?pageNo=${currentPage - 1}`);

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

        const checkEle = document.querySelector('.home-filter__btn--active');
        if (checkEle.innerText == "Tất cả") {

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
                document.querySelector('.class-of-tutor-title').innerHTML = `
                    <div class="mt-3 text-primary" style="margin-left: -10px; margin-bottom: -15px; font-size: 16px; font-weight: 500">
                        <i class="mr-2 bi bi-card-checklist"></i>Không có lớp nào để hiển thị!
                    </div>
                `;
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
                                    <li>
                                        <button type="button" class="btn btn-register-${classInfo.data[i].classId}" style="font-size:14px; margin-left: 26px">
                                            Đăng ký
                                        </button>
                                    </li>
                                </ul>
                                
                                <!--Modal confirm Delete Class-->
                            

                                <!-- End Of Modal Confirm Delete -->

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
                        <div class="studentInfo d-flex justify-content-between">
                            <div class="class-numStudent">
                                <span><i class="mr-1 bi bi-person"></i>Số học viên: <span class="numstudent-with-class-${classInfo.data[i].classId}">0</span>/${classInfo.data[i].maxStudent}</span>
                            </div>
                            <div class="viewListStudent">
                                <a href="" data-bs-toggle="modal" data-bs-target="#viewAllUsersOfClass${classInfo.data[i].classId}">
                                    Xem danh sách
                                </a>

                                <!--Modal Show All Users Of Class-->
                               
                                <div class="modal fade" id="viewAllUsersOfClass${classInfo.data[i].classId}" data-bs-keyboard="false" tabindex="-1"
                                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title fs-5" style="margin-top: 12px;" id="exampleModalLabel">Danh sách các học viên ID = ${classInfo.data[i].classId}</h5>
                                                <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close">
                                                    <i class="bi bi-x" style="font-size: 24px;"></i>
                                                </button>
                                            </div>
                                            <div class="modal-body list-user-of-class${classInfo.data[i].classId}">
                                                
                                                <!--Render All Users Of this class-->

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- End Of Modal Show All Users Of Class -->

                            </div>
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

                    const eachClassId = classInfo.data[i].classId;
                    const accessToken = localStorage.getItem('accessToken');
                    const userId = fetch(`http://localhost:8080/api/v1/auth/getUserByAccessToken/${accessToken}`)
                        .then(response => response.json())
                        .then(info => {
                            const btnRegister = document.querySelector(`.btn-register-${eachClassId}`);
                            btnRegister.addEventListener("click", async function () {
                                const registerToClass = `http://localhost:8080/api/v1/ClassTeaches/${info.data.userId}/insertUserToClass/${eachClassId}`;
                                const response = await fetch(registerToClass, {
                                    method: 'POST',
                                });
                                if (!response.ok) {
                                    const message = `An error has accured: ${response.status}`;
                                    throw new Error(message);
                                    // registerFailedMessage.classList.remove('d-none');
                                }
                                const data = await response.json();
                                setTimeout(function () { location.reload() }, 1000);
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            document.querySelector(`.btn-register-${eachClassId}`).parentElement.parentElement.style.display = "none";
                        });

                    //Call Show List Users Of Class APi
                    const classId = classInfo.data[i].classId;
                    const lstUserApi = `http://localhost:8080/api/v1/ClassTeaches/getAllUsers/${classInfo.data[i].classId}`;
                    fetch(lstUserApi)
                        .then(response => response.json())
                        .then(lstInfo => {
                            console.log(lstInfo);

                            const LstUserEle = document.querySelector(`.list-user-of-class${lstInfo[0].cla.classId}`);
                            console.log(LstUserEle);

                            const ulEle = document.createElement("ul");
                            ulEle.setAttribute("class", "list-user");

                            for (var i = 0; i < lstInfo.length; i++) {

                                document.querySelector(`.numstudent-with-class-${lstInfo[i].cla.classId}`).innerText = `${lstInfo.length}`;

                                var liEle = document.createElement("li");
                                liEle.setAttribute("class", "list-user-item");

                                liEle.innerHTML = `
                                    <div class="list-user-item-info d-flex justify-content-between">
                                        <div class="list-user-item-info__name">
                                            <img src="http://localhost:8080/api/v1/Users/image/${lstInfo[i].user.userId}" alt="img"
                                            width="50" height="50" class="mr-1 rounded-circle">
                                            <span>${lstInfo[i].user.fullName}</span>
                                        </div>
                                        <div class="list-user-item-info__day pt-2">

                                        </div>
                                    </div>
                                    `;
                                ulEle.appendChild(liEle);
                            }
                            LstUserEle.appendChild(ulEle);
                        })
                        .catch(error => {
                            console.log(error)
                            console.log("CHƯA CÓ HỌC VIÊN NÀO ĐĂNG KÝ!");

                            const lstNoContentEle = document.querySelector(`.list-user-of-class${classId}`);
                            console.log(lstNoContentEle);

                            const noContentEle = document.createElement("h6");
                            noContentEle.innerHTML = "Chưa có học viên nào đăng ký!";

                            lstNoContentEle.appendChild(noContentEle);
                        });

                }

            }
        })
        .catch(error => console.log(error));
}