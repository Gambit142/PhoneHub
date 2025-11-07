export const calculatePrice = (basePrice, discountPercentage, storageOptions, selectedStorage, ramOptions, selectedRam) => {

    let price = parseFloat(basePrice);
    if (discountPercentage) {
        price *= (1 - discountPercentage / 100);
    }

    if (storageOptions?.length > 0 && selectedStorage) {
        const storageIndex = storageOptions.indexOf(selectedStorage);
        if (storageIndex > 0) {
            price += storageIndex * 50;
        }
    }

    if (ramOptions?.length > 0 && selectedRam) {
        const ramIndex = ramOptions.indexOf(selectedRam);
        if (ramIndex > 0) {
            price += ramIndex * 50;
        }
    }

    return price.toFixed(2);
};

export const calculateOriginalPrice = (basePrice, storageOptions, selectedStorage, ramOptions, selectedRam) => {
    let price = parseFloat(basePrice);

    if (storageOptions?.length > 0 && selectedStorage) {
        const storageIndex = storageOptions.indexOf(selectedStorage);
        if (storageIndex > 0) {
            price += storageIndex * 50;
        }
    }

    if (ramOptions?.length > 0 && selectedRam) {
        const ramIndex = ramOptions.indexOf(selectedRam);
        if (ramIndex > 0) {
            price += ramIndex * 50;
        }
    }

    return price.toFixed(2);
};