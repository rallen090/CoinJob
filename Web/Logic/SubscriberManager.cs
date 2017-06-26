using System;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers;
using Web.Data;

namespace Web.Logic
{
    public class SubscriberManager
    {
	    private readonly WebDataContext _context;

	    public SubscriberManager(WebDataContext context)
	    {
		    this._context = context;
	    }

	    public bool TrySubscribe(SubscriberModel subscriber, out string errorMessage)
	    {
		    try
		    {
			    if (!this.IsValidSubscriber(subscriber))
			    {
				    errorMessage = "Invalid subscriber. Please populate the required subscriber information.";
				    return false;
			    }

			    var existingSubscriber = this._context.Subscribers.FirstOrDefault(s => s.EmailAddress == subscriber.EmailAddress);
			    if (existingSubscriber != null)
			    {
				    errorMessage = $"Email '{subscriber.EmailAddress}' already is subscribed!";
				    return false;
			    }

			    var result = this._context.Add(new Subscriber
			    {
				    EmailAddress = subscriber.EmailAddress,
				    FirstName = subscriber.FirstName,
				    LastName = subscriber.LastName,
				    CountryCode = subscriber.CountryCode,
				    City = subscriber.City,
				    Ip = subscriber.Ip,
				    Latitude = subscriber.Latitude,
				    Longitude = subscriber.Longitude,
				    DateCreated = DateTimeOffset.Now,
				    Unsubscribed = false
			    });

			    this._context.SaveChanges();
			    errorMessage = null;
			    return true;
		    }
		    catch (Exception)
		    {
			    errorMessage = "Unknown error occurred subscribing. Please try again.";
			    return false;
		    }
	    }

	    public async Task<bool> UnsubscribeAsync(string emailAddress)
	    {
		    var existingSubscriber = this._context.Subscribers.FirstOrDefault(s => s.EmailAddress == emailAddress);
		    var alreadyUnsubscribedOrNonExistent = existingSubscriber?.Unsubscribed ?? true;

		    if (!alreadyUnsubscribedOrNonExistent)
		    {
			    existingSubscriber.Unsubscribed = true;
			    await this._context.SaveChangesAsync().ConfigureAwait(false);
		    }

		    return !alreadyUnsubscribedOrNonExistent;
	    }

	    private bool IsValidSubscriber(SubscriberModel subscriber)
	    {
		    if (string.IsNullOrWhiteSpace(subscriber.EmailAddress)
		        || string.IsNullOrWhiteSpace(subscriber.FirstName)
		        || string.IsNullOrWhiteSpace(subscriber.LastName))
		    {
			    return false;
		    }
		    return true;
	    }
	}
}
