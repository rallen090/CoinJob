using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web.Logic;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
	    private readonly IHostingEnvironment _env;
	    private readonly SubscriberManager _subscriberManager;

	    public HomeController(IHostingEnvironment env, SubscriberManager subscriberManager)
	    {
		    this._env = env;
		    this._subscriberManager = subscriberManager;
	    }

		public IActionResult Index()
        {
            return View();
        }

		[HttpGet, Route("whitepaper")]
	    public IActionResult WhitePaper()
		{
			const string fileName = "CoinJobWhitePaper.pdf";
			var filePath = Directory.GetFiles(Path.Combine(this._env.ContentRootPath, "Content"), searchPattern: fileName).FirstOrDefault();

			HttpContext.Response.ContentType = "application/pdf";
			FileContentResult result = new FileContentResult(System.IO.File.ReadAllBytes(filePath), "application/pdf")
			{
				FileDownloadName = $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.Now:yyyy-MM-dd}.pdf"
			};
			return result;
		}

	    [HttpGet, Route("pressrelease")]
	    public IActionResult PressRelease()
	    {
		    const string fileName = "CoinJobPressRelease.pdf";
		    var filePath = Directory.GetFiles(Path.Combine(this._env.ContentRootPath, "Content"), searchPattern: fileName).FirstOrDefault();

		    HttpContext.Response.ContentType = "application/pdf";
		    FileContentResult result = new FileContentResult(System.IO.File.ReadAllBytes(filePath), "application/pdf")
		    {
			    FileDownloadName = $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.Now:yyyy-MM-dd}.pdf"
		    };
		    return result;
	    }

		[HttpPost, Route("subscribe")]
	    public IActionResult Subscribe([FromBody] SubscriberModel subscriber)
		{
			string errorMessage;
			if (!this._subscriberManager.TrySubscribe(subscriber, out errorMessage))
			{
				return Json(new SubscriptionResponse { Success = false, Message = errorMessage });
			}

		    return Json(new SubscriptionResponse { Success = true, Message = $"{subscriber.EmailAddress} successfully subscribed!"});
	    }

		public IActionResult Error()
        {
            return View();
        }
    }

	public class SubscriberModel
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string EmailAddress { get; set; }
		public string Ip { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public decimal? Latitude { get; set; }
		public decimal? Longitude { get; set; }
	}

	public class SubscriptionResponse
	{
		public bool Success { get; set; }
		public string Message { get; set; }
	}
}
