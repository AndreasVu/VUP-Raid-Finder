using Newtonsoft.Json;
using Vu.RaidFinder.Backend.Configuration;
using Vu.RaidFinder.Backend.Models;

namespace Vu.RaidFinder.Backend.Utilities;

public static class Utils
{
    public static string ExtractRaidCode(string text)
    {
        return text.Split(":").First().Split(" ")[^2].Trim();
    }

    public static IList<Raid> GetRaids()
    {
        var fileContent = File.ReadAllText(Environment.CurrentDirectory + "/StaticFiles/raids.json");

        return JsonConvert.DeserializeObject<IList<Raid>>(fileContent);
    }

    public static string GetProtoFile()
    {
        return File.ReadAllText(Environment.CurrentDirectory + "/Protos/raid.proto");
    }

    public static WebSocketOptions GetWebSocketOptions (IConfiguration config)
    {
        var options = new WebSocketOptions();

        var settings = config.GetSection(WebSocketSettings.Position).Get<WebSocketSettings>();
        if (settings.AllowedOrigins is null)
            throw new ArgumentException(nameof(WebSocketOptions));
        
        foreach (var origin in settings.AllowedOrigins.Split(';'))
        {
            options.AllowedOrigins.Add(origin);
        }

        return options;
    }
}