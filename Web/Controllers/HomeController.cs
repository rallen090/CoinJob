using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Web.Logic;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
	    private readonly IHostingEnvironment _env;
	    private readonly SubscriberManager _subscriberManager;
	    private readonly IpLogger _ipLogger;

		public HomeController(IHostingEnvironment env, SubscriberManager subscriberManager, IpLogger ipLogger)
	    {
		    this._env = env;
		    this._subscriberManager = subscriberManager;
		    this._ipLogger = ipLogger;
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

	    [HttpPost, Route("log/ip")]
	    public IActionResult Subscribe([FromBody] IpLogModel ipLog)
	    {
		    this._ipLogger.Log(ipLog);

			return Json(new SubscriptionResponse { Success = true, Message = "Logged!" });
	    }

		[HttpGet, Route("health/status")]
	    public IActionResult Status()
	    {
		    return Json(new { success = "true", environment = this._env.EnvironmentName, isLocal = Program.IsLocal.Value });
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

	public class IpLogModel
	{
		public string Ip { get; set; }
		public string CountryCode { get; set; }
		public string City { get; set; }
		public decimal? Latitude { get; set; }
		public decimal? Longitude { get; set; }
	}
}
