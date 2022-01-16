using Newtonsoft.Json;
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
}