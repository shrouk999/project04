function changeMainColor(colorName){
    let valueOfCurrentColor=getComputedStyle(html).getPropertyValue(colorName);
    changeImg(colorName,Logo,"logo");
    changeImg(colorName,Icon,"Icon");



    correctImgs.forEach(function(correctImg){
        changeImg(colorName,correctImg,"correct");
    })
    
    html.style.setProperty("--main-color",valueOfCurrentColor);
}
function changeImg(colorName,imgEle,commonName){
    let currentName = colorName.split("-")[2],
        attr,
        currentSrcArr;
        
    if(imgEle.src == undefined){
        attr ="href";
    }
    else{
        attr ="src";
    }
    currentSrcArr = imgEle[attr].split("/");
        
    currentSrcArr[currentSrcArr.length - 1]= `${currentName}-${commonName}.png`;
    

    imgEle[attr] = currentSrcArr.join("/");

}

function openPopup(popupName){
    let currentPopup=document.querySelector(`.popup[data-popup-name="${popupName}`);
    currentPopup.classList.add("active")

    setTimeout(function () {
        currentPopup.classList.add("show");
        currentPopup.querySelector(".box").classList.add("show");
    },1);

    if(popupName == "shop"){
        let rowOfCurrentPopup = currentPopup.querySelector(".row");
        rowOfCurrentPopup.innerHTML = "";
        cartProducts.forEach(function(cartProduct){
            let product = getProuduct(cartProduct.id);

            rowOfCurrentPopup.innerHTML += `
            <div class="col-lg-4 col-md-4 col-sm-6 text-start">
                <div class="item bg-light rounded-3 p-2 mb-3">
                    <img src="nike_images/products/${product.images[0]}" alt="" class="img-fluid">
                    <h5>${product.name.slice(0,15)}...</h5>
                    <div class="specialRow">
                        <stron class="me-2">Price :</stron>
                        ${preparePrice(product.price, product.discount)}
                    </div>
                    <div class="specialRow sizes">
                        <strong class="me-1">Size :</strong>
                        <ul type="none" class="d-inline-flex p-0 ">
                            <li class="me-3 mainBorder rounded-2 active"
                            >${cartProduct.size}</li>
                        </ul>
                    </div>
                    <div class="specialRow colors">
                        <strong class="me-2">Colors :</strong>
                        <ul type="none" class="d-inline-flex p-0">
                            <li class="me-2 rounded-circle active"
                            
                            style="background-color: ${cartProduct.color};"></li>
                        </ul>
                    </div>

                </div>
            </div>
            `;
        })
    }
}
function closePopup(popupName){
    let currentPopup=document.querySelector(`.popup[data-popup-name="${popupName}`);
    currentPopup.querySelector(".box").classList.remove("show");
    setTimeout(function(){
        currentPopup.classList.remove("show");

        setTimeout(function () {
            currentPopup.classList.remove("active");
        },1000)

    },500)
    
}
function parents(element , parentSelector = null){
    let result = element;
    
    while(true){
        result = result.parentElement;
        if(result.classList.contains("product")){
            break;
        }
        
    }
    if(parentSelector == null){
        return result;
    }
    else{

        return result.querySelector(parentSelector);
    }
    
    
}
function changeSelectedImg(that){
    //console.log(that.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(".selectedImg"));
    let selectedImgEle = parents(that,".selectedImg img");
    selectedImgEle.src = that.getAttribute("src");
}
function changeActive(that){
    let currentElementActive = that.parentElement.querySelector(".active");
    currentElementActive.classList.remove("active");
    that.classList.add("active");
}
function preparePrice(price,discount){
    return`
    <span class="OldPrice text-danger me-1 text-decoration-line-through ${(discount == 0) ?"d-none" : ""}">${price.toFixed(2)}<sup>$</sup></span>
    <span class="newPrice">${((price * (1 - discount)).toFixed(2))}<sup>$</sup></span>
    `;
}
function getProuduct(productId){
    return products.filter((product) => {return product.id == productId})[0];

}
function showProuductIntoPopup(productId){
    let product = getProuduct(productId),
        boxOfProductPopup = document.querySelector(".popup[data-popup-name='product'] .box");
    let isProductIntoCart = cartProducts.filter((item) => {return item.id == product.id;})[0];
    boxOfProductPopup.innerHTML = `
    <div class="row product" data-product-id="${product.id}"
    data-selected-size="${(isProductIntoCart == undefined) ? product.sizes[0] : isProductIntoCart.size}" 
    data-selected-color="${(isProductIntoCart == undefined) ? product.colors[0] : isProductIntoCart.color}">
        <div class="col-lg-6 col-md-6">
            <div class="item">
                <div class="selectedImg">
                    <img src="nike_images//products/${product.images[0]}" alt="" class="img-fluid">
                </div>
                <div class="listImages">
                    <ul type="none" class="d-flex p-0">
                        ${prepareImages(product.images)}
                        
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 col-md-6 text-start">
            <div class="item">
                <h3>${product.name}</h3>
                ${preparePrice(product.price, product.discount)}
                <hr>
                <p>${product.description}</p>
                <div class="specialRow sizes">
                    <strong class="me-1">Size :</strong>
                    <ul type="none" class="d-inline-flex p-0 ">
                        ${prepareSizes(product.sizes,isProductIntoCart)}
                                    
                    </ul>
                </div>
                <div class="specialRow colors">
                    <strong class="me-1">Colors :</strong>
                    <ul type="none" class="d-inline-flex p-0 ">
                        ${prepareColors(product.colors, isProductIntoCart)}
                                    
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
        `;

        
}

function prepareImages(images){
    let imagesHTML=``;
        

    for(let i = 0; i<images.length;i++){
        imagesHTML += `
        <li class="mb-2"><img src="nike_images/products/${images[i]}" alt="" class="img-fluid  active " onclick="changeSelectedImg(this)"></li>

        `;
    }
    return imagesHTML;
}

function prepareSizes(sizes, isProductIntoCart){
    let sizesHTML=``;
        

    for(let i = 0; i<sizes.length;i++){
        if(isProductIntoCart == undefined){
            sizesHTML += `
            <li
            class="${(i != sizes.length-1) ? "me-3" : ""} mainBorder rounded-2 ${(i==0) ? "active":""}" 
            onclick="changeActive(this); updateSize(this,'${sizes[i]}')">${sizes[i]}</li>
        

            `;

        }
        else{
            sizesHTML += `
            <li
            class="${(i != sizes.length-1) ? "me-3" : ""} mainBorder rounded-2 ${(sizes[i] == isProductIntoCart.size) ? "active":""}" 
            onclick="changeActive(this); updateSize(this,'${sizes[i]}')">${sizes[i]}</li>
        

            `;

        }
        
    }
    return sizesHTML;
}
function prepareColors(colors){
    let colorsHTML=``;
        

    for(let i = 0; i<colors.length;i++){
        colorsHTML += `
        <li
        class="${i==0 ? 'active' : ''} rounded-circle ${(i != colors.length-1) ? "me-2" : "" } "
        onclick="changeActive(this); updateColor(this, '${colors[i]}')"
        style="background-color : ${colors[i]}"
        ></li>
        

        `;
    }
    return colorsHTML;
}
function updateSize(that, size){
    let parentEle = parents(that);
    parentEle.setAttribute("data-selected-size", size)
}
 function updateColor(that, color){
    let parentEle = parents(that);
    parentEle.setAttribute("data-selected-color", color)
}
function addToCart(that,productId){
    let product = getProuduct(productId),
        productEle = document.querySelector(`.product[data-product-id="${product.id}"]`),
        selectedSize = productEle.getAttribute("data-selected-size"),
        selectedColor = productEle.getAttribute("data-selected-color"),
        cartProduct = {
            id :product.id,
            size :selectedSize,
            color :selectedColor
        };

    cartProducts.push(cartProduct);
    toggleCartButton(that, "remove");
    that.setAttribute("onclick",`removeFromCart(this,${productId})`);
    updateLocalStorage();
}
function removeFromCart(that,productId){
    cartProducts = cartProducts.filter((item) => {return item.id !=productId;});
    let productEle = document.querySelector(`.product[data-product-id="${productId}"]`),
        firstLiEle = productEle.querySelector(".sizes li:first-child");
    
    toggleCartButton(that, "add");

    that.setAttribute("onclick",`addToCart(this,${productId})`);
    updateLocalStorage();
    changeActive(firstLiEle);
    
    updateSize(firstLiEle, firstLiEle.textContent.trim());
    
}

function toggleCartButton(btn, status){
    if(status =="add"){
        btn.textContent ="Add To Cart";
        btn.classList.remove("remove");
        
        
    }
    else if(status == "remove"){
        btn.textContent = "Remove From Cart";
        btn.classList.add("remove");
    }
}


function updateLocalStorage(){
    localStorage.setItem("cartProducts",JSON.stringify(cartProducts));

}