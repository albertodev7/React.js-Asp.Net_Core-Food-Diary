using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using FoodDiary.API;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace FoodDiary.IntegrationTests.Fakes;

public class FakeAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public FakeAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock) : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(Constants.ClaimTypes.Email, "test@example.com")
        };
        
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        
        var properties = new AuthenticationProperties(new Dictionary<string, string?>
        {
            [".Token.access_token"] = "test_google_access_token"
        });
        
        var ticket = new AuthenticationTicket(principal, properties, "Test");
        var result = AuthenticateResult.Success(ticket);

        return Task.FromResult(result);
    }
}