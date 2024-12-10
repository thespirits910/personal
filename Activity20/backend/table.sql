-- -----------------------------------------------------
-- Schema secoms3190
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `secoms3190` DEFAULT CHARACTER SET utf8 ;
USE `secoms3190` ;
-- -----------------------------------------------------
-- Table `secoms3190`.`contact`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `secoms3190`.`contact` (
`id` INT AUTO_INCREMENT,
`contact_name` VARCHAR(255) NOT NULL,
`phone_number` VARCHAR(20) NOT NULL,
`message` TEXT,
`message_timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
`image_url` VARCHAR(255),
PRIMARY KEY (`id`)
);