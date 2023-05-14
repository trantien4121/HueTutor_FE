
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tutorId = urlParams.get('ID');

function convertDate(day) {
    const d = new Date(day);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Sartuday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const postedWeekDay = weekDays[d.getDay()];
    const postedMonth = months[d.getMonth()];
    const postedDay = d.getDate();
    const postedYear = d.getFullYear();
    return `${postedWeekDay}, ${postedMonth} ${postedDay}, ${postedYear}`;
};

const tutorApi = `http://localhost:8080/api/v1/Tutors/${tutorId}`;
const tutorInfo = fetch(tutorApi)
    .then(response => response.json())
    .then(tutor => {
        const tutorSection = document.querySelector('.tutor-description-section');
        tutorSection.innerHTML =
            `
        <div class="container">
        <div class="row gutters">
            <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                <div class="card card-custom">
                    <div class="card-body">
                        <div class="account-settings">
                            <div class="user-profile">
                                <div class="user-avatar">
                                    <img id="avatar" src="http://localhost:8080/api/v1/Users/image/${tutor.data.user.userId}" alt="avt">
                                </div>

                                <h5 class="user-name">${tutor.data.user.fullName}</h5>
                                <h6 class="user-email mt-3"><i class="mr-1 bi bi-envelope"></i>${tutor.data.user.email}</h6>
                                <h6 class="user-email mt-3"><i class="mr-1 bi bi-telephone"></i>${tutor.data.user.phoneNumber}</h6>
                                <h6 class="like-tutor mt-3" id="like-tutor"><i class="bi bi-hand-thumbs-up"></i> Like numbers: ${tutor.data.likeNumber}
                                </h6>

                                <div class="action-button d-flex justify-content-center mt-4">
                                    <button type="button" class="btn btn-like-tutor-${tutor.data.tutorId}" style="font-size:14px; background-color: #2c6dd5; color:#fff">
                                        <i class="mr-1 bi bi-hand-thumbs-up"></i>like
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12">
                <div class="card card-custom">
                    <div class="card-header mb-2 mt-2 d-flex justify-content-between">
                        <span style="font-size: 16px; line-height: 2.6rem;">Thông tin gia sư</span>
                        <button type="button" class="btn btn-primary btn-view-class-of-tutorr-${tutor.data.tutorId}" style="font-size: 16px;  background-color: #2c6dd5; color:#fff">
                            Xem các lớp <i class="bi bi-box-arrow-in-right"></i>
                        </button>
                    </div>
                    <div class="progress" role="progressbar" aria-label="Example 2px high" aria-valuenow="25"
                        aria-valuemin="0" aria-valuemax="100" style="height: 2px">
                        <div class="progress-bar" style="width: 12%"></div>
                    </div>
                    <div class="card-body">
                        <h6 class="mt-2 description" ">
                            <i class="mr-1 bi bi-mortarboard" ></i>
                            Họ tên: <b style="color: #2c6dd5">${tutor.data.user.fullName}</b>
                        </h6>
                        <h6 class="mt-4 description">
                            <i class="mr-1 bi bi-balloon"></i>
                            Tuổi: <b style="color: #2c6dd5">${tutor.data.user.age}</b>
                        </h6>
                        <h6 class="mt-4 description">
                            <i class="mr-1 bi bi-book"></i>
                            Môn dạy: <b style="color: #2c6dd5">${tutor.data.subject}</b>
                        </h6>
                        <h6 class="mt-4 description">
                            <i class="mr-1 bi bi-info-circle"></i>
                            Trình độ học vấn: <b style="color: #2c6dd5">${tutor.data.academicLevel}</b>
                        </h6>
                        <h6 class="mt-4 description">
                            <i class="mr-1 bi bi-geo-alt"></i>
                            Địa chỉ: <b style="color: #2c6dd5">${tutor.data.user.address}</b>
                        </h6>
                        <h6 class="mt-4 description">
                            <i class="mr-1 bi bi-geo-alt"></i>
                            Địa chỉ dạy: <b style="color: #2c6dd5">${tutor.data.addressTeach}</b>
                        </h6>
                        <h6 class="mt-4">
                            <i class="mr-1 bi bi-telephone"></i>
                            Số điện thoại: <b style="color: #2c6dd5">${tutor.data.user.phoneNumber}</b>
                        </h6>
                    </div>
                </div>

            </div>
            <div class="col mt-2">
                <div class="card card-custom">
                    <div class="card-header mb-2 mt-2 d-flex justify-content-between">
                        <span class="totalRate" style="font-size: 16px; line-height: 2.6rem; font-weight:bold">Đánh giá (20)</span>
                    </div>
                    <div class="progress" role="progressbar" aria-label="Example 2px high" aria-valuenow="25"
                        aria-valuemin="0" aria-valuemax="100" style="height: 2px">
                    <div class="progress-bar" style="width: 12%"></div>
                    </div>
                    <div class="card-body card-list-rate">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
        const listRateSection = document.querySelector('.card-list-rate');
        const rateInfo = fetch(`http://localhost:8080/api/v1/Rates/Tutor/${tutorId}`)
            .then(response => response.json())
            .then(rateInfo => {
                const totalRate = document.querySelector('.totalRate');
                totalRate.innerText = `Đánh giá (${rateInfo.length})`;

                for (var i = 0; i < rateInfo.length; i++) {
                    const listRateEle = document.createElement("div");
                    listRateEle.setAttribute("class", "list-rates mt-3");

                    function renderStar(numStar) {
                        var st = "";
                        for (var i = 0; i < numStar; i++) {
                            st = st + '<i class="bi bi-star-fill"></i>';
                        }
                        return st;
                    }

                    listRateEle.innerHTML =
                        `
                    <div class="rate-item-info d-flex justify-content-between">
                        <div class="rate-item-info__name"">
                            <img src="http://localhost:8080/api/v1/Users/image/${rateInfo[i].user.userId}" alt="img"
                                width="40" height="40" class="mr-1 mt-3 rounded-circle">
                            <span class="ml-2"">${rateInfo[i].user.fullName}</span>
                        </div>
                        <div class="rate-item-info__star pt-2" style="color: #FCE22A">
                            ${renderStar(rateInfo[i].numStarOfRate)}
                        </div>
                    </div>
                    <div class="rate-item-content ml-5 pl-2" style="font-size: 14px; line-height:2rem; margin-top: -10px">
                        <div class="rate-item-info__date" style="font-size:12px; color: #aaaaaa">
                        <i class="mr-1 bi bi-clock"></i><span>${convertDate(rateInfo[i].postedDay)}</span>
                        </div>
                        <span>${rateInfo[i].rateContent}</span>
                    </div>
                    `;
                    listRateSection.appendChild(listRateEle);
                };

                const accessToken = localStorage.getItem('accessToken');
                const userInfo = fetch(`http://localhost:8080/api/v1/auth/getUserByAccessToken/${accessToken}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(user => {
                        const addCmtEle = document.querySelector('div');
                        addCmtEle.setAttribute("class", "add-new-comment");
                        addCmtEle.innerHTML = `
                        <div class="rate-item-info d-flex mt-4">
                            <div class="rate-item-info__name"">
                                <img src="http://localhost:8080/api/v1/Users/image/${user.data.userId}" alt="img"
                                    width="40" height="40" class="mr-1 mt-3 rounded-circle">
                                <span class="ml-2" style="font-weight: 500; font-size: 16px">Thêm đánh giá</span>

                            </div>
                        </div>
                        <div class="rate-item-content ml-5 pl-2" style="font-size: 14px; line-height:2rem; margin-top: -10px">
                            <form id="user${user.data.userId}-add-for-tutor${tutorId}" method="POST">
                                <div class="star-rating mb-4">
                                    <span id="1" style="font-size:16px; color: grey ;cursor:pointer;" class="fa fa-star" onmouseover="startRating(this)" startRating="starmark(this)" ></span>
                                    <span id="2" style="font-size:16px; color: grey ;cursor:pointer;" class="fa fa-star" onmouseover="startRating(this)" startRating="starmark(this)"></span>
                                    <span id="3" style="font-size:16px; color: grey ;cursor:pointer;" class="fa fa-star" onmouseover="startRating(this)" startRating="starmark(this)"></span>
                                    <span id="4" style="font-size:16px; color: grey ;cursor:pointer;" class="fa fa-star" onmouseover="startRating(this)" startRating="starmark(this)"></span>
                                    <span id="5" style="font-size:16px; color: grey ;cursor:pointer;" class="fa fa-star" onmouseover="startRating(this)" startRating="starmark(this)"></span>
                                </div>
                                <div class="comment-box">
                                    <textarea type="text" placeholder="" id="review"></textarea>
                                    <label for="review" class="label">Viết gì đó về gia sư này?</label>
                                </div>

                                <div class="d-flex justify-content-start mt-4 mb-2">
                                    <button type="button" class="btn" onclick="result()" style="color: #fff; background-color: #2c6dd5; padding: 10px 20px;">
                                        Gửi <i class="bi bi-send"></i>
                                    </button>
                                </div>
                            </form>
			
			                <div id="result"></div>
                       
                        </div>
                        `;
                        listRateSection.appendChild(addCmtEle);
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));

        const likeBtn = document.querySelector(`.btn-like-tutor-${tutor.data.tutorId}`);
        likeBtn.addEventListener("click", async function () {
            const increaseLikeApi = `http://localhost:8080/api/v1/Tutors/increaseLikeNumber/${tutor.data.tutorId}`;
            const response = await fetch(increaseLikeApi, { 
                method: 'PUT',
            });
            if (!response.ok) {
                const message = `An error has accured: ${response.status}`;
                throw new Error(message);
                // registerFailedMessage.classList.remove('d-none');
            }
            const data = await response.json();
            document.getElementById("like-tutor").innerHTML = `<i class="bi bi-hand-thumbs-up"></i> Like numbers: ${data.data.likeNumber}`;
        });

        const viewClassbtn = document.querySelector(`.btn-view-class-of-tutorr-${tutor.data.tutorId}`);
        viewClassbtn.addEventListener("click", (e) =>{
            e.preventDefault();
            //alert("show class of tutor with Id = " + tutor.data.tutorId);
            window.location.href = `classOfTutor.html?ID=${tutor.data.tutorId}`;
        })

    })
    .catch(error => console.log(error));

