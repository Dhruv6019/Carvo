import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE user (
            id int NOT NULL AUTO_INCREMENT,
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            role enum ('admin', 'customer', 'seller', 'service_provider', 'delivery_boy', 'support_agent') NOT NULL DEFAULT 'customer',
            name varchar(255) NOT NULL,
            phone varchar(255) NULL,
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
            UNIQUE INDEX IDX_e12875dfb3b1d92d7d7c5377e2 (email),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        // Profiles
        await queryRunner.query(`CREATE TABLE customer_profile (
            id int NOT NULL AUTO_INCREMENT,
            address varchar(255) NULL,
            userId int NOT NULL,
            UNIQUE INDEX REL_customer_user (userId),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE seller_profile (
            id int NOT NULL AUTO_INCREMENT,
            business_name varchar(255) NOT NULL,
            registration_number varchar(255) NULL,
            address varchar(255) NULL,
            userId int NOT NULL,
            UNIQUE INDEX REL_seller_user (userId),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE service_provider_profile (
            id int NOT NULL AUTO_INCREMENT,
            company_name varchar(255) NOT NULL,
            service_types text NULL,
            address varchar(255) NULL,
            userId int NOT NULL,
            UNIQUE INDEX REL_provider_user (userId),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE delivery_profile (
            id int NOT NULL AUTO_INCREMENT,
            vehicle_type varchar(255) NULL,
            license_number varchar(255) NULL,
            userId int NOT NULL,
            UNIQUE INDEX REL_delivery_user (userId),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE support_profile (
            id int NOT NULL AUTO_INCREMENT,
            employee_id varchar(255) NULL,
            userId int NOT NULL,
            UNIQUE INDEX REL_support_user (userId),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        // Catalog
        await queryRunner.query(`CREATE TABLE category (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description varchar(255) NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE car (
            id int NOT NULL AUTO_INCREMENT,
            make varchar(255) NOT NULL,
            model varchar(255) NOT NULL,
            year int NOT NULL,
            base_price decimal(10,2) NOT NULL,
            image_url varchar(255) NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE part (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            description varchar(255) NULL,
            price decimal(10,2) NOT NULL,
            stock_quantity int NOT NULL,
            image_url varchar(255) NULL,
            categoryId int NOT NULL,
            sellerId int NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        // Customization
        await queryRunner.query(`CREATE TABLE customization (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            configuration json NOT NULL,
            preview_token varchar(255) NULL,
            customerId int NOT NULL,
            carId int NOT NULL,
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        // Business Logic
        await queryRunner.query(`CREATE TABLE quotation (
            id int NOT NULL AUTO_INCREMENT,
            estimated_price decimal(10,2) NULL,
            status enum ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            customerId int NOT NULL,
            customizationId int NOT NULL,
            providerId int NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE booking (
            id int NOT NULL AUTO_INCREMENT,
            scheduled_date datetime NOT NULL,
            status enum ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            customerId int NOT NULL,
            providerId int NOT NULL,
            quotationId int NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE \`order\` (
            id int NOT NULL AUTO_INCREMENT,
            total_amount decimal(10,2) NOT NULL,
            status enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
            shipping_address varchar(255) NOT NULL,
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            customerId int NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE order_item (
            id int NOT NULL AUTO_INCREMENT,
            quantity int NOT NULL,
            price decimal(10,2) NOT NULL,
            orderId int NOT NULL,
            partId int NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE payment (
            id int NOT NULL AUTO_INCREMENT,
            amount decimal(10,2) NOT NULL,
            method varchar(255) NOT NULL,
            status enum ('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
            transaction_id varchar(255) NULL,
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            orderId int NULL,
            bookingId int NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE complaint (
            id int NOT NULL AUTO_INCREMENT,
            subject varchar(255) NOT NULL,
            description text NOT NULL,
            status enum ('open', 'in_progress', 'resolved') NOT NULL DEFAULT 'open',
            priority varchar(255) NOT NULL DEFAULT 'medium',
            created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            customerId int NOT NULL,
            agentId int NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        await queryRunner.query(`CREATE TABLE audit_log (
            id int NOT NULL AUTO_INCREMENT,
            action varchar(255) NOT NULL,
            details text NULL,
            timestamp datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            userId int NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB`);

        // Foreign Keys
        await queryRunner.query(`ALTER TABLE customer_profile ADD CONSTRAINT FK_customer_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE seller_profile ADD CONSTRAINT FK_seller_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE service_provider_profile ADD CONSTRAINT FK_provider_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE delivery_profile ADD CONSTRAINT FK_delivery_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE support_profile ADD CONSTRAINT FK_support_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE part ADD CONSTRAINT FK_part_category FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE part ADD CONSTRAINT FK_part_seller FOREIGN KEY (sellerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE customization ADD CONSTRAINT FK_customization_customer FOREIGN KEY (customerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE customization ADD CONSTRAINT FK_customization_car FOREIGN KEY (carId) REFERENCES car(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE quotation ADD CONSTRAINT FK_quotation_customer FOREIGN KEY (customerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE quotation ADD CONSTRAINT FK_quotation_customization FOREIGN KEY (customizationId) REFERENCES customization(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE quotation ADD CONSTRAINT FK_quotation_provider FOREIGN KEY (providerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE booking ADD CONSTRAINT FK_booking_customer FOREIGN KEY (customerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE booking ADD CONSTRAINT FK_booking_provider FOREIGN KEY (providerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE booking ADD CONSTRAINT FK_booking_quotation FOREIGN KEY (quotationId) REFERENCES quotation(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT FK_order_customer FOREIGN KEY (customerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE order_item ADD CONSTRAINT FK_order_item_order FOREIGN KEY (orderId) REFERENCES \`order\`(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE order_item ADD CONSTRAINT FK_order_item_part FOREIGN KEY (partId) REFERENCES part(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE payment ADD CONSTRAINT FK_payment_order FOREIGN KEY (orderId) REFERENCES \`order\`(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE payment ADD CONSTRAINT FK_payment_booking FOREIGN KEY (bookingId) REFERENCES booking(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE complaint ADD CONSTRAINT FK_complaint_customer FOREIGN KEY (customerId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE complaint ADD CONSTRAINT FK_complaint_agent FOREIGN KEY (agentId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE audit_log ADD CONSTRAINT FK_audit_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE audit_log`);
        await queryRunner.query(`DROP TABLE complaint`);
        await queryRunner.query(`DROP TABLE payment`);
        await queryRunner.query(`DROP TABLE order_item`);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE booking`);
        await queryRunner.query(`DROP TABLE quotation`);
        await queryRunner.query(`DROP TABLE customization`);
        await queryRunner.query(`DROP TABLE part`);
        await queryRunner.query(`DROP TABLE car`);
        await queryRunner.query(`DROP TABLE category`);
        await queryRunner.query(`DROP TABLE support_profile`);
        await queryRunner.query(`DROP TABLE delivery_profile`);
        await queryRunner.query(`DROP TABLE service_provider_profile`);
        await queryRunner.query(`DROP TABLE seller_profile`);
        await queryRunner.query(`DROP TABLE customer_profile`);
        await queryRunner.query(`DROP TABLE user`);
    }
}
