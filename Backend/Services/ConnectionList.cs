using System.Collections.Concurrent;
using Vu.RaidFinder.Backend.Models;

namespace Vu.RaidFinder.Backend.Services;

public class ConnectionList
{
    public ConnectionList()
    {
        ConnectionIds = new ConcurrentDictionary<string, IList<Raid>>();
    }

    public IDictionary<string, IList<Raid>> ConnectionIds { get; }
}