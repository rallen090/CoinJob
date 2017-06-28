using System;
using System.ComponentModel.DataAnnotations;

namespace Web.Data
{
    public class IpLog
    {
		[Key]
	    public string Ip { get; set; }
	    public string CountryCode { get; set; }
	    public string City { get; set; }
	    public decimal? Latitude { get; set; }
	    public decimal? Longitude { get; set; }

		public int Visits { get; set; }
	    public DateTimeOffset DateInitial { get; set; }
	    public DateTimeOffset DateLatest { get; set; }
	}
}
