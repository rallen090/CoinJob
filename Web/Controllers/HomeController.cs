using System;
using System.IO;
using System.Linq;
using AspNetCoreRateLimit;
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
	    private readonly IRateLimitCounterStore _rateLimiter;

		public HomeController(IHostingEnvironment env, SubscriberManager subscriberManager, IpLogger ipLogger, IRateLimitCounterStore rateLimiter)
	    {
		    this._env = env;
		    this._subscriberManager = subscriberManager;
		    this._ipLogger = ipLogger;
		    this._rateLimiter = rateLimiter;
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
			var ip = this.Request.HttpContext.Connection.RemoteIpAddress.ToString();
			return Json(new {
				success = "true",
				environment = this._env.EnvironmentName,
				isLocal = Program.IsLocal.Value,
				ip,
				hasEntry = this._rateLimiter.Exists(ip) });
	    }

		[HttpPost, Route("verify/contract/crowdsale")]
	    public IActionResult Verify([FromBody] VerifyInput input)
	    {
		    var verified = input.Address == Constants.CoinJobCrowdSaleAddress;
		    return Json(new VerifyResponse{ Verified = verified, Message = verified 
				? $"VERIFIED! You have entered the official CoinJob Crowdsale Ether contract address: '{input.Address}'"
				: $"INVALID! the following address is not the official CoinJob Crowdsale Ether contract address: '{input.Address}'"});
	    }

		[HttpGet, Route("contracts")]
	    public IActionResult Contracts()
	    {
			//if (DateTime.Now < Constants.IcoStartDate)
			//{
			//	return null;
			//}

			return Json(new CoinJobAddresses
		    {
			    TokenAddress = Constants.JobiAddress,
				CrowdSaleAddress = Constants.CoinJobCrowdSaleAddress
		    });
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

	public class VerifyInput
	{
		public string Address { get; set; }
	}

	public class VerifyResponse
	{
		public bool Verified { get; set; }
		public string Message { get; set; }
	}

	public class CoinJobAddresses
	{
		public string TokenAddress { get; set; }
		public string CrowdSaleAddress { get; set; }
	}
}
