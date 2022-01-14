using Vu.RaidFinder.Backend.Models;

namespace Vu.RaidFinder.Backend.Interfaces;

public interface IRaidCodeClient
{
    Task ReceiveRaidCode(RaidCode raidCode);
}