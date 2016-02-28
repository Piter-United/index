/*!
 * Код подключения Библиотеки JavaScript analytics.js
 * позволяет отслеживать взаимодействия пользователей с вашим сайтом.
 * Выполняет 4 основных задачи:
 * Создает элемент <script>, который инициирует асинхронную загрузку библиотеки analytics.js со страницы https://www.google-analytics.com/analytics.js
 * Инициирует глобальную функцию ga (называемую очередью команд ga()), которая позволяет запланировать выполнение команд после полной загрузки и готовности библиотеки analytics.js.
 * Добавляет в очередь команд ga() команду создания нового счетчика для ресурса, указанного в параметре 'UA-XXXXX-Y'.
 * Добавляет в очередь команд ga() команду отправить в Google Analytics обращение типа pageview для текущей страницы.
 * Подробности: https://developers.google.com/analytics/devguides/collection/analyticsjs/?hl=ru
 *
 * Date: 2016-02-28
 */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-49828340-2', 'piter-united.ru'); // Creates a tracker.
ga('send', 'pageview');                           // Sends a pageview.