/*!
 * Код подключения Библиотеки JavaScript https://mc.yandex.ru/metrika/watch.js
 * позволяет отслеживать взаимодействия пользователей с вашим сайтом.
 * Для создания счётчика используется класс Ya.Metrika.
 * Подробности: https://yandex.ru/support/metrika/code/counter-initialize.xml
 *
 * Date: 2016-02-28
 */

<!-- Yandex.Metrika counter -->
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter26968695 = new Ya.Metrika({id:26968695,
                    webvisor:true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true});
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
/* Yandex.Metrika counter */