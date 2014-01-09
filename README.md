# Piter United

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

## To do

- Автоматическое добавление файлов в index.html, склейка их в один в app.dist и минификация
- Валидация форм, система вывода сообщений об ошибках
- Прелоадеры
- Загрузка картинок (логотипы, аватарки)
- Регистрация через соц. сети
- Разобраться с глюками роутера
- Остальной функционал
