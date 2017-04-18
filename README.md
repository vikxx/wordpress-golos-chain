# wordpress-golos-chain
Плагин для импорта и синхронизации wordpress записей в golos.io

https://golos.io/x/@vik/wordpress

Wordpress самая популярная блоговая платформа в мире. 
Многие новостные ресурсы forklog, lenta... десятки тысяч других, в том числе NY Times так или иначе используют преимущества Wordpress для публикации контента.
Разработчики и дизайнеры на Envato продают шаблоны и плагины для wordpress на миллионы долларов в год. Все это, а так же развивающийся API делает WP инструментом must have для разных изданий, журналистов, крупных и не очень блоггеров и просто вебмастеров.

Пришло время адаптировать этот замечательный инструмент для работы с голосом.
А именно - для публикации контента.
Для работы понадобится nodejs и любой wp блог, не важно на каком хостинге. 

Установка
`git clone https://github.com/vikxx/wordpress-golos-chain.git`
Инструкция по установке и настройке ниже

![голос](https://s15.postimg.org/njhm4rsm3/ava.png)
### Преимущества приложения:

* Публикация из WP-редактора, а это фотохостинг, черновики, удобство и т.д.
* Отложенный постинг средствами WP 
* Метки и категории WP - равно топик и теги на голосе
* Неограниченное количество тегов в посте ;) (этот момент нужно уточнить у команды, не навредят ли им посты с большим количество тегов) [пример](https://golos.io/test/@robot/ne-bitkoinom-edinym-top-6-kriptovalyut-podderzhavshih-segregated-witness)
* Возможность установки фото превью поста без этого фото в контенте и наоборот. Пример в блоге https://golos.io/@robot последние посты имеют превью, но в контенте только текст.
* Естественно возможность массового импорта из WP, а при этом возможность и массового редактирования постов средствами bulk на wp
* Редактирование поста в WP
* Выбор формата выплат поста из WP
* Возможность изменить формат выплаты поста уже после публикации (если за пост еще не успели голосовать)  
* Русские метки из WP автоматически конвертируются в формат русских тегов на голосе
* Возможность задать свою короткую ссылку для будущего поста 
* Возможность публикации в голос от имени разных авторов - и организации рабского труда :)
* Автономная работа не зависящая от сбоев на клиенте golos.io 
* Возможность переключения на другие ноды голоса, в т.ч. на локальные
* Это JS, а значит можно запустить бесплатно на heroku,openshift, glitch или на вашем windows пк и делать импорт из блогов.
* Комбинирование с плагинами WP - например для wp есть плагин, который импортирует посты из приватных групп вк. Приватная группа ВК > WP > Golos - автоматически! 
* Возможность комфортно публиковать посты с телефона используя приложение для WP
* Идентичная поддержка Steemit! 



**Это не WP плагин**, это приложение для node js , в этом есть свои плюсы и минусы.
Вам понадобятся кое какие навыки для установки и современный хостинг, но если ваш WP установлен на shared хостинге и по каким-то причинам вы с этим миритесь, то учитывая, что VPS сейчас стоят от 3$ а на openshift и heroku можно использовать node бесплатно - минусы не существенны, данное приложение не обязательно ставить РЯДОМ с WP. Он может работать и на вашем windows пк :) 
К тому же уже более год как WP начал миграцию на node js



 

# wordpress-golos-chain


* * *
Плагин для импорта и синхронизации wordpress записей в golos.io или steemit.com

# Установка

 Клонируем репозиторий
` git clone https://github.com/vikxx/wordpress-golos-chain.git`

 Переходим в директорию
` cd wordpress-golos-chain`

 Устанавливаем WP API
` npm install --save wordpress-rest-api`

 Устанавливаем STEEM API
` npm install steem`

# Настройка
Настраиваем путем редакции файла wp.js 

` nano wp.js` - это откроет файл в редакторе nano, сохранить изменения можно будет ctrl+x

## Указываем wordpress блог

Ссылка должна указывать на директорию wp-json вашего блога

`endpoint: 'http://forklog.com/wp-json'`

## Настройка форматов выплат 

Триггером для формат выплат на голосе будет работать выбор формата поста в WP
http://i.imgur.com/1087qRB.png

Придумайте какой формат поста WP будет делать пост на голосе в режиме "Отказаться от выплаты"
Для примера отказ от выплат будет - формат ссылка, известный в wp как link.
Укажем:

`const wpFormatForNoReward = 'link'`

Так же укажем формат записи для выплат в 100% силе голоса

`const wpFormatForAllInpower = 'aside'`

Остальные форматы будут публиковаться в режиме 50% GBG / 50% GOLOS

## Настройка количества постов для импорта

Находим переменную и указываем в ней то количество постов, которое будет получать приложение при каждом запуске (подразумевается, что расписание запуска вы добавите в CRON)

`const postLimit = 4` 

Например мы задали в cron запускать приложение каждые 30 минут, это значит что каждые 30 минут приложение будет проверять 4 недавних поста.
И публиковать их с интервалом:

`const postInterval = 10000` - 10 000 мс = 10 секунд

Если это будут новые посты - они будут публиковаться. Если это существующие посты - будет сравниваться время поста на голосе и время поста в вашем WP - если на WP редакция свежее, т.е. вы отредактировали пост - этот пост на голосе будет заменен свежей копией.



## Указание авторов для связи WP и GOLOS

#### Если на wp автор поста с логином bukowski - задаем автора этого поста на голосе, например orwell

Где `case` - логин на wp, `author.login` - логин на голосе, `author.wif` - приватный постинг ключ
```
case "bukowski":
author.login = 'orwell'
author.wif = '5.........'
break;
  ```

#### Так же делаем для других авторов постов
 
 ```
case "harms":
author.login = 'harms'
author.wif = '5.........'
break;
  ```
Если нужно больше комбинаций для авторов - просто копируем эти конструкции и заполняем данными авторов.


#### Не забываем прописать автора по умолчанию, который не попал ни в одно условие
  
 ```
 default:
        author.login = 'robot' // Это пример!
        author.wif = '5b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da'
  ```

## Cпособы подключения к блокчейну голоса или STEEM

По умолчанию указана основная нода

`golos.config.set('websocket', 'wss://ws.golos.io');`

Если вы владеете собственной нодой, можете переключиться на нее:

`golos.config.set('websocket','ws://localhost:9090');`

Учтите, что порт может быть другой.
Так же вы можете подключится к другим паблик нодам голоса
Это поможет работать вашему приложению даже тогда, когда golos.io не работает.

### Переключение на STEEM

Для постинга в STEEM просто уберите эти строки и используйте логин и ключ аккаунтов на стиме.
```
golos.config.set('websocket', 'wss://ws.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
```

# Запуск

Ручной "одноразовый" запуск 
`node /имя_папки/wp.js`

Для постоянной работы создайте расписание для скрипта в CRON (инструкция позднее)
