using Microsoft.AspNetCore.SignalR;
using Vu.RaidFinder.Backend.Interfaces;
using Vu.RaidFinder.Backend.Models;
using Vu.RaidFinder.Backend.Services;

namespace Vu.RaidFinder.Backend.Providers;

public class RaidCodeProvider
{
    private readonly ConnectionList _connectionList;
    private readonly IHubContext<RaidCodeHub, IRaidCodeClient> _hubContext;
    private readonly ILogger<RaidCodeProvider> _logger;

    public RaidCodeProvider(
        ConnectionList connectionList,
        IHubContext<RaidCodeHub, IRaidCodeClient> hubContext,
        ILogger<RaidCodeProvider> logger)
    {
        _connectionList = connectionList;
        _hubContext = hubContext;
        _logger = logger;
    }

    public void AddRaidCode(RaidCode newCode)
    {
        foreach (var (connectionId, raids) in _connectionList.ConnectionIds)
        {
            if (raids.Any(c => c.Id == newCode.RaidId))
            {
                _logger.LogInformation("Sending raid code {code} to {connectionId}", newCode.Code, connectionId);
                _hubContext.Clients.Client(connectionId).ReceiveRaidCode(newCode);
            }
        }
    }
}
