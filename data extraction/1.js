import fs from 'fs';

const TASKS = [
    {
        url: 'https://ganpatis.in/collections/new-arrivals-1/products.json',
        filename: 'new-girls.json'
    },
    {
        url: 'https://ganpatis.in/collections/new-arrivals-2/products.json',
        filename: 'new-boys.json'
    }
];

async function extractCollection(collectionUrl, outputFilename) {
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    const limit = 250;

    console.log(`\n--- Starting extraction for: ${outputFilename} ---`);

    while (hasMore) {
        try {
            const response = await fetch(`${collectionUrl}?limit=${limit}&page=${page}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.products || data.products.length === 0) {
                hasMore = false;
                break;
            }

            const processedProducts = data.products.map(product => {
                const primaryImage = product.images.length > 0 ? product.images[0].src : null;
                const secondaryImages = product.images.slice(1).map(img => img.src);

                return {
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    product_type: product.product_type,
                    vendor: product.vendor,
                    tags: product.tags,
                    created_at: product.created_at,
                    description: product.body_html ? product.body_html.replace(/<\/?[^>]+(>|$)/g, "") : "",
                    primary_image: primaryImage,
                    all_images: product.images.map(img => img.src),
                    secondary_images: secondaryImages,
                    variants: product.variants.map(variant => ({
                        id: variant.id,
                        title: variant.title,
                        sku: variant.sku,
                        price: variant.price,
                        available: variant.available,
                        inventory_management: variant.inventory_management
                    }))
                };
            });

            allProducts.push(...processedProducts);
            console.log(`Page ${page}: Extracted ${data.products.length} products.`);
            page++;

            // Throttle to respect the server rate limits
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.error(`Error pulling page ${page} for ${outputFilename}:`, error.message);
            hasMore = false;
        }
    }

    fs.writeFileSync(outputFilename, JSON.stringify(allProducts, null, 2));
    console.log(`✓ Saved ${allProducts.length} items to ${outputFilename}`);
}

async function runAll() {
    for (const task of TASKS) {
        await extractCollection(task.url, task.filename);
    }
    console.log('\nAll extractions complete!');
}

runAll();