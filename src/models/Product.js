import { ProductType } from '../constants/types.js';

class Product {
    constructor(data) {
        this.productId = data.productId;
        this.name = data.name;
        this.price = data.price;
        this.priceText = data.priceText;
        this.oldPrice = data.oldPrice;
        this.oldPriceText = data.oldPriceText;
        this.image = data.image;
        this.category = this.normalizeCategories(data.category);
        this.colors = this.normalizeColors(data.colors);
        this.gender = data.gender?.toLowerCase();
        this.type = this.determineType();
    }

    normalizeCategories(categories) {
        if (!Array.isArray(categories)) return [];
        return categories.map(cat => cat.toLowerCase());
    }

    normalizeColors(colors) {
        if (!Array.isArray(colors)) return [];
        return colors.map(color => color.toLowerCase());
    }

    determineType() {
        return this.oldPrice ? ProductType.DISCOUNTED : ProductType.REGULAR;
    }

    hasCategory(categoryName) {
        const normalizedCategory = categoryName.toLowerCase();
        return this.category.some(cat => cat.includes(normalizedCategory));
    }

    hasColor(color) {
        const normalizedColor = color.toLowerCase();
        return this.colors.includes(normalizedColor);
    }

    isInPriceRange(min, max) {
        const minPrice = parseInt(min);
        const maxPrice = max === '2000+' ? Infinity : parseInt(max);
        return this.price >= minPrice && this.price <= maxPrice;
    }
}

export default Product; 