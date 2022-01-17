using Newtonsoft.Json;
using Tweetinvi;
using Tweetinvi.Events;
using Tweetinvi.Models;
using Tweetinvi.Streaming;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Providers;
using Vu.RaidFinder.Backend.Utilities;

namespace Vu.RaidFinder.Backend.Services;

public class TwitterService : IHostedService
{
    private readonly IFilteredStream _stream;
    private readonly RaidCodeProvider _repository;
    private readonly ILogger<TwitterService> _logger;
    private readonly IList<Raid> _raids;

    public TwitterService(ITwitterClient twitterClient, RaidCodeProvider repository, ILogger<TwitterService> logger)
    {
        _repository = repository;
        _logger = logger;

        _stream = twitterClient.Streams.CreateFilteredStream();
        _raids = Utils.GetRaids();
        AddTracks(_raids);

        _stream.MatchingTweetReceived += HandleCodes;
    }
    
    public void HandleCodes(object? sender, MatchedTweetReceivedEventArgs eventReceived)
    {
        try
        {
            var raidCode = ParseTweetToRaidCode(eventReceived.Tweet);
            _repository.AddRaidCode(raidCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not parse tweet: {tweet}", eventReceived.Tweet.Text);
        }
    }

    private RaidCode ParseTweetToRaidCode(ITweet tweet)
    {
        var raidName = tweet.Text.Split("\n")[^2];
        var raidId = GetRaidId(raidName);
        var raidCode = Utils.ExtractRaidCode(tweet.Text);

        return new RaidCode
        {
            Code = raidCode,
            RaidId = raidId,
            TweetTime = tweet.CreatedAt,
        };
    }

    private int GetRaidId(string raidName)
    {
        var raidId = _raids
            .Where(r => r.EnglishName == raidName || r.JapaneseName == raidName)
            .Select(r => r.Id)
            .SingleOrDefault();

        if (raidId == 0)
            throw new Exception("Could not find raid id");

        return raidId;
    }

    private void AddTracks(IEnumerable<Raid> raids)
    {
        foreach (var raid in raids)
        {
            _stream.AddTrack(raid.EnglishName);
            _stream.AddTrack(raid.JapaneseName);
        }
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting {service}", nameof(TwitterService));
        _stream.StartMatchingAnyConditionAsync();

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Stopping {service}", nameof(TwitterService));
        _stream.Stop();
        
        return Task.CompletedTask;
    }
}