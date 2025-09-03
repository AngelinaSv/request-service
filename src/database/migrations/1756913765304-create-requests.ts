import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRequests1756913765304 implements MigrationInterface {
  private table = new Table({
    name: 'requests',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
      },
      {
        name: 'text',
        type: 'text',
      },
      {
        name: 'status',
        type: 'enum',
        enum: ['new', 'in_progress', 'done'],
        default: 'new',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "requests_status_enum" AS ENUM('new', 'in_progress', 'done');`,
    );
    await queryRunner.query(`
      CREATE TABLE "requests" (
        "id" SERIAL PRIMARY KEY,
        "text" TEXT NOT NULL,
        "status" "requests_status_enum" NOT NULL DEFAULT 'new'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "requests";`);
    await queryRunner.query(`DROP TYPE "requests_status_enum";`);
  }
}
