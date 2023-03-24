
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// var currentPage = urlParams.get('pageNo')==null ? Number(1): Number(urlParams.get('pageNo'));
// const totalPage = 3;

// console.log("Trang hiện tại là", currentPage);

// const prePageEle = document.querySelector('.home-filter-prePage');
// const nextPageEle = document.querySelector('.home-filter-nextPage');
// const currentPageEle = document.querySelector('.home-filter__page-current');

// currentPageEle.innerText = currentPage;

// if(currentPage < 2){
//     prePageEle.classList.add("home-filter__page-btn--disable");
// } else{
//     prePageEle.classList.remove("home-filter__page-btn--disable");
//     prePageEle.href = `?pageNo=${currentPage - 1}`;
// }

// if(currentPage < totalPage){
//     nextPageEle.href = `?pageNo=${currentPage + 1}`;
//     nextPageEle.classList.remove("home-filter__page-btn--disable");
// }else{
//     nextPageEle.classList.add("home-filter__page-btn--disable");
// }

let btnFilterList = document.querySelectorAll('.home-filter__btn');
console.log(btnFilterList);

btnFilterList.forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();

    document.querySelector(".home-filter__btn.home-filter__btn--active").classList.remove("home-filter__btn--active");
    btn.classList.add("home-filter__btn--active");
}));

//hiển thị các element theo trạng thái
// function hideElement(statusClassIcon){
//     var listFilterEle = [];
//     var listChildFilterEle = document.querySelectorAll('.bi-circle-fill.icon-filter');
//     listChildFilterEle.forEach(child => {
//         if(child.classList.contains(statusClassIcon))
//             listFilterEle.push(child.parentElement.parentElement.parentElement.parentElement);
//     });

//     return listFilterEle;
// }

// console.log(hideElement("icon-filter-green"));

