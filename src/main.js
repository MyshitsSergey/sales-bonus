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
   const { discount, sale_price, quantity } = purchase;
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
    const { profit } = seller;
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
    if(typeof options !== "object" || typeof options === NULL) // @TODO: Проверка наличия опций
        {
            throw new Error('Опции должны быть - Обьектом!');ы
        }
    const { calculateRevenue, calculateBonus } = options; // Сюда передадим функции для расчётов
    
    if(typeof calculateRevenue !== "function" || typeof calculateBonus !== "function")//// @TODO: Проверка явл. ли опции функциями
        {
            throw new Error('должны быть - Функции!');
        }
    
//3. @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
   // Заполним начальными данными
   }));

//4. @TODO: Индексация продавцов и товаров для быстрого доступа
   





    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
