//Chỉ hiển thị 6 gia sư
const apiBlogs = ` http://localhost:8080/api/v1/Advertisements`;
const apiBlogsOST = `http://localhost:8080/api/v1/Advertisements/getAdvertisementPaging?pageNo=0&pageSize=3&sortBy=advertisementId`;

const getOutstandingblog = (callback) => {
    fetch(apiBlogs)
        .then((response) => {
            return response.json();
        })
        .then(callback);
};
const getOutstandingblogOST = (callback) => {
    fetch(apiBlogsOST)
        .then((response) => {
            return response.json();
        })
        .then(callback);
};

function convertDate(day){
    const d = new Date(day);
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Sartuday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const postedWeekDay = weekDays[d.getDay()];
    const postedMonth = months[d.getMonth()];
    const postedDay = d.getDate();
    const postedYear = d.getFullYear();
    return `${postedWeekDay}, ${postedMonth} ${postedDay}, ${postedYear}`;
};

function showOutstandingBlogs() {

    const row = document.querySelector('.row-blog');
    getOutstandingblog((data) => {

        data.forEach(blog => {

            const colClass = document.createElement("div");
            colClass.setAttribute("class", "col-lg-4 col-md-12 col-sm-12");
            colClass.innerHTML = `
            <a href="tutor.html?ID=${blog.advertisementId}">
                <img src=http://localhost:8080/api/v1/Advertisements/image/${blog.advertisementId} alt="" width="100%"
                height=120vh>
            </a>
            `;

            const colClass2 = document.createElement("div");
            colClass2.setAttribute("class", "col-lg-8 col-md-12 col-sm-12");
            colClass2.innerHTML = `
        <div class="card-body" style="font-size: 18px; margin-top: -14px; line-height: 2rem; padding-top: 1rem">
            <div class="description" style="font-weight: bold;">
                <span>${blog.title}</span>
            </div>
            <span style="font-size: 14px; color: #656565">${blog.content}</span>
            <div class="mt-1 d-flex" style="font-size: 12px; color: #aaaaaa">
                <div class="author">
                    <i class="bi bi-person"></i>
                    <span>${blog.user.fullName}</span>
                </div>
                <div class="posted-day ml-3">
                    <i class="bi bi-clock"></i>
                    <span>${convertDate(blog.postedDay)}</span>
                </div>
            </div>
        </div>
            `;


            const card = document.createElement("div");
            card.setAttribute("class", "card mt-1 mb-1");

            const rowCard = document.createElement("div");
            rowCard.setAttribute("class", "row no-gutters row-blog__OST");
            rowCard.appendChild(colClass);
            rowCard.appendChild(colClass2);

            card.appendChild(rowCard);
            row.appendChild(card);

        });
    });

    const cardBlog = document.querySelector('.card-blog');
    getOutstandingblogOST((data) => {

        data.forEach(blog => {
            const colClass = document.createElement("div");
            colClass.setAttribute("class", "col-md-5");
            colClass.innerHTML = `
            <a href="tutor.html?ID=${blog.advertisementId}">
                <img src=http://localhost:8080/api/v1/Advertisements/image/${blog.advertisementId} alt="" width="100%"
                height=100px>
            </a>
            `;

            /*Tag */
            const colClass__tag = document.createElement("div");
            colClass__tag.setAttribute("class", "home-product-item__favourite");
            colClass__tag.innerHTML = `
             <i class="bi bi-check"></i>
             <span>News</span>
             `;

            colClass.appendChild(colClass__tag);

            const colClass2 = document.createElement("div");
            colClass2.setAttribute("class", "col-md-7");
            colClass2.innerHTML = `
        <div class="card-body" style="font-size: 14px; margin-top: -36px; line-height: 24px; padding-top: 2rem">
            <div style="font-weight: bold">
                <span>${blog.title}</span>
            </div>
            <div class="author" style="font-size: 12px; color: #aaaaaa;">
                <i class="bi bi-person"></i>
                <span >${blog.user.fullName}</span>
            </div>
            <div class="posted-day" style="font-size: 12px; color: #aaaaaa;">
                <i class="bi bi-clock"></i>
                <span>${convertDate(blog.postedDay)}</span>
            </div>
        </div>
            `;


            const card = document.createElement("div");
            card.setAttribute("class", "card mb-3");

            const rowCard = document.createElement("div");
            rowCard.setAttribute("class", "row no-gutters row-blog__OST");
            rowCard.appendChild(colClass);
            rowCard.appendChild(colClass2);

            card.appendChild(rowCard);
            cardBlog.appendChild(card);

        });
    })
}
showOutstandingBlogs();
