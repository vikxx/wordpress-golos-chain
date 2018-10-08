//┌────────────── ИМПОРТ И СИНХРОНИЗАЦИЯ WORDPRESS БЛОГОВ С БЛОГАМИ НА GOLOS
//│ ┌──────────── Приложение работает на nodejs 
//│ │ ┌────────── Установить: npm install --save wordpress-rest-api
//│ │ │ ┌──────── Установить: npm install steem
//│ │ │ │ ┌────── Настроить: расписание импорта по CRON http://help.ubuntu.ru/wiki/cron
//│ │ │ │ │ 
//│ │ │ │ │ 
//│ │ │ │ │ 
const golos = require('golos-js')
const WP = require('wordpress-rest-api');

// НАСТРОЙКИ
// Ниже необходимо указать путь до вашего wp-json директивы вашего WORDPRESS 
const wp = new WP({
  endpoint: 'http://forklog.com/wp-json'
});


// Формат WP записи которая опубликует пост в golos.io в режиме "отказ от выплат"
// Указано link - ссылка. Если хотите опубликовать запись с отказом от выплаты - выбирайте в WP указанный ниже формат
// Если вы ошиблись при размещении поста - вы можете оперативно отредактировать его в вп с другим форматом -
// Это изменить формат и на голосе. 
const wpFormatForNoReward = 'link'

// Стандартные форматы в WP: standard,aside,link,quote,image,video,gallery,status,video,audio,chat
// https://codex.wordpress.org/Post_Formats
 

// Формат WP записи которая опубликует пост в режиме "100% в силе голоса"
const wpFormatForAllInpower = 'aside'



// Укажите s postLimit сколько последних постов проверять на wordpress блоге. 
// Разунмно комбинируйте это со значением globalInterval - не указывайте слишком большее количество постов при слишком коротком интервале
// Если блог-донор обновляется редко - указывайте неблольшой значение.
const postLimit = 1

// ИНТЕРВАЛ РАЗМЕЩЕНИЯ ПОСТОВ
// Используйте разумно из расчета расписания указанного вами в CRON, а так же помните, что мимнимальный интервал
// должен стоять мимним 5 минут - голос не разрешает размещать посты чаще. 
const postInterval = 1000*60*5 


// ПОДКЛЮЧЕНИЕ К GOLOS
// wss://ws.golos.io - В примере ниже указан универсальный вариант главной публичной ноды голоса 
// Если скрипт будет запускаться на сервере с вашей собственной нодой, вы можете указать:
// ws://localhost:9090 - порт 9090 у вас может быть другим, он укащан в конфиге ноды
// Вариант с localhost подойдет в случае отсутствия доступа к главной ноде голоса
// Кроме этого вы можете указать ноду для STEEMIT !

// golos.config.set('websocket','ws://localhost:9090');

golos.config.set('websocket', 'wss://ws.golos.io');

// Параметры ниже так же указывают на то, что работать вы будете с блокчейном голоса. Если убрать эти две строки
// И поменять адрес ноды - вы сможете использовать STEEMIT или другие блокчейны на его базе!
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');

const author = {}
const t = 1000

// Некоторые строки,такие как теги, категории, ссылки в wordpress могут быть на русском, но поскольку golos.io не понимает кириллические теги
// Ниже создадим функцию, которая будет транслитировать кириллицу в латиницу.
// Напротив каждой кириллической буквы мы поместим ее латиницкий аналог в формате голоса:	
const cyrTag = () => {
	// Таблицв транслитирации в том виде, в котором она принята на golos.io
  const _associations = {
    "а": "a",
    "б": "b",
    "в": "v",
    "ґ": "g",
    "г": "g",
    "д": "d",
    "е": "e",
    "ё": "yo",
    "є": "ye",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "і": "i",
    "ї": "yi",
    "й": "ij",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "x": "kh",
    "ц": "cz",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "xx",
    "ы": "y",
    "ь": "x",
    "э": "ye",
    "ю": "yu",
    "я": "ya",
    "ґ": "g",
    "і": "i",
    "є": "e",
    "ї": "i"
  };

  return {
    transform: transform
  }

  function transform(str, spaceReplacement) {
    if (!str) {
      return "";
    }
    let new_str = '';
    let ru = ''
    for (let i = 0; i < str.length; i++) {
      let strLowerCase = str[i].toLowerCase();

      if (strLowerCase === " " && spaceReplacement) {
        new_str += spaceReplacement;

        continue;
      }

      if (!_associations[strLowerCase]) {
        new_str += strLowerCase;
      } else {
        new_str += _associations[strLowerCase];
		// Если в теге найдены русские символы - стало быть нам нужно добавить префикс ru-- для публикации на голосе
        ru = 'ru--';
      }
    }
    return ru + new_str;
  }
};

// Теперь мы сможем транслитировать теги подобным образом: cyrTag().transform('Тег на русском', "-")) 



wp.posts()
  .perPage(postLimit)
  .embed()
  .get(function (err, posts) {
    if (err) {
      console.log('Ошибка wordpress', err)
    }
   

    const g = []
    for (let post of posts) {
      g.push({
        title: post.title['rendered'],
        content: post.content['rendered'],
        permlink: post.slug, // Если на вашем WP русские permlink воспользуйтесь транслитирацией: cyrTag().transform(post.slug,"-")
        status: post.status,
        update: post.modified_gmt,
        time: post.date_gmt,
        tags: post._embedded['wp:term'][1],
        topic: post._embedded['wp:term'][0][0].name,
        author: post._embedded['author'][0].slug,
        thumb: (typeof post._embedded['wp:featuredmedia'] === 'undefined') ? '' : post._embedded['wp:featuredmedia'][0].source_url,
        embedded: post._embedded,
        format: post.format
      })
    }

    console.log(`Начало работы...`)
    const summ = g.length
    let n = 0

    let posting = () => {
      //console.log(g[n].tags)
      const terms = []
      const wptags = g[n].tags
      for (let tag of wptags) {
        terms.push(cyrTag().transform(tag['name'], '-'))
      }
      const topic = cyrTag().transform(g[n].topic, '-')
      const tags = terms

      switch (g[n].author) {
			// Задайте условия для авторов
			// В case укажите логины авторов вашего WP, а внутри условия case сообщите, 
			// Какой автор на GOLOS будет связан с автором на WP
			// author.login = логин на голосе без символа @
			// author.wif   = Приватный постинг ключ 
			
			// Рекомендуется вместо прописания ключей использовать переменные process.env
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

     
		
		// Если вам нужно больше авторов - просто добавьте еще конструкций:
		
		// case "jhondoe":
        // author.login = 'jhondoe'
        // author.wif = '5.........'
        // break;
		
		
		
		// Дефолнтный автор - если ни один из вариантов выше не подходит
      default:
        author.login = ''
        author.wif = ''

      }

      // Нужно проверить блог автора на golos.io на предмет наличия поста c такой же ссылкой и если такой пост уже есть:
      // Проверим нуждается он в обновлении или нет. Если на golos актуальная версия поста - пропустим этот и перейдем к следующему посту
		const permlink = g[n].permlink
		
				
				
      golos.api.getContent(author.login, permlink,0, function (err, result) {
        if(err){
				console.log('Ошибка: ', err);	
				}
				
     
		
		// isNew = true если поста с такой ссылкой в блоге на golos.io не было ранее. 
        const isNew = result.permlink === ''
        
		// Проверяем когда было последнее обновление этого поста на голосе
        const golosTime = Date.parse(result.last_update) / t

        // Проверяем когда было последние обновление поста на WP
        const wpTime = Date.parse(g[n].update) / t

        // isUpdate = true если пост с такой ссылкой существует, но версия на WP свежее
        const isUpdate = result.permlink === g[n].permlink && golosTime < wpTime
        	 

        // Осуществляем постинг в голос если такого поста не было ИЛИ если на WP свежая редакция поста - заменим ею старый пост на golos
        if (isNew || isUpdate) {
			console.log(`Публикация ${n +1} из ${summ}>>> ${g[n].title}`)

          //  0.000 GBG для отказа. 
          const maxAcceptedPayout = (g[n].format === wpFormatForNoReward) ? '0.000 GBG' : '1000000.000 GBG';

          // 10000 для 50%/50% или 0 для 100% в СГ
          const percentSteemDollars = (g[n].format === wpFormatForAllInpower) ? 0 : 10000;

          

          // В этот массив мы запишем теги, превью, название приложения и формат данных. 
          const jsonMetadata = {
            "tags": tags,
            "image": [
              g[n].thumb
            ],
			// Как хороший тон - ккажем наименование нашего приложения, оно будет отображаться в json metadata
            "app": "Wordpress importer (vik)",
            "format": "html"
          }
			
		  
		 
		  // Размещение поста
        golos.broadcast.comment(
			// Передача параметров 
            author.wif, '', topic, author.login, permlink, g[n].title, g[n].content, jsonMetadata,
			
            function (err, result) {
             

				if(err){
				console.log('Ошибка: ',err);	
				}
				
              // Установка параметров выплат для поста, отправляем с небольшой отсрочкой во избежание ошибок
             if (!isUpdate) {
			 setTimeout(() => {
                golos.broadcast.commentOptions(
                  author.wif, author.login, permlink, maxAcceptedPayout, percentSteemDollars, true, true, [],
                  function (err, result) {
                   if(err){
					console.log('Ошибка: ',err);	
					}
                  });

              }, 1000);
				}

            });
			

        }

        if (isUpdate) {
          console.log(`Обновление поста: ${g[n].title}`)
        }

        // Перебираем все посты добавляя с каждым разом +1 переменной n  
        n++

        // Когда n станет равна summ сумме полученных постов - остановим процесс интервала публикации постов
        if (n === summ) {
		  
          clearInterval(posting)
          console.log(`========== Постинг окончен ===========`)
		  
		  // Закрываем скрипт полностью и ждем когда его запустит по расписанию CRON
		  setTimeout(() => {
			  
		  process.exit()
		  },6000);
        }

      });
	// Интервал с которым будут публиковаться посты 
    }
	
posting()
setInterval(posting, postInterval);

  });
