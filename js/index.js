let html=document.querySelector("html"),
    carouselNextBtn=document.querySelector(".sc-carousel .next"),
    carouselPrevBtn=document.querySelector(".sc-carousel .prev"),
    navLinks=document.querySelectorAll("nav .nav-link"),
    navbarEle=document.querySelector("nav")
    heightOfNavbar=navbarEle.clientHeight,
    loadingPageEle=document.querySelector(".loadingPage"),
    correctImgs=document.querySelectorAll(".correctImg"),
    popupoBoxes=document.querySelectorAll(".popup .box"),
    cartProducts=[];

if(localStorage.getItem("cartProducts") != null){
    cartProducts =JSON.parse(localStorage.getItem("cartProducts"));
}
else{
    //localStorage.setItem("cartProducts",JSON.stringify(cartProducts));
    updateLocalStorage();
}


window.addEventListener("DOMContentLoaded", function(){
    let currentSlide=document.querySelector(".sc-carousel .sc-carousel-item.active");
    currentSlide.classList.add("show");
    loadingPageEle.classList.add("hide");

    setTimeout(function() {
        loadingPageEle.classList.add("d-none");
    },1000)

})


carouselNextBtn.addEventListener("click",function(){
    let currentSlide=document.querySelector(".sc-carousel .sc-carousel-item.active"),
        nextSlide=currentSlide.nextElementSibling ?? document.querySelector(".sc-carousel .sc-carousel-item:first-child"),
        currentColorName=nextSlide.dataset.colorName;
        

    currentSlide.classList.remove("active","show");
    nextSlide.classList.add("active","show");
    changeMainColor(currentColorName);
});

carouselPrevBtn.addEventListener("click",function(){
    let currentSlide=document.querySelector(".sc-carousel .sc-carousel-item.active"),
        prevSlide=currentSlide.previousElementSibling ?? document.querySelector(".sc-carousel .sc-carousel-item:last-child");
        currentColorName=prevSlide.dataset.colorName;

    currentSlide.classList.remove("active","show");
    prevSlide.classList.add("active","show");
    changeMainColor(currentColorName);
});

navLinks.forEach( function(navLink){
    navLink.addEventListener("click",function(e){
        e.preventDefault();
        
        let currentNavLink=document.querySelector("nav .nav-item.active"),
            idOfCurrentSection=navLink.getAttribute("href"),
            currentSection=document.querySelector(`${idOfCurrentSection}`),
            currentSectionTop=currentSection.offsetTop - heightOfNavbar;
        
        window.scrollTo({
            top:currentSectionTop,
            left:0
        });
            
        
            

        //currentNavLink.classList.remove("active");
        //navLink.parentElement.classList.add("active");
    });

});
window.addEventListener("scroll",function(){
    let topOfWindow = window.scrollY + heightOfNavbar,
        sectionNames = ["Home","Latest","Featured"]; 


    for(let sectionName of sectionNames){
        let section = document.querySelector(`#${sectionName}`),
            sectionId = section.id,
            topOfSection = section.offsetTop,
            bottomOfSection = section.offsetTop + section.clientHeight;


        if(topOfWindow >= topOfSection && topOfWindow <= bottomOfSection){
            let newNavLink = document.querySelector(`nav .nav-link[href="#${sectionId}"]`).parentElement,
                oldNavLink = document.querySelector(`nav .nav-item.active`);
            oldNavLink.classList.remove("active");
            newNavLink.classList.add("active");
        }
    }

    if(topOfWindow >=1){
        navbarEle.classList.add("scrolled");

    }
    else{
        navbarEle.classList.remove("scrolled");
    }
});


popupoBoxes.forEach(function (popupBox) {
    popupBox.addEventListener("click",function(e){
        e.stopPropagation();

    })

});
latest.forEach(function (product) {
    let isProductIntoCart = cartProducts.filter((item) => {return item.id == product.id;})[0];
    console.log(isProductIntoCart);
    


    document.querySelector("#Latest .products").innerHTML += `

            <div class="product mb-3" data-product-id="${product.id}" 
            data-selected-size="${(isProductIntoCart == undefined) ? product.sizes[0] : isProductIntoCart.size}" 
            data-selected-color="${(isProductIntoCart == undefined) ? product.colors[0] : isProductIntoCart.color}">
                    <div class="row">
                        <div class="col-lg-6 part1">
                            <div class="item">
                                <div class="row">
                                    <div class="col-xl-2 col-md-2 col-lg-3 ">
                                        <div class="item">
                                            <ul type="none" class="listImages p-0 m-0">
                                                ${prepareImages(product.images)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-xl-10 col-md-10 col-lg-9 ">
                                        <div class="item selectedImg">
                                            <img src="nike_images/products/${product.images[0]}" alt="" class="img-fluid ">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 part2">
                            <div class="item">
                                <h2 class="mainColor">${product.name}</h2>
                                <p>${product.description}</p>
                                <div class="specialRow my-2">
                                    <strong class="me-1">Price:</strong>
                                    ${preparePrice(product.price,product.discount)}
                                </div>
                                <div class="specialRow sizes">
                                    <strong class="me-1">Size :</strong>
                                    <ul type="none" class="d-inline-flex p-0 ">
                                        ${prepareSizes(product.sizes, isProductIntoCart)}
                                    
                                    </ul>
                                
                                    </div>
                                    ${
                                    (isProductIntoCart == undefined)? 
                                    `<button class="btn  mainButton rounded-2  " onclick="addToCart(this, ${product.id})">AddToCart</button>`
                                    :`<button class="btn  mainButton rounded-2 remove  " onclick="removeFromCart(this, ${product.id})">Remove From Cart</button>`
                                                    
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>`;

});

features.forEach(function (product){
    let elements=``;
    for(let i = 0;i < product.images.length; i++){
        elements+=`
        <li
        onclick="changeActive(this); changeSelectedImg(this);"  
        src="nike_images/products/${product.images[i]}" 
        class=" ${(i != product.images.length-1 ?'me-2':'')} rounded-circle mainBorder ${(i==0) ? "active":""} "></li>`;
    }

    



    document.querySelector("#Featured .row").innerHTML +=`
        <div class="col-lg-3 col-md-6 step mb-3 ">
            <div class="item bg-light px-3 py-4 text-center rounded-3 product">
                <p class="${(product.discount==0)?'d-none' : ''}">${product.discount *100}%</p>
                <div class="selectedImg">
                <img src="nike_images/products/${product.images[0]}" alt="" class="img-fluid">
                </div>
                
                <i class="fa-solid fa-magnifying-glass" onclick="showProuductIntoPopup(${product.id}); openPopup('product');"></i>
                <ul type="none" class="d-flex p-0 justify-content-center ">
                    ${elements}
                </ul>
                <h6>${product.name}</h6>
                <div class="specialRow Price">
                    ${preparePrice(product.price,product.discount)}

                    
                </div>
                
            </div>
        </div>

    `;

            


});

