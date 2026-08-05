using IrisManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IrisManager.Infrastructure.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Stylist> Stylists { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Phone)
                .IsUnique();

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Service>().HasData(
                new Service { Id = 1, Name = "Lavado y Secado", Price = 500, DurationMinutes = 45 },
                new Service { Id = 2, Name = "Corte de Cabello (Dama)", Price = 800, DurationMinutes = 60 },
                new Service { Id = 3, Name = "Corte de Cabello (Caballero)", Price = 400, DurationMinutes = 30 },
                new Service { Id = 4, Name = "Corte de Puntas", Price = 300, DurationMinutes = 30 },
                new Service { Id = 5, Name = "Peinado Elaborado / Eventos", Price = 1200, DurationMinutes = 90 },
                new Service { Id = 6, Name = "Tinte Completo", Price = 2500, DurationMinutes = 120 },
                new Service { Id = 7, Name = "Retoque de Raíces", Price = 1200, DurationMinutes = 60 },
                new Service { Id = 8, Name = "Highlights / Rayitos", Price = 3000, DurationMinutes = 180 },
                new Service { Id = 9, Name = "Balayage", Price = 4500, DurationMinutes = 240 },
                new Service { Id = 10, Name = "Aplicación de Keratina", Price = 3500, DurationMinutes = 180 },
                new Service { Id = 11, Name = "Cirugía Capilar / Botox", Price = 3000, DurationMinutes = 120 },
                new Service { Id = 12, Name = "Tratamiento Profundo (Mascarilla)", Price = 600, DurationMinutes = 45 },
                new Service { Id = 13, Name = "Manicura Regular", Price = 400, DurationMinutes = 45 },
                new Service { Id = 14, Name = "Pedicura Regular", Price = 600, DurationMinutes = 60 },
                new Service { Id = 15, Name = "Uñas Acrílicas", Price = 1500, DurationMinutes = 120 },
                new Service { Id = 16, Name = "Relleno de Acrílico", Price = 900, DurationMinutes = 90 },
                new Service { Id = 17, Name = "Esmaltado en Gel", Price = 700, DurationMinutes = 60 },
                new Service { Id = 18, Name = "Retiro de Acrílico / Gel", Price = 300, DurationMinutes = 30 },
                new Service { Id = 19, Name = "Diseño y Depilación de Cejas", Price = 300, DurationMinutes = 20 },
                new Service { Id = 20, Name = "Tintado de Cejas", Price = 400, DurationMinutes = 30 },
                new Service { Id = 21, Name = "Depilación Facial (Cera)", Price = 500, DurationMinutes = 30 },
                new Service { Id = 22, Name = "Postura de Pestañas (Pelo a Pelo)", Price = 1800, DurationMinutes = 120 },
                new Service { Id = 23, Name = "Maquillaje Profesional", Price = 2500, DurationMinutes = 90 }
            );

            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "María Pérez", Phone = "809-555-0101", Email = "maria@correo.com" },
                new Customer { Id = 2, Name = "Juan Rodríguez", Phone = "809-555-0202", Email = "juan@correo.com" }
            );

            modelBuilder.Entity<Stylist>().HasData(
                new Stylist { Id = 1, Name = "Ana (Especialista en Uñas)", IsActive = true },
                new Stylist { Id = 2, Name = "Carmen (Colorista y Peluquera)", IsActive = true },
                new Stylist { Id = 3, Name = "Luis (Barbero)", IsActive = true }
            );
        }
    }
}