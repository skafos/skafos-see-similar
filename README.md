# Reference Implementation for See-Similar on Shopify

## Adding Integration Points To Your Theme

Go to Online Store -> Themes -> the theme you want to edit -> Actions -> Edit Code and implement the following changes to your liquid files:
### Collections Page

Find the liquid file that populates products in your collections and the following items to the to the product item template within the collection products list. 

1. A Custom class - `skafosSimilarProductTemplate`
2. The Product id
3. The Collection id

This code could look something like this:
```
          {%- for product in collection.products -%}
            <li class="grid__item skafosSimilarProductTemplate" data-skafos-product-id="{{product.id}}data-skafos-collection-id="{{collection.id}}">
              {% render 'product-card',
                product_card_product: product,
                media_size: section.settings.image_ratio,
                show_secondary_image: section.settings.show_secondary_image,
                add_image_padding: section.settings.add_image_padding,
                show_vendor: section.settings.show_vendor
              %}
            </li>
          {%- endfor -%}
```

### Product Card

Add the following data attributes to all the dynamic HTML elements within the skafosSimilarProductTemplate that render title, images, and price:
  - `data-skafos-similar-title` : Title
  - `data-skafos-similar-image` : Image 
  - `data-skafos-similar-price` : Price
The code could look something like the following examples. Note: There might be multiple locations where you need to insert those attributes and they might be spread across multiple liquid files
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_3.png?v=1629717969)
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_3.1.png?v=1629718096)
![](https://cdn.shopify.com/s/files/1/0514/3766/6459/files/Step_3.2.png?v=1629718096)


## Adding the Code 
Add the following code before the closing `</body>` tag in the theme.liquid file:
```html
<script type="module">
    window.skafosShopId={{shop.id}}
    import { skafosSeeSimilar } from 'http://hosted.skafos.ai/assets/scripts/skafos-see-similar.js'

    skafosSeeSimilar('skafosSimilarProductTemplate', null, { })
</script>
```

## Advanced Usage
The `skafosSeeSimilar` function takes three parameters. 
1. The first one is the name of the class that you used on the Collections page. 
2. The second is a function that you can use to work with complicated themes where our default item cloning does not work.
3. The third one is an object to pass custom options



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
