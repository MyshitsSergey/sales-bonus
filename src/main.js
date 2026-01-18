/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
    // purchase — это одна из записей в поле items из чека в data.purchase_records
   // _product — это продукт из коллекции data.products
   const sale_price = purchase.sale_price;
   const quantity = purchase.quantity;
   const discount = 1 - (purchase.discount / 100); //коэффициент для расчета суммы без скидки в десятичном формате
   return sale_price * quantity * discount
  
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const profit  = seller.profit;
    if (index === 0) {
        return profit * (15/100);
    } else if (index === 1 || index === 2) {
        return profit * (10/100);
    } else if (index === total - 1) {
        return 0;
    } else {
       return profit * (5/100);// Для всех остальных
    }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */

function analyzeSalesData(data, options) {
//1. @TODO: Проверка входных данных  
if(!data || !Array.isArray(data.sellers) || data.sellers.length === 0) // @TODO: Проверка входных данных // Здесь проверим входящие данные//Проверить входные данные
    {
        throw new Error('Некорректные входные данные');
    }


//2. @TODO: Проверка наличия опций
if(typeof options !== "object" || typeof options === null) // @TODO: Проверка наличия опций
    {
        throw new Error('Опции должны быть - Обьектом!');
    }
    const { calculateRevenue, calculateBonus } = options; // Сюда передадим функции для расчётов
    
if(typeof calculateRevenue !== "function" || typeof calculateBonus !== "function")//// @TODO: Проверка явл. ли опции функциями
    {
        throw new Error('должны быть - Функции!');
    }
    
//3. @TODO: Подготовка промежуточных данных для сбора статистики // создаём массив обьектов пустых количеством равных количеству продавцов
const sellerStats = data.sellers.map(seller => (
    {
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }
)); 
//    console.log(sellerStats);

//4. @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(sellers => [sellers.id, sellers]));
    // console.log(sellerIndex);

    const productIndex = Object.fromEntries(data.products.map(products => [products.sku, products]));
    // console.log(productIndex);

//5. @TODO: Расчет выручки и прибыли для каждого продавца
if(!Array.isArray(data.purchase_records) || data.purchase_records.length === 0)
    {
        throw new Error("Записей о продаже нет")
    }

data.purchase_records.forEach(record => { // Чек 
    const seller = sellerIndex[record.seller_id]; // Продавец      
    seller.sales_count += 1; // Увеличить количество продаж 
    seller.revenue += record.total_amount // Увеличить общую сумму выручки всех продаж

        // Расчёт прибыли для каждого товара
    record.items.forEach(item => {
        const product = productIndex[item.sku]; // Товар
        const cost = product.purchase_price * item.quantity // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
        const revenue = calculateRevenue(item, product) // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
        const profit = revenue - cost // Посчитать прибыль: выручка минус себестоимость
        seller.profit += profit;  // Увеличить общую накопленную прибыль (profit) у продавца -seller
              

            // Учёт количества проданных товаров
        if (!seller.products_sold[item.sku]) {
            seller.products_sold[item.sku] = 0;
            }
            seller.products_sold[item.sku]+= item.quantity // Увеличить число всех проданных товаров у продавца на количество проданных товаров в конкретном чеке
        });
 });

//6. @TODO: Сортировка продавцов по прибыли ( по убыванию)
sellerStats.sort((a, b) => {
    if(a.profit > b.profit) {return -1;}
    if(a.profit < b.profit) {return 1;}
    return 0;
})

// console.log(sellerStats)

//7. @TODO: Назначение премий на основе ранжирования
sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller) // Считаем бонус
        
        
        
        // Формируем топ-10 товаров
        seller.top_products =  Object.entries(seller.products_sold)
        seller.top_products = seller.top_products.map(([key, value])=>({sku:key, quantity:value}))
        seller.top_products = seller.top_products.sort((a,b)=>{
            if(a.quantity > b.quantity) {return -1;}
            if(a.quantity < b.quantity) {return 1}
            return 0;
        })
        seller.top_products = seller.top_products.slice(0, 10)
});


//8. @TODO: Подготовка итоговой коллекции с нужными полями    
return sellerStats.map(seller => ({
        seller_id: seller.id, // Строка, идентификатор продавца
        name: seller.name,// Строка, имя продавца
        revenue: +seller.revenue.toFixed(2),// Число с двумя знаками после точки, выручка продавца
        profit: +seller.profit.toFixed(2), // Число с двумя знаками после точки, прибыль продавца
        sales_count: seller.sales_count, // Целое число, количество продаж продавца
        top_products: seller.top_products,// Массив объектов вида: { "sku": "SKU_008","quantity": 10}, топ-10 товаров продавца
        bonus: +seller.bonus.toFixed(2)// Число с двумя знаками после точки, бонус продавца
}));  
}
