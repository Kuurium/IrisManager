using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IrisManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedStylistsAndServiceRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceStylist",
                columns: table => new
                {
                    ServicesId = table.Column<int>(type: "int", nullable: false),
                    StylistsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceStylist", x => new { x.ServicesId, x.StylistsId });
                });

            migrationBuilder.InsertData(
                table: "ServiceStylist",
                columns: new[] { "ServicesId", "StylistsId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 1, 2 },
                    { 1, 3 },
                    { 1, 4 },
                    { 2, 1 },
                    { 2, 2 },
                    { 2, 3 },
                    { 2, 4 },
                    { 3, 1 },
                    { 3, 2 },
                    { 3, 3 },
                    { 3, 4 },
                    { 4, 1 },
                    { 4, 2 },
                    { 4, 3 },
                    { 4, 4 },
                    { 5, 1 },
                    { 5, 2 },
                    { 5, 3 },
                    { 5, 4 },
                    { 6, 1 },
                    { 6, 2 },
                    { 6, 3 },
                    { 6, 4 },
                    { 7, 1 },
                    { 7, 2 },
                    { 7, 3 },
                    { 7, 4 },
                    { 8, 1 },
                    { 8, 2 },
                    { 8, 3 },
                    { 8, 4 },
                    { 9, 1 },
                    { 9, 2 },
                    { 9, 3 },
                    { 9, 4 },
                    { 10, 1 },
                    { 10, 2 },
                    { 10, 3 },
                    { 10, 4 },
                    { 11, 1 },
                    { 11, 2 },
                    { 11, 3 },
                    { 11, 4 },
                    { 12, 1 },
                    { 12, 2 },
                    { 12, 3 },
                    { 12, 4 },
                    { 13, 5 },
                    { 13, 6 },
                    { 13, 7 },
                    { 13, 8 },
                    { 14, 5 },
                    { 14, 6 },
                    { 14, 7 },
                    { 14, 8 },
                    { 15, 5 },
                    { 15, 6 },
                    { 15, 7 },
                    { 15, 8 },
                    { 16, 5 },
                    { 16, 6 },
                    { 16, 7 },
                    { 16, 8 },
                    { 17, 5 },
                    { 17, 6 },
                    { 17, 7 },
                    { 17, 8 },
                    { 18, 5 },
                    { 18, 6 },
                    { 18, 7 },
                    { 18, 8 },
                    { 19, 9 },
                    { 19, 10 },
                    { 19, 11 },
                    { 19, 12 },
                    { 20, 9 },
                    { 20, 10 },
                    { 20, 11 },
                    { 20, 12 },
                    { 21, 9 },
                    { 21, 10 },
                    { 21, 11 },
                    { 21, 12 },
                    { 22, 9 },
                    { 22, 10 },
                    { 22, 11 },
                    { 22, 12 },
                    { 23, 9 },
                    { 23, 10 },
                    { 23, 11 },
                    { 23, 12 }
                });

            migrationBuilder.UpdateData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "Name", "Phone" },
                values: new object[] { "ana@correo.com", "Ana López", "809-555-0101" });

            migrationBuilder.UpdateData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Email", "Name", "Phone" },
                values: new object[] { "sofia@correo.com", "Sofía Martínez", "809-555-0102" });

            migrationBuilder.UpdateData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Email", "Name", "Phone" },
                values: new object[] { "lucia@correo.com", "Lucía Fernández", "809-555-0103" });

            migrationBuilder.InsertData(
                table: "Stylists",
                columns: new[] { "Id", "Email", "IsActive", "Name", "Phone", "Specialty" },
                values: new object[,]
                {
                    { 4, "raquel@correo.com", true, "Raquel Vargas", "809-555-0104", "" },
                    { 5, "marta@correo.com", true, "Marta Gómez", "809-555-0201", "" },
                    { 6, "laura@correo.com", true, "Laura Díaz", "809-555-0202", "" },
                    { 7, "elena@correo.com", true, "Elena Pérez", "809-555-0203", "" },
                    { 8, "valeria@correo.com", true, "Valeria Castro", "809-555-0204", "" },
                    { 9, "carmen@correo.com", true, "Carmen Ruiz", "809-555-0301", "" },
                    { 10, "rosa@correo.com", true, "Rosa Sánchez", "809-555-0302", "" },
                    { 11, "patricia@correo.com", true, "Patricia Ramírez", "809-555-0303", "" },
                    { 12, "daniela@correo.com", true, "Daniela Medina", "809-555-0304", "" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceStylist");

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.UpdateData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Email", "Name", "Phone" },
                values: new object[] { "", "Ana (Especialista en Uñas)", "" });

            migrationBuilder.UpdateData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Email", "Name", "Phone" },
                values: new object[] { "", "Carmen (Colorista y Peluquera)", "" });

            migrationBuilder.UpdateData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Email", "Name", "Phone" },
                values: new object[] { "", "Luis (Barbero)", "" });
        }
    }
}
