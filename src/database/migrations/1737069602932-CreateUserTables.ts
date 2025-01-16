import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTables1737069602932 implements MigrationInterface {
  name = 'CreateUserTables1737069602932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now', "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
