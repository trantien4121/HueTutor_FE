//Chỉ hiển thị 6 gia sư
const apiTutors = `http://localhost:8080/api/v1/Tutors`;
const apiTutorsOST = `http://localhost:8080/api/v1/Tutors/getTutorPaging?pageSize=4&sortBy=likeNumber`;

const getOutstandingtutor = (callback) => {
    fetch(apiTutors)
        .then((response) => {
            return response.json();
        })
        .then(callback);
};
const getOutstandingtutorOST = (callback) => {
    fetch(apiTutorsOST)
        .then((response) => {
            return response.json();
        })
        .then(callback);
};

function showOutstandingTutors() {

    const row = document.querySelector('.row-tutor');
    getOutstandingtutor((data) => {

        data.forEach(tutor => {

            const colClass = document.createElement("div");
            colClass.setAttribute("class", "col-lg-4 col-md-6 col-sm-12 pt-3 pb-3 list-tutor-render");

            colClass.innerHTML = `
            <a href="tutor.html?ID=${tutor.tutorId}">
                <img src=http://localhost:8080/api/v1/Users/image/${tutor.user.userId} alt="" width="100%"
                height="200px">
            </a>
            <div style="border-bottom-radius: 20px; background-color: #2c6dd5; padding: 10px 20px; color: white">
                <h6 class="mt-2 description" style="font-weight: bold;">
                    <i class="mr-1 bi bi-mortarboard"></i>
                    ${tutor.user.fullName}
                </h6>
                <h6 class="mt-2 description">
                    <i class="mr-1 bi bi-book"></i>
                    Môn dạy: ${tutor.subject}
                </h6>
                <h6 class="mt-2 description">
                    <i class="mr-1 bi bi-geo-alt"></i>
                    Địa chỉ: ${tutor.user.address}
                </h6>
                <h6 class="mt-2">
                    <i class="mr-1 bi bi-star"></i>
                    Lượt like: ${tutor.likeNumber}
                </h6>
            </div>
            `;
            row.appendChild(colClass);


            const cardHover = document.createElement("div");
            cardHover.setAttribute("class", "row-tutor-content");

            const cardHover__title = document.createElement("h6");
            cardHover__title.setAttribute("class", "card-tutor-title");
            cardHover__title.innerText = "Thông tin gia sư";

            const cardHover__content = document.createElement("div");
            cardHover__content.innerHTML = `<h6 class="mt-2 description" style="font-weight: bold;">
            <i class="mr-1 bi bi-mortarboard"></i>
            ${tutor.user.fullName}
        </h6>
        <h6 class="mt-2 description">
            <i class="mr-1 bi bi-book"></i>
            ${tutor.subject}
        </h6>
        <h6 class="mt-2 description">
            <i class="mr-1 bi bi-info-circle"></i>
            Trình độ: ${tutor.academicLevel}
        </h6>
        <h6 class="mt-2 description">
            <i class="mr-1 bi bi-geo-alt"></i>
            Địa chỉ: ${tutor.user.address}
        </h6>
        <h6 class="mt-2">
            <i class="mr-1 bi bi-star"></i>
            Lượt like: ${tutor.likeNumber}
        </h6>`;

        const cardHover__buttonBtn = document.createElement("div");
        cardHover__buttonBtn.setAttribute("class", "d-flex justify-content-center");
        
        const cardHover__button = document.createElement("button");
        cardHover__button.setAttribute("class", `card-tutor-button card-tutor-button-${tutor.tutorId}`);
        cardHover__button.innerText = "Xem các lớp";

        cardHover__buttonBtn.appendChild(cardHover__button);

        
        cardHover.appendChild(cardHover__title);
        cardHover.appendChild(cardHover__content);
        cardHover.appendChild(cardHover__buttonBtn);

        colClass.appendChild(cardHover);

        const btnViewTutorCLick = document.querySelector(`.card-tutor-button-${tutor.tutorId}`);
        btnViewTutorCLick.addEventListener("click", function(){
            window.location.href = `tutorDescription.html?ID=${tutor.tutorId}`;
        })

        });
    });

    const cardTutor = document.querySelector('.card-tutor');
    getOutstandingtutorOST((data) => {

        data.forEach((tutor, index) => {
            const colClass = document.createElement("div");
            colClass.setAttribute("class", "col-md-4");
            colClass.innerHTML = `
            <a href="tutor.html?ID=${tutor.tutorId}">
                <img src=http://localhost:8080/api/v1/Users/image/${tutor.user.userId} alt="" width="100%"
                height=80vh>
            </a>
            `;
            
            /*Tag */
            const colClass__tag = document.createElement("div");
            colClass__tag.setAttribute("class", "home-product-item__favourite");
            colClass__tag.innerHTML = `
             <span>Top ${index+1}</span>
             `;

            colClass.appendChild(colClass__tag);

            const colClass2 = document.createElement("div");
            colClass2.setAttribute("class", "col-md-8");
            colClass2.innerHTML = `
        <div class="card-body" style="font-size: 14px; margin-top: -24px; line-height: 2.4rem">

            <div class="description" style="font-weight: bold">
                <span>${tutor.user.fullName}</span>
            </div>
            <div class="author" style="font-size: 14px; color: #aaaaaa;">
                <i class="mr-1 bi bi-star-fill" style="color: #FCE22A"></i>
                <span >${tutor.likeNumber} like</span>
            </div>
            <div class="posted-day description" style="font-size: 14px; color: #aaaaaa;">
                <i class="mr-1 bi bi-book"></i>
                <span>${tutor.subject}</span>
            </div>
        </div>
            `;


            const card = document.createElement("div");
            card.setAttribute("class", "card mb-1");

            const rowCard = document.createElement("div");
            rowCard.setAttribute("class", "row no-gutters row-tutor__OST");
            rowCard.appendChild(colClass);
            rowCard.appendChild(colClass2);

            card.appendChild(rowCard);
            cardTutor.appendChild(card);

        });
    })
}
showOutstandingTutors();
