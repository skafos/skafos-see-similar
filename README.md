# Reference Implementation for See-Similar on Shopify

## Adding Integration Points To Your Theme

Go to Online Store -> Themes -> the theme you want to edit -> Actions -> Edit Code and implement the following changes to your liquid files:
### Collections Page

Find the liquid file that populates products in your collections and the following items to the product item template within the collection products list. 

1. A Custom class - `skafosSimilarProductTemplate`
2. The Product id
3. The Collection id

This code could look something like this:
```
          {%- for product in collection.products -%}
            <li class="grid__item skafosSimilarProductTemplate" data-skafos-product-id="{{product.id}}" data-skafos-collection-id="{{collection.id}}">
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

### Custom Product Card Cloning
If you have a theme with a complex product card structure that our default code cannot handle, you can pass in a function that to the second parameter of `skafosSeeSimilar`. That function has two parameters. The product HTML element that is being cloned and a list of similar items. It is expected to return a list of product HTML elements that will be inserted after the one where see similar was clicked.

Here is the data available for similar products to your cloning function:
```js
{
    description: "PRODUCT'S_DESCRIPTION"
    id: "gid://shopify/Product/<PRODUCT_ID>"
    image_filename: "<PRODUCT_IMAGE_FILE_NAME>.jpg"
    image_url: "COMPLETE_PRODUCT_IMAGE_URL"
    max_price: "MAX_PRODUCT_PRICE"
    metadata: {
        image_text: null, 
        image_id: "gid://shopify/ProductImage/<IMAGE_ID>", 
        product_type: "PRODUCT_TYPE", 
        total_variants: 1, 
        has_only_default_variant: true, 
        …
    }
    min_price: "MIN_PRODUCT_PRICE"
    name: "PRODUCT_NAME"
    pdp_url: "PRODUCT_PAGE_URL"
    solution_version: "SKAFOS_SOLUTION_VERSION"
    tags: [ARRAY_OF_PRODUCT_TAGS]
}
```

Here is an example function and how to use it:
```html
<script type="module">
    window.skafosShopId={{shop.id}}
    import { skafosSeeSimilar } from 'http://hosted.skafos.ai/assets/scripts/skafos-see-similar.js'

    const productClone = (productDiv, newProducts) => {
        const similarProducts = []

        for (const product of newProducts) {
            const similarProduct = skafosTemplate.cloneNode(true)
            similarProduct.setAttribute('data-skafos-product-id', product.id.split('/').pop())

            // update links
            const links = similarProduct.querySelectorAll("[data-skafos-similar-link]")
            links.forEach((link) => {
                link.href = product.pdp_url
            })

            // update titles
            const titles = similarProduct.querySelectorAll("[data-skafos-similar-title]")
            titles.forEach((title) => {
                title.innerHTML = product.name
            })

            // update images
            const images = similarProduct.querySelectorAll("[data-skafos-similar-image]")
            images.forEach((image) => {
                image.src = product.image_url
                image.srcset = product.image_url
                image.dataset.src = product.image_url
                image.dataset.srcset = product.image_url
            })

            // update prices
            const prices = similarProduct.querySelectorAll("[data-skafos-similar-price]")
            prices.forEach((price) => {
                price.innerHTML = "$" + product.min_price
            })
            similarProducts.push(similarProduct)
        }

        return similarProducts
    }

    skafosSeeSimilar('skafosSimilarProductTemplate', productClone, { })
</script>
```

### Options

The third parameter of `skafosSeeSimilar` takes several options:

**text**

You can use this property to replace the text that is shown on the See Similar widget. This is an object with three properties
1. seeSimilar - The default value for this is `See Similar`
2. findingItems - The default value for this is `Finding Items ...`
3. foundItems - The default value for this is `Items Found!`

**count**

This is the number of similar items that are inserted. The default is 5.

**stylesheet**

[Here is our default stylesheet](assets/styles/skafos-see-similar.css). You can use this to create your own stylesheet and then provide the url to that stylesheet to use instead of ours.

Here is an example of using some options:
```js
skafosSeeSimilar('skafosSimilarProductTemplate', productClone, {
    text: {
        seeSimilar: 'More Like This'
    },
    count: 3,
    stylesheet: 'https://url.to/mystyles.css'
 })
```