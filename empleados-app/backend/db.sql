DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INT NOT NULL,
  area TEXT NOT NULL,
  seniority_years INT NOT NULL,
  phone TEXT NOT NULL
);

INSERT INTO employees (full_name, age, area, seniority_years, phone) VALUES
('Ana Pérez', 29, 'Data', 2, '+54 9 351 111-1111'),
('Luis Gómez', 34, 'Data', 5, '+54 9 351 222-2222'),
('Marta Ruiz', 41, 'IT',   8, '+54 9 351 333-3333'),
('Juan Soto',  26, 'IT',   1, '+54 9 351 444-4444'),
('Irene Gil',  31, 'HR',   4, '+54 9 351 555-5555');
