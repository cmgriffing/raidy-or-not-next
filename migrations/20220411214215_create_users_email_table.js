async function up(knex) {
  return knex.schema.createTable("users_email", function (table) {
    table.string("twitch_id").notNullable();
    table
      .foreign("twitch_id")
      .references("twitch_id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.integer("created_at").unsigned().notNullable();
    table.integer("modified_at").unsigned().notNullable();

    table.string("email", 255).notNullable();
  });
}
module.exports.up = up;

async function down(knex) {
  knex.schema.dropTable("users_email");
}
module.exports.down = down;
