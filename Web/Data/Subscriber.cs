using System;
using System.ComponentModel.DataAnnotations;

namespace Web.Data
{
    public class Subscriber
    {
	    [Key]
	    public string EmailAddress { get; set; }
		public string FirstName { get; set; }
	    public string LastName { get; set; }
	    public string Ip { get; set; }
	    public string CountryCode { get; set; }
	    public string City { get; set; }
	    public double? Latitude { get; set; }
	    public double? Longitude { get; set; }

		public DateTimeOffset DateCreated { get; set; }
		public bool Unsubscribed { get; set; }
	}
}
