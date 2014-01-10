# Сайт сообщества [Piter United](http://piter-united.ru/)

## Используемые технологии

- [AngularJS](http://angularjs.org/)
- [Angular-bootstrap](http://angular-ui.github.io/bootstrap/)
- [Angular-fire](http://angularfire.com/)

## To do

- Автоматическое добавление файлов в index.html, склейка их в один в app.dist и минификация
- Валидация форм, система вывода сообщений об ошибках
- Прелоадеры
- Загрузка картинок (логотипы, аватарки)
- Регистрация через соц. сети
- Разобраться с глюками роутера
- Остальной функционал
- ЧПУ для адресов сообществ, событий и проч. Генерируется из имени. Напр.: /community/Сообщество-аналитиков

[Прототип.pdf](https://www.dropbox.com/s/mnbtbzdxzdanyp9/Piter%20United%20prototype%20v1.pdf)

## Install

    npm install
    npm install -g bower
    npm install -g grunt-cli
    bower install

## Add local host

Unix/Mac:

    echo "127.0.0.1 piter-united.local" | sudo tee -a /etc/hosts

Windows cmd:

    echo 127.0.0.1 piter-united.local >> %SystemRoot%\system32\drivers\etc\hosts

## Start

    grunt

http://piter-united.local:8000
