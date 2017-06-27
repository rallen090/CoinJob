using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Web.Logic
{
    public class Emailer
    {
	    public async Task SendEmailAsync(string email, string subject, string message)
	    {
		    var emailMessage = new MimeMessage();

		    emailMessage.From.Add(new MailboxAddress("CoinJob", "coinjob@coinjob.net"));
		    emailMessage.To.Add(new MailboxAddress("", email));
		    emailMessage.Subject = subject;
		    emailMessage.Body = new TextPart("plain") { Text = message };

		    using (var client = new SmtpClient())
		    {
			    await client.ConnectAsync("smtp.1and1.com", 587, SecureSocketOptions.StartTls).ConfigureAwait(false);
				await client.SendAsync(emailMessage).ConfigureAwait(false);
			    await client.DisconnectAsync(true).ConfigureAwait(false);
		    }
	    }
	}
}
