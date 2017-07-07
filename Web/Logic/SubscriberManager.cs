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
	    private readonly Emailer _emailer;

		public SubscriberManager(WebDataContext context, Emailer emailer)
	    {
		    this._context = context;
		    this._emailer = emailer;
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

			    this._context.Add(new Subscriber
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

				this.SendConfirmationEmail(subscriber.FirstName, subscriber.EmailAddress);

				return true;
		    }
		    catch (Exception ex)
		    {
			    this._emailer.SendEmailAsync(Constants.Email, "CoinJob - Web Error", ex.ToString()).Wait();
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

	    private void SendConfirmationEmail(string firstName, string emailAddress)
	    {
			// fire and forget email
		    var icoMessage = DateTimeOffset.Now >= Constants.IcoDeadline
			    ? $"The ICO start date ({Constants.IcoDeadline.ToUniversalTime()} UTC) has been reached! If still ongoing, you can find the CoinJob contract address for purchasing Jobis on the website."
			    : $"The ICO officially begins {Constants.IcoDeadline.ToUniversalTime()} UTC. If you've subscribed more than a day in advance, you can expect an email as we get closer to the ICO with details on how to purchase Jobis in the pre-sale.";
		    Task.Run(() => this._emailer.SendEmailAsync(emailAddress,
			    "CoinJob Subscription Confirmation",
			    $"Hey {firstName},\n\nThank you for subscribing to updates regarding CoinJob! Stay tuned for more information regarding the ICO and platform.\n\n{icoMessage}\n\n- CoinJob Team"));
		}
	}
}
