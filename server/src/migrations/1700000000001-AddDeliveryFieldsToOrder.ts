import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddDeliveryFieldsToOrder1700000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("order", new TableColumn({
            name: "deliveryAgentId",
            type: "int",
            isNullable: true
        }));

        await queryRunner.addColumn("order", new TableColumn({
            name: "trackingNumber",
            type: "varchar",
            isNullable: true
        }));

        await queryRunner.createForeignKey("order", new TableForeignKey({
            columnNames: ["deliveryAgentId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("order");
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("deliveryAgentId") !== -1);
        await queryRunner.dropForeignKey("order", foreignKey!);
        await queryRunner.dropColumn("order", "trackingNumber");
        await queryRunner.dropColumn("order", "deliveryAgentId");
    }
}
