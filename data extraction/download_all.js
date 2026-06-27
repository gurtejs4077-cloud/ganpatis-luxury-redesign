import fs from 'fs';

const BASE_URL = 'https://ganpatis.in';
const OUTPUT_FILE = 'ganpatis_complete_inventory.json';

async function fetchAllProducts() {
    console.log('Fetching list of all collections...');
    let collections = [];
    try {
        const res = await fetch(`${BASE_URL}/collections.json?limit=250`);
        const data = await res.json();
        collections = data.collections || [];
        console.log(`Found ${collections.length} collections.`);
    } catch (e) {
        console.error('Failed to fetch collections list:', e);
        return;
    }

    const uniqueProducts = new Map();
    const limit = 250;

    for (let i = 0; i < collections.length; i++) {
        const handle = collections[i].handle;
        console.log(`\n[${i+1}/${collections.length}] Extracting collection: ${handle}`);
        
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            try {
                const response = await fetch(`${BASE_URL}/collections/${handle}/products.json?limit=${limit}&page=${page}`);
                if (!response.ok) break;

                const data = await response.json();
                if (!data.products || data.products.length === 0) {
                    hasMore = false;
                    break;
                }

                let addedCount = 0;
                for (const product of data.products) {
                    if (!uniqueProducts.has(product.id)) {
                        const processed = {
                            id: product.id,
                            title: product.title,
                            handle: product.handle,
                            product_type: product.product_type,
                            vendor: product.vendor,
                            tags: product.tags,
                            created_at: product.created_at,
                            description: product.body_html ? product.body_html.replace(/<\/?[^>]+(>|$)/g, "") : "",
                            primary_image: product.images && product.images.length > 0 ? product.images[0].src : null,
                            all_images: product.images ? product.images.map(img => img.src) : [],
                            variants: product.variants ? product.variants.map(v => ({
                                id: v.id,
                                title: v.title,
                                sku: v.sku,
                                price: v.price,
                                available: v.available
                            })) : []
                        };
                        uniqueProducts.set(product.id, processed);
                        addedCount++;
                    }
                }

                console.log(`  Page ${page}: Found ${data.products.length} products (${addedCount} new unique)`);
                page++;
                
                // Gentle throttle
                await new Promise(r => setTimeout(r, 400));
            } catch (err) {
                console.error(`  Error pulling page ${page} for ${handle}:`, err.message);
                hasMore = false;
            }
        }
    }

    const allProductsArray = Array.from(uniqueProducts.values());
    console.log(`\n========================================`);
    console.log(`Extraction Complete!`);
    console.log(`Total unique products scraped: ${allProductsArray.length}`);
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProductsArray, null, 2));
    console.log(`Saved successfully to ${OUTPUT_FILE}`);
}

fetchAllProducts();
