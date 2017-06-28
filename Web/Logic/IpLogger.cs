using System;
using System.Linq;
using Web.Controllers;
using Web.Data;

namespace Web.Logic
{
    public class IpLogger
    {
	    private readonly WebDataContext _context;
	    private readonly Emailer _emailer;

		public IpLogger(WebDataContext context, Emailer emailer)
	    {
		    this._context = context;
		    this._emailer = emailer;
	    }

	    public void Log(IpLogModel log)
	    {
		    try
		    {
				if (!this.IsValidLog(log))
			    {
				    return;
			    }

			    var existingLog = this._context.IpLogs.FirstOrDefault(s => s.Ip == log.Ip);
			    if (existingLog != null)
			    {
				    existingLog.DateLatest = DateTimeOffset.Now;
				    existingLog.Visits++;
			    }
			    else
			    {
					this._context.Add(new IpLog
					{
						CountryCode = log.CountryCode,
						City = log.City,
						Ip = log.Ip,
						Latitude = log.Latitude,
						Longitude = log.Longitude,
						DateInitial = DateTimeOffset.Now,
						DateLatest = DateTimeOffset.Now,
						Visits = 1
					});
				}
			    
			    this._context.SaveChanges();
		    }
		    catch (Exception ex)
		    {
			    this._emailer.SendEmailAsync("rallen090@gmail.com", "CoinJob - Web Error - IpLog", ex.ToString()).Wait();
		    }
	    }

	    private bool IsValidLog(IpLogModel log)
	    {
		    if (string.IsNullOrWhiteSpace(log.Ip))
		    {
			    return false;
		    }
		    return true;
	    }
	}
}
