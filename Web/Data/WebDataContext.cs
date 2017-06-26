using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Web.Data
{
	public class WebDataContext : DbContext
	{
		public WebDataContext(DbContextOptions<WebDataContext> options) : base(options)
		{
		}

		public DbSet<Subscriber> Courses { get; set; }
		public DbSet<IpLog> Enrollments { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Subscriber>().ToTable("subscribers", schema: "coinjob");
			modelBuilder.Entity<IpLog>().ToTable("ipLogs", schema: "coinjob");
		}
	}
}
