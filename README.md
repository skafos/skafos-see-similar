# skafos-see-similar
Reference Implementation for See-Similar on Shopify

Go to Online Store -> Themes -> the theme you want to edit -> Actions -> Edit Code and implement the following changes to your collection pages for the see-similar feature to work:
1. Find the liquid file that populates products in your collections and add a class `skafosSimilarProductTemplate` to the product item template within the collection products list. This code could look something like this:
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_1.png?v=1629717539)


2. Add following code as a direct child of the `skafosSimilarProductTemplate` element:
```
<div onclick="skafosSeeSimilar(this)" data-skafos-product-id="{{product.id}}" data-skafos-collection-id="{{collection.id}}" class="seeSimilarContainer">
  <img class="skafosIconOutline" src="https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Skafos-logo-small-bw-12x12.svg?v=1628762198">

  <img class="skafosIconFull" src="https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Skafos-logo-small-color-12x12.svg?v=1628762198">

  <div class="skafosIconCompleted">
      <img src="https://cdn.shopify.com/s/files/1/0514/3766/6459/files/checkmark.svg?v=1628762198">
  </div>

  <div class="animationText">
      <span>&nbsp;&nbsp;</span>
      <span data-seesimilartextinit>See Similar</span>
      <span data-seesimilartextstarted>Finding Items...</span>
  </div>
</div>

```
This code could look something like this:
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_2_9d7edac1-7374-4e06-a437-97907ab84cb8.png?v=1629717886)


3. Add the following data attributes to all the dynamic HTML elements within the skafosSimilarProductTemplate that renders title, images, and price:
  - `data-skafos-similar-title` : Title
  - `data-skafos-similar-image` : Image 
  - `data-skafos-similar-price` : Price
The code could look something like these:
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_3.png?v=1629717969)
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_3.1.png?v=1629718096)
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_3.2.png?v=1629718096)

 
4. Add following css after the opening `<body>` tag of the theme.liquid file: 
```
 <style>
      .skafosSimilarProductTemplate{
        position:relative;
      }
      .seeSimilarContainer{
        box-shadow: 1px 1px 4px 0px rgba(15, 15, 15, 0.15), -1px -1px 4px 0px rgba(15, 15, 15, 0.15);
        border-radius: 25px;
        padding: 5px;
        background:white;
        min-height: 35px;
        min-width: 35px;
        cursor: pointer;
        overflow: hidden;
        transition: box-shadow 2s ease-in-out,border-radius 2s ease-in-out;
        position:absolute;
        top:10px;
        right:10px;
        z-index:100;
        display: inline-flex;
        vertical-align: middle;
        align-items: center;
        
      }
      .seeSimilarContainer:hover{
      	box-shadow: 3px 3px 12px 0px rgba(15, 15, 15, 0.25), -3px -3px 12px 0px rgba(15, 15, 15, 0.25);
		}
        .seeSimilarContainer[data-see-similar-started]{
        	box-shadow: 1px 1px 4px 0px rgba(15, 15, 15, 0.15), -1px -1px 4px 0px rgba(15, 15, 15, 0.15);
        }
      .seeSimilarContainer[data-see-similar-completed]{
      		background-color:#50CB93;
        	box-shadow: 3px 3px 12px 0px rgba(80, 203, 147, 0.15), -3px -3px 12px 0px rgba(80, 203, 147, 0.25);
      }
      .seeSimilarContainer[data-see-similar-completed-final]{
        	box-shadow: 1px 1px 4px 0px rgba(15, 15, 15, 0.15), -1px -1px 4px 0px rgba(15, 15, 15, 0.15);
      }
      .seeSimilarContainer .skafosIconOutline{
        display:inline;
        width:20px;
        height:20px;
        padding-left: 2px;
      }
      .seeSimilarContainer .skafosIconFull{
        display:none;
        width:20px;
        height:20px;
      }
      .seeSimilarContainer .animationText{
        white-space: nowrap;
        display:inline;
        max-width:0px;
        opacity:0;
        font-size: 12px;
    	color: #202223;
        transition: max-width .5s ease-in-out,width .5s ease-in-out,opacity .5s ease-in-out
      }
      .seeSimilarContainer[data-see-similar-completed] .animationText{
      	color:white;
        transition: max-width 3s ease-in-out,width 3s ease-in-out,opacity 3s ease-in-out
		}
      
      .seeSimilarContainer [data-seesimilartextinit]{
        display:inline;
      }
      .seeSimilarContainer [data-seesimilartextstarted]{
        display:none;
      }
      
      .seeSimilarContainer[data-see-similar-started] [data-seesimilartextinit]{
        display:none;
      }
      .seeSimilarContainer[data-see-similar-started] [data-seesimilartextstarted]{
        display:inline;
      }
      
      .seeSimilarContainer:hover .skafosIconOutline, .seeSimilarContainer[data-see-similar-started] .skafosIconOutline{
        display:none;
      }
      .seeSimilarContainer:hover .skafosIconFull, .seeSimilarContainer[data-see-similar-started] .skafosIconFull{
        display:inline;
      }
      .seeSimilarContainer:hover .animationText, .seeSimilarContainer[data-see-similar-started] .animationText{
        opacity:1;
        max-width:10.5rem;
      }
      
      .skafosIconCompleted{
        display:none;
        box-sizing: border-box;
        border-radius: 10px;
        width: 20px;
        height: 20px;
      }
      .skafosIconCompleted img{
        width:20px;
        height:16px;
      }
      
      
      .seeSimilarContainer[data-see-similar-completed] [data-seesimilartextinit],
      .seeSimilarContainer[data-see-similar-completed] .skafosIconOutline,
      .seeSimilarContainer[data-see-similar-completed] .skafosIconFull{
        display:none;
        font-size: 10px;
        line-height: 12px;
      }
      
      .seeSimilarContainer[data-see-similar-completed] .skafosIconCompleted{
        display: inline-flex;
    	align-items: center;
        margin:auto;
      }
      
      
      .seeSimilarContainer[data-see-similar-completed] .animationText{
        opacity:0;
        max-width:0px;
      }
 </style>
```

5. Add the following code before the closing `</body>` tag in the theme.liquid file:
```
<script>
window.skafosShopId={{shop.id}}

var skafosTemplate = document.querySelector('.skafosSimilarProductTemplate').cloneNode(true);


async function skafosSeeSimilar(e){
  if(e.dataset.seeSimilarCompleted) return;
  e.dataset.seeSimilarStarted="true";
  const data={
     "productID":"gid://shopify/Product/"+e.dataset.skafosProductId,
     "collectionID":"gid://shopify/Collection/"+e.dataset.skafosCollectionId,
     "count":5,
     "shopID": "gid://shopify/Shop/"+window.skafosShopId
     }
  const rawResponse = await fetch('https://api.skafos.ai/v1/products/similar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  const content = await rawResponse.json();
  var html=``;
  
  var similarProducts = [];
  
  for(var i=0;i<content.result.similarProducts.length;i++){
    var item=content.result.similarProducts[i];
    var similarProduct = skafosTemplate.cloneNode(true);
    similarProduct.querySelector("[data-skafos-product-id]").dataset.skafosProductId=item.id.split('/').pop();
    var links = similarProduct.querySelectorAll("[data-skafos-similar-link]");
    links.forEach((link) => {
      link.href = item.pdp_url;
    });
    var titles = similarProduct.querySelectorAll("[data-skafos-similar-title]");
    titles.forEach((title) => {
      title.innerHTML = item.name;
    });
    var images = similarProduct.querySelectorAll("[data-skafos-similar-image]");
    images.forEach((image) => {
      image.src = item.image_url;
      image.srcset = item.image_url;
      image.dataset.src = item.image_url;
      image.dataset.srcset = item.image_url;
    });
    var prices = similarProduct.querySelectorAll("[data-skafos-similar-price]");
    prices.forEach((price) => {
      price.innerHTML = "$" + item.min_price;
    });
    similarProducts.push(similarProduct);
  }
  
  for(var i=similarProducts.length-1;i>=0;i--){
    e.parentNode.parentNode.insertBefore(similarProducts[i], e.parentNode.nextSibling);
  }
  
  e.querySelector('[data-seesimilartextstarted]').innerHTML='Items Found!';
  e.dataset.seeSimilarCompleted=true;
  setTimeout(function (){
   e.dataset.seeSimilarCompletedFinal=true;
  },3000)

}
</script>
```

The above code will fetch the data from our api and show the similar products on your collection's page. If you have complex requirements on the product item on the collection grid, like if you want to show variant swatches etc, then you need to alter the `skafosSeeSimilar` function above to modify the product template before it gets added to the `similarProducts` array. The `item` object in the above `for` loop will have the following info for you to work with: 
```
{
description: "PRODUCT'S_DESCRIPTION"
id: "gid://shopify/Product/<PRODUCT_ID>"
image_filename: "<PRODUCT_IMAGE_FILE_NAME>.jpg"
image_url: "COMPLETE_PRODUCT_IMAGE_URL"
max_price: "MAX_PRODUCT_PRICE"
metadata: {image_text: null, image_id: "gid://shopify/ProductImage/<IMAGE_ID>", product_type: "PRODUCT_TYPE", total_variants: 1, has_only_default_variant: true, …}
min_price: "MIN_PRODUCT_PRICE"
name: "PRODUCT_NAME"
pdp_url: "PRODUCT_PAGE_URL"
solution_version: "SKAFOS_SOLUTION_VERSION"
tags: (7) [ARRAY_OF_PRODUCT_TAGS]
}
```
You can use the above object to modify the contents of the template before it gets added to the `similarProducts` array, which is used to add similar products to the collection's products grid. 
