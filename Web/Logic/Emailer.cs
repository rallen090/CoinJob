using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Web.Logic
{
    public class Emailer
    {
	    private readonly IOptions<AppConfig> _appConfig;

	    public Emailer(IOptions<AppConfig> appConfig)
	    {
		    this._appConfig = appConfig;
		}

		public async Task SendEmailAsync(string email, string subject, string message)
	    {
		    var emailMessage = new MimeMessage();

		    emailMessage.From.Add(new MailboxAddress("CoinJob", this._appConfig.Value.EmailUsername));
		    emailMessage.To.Add(new MailboxAddress("", email));
		    emailMessage.Subject = subject;
		    emailMessage.Body = new TextPart("plain") { Text = message };

		    using (var client = new SmtpClient())
		    {
			    await client.ConnectAsync("smtp.1and1.com", 587, SecureSocketOptions.StartTls).ConfigureAwait(false);
			    client.Authenticate(this._appConfig.Value.EmailUsername, this._appConfig.Value.EmailPassword);
				await client.SendAsync(emailMessage).ConfigureAwait(false);
			    await client.DisconnectAsync(true).ConfigureAwait(false);
		    }
	    }
	}
}
