-- https://github.com/NelliEfr/hr_data/blob/master/script.sql

use hr;

-- avg
-- sum
-- count
-- min
-- max

-- select column1, column2,...
-- from table1
-- where column1 =/>/< (select aggregate(column) from table1);

-- Вывести департамент где работает сотрудник с самой высокой зарплатой.
-- 1. Найти самую высокую зарплату.
select max(salary) 
from employees;

-- 2. Вывести сотрудника с самой высокой зп.
select first_name, last_name
from employees
where salary = (select max(salary) 
				from employees);
                
-- 3. Вывести департамент...
select t1.department_name
from departments t1
join employees t2
on t1.department_id = t2.department_id
where t2.salary = (select max(salary) 
				from employees);
                
-- Вывести город, где работает сотрудник с самой низкой зарплатой.
select city 
from locations t1
join departments t2
on t1.location_id = t2.location_id
join employees t3
on t2.department_id = t3.department_id
where t3.salary = (select min(salary) from employees);

-- ГРУППИРОВКА
-- group by

-- select columns
-- from table
-- [joins..]
-- [where..]
-- group by
-- [having ..]
-- [order by]
-- [limit]

-- Посчитать кол/во сотурников в каждом департаменте. Вывеси ид департамента и кол/во сотрудников.
select department_id, count(employee_id)
from employees
group by department_id;

-- Вывести кол/во сотрудников из департаментов 10, 20, 40, 100 по отдельности.
select department_id, count(*)
from employees
where department_id in (10, 20, 40, 100)
group by department_id;

-- Вывести кол/во сотрудников в каждом департаменте, если кол/во больше 10.
select department_id, count(*)
from employees
group by department_id
having count(*) > 10;

-- Вывести максимальные зарплаты каждого департамента
-- department_id, max_salary
select department_id, max(salary) as max_salary
from employees
group by department_id;

-- Вывести максимальные зарплаты каждого департамента. сортировать по зарплатам по возр.
select department_id, max(salary) as max_salary
from employees
group by department_id
order by max_salary;

-- Найти среднее зарплат по департаментам.
-- Вывести department_id, avg_salary
select department_id, avg(salary) as avg_salary
from employees
group by department_id;

-- Посчитать кол/во сотурников в каждом департаменте. Вывести имя департамента и кол/во сотрудников.
select t1.department_name, count(*) as emp_count
from departments t1
join employees t2
on t1.department_id = t2.department_id
group by t1.department_name;

-- Вывести имена департаментов и минимальные зарплаты в этих департаментах, если они больше 5000.
select t1.department_name, min(t2.salary) as min_salary
from departments t1
join employees t2
on t1.department_id = t2.department_id
group by t1.department_name
having min_salary > 5000;


-- Найти минимальные зарплаты для каждой должности. job_id, min_salary
select job_id, min(salary) as min_salary
from employees
group by job_id;

-- Найти сотрудников с минимальной зарплатой каждой должности(job_id). Вывести first_name, last_name, salary, job_id
select t1.first_name, t1.last_name, t1.salary, t1.job_id
from employees t1
join (select job_id, min(salary) as min_salary
		from employees
		group by job_id) t2
on t1.job_id = t2.job_id
where t1.salary = t2.min_salary;

-- Найти имена и фамилии сотрудников с максмальной зарплатой в каждом департаменте
select t1.first_name, t1.last_name
from employees t1
join (select department_id, max(salary) as max_salary
		from employees
		group by department_id) t2
on t1.department_id = t2.department_id and t1.salary = t2.max_salary;

-- Посчитать кол/во городов в каждой стране из таблицы locations. Вывести city_count(as), country_id
select count(city) as city_count, country_id
from locations
group by country_id;

-- Посчитать кол/во городов в каждой стране. 
-- Вывести только те страны(country_name), где кол/во городов больше 2.
select country_name, count(city) as city_count
from countries t1
join locations t2
on t1.country_id = t2.country_id
group by country_name
having city_count > 2;

select country_name
from countries t1
join (select count(city) as city_count, country_id
		from locations
		group by country_id
        having city_count > 2) t2
on t1.country_id = t2.country_id;

-- Найти департамент с наибольшим кол/вом сотрудников.
select department_id, count(employee_id) as emp_count
from employees
group by department_id
order by emp_count desc
limit 1;

-- 1. Найти максимальное кол/во сотрудников среди департаментов.
select max(t1.emp_count)
from (select department_id, count(employee_id) as emp_count
		from employees
		group by department_id) t1;

-- 2. Вывести ид департамента с макс. кол/вом сотрудников.
select department_id, count(employee_id) as emp_count
from employees
group by department_id
having emp_count = (select max(t1.emp_count)
					from (select department_id, count(employee_id) as emp_count
							from employees
							group by department_id) t1);

-- 3. Вывести имя департамента с макс. кол/вом сотрудников.
select department_name
from departments t1
join (select department_id, count(employee_id) as emp_count
		from employees
		group by department_id
		having emp_count = (select max(t1.emp_count)
							from (select department_id, count(employee_id) as emp_count
									from employees
									group by department_id) t1)) t2
on t1.department_id = t2.department_id;

-- Найти департаменты, в которых больше 10 сотрудников. Вывести имя департамента.
select t1.department_name
from departments t1
join (select department_id, count(*) as emp_count
		from employees
		group by department_id
        having emp_count > 10) t2
on t1.department_id = t2.department_id;
