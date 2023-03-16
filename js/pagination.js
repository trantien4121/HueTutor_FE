function getPageList(totalPages, page, maxLength){
    function range(start, end){
        return Array.from(Array(end-start+1), (_, i) => i + start);
    }
    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 -3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if(totalPages <= maxLength){
        return range(1, totalPages);
    }

    if(page <= maxLength - sideWidth - 1 - rightWidth){
        return range(1, maxLength - sideWidth -1).concat(0, range(totalPages - sideWidth + 1, totalPages));

    }

    if(page >= totalPages - sideWidth - 1 - rightWidth){
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }

    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0 , range(totalPages - sideWidth + 1, totalPages));

    $(function(){
        var numberOfItems = 12;
        var limitPerPage = 6; //Số lượng gia sư hiển thị trên 1 page
        var totalPage = Math.ceil(numberOfItems / limitPerPage);
        var paginationSize = 2 //Số lượng trang
        var currentPAge;

        function showPage(whichPage){
            if(whichPage <1 || whichPage > totalPage) return false;
            currentPAge = whichPage;

            $(".card .card-tutor").hide().slice((currentPAge - 1) * limitPerPage, currentPAge*limitPerPage).show();

            $(".pagination-(custom li").slice(1, -1).remove();
            getPageList(totalPage, currentPAge, paginationSize).forEach(item =>{
                $("<li>").addClass("page-item-custom").addClass(item ? "current-page" : "dots")
                .toggleClass("active", item===currentPAge).append($("<a>").addClass("page-link-custom")
                .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page-custom")
            });

            $(".previous-page-custom").toggleClass("disable", currentPAge ===1);
            $(".next-page-custom").toggleClass("disable", currentPAge === totalPage);
            return true
        }

        $(".pagination-custom").append(
            $("<li>").addClass("page-item-custom").addClass("previous-page-custom").append($("<a>").addClass("page-link-custom").attr({href: "javscript:void(0)"}).text("Prev")),
            $("<li>").addClass("page-item-custom").addClass("next-page-custom").append($("<a>").addClass("page-link-custom").attr({href: "javscript:void(0)"}).text("Next")),
        );

        $(".card").show();
        showPage(1);

        $(document).on("click", ".pagination-custom li.current-page:not(.active)", function(){
            return showPage(+$(this).text());
        });

        $("next-page-custom").on("click", function(){
            return showPage(currentPAge + 1);
        });
        $("previous-page-custom").on("click", function(){
            return showPage(currentPAge - 1);
        });
    });

}