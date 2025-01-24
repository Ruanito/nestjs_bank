import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndAccountsTable1737676054064
  implements MigrationInterface
{
  name = 'CreateUserAndAccountsTable1737676054064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_accounttype_enum" AS ENUM('Saving', 'Checking')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_currency_enum" AS ENUM('BRL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_status_enum" AS ENUM('Active', 'Closed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountNumber" character varying NOT NULL, "accountType" "public"."accounts_accounttype_enum" NOT NULL DEFAULT 'Saving', "currency" "public"."accounts_currency_enum" NOT NULL DEFAULT 'BRL', "balance" bigint NOT NULL DEFAULT '0', "status" "public"."accounts_status_enum" NOT NULL DEFAULT 'Active', "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TYPE "public"."accounts_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."accounts_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."accounts_accounttype_enum"`);
  }
}
