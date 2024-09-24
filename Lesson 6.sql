use hr;

-- 1. Вывести имена, фамилии сотрудников, имена департаментов и должность сотрудников(job_title)
select first_name, last_name, department_name, job_title
from employees t1
inner join departments t2
on t1.department_id = t2.department_id
inner join jobs t3
on t1.job_id = t3.job_id;

-- 2. Вывести все города, в которых нет департаментов
insert into locations (location_id, street_address, postal_code, city, state_province, country_id)
values (2900, 'Via Grande', null, 'Rome', null, 'IT');

select t1.city, t2.department_name
from locations t1
left join departments t2
on t1.location_id = t2.location_id
where t2.department_name is null;

-- 3. Вывести имя и фамилию сотрудника с максимальной зарплатой из департамента "IT".
select t1.first_name, t1.last_name, t1.salary
from employees t1
inner join departments t2
on t1.department_id = t2.department_id
where t2.department_name = 'IT'
order by t1.salary desc
limit 1;

-- 4. Вывести имена и фамилии сотрудников из департамента "Sales", которые зарабатывают больше 8000.
select t1.first_name, t1.last_name, t1.salary
from employees t1
inner join departments t2
on t1.department_id = t2.department_id
where t2.department_name = 'Sales' and t1.salary > 8000;

-- 5. Вывести имена, фамилии и должность сотрудников, которые зарабатывают ровно минимальную(min_salary) 
-- или масимальную(max_salary) зарплату для должности.
select t1.first_name, t1.last_name, t2.job_title, t1.salary, t2.max_salary, t2.min_salary
from employees t1
join jobs t2
on t1.job_id = t2.job_id
-- where t1.salary = t2.min_salary or t1.salary = t2.max_salary;
where t1.salary in (t2.min_salary, t2.max_salary);

-- SELF JOIN
-- Вывести имена и фамилии сотрудников, а также имена и фамилии их менеджеров
select emp.first_name as emp_first_name, emp.last_name as emp_last_name, mng.first_name as mng_first_name,
mng.last_name as mng_last_name
from employees emp 
join employees mng
on emp.manager_id = mng.employee_id;

-- Вывести имена и фамилии сотрудников, а также имена и фамилии их менеджеров, если сотрудник 
-- зарабатывает больше менеджера.
select emp.first_name as emp_first_name, emp.last_name as emp_last_name, mng.first_name as mng_first_name,
mng.last_name as mng_last_name
from employees emp 
join employees mng
on emp.manager_id = mng.employee_id
where emp.salary > mng.salary;


-- АГРЕГАТНЫЕ ФУНКЦИИ
-- AVG: вычисляет среднее значение
-- SUM: вычисляет сумму значений
-- MIN: вычисляет наименьшее значение
-- MAX: вычисляет наибольшее значение
-- COUNT: вычисляет количество строк в запросе

select * from employees;

-- Вывести максималню зарплату в компании
select max(salary)
from employees;

-- Вывести минимальную зарплату в компании
select min(salary)
from employees;

-- Вывести максималню и минимальную зарплату в компании
select max(salary) as max_salary, min(salary) as min_salary
from employees;

-- Bad practice
select first_name, last_name, min(salary), max(salary)
from employees;

-- Вывести сумму всех зарплат 
select sum(salary)
from employees;

-- Вывести среднее значение зарплат по компании
select avg(salary)
from employees;

-- вывести кол/во сотрудников в компании
select count(employee_id)
from employees;

-- кол/во строк в таблице employees
select count(*)
from employees;

-- Найти максимальную зарплату среди сотрудников из департамента Sales
select max(t1.salary)
from employees t1
join departments t2
on t1.department_id = t2.department_id
where t2.department_name = 'Sales';

-- Найти среднюю зарплату среди сотрудников из департамента IT.
select avg(t1.salary)
from employees t1
join departments t2
on t1.department_id = t2.department_id
where t2.department_name = 'IT';

-- Найти кол/во сотрудников из департамента 'Shipping', которые зарабатывают больше 5000.
select count(*)
from employees t1
join departments t2
on t1.department_id = t2.department_id
where t2.department_name = 'Shipping' and t1.salary > 5000;

-- SUBSELECT/ПОДЗАПРОСЫ

-- select <column_name>, ..
-- from (
-- 		select <column_name>, ...
--         from <table_name>
--         ....
-- ) t1

-- select <column_name>, ...
-- from <table_name>
-- ...
-- where <column_name> = (
-- 	   select aggregate(<column_name>)
--     from <table_name>
-- )

-- Вывести имя и фамилию сотрудникa с маскимальной зарплатой

-- 1. Найти максимальную зарплату
select max(salary)
from employees;

-- 2. Вывести имена, фамилии и зарплаты сотрудников
select first_name, last_name, salary
from employees;

-- 3. Вывести имя, фамилию и зарплату сотрудникa с маскимальной зарплатой
select first_name, last_name, salary
from employees
where salary = (select max(salary) from employees);

-- Найти сотрудников, у которых зарплата меньше средней зарплаты по компании
-- Вывести имя, фамилию и зарплату.

-- 1. Средняя зарплата
select avg(salary)
from employees;

-- 2. Вывести сотрудников
select first_name, last_name, salary
from employees;

-- 3. Решение задачи
select first_name, last_name, salary
from employees
where salary < (select avg(salary) from employees);

-- Найти кол/во сотрудников, у которых зарплата меньше средней зарплаты по компании
select count(*)
from employees
where salary < (select avg(salary) from employees);

-- Найти количество сотрудников из департамента IT, которые зарабатывают больше средней зарплаты по компании
select count(*)
from employees t1
join departments t2
on t1.department_id = t2.department_id
where t2.department_name = 'IT' and t1.salary > (select avg(salary) from employees);

-- Найти количество департаментов, в которых никто не работает

-- 1. Найти департаменты, в которых никто не работает
select department_name, employee_id
from departments t1
left join employees t2
on t1.department_id = t2.department_id
where t2.employee_id is null;

-- 2. Вывести кол/во...
select count(*)
from departments t1
left join employees t2
on t1.department_id = t2.department_id
where t2.employee_id is null;

-- Вывести список сотрудников с должностью "Programmer", 
-- которые получают зарплату выше средней зарплаты среди всех сотрудников с такой же должностью.

-- 1. Найти сотрудников с должностью Programmer
select first_name, last_name
from employees t1
join jobs t2
on t1.job_id = t2.job_id
where t2.job_title = 'Programmer';

-- 2. Найти среднюю зарплату для сотрудников с такой же должностью
select avg(t1.salary)
from employees t1
join jobs t2
on t1.job_id = t2.job_id
where t2.job_title = 'Programmer';

-- 3. Вывеси тех, чья зарплата выше среднего.
select t1.first_name, t1.last_name, t1.salary
from employees t1
join jobs t2
on t1.job_id = t2.job_id
where t2.job_title = 'Programmer' and t1.salary > (select avg(t1.salary)
													from employees t1
													join jobs t2
													on t1.job_id = t2.job_id
													where t2.job_title = 'Programmer');
                                                    
                                                    
-- Д/З                                                    
-- Создать новую базу данных oe.

-- Скачать файл бд:
-- https://github.com/annykh/GT301023-e/blob/main/oe.sql

-- Имортировать базу:
-- Из меню workbench-а выбрать Server -> Data Import.
-- Выбрать Import from Dump Project Folder, нажать на ... и выбрать папку, где хранится база. После нажать на Start Import и обновить SCHEMAS.

-- ЗАДАЧИ:

-- Таблица - customers
-- 1. Вывести максимальный и минимальный credit_limit.
-- 2. Вывести покупателей у которых credit_limit выше среднего credit_limit.
-- 3. Найти кол/во покупателей имя которых начинается на букву 'D' и credit_limit больше 500.

-- Таблица - order_items
-- 4. Найти среднее значение unit_price

-- Таблицы - order_items, product_information
-- 5. Вывести имена продуктов(PRODUCT_NAME), кол/во(QUANTITY) которых меньше среднего.

-- Таблицы - orders, customers
-- 6. Вывести имя и фамилию покупателя с максимальной общей суммой покупки(ORDER_TOTAL).
-- 7. Найти сумму общей суммы покупок(ORDER_TOTAL) всех мужчин покупателей.
