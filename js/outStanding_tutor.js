const apiTutors = `http://localhost:8080/api/v1/Tutors`;
const getOutstandingtutor = (callback) => {
    fetch(apiTutors)
        .then((response) => {
            return response.json();
        })
        .then(callback);
};

function showOutstandingTutors() {
    // const tutorList = document.querySelector('.outstanding-tutor__list');

    const row = document.querySelector('.row-tutor');
    getOutstandingtutor((data) => {

        data.forEach(tutor => {
            // console.log(tutor.user.fullName);
            // const li = document.createElement("li");
            // li.setAttribute("class", "outstanding-tutor-item");
            // tutorList.appendChild(li);
            // li.innerHTML = `<i class="mr-2 bi bi-caret-right"></i>${tutor.user.fullName}`;

            const colClass = document.createElement("div");
            colClass.setAttribute("class", "col-lg-4 col-md-6 col-sm-12 pt-3 pb-3");
            // colClass.innerHTML = `${tutor.user.fullName}`;
            // colClass.innerHTML = `<img src=http://localhost:8080/api/v1/Users/image/${tutor.user.userId} style=
            // "width: 100%"></img>`;
            colClass.innerHTML = `
            <a href="tutor.html?ID=${tutor.tutorId}">
                <img src=http://localhost:8080/api/v1/Users/image/${tutor.user.userId} alt="" width="100%"
                height="300px">
            </a>
            <div style="border-bottom-radius: 20px; background-color: #2c6dd5; padding: 10px 50px; color: white">
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
        });
    })
}
showOutstandingTutors();
