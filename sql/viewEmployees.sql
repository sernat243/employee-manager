SELECT
    e.id,
    e.first_name,
    e.last_name,
    r.title AS title,
    d.name AS department,
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employees e
JOIN roles r ON e.role_id = r.id
LEFT JOIN employees m ON e.manager_id = m.id
JOIN departments d ON r.department_id = d.id;