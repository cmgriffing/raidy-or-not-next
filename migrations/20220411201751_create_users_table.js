async function up(knex) {
  return knex.schema.createTable("users", function (table) {
    table.specificType("twitch_id", "char(32)").notNullable().primary();
    table.specificType("twitch_name", "char(32)").notNullable();

    table.integer("created_at").unsigned().notNullable();
    table.integer("modified_at").unsigned().notNullable();
  });
}
module.exports.up = up;

async function down(knex) {
  knex.schema.dropTable("users");
}
module.exports.down = down;
