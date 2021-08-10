# skafos-see-similar
Reference Implementation of See-Similar on Shopify

Implement the following changes to your collection pages for the see similar feature to work:
1. Add a class `skafosSimilarProductTemplate` to the product item template withing the collection products list.

2. Add following code within the template's starting div:
```
<div onclick="skafosSeeSimilar(this)" data-skafos-product-id="{{product.id}}" data-skafos-collection-id="{{collection.id}}" class="seeSimilarContainer">
              
  <img class="skafosIconOutline" src="https://cdn.shopify.com/s/files/1/0514/3766/6459/files/skafos-logo-black-8x8.svg?v=1628099441">

  <img class="skafosIconFull" src="https://cdn.shopify.com/s/files/1/0514/3766/6459/files/skafos-logo-color-8x8.svg?v=1628099441">

  <div class="skafosIconCompleted">
    <img src="https://cdn.shopify.com/s/files/1/0514/3766/6459/files/small-tick-8x8.svg?v=1628099441">
  </div>

  <div class="animationText">
    <span>&nbsp;&nbsp;</span>
    <span data-seesimilartextinit>See Similar</span>
    <span data-seesimilartextstarted>Finding Items...</span>
  </div>
</div>

```

3. Add the following data attributes to all the elements within the template which are dynamic like title, images etc:
  - `data-skafos-similar-title` : Title
  - `data-skafos-similar-image` : Image 
  - `data-skafos-similar-price` : Price
 
4. Add following css to either your collection template or your theme's global css file: 
```
 <style>
      .skafosSimilarProductTemplate{
        position:relative;
      }
      .seeSimilarContainer{
        box-shadow: 1px 1px 4px rgb(0 0 0 / 14%), -1px -1px 4px rgb(0 0 0 / 14%);
        border-radius: 25px;
        padding: 5px;
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
        font-size: 10px;
        transition: max-width .5s ease-in-out,width .5s ease-in-out,opacity .5s ease-in-out
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
        max-width:7.5rem;
      }
      
      .skafosIconCompleted{
        display:none;
        background: rgba(255, 255, 255, 0.75);
        border: 2px solid #43AD5A;
        box-sizing: border-box;
        box-shadow: 1px 1px 4px rgba(15, 15, 15, 0.15), -1px -1px 4px rgba(15, 15, 15, 0.15);
        border-radius: 10px;
        width:20px;
        height:20px;
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
        display:inline;
      }
      
      
      .seeSimilarContainer[data-see-similar-completed] .animationText{
        opacity:0;
        max-width:0px;
      }
      .seeSimilarContainer[data-see-similar-completed]{
        box-shadow: none;
		    border-radius: 0px;	
      }
 </style>
```

5. Add `<script>window.skafosShopId={{shop.id}}</script>` before the closing `</body>` tag of theme.liquid file
6. Add Below code to either your theme's global script file or create a new script file and add that to the theme.liquid file:
```
var scafosTemplate = document.querySelector('.skafosSimilarProductTemplate').cloneNode(true);


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
    var similarProduct = scafosTemplate.cloneNode(true);
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

}
```

The above code will fetch the data from our api and show the similar products on your collections page. If you have complex requirements on the product item on the collection grid, like if you want to show variant swatches etc, then you need to alter the `skafosSeeSimilar` function above to modify the product template before it gets added to the `similarProducts` array. The `item` object in the above for loop will have the following info for you to work with: 
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
You can use the above object to modify the contents of the template before it gets added to the `similarProducts` array. 
