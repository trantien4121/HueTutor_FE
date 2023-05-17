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
                                                    <li>
                                                        <a href="" class="dropdown-item"
                                                            data-bs-toggle="modal" data-bs-target="#updateClassModal${classInfo.data[i].classId}">
                                                            Chỉnh sửa
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="" class="dropdown-item"
                                                            data-bs-toggle="modal" data-bs-target="#confirmDeleleModal${classInfo.data[i].classId}">
                                                            Xóa
                                                        </a>
                                                    </li>
                                                </ul>
                                                
                                                <!--Modal confirm Delete Class-->
                                               
                                                <div class="modal fade" id="confirmDeleleModal${classInfo.data[i].classId}" data-bs-keyboard="false" tabindex="-1"
                                                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h5 class="modal-title fs-5" style="margin-top: 12px;" id="exampleModalLabel">Thông báo!</h5>
                                                                <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close">
                                                                    <i class="bi bi-x" style="font-size: 24px;"></i>
                                                                </button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <h5 class="mt-3 mb-3">Bạn có chắc chắn muốn xóa lớp có ID = ${classInfo.data[i].classId} này!</h5>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-cancelDelete" data-bs-dismiss="modal">No</button>
                                                                <button type="submit" class="btn btn-confirmDelete btn-confirmDelete${classInfo.data[i].classId} ml-2">Yes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- End Of Modal Confirm Delete -->

                                                <!-- Modal Update Class-->
                                                <form method="post" id="updateClass${classInfo.data[i].classId}">
                                                <div class="modal fade" id="updateClassModal${classInfo.data[i].classId}" data-bs-keyboard="false" tabindex="-1"
                                                aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title fs-5" style="margin-top: 12px;" id="exampleModalLabel">Chỉnh sửa lớp học với ID = ${classInfo.data[i].classId}</h5>
                                                            <!-- <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x"
                                                                style="font-size: 24px;"></i></button> -->
                                                            <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close">
                                                                <i class="bi bi-x" style="font-size: 24px;"></i>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div class="row gutters">
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="subjectName">Môn học</label>
                                                                        

                                                                        <input type="text" class="form-control" id="subjectName" name="subjectName" value="${classInfo.data[i].subjectName}"
                                                                            placeholder="Nhập mức học phí">
                                                                        
                                                                        
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="tuitionFee">Học phí (vnđ/tháng)</label>
                                                                        <input type="text" class="form-control" id="tuitionFee" name="tuitionFee" value="${classInfo.data[i].tuitionFee}"
                                                                            placeholder="Nhập mức học phí">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="gradeLevel">Lớp</label>
                                                                        <input type="number" class="form-control" id="gradeLevel" name="gradeLevel" value="${classInfo.data[i].gradeLevel}"
                                                                            placeholder="Nhập lớp">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="maxStudent">Số học viên tối đa</label>
                                                                        <input type="number" class="form-control" id="maxStudent" name="maxStudent" value = "${classInfo.data[i].maxStudent}"
                                                                            placeholder="Nhập số học viên">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="lessonTime">Thời lượng (h/buổi)</label>
                                                                        <input type="text" class="form-control" id="lessonTime" name="lessonTime" value = "${classInfo.data[i].lessonTime}
                                                                            placeholder="Nhập thời lượng buổi">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="isOnline">Hình thức</label><br>
                                                                        <div class="form-check form-check-inline mt-2 mr-3">
                                                                            <input class="form-check-input" type="radio" name="isOnline" id="onlineClass"
                                                                                value="true"  ${classInfo.data[i].online == true ? "checked" : ""}>
                                                                            <label class="form-check-label" for="onlineClass">online</label>
                                                                        </div>
                                                                        <div class="form-check form-check-inline mt-2">
                                                                            <input class="form-check-input" type="radio" name="isOnline" id="offlineClass"
                                                                                value="false" ${classInfo.data[i].online == false ? "checked" : ""}>
                                                                            <label class="form-check-label" for="offlineClass">trực tiếp</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="startDay">Ngày bắt đầu</label>
                                                                        <input type="date" class="form-control" id="startDay" name="startDay" value = "${classInfo.data[i].startDay}"
                                                                            placeholder="Chọn thời gian bắt đầu">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="endDay">Ngày kết thúc</label>
                                                                        <input type="date" class="form-control" id="endDay" name="endDay" value = "${classInfo.data[i].endDay}"
                                                                            placeholder="Chọn thời gian kết thúc">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="status">Trạng thái</label>
                                                                        <input type="text" class="form-control" id="status" name="status" value="${classInfo.data[i].status}">
                                                                    </div>
                                                                </div>
                                                                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                                    <div class="form-group">
                                                                        <label for="timeTable">Thời khóa biểu</label>
                                                                        <input type="text" class="form-control" id="timeTable" name="timeTable" value = "${classInfo.data[i].timeTable}"
                                                                            placeholder="Nhập thời khóa biểu">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="modal-footer">
                                                            <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="submit" class="btn btn-createClassSubmit ml-3">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </form>
                                                <!-- End Of Modal Update Class-->

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
                                                <span><i class="mr-1 bi bi-person"></i><span class="numstudent-with-class-${classInfo.data[i].classId}">0</span>/${classInfo.data[i].maxStudent}</span>
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
                                                                
                                                                <!-- <ul class="list-user">
                                                                    <li class="list-user-item">
                                                                        <div class="list-user-item-info d-flex justify-content-between">
                                                                            <div class="list-user-item-info__name">
                                                                                <img src="https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg" alt="img"
                                                                                width="50" height="50" class="mr-1 rounded-circle">
                                                                                <span>Trần Tiến</span>
                                                                            </div>
                                                                            <div class="list-user-item-info__day pt-2">
                                                                              
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="list-user-item">
                                                                        <div class="list-user-item-info d-flex justify-content-between">
                                                                            <div class="list-user-item-info__name">
                                                                                <img src="https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg" alt="img"
                                                                                width="50" height="50" class="mr-1 rounded-circle">
                                                                                <span>Đoàn Quang Thái</span>
                                                                            </div>
                                                                            <div class="list-user-item-info__day pt-2">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="list-user-item">
                                                                        <div class="list-user-item-info d-flex justify-content-between">
                                                                            <div class="list-user-item-info__name">
                                                                                <img src="https://znews-photo.zingcdn.me/w660/Uploaded/qhj_yvobvhfwbv/2018_07_18/Nguyen_Huy_Binh1.jpg" alt="img"
                                                                                width="50" height="50" class="mr-1 rounded-circle">
                                                                                <span>Nguyễn Hữu Vinh</span>
                                                                            </div>
                                                                            <div class="list-user-item-info__day pt-2">
                                                                                
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul> -->
                                                                

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

                                    //Call delete API
                                    const deleteClassApi = `http://localhost:8080/api/v1/Classes/${info.data.tutorId}/${classInfo.data[i].classId}`;

                                    var btnDel = document.querySelector(`.btn-confirmDelete${classInfo.data[i].classId}`);
                                    btnDel.addEventListener("click", async function () {


                                        const response = await fetch(deleteClassApi, {
                                            method: 'DELETE',
                                        });
                                        if (!response.ok) {
                                            const message = `An error has accured: ${response.status}`;
                                            throw new Error(message);
                                        }
                                        //console.log(`Delete Class successfully!`);
                                        const buttnOpenModalDel = document.getElementById("delete-class-success");
                                        buttnOpenModalDel.click();
                                        setTimeout(function () { location.reload() }, 1000);

                                    });

                                    //Call Put API
                                    const putClassApi = `http://localhost:8080/api/v1/Classes/${info.data.tutorId}/${classInfo.data[i].classId}`;
                                    const putForm = document.getElementById(`updateClass${classInfo.data[i].classId}`);
                                    putForm.addEventListener('submit', async event => {
                                        event.preventDefault();

                                        const formData = new FormData(putForm);

                                        const response = await fetch(putClassApi, {
                                            method: 'PUT',
                                            body: formData
                                        });
                                        if (!response.ok) {
                                            const message = `An error has accured: ${response.status}`;
                                            throw new Error(message);
                                        }
                                        const data = await response.json();
                                        console.log(data);
                                        //alert('update User successfully');

                                        const buttnOpenModal = document.getElementById("update-class-success");
                                        buttnOpenModal.click();
                                        setTimeout(function () { location.reload() }, 1000);
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

                                                document.querySelector(`.numstudent-with-class-${lstInfo[i].cla.classId}`).innerText = `${lstInfo.length}`

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

                //Render All subject that tutor can teach inssubject select option
                var subjectSelectEle = document.getElementById('subjectName');
                var subject = info.data.subject;

                subject.forEach((sub, index) => {
                    var option = document.createElement("option");
                    option.text = sub;
                    option.setAttribute("value", sub);
                    subjectSelectEle.add(option);
                });

                //Call Post Api

                const postClassApi = `http://localhost:8080/api/v1/Classes/${info.data.tutorId}/insert`;
                const form = document.getElementById('createNewClass');
                form.addEventListener('submit', async event => {
                    event.preventDefault();

                    const formData = new FormData(form);
                    formData.set("tuitionFee", formData.get("tuitionFee") + " vnđ / tháng");
                    formData.set("lessonTime", formData.get("lessonTime") + "h/buổi");

                    // var object = {};
                    // formData.forEach((value, key) => object[key] = value);
                    // var json = JSON.stringify(object);

                    const response = await fetch(postClassApi, {
                        method: 'POST',
                        body: formData
                    });
                    if (!response.ok) {
                        const message = `An error has accured: ${response.status}`;
                        throw new Error(message);
                    }
                    const data = await response.json();
                    console.log(data);
                    //alert('update User successfully');

                    const buttnOpenModal = document.getElementById("add-class-success");
                    buttnOpenModal.click();

                    // console.log(json);

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
                                                    <button type="button" class="btn btn-cancel-register-${classInfo.data[i].cla.classId}" style="font-size:14px; margin-left: 10px">
                                                        Hủy đăng ký
                                                    </button>
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
                                            <span><i class="mr-1 bi bi-person"></i>Số lượng học viên: <span class="numstudent-with-class-${classInfo.data[i].cla.classId}">0</span>/${classInfo.data[i].cla.maxStudent}</span>
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

                                    const eachClassId = classInfo.data[i].cla.classId;
                                    //Cancel Registered function
                                    const btnCancelRegister = document.querySelector(`.btn-cancel-register-${eachClassId}`);
                                    btnCancelRegister.addEventListener("click", async function () {
                                        const cancelRegisterToClass = `http://localhost:8080/api/v1/ClassTeaches/${userId}/deleteUserToClass/${eachClassId}`;
                                        const response = await fetch(cancelRegisterToClass, {
                                            method: 'DELETE',
                                        });
                                        if (!response.ok) {
                                            const message = `An error has accured: ${response.status}`;
                                            throw new Error(message);
                                            // registerFailedMessage.classList.remove('d-none');
                                        }
                                        const data = await response.json();
                                        alert("Hủy đănh ký lớp học thành công!");
                                        setTimeout(function () { location.reload() }, 1000);
                                    });

                                    const lstUserApi = `http://localhost:8080/api/v1/ClassTeaches/getAllUsers/${classInfo.data[i].cla.classId}`;
                                    fetch(lstUserApi)
                                        .then(response => response.json())
                                        .then(lstInfo => {

                                            for (var i = 0; i < lstInfo.length; i++) {
                                                document.querySelector(`.numstudent-with-class-${lstInfo[i].cla.classId}`).innerText = `${lstInfo.length}`;
                                            }
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });

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