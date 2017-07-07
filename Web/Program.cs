using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
			var builderByEnvironment = !IsLocal.Value
				? new WebHostBuilder()
					.UseKestrel(options => options.UseHttps("coinjob.net_private_key.pfx", Constants.EmailPassword))
					.UseUrls("http://+:5000", "https://+:5001") 
				: new WebHostBuilder().UseKestrel();

			var host = builderByEnvironment
				.UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }

		public static Lazy<bool> IsLocal = new Lazy<bool>(() => string.Equals(Environment.MachineName, "RYAN-PC", StringComparison.OrdinalIgnoreCase));
    }
}
