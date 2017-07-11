using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Web.Data;
using Web.Logic;

namespace Web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
	        // needed to load configuration from appsettings.json
	        services.AddOptions();

	        // needed to store rate limit counters and ip rules
	        services.AddMemoryCache();

	        //load general configuration from appsettings.json
	        services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));

	        //load ip rules from appsettings.json
	        services.Configure<IpRateLimitPolicies>(Configuration.GetSection("IpRateLimitPolicies"));

	        // inject counter and rules stores
	        services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
	        services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();

			// Add framework services.
			services.AddMvc();

	        if (!Program.IsLocal.Value)
	        {
		        services.Configure<MvcOptions>(options =>
		        {
			        options.Filters.Add(new RequireHttpsAttribute());
		        });
			}

			services.AddDbContext<WebDataContext>(options =>
		        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

	        services.Configure<AppConfig>(Configuration);

			services.AddTransient<SubscriberManager, SubscriberManager>();
	        services.AddTransient<Emailer, Emailer>();
	        services.AddTransient<IpLogger, IpLogger>();
		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
			}
            else
            {
                app.UseExceptionHandler("/Home/Error");
			}

	        if (!Program.IsLocal.Value)
	        {
				// force SSL
		        var options = new RewriteOptions()
			        .AddRedirectToHttps();
		        app.UseRewriter(options);
			}

			// enable rate limiting
	        app.UseIpRateLimiting();

			app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
		}
    }

	public class AppConfig
	{
		public string EmailUsername { get; set; }
		public string EmailPassword { get; set; }
	}
}
