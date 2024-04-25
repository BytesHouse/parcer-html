const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    try {
        const url = 'вставить сюда адрес сайта'; // Убедитесь, что URL доступен и содержит текстовые данные

        // Отправляем GET-запрос
        const response = await axios.get(url);
        const html = response.data;

        // Парсим HTML
        const $ = cheerio.load(html);
        const textNodes = [];

        // Собираем все тексты, которые содержатся в элементах, исправляем на более универсальный селектор
        $('body').find('*').each(function() {
            const text = $(this).contents().filter(function() {
                return this.type === 'text' && this.data.trim().length > 0;
            }).text().trim();

            if (text.length > 0) {
                textNodes.push({ text: text });
            }
        });

        // Проверяем, есть ли собранные данные
        if (textNodes.length > 0) {
            // Сохраняем в CSV
            const csv = new ObjectsToCsv(textNodes);
            await csv.toDisk('./output.csv');
            res.send('Текстовые узлы были успешно сохранены в output.csv');
        } else {
            res.send('Не найдено текстовых узлов для сохранения.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Ошибка при обработке запроса: ' + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
