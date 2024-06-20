using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class MuzikPlazaContext : DbContext
    {
        public MuzikPlazaContext(DbContextOptions<MuzikPlazaContext> options) : base(options)
        {

        }

        public DbSet<Artist> Artists { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Format> Formats { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductGenre> ProductGenres { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<ProfilePicture> ProfilePictures {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProductGenre>()
                .HasKey(pg => new { pg.ProductID, pg.GenreID });

            modelBuilder.Entity<ProductGenre>()
                .HasOne(pg => pg.Product)
                .WithMany(p => p.ProductGenres)
                .HasForeignKey(pg => pg.ProductID);

            modelBuilder.Entity<ProductGenre>()
                .HasOne(pg => pg.Genre)
                .WithMany(g => g.ProductGenres)
                .HasForeignKey(pg => pg.GenreID);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Artist)
                .WithMany(a => a.Products)
                .HasForeignKey(p => p.ArtistID);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Format)
                .WithMany(f => f.Products)
                .HasForeignKey(p => p.FormatID);

            modelBuilder.Entity<Image>()
                .HasOne(i => i.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(i => i.ProductID);

            modelBuilder.Entity<Format>()
                .ToTable("_Format");

            modelBuilder.Entity<User>()
                .HasOne(u => u.ProfilePicture)
                .WithOne(p => p.User)
                .HasForeignKey<ProfilePicture>(p => p.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany()
                .HasForeignKey(u => u.RoleID);
        }
    }
}
