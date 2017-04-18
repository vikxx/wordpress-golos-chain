# wordpress-golos-chain
Плагин для импорта и синхронизации wordpress записей в golos.io

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
