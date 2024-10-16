// use db_name
// cls
// show databases
// show collections

// db.createCollection()

// db.coll_name.insertOne()
// db.coll_name.insertMany()

// db.dropDatabase()
// db.coll_name.drop()

// db.coll_name.deleteOne()
// db.coll_name.deleteMany()

// db.coll_name.find()



// Проекция

// mysql
// select column1, column2, column3..
// from table1;

// db.collection_name.find({Условие}, {Проекция})
// Проекция - {column_name: 1, column_name: 0}
// 1 - Вывести поле, 0 - Не вывести поле

// Вывести имена и фамилии сотрудников, которые зарабатывают больше 2000.
db.workers.find({salary: {$gt: 2000}}, {firstname: 1, lastname: 1, _id: 0})

// Вывести все поля всех сотрудников, кроме возраста.
db.workers.find({}, {age: 0})

// Вывести работников, которым больше 30.
// Выводим firstname, lastname
db.workers.find({age: {$gt: 30}}, {firstname: 1, lastname: 1, _id: 0})

// 1 и 0 можно заменить на true и false
db.workers.find({age: {$gt: 30}}, {firstname: true, lastname: true, _id: false})


// Пагинация и сортировка

// mysql

// select column1, column2
// from table1
// where ...
// limit 1, 3;

// limit - кол/во документов, которое нужно вывести
// skip - кол/во документов, которое нужно пропустить

// Вывести первого сотрудника, которому больше 30
db.workers.find({age: {$gt: 30}}).limit(1)

// Вывести всех сотрудников, кроме первых двух
db.workers.find().skip(2)

// Вывести двух сотрудников, пропуская первого (2, 3)
db.workers.find().skip(1).limit(2)
db.workers.find().limit(2).skip(1)

// Найти сотрудников, которые зарабатывают больше 2000, вывести только первых двух.
db.workers.find({salary: {$gt: 2000}}).limit(2)

// Пагинация массива
// $slice
// $slice: limit
// $slice: [skip, limit]

// Вывести только первый навык сотрудников
db.workers.find({}, {skills: {$slice: 1}})

// Вывести только третий навык сотрудников
// $slice: [Первые два пропускаем, выводим только один]
db.workers.find({}, {skills: {$slice: [2, 1]}})

// Вывести второй навык Марины
db.workers.find({firstname: 'Marina'}, {skills: {$slice: [1, 1]}})


// Сортировка

// mysql - order by column asc/desc

// .sort({column: 1(по возр.)/-1(по убыв.)})

// Вывести всех сотурдников и отсортировать по возрастанию зарплаты.
db.workers.find().sort({salary: 1}) 

// Вывести сотрудника с самой высокой зарплатой
db.workers.find().sort({salary: -1}).limit(1)

// Вывести самого молодого сотурдника. Вывести только имя, фамилию и возраст.
db.workers.find({}, {firstname: 1, lastname: 1, age: 1, _id: 0}).sort({age: 1}).limit(1)

// Вывести трех сотрудников, которые зарабатывают меньше всего
db.workers.find().sort({salary: 1}).limit(3)


// Обновление данных 

// Mysql
// alter table 
// add
// drop

// update table 
// set column = new_value;

// Если нужно полностью заменить один документ другим, используем replaceOne
// db.collection_name.replaceOne(filter, update [, options])

//options - upsert: true/false(по умолч.)
// Если true: то mongodb будет обновлять документ, если он найден, и созвадавть новый, если такого докумнета нет.
// Если false: не будет созвадавть новый документ, если запрос на выборку не найдет ни одного документа

// Полностью заменить документ, где имя Boris, фамилия Orlov, на:
// имя: 'Denis'
// фамилия: 'Ivanov'
// должность: 'HR',
// зарплата: 2500

db.workers.replaceOne(
    {firstname: 'Boris', lastname: 'Orlov'}, 
    {firstname: 'Denis', lastname: 'Ivanov', position: 'HR', salary: 2500}
)

// acknowledged: true, -- нет ошибок
// insertedId: null, -- не добавлен новый документ
// matchedCount: 1, -- найден один документ по фильтру 
// modifiedCount: 1, -- изменен один документ
// upsertedCount: 0 -- ноль новых документов


db.workers.replaceOne(
    {firstname: 'Boris', lastname: 'Orlov'}, 
    {firstname: 'Denis', lastname: 'Ivanov', position: 'HR', salary: 2500},
    {upsert: true}
)

// acknowledged: true,
// insertedId: ObjectId('67100d43806726c00ce3a059'), -- ID нового документа
// matchedCount: 0, 
// modifiedCount: 0,
// upsertedCount: 1 -- добавлен один документ

// Полностью заменить документ, где имя ՛Ivan՛ на
// firstname: ՛Tom՛
// lastname: ՛Thomson՛,
// age: 30,
// position: 'HR'
// salary: 4000
// если есть такой документ, если нет, создать новый

db.workers.replaceOne(
    {firstname: 'Ivan'},
    {
        firstname: 'Tom',
        lastname: 'Thomson',
        age: 30,
        position: 'HR',
        salary: 4000
    },
    {upsert: true}
)

// Чтобы не обновлять весь документ, а только значение одного или нескольких свойств используем updateOne/updateMany. Если нужно обновить только один документ(первый по выборке) используем updateOne, если несколько документов(все по выборке), то используем updateMany.

// db.collection_name.updateOne({filter}, {update})
// db.collection_name.updateMany({filter}, {update})

// $set - если нужно обновить отдельное поле, или если обновляемого поля нет, то оно создается
// $inc - для увеличения значения числового поля на определенное кол/во единиц, если обновляемого поля нет, то оно создается
// $unset - для удаления поля

// Изменить дожность на 'Sales Manager' для сотрудника с именем Marina
db.workers.updateOne({firstname: 'Marina'}, {$set: {position: 'Sales Manager'}})

// Увеличить зарплату сотрудника с именем Tom на 1000
db.workers.updateOne({firstname: 'Tom'}, {$inc: {salary: 1000}})

// Уменьшить зарплату сотурдника с именем Marina на 500
db.workers.updateOne({firstname: 'Marina'}, {$inc: {salary: -500}})

// Удалить поле age для сотрудника с именем Olga
db.workers.updateOne({firstname: 'Olga'}, {$unset: {age: 1}})
// 1 - true

// Всем сотрудникам, которым больше 25, увеличить зарплату на 700.
db.workers.updateMany({age: {$gt: 25}}, {$inc: {salary: 700}})

// Всем сотрудникам добавить новое поле commission со значением 0.
db.workers.updateMany({}, {$set: {commission: 0}})

// Изменить значение commission на 10 для сотрудников с зарплатой выше 3000.
db.workers.updateMany({salary: {$gt: 3000}}, {$set: {commission: 10}})

// Удалить поле position для сотрудника с именем Olga
db.workers.updateOne({firstname: 'Olga'}, {$unset: {position: 1}})

// Удалить поле commission у всех сотрудников, кроме Tom
db.workers.updateMany({firstname: {$ne: 'Tom'}}, {$unset: {commission: 1}})
