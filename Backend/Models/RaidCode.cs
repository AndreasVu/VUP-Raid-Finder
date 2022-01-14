namespace Vu.RaidFinder.Backend.Models;

public class RaidCode {
    public int RaidId { get; set; }

    public string Code { get; set; }

    public DateTimeOffset TweetTime { get; set; }
}