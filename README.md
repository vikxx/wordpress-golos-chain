# wordpress-golos-chain
Плагин для импорта и синхронизации wordpress записей в golos.io

https://golos.io/x/@vik/wordpress

https://s15.postimg.org/njhm4rsm3/ava.png

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


## Установка

> Клонируем репозиторий
` git clone https://github.com/vikxx/wordpress-golos-chain.git`

> Переходим в директорию
` cd wordpress-golos-chain`

> Устанавливаем WP API
` npm install --save wordpress-rest-api`

> Устанавливаем STEEM API
` npm install steem`

> Настраиваем авторов прописывая ключи
` nano wp.js`
> case - логин на wp, author.login - логин на голосе, author.wif - приватный постинг ключ
```
case "bukowski":
        author.login = 'bukowski'
        author.wif = '5.........'
        break;

      case "harms":
        author.login = 'harms'
        author.wif = '5.........'
        break;

      case "orwell":
        author.login = 'orwell'
        author.wif = '5.........'
        break;
  ```
  
  
  ```
   default:
        author.login = 'robot' // Это пример!
        author.wif = '5b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da'

      }
  ```
