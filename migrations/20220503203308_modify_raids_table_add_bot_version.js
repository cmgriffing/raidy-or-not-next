async function up(knex) {
  return knex.schema.table("raids", function (table) {
    table.specificType("bot_version", "char(32)");
  });
}
module.exports.up = up;

async function down(knex) {
  return knex.schema.table("raids", function (table) {
    table.dropColumn("bot_version");
  });
}
module.exports.down = down;
