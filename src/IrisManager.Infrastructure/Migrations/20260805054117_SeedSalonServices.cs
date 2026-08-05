using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IrisManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedSalonServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Customers",
                columns: new[] { "Id", "Email", "IsActive", "Name", "Phone" },
                values: new object[,]
                {
                    { 1, "maria@correo.com", true, "María Pérez", "809-555-0101" },
                    { 2, "juan@correo.com", true, "Juan Rodríguez", "809-555-0202" }
                });

            migrationBuilder.InsertData(
                table: "Services",
                columns: new[] { "Id", "Description", "DurationMinutes", "Name", "Price" },
                values: new object[,]
                {
                    { 1, null, 0, "Lavado y Secado", 500m },
                    { 2, null, 0, "Corte de Cabello (Dama)", 800m },
                    { 3, null, 0, "Corte de Cabello (Caballero)", 400m },
                    { 4, null, 0, "Corte de Puntas", 300m },
                    { 5, null, 0, "Peinado Elaborado / Eventos", 1200m },
                    { 6, null, 0, "Tinte Completo", 2500m },
                    { 7, null, 0, "Retoque de Raíces", 1200m },
                    { 8, null, 0, "Highlights / Rayitos", 3000m },
                    { 9, null, 0, "Balayage", 4500m },
                    { 10, null, 0, "Aplicación de Keratina", 3500m },
                    { 11, null, 0, "Cirugía Capilar / Botox", 3000m },
                    { 12, null, 0, "Tratamiento Profundo (Mascarilla)", 600m },
                    { 13, null, 0, "Manicura Regular", 400m },
                    { 14, null, 0, "Pedicura Regular", 600m },
                    { 15, null, 0, "Uñas Acrílicas", 1500m },
                    { 16, null, 0, "Relleno de Acrílico", 900m },
                    { 17, null, 0, "Esmaltado en Gel", 700m },
                    { 18, null, 0, "Retiro de Acrílico / Gel", 300m },
                    { 19, null, 0, "Diseño y Depilación de Cejas", 300m },
                    { 20, null, 0, "Tintado de Cejas", 400m },
                    { 21, null, 0, "Depilación Facial (Cera)", 500m },
                    { 22, null, 0, "Postura de Pestañas (Pelo a Pelo)", 1800m },
                    { 23, null, 0, "Maquillaje Profesional", 2500m }
                });

            migrationBuilder.InsertData(
                table: "Stylists",
                columns: new[] { "Id", "Email", "IsActive", "Name", "Phone", "Specialty" },
                values: new object[,]
                {
                    { 1, "", true, "Ana (Especialista en Uñas)", "", "" },
                    { 2, "", true, "Carmen (Colorista y Peluquera)", "", "" },
                    { 3, "", true, "Luis (Barbero)", "", "" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Customers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Stylists",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
