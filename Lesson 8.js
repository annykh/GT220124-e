// MONGODB

// 1. use db_name - команда для создания БД или для того чтоб переключиться между бд 
// 2. cls - Очищает скрипт/консоль
// 3. show databases - Показывает все БД
// 4. show collections - Показывает все коллекции в БД
// 5. db.createCollection('collection_name') - Создаем пустую коллекцию
// 6. db.collection_name.insertOne({}) - Вставляет один объект/документ в коллекцию
// 7. db.collection_name.insertMany([{},{},...]) - Вставляет несколько объектов/дкументов в коллекцию. Добавляем через массив из обьектов.
// 8. db.collection_name.drop() - Удалит коллекцию
// 9. db.dropDatabase() - Удалит бд
// 10. db.collection_name.deleteOne({Условие}) - удалит первую запись соответсувующий запросу
// 11. db.collection_name.deleteMany({Условие}) - удалит все записи соответсувующие запросу
// 12. db.collection_name.find({Условие}) - Выборка по условию 


// MYSQL
// 1. create database database_name;
// 1. use database_name;
// 5. create table table_name()
// 6. 7. insert into table_name values (...), (...), (...)
// 8. drop table table_name;
// 9. drop database db_name;
// 10. 11. delete from table_name where ....
// 12. select * from table_name where ...

// use GT220124

db.createCollection('user')

db.user.insertOne({
    name: 'John',
    lastName: 'Smith',
    age: 18,
    address: {
        building: 1,
        street: 'Burbank 12/34'
    }
})

// имя : Bob
// фамилия: Brown
// возраст: 20,
// адрес: дом: 2, улица: 'Gran Via 10'

db.user.insertOne({   
    name: 'Bob',
    lastName: 'Brown',
    age: 20,
    address: {
        building: 2, 
        street: 'Gran Via 10'
        }
})

db.user.insertMany([
    {
        name: 'James',
        lastName: 'Hardy',
        age: 26,
        address: {
            building: 3, 
            street: 'Gran Via 11/10'
            }
    },
    {
        name: 'Tom',
        lastName: 'Jameson',
        age: 34,
        address: {
            building: 1, 
            street: 'Main street 1'
            }
    },
    {
        name: 'Ben',
        lastName: 'Smith',
        age: 32,
        address: {
            building: 2, 
            street: 'Gran Via 20'
            }
    }
])

db.products.insertOne({
    title: 'Notebook',
    price: 1000
})

// Создать коллекцию fruits и заполнить документами со следующими свойствами: 
// _id, title, price, count. Используйте следующие данные:
	
// 1 Apple 280 4
// 2 Lemon 300 8
// 3 Lime 500 3
// 4 Orange 200 8

db.fruits.insertMany([
    {
        _id: 1,
        title: 'Apple',
        price: 280,
        count: 4
    },
    {
        _id: 2,
        title: 'Lemon',
        price: 300,
        count: 8
    },
    {
        _id: 3,
        title: 'Lime',
        price: 500,
        count: 3
    },
    {
        _id: 4,
        title: 'Orange',
        price: 200,
        count: 8
    }
])

db.products.drop()

// Удалить пользователя с именем Bob
db.user.deleteOne({name: 'Bob'}) //name = 'Bob'

// Удалить всех пользователей с фамилией Smith
db.user.deleteMany({lastName: 'Smith'})

// Вывести всех пользователей из коллекции user
db.user.find()

// Вывести пользователя с именем Tom
db.user.find({name: 'Tom'})

// Создание коллекции
// https://github.com/annykh/GenTech-171023/blob/main/MongoDB/workers.txt

// Операторы сравнения

// $eq : значения равны - equal
// $ne : значения не равны - not equal
// $gt : значение больше другого значения - greater than
// $gte : значение больше или равно другому значению - greater than equal
// $lt : значение меньше другого значения - less than
// $lte : значение меньше или равно другому значению - less than equal
// $in : значение соответствует одному из значений в массиве

// db.collection_name.find({key: {$op: value}})

// Из коллекции workers вывести работников, чьи зарплаты больше 2000.
db.workers.find({salary: {$gt: 2000}})

// Найти работников младше 30 лет.
db.workers.find({age: {$lt: 30}})

// Логические операторы

// $and : возвращает документы, в которых выполняются оба условия
// $or : возвращает документы, в которых выполняется хотя бы одно условие
// $nor : возвращает документы, в которых оба условия не выполняются
// $not : возвращает документы, в которых условие не выполняется

// Вывести работников, чьи возрасты находятся в диапазоне от 30 до 45(вкл. концы).
db.workers.find(
    {
        $and: [
            {age: {$gte: 30}}, 
            {age: {$lte: 45}}
        ]
    }
)

db.workers.find({age: {$gte: 30, $lte: 45}})

// Найти работников, чьи зарплаты либо меньше 2000, либо больше 3000(концы не вкл.).
db.workers.find(
    {
        $or: [
            {salary: {$lt: 2000}},
            {salary: {$gt: 3000}}
        ]
    }
)

// Найти всех работников, у которых должность "Server" или "Chef"
db.workers.find(
    {
        $or: [
            {position: 'Server'},
            {position: 'Chef'}
        ]
    }
)

db.workers.find({position: {$in: ['Server', 'Chef']}})

// Найти всех работников, у которых должность не равна "Server" или "Chef"

db.workers.find({
    $nor: [
        {position: {$eq: 'Server'}},
        {position: {$eq: 'Chef'}}
    ]
})

db.workers.find({position: {$not: {$in: ['Server', 'Chef']}}})

// Найти всех работников, чья зарплата меньше 3000 или возраст больше 40.
db.workers.find({
    $or: [
        {salary: {$lt: 2000}},
        {age: {$gt: 40}}
    ]
})
