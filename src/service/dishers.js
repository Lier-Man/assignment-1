export const getDataDishers =  () => {
    return fetch('data/dishes.json').then(res => res.json()).then(d => d.dishes); 
};