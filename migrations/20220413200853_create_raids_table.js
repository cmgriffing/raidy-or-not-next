async function up(knex) {
  return knex.schema.createTable("raids", function (table) {
    table.specificType("twitch_id", "char(32)").notNullable();
    table
      .foreign("twitch_id")
      .references("twitch_id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.specificType("from_twitch_channel", "char(32)").notNullable();
    table.index(["from_twitch_channel"]);
    table.specificType("to_twitch_channel", "char(32)").notNullable();
    table.index(["to_twitch_channel"]);

    table.integer("created_at").unsigned().notNullable();
    table.integer("modified_at").unsigned().notNullable();

    table.integer("raid_amount").unsigned().notNullable();
  });
}
module.exports.up = up;

async function down(knex) {
  knex.schema.dropTable("raids");
}
module.exports.down = down;
