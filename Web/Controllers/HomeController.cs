using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
	    private IHostingEnvironment _env;
	    public HomeController(IHostingEnvironment env)
	    {
		    _env = env;
	    }

		public IActionResult Index()
        {
            return View();
        }

		[HttpGet, Route("whitepaper")]
	    public IActionResult WhitePaper()
		{
			const string fileName = "CoinJobWhitePaper.pdf";
			var path = Path.Combine(this._env.ContentRootPath, "Content", fileName);

			HttpContext.Response.ContentType = "application/pdf";
			FileContentResult result = new FileContentResult(System.IO.File.ReadAllBytes(path), "application/pdf")
			{
				FileDownloadName = $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.Now:yyyy-MM-dd}.pdf"
			};
			return result;
		}

		public IActionResult Error()
        {
            return View();
        }
    }
}
