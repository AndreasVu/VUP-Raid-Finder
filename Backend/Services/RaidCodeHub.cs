using Microsoft.AspNetCore.SignalR;
using Vu.RaidFinder.Backend.Interfaces;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Utilities;

namespace Vu.RaidFinder.Backend.Services;

public class RaidCodeHub : Hub<IRaidCodeClient>
{
    private readonly IDictionary<string, IList<Raid>> _raidFilterDict;
    private readonly IList<Raid> _raids;
    private readonly ILogger<RaidCodeHub> _logger;

    public RaidCodeHub(ConnectionList connectionList, ILogger<RaidCodeHub> logger)
    {
        _raidFilterDict = connectionList.ConnectionIds;
        _raids = Utils.GetRaids();
        _logger = logger;
    }

    public void Subscribe(int id)
    {
        var raid = _raids.SingleOrDefault(r => r.Id == id);
        if (raid is not null)
        {
            _logger.LogInformation("Subscribing to raid (id: {raidId}, name: {englishName}) from {connectionId}", id, raid.EnglishName, Context.ConnectionId);
            _raidFilterDict[Context.ConnectionId].Add(raid);
        }
    }

    public void Unsubscribe(int id)
    {
        _logger.LogInformation("Unsubscribing from raid {raidId} from {connectionId}", id, Context.ConnectionId);
        var listOfRaids = _raidFilterDict[Context.ConnectionId];
        _raidFilterDict[Context.ConnectionId] = listOfRaids.Where(r => r.Id != id).ToList();
    }

    public IList<Raid> GetAvailableRaids()
    {
        _logger.LogInformation("GetAvailableRaids called by {connectionId}", Context.ConnectionId);
        var raids = Utils.GetRaids();
        return raids;
    }

    public override Task OnConnectedAsync()
    {
        _logger.LogInformation("OnConnectedAsync called by {connectionId}", Context.ConnectionId);
        _raidFilterDict.Add(Context.ConnectionId, new List<Raid>());
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("OnDisconnectedAsync called by {connectionId}", Context.ConnectionId);
        _raidFilterDict.Remove(Context.ConnectionId);
        return Task.CompletedTask;
    }
}