// Проекция
// db.collection.find({Условие}, {Проекция})
// Проекция - {column1: 1, column2: 0}

// Пагинация
// Документов
// db.collection.find().limit() - кол/во документов, которое нужно вывести
// db.collection.find().skip() - кол/во док. которое нужно пропустить

// Массивов
// db.collection.find({Условие}, {$slice: limit/[skip, limit]})

// Сортировка
// db.collection.find().sort({column1: 1/-1})

// Обновление данных 

// updateOne({filter}, {update})
// updateMany({filter}, {update})

// $set
// $inc
// $unset


// Обновление массивов

// https://github.com/annykh/GenTech-171023/blob/main/MongoDB/employees.txt

// updateOne({filter}, {update})
// updateMany({filter}, {update})

// $push - добавление элемента в массив
// $addToSet - добавление элемента в массив без дубликатов
// $pop - удаление первого или последнего элемента
// $pull - удаление каждого вхождение элемента в массив (только одно начение)
// $pullAll - удаление каждого вхождение элемента в массив (несколько значений)

// Добавить новый навык сотруднику Bob со значением 'team working'.
db.emp1.updateOne({name: 'Bob'}, {$push: {skills: 'team working'}})

// db.emp1.updateOne({name: 'Bob'}, {$push: {age: 25}})
// The field 'age' must be an array but is of type int in document 

// Добавить новые навыки сотруднику John со значениями creativity, Javascript.
db.emp1.updateOne(
    {name: 'John'}, 
    {$push: 
        {skills: 
            {$each: ['creativity', 'Javascript']}
        }
    }
)

db.emp1.updateOne(
    {name: 'John'}, 
    {$addToSet: 
        {skills: 
            {$each: ['creativity', 'Javascript']}
        }
    }
)

// Добавить новые навыки сотруднику John со значениями creativity, Javascript и leadership, если таких навыков нет в массиве.

db.emp1.updateOne(
    {name: 'John'}, 
    {$addToSet: 
        {skills: 
            {$each: ['creativity', 'Javascript', 'leadership']}
        }
    }
)

// Добавить новые навыки сотруднику Maria со значениями 'teamwork', 'programming', 'Java', если их нет в массиве.
db.emp1.updateOne(
    {name: 'Maria'}, 
    {$addToSet: 
        {skills: 
            {$each: ['teamwork', 'programming', 'Java']}
        }
    }
)

// Добавить новый проект 'Project F' для всех сотрудников.
db.emp1.updateMany({}, {$addToSet: {projects: 'Project F'}})

// Добавить новые навыки "leadership", "creativity" для сотрудников из отдела "HR"
db.emp1.updateMany({department: 'HR'}, {$addToSet: {skills: {$each: ["leadership", "creativity"]}}})

// $pop - 1(последний), -1(перывый)

// Удалить первый проект сотрудника Bob
db.emp1.updateOne({name: 'Bob'}, {$pop: {projects: -1}})

// Удалить последний проект сотрудника Alice
db.emp1.updateOne({name: 'Alice'}, {$pop: {projects: 1}})

//Удалить навык creativity у John
db.emp1.updateOne({name: 'John'}, {$pull: {skills: 'creativity'}})

//Удалить навыки organization, teamwork у Maria.
db.emp1.updateOne(
    {name: 'Maria'}, 
    {$pullAll: 
        {skills: ['organization', 'teamwork']}
    }
)

// Удалить проекты "Project A", "Project B" у Alice.
db.emp1.updateOne({name: 'Alice'}, {$pullAll: {projects: ["Project A", "Project B"]}})

// Удалить проект "Project F" у всех.
db.emp1.updateMany({}, {$pull: {projects: "Project F"}})



// Агрегация и группировка

// count

// Кол/во всех документов в коллекции
db.emp1.countDocuments()
db.emp1.find().count()

// кол/во сотрудников, которым больше 30
db.emp1.find({age: {$gt: 30}}).count()

db.collection.aggregate()

// $match - фильтрация/условие
// $project - проекция
// $skip - пагинация
// $limit - пагинация
// $sort - сортировка
// $group - группировка

// avg
// sum
// min/max

// Вывести имя и возраст сотрудников, где возраст больше 30 и сортировать по возрасту по убыв.

db.emp1.find({age: {$gt: 30}}, {name: 1, age: 1, _id: 0}).sort({age: -1})

db.emp1.aggregate([
    {$match: {age: {$gt: 30}}},
    {$project: {name: 1, age: 1, _id: 0}},
    {$sort: {age: -1}}
])

// https://github.com/annykh/GenTech-171023/blob/main/MongoDB/workers2.txt

// {$group: {_id: '$название_поля'/null, имя_нового_поля: {$агрегатная_функция: {'$поле'}}}}

// $название_поля - поле по которому группируем
// null - если нет группировки
// имя_нового_поля - команда AS в mysql
// агрегатная_функция - sum, avg, min, max
// $поле - по которому выполняется агр. функция

// Найти сумму зарплаты всех сотрудников.
db.workers2.aggregate([
    {$group: {_id: null, total_sum: {$sum: '$salary'}}}
])

// Найти суммы зарплат по position.
db.workers2.aggregate([
    {$group: {_id: '$position', total_sum: {$sum: '$salary'}}}
])

// Найти суммы зарплат по position. Сотрировать по убыв. суммы.
db.workers2.aggregate([
    {$group: {_id: '$position', total_sum: {$sum: '$salary'}}},
    {$sort: {total_sum: -1}}
])

// Найти и вывести суммы зарплат по position, если position либо Server, либо IT programmer

db.workers2.aggregate([
    {$match: {position: {$in: ['Server', 'IT programmer']}}},
    {$group: {_id: '$position', total_sum: {$sum: '$salary'}}}
])

db.workers2.aggregate([
    {$group: {_id: '$position', total_sum: {$sum: '$salary'}}},
    {$match: {_id: {$in: ['Server', 'IT programmer']}}}
])

// Вывести сумму зарплат сотрудников по position, если сумма больше 3000.
db.workers2.aggregate([
    {$group: {_id: '$position', total_sum: {$sum: '$salary'}}},
    {$match: {total_sum: {$gt: 3000}}}
])

// select position, sum(salary) as total_sum
// from workers2
// group by position
// having total_sum > 3000;

// Найти и вывести среднее значение salary , для сотрудников старше 40, сгруппировать по position.

db.workers2.aggregate([
    {$match: {age: {$gt: 40}}},
    {$group: {_id: '$position', avg_salary: {$avg: '$salary'}}}
])

// Найти средний возраст сотрудников по каждой должности(position) и отсортировать по среднему возрасту по убыванию.

db.workers2.aggregate([
    {$group: {_id: '$position', avg_age: {$avg: '$age'}}},
    {$sort: {avg_age: -1}}
])

// Отобразить только имена и фамилии сотрудников, зарабатывающих больше 5000, и отсортировать их по зарплате по возрастанию.

db.workers2.aggregate([
    {$match: {salary: {$gt: 5000}}},
    {$project: {firstname: 1, lastname: 1, _id: 0}},
    {$sort: {salary: 1}}
])
