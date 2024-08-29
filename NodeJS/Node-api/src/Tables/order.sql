

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_status_id` int(11) NOT NULL,
  `payment_methode_id` int(11) NOT NULL,
  `invvoice_no` varchar(120) NOT NULL,
  `order_total` decimal(10,0) NOT NULL,
  `comment` text NOT NULL,
  `firstname` varchar(120) NOT NULL,
  `lastname` varchar(120) NOT NULL,
  `telelphone` varchar(18) NOT NULL,
  `address_des` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`);

ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
