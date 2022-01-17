using Tweetinvi;
using Vu.RaidFinder.Backend.Configuration;
using Vu.RaidFinder.Backend.Providers;
using Vu.RaidFinder.Backend.Services;

namespace Vu.RaidFinder.Backend.Utilities;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRaidServerServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddSingleton<RaidCodeProvider>();

        var twitterSettings = config.GetSection(TwitterSettings.FieldName).Get<TwitterSettings>();
        if (!twitterSettings.HasValues())
            throw new ArgumentNullException(nameof(twitterSettings));

        services.AddSingleton<ITwitterClient>(_ => new TwitterClient(twitterSettings.ConsumerKey, twitterSettings.ConsumerSecret, twitterSettings.AccessToken, twitterSettings.AccessTokenSecret));
        services.AddHostedService<TwitterService>();

        services.AddSingleton<ConnectionList>();

        return services;
    }

    private static bool HasValues(this TwitterSettings settings)
    {
        return !string.IsNullOrWhiteSpace(settings.ConsumerKey) &&
               !string.IsNullOrWhiteSpace(settings.ConsumerSecret) &&
               !string.IsNullOrWhiteSpace(settings.AccessToken) &&
               !string.IsNullOrWhiteSpace(settings.AccessTokenSecret);
    }
}