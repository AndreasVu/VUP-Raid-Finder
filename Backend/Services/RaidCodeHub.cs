using Microsoft.AspNetCore.SignalR;
using Vu.RaidFinder.Backend.Interfaces;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Utilities;

namespace Vu.RaidFinder.Backend.Services;

public class RaidCodeHub : Hub<IRaidCodeClient>
{
    private readonly IDictionary<string, IList<Raid>> _raidFilterDict;
    private readonly IList<Raid> _raids;

    public RaidCodeHub(ConnectionList connectionList)
    {
        _raidFilterDict = connectionList.ConnectionIds;
        _raids = Utils.GetRaids();
    }

    public void Subscribe(int id)
    {
        var raid = _raids.SingleOrDefault(r => r.Id == id);
        if (raid is not null)
        {
            _raidFilterDict[Context.ConnectionId].Add(raid);
        }
    }

    public void Unsubscribe(int id)
    {
        var listOfRaids = _raidFilterDict[Context.ConnectionId];
        _raidFilterDict[Context.ConnectionId] = listOfRaids.Where(r => r.Id != id).ToList();
    }

    public IList<Raid> GetAvailableRaids()
    {
        var raids = Utils.GetRaids();
        return raids;
    }

    public override Task OnConnectedAsync()
    {
        _raidFilterDict.Add(Context.ConnectionId, new List<Raid>());
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        _raidFilterDict.Remove(Context.ConnectionId);
        return Task.CompletedTask;
    }
}