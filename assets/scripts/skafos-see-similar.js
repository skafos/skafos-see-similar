const skafosTemplate = document.querySelector('.skafosSimilarProductTemplate').cloneNode(true)

const addCss = (url) => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
}

const getSimilarProducts = async (productId, collectionId, count = 5) => {
    const data = {
        "productID": "gid://shopify/Product/" + productId,
        "collectionID": "gid://shopify/Collection/" + collectionId,
        "count": 5,
        "shopID": "gid://shopify/Shop/" + window.skafosShopId
    }

    const rawResponse = await fetch('https://api.skafos.ai/v1/products/similar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const content = await rawResponse.json()

    return content.result.similarProducts
}

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

const addSeeSimilarToProduct = (productDiv, customCloner, options) => {
    if (!customCloner) {
        customCloner = productClone
    }

    const seeSimilarDiv = document.createElement('div')
    seeSimilarDiv.classList.add('seeSimilarContainer')

    const skafosIconOutline = document.createElement('img')
    skafosIconOutline.src = options.icons.initialIcon || 'https://hosted.skafos.ai/assets/images/skafos-icon-outline.svg'
    skafosIconOutline.classList.add('skafosIconOutline')
    seeSimilarDiv.appendChild(skafosIconOutline)

    const skafosIconFull = document.createElement('img')
    skafosIconFull.src = options.icons.hoverIcon || 'https://hosted.skafos.ai/assets/images/skafos-icon-full.svg'
    skafosIconFull.classList.add('skafosIconFull')
    seeSimilarDiv.appendChild(skafosIconFull)

    const skafosIconCompleted = document.createElement('div')
    skafosIconCompleted.classList.add('skafosIconCompleted')

    const skafosIconCompletedImg = document.createElement('img')
    skafosIconCompletedImg.src = options.icons.completedIcon || 'https://hosted.skafos.ai/assets/images/skafos-icon-completed.svg'
    skafosIconCompleted.appendChild(skafosIconCompletedImg)

    seeSimilarDiv.appendChild(skafosIconCompleted)

    const skafosAnimationText = document.createElement('div')
    skafosAnimationText.classList.add('skafosAnimationText')
    const blankSpaceSpan = document.createElement('span')
    blankSpaceSpan.innerHTML = '&nbsp&nbsp'
    skafosAnimationText.appendChild(blankSpaceSpan)

    const seeSimilarText = document.createElement('span')
    seeSimilarText.innerHTML = options.text.seeSimilar || 'See Similar'
    seeSimilarText.setAttribute('data-seesimilartextinit', '')
    skafosAnimationText.appendChild(seeSimilarText)

    const findingItemsText = document.createElement('span')
    findingItemsText.innerHTML = options.text.findingItems || 'Finding Items ...'
    findingItemsText.setAttribute('data-seesimilartextstarted', '')
    skafosAnimationText.appendChild(findingItemsText)

    seeSimilarDiv.appendChild(skafosAnimationText)

    const clickListener = async () => {
        seeSimilarDiv.removeEventListener('click', clickListener)
        seeSimilarDiv.dataset.seeSimilarStarted="true";
        const productId = productDiv.getAttribute('data-skafos-product-id')
        const collectionId = productDiv.getAttribute('data-skafos-collection-id')
        const similarProducts = await getSimilarProducts(productId, collectionId, options.count)
        const newDivs = await customCloner(productDiv, similarProducts)
        for (const newDiv of newDivs) {
            addSeeSimilarToProduct(newDiv, customCloner, options)
            productDiv.parentNode.insertBefore(newDiv, productDiv.nextSibling)
        }
        findingItemsText.innerHTML = options.text.foundItems || 'Items Found!'
        seeSimilarDiv.dataset.seeSimilarCompleted=true;
        setTimeout(() => {
            seeSimilarDiv.dataset.seeSimilarCompletedFinal=true;
        }, 3000)
    }

    const hoverListener = () => {
        
    }

    seeSimilarDiv.addEventListener('click', clickListener)

    seeSimilarDiv.addEventListener('mouseenter', hoverListener)

    productDiv.appendChild(seeSimilarDiv)
}

/**
 * 
 * @param {String} className The custom className added to the product cards on the collection page
 * @param {Function} customCloner Optional cloning algorithm for when our default one doesn't work. This fuction is called with two parameters. The first is the div of original product to clone. The second is the list of similar products. This function must return a list of cloned divs.
 * @param {Object} options 
 * @param {Number} options.count How many items to insert. Default is 5
 * @param {Object} options.stylesheet URL to custom stylesheet. Default is https://hosted.skafos.ai/assets/styles/skafos-see-similar.css
 */
export const skafosSeeSimilar = async (className, customCloner, options = {}) => {
    // default options
    options.icons = options.icons || {}
    options.text = options.text || {}
    options.count = options.count || 5
    options.stylesheet = options.stylesheet || 'https://hosted.skafos.ai/assets/styles/skafos-see-similar.css'

    addCss(options.stylesheet)

    const productDivs = document.getElementsByClassName(className)
    for (const productDiv of productDivs) {
        addSeeSimilarToProduct(productDiv, customCloner, options)
    }
}

