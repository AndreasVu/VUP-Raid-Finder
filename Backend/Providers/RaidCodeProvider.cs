using Microsoft.AspNetCore.SignalR;
using Vu.RaidFinder.Backend.Interfaces;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Services;

namespace Vu.RaidFinder.Backend.Providers;

public class RaidCodeProvider
{
    private readonly ConnectionList _connectionList;
    private readonly IHubContext<RaidCodeHub, IRaidCodeClient> _hubContext;

    public RaidCodeProvider(
        ConnectionList connectionList,
        IHubContext<RaidCodeHub, IRaidCodeClient> hubContext)
    {
        _connectionList = connectionList;
        _hubContext = hubContext;
    }

    public void AddRaidCode(RaidCode newCode)
    {
        foreach (var (connectionId, raids) in _connectionList.ConnectionIds)
        {
            if (raids.Any(c => c.Id == newCode.RaidId))
            {
                _hubContext.Clients.Client(connectionId).ReceiveRaidCode(newCode);
            }
        }
    }
}
