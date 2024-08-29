

INSERT INTO `permission` (`name`,`code`,`group`) VALUES 
('Read','Product.Read','product'),
('Create','Product.Create','product'),
('Update','Product.Update','product'),
('Delete','Product.Delete','product'),

('Read','order.Read','order'),
('Create','order.Create','order'),
('Update','order.Update','order'),
('Delete','order.Delete','order'),

('Read','customer.Read','customer'),
('Create','customer.Create','customer'),
('Update','customer.Update','customer'),
('Delete','customer.Delete','customer')


INSERT INTO `permission` (`name`,`code`,`group`) VALUES 
('Read','category.Read','category'),
('Create','category.Create','category'),
('Update','category.Update','category'),
('Delete','category.Delete','category')

INSERT INTO `role_permission` (`role_id`,`permission_id`) VALUES
(1,13),
(1,14),
(1,15),
(1,16),

(1,13),
(1,14),
(1,15)


(1,1),  
(1,2),
(1,3),
(1,4),
(1,5),
(1,6), 
(1,7), 
(1,8), 
(1,9), 
(1,10), 
(1,11), 
(1,12),

(4,1), 
(4,5), 
(4,9);


SELECT c.firstname
FROM customer c 
INNER JOIN role r ON c.role_id = r.role_id 
INNER JOIN role_permission rp ON r.role_id = rp.permission_id 
INNER JOIN permission p ON rp.permission_id = p.permission_id 
WHERE c.customer_id = 1;
